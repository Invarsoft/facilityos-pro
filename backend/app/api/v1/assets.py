import uuid

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select

from app.core.deps import CurrentUser, DB, OrgId, require_roles
from app.models.asset import Asset, PreventiveMaintenanceSchedule, SLARule
from app.models.enums import UserRole
from app.schemas.common import (
    AssetCreate,
    AssetOut,
    AssetUpdate,
    PMScheduleCreate,
    PMScheduleOut,
    PMScheduleUpdate,
    SLARuleCreate,
    SLARuleOut,
    SLARuleUpdate,
)

router = APIRouter(tags=["assets"])

MANAGER_PLUS = require_roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
ADMIN_ONLY = require_roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)


def _gen_qr_tag() -> str:
    return f"FOS-QR-{uuid.uuid4().hex[:10].upper()}"


# ------------------------------ assets ------------------------------


@router.get("/assets", response_model=list[AssetOut])
async def list_assets(
    db: DB,
    org_id: OrgId,
    user: CurrentUser,
    category: str | None = None,
    criticality: str | None = None,
    q: str | None = Query(None, max_length=100),
    offset: int = 0,
    limit: int = Query(100, le=200),
):
    stmt = select(Asset).where(Asset.org_id == org_id)
    for col, val in {"category": category, "criticality": criticality}.items():
        if val is not None:
            stmt = stmt.where(getattr(Asset, col) == val)
    if q:
        stmt = stmt.where(Asset.name.ilike(f"%{q}%") | Asset.qr_tag.ilike(f"%{q}%"))
    rows = await db.execute(stmt.offset(offset).limit(limit).order_by(Asset.name))
    return list(rows.scalars().all())


@router.post("/assets", response_model=AssetOut, status_code=201, dependencies=[ADMIN_ONLY])
async def create_asset(db: DB, org_id: OrgId, body: AssetCreate):
    data = body.model_dump()
    if not data.get("qr_tag"):
        data["qr_tag"] = _gen_qr_tag()
    asset = Asset(org_id=org_id, **data)
    db.add(asset)
    await db.flush()
    await db.commit()
    return asset


@router.patch("/assets/{asset_id}", response_model=AssetOut, dependencies=[MANAGER_PLUS])
async def update_asset(db: DB, org_id: OrgId, asset_id: str, body: AssetUpdate):
    asset = await db.get(Asset, asset_id)
    if not asset or asset.org_id != org_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Asset not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(asset, field, value.value if hasattr(value, "value") else value)
    await db.flush()
    await db.commit()
    return asset


@router.delete("/assets/{asset_id}", status_code=204, dependencies=[ADMIN_ONLY])
async def delete_asset(db: DB, org_id: OrgId, asset_id: str):
    asset = await db.get(Asset, asset_id)
    if not asset or asset.org_id != org_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Asset not found")
    await db.delete(asset)


# ------------------------------ SLA rules ------------------------------


@router.get("/sla-rules", response_model=list[SLARuleOut], dependencies=[MANAGER_PLUS])
async def list_sla_rules(db: DB, org_id: OrgId):
    rows = await db.execute(
        select(SLARule).where(SLARule.org_id == org_id).order_by(SLARule.category)
    )
    return list(rows.scalars().all())


@router.put("/sla-rules", response_model=SLARuleOut, status_code=201, dependencies=[ADMIN_ONLY])
async def upsert_sla_rule(db: DB, org_id: OrgId, body: SLARuleCreate):
    """Idempotent per (category, priority): PUT semantics."""
    existing = (
        await db.execute(
            select(SLARule).where(
                SLARule.org_id == org_id,
                SLARule.category == body.category,
                SLARule.priority == body.priority.value,
            )
        )
    ).scalar_one_or_none()
    if existing:
        existing.response_hours = body.response_hours
        existing.resolution_hours = body.resolution_hours
        await db.flush()
        return existing
    rule = SLARule(
        org_id=org_id,
        category=body.category,
        priority=body.priority.value,
        response_hours=body.response_hours,
        resolution_hours=body.resolution_hours,
    )
    db.add(rule)
    await db.flush()
    await db.commit()
    return rule


@router.patch("/sla-rules/{rule_id}", response_model=SLARuleOut, dependencies=[ADMIN_ONLY])
async def update_sla_rule(db: DB, org_id: OrgId, rule_id: str, body: SLARuleUpdate):
    rule = await db.get(SLARule, rule_id)
    if not rule or rule.org_id != org_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Rule not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(rule, field, value)
    await db.flush()
    await db.commit()
    return rule


# --------------------------- PM schedules ---------------------------


@router.get("/pm-schedules", response_model=list[PMScheduleOut], dependencies=[MANAGER_PLUS])
async def list_pm_schedules(
    db: DB,
    org_id: OrgId,
    due_only: bool = False,
    offset: int = 0,
    limit: int = Query(100, le=200),
):
    from datetime import datetime

    stmt = select(PreventiveMaintenanceSchedule).where(
        PreventiveMaintenanceSchedule.org_id == org_id,
        PreventiveMaintenanceSchedule.is_active.is_(True),
    )
    if due_only:
        stmt = stmt.where(PreventiveMaintenanceSchedule.next_due <= datetime.utcnow())
    rows = await db.execute(
        stmt.order_by(PreventiveMaintenanceSchedule.next_due).offset(offset).limit(limit)
    )
    return list(rows.scalars().all())


@router.post("/pm-schedules", response_model=PMScheduleOut, status_code=201, dependencies=[MANAGER_PLUS])
async def create_pm_schedule(db: DB, org_id: OrgId, body: PMScheduleCreate):
    schedule = PreventiveMaintenanceSchedule(org_id=org_id, **body.model_dump())
    db.add(schedule)
    await db.flush()
    await db.commit()
    return schedule


@router.patch("/pm-schedules/{schedule_id}", response_model=PMScheduleOut, dependencies=[MANAGER_PLUS])
async def update_pm_schedule(db: DB, org_id: OrgId, schedule_id: str, body: PMScheduleUpdate):
    schedule = await db.get(PreventiveMaintenanceSchedule, schedule_id)
    if not schedule or schedule.org_id != org_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Schedule not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(schedule, field, value.value if hasattr(value, "value") else value)
    await db.flush()
    await db.commit()
    return schedule


@router.delete("/pm-schedules/{schedule_id}", status_code=204, dependencies=[MANAGER_PLUS])
async def delete_pm_schedule(db: DB, org_id: OrgId, schedule_id: str):
    schedule = await db.get(PreventiveMaintenanceSchedule, schedule_id)
    if not schedule or schedule.org_id != org_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Schedule not found")
    await db.delete(schedule)
