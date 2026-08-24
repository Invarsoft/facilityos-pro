"""
Seed the database with demo data mirroring frontend/lib/mockData.ts.

Usage:  python -m scripts.seed
"""
import asyncio
from datetime import timedelta

from sqlalchemy import select

from app.core.security import hash_password
from app.db.base import Base
from app.db.session import AsyncSessionLocal, engine
from app.models.asset import Asset, SLARule
from app.models.enums import ServiceCategory, TicketPriority, UserRole
from app.models.organization import Organization
from app.models.user import ServiceCategoryModel, User
from app.services import ticket_service as svc
from app.schemas.tickets import AssignRequest, ProgressUpdate, TicketCreate, CompleteRequest

CATEGORIES = [
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

ORG_BLUEPRINTS = [
    {
        "name": "Woxsen University",
        "vertical": "university",
        "brand_color": "#0ea5e9",
        "welcome_message": "Welcome to Woxsen Facilities — how can we help?",
        "code": "WOXSEN-2026",
        "token_prefix": "WOXSEN",
        "users": [
            ("admin@woxsen.edu", "Dr. Meera Krishnan", UserRole.ADMIN),
            ("manager@woxsen.edu", "Ravi Kumar", UserRole.MANAGER),
            ("student@woxsen.edu", "Aarav Sharma", UserRole.REQUESTER, "WOXSEN-8849-T", "2026"),
            ("staff@woxsen.edu", "Priya Nair", UserRole.REQUESTER, "WOXSEN-8850-T", "2027"),
            ("worker.plumbing@woxsen.edu", "Suresh Yadav", UserRole.WORKER, None, None, ["plumbing", "water_supply"]),
            ("worker.electrical@woxsen.edu", "Anil Verma", UserRole.WORKER, None, None, ["electrical", "network"]),
            ("worker.hvac@woxsen.edu", "Imran Shaikh", UserRole.WORKER, None, None, ["hvac"]),
        ],
    },
    {
        "name": "Green Valley Apartments",
        "vertical": "apartment",
        "brand_color": "#22c55e",
        "welcome_message": "Welcome home, Green Valley resident!",
        "code": "GV-2026",
        "token_prefix": "GV",
        "users": [
            ("admin@greenvalley.com", "Kavitha Reddy", UserRole.ADMIN),
            ("manager@greenvalley.com", "Deepak Joshi", UserRole.MANAGER),
            ("resident@greenvalley.com", "Sunita Rao", UserRole.REQUESTER, "GV-8849-T", "2026"),
            ("worker.cleaning@greenvalley.com", "Lata Kumari", UserRole.WORKER, None, None, ["cleaning"]),
            ("worker.carpentry@greenvalley.com", "Mohan Das", UserRole.WORKER, None, None, ["carpentry", "furniture"]),
        ],
    },
    {
        "name": "InvarTech Office",
        "vertical": "office",
        "brand_color": "#8b5cf6",
        "welcome_message": "InvarTech Workplace Services",
        "code": "INV-2026",
        "token_prefix": "INV",
        "users": [
            ("admin@invartech.io", "Nikhil Menon", UserRole.ADMIN),
            ("manager@invartech.io", "Farah Khan", UserRole.MANAGER),
            ("employee@invartech.io", "Rohit Bansal", UserRole.REQUESTER, "INV-8849-T", "2026"),
            ("worker.it@invartech.io", "Sanjay Gupta", UserRole.WORKER, None, None, ["it_support", "network"]),
        ],
    },
]

# Remaining facilities from frontend/lib/mockData.ts — generated with the
# standardized credential scheme so EVERY org in the picker has real logins.
EXTRA_ORGS = [
    # (org_id, name, vertical, token_prefix)
    ("iit-bombay", "IIT Bombay Campus", "university", "IITB"),
    ("manipal-university", "Manipal Academy of Higher Education", "university", "MAHE"),
    ("bits-pilani", "BITS Pilani Campus", "university", "BITS"),
    ("srm-ist", "SRM Institute of Science & Tech", "university", "SRM"),
    ("prestige-falcon", "Prestige Falcon City", "apartment", "PFC"),
    ("dlf-crest", "DLF The Crest Phase 5", "apartment", "DLF"),
    ("hiranandani-powai", "Hiranandani Gardens", "apartment", "HIRA"),
    ("microsoft-idc", "Microsoft India Dev Center", "office", "MSFT"),
    ("infosys-ecity", "Infosys World Headquarters", "office", "INFY"),
    ("apollo-main", "Apollo Hospitals Main Hub", "hospital", "APOLLO"),
    ("fortis-fmri", "Fortis Memorial Research Institute", "hospital", "FORTIS"),
    ("manipal-hospital", "Manipal Super Speciality Hospital", "hospital", "MSH"),
    ("xavier-hostel", "St. Xavier's Student Residence", "hostel", "XAVIER"),
    ("scholars-nest", "Scholar's Nest Executive Hostel", "hostel", "SNEST"),
    ("doon-school", "The Doon School Campus", "school", "DOON"),
    ("dps-intl", "DPS International Campus", "school", "DPS"),
    ("palm-meadows", "Palm Meadows Villa Society", "apartment", "PALM"),
    ("phoenix-marketcity", "Phoenix Marketcity Commercial Hub", "commercial", "PHOENIX"),
]


def _blueprint_for(org_id: str, name: str, vertical: str, prefix: str) -> dict:
    """Standardized credentials: requester token {PREFIX}-8849-T / 2026,
    staff emails {role}@{org_id}.facilityos.pro with role-default passwords."""
    domain = f"{org_id}.facilityos.pro"
    return {
        "name": name,
        "vertical": vertical,
        "code": f"{prefix}-2026",
        "users": [
            (f"admin@{domain}", f"{name} Admin", UserRole.ADMIN),
            (f"manager@{domain}", f"{name} Manager", UserRole.MANAGER),
            (f"user@{domain}", f"{name} Resident", UserRole.REQUESTER, f"{prefix}-8849-T", "2026"),
            (f"worker@{domain}", f"{name} Technician", UserRole.WORKER, None, None, ["plumbing"]),
        ],
    }


ORG_BLUEPRINTS.extend(_blueprint_for(*args) for args in EXTRA_ORGS)

DEFAULT_PASSWORD = {
    UserRole.SUPER_ADMIN: "Super@123",
    UserRole.ADMIN: "Admin@123",
    UserRole.MANAGER: "Manager@123",
    UserRole.WORKER: "Worker@123",
    UserRole.REQUESTER: "User@123",
}


async def seed() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        from sqlalchemy import func, select

        existing = (
            await db.execute(select(func.count()).select_from(Organization))
        ).scalar_one()
        if existing:
            print("Database already seeded — skipping.")
            return

        super_admin = User(
            email="superadmin@facilityos.pro",
            hashed_password=hash_password(DEFAULT_PASSWORD[UserRole.SUPER_ADMIN]),
            full_name="FacilityOS Super Admin",
            role=UserRole.SUPER_ADMIN,
            org_id=None,
        )
        db.add(super_admin)
        await db.flush()

        for bp in ORG_BLUEPRINTS:
            org = Organization(
                name=bp["name"],
                code=bp.get("code"),
                vertical=bp["vertical"],
                brand_color=bp.get("brand_color"),
                welcome_message=bp.get("welcome_message"),
            )
            db.add(org)
            await db.flush()

            for key, label, icon in CATEGORIES:
                db.add(
                    ServiceCategoryModel(
                        org_id=org.id, key=key, label=label, icon=icon
                    )
                )
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

            users: dict[str, User] = {}
            for u in bp["users"]:
                email, name, role = u[0], u[1], u[2]
                token_no = u[3] if len(u) > 3 else None
                pin = u[4] if len(u) > 4 else None
                skills = u[5] if len(u) > 5 else []
                user = User(
                    email=email,
                    hashed_password=hash_password(DEFAULT_PASSWORD[role]),
                    full_name=name,
                    role=role.value if isinstance(role, UserRole) else role,
                    skills=skills,
                    org_id=org.id,
                    experience_years=6 if role == UserRole.WORKER else 0,
                    completed_jobs=24 if role == UserRole.WORKER else 0,
                    rating=4.7 if role == UserRole.WORKER else None,
                    access_token_no=token_no,
                    access_pin_hash=hash_password(pin) if pin else None,
                )
                db.add(user)
                users[email] = user
            await db.flush()

            # sample assets
            asset_names = {
                "university": ["Main Block Chiller", "Library Lift-1", "Boys Hostel Water Pump"],
                "apartment": ["Tower-A Borewell Motor", "Clubhouse AC Unit"],
                "office": ["3rd Floor AHU", "Reception Access Panel"],
                "hospital": ["OT Air Handling Unit", "Central Medical Gas Compressor"],
                "school": ["Auditorium AC Unit", "Water Cooler — Block B"],
                "hostel": ["Mess Refrigerator", "Geyser — Room 204"],
                "commercial": ["Food Court AHU", "Service Lift — East Wing"],
            }
            for i, aname in enumerate(asset_names.get(bp["vertical"], ["Generic Asset"])):
                db.add(
                    Asset(
                        org_id=org.id,
                        name=aname,
                        category="hvac" if "Chiller" in aname or "AHU" in aname else "lift",
                        qr_tag=f"FOS-QR-{org.id[:6].upper()}-{i + 1:03d}",
                        building="Main",
                        floor=f"{i + 1}",
                        criticality="high",
                    )
                )

            # sample tickets through the real service layer → timeline events exist
            requester = next(u for e, u in users.items() if "admin@" not in e)
            manager = next((u for e, u in users.items() if e.startswith("manager")), None)
            workers = [u for u in users.values()
                       if isinstance(u.role, str) and u.role == UserRole.WORKER]

            t1 = await svc.create_ticket(
                db, requester, org.id,
                TicketCreate(
                    title="Leaking tap in washroom",
                    description="Continuous leakage from the second-floor washroom basin.",
                    category="plumbing", priority=TicketPriority.HIGH,
                    location="Academic Block", room="204",
                ),
            )
            t2 = await svc.create_ticket(
                db, requester, org.id,
                TicketCreate(
                    title="Projector not turning on",
                    description="Classroom projector shows no power.",
                    category="electrical", priority=TicketPriority.MEDIUM,
                    location="Academic Block", room="310",
                ),
            )
            if workers:
                w = workers[0]
                await svc.assign_worker(db, manager or super_admin, org.id, t1.id,
                                        AssignRequest(worker_id=w.id))
                await svc.update_progress(db, w, org.id, t1.id,
                                          ProgressUpdate(progress=60, note="Replacement part fitted"))
                await svc.complete_work(db, w, org.id, t1.id, CompleteRequest(note="Fixed"))
            await db.commit()

        print("Seed complete.")
        print("\nDemo credentials — requesters (Access Token + PIN, all use PIN 2026):")
        for _id, name, _v, prefix in EXTRA_ORGS:
            print(f"  {name:45s} {prefix}-8849-T / 2026")
        print("  Woxsen University (custom)                      WOXSEN-8849-T / 2026")
        print("  Green Valley Apartments (custom)                GV-8849-T / 2026")
        print("  InvarTech Office (custom)                       INV-8849-T / 2026")
        print("\nDemo credentials — staff (Email + Password):")
        print("  super admin : superadmin@facilityos.pro / Super@123")
        print("  woxsen      : admin@woxsen.edu / Admin@123 | manager@woxsen.edu / Manager@123")
        print("  woxsen      : worker.plumbing@woxsen.edu / Worker@123")
        print("  others      : admin|manager|worker|user@{org-id}.facilityos.pro")
        print("                (Admin@123 / Manager@123 / Worker@123 / User@123)")
    await engine.dispose()


def func_count():
    from sqlalchemy import func, select

    return select(func.count()).select_from(Organization)


if __name__ == "__main__":
    asyncio.run(seed())
