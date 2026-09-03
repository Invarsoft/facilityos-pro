from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import UserRole
from app.models.helpers import _uuid, utcnow


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        Index("ix_users_org_role", "org_id", "role"),
    )

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    org_id: Mapped[str | None] = mapped_column(
        String(32), ForeignKey("organizations.id", ondelete="CASCADE"), index=True
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50))
    role: Mapped[str] = mapped_column(String(30), nullable=False, default=UserRole.REQUESTER)

    # worker & warden fields
    skills: Mapped[list] = mapped_column(JSON, default=list)
    assigned_blocks: Mapped[list] = mapped_column(JSON, default=list)
    experience_years: Mapped[int | None] = mapped_column(default=0)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    active_load: Mapped[int | None] = mapped_column(default=0)  # open assigned tickets
    completed_jobs: Mapped[int | None] = mapped_column(default=0)
    rating: Mapped[float | None] = mapped_column(default=5.0)

    avatar_url: Mapped[str | None] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Authority-issued credentials (requesters login with token + PIN instead of email)
    access_token_no: Mapped[str | None] = mapped_column(
        String(40), unique=True, index=True
    )
    access_pin_hash: Mapped[str | None] = mapped_column(String(255))

    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    org = relationship("Organization", back_populates="users")


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    jti: Mapped[str] = mapped_column(String(32), primary_key=True)
    user_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class ServiceCategoryModel(Base):
    """Per-org service category config (icon, label, description)."""

    __tablename__ = "service_categories"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    org_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("organizations.id", ondelete="CASCADE"), index=True
    )
    key: Mapped[str] = mapped_column(String(40), nullable=False)
    label: Mapped[str] = mapped_column(String(100), nullable=False)
    icon: Mapped[str | None] = mapped_column(String(50), default="wrench")
    description: Mapped[str | None] = mapped_column(String(300))
