from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import (
    AssetCriticality,
    AssetStatus,
    PMFrequency,
    TicketPriority,
)


# ---------- Assets ----------


class AssetCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    category: str | None = None
    qr_tag: str | None = None  # auto-generated when omitted
    building: str | None = None
    floor: str | None = None
    room: str | None = None
    criticality: AssetCriticality = AssetCriticality.MEDIUM
    status: AssetStatus = AssetStatus.OPERATIONAL
    manufacturer: str | None = None
    model_number: str | None = None
    purchase_date: date | None = None
    warranty_until: date | None = None


class AssetUpdate(AssetCreate):
    pass


class AssetOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    name: str
    category: str | None
    qr_tag: str
    building: str | None
    floor: str | None
    room: str | None
    criticality: AssetCriticality
    status: AssetStatus
    manufacturer: str | None
    model_number: str | None
    purchase_date: date | None
    warranty_until: date | None
    created_at: datetime


# ---------- SLA rules ----------


class SLARuleCreate(BaseModel):
    category: str
    priority: TicketPriority
    response_hours: float = Field(gt=0)
    resolution_hours: float = Field(gt=0)


class SLARuleUpdate(BaseModel):
    response_hours: float | None = Field(default=None, gt=0)
    resolution_hours: float | None = Field(default=None, gt=0)


class SLARuleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    category: str
    priority: TicketPriority
    response_hours: float | None
    resolution_hours: float | None
    created_at: datetime


# ---------- Preventive maintenance ----------


class PMScheduleCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    asset_id: str | None = None
    frequency: PMFrequency = PMFrequency.MONTHLY
    assigned_worker_id: str | None = None
    next_due: datetime


class PMScheduleUpdate(PMScheduleCreate):
    is_active: bool | None = True


class PMScheduleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    asset_id: str | None
    title: str
    description: str | None
    frequency: PMFrequency
    assigned_worker_id: str | None
    next_due: datetime
    last_completed_at: datetime | None
    is_active: bool
    created_at: datetime


# ---------- Notifications & audit ----------


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    type: str | None
    title: str
    message: str | None
    ticket_id: str | None
    link: str | None
    read_at: datetime | None
    created_at: datetime


class AuditLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str | None
    actor_id: str | None
    actor_name: str | None
    action: str
    entity_type: str | None
    entity_id: str | None
    changes: dict | None
    created_at: datetime


# ---------- Analytics ----------


class CategoryBreakdown(BaseModel):
    category: str
    count: int


class StatusBreakdown(BaseModel):
    status: TicketPriority | str
    count: int


class AnalyticsOverview(BaseModel):
    total_tickets: int
    open_tickets: int
    in_progress: int
    closed_tickets: int
    escalated: int
    sla_breached: int
    avg_resolution_hours: float | None
    avg_verification_rating: float | None
    by_category: list[CategoryBreakdown]
    by_status: list[StatusBreakdown]


# ---------- Organizations / misc ----------


from pydantic import EmailStr  # noqa: E402


class ServiceCategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    key: str
    label: str
    icon: str | None
    description: str | None
