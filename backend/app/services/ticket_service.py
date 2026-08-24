import secrets
from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core import security
from app.models.enums import TicketPriority, TicketStatus, UserRole
from app.models.support import AuditLog, Notification, Verification
from app.models.ticket import Comment, Ticket, TicketEvent
from app.models.user import User
from app.schemas.tickets import (
    AssignRequest,
    CompleteRequest,
    EmergencyTrigger,
    ProgressUpdate,
    TicketCreate,
    VerificationRequest,
)
from app.repositories.base import BaseRepository
from app.services.sla_engine import SLAEngine, assert_transition


class WorkflowError(Exception):
    """Raised for illegal workflow operations (maps to HTTP 409)."""


class TicketRepository(BaseRepository[Ticket]):
    model = Ticket


def _now() -> datetime:
    return datetime.utcnow()


async def _emit(
    db: AsyncSession,
    ticket: Ticket,
    event_type: str,
    message: str,
    actor: User | None = None,
) -> None:
    """Append immutable timeline entry."""
    db.add(
        TicketEvent(
            ticket_id=ticket.id,
            actor_id=actor.id if actor else None,
            actor_name=actor.full_name if actor else None,
            event_type=event_type,
            message=message,
        )
    )


async def _notify(
    db: AsyncSession,
    user_id: str | None,
    org_id: str | None,
    ntype: str,
    title: str,
    message: str = "",
    ticket_id: str | None = None,
    link: str | None = None,
) -> None:
    if not user_id:
        return
    db.add(
        Notification(
            user_id=user_id,
            org_id=org_id,
            type=ntype,
            title=title,
            message=message,
            ticket_id=ticket_id,
            link=link or (f"/requests/{ticket_id}" if ticket_id else None),
        )
    )


async def _audit(
    db: AsyncSession,
    actor: User | None,
    action: str,
    entity_type: str,
    entity_id: str,
    changes: dict | None = None,
) -> None:
    db.add(
        AuditLog(
            org_id=getattr(actor, "org_id", None),
            actor_id=actor.id if actor else None,
            actor_name=actor.full_name if actor else None,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            changes=changes,
        )
    )


async def generate_ticket_number(db: AsyncSession, org_id: str) -> str:
    """Globally-unique sequential ticket numbers (FOS-YYYY-NNNNN)."""
    year = datetime.utcnow().year
    result = await db.execute(select(func.count(Ticket.id)))
    seq = int(result.scalar_one()) + 1
    return f"FOS-{year}-{seq:05d}"


# ----------------------------- commands ------------------------------


async def create_ticket(
    db: AsyncSession, requester: User, org_id: str, data: TicketCreate
) -> Ticket:
    now = _now()
    resp_due, res_due = await SLAEngine.resolve_deadlines(
        db, org_id, data.category, data.priority
    )
    ticket = Ticket(
        org_id=org_id,
        ticket_number=await generate_ticket_number(db, org_id),
        title=data.title,
        description=data.description,
        category=data.category,
        priority=data.priority.value,
        status=TicketStatus.OPEN,
        requester_id=requester.id,
        location=data.location,
        room=data.room,
        photos=data.photos,
        sla_response_due=resp_due,
        sla_resolution_due=res_due,
    )
    repo = TicketRepository(db)
    repo.add(ticket)
    await db.flush()
    await _emit(db, ticket, "created", f"Request created ({data.priority.value} priority)", requester)
    await _audit(db, requester, "ticket.created", "ticket", ticket.id)
    # notify org managers that a new ticket arrived
    managers = await db.execute(
        select(User).where(User.org_id == org_id, User.role == UserRole.MANAGER)
    )
    for mgr in managers.scalars():
        await _notify(
            db, mgr.id, org_id, "ticket_created",
            f"New {data.category} request", ticket.title, ticket.id,
        )
    return ticket


