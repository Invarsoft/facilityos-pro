import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select

from app.core.deps import CurrentUser, DB, new_jti
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_password,
)
from app.models.enums import UserRole
from app.models.user import RefreshToken, User
from app.schemas.auth import RefreshRequest, TokenPair, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


def _issue_pair(user: User) -> TokenPair:
    jti = new_jti()
    return TokenPair(
        access_token=create_access_token(user.id, user.role, user.org_id),
        refresh_token=create_refresh_token(user.id, jti),
    )


async def _store_refresh(db, user_id: str, refresh_token: str) -> None:
    payload = decode_token(refresh_token)
    db.add(
        RefreshToken(
            jti=payload["jti"],
            user_id=user_id,
            expires_at=datetime.utcfromtimestamp(payload["exp"]),
        )
    )


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class TokenLoginRequest(BaseModel):
    token_no: str = Field(min_length=4, max_length=40)
    pin: str = Field(min_length=4, max_length=8)


@router.post("/login", response_model=TokenPair)
async def login(body: LoginRequest, db: DB):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password")
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account disabled")
    pair = _issue_pair(user)
    await _store_refresh(db, user.id, pair.refresh_token)
    return pair


@router.post("/token-login", response_model=TokenPair)
async def token_login(body: TokenLoginRequest, db: DB):
    """
    Authority-issued credential login (requesters).
    The facility/college issues each user an Access Token No. + PIN;
    the PIN is verified against its bcrypt hash, then a normal JWT
    session is issued — identical to email login downstream.
    """
    result = await db.execute(
        select(User).where(User.access_token_no == body.token_no.strip().upper())
    )
    user = result.scalar_one_or_none()
    if (
        not user
        or not user.access_pin_hash
        or not verify_password(body.pin, user.access_pin_hash)
    ):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid access token or PIN")
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Account disabled")
    if UserRole(user.role) != UserRole.REQUESTER:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN,
            "Access-token login is for requesters only — staff must use email",
        )
    pair = _issue_pair(user)
    await _store_refresh(db, user.id, pair.refresh_token)
    return pair


@router.post("/refresh", response_model=TokenPair)
async def refresh(body: RefreshRequest, db: DB):
    invalid = HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid refresh token")
    try:
        payload = decode_token(body.refresh_token)
    except Exception:
        raise invalid
    if payload.get("type") != "refresh":
        raise invalid
    row = await db.get(RefreshToken, payload.get("jti"))
    if row is None or row.revoked_at is not None:
        raise invalid  # replayed/rotated token → reject
    # rotation: revoke old, issue new pair
    row.revoked_at = datetime.utcnow()
    user = await db.get(User, payload["sub"])
    if not user or not user.is_active:
        raise invalid
    pair = _issue_pair(user)
    await _store_refresh(db, user.id, pair.refresh_token)
    return pair


@router.post("/logout")
async def logout(body: RefreshRequest, db: DB):
    """Revoke the presented refresh token (stateless JWTs can't otherwise be revoked)."""
    try:
        payload = decode_token(body.refresh_token)
    except Exception:
        return {"detail": "Logged out"}
    row = await db.get(RefreshToken, payload.get("jti"))
    if row and row.revoked_at is None:
        row.revoked_at = datetime.utcnow()
    return {"detail": "Logged out"}


@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser):
    return user
