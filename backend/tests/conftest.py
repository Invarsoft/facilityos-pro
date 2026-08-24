"""Async test fixtures: in-memory SQLite + dependency override."""
import asyncio
from typing import AsyncGenerator

import pytest
import pytest_asyncio
from asgi_lifespan import LifespanManager
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.session import get_db
from app.main import create_app
import app.models  # noqa: F401


@pytest_asyncio.fixture
async def session_factory(db_engine):
    return async_sessionmaker(db_engine, expire_on_commit=False)


@pytest_asyncio.fixture
async def db_engine():
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture
async def client(session_factory) -> AsyncGenerator[AsyncClient, None]:
    app = create_app()

    async def _override_get_db():
        async with session_factory() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise

    app.dependency_overrides[get_db] = _override_get_db

    async with LifespanManager(app):
        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as ac:
            yield ac


@pytest_asyncio.fixture
async def org_users(session_factory):
    """Seed one org with a requester, manager and two workers."""
    from app.core.security import hash_password
    from app.models.asset import SLARule
    from app.models.organization import Organization
    from app.models.user import User

    async with session_factory() as s:
        org = Organization(name="Test University", vertical="university")
        s.add(org)
        await s.flush()

        def mk(email, name, role, skills=None):
            return User(
                email=email,
                hashed_password=hash_password("Password@123"),
                full_name=name,
                role=role.value if hasattr(role, "value") else role,
                org_id=org.id,
                skills=skills or [],
            )

        requester = mk("req@test.edu", "Requester One", "requester")
        manager = mk("mgr@test.edu", "Manager One", "manager")
        admin = mk("admin@test.edu", "Admin One", "admin")
        w1 = mk("w1@test.edu", "Plumber Pro", "worker", ["plumbing"])
        w2 = mk("w2@test.edu", "Sparky Volt", "worker", ["electrical"])
        super_admin = User(
            email="superadmin@facilityos.pro",
            hashed_password=hash_password("Super@123"),
            full_name="Platform Super Admin",
            role="super_admin",
            org_id=None,
        )
        for u in (requester, manager, admin, w1, w2, super_admin):
            s.add(u)
        for prio, rh, sh in [("emergency", 0.5, 2.0), ("high", 1.0, 8.0),
                             ("medium", 4.0, 24.0), ("low", 8.0, 72.0)]:
            s.add(SLARule(org_id=org.id, category="plumbing", priority=prio,
                          response_hours=rh, resolution_hours=sh))
        await s.commit()
        return {
            "org_id": org.id,
            "requester": {"email": requester.email, "password": "Password@123"},
            "manager": {"email": manager.email, "password": "Password@123"},
            "admin": {"email": admin.email, "password": "Password@123"},
            "worker": {"email": w1.email, "password": "Password@123"},
        }


async def auth_header(client: AsyncClient, email: str, password: str) -> dict:
    resp = await client.post(
        "/api/v1/auth/login", json={"email": email, "password": password}
    )
    assert resp.status_code == 200, resp.text
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