async def trigger_emergency(
    db: AsyncSession, requester: User, org_id: str, data: EmergencyTrigger
) -> Ticket:
    """Emergency dispatch: forced emergency priority + 2h resolution SLA."""
    ticket = await create_ticket(
        db,
        requester,
        org_id,
        TicketCreate(
            title=f"🚨 EMERGENCY: {data.title}",
            description=data.description,
            category=data.category,
            priority=TicketPriority.EMERGENCY,
            location=data.location,
            room=data.room,
        ),
    )
    ticket.is_emergency = True
    await db.flush()
    await _emit(db, ticket, "emergency", "EMERGENCY DISPATCH triggered", requester)
    admins = await db.execute(select(User).where(User.org_id == org_id))
    for u in admins.scalars():
        if u.role in {UserRole.MANAGER, UserRole.ADMIN}:
            await _notify(db, u.id, org_id, "emergency",
                          "🚨 Emergency dispatched", ticket.title, ticket.id)
    return ticket


async def assign_worker(
    db: AsyncSession, actor: User, org_id: str, ticket_id: str, data: AssignRequest
) -> Ticket:
    repo = TicketRepository(db)
    ticket = await repo.get_scoped(org_id, ticket_id)
    if not ticket:
        raise WorkflowError("Ticket not found")
    worker = await db.get(User, data.worker_id)
    if not worker or worker.org_id != org_id or worker.role != UserRole.WORKER:
        raise WorkflowError("Worker not found in this organization")
    if not worker.is_available:
        raise WorkflowError("Worker is currently unavailable")

    try:
        assert_transition(ticket.status, TicketStatus.ASSIGNED)
    except ValueError as e:
        raise WorkflowError(str(e))

    old_assignee = ticket.assignee_id
    ticket.assignee_id = worker.id
    ticket.status = TicketStatus.ASSIGNED
    ticket.assigned_at = _now()
    if ticket.first_response_at is None:
        ticket.first_response_at = _now()
    worker.active_load = (worker.active_load or 0) + 1
    await db.flush()

    label = worker.full_name
    await _emit(db, ticket, "assigned", f"Assigned to {label}", actor)
    await _audit(db, actor, "ticket.assigned", "ticket", ticket.id,
                 {"assignee": {"old": old_assignee, "new": worker.id}})
    await _notify(db, worker.id, org_id, "assigned",
                  f"You've been assigned: {ticket.ticket_number}", ticket.title, ticket.id)
    if ticket.requester_id != actor.id:
        await _notify(db, ticket.requester_id, org_id, "status_change",
                      "Worker assigned to your request", ticket.title, ticket.id)
    return ticket


async def update_progress(
    db: AsyncSession, actor: User, org_id: str, ticket_id: str, data: ProgressUpdate
) -> Ticket:
    repo = TicketRepository(db)
    ticket = await repo.get_scoped(org_id, ticket_id)
    if not ticket:
        raise WorkflowError("Ticket not found")

    role = UserRole(actor.role)
    is_assigned_worker = (
        role == UserRole.WORKER and ticket.assignee_id == actor.id
    )
    if not is_assigned_worker and role not in {UserRole.MANAGER, UserRole.ADMIN, UserRole.SUPER_ADMIN}:
        raise WorkflowError("Only the assigned worker or a manager can update progress")
    if ticket.assignee_id is None:
        raise WorkflowError("Cannot update progress on an unassigned ticket")

    try:
        assert_transition(ticket.status, TicketStatus.IN_PROGRESS)
    except ValueError as e:
        raise WorkflowError(str(e))

    old = ticket.progress
    ticket.status = TicketStatus.IN_PROGRESS
    ticket.progress = data.progress
    if data.photos:
        ticket.photos = list(ticket.photos or []) + list(data.photos)
    await db.flush()

    await _emit(db, ticket, "progress",
                f"Progress updated to {data.progress}%"
                + (f" — {data.note}" if data.note else ""),
                actor)
    await _audit(db, actor, "ticket.progress_updated", "ticket", ticket.id,
                 {"progress": {"old": old, "new": data.progress}})
    await _notify(db, ticket.requester_id, org_id, "status_change",
                  f"Work in progress ({data.progress}%)", ticket.title, ticket.id)
    return ticket


