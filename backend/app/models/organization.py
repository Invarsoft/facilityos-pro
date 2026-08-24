from datetime import datetime

from sqlalchemy import JSON, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.helpers import _uuid, utcnow


class Organization(Base):
    """Tenant root. Every domain row carries org_id for isolation."""

    __tablename__ = "organizations"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=_uuid)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)

    # public facility code (e.g. WOXSEN-2026) used by "Enter Facility Code"
    code: Mapped[str | None] = mapped_column(String(40), unique=True, index=True)

    # vertical: university/apartment/office/hostel/school/hospital/residential/commercial
    vertical: Mapped[str | None] = mapped_column(String(50))

    # white-label branding (mirrors frontend per-org theming)
    brand_color: Mapped[str | None] = mapped_column(String(20))
    logo_url: Mapped[str | None] = mapped_column(String(500))
    welcome_message: Mapped[str | None] = mapped_column(String(300))

    address: Mapped[str | None] = mapped_column(String(500))
    contact_email: Mapped[str | None] = mapped_column(String(255))
    contact_phone: Mapped[str | None] = mapped_column(String(50))

    settings: Mapped[dict] = mapped_column(JSON, default=dict)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utcnow)

    users = relationship("User", back_populates="org")
