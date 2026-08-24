from datetime import datetime

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, select

from app.core.deps import CurrentUser, DB, OrgId
from app.models.support import AuditLog, Notification
from app.models.ticket import Ticket
from app.schemas.common import (
    AnalyticsOverview,
    AuditLogOut,
    CategoryBreakdown,
    NotificationOut,
    StatusBreakdown,
)

router = APIRouter(tags=["notifications", "audit", "analytics"])


# ------------------------------ notifications ------------------------------


@router.get("/notifications", response_model=list[NotificationOut])
async def my_notifications(
    db: DB,
    user: CurrentUser,
    unread_only: bool = False,
    offset: int = 0,
    limit: int = Query(100, le=200),
):
    stmt = select(Notification).where(Notification.user_id == user.id)
    if unread_only:
        stmt = stmt.where(Notification.read_at.is_(None))
    rows = await db.execute(
        stmt.order_by(Notification.created_at.desc()).offset(offset).limit(limit)
    )
    return list(rows.scalars().all())


@router.post("/notifications/{notification_id}/read")
async def mark_read(db: DB, user: CurrentUser, notification_id: str):
    n = await db.get(Notification, notification_id)
    if not n or n.user_id != user.id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Notification not found")
    if n.read_at is None:
        n.read_at = datetime.utcnow()
    return {"detail": "Marked read"}


@router.post("/notifications/read-all")
async def mark_all_read(db: DB, user: CurrentUser):
    rows = await db.execute(
        select(Notification).where(
            Notification.user_id == user.id, Notification.read_at.is_(None)
        )
    )
    for n in rows.scalars():
        n.read_at = datetime.utcnow()
    return {"detail": "All marked read"}


# ------------------------------ audit logs ------------------------------


@router.get("/audit-logs", response_model=list[AuditLogOut])
async def audit_logs(
    db: DB,
    org_id: OrgId,
    entity_type: str | None = None,
    entity_id: str | None = None,
    offset: int = 0,
    limit: int = Query(100, le=200),
):
    stmt = select(AuditLog).where(AuditLog.org_id == org_id)
    if entity_type:
        stmt = stmt.where(AuditLog.entity_type == entity_type)
    if entity_id:
        stmt = stmt.where(AuditLog.entity_id == entity_id)
    rows = await db.execute(
        stmt.order_by(AuditLog.created_at.desc()).offset(offset).limit(limit)
    )
    return list(rows.scalars().all())


# ------------------------------ analytics ------------------------------


@router.get("/analytics/overview", response_model=AnalyticsOverview)
async def analytics_overview(db: DB, org_id: OrgId):
    base = select(Ticket).where(Ticket.org_id == org_id)
    tickets = (await db.execute(base)).scalars().all()

    total = len(tickets)
    open_count = sum(1 for t in tickets if t.status in ("open", "reopened"))
    in_progress = sum(1 for t in tickets if t.status in ("assigned", "in_progress"))
    closed = sum(1 for t in tickets if t.status == "closed")
    escalated = sum(1 for t in tickets if t.escalated)
    breached = sum(1 for t in tickets if t.sla_resolution_breached or t.sla_response_breached)

    durations = [
        (t.resolved_at - t.created_at).total_seconds() / 3600
        for t in tickets
        if t.resolved_at and t.resolved_at > t.created_at
    ]
    ratings = [t.verification_rating for t in tickets if t.verification_rating]

    by_cat: dict[str, int] = {}
    by_status: dict[str, int] = {}
    for t in tickets:
        by_cat[t.category] = by_cat.get(t.category, 0) + 1
        by_status[t.status] = by_status.get(t.status, 0) + 1

    return AnalyticsOverview(
        total_tickets=total,
        open_tickets=open_count,
        in_progress=in_progress,
        closed_tickets=closed,
        escalated=escalated,
        sla_breached=breached,
        avg_resolution_hours=round(sum(durations) / len(durations), 2) if durations else None,
        avg_verification_rating=round(sum(ratings) / len(ratings), 2) if ratings else None,
        by_category=[
            CategoryBreakdown(category=k, count=v)
            for k, v in sorted(by_cat.items(), key=lambda x: -x[1])
        ],
        by_status=[StatusBreakdown(status=k, count=v) for k, v in by_status.items()],
    )


@router.get("/healthz")
async def healthz(db: DB):
    await db.execute(select(func.count()).select_from(Ticket))
    return {"status": "ok"}
