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
    await db.commit()
    return org


@router.get("/public")
async def public_organizations(db: DB):
    """Public facility directory for the picker — safe fields only."""
    rows = await db.execute(
        select(Organization)
        .where(Organization.is_active.is_(True))
        .order_by(Organization.name)
    )
    return [
        {
            "id": org.id,
            "name": org.name,
            "code": org.code,
            "vertical": org.vertical,
            "brand_color": org.brand_color,
            "welcome_message": org.welcome_message,
        }
        for org in rows.scalars().all()
    ]


@router.get("/by-code/{code}")
async def organization_by_code(db: DB, code: str):
    """Public: resolve a facility code (e.g. WOXSEN-2026) to its organization."""
    rows = await db.execute(
        select(Organization).where(Organization.code == code.strip().upper())
    )
    org = rows.scalar_one_or_none()
    if not org or not org.is_active:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invalid facility code")
    return {"id": org.id, "name": org.name, "vertical": org.vertical, "code": org.code}


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
    await db.commit()
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
    await db.commit()
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
