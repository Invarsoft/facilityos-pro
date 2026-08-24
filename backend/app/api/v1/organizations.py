from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.core.deps import CurrentUser, DB, require_roles
from app.models.enums import UserRole
from app.models.organization import Organization
from app.models.user import ServiceCategoryModel
from app.schemas.common import ServiceCategoryOut  # noqa: F401
from app.schemas.tickets import OrganizationCreate, OrganizationOut, OrganizationUpdate

router = APIRouter(prefix="/organizations", tags=["organizations"])

SUPER_ONLY = require_roles(UserRole.SUPER_ADMIN)
ADMIN_ONLY = require_roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)


@router.get("/mine", response_model=OrganizationOut)
async def my_organization(db: DB, user: CurrentUser):
    if not user.org_id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "No organization bound to this account")
    org = await db.get(Organization, user.org_id)
    if not org:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Organization not found")
    return org


@router.get("", response_model=list[OrganizationOut], dependencies=[SUPER_ONLY])
async def list_organizations(db: DB):
    """super_admin only: browse all tenants."""
    rows = await db.execute(select(Organization).order_by(Organization.name))
    return list(rows.scalars().all())


@router.post("", response_model=OrganizationOut, status_code=201, dependencies=[SUPER_ONLY])
async def create_organization(db: DB, body: OrganizationCreate, actor: CurrentUser):
    org = Organization(
        name=body.name,
        vertical=body.vertical,
        brand_color=body.brand_color,
        logo_url=body.logo_url,
        welcome_message=body.welcome_message,
        address=body.address,
        contact_email=body.contact_email,
        contact_phone=body.contact_phone,
    )
    db.add(org)
    await db.flush()
    return org


@router.patch("/{org_id}", response_model=OrganizationOut, dependencies=[ADMIN_ONLY])
async def update_branding(org_id: str, body: OrganizationUpdate, db: DB, user: CurrentUser):
    """White-label branding updates (admin of own org, super_admin anywhere)."""
    if UserRole(user.role) != UserRole.SUPER_ADMIN and user.org_id != org_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cross-tenant access denied")
    org = await db.get(Organization, org_id)
    if not org:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Organization not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(org, field, value)
    await db.flush()
    return org


@router.get("/{org_id}/service-categories", response_model=list[ServiceCategoryOut])
async def service_categories(db: DB, org_id: str, user: CurrentUser):
    if UserRole(user.role) != UserRole.SUPER_ADMIN and user.org_id != org_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Cross-tenant access denied")
    rows = await db.execute(
        select(ServiceCategoryModel)
        .where(ServiceCategoryModel.org_id == org_id)
        .order_by(ServiceCategoryModel.label)
    )
    return list(rows.scalars().all())
