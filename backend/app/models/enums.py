import enum


class UserRole(str, enum.Enum):
    REQUESTER = "requester"
    WORKER = "worker"
    MANAGER = "manager"
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class TicketStatus(str, enum.Enum):
    OPEN = "open"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    AWAITING_VERIFICATION = "awaiting_verification"
    CLOSED = "closed"
    REOPENED = "reopened"
    ESCALATED = "escalated"


class TicketPriority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    EMERGENCY = "emergency"


class AssetCriticality(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AssetStatus(str, enum.Enum):
    OPERATIONAL = "operational"
    UNDER_MAINTENANCE = "under_maintenance"
    DECOMMISSIONED = "decommissioned"


class PMFrequency(str, enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"
    SEMI_ANNUAL = "semi_annual"
    ANNUAL = "annual"


class SLABreachType(str, enum.Enum):
    RESPONSE = "response"
    RESOLUTION = "resolution"


# 14 service categories (mirrors frontend ServiceCategory keys)
class ServiceCategory(str, enum.Enum):
    PLUMBING = "plumbing"
    ELECTRICAL = "electrical"
    CARPENTRY = "carpentry"
    CLEANING = "cleaning"
    HVAC = "hvac"
    CIVIL = "civil"
    FURNITURE = "furniture"
    NETWORK = "network"
    IT_SUPPORT = "it_support"
    HOSTEL_MAINTENANCE = "hostel_maintenance"
    TRANSPORT = "transport"
    SECURITY = "security"
    WATER_SUPPLY = "water_supply"
    LIFT = "lift"


TICKET_TRANSITIONS: dict[str, set[str]] = {
    # from_status -> allowed target statuses
    TicketStatus.OPEN: {
        TicketStatus.ASSIGNED,
        TicketStatus.CLOSED,
    },
    TicketStatus.ASSIGNED: {
        TicketStatus.IN_PROGRESS,
        TicketStatus.OPEN,
    },
    TicketStatus.IN_PROGRESS: {
        TicketStatus.AWAITING_VERIFICATION,
        TicketStatus.ESCALATED,
    },
    TicketStatus.AWAITING_VERIFICATION: {
        TicketStatus.CLOSED,
        TicketStatus.REOPENED,
    },
    TicketStatus.REOPENED: {
        TicketStatus.ASSIGNED,
        TicketStatus.ESCALATED,
    },
    TicketStatus.ESCALATED: {
        TicketStatus.ASSIGNED,
        TicketStatus.CLOSED,
    },
    TicketStatus.CLOSED: set(),
}
