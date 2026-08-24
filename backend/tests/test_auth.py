"""Auth flow + RBAC + tenancy isolation."""
import pytest
from tests.conftest import auth_header

pytestmark = pytest.mark.asyncio


async def test_login_success_and_me(client, org_users):
    headers = await auth_header(client, **org_users["requester"])
    resp = await client.get("/api/v1/auth/me", headers=headers)
    assert resp.status_code == 200
    assert resp.json()["role"] == "requester"


async def test_login_wrong_password(client, org_users):
    resp = await client.post(
        "/api/v1/auth/login",
        json={"email": org_users["requester"]["email"], "password": "wrong-pass"},
    )
    assert resp.status_code == 401


async def test_refresh_rotation_and_replay_rejection(client, org_users):
    login = await client.post(
        "/api/v1/auth/login", json={"email": org_users["requester"]["email"],
                                    "password": org_users["requester"]["password"]}
    )
    refresh_token = login.json()["refresh_token"]

    r1 = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert r1.status_code == 200

    # replaying the same (now rotated) token must fail
    r2 = await client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert r2.status_code == 401


async def test_requester_cannot_list_all_users(client, org_users):
    headers = await auth_header(client, **org_users["requester"])
    resp = await client.get(f"/api/v1/users?org_id={org_users['org_id']}", headers=headers)
    assert resp.status_code == 403


async def test_manager_can_list_org_users(client, org_users):
    headers = await auth_header(client, **org_users["manager"])
    resp = await client.get("/api/v1/users", headers=headers)
    assert resp.status_code == 200
    assert len(resp.json()) >= 4


async def test_worker_cannot_access_admin_only_sla_rules(client, org_users):
    headers = await auth_header(client, **org_users["worker"])
    resp = await client.get("/api/v1/sla-rules", headers=headers)
    assert resp.status_code == 403
