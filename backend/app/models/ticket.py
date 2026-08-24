from datetime import datetime

from sqlalchemy import JSON, Boolean, DateTime, Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import ServiceCategory, TicketPriority, TicketStatus
from app.models.helpers import _uuid, utcnow


class Ticket(Base):
    __tablename__ = "tickets"
    __table_args__ = (
        Index("ix_tickets_org_status", "org_id", "status"),
        Index("ix_tickets_org_assignee", "org_id", "assignee_id"),
        Index("ix_tickets_sla_resolution_due", "sla_resolution_due"),
    )

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    org_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("organizations.id", ondelete="CASCADE"), index=True, nullable=False
    )
    ticket_number: Mapped[str] = mapped_column(String(30), unique=True, index=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    category: Mapped[str] = mapped_column(String(40), nullable=False)  # ServiceCategory value
    priority: Mapped[str] = mapped_column(String(20), nullable=False)  # TicketPriority value
    status: Mapped[str] = mapped_column(String(30), nullable=False, default=TicketStatus.OPEN)

    requester_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    assignee_id: Mapped[str | None] = mapped_column(
        String(32), ForeignKey("users.id", ondelete="SET NULL")
    )
    location: Mapped[str | None] = mapped_column(String(255))
    room: Mapped[str | None] = mapped_column(String(100))
    photos: Mapped[list] = mapped_column(JSON, default=list)

    progress: Mapped[int | None] = mapped_column(Integer, default=0)
    is_emergency: Mapped[bool] = mapped_column(Boolean, default=False)
    escalated: Mapped[bool] = mapped_column(Boolean, default=False)
    reopen_count: Mapped[int | None] = mapped_column(Integer, default=0)

    # SLA tracking (computed at creation from SLA rules — never hardcoded)
    sla_response_due: Mapped[datetime | None] = mapped_column(DateTime)
    sla_resolution_due: Mapped[datetime | None] = mapped_column(DateTime)
    first_response_at: Mapped[datetime | None] = mapped_column(DateTime)
    sla_response_breached: Mapped[bool] = mapped_column(Boolean, default=False)
    sla_resolution_breached: Mapped[bool] = mapped_column(Boolean, default=False)

    assigned_at: Mapped[datetime | None] = mapped_column(DateTime)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime)
    closed_at: Mapped[datetime | None] = mapped_column(DateTime)

    verification_rating: Mapped[float | None] = mapped_column(Float)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow, onupdate=utcnow)

    events: Mapped[list["TicketEvent"]] = relationship(
        back_populates="ticket", cascade="all, delete-orphan", order_by="TicketEvent.created_at"
    )
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="ticket", cascade="all, delete-orphan", order_by="Comment.created_at"
    )


class TicketEvent(Base):
    """Immutable timeline entries for every state change / action."""

    __tablename__ = "ticket_events"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    ticket_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("tickets.id", ondelete="CASCADE"), index=True, nullable=False
    )
    actor_id: Mapped[str | None] = mapped_column(String(32), ForeignKey("users.id"))
    actor_name: Mapped[str | None] = mapped_column(String(255))
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)  # created/assigned/progress/...
    message: Mapped[str] = mapped_column(String(1000), nullable=False)
    meta: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    ticket: Mapped[Ticket] = relationship(back_populates="events")


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    ticket_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("tickets.id", ondelete="CASCADE"), index=True, nullable=False
    )
    author_id: Mapped[str] = mapped_column(String(32), ForeignKey("users.id"), nullable=False)
    author_name: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    ticket: Mapped[Ticket] = relationship(back_populates="comments")
