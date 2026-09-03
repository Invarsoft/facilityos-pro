from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.enums import UserRole


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class RefreshRequest(BaseModel):
    refresh_token: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=255)
    phone: str | None = None
    role: UserRole = UserRole.REQUESTER
    org_id: str | None = None  # super_admin only; defaults to creator's org
    skills: list[str] = []
    assigned_blocks: list[str] = []
    experience_years: int = 0
    avatar_url: str | None = None


class UserUpdate(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    role: UserRole | None = None
    skills: list[str] | None = None
    assigned_blocks: list[str] | None = None
    experience_years: int | None = None
    is_available: bool | None = None
    is_active: bool | None = None
    avatar_url: str | None = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str | None
    email: EmailStr
    full_name: str
    phone: str | None
    role: UserRole
    skills: list[str]
    assigned_blocks: list[str] = []
    experience_years: int | None
    is_available: bool
    active_load: int | None
    completed_jobs: int | None
    rating: float | None
    avatar_url: str | None
    is_active: bool
    created_at: datetime
