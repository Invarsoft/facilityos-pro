import secrets

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.models.asset import SLARule
from app.models.enums import TicketPriority, UserRole
from app.models.organization import Organization
from app.models.user import ServiceCategoryModel, User

SERVICE_CATEGORIES = [
    ("plumbing", "Plumbing", "droplets"),
    ("electrical", "Electrical", "zap"),
    ("carpentry", "Carpentry", "hammer"),
    ("cleaning", "Cleaning", "sparkles"),
    ("hvac", "AC / HVAC", "wind"),
    ("civil", "Civil Works", "hard-hat"),
    ("furniture", "Furniture", "armchair"),
    ("network", "Wi-Fi / Network", "wifi"),
    ("it_support", "IT Support", "monitor"),
    ("hostel_maintenance", "Hostel Maintenance", "bed-double"),
    ("transport", "Transport", "bus"),
    ("security", "Security & Access", "shield"),
    ("water_supply", "Water Supply", "waves"),
    ("lift", "Lift / Elevator", "move-vertical"),
]

SLA_MATRIX = {
    TicketPriority.EMERGENCY: (0.5, 2.0),
    TicketPriority.HIGH: (1.0, 8.0),
    TicketPriority.MEDIUM: (4.0, 24.0),
    TicketPriority.LOW: (8.0, 72.0),
}


def generate_facility_code(org_name: str) -> str:
    prefix = "".join(w[0] for w in org_name.split() if w).upper()[:6] or "FOS"
    return f"{prefix}-2026"


async def code_exists(db: AsyncSession, code: str) -> bool:
    result = await db.execute(
        select(func.count()).select_from(Organization).where(Organization.code == code)
    )
    return int(result.scalar_one()) > 0


async def unique_facility_code(db: AsyncSession, org_name: str) -> str:
    base = generate_facility_code(org_name)
    code, suffix = base, 1
    while await code_exists(db, code):
        suffix += 1
        code = f"{base}-{suffix}"
    return code


def generate_admin_password() -> str:
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"
    return "".join(secrets.choice(alphabet) for _ in range(10))


async def provision_organization(
    db: AsyncSession,
    org_name: str,
    vertical: str | None,
    contact_email: str,
    contact_name: str | None = None,
    contact_phone: str | None = None,
) -> tuple[Organization, User, str, str]:
    """
    Create a fully-configured tenant: organization + admin account +
    service categories + SLA rules + facility code.
    Returns (org, admin_user, admin_password, facility_code).
    The password is returned ONCE — only its hash is stored.
    """
    org = Organization(
        name=org_name,
        vertical=vertical,
        contact_email=contact_email,
        contact_phone=contact_phone,
        code=await unique_facility_code(db, org_name),
    )
    db.add(org)
    await db.flush()

    admin_password = generate_admin_password()
    admin = User(
        email=contact_email.lower(),
        hashed_password=hash_password(admin_password),
        full_name=contact_name or f"{org_name} Admin",
        role=UserRole.ADMIN,
        org_id=org.id,
    )
    db.add(admin)

    for key, label, icon in SERVICE_CATEGORIES:
        db.add(ServiceCategoryModel(org_id=org.id, key=key, label=label, icon=icon))
        for priority, (rh, sh) in SLA_MATRIX.items():
            db.add(
                SLARule(
                    org_id=org.id,
                    category=key,
                    priority=priority.value,
                    response_hours=rh,
                    resolution_hours=sh,
                )
            )
    await db.flush()
    return org, admin, admin_password, org.code
