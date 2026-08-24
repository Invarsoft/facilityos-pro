from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select

from app.core.deps import CurrentUser, DB, require_roles
from app.models.enums import UserRole
from app.models.organization import Organization
from app.models.support import OnboardingRequest
from app.services.provisioning import provision_organization
from app.services.ticket_service import _audit

router = APIRouter(prefix="/onboarding", tags=["onboarding"])

SUPER_ONLY = require_roles(UserRole.SUPER_ADMIN)


class OnboardingCreate(BaseModel):
    org_name: str = Field(min_length=2, max_length=255)
    vertical: str | None = None
    contact_name: str | None = Field(None, max_length=255)
    contact_email: EmailStr
    contact_phone: str | None = Field(None, max_length=50)
    message: str | None = Field(None, max_length=2000)


class OnboardingOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    org_name: str
    vertical: str | None
    contact_name: str | None
    contact_email: str
    contact_phone: str | None
    message: str | None
    status: str
    created_at: object
    created_org_id: str | None
    created_admin_email: str | None
    created_facility_code: str | None


class ApprovalCredentials(BaseModel):
    """Returned ONCE to the approving super admin."""

    request_id: str
    org_id: str
    org_name: str
    facility_code: str
    admin_email: str
    admin_password: str


@router.post("", response_model=OnboardingOut, status_code=201)
async def submit_onboarding_request(body: OnboardingCreate, db: DB):
    """Public endpoint — no auth. Anyone can request facility onboarding."""
    request = OnboardingRequest(
        org_name=body.org_name,
        vertical=body.vertical,
        contact_name=body.contact_name,
        contact_email=body.contact_email.lower(),
        contact_phone=body.contact_phone,
        message=body.message,
    )
    db.add(request)
    await db.flush()
    return request


@router.get("", response_model=list[OnboardingOut], dependencies=[SUPER_ONLY])
async def list_onboarding_requests(
    db: DB,
    status_filter: str | None = Query(None, alias="status"),
):
    stmt = select(OnboardingRequest)
    if status_filter:
        stmt = stmt.where(OnboardingRequest.status == status_filter)
    rows = await db.execute(
        stmt.order_by(OnboardingRequest.created_at.desc())
    )
    return list(rows.scalars().all())


@router.post("/{request_id}/approve", response_model=ApprovalCredentials, dependencies=[SUPER_ONLY])
async def approve_onboarding_request(
    db: DB, request_id: str, actor: CurrentUser
):
    request = await db.get(OnboardingRequest, request_id)
    if not request:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Request not found")
    if request.status != "pending":
        raise HTTPException(status.HTTP_409_CONFLICT, f"Request already {request.status}")

    existing_org = (
        await db.execute(
            select(Organization).where(Organization.name == request.org_name)
        )
    ).scalar_one_or_none()
    if existing_org:
        raise HTTPException(
            status.HTTP_409_CONFLICT,
            "An organization with this name already exists",
        )

    org, admin, admin_password, facility_code = await provision_organization(
        db,
        org_name=request.org_name,
        vertical=request.vertical,
        contact_email=request.contact_email,
        contact_name=request.contact_name,
        contact_phone=request.contact_phone,
    )

    request.status = "approved"
    request.reviewed_by = actor.id
    request.created_org_id = org.id
    request.created_admin_email = admin.email
    request.created_admin_password = admin_password  # shown once, for handover
    request.created_facility_code = facility_code
    await db.flush()

    await _audit(db, actor, "onboarding.approved", "onboarding_request", request.id,
                 {"org": {"old": None, "new": org.id},
                  "facility_code": {"old": None, "new": facility_code}})

    return ApprovalCredentials(
        request_id=request.id,
        org_id=org.id,
        org_name=org.name,
        facility_code=facility_code,
        admin_email=admin.email,
        admin_password=admin_password,
    )


@router.post("/{request_id}/reject", response_model=OnboardingOut, dependencies=[SUPER_ONLY])
async def reject_onboarding_request(db: DB, request_id: str, actor: CurrentUser):
    request = await db.get(OnboardingRequest, request_id)
    if not request:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Request not found")
    if request.status != "pending":
        raise HTTPException(status.HTTP_409_CONFLICT, f"Request already {request.status}")
    request.status = "rejected"
    request.reviewed_by = actor.id
    await db.flush()
    await _audit(db, actor, "onboarding.rejected", "onboarding_request", request.id)
    return request
