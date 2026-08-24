import uuid
from typing import Annotated

import jwt as pyjwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.session import get_db
from app.models.enums import UserRole
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/login", auto_error=False)

DB = Annotated[AsyncSession, Depends(get_db)]


async def get_current_user(
    db: DB,
    token: Annotated[str | None, Depends(oauth2_scheme)],
) -> User:
    credentials_exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exc
    try:
        payload = decode_token(token)
    except pyjwt.PyJWTError:
        raise credentials_exc
    if payload.get("type") != "access":
        raise credentials_exc
    user = await db.get(User, payload["sub"])
    if user is None or not user.is_active:
        raise credentials_exc
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]


def require_roles(*roles: UserRole):
    """Dependency factory: endpoint accessible only to the given roles."""

    async def _checker(user: CurrentUser) -> User:
        if UserRole(user.role) not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires role in: {[r.value for r in roles]}",
            )
        return user

    return Depends(_checker)


def get_org_scoped_user(user: CurrentUser) -> User:
    """Users that operate inside a tenant context (everyone except super_admin browsing all)."""
    if UserRole(user.role) == UserRole.SUPER_ADMIN and user.org_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="super_admin must specify an organization for this operation",
        )
    return user


def effective_org_id(request: Request, user: CurrentUser) -> str:
    """
    Resolve the org a query must be scoped to.
    super_admin may pass ?org_id=... to browse any tenant; everyone else is pinned
    to their own org — cross-tenant access is structurally impossible.
    """
    role = UserRole(user.role)
    requested = request.query_params.get("org_id")
    if role == UserRole.SUPER_ADMIN:
        if requested:
            return requested
        if user.org_id:
            return user.org_id
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "org_id query param required")
    if requested and requested != user.org_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cross-tenant access denied")
    return user.org_id  # type: ignore[return-value]


OrgId = Annotated[str, Depends(effective_org_id)]


def new_jti() -> str:
    return uuid.uuid4().hex


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()
