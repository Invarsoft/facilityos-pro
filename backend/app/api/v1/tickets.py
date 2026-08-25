from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select

from app.core.deps import CurrentUser, DB, OrgId, require_roles
from app.models.enums import UserRole
from app.models.ticket import Comment, Ticket, TicketEvent
from app.models.user import User
from app.schemas.tickets import (
    AssignRequest,
    CommentCreate,
    CommentOut,
    CompleteRequest,
    EmergencyTrigger,
    ProgressUpdate,
    ReopenRequest,
    TicketCreate,
    TicketEventOut,
    TicketOut,
    TicketUpdate,
    VerificationRequest,
    WorkerRecommendation,
)
from app.services.matching import WorkerMatcher
from app.services import ticket_service as svc

router = APIRouter(prefix="/tickets", tags=["tickets"])

MANAGER_PLUS = require_roles(UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN)


async def _attach_names(db, tickets: list[Ticket]) -> list[dict]:
    """Serialize tickets with human-readable requester/assignee names."""
    ids = {t.requester_id for t in tickets}
    ids |= {t.assignee_id for t in tickets if t.assignee_id}
    users: dict[str, str] = {}
    if ids:
        rows = await db.execute(select(User).where(User.id.in_(ids)))
        users = {u.id: u.full_name for u in rows.scalars()}
    out = []
    for t in tickets:
        d = TicketOut.model_validate(t).model_dump()
        d["requester_name"] = users.get(t.requester_id)
        d["assignee_name"] = users.get(t.assignee_id) if t.assignee_id else None
        out.append(d)
    return out


async def _ticket_or_404(db, org_id: str, ticket_id: str) -> Ticket:
    """Accepts either the uuid id or the human ticket number (FOS-YYYY-NNNNN)."""
    ticket = await db.get(Ticket, ticket_id)
    if ticket is None and ticket_id.upper().startswith("FOS-"):
        rows = await db.execute(select(Ticket).where(Ticket.ticket_number == ticket_id.upper()))
        ticket = rows.scalar_one_or_none()
    if not ticket or ticket.org_id != org_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Ticket not found")
    return ticket


@router.get("", response_model=list[TicketOut])
async def list_tickets(
    db: DB,
    org_id: OrgId,
    user: CurrentUser,
    status_filter: str | None = Query(None, alias="status"),
    category: str | None = None,
    priority: str | None = None,
    assignee_id: str | None = None,
    mine: bool = False,
    q: str | None = Query(None, max_length=100),
    offset: int = 0,
    limit: int = Query(100, le=200),
):
    stmt = select(Ticket).where(Ticket.org_id == org_id)
    role = UserRole(user.role)
    if role == UserRole.WORKER:
        stmt = stmt.where(Ticket.assignee_id == user.id)
    elif role == UserRole.REQUESTER or mine:
        stmt = stmt.where(Ticket.requester_id == user.id)
    for col, val in {
        "status": status_filter,
        "category": category,
        "priority": priority,
        "assignee_id": assignee_id,
    }.items():
        if val is not None:
            stmt = stmt.where(getattr(Ticket, col) == val)
    if q:
        from sqlalchemy import or_

        stmt = stmt.where(or_(Ticket.title.ilike(f"%{q}%"), Ticket.description.ilike(f"%{q}%")))
    rows = await db.execute(stmt.order_by(Ticket.created_at.desc()).offset(offset).limit(limit))
    return await _attach_names(db, list(rows.scalars().all()))


@router.post("", response_model=TicketOut, status_code=201)
async def create_ticket(db: DB, org_id: OrgId, body: TicketCreate, user: CurrentUser):
    ticket = await svc.create_ticket(db, user, org_id, body)
    return (await _attach_names(db, [ticket]))[0]


@router.get("/recommend-workers", response_model=list[WorkerRecommendation], dependencies=[MANAGER_PLUS])
async def recommend_workers(
    db: DB, org_id: OrgId, category: str = Query(...), limit: int = Query(5, le=10)
):
    """Facos Match: rank available workers for a category."""
    workers = (
        await db.execute(
            select(User).where(
                User.org_id == org_id,
                User.role == UserRole.WORKER,
                User.is_available.is_(True),
            )
        )
    ).scalars().all()
    ranked = WorkerMatcher.rank(list(workers), category, limit)
    return [
        WorkerRecommendation(
            worker_id=r["worker"].id,
            full_name=r["worker"].full_name,
            skills=r["worker"].skills or [],
            rating=r["worker"].rating,
            active_load=r["worker"].active_load,
            completed_jobs=r["worker"].completed_jobs,
            match_score=r["match_score"],
            reasons=r["reasons"],
        )
        for r in ranked
    ]


@router.post("/emergency", response_model=TicketOut, status_code=201)
async def emergency(db: DB, org_id: OrgId, body: EmergencyTrigger, user: CurrentUser):
    return await svc.trigger_emergency(db, user, org_id, body)


@router.get("/{ticket_id}", response_model=TicketOut)
async def get_ticket(db: DB, org_id: OrgId, user: CurrentUser, ticket_id: str):
    ticket = await _ticket_or_404(db, org_id, ticket_id)
    _authorize_read(user, ticket)
    return ticket


