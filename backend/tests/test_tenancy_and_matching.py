"""Multi-tenant isolation + Facos Match recommendations."""
import pytest
from tests.conftest import auth_header
from app.services.matching import WorkerMatcher

pytestmark = pytest.mark.asyncio


async def test_cross_tenant_ticket_access_denied(client, org_users):
    """A requester from org A cannot read org B tickets even with a valid JWT."""
    headers = await auth_header(client, **org_users["requester"])
    other_org = "0000000000000000000000000000dead"
    resp = await client.get(f"/api/v1/tickets/{other_org}", headers=headers)
    assert resp.status_code == 404  # never leaks existence


async def test_worker_cannot_pass_foreign_org_id(client, org_users):
    headers = await auth_header(client, **org_users["worker"])
    foreign_org = "00000000000000000000000000beef00"
    resp = await client.get(f"/api/v1/tickets?org_id={foreign_org}", headers=headers)
    assert resp.status_code == 403


async def test_recommend_workers_ranks_by_skill(client, org_users):
    org_id = org_users["org_id"]
    manager_h = await auth_header(client, **org_users["manager"])
    resp = await client.get(
        f"/api/v1/tickets/recommend-workers?category=plumbing", headers=manager_h
    )
    assert resp.status_code == 200
    recs = resp.json()
    assert len(recs) >= 1
    assert recs[0]["full_name"] == "Plumber Pro"
    assert recs[0]["match_score"] > recs[-1]["match_score"]


def test_matcher_scores_exact_skill_highest():
    from app.models.user import User

    plumber = User(full_name="P", role="worker", skills=["plumbing"],
                   is_available=True, active_load=0, completed_jobs=30, rating=4.8)
    electrician = User(full_name="E", role="worker", skills=["electrical"],
                       is_available=True, active_load=0, completed_jobs=30, rating=4.8)
    s_plumber, _ = WorkerMatcher.score(plumber, "plumbing")
    s_electrician, _ = WorkerMatcher.score(electrician, "plumbing")
    assert s_plumber > s_electrician


def test_matcher_zero_for_unavailable():
    from app.models.user import User

    w = User(full_name="X", role="worker", skills=["plumbing"], is_available=False)
    score, reasons = WorkerMatcher.score(w, "plumbing")
    assert score == 0.0
