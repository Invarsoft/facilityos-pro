"""Ticket lifecycle state machine + SLA computation."""
import pytest
from tests.conftest import auth_header

pytestmark = pytest.mark.asyncio

TICKETS = "/api/v1/tickets"


async def _create_ticket(client, headers, org_id, **overrides):
    payload = {
        "title": "Leaking pipe in washroom",
        "description": "Water leaking continuously",
        "category": "plumbing",
        "priority": "high",
        "location": "Block A",
        "room": "204",
    }
    payload.update(overrides)
    resp = await client.post(f"{TICKETS}?org_id={org_id}", json=payload, headers=headers)
    assert resp.status_code == 201, resp.text
    return resp.json()


async def test_create_sets_sla_from_rules(client, org_users):
    headers = await auth_header(client, **org_users["requester"])
    ticket = await _create_ticket(client, headers, org_users["org_id"])
    # org has plumbing/high rule: response 1h, resolution 8h
    assert ticket["sla_response_due"] is not None
    assert ticket["sla_resolution_due"] is not None
    assert ticket["status"] == "open"
    assert ticket["ticket_number"].startswith("FOS-")


async def test_full_lifecycle_happy_path(client, org_users, session_factory):
    org_id = org_users["org_id"]
    requester_h = await auth_header(client, **org_users["requester"])
    manager_h = await auth_header(client, **org_users["manager"])
    worker_h = await auth_header(client, **org_users["worker"])

    ticket = await _create_ticket(client, requester_h, org_id)
    tid = ticket["id"]

    workers = await client.get("/api/v1/users/workers", headers=manager_h)
    wid = [w for w in workers.json() if w["skills"] == ["plumbing"]][0]["id"]

    # manager assigns
    resp = await client.post(f"{TICKETS}/{tid}/assign", json={"worker_id": wid}, headers=manager_h)
    assert resp.status_code == 200
    assert resp.json()["status"] == "assigned"

    # worker progresses
    resp = await client.post(
        f"{TICKETS}/{tid}/progress", json={"progress": 50, "note": "pipe replaced"},
        headers=worker_h,
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "in_progress"

    # worker completes → awaiting verification
    resp = await client.post(f"{TICKETS}/{tid}/complete", json={}, headers=worker_h)
    assert resp.status_code == 200
    assert resp.json()["ticket"]["status"] == "awaiting_verification"

    # requester fetches OTP from notifications
    notifs = await client.get("/api/v1/notifications?unread_only=true", headers=requester_h)
    otp_notif = next(n for n in notifs.json() if n["type"] == "verification_ready")
    otp = otp_notif["message"].split()[-1]

    resp = await client.post(
        f"{TICKETS}/{tid}/verify",
        json={"otp_code": otp, "rating": 5, "feedback": "Great job"},
        headers=requester_h,
    )
    assert resp.status_code == 200, f"verify failed: {resp.text}"
    assert resp.json()["status"] == "closed"

    events = await client.get(f"{TICKETS}/{tid}/events", headers=requester_h)
    types = [e["event_type"] for e in events.json()]
    assert types[0] == "created"
    assert "verified" in types


async def test_illegal_transition_rejected(client, org_users):
    """Worker cannot complete a ticket that was never assigned/in-progress."""
    org_id = org_users["org_id"]
    requester_h = await auth_header(client, **org_users["requester"])
    worker_h = await auth_header(client, **org_users["worker"])

    ticket = await _create_ticket(client, requester_h, org_id)
    resp = await client.post(f"{TICKETS}/{ticket['id']}/complete", json={}, headers=worker_h)
    assert resp.status_code == 409


async def test_worker_cannot_see_unassigned_tickets(client, org_users):
    org_id = org_users["org_id"]
    requester_h = await auth_header(client, **org_users["requester"])
    worker_h = await auth_header(client, **org_users["worker"])

    await _create_ticket(client, requester_h, org_id)
    listing = await client.get(TICKETS, headers=worker_h)
    assert listing.status_code == 200
    assert all(t["assignee_id"] is not None for t in listing.json())


async def test_verify_requires_correct_otp(client, org_users):
    org_id = org_users["org_id"]
    requester_h = await auth_header(client, **org_users["requester"])
    manager_h = await auth_header(client, **org_users["manager"])
    worker_h = await auth_header(client, **org_users["worker"])

    tid = (await _create_ticket(client, requester_h, org_id))["id"]
    workers = await client.get("/api/v1/users/workers", headers=manager_h)
    wid = workers.json()[0]["id"]
    await client.post(f"{TICKETS}/{tid}/assign", json={"worker_id": wid}, headers=manager_h)
    await client.post(f"{TICKETS}/{tid}/progress", json={"progress": 100}, headers=worker_h)
    await client.post(f"{TICKETS}/{tid}/complete", json={}, headers=worker_h)

    resp = await client.post(
        f"{TICKETS}/{tid}/verify",
        json={"otp_code": "0000", "rating": 4},
        headers=requester_h,
    )
    assert resp.status_code == 409


async def test_emergency_creates_flagged_ticket(client, org_users):
    org_id = org_users["org_id"]
    requester_h = await auth_header(client, **org_users["requester"])
    resp = await client.post(
        f"{TICKETS}/emergency?org_id={org_id}",
        json={"title": "Gas leak in lab", "category": "plumbing"},
        headers=requester_h,
    )
    assert resp.status_code == 201
    body = resp.json()
    assert body["is_emergency"] is True
    assert body["priority"] == "emergency"
