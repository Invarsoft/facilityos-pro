from datetime import datetime, timedelta

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.asset import SLARule
from app.models.enums import TICKET_TRANSITIONS, TicketPriority, TicketStatus


class SLAEngine:
    """
    Resolves response/resolution deadlines from per-org SLA rules at
    ticket creation. Deadlines are NEVER hardcoded in callers.
    """

    FALLBACK_RULES: dict[tuple[str, str], tuple[float, float]] = {
        # (category=priority="*") wildcard fallback when org has no rule configured
        ("*", "emergency"): (0.5, 2.0),
        ("*", "high"): (1.0, 8.0),
        ("*", "medium"): (4.0, 24.0),
        ("*", "low"): (8.0, 72.0),
    }

    @classmethod
    async def resolve_deadlines(
        cls,
        db: AsyncSession,
        org_id: str,
        category: str,
        priority: TicketPriority,
        now: datetime | None = None,
    ) -> tuple[datetime | None, datetime | None]:
        now = now or datetime.utcnow()
        result = await db.execute(
            select(SLARule).where(
                SLARule.org_id == org_id,
                SLARule.category == category,
                SLARule.priority == priority.value,
            )
        )
        rule = result.scalar_one_or_none()
        if rule is None:
            pair = cls.FALLBACK_RULES.get(("*", priority.value), (4.0, 24.0))
            return (
                now + timedelta(hours=pair[0]),
                now + timedelta(hours=pair[1]),
            )
        return (
            now + timedelta(hours=rule.response_hours) if rule.response_hours else None,
            now + timedelta(hours=rule.resolution_hours) if rule.resolution_hours else None,
        )

    @staticmethod
    def is_response_breached(ticket) -> bool:
        if ticket.first_response_at or not ticket.sla_response_due:
            return False
        return datetime.utcnow() > ticket.sla_response_due

    @staticmethod
    def is_resolution_breached(ticket) -> bool:
        if not ticket.sla_resolution_due:
            return False
        if ticket.status in {TicketStatus.CLOSED}:
            return False
        return datetime.utcnow() > ticket.sla_resolution_due

    @classmethod
    def evaluate(cls, ticket) -> list[str]:
        """Return breach types detected for a ticket ('response', 'resolution')."""
        breaches: list[str] = []
        if not ticket.sla_response_breached and cls.is_response_breached(ticket):
            breaches.append("response")
        if not ticket.sla_resolution_breached and cls.is_resolution_breached(ticket):
            breaches.append("resolution")
        return breaches


def assert_transition(current: str, target: str) -> None:
    allowed = TICKET_TRANSITIONS.get(TicketStatus(current), set())
    if TicketStatus(target) not in allowed:
        raise ValueError(
            f"Illegal transition: '{current}' -> '{target}'. "
            f"Allowed from '{current}': {[s.value for s in allowed]}"
        )
