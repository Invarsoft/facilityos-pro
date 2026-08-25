from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import TicketPriority, TicketStatus


class OrganizationCreate(BaseModel):
    name: str = Field(min_length=2, max_length=255)
    vertical: str | None = None
    brand_color: str | None = None
    logo_url: str | None = None
    welcome_message: str | None = None
    address: str | None = None
    contact_email: str | None = None
    contact_phone: str | None = None


class OrganizationUpdate(OrganizationCreate):
    pass


class OrganizationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    vertical: str | None
    brand_color: str | None
    logo_url: str | None
    welcome_message: str | None
    address: str | None
    contact_email: str | None
    contact_phone: str | None
    is_active: bool
    created_at: datetime


# ---------- Tickets ----------


class TicketCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str = ""
    category: str  # ServiceCategory value
    priority: TicketPriority = TicketPriority.MEDIUM
    location: str | None = None
    room: str | None = None
    photos: list[str] = []
    asset_id: str | None = None


class AssignRequest(BaseModel):
    worker_id: str


class ProgressUpdate(BaseModel):
    progress: int = Field(ge=0, le=100)
    note: str | None = None
    photos: list[str] = []


class CompleteRequest(BaseModel):
    note: str | None = None
    photos: list[str] = []


class VerificationRequest(BaseModel):
    otp_code: str
    rating: int = Field(ge=1, le=5)
    feedback: str | None = None


class ReopenRequest(BaseModel):
    reason: str = Field(min_length=3, max_length=1000)


class CommentCreate(BaseModel):
    content: str = Field(min_length=1, max_length=2000)


class CommentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    ticket_id: str
    author_id: str
    author_name: str
    content: str
    created_at: datetime


class TicketEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    actor_id: str | None
    actor_name: str | None
    event_type: str
    message: str
    meta: dict[str, Any]
    created_at: datetime


class TicketUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    priority: TicketPriority | None = None
    location: str | None = None
    room: str | None = None


class TicketOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    org_id: str
    ticket_number: str
    title: str
    description: str
    category: str
    priority: TicketPriority
    status: TicketStatus
    requester_id: str
    assignee_id: str | None
    location: str | None
    room: str | None
    photos: list[str]
    progress: int | None
    is_emergency: bool
    escalated: bool
    reopen_count: int | None
    sla_response_due: datetime | None
    sla_resolution_due: datetime | None
    first_response_at: datetime | None
    sla_response_breached: bool
    sla_resolution_breached: bool
    assigned_at: datetime | None
    resolved_at: datetime | None
    closed_at: datetime | None
    verification_rating: float | None
    requester_name: str | None = None
    assignee_name: str | None = None
    created_at: datetime
    updated_at: datetime


class WorkerRecommendation(BaseModel):
    worker_id: str
    full_name: str
    skills: list[str]
    rating: float | None
    active_load: int | None
    completed_jobs: int | None
    match_score: float
    reasons: list[str]


class EmergencyTrigger(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str = ""
    category: str
    location: str | None = None
    room: str | None = None
