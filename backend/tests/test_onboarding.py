"""Public onboarding requests → super admin approval provisions a real tenant."""
import pytest
from tests.conftest import auth_header

pytestmark = pytest.mark.asyncio

ONBOARDING = "/api/v1/onboarding"


async def _submit(client, name="Apollo Care Hospital", email="admin@apollocare.com"):
    resp = await client.post(
        ONBOARDING,
        json={
            "org_name": name,
            "vertical": "hospital",
            "contact_name": "Facility Director",
            "contact_email": email,
        },
    )
    assert resp.status_code == 201, resp.text
    return resp.json()


async def test_public_submit_no_auth(client):
    body = await _submit(client)
    assert body["status"] == "pending"


async def test_requester_cannot_list_or_approve(client, org_users):
    headers = await auth_header(client, **org_users["requester"])
    assert (await client.get(ONBOARDING, headers=headers)).status_code == 403
    body = await _submit(client)
    resp = await client.post(f"{ONBOARDING}/{body['id']}/approve", headers=headers)
    assert resp.status_code == 403


async def test_full_approval_flow_creates_working_tenant(client, org_users):
    body = await _submit(client)

    super_h = await auth_header(client, "superadmin@facilityos.pro", "Super@123")
    queue = await client.get(ONBOARDING, headers=super_h)
    assert queue.status_code == 200
    assert any(r["id"] == body["id"] for r in queue.json())

    approval = await client.post(f"{ONBOARDING}/{body['id']}/approve", headers=super_h)
    assert approval.status_code == 200, approval.text
    cred = approval.json()
    assert cred["facility_code"].endswith("-2026")
    assert cred["org_name"] == "Apollo Care Hospital"

    # the generated admin can really log in
    login = await client.post(
        "/api/v1/auth/login",
        json={"email": cred["admin_email"], "password": cred["admin_password"]},
    )
    assert login.status_code == 200, login.text
    me = await client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {login.json()['access_token']}"}
    )
    assert me.json()["role"] == "admin"

    # SLA rules were provisioned for the new tenant
    rules = await client.get(
        "/api/v1/sla-rules", headers={"Authorization": f"Bearer {login.json()['access_token']}"}
    )
    assert rules.status_code == 200
    assert len(rules.json()) > 0


async def test_double_approve_rejected(client, org_users):
    body = await _submit(client, name="Double Approve Clinic")
    super_h = await auth_header(client, "superadmin@facilityos.pro", "Super@123")
    first = await client.post(f"{ONBOARDING}/{body['id']}/approve", headers=super_h)
    assert first.status_code == 200
    second = await client.post(f"{ONBOARDING}/{body['id']}/approve", headers=super_h)
    assert second.status_code == 409


async def test_reject_flow(client, org_users):
    body = await _submit(client, name="Reject Me Ltd", email="reject@me.com")
    super_h = await auth_header(client, "superadmin@facilityos.pro", "Super@123")
    resp = await client.post(f"{ONBOARDING}/{body['id']}/reject", headers=super_h)
    assert resp.status_code == 200
    assert resp.json()["status"] == "rejected"


async def test_facility_code_resolution(client, org_users, session_factory):
    """Seed orgs carry codes; by-code resolves publicly; wrong code 404s."""
    from app.models.organization import Organization

    async with session_factory() as s:
        s.add(Organization(name="Coded University", vertical="university", code="CU-2026"))
        await s.commit()

    found = await client.get("/api/v1/organizations/by-code/CU-2026")
    assert found.status_code == 200
    assert found.json()["name"] == "Coded University"

    missing = await client.get("/api/v1/organizations/by-code/NOPE-9999")
    assert missing.status_code == 404
