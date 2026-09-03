import secrets

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import func, select

from app.core.deps import CurrentUser, DB, OrgId, require_roles
from app.core.security import hash_password
from app.models.enums import UserRole
from app.models.organization import Organization
from app.models.user import User
from app.schemas.auth import UserCreate, UserOut, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])

MANAGER_PLUS = require_roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
MANAGER_PLUS = require_roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
ADMIN_ONLY = require_roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)


@router.get("", response_model=list[UserOut], dependencies=[MANAGER_PLUS])
async def list_users(
    db: DB,
    org_id: OrgId,
    role: str | None = Query(None),
    q: str | None = Query(None, max_length=100),
    offset: int = 0,
    limit: int = Query(100, le=200),
):
    stmt = select(User).where(User.org_id == org_id)
    if role:
        stmt = stmt.where(User.role == role)
    if q:
        stmt = stmt.where(User.full_name.ilike(f"%{q}%"))
    stmt = stmt.offset(offset).limit(limit).order_by(User.full_name)
    return (await db.execute(stmt)).scalars().all()


@router.post("", response_model=UserOut, status_code=201, dependencies=[ADMIN_ONLY])
async def create_user(db: DB, org_id: OrgId, body: UserCreate, actor: CurrentUser):
    exists = await db.execute(select(func.count()).select_from(User).where(User.email == body.email))
    if int(exists.scalar_one()):
        raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
    target_org = org_id
    if UserRole(actor.role) == UserRole.SUPER_ADMIN and body.org_id:
        target_org = body.org_id
    user = User(
        email=body.email,
        hashed_password=hash_password(body.password),
        full_name=body.full_name,
        phone=body.phone,
        role=body.role.value,
        skills=body.skills,
        assigned_blocks=body.assigned_blocks,
        experience_years=body.experience_years,
        avatar_url=body.avatar_url,
        org_id=None if body.role == UserRole.SUPER_ADMIN else target_org,
    )
    db.add(user)
    await db.flush()
    await db.commit()
    return user


@router.get("/workers", response_model=list[UserOut], dependencies=[MANAGER_PLUS])
async def list_workers(
    db: DB,
    org_id: OrgId,
    skill: str | None = Query(None),
):
    """Worker directory (used by dispatch + Facos Match recommendations)."""
    stmt = select(User).where(User.org_id == org_id, User.role == UserRole.WORKER)
    workers = (await db.execute(stmt)).scalars().all()
    if skill:
        workers = [w for w in workers if skill in (w.skills or [])]
    return list(workers)


@router.patch("/{user_id}", response_model=UserOut, dependencies=[ADMIN_ONLY])
async def update_user(db: DB, org_id: OrgId, user_id: str, body: UserUpdate):
    user = await db.get(User, user_id)
    if not user or (user.org_id != org_id and UserRole(user.role) != UserRole.SUPER_ADMIN):
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(user, field, value.value if hasattr(value, "value") else value)
    await db.flush()
    await db.commit()
    return user


@router.delete("/{user_id}", status_code=204, dependencies=[ADMIN_ONLY])
async def deactivate_user(db: DB, org_id: OrgId, user_id: str):
    """Soft-delete: users are deactivated to preserve audit history."""
    user = await db.get(User, user_id)
    if not user or user.org_id != org_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    user.is_active = False


# ---------------- authority-issued access tokens (requesters) ----------------


class IssuedCredential(BaseModel):
    token_no: str
    pin: str  # shown exactly once — only the hash is stored


async def _next_token_number(db, org: Organization) -> str:
    prefix = "".join(w[0] for w in org.name.split() if w).upper()[:4] or "FOS"
    result = await db.execute(
        select(func.count(User.id)).where(
            User.org_id == org.id, User.access_token_no.is_not(None)
        )
    )
    seq = int(result.scalar_one()) + 1
    return f"{prefix}-{seq:04d}-T"


@router.post("/{user_id}/issue-token", response_model=IssuedCredential, dependencies=[MANAGER_PLUS])
async def issue_access_token(
    db: DB, org_id: OrgId, user_id: str, actor: CurrentUser
):
    """
    Facility authority issues/reissues an Access Token + PIN to a requester.
    The PIN is returned ONCE in this response; only its bcrypt hash is stored.
    """
    user = await db.get(User, user_id)
    if not user or user.org_id != org_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found")
    if UserRole(user.role) != UserRole.REQUESTER:
        raise HTTPException(
            status.HTTP_400_BAD_REQUEST,
            "Access tokens are issued to requesters only — staff use email login",
        )

    org = await db.get(Organization, org_id)
    token_no = await _next_token_number(db, org)
    pin = "".join(secrets.choice("0123456789") for _ in range(4))

    user.access_token_no = token_no
    user.access_pin_hash = hash_password(pin)
    await db.flush()

    from app.services.ticket_service import _audit

    await _audit(db, actor, "user.token_issued", "user", user.id,
                 {"token_no": {"old": None, "new": token_no}})
    return IssuedCredential(token_no=token_no, pin=pin)
