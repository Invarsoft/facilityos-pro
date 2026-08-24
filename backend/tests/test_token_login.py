"""Authority-issued access token + PIN login (requesters)."""
import pytest
from tests.conftest import auth_header

pytestmark = pytest.mark.asyncio

TOKEN_LOGIN = "/api/v1/auth/token-login"


async def _issue_token(client, org_users, target_email="req2@test.edu"):
    """Admin creates a fresh requester, then issues them a token+PIN."""
    admin_h = await auth_header(client, **org_users["admin"])
    create = await client.post(
        "/api/v1/users",
        json={
            "email": target_email,
            "password": "Password@123",
            "full_name": "Temp Requester",
            "role": "requester",
        },
        headers=admin_h,
    )
    assert create.status_code == 201, create.text
    uid = create.json()["id"]
    resp = await client.post(f"/api/v1/users/{uid}/issue-token", headers=admin_h)
    assert resp.status_code == 200, resp.text
    return resp.json()


async def test_token_login_happy_path(client, org_users):
    cred = await _issue_token(client, org_users)
    resp = await client.post(
        TOKEN_LOGIN, json={"token_no": cred["token_no"], "pin": cred["pin"]}
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert "access_token" in body and "refresh_token" in body

    me = await client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {body['access_token']}"}
    )
    assert me.status_code == 200
    assert me.json()["role"] == "requester"


async def test_token_login_wrong_pin(client, org_users):
    cred = await _issue_token(client, org_users)
    resp = await client.post(
        TOKEN_LOGIN, json={"token_no": cred["token_no"], "pin": "0000"}
    )
    assert resp.status_code == 401


async def test_token_login_unknown_token(client, org_users):
    resp = await client.post(
        TOKEN_LOGIN, json={"token_no": "NOPE-9999-T", "pin": "1234"}
    )
    assert resp.status_code == 401


async def test_staff_cannot_login_via_token(client, org_users):
    """Staff accounts must not be reachable through token login."""
    manager_h = await auth_header(client, **org_users["manager"])
    # try to issue a token to the manager himself → rejected
    users = await client.get("/api/v1/users", headers=manager_h)
    mgr = next(u for u in users.json() if u["role"] == "manager")
    resp = await client.post(f"/api/v1/users/{mgr['id']}/issue-token", headers=manager_h)
    assert resp.status_code == 400


async def test_requester_cannot_issue_tokens(client, org_users):
    headers = await auth_header(client, **org_users["requester"])
    resp = await client.post(
        "/api/v1/users/whatever/issue-token", headers=headers
    )
    assert resp.status_code == 403


async def test_issued_pin_is_hashed_not_stored_plain(client, org_users, session_factory):
    from sqlalchemy import select as sel
    from app.models.user import User as U

    cred = await _issue_token(client, org_users, "req3@test.edu")
    async with session_factory() as s:
        row = (
            await s.execute(sel(U).where(U.access_token_no == cred["token_no"]))
        ).scalar_one()
        assert row.access_pin_hash != cred["pin"]
        assert cred["pin"] not in row.access_pin_hash