async def complete_work(
    db: AsyncSession, actor: User, org_id: str, ticket_id: str, data: CompleteRequest
) -> tuple[Ticket, str]:
    """
    Worker marks work done → moves to AWAITING_VERIFICATION.
    Returns (ticket, otp) — OTP goes only to the requester via notification.
    NOTE: deliberately does NOT touch the actor's session/role.
    """
    repo = TicketRepository(db)
    ticket = await repo.get_scoped(org_id, ticket_id)
    if not ticket:
        raise WorkflowError("Ticket not found")
    if UserRole(actor.role) != UserRole.WORKER or ticket.assignee_id != actor.id:
        raise WorkflowError("Only the assigned worker can complete this ticket")
    try:
        assert_transition(ticket.status, TicketStatus.AWAITING_VERIFICATION)
    except ValueError as e:
        raise WorkflowError(str(e))

    ticket.status = TicketStatus.AWAITING_VERIFICATION
    ticket.progress = 100
    ticket.resolved_at = _now()
    if data.photos:
        ticket.photos = list(ticket.photos or []) + list(data.photos)

    otp = "".join(secrets.choice("0123456789") for _ in range(4))
    verification = Verification(ticket_id=ticket.id, otp_code=otp)
    existing = await db.execute(
        select(Verification).where(Verification.ticket_id == ticket.id)
    )
    prev = existing.scalar_one_or_none()
    if prev:
        prev.otp_code = otp
    else:
        db.add(verification)
    await db.flush()

    await _emit(db, ticket, "completed",
                "Work completed — awaiting requester verification"
                + (f". Evidence: {len(data.photos)} photo(s)" if data.photos else ""),
                actor)
    await _notify(db, ticket.requester_id, org_id, "verification_ready",
                  "Work completed — verify to close",
                  f"Verify completed work — OTP {otp}", ticket.id)
    return ticket, otp


async def verify_ticket(
    db: AsyncSession, actor: User, org_id: str, ticket_id: str, data: VerificationRequest
) -> Ticket:
    repo = TicketRepository(db)
    ticket = await repo.get_scoped(org_id, ticket_id)
    if not ticket:
        raise WorkflowError("Ticket not found")
    if ticket.requester_id != actor.id:
        raise WorkflowError("Only the requester can verify this ticket")
    try:
        assert_transition(ticket.status, TicketStatus.CLOSED)
    except ValueError as e:
        raise WorkflowError(str(e))

    result = await db.execute(
        select(Verification).where(Verification.ticket_id == ticket.id)
    )
    verification = result.scalar_one_or_none()
    approved = bool(verification and verification.otp_code == data.otp_code.strip())

    if not approved:
        raise WorkflowError("Invalid verification code")

    verification.rating = data.rating
    verification.verdict = "approved"
    verification.feedback = data.feedback
    verification.verified_by = actor.id

    ticket.status = TicketStatus.CLOSED
    ticket.closed_at = _now()
    ticket.verification_rating = float(data.rating)
    await db.flush()

    if ticket.assignee_id:
        worker = await db.get(User, ticket.assignee_id)
        if worker:
            worker.active_load = max((worker.active_load or 0) - 1, 0)
            worker.completed_jobs = (worker.completed_jobs or 0) + 1

    await _emit(db, ticket, "verified",
                f"Verified by requester — rated {data.rating}/5", actor)
    await _audit(db, actor, "ticket.verified", "ticket", ticket.id,
                 {"status": {"old": "awaiting_verification", "new": "closed"},
                  "rating": {"old": None, "new": data.rating}})
    await _notify(db, ticket.assignee_id, org_id, "closed",
                  f"{ticket.ticket_number} verified & closed ({data.rating}★)",
                  ticket.title, ticket.id)
    return ticket


