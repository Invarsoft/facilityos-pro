import enum
from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.enums import AssetCriticality, AssetStatus, PMFrequency
from app.models.helpers import _uuid, utcnow


class Asset(Base):
    __tablename__ = "assets"
    __table_args__ = (
        Index("ix_assets_org_qr", "org_id", "qr_tag"),
    )

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    org_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("organizations.id", ondelete="CASCADE"), index=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str | None] = mapped_column(String(60))  # hvac/electrical/lift/...
    qr_tag: Mapped[str] = mapped_column(String(64), unique=True, index=True)

    building: Mapped[str | None] = mapped_column(String(120))
    floor: Mapped[str | None] = mapped_column(String(60))
    room: Mapped[str | None] = mapped_column(String(60))

    criticality: Mapped[str] = mapped_column(
        String(20), nullable=False, default=AssetCriticality.MEDIUM
    )
    status: Mapped[str] = mapped_column(String(30), nullable=False, default=AssetStatus.OPERATIONAL)

    manufacturer: Mapped[str | None] = mapped_column(String(120))
    model_number: Mapped[str | None] = mapped_column(String(120))
    purchase_date: Mapped[date | None] = mapped_column(Date)
    warranty_until: Mapped[date | None] = mapped_column(Date)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)


class PreventiveMaintenanceSchedule(Base):
    __tablename__ = "pm_schedules"
    __table_args__ = (
        Index("ix_pm_org_next_due", "org_id", "next_due"),
    )

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    org_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("organizations.id", ondelete="CASCADE"), index=True, nullable=False
    )
    asset_id: Mapped[str | None] = mapped_column(
        String(32), ForeignKey("assets.id", ondelete="SET NULL")
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000))

    frequency: Mapped[str] = mapped_column(String(20), nullable=False, default=PMFrequency.MONTHLY)
    assigned_worker_id: Mapped[str | None] = mapped_column(
        String(32), ForeignKey("users.id", ondelete="SET NULL")
    )

    next_due: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    last_completed_at: Mapped[datetime | None] = mapped_column(DateTime)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    asset = relationship("Asset")


class SLARule(Base):
    __tablename__ = "sla_rules"
    __table_args__ = (
        Index("ix_sla_org_cat_prio", "org_id", "category", "priority"),
    )

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    org_id: Mapped[str] = mapped_column(
        String(32), ForeignKey("organizations.id", ondelete="CASCADE"), index=True, nullable=False
    )
    category: Mapped[str] = mapped_column(String(40), nullable=False)  # ServiceCategory value
    priority: Mapped[str] = mapped_column(String(20), nullable=False)  # TicketPriority value

    response_hours: Mapped[float | None]
    resolution_hours: Mapped[float | None]

    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)