def _authorize_read(user: CurrentUser, ticket: Ticket) -> None:
    role = UserRole(user.role)
    if role in {UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN}:
        return
    if user.id in {ticket.requester_id, ticket.assignee_id}:
        return
    raise HTTPException(status.HTTP_403_FORBIDDEN, "Not allowed to view this ticket")


@router.patch("/{ticket_id}", response_model=TicketOut, dependencies=[MANAGER_PLUS])
async def update_ticket(db: DB, org_id: OrgId, ticket_id: str, body: TicketUpdate, user: CurrentUser):
    ticket = await _ticket_or_404(db, org_id, ticket_id)
    changes = {}
    for field, value in body.model_dump(exclude_unset=True).items():
        new_val = value.value if hasattr(value, "value") else value
        old_val = getattr(ticket, field)
        if old_val != new_val:
            changes[field] = {"old": str(old_val), "new": str(new_val)}
            setattr(ticket, field, new_val)
    if changes:
        await svc._audit(db, user, "ticket.updated", "ticket", ticket.id, changes)
        await db.flush()
    return ticket


@router.post("/{ticket_id}/assign", response_model=TicketOut, dependencies=[MANAGER_PLUS])
async def assign(db: DB, org_id: OrgId, ticket_id: str, body: AssignRequest, user: CurrentUser):
    try:
        return await svc.assign_worker(db, user, org_id, ticket_id, body)
    except svc.WorkflowError as e:
        raise HTTPException(status.HTTP_409_CONFLICT, str(e))


@router.post("/{ticket_id}/progress", response_model=TicketOut)
async def progress(db: DB, org_id: OrgId, ticket_id: str, body: ProgressUpdate, user: CurrentUser):
    try:
        return await svc.update_progress(db, user, org_id, ticket_id, body)
    except svc.WorkflowError as e:
        raise HTTPException(status.HTTP_409_CONFLICT, str(e))


@router.post("/{ticket_id}/complete")
async def complete(db: DB, org_id: OrgId, ticket_id: str, body: CompleteRequest, user: CurrentUser):
    try:
        ticket, otp = await svc.complete_work(db, user, org_id, ticket_id, body)
    except svc.WorkflowError as e:
        raise HTTPException(status.HTTP_409_CONFLICT, str(e))
    return {"detail": "Work submitted for verification", "ticket": TicketOut.model_validate(ticket)}


@router.post("/{ticket_id}/verify", response_model=TicketOut)
async def verify(db: DB, org_id: OrgId, ticket_id: str, body: VerificationRequest, user: CurrentUser):
    try:
        return await svc.verify_ticket(db, user, org_id, ticket_id, body)
    except svc.WorkflowError as e:
        raise HTTPException(status.HTTP_409_CONFLICT, str(e))


@router.post("/{ticket_id}/reopen", response_model=TicketOut)
async def reopen(db: DB, org_id: OrgId, ticket_id: str, body: ReopenRequest, user: CurrentUser):
    try:
        return await svc.reopen_ticket(db, user, org_id, ticket_id, body.reason)
    except svc.WorkflowError as e:
        raise HTTPException(status.HTTP_409_CONFLICT, str(e))


@router.post("/{ticket_id}/escalate", response_model=TicketOut, dependencies=[MANAGER_PLUS])
async def escalate(db: DB, org_id: OrgId, ticket_id: str, body: ReopenRequest, user: CurrentUser):
    try:
        return await svc.escalate_ticket(db, user, org_id, ticket_id, body.reason)
    except svc.WorkflowError as e:
        raise HTTPException(status.HTTP_409_CONFLICT, str(e))


# --------------------------- timeline & comments ---------------------------


@router.get("/{ticket_id}/events", response_model=list[TicketEventOut])
async def ticket_events(db: DB, org_id: OrgId, user: CurrentUser, ticket_id: str):
    ticket = await _ticket_or_404(db, org_id, ticket_id)
    _authorize_read(user, ticket)
    rows = await db.execute(
        select(TicketEvent).where(TicketEvent.ticket_id == ticket.id).order_by(TicketEvent.created_at)
    )
    return list(rows.scalars().all())


@router.get("/{ticket_id}/comments", response_model=list[CommentOut])
async def list_comments(db: DB, org_id: OrgId, user: CurrentUser, ticket_id: str):
    ticket = await _ticket_or_404(db, org_id, ticket_id)
    _authorize_read(user, ticket)
    rows = await db.execute(
        select(Comment).where(Comment.ticket_id == ticket.id).order_by(Comment.created_at)
    )
    return list(rows.scalars().all())


@router.post("/{ticket_id}/comments", response_model=CommentOut, status_code=201)
async def add_comment(db: DB, org_id: OrgId, ticket_id: str, body: CommentCreate, user: CurrentUser):
    try:
        return await svc.add_comment(db, user, org_id, ticket_id, body.content)
    except svc.WorkflowError as e:
        raise HTTPException(status.HTTP_404_NOT_FOUND, str(e))