async def reopen_ticket(
    db: AsyncSession, actor: User, org_id: str, ticket_id: str, reason: str
) -> Ticket:
    repo = TicketRepository(db)
    ticket = await repo.get_scoped(org_id, ticket_id)
    if not ticket:
        raise WorkflowError("Ticket not found")
    if ticket.requester_id != actor.id:
        raise WorkflowError("Only the requester can reopen this ticket")
    try:
        assert_transition(ticket.status, TicketStatus.REOPENED)
    except ValueError as e:
        raise WorkflowError(str(e))

    ticket.status = TicketStatus.REOPENED
    ticket.reopen_count = (ticket.reopen_count or 0) + 1
    ticket.resolved_at = None
    ticket.progress = min(ticket.progress or 0, 80)
    await db.flush()

    await _emit(db, ticket, "reopened", f"Reopened by requester: {reason}", actor)
    await _audit(db, actor, "ticket.reopened", "ticket", ticket.id)
    managers = await db.execute(
        select(User).where(User.org_id == org_id, User.role.in_([UserRole.MANAGER, UserRole.ADMIN]))
    )
    for m in managers.scalars():
        await _notify(db, m.id, org_id, "reopened",
                      f"{ticket.ticket_number} reopened", reason[:200], ticket.id)
    return ticket


async def escalate_ticket(
    db: AsyncSession, actor: User, org_id: str, ticket_id: str, reason: str
) -> Ticket:
    repo = TicketRepository(db)
    ticket = await repo.get_scoped(org_id, ticket_id)
    if not ticket:
        raise WorkflowError("Ticket not found")
    try:
        assert_transition(ticket.status, TicketStatus.ESCALATED)
    except ValueError as e:
        raise WorkflowError(str(e))

    ticket.status = TicketStatus.ESCALATED
    ticket.escalated = True
    await db.flush()

    await _emit(db, ticket, "escalated", f"Escalated: {reason}", actor)
    await _audit(db, actor, "ticket.escalated", "ticket", ticket.id)
    admins = await db.execute(
        select(User).where(User.org_id == org_id, User.role.in_([UserRole.ADMIN]))
    )
    for a in admins.scalars():
        await _notify(db, a.id, org_id, "escalation",
                      f"{ticket.ticket_number} escalated", reason[:200], ticket.id)
    return ticket


async def add_comment(
    db: AsyncSession, actor: User, org_id: str, ticket_id: str, content: str
) -> Comment:
    repo = TicketRepository(db)
    ticket = await repo.get_scoped(org_id, ticket_id)
    if not ticket:
        raise WorkflowError("Ticket not found")
    comment = Comment(
        ticket_id=ticket.id, author_id=actor.id,
        author_name=actor.full_name, content=content,
    )
    db.add(comment)
    await db.flush()
    await _emit(db, ticket, "comment", f"Comment added by {actor.full_name}", actor)
    recipients = {ticket.requester_id}
    if ticket.assignee_id:
        recipients.add(ticket.assignee_id)
    for uid in recipients - {actor.id}:
        await _notify(db, uid, org_id, "comment",
                      f"New comment on {ticket.ticket_number}",
                      content[:200], ticket.id)
    return comment


# ------------------------- SLA breach sweep ---------------------------


async def sweep_sla_breaches(db: AsyncSession) -> list[str]:
    """
    Called periodically by the background scheduler. Marks newly-breached
    tickets and auto-escalates them with notifications.
    """
    breached_ids: list[str] = []
    result = await db.execute(
        select(Ticket).options(selectinload(Ticket.events)).where(
            Ticket.status.notin_([TicketStatus.CLOSED])
        )
    )
    for ticket in result.scalars():
        for breach in SLAEngine.evaluate(ticket):
            breached_ids.append(ticket.id)
            if breach == "response":
                ticket.sla_response_breached = True
            else:
                ticket.sla_resolution_breached = True
                if ticket.status in {TicketStatus.OPEN, TicketStatus.ASSIGNED,
                                     TicketStatus.IN_PROGRESS, TicketStatus.REOPENED}:
                    ticket.escalated = True
                    ticket.status = TicketStatus.ESCALATED
            await _emit(db, ticket, "sla_breach",
                        f"SLA {breach} target missed — escalated automatically", None)
            managers = await db.execute(
                select(User).where(User.org_id == ticket.org_id,
                                   User.role.in_([UserRole.MANAGER, UserRole.ADMIN]))
            )
            for m in managers.scalars():
                await _notify(db, m.id, ticket.org_id, "sla_breach",
                              f"SLA breach: {ticket.ticket_number}",
                              f"{breach.capitalize()} SLA missed", ticket.id)
    return breached_ids
