from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, ForeignKey, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.helpers import _uuid, utcnow


class Notification(Base):
    __tablename__ = "notifications"
    __table_args__ = (
        Index("ix_notifications_user_read", "user_id", "read_at"),
    )

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    org_id: Mapped[str | None] = mapped_column(
        String(32), ForeignKey("organizations.id", ondelete="CASCADE"), index=True
    )
    type: Mapped[str | None] = mapped_column(String(50))  # assigned/status_change/sla_breach/emergency...
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str | None] = mapped_column(String(1000))
    ticket_id: Mapped[str | None] = mapped_column(String(32), index=True)
    link: Mapped[str | None] = mapped_column(String(300))  # frontend deep-link path
    read_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class AuditLog(Base):
    """Append-only audit trail. Never updated or deleted by app code."""

    __tablename__ = "audit_logs"
    __table_args__ = (
        Index("ix_audit_org_created", "org_id", "created_at"),
        Index("ix_audit_entity", "entity_type", "entity_id"),
    )

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    org_id: Mapped[str | None] = mapped_column(String(32), index=True)
    actor_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("users.id"))
    actor_name: Mapped[str | None] = mapped_column(String(255))
    action: Mapped[str] = mapped_column(String(100), nullable=False)  # ticket.created/user.login...
    entity_type: Mapped[str | None] = mapped_column(String(60))
    entity_id: Mapped[str | None] = mapped_column(String(32))
    changes: Mapped[dict | None] = mapped_column(JSON)  # {"field": {"old": x, "new": y}}
    ip_address: Mapped[str | None] = mapped_column(String(64))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class Verification(Base):
    """Requester quality gate before closure (OTP + star rating)."""

    __tablename__ = "ticket_verifications"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    ticket_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("tickets.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    otp_code: Mapped[str] = mapped_column(String(10), nullable=False)
    rating: Mapped[int | None] = mapped_column(Integer)
    verdict: Mapped[str | None] = mapped_column(String(20))  # approved / rejected
    feedback: Mapped[str | None] = mapped_column(String(1000))
    verified_by: Mapped[str | None] = mapped_column(String(32), ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
