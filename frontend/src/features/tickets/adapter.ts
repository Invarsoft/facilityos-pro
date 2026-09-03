import type { ApiTicket, TicketEvent, TicketComment } from "@/src/features/tickets/api";
import type { SessionUser } from "@/src/features/auth/store";
import type { Ticket, TicketStatus, Role } from "@/lib/types";

const STATUS_MAP: Record<string, TicketStatus> = {
  open: "new",
  assigned: "assigned",
  in_progress: "in_progress",
  awaiting_verification: "awaiting_verification",
  closed: "closed",
  reopened: "reopened",
  escalated: "escalated",
};

const PRIORITY_MAP: Record<string, Ticket["priority"]> = {
  low: "low",
  medium: "normal",
  high: "high",
  emergency: "emergency",
};

const ROLE_BY_APP_ROLE: Record<string, Role> = {
  requester: "student",
  worker: "worker",
  manager: "manager",
  admin: "org_admin",
  super_admin: "super_admin",
};

const CATEGORY_LABELS: Record<string, string> = {
  plumbing: "Plumbing & Sanitary",
  electrical: "Electrical",
  carpentry: "Carpentry",
  cleaning: "Cleaning & Housekeeping",
  hvac: "AC & HVAC",
  civil: "Civil Maintenance",
  furniture: "Furniture & Fixtures",
  network: "Wi-Fi & Network",
  it_support: "IT Support & AV",
  hostel_maintenance: "Hostel Maintenance",
  transport: "Transport & Shuttle",
  security: "Security & Access Control",
  water_supply: "Water Supply",
  lift: "Lift & Elevator",
};

export function categoryLabel(key: string): string {
  return CATEGORY_LABELS[key] ?? key;
}

/** Convert a backend ticket into the frontend Ticket shape used by all pages. */
export function mapApiTicket(t: ApiTicket, viewer: SessionUser | null): Ticket {
  const createdMs = new Date(t.created_at).getTime();
  const dueMs = t.sla_resolution_due ? new Date(t.sla_resolution_due).getTime() : NaN;
  const slaHours =
    Number.isFinite(dueMs) && dueMs > createdMs
      ? Math.max(1, Math.round((dueMs - createdMs) / 3_600_000))
      : 24;

  return {
    id: t.ticket_number,
    orgId: t.org_id,
    title: t.title,
    description: t.description,
    serviceId: t.category,
    serviceCategory: categoryLabel(t.category),
    priority: PRIORITY_MAP[t.priority] ?? "normal",
    status: STATUS_MAP[t.status] ?? "open",
    location: t.location ?? "",
    room: t.room ?? undefined,
    requesterId: t.requester_id,
    requesterName:
      t.requester_name ?? viewer?.full_name ?? "Requester",
    requesterRole:
      (viewer && viewer.id === t.requester_id
        ? ROLE_BY_APP_ROLE[viewer.role]
        : "student") ?? "student",
    requesterContact: "",
    assignedWorkerId: t.assignee_id ?? undefined,
    assignedWorkerName: t.assignee_name ?? undefined,
    managerId: undefined,
    managerName: undefined,
    createdAt: t.created_at,
    updatedAt: t.updated_at,
    deadline: t.sla_resolution_due ?? t.created_at,
    slaHours,
    slaBreached: t.sla_response_breached || t.sla_resolution_breached,
    escalationLevel: t.escalated ? 1 : 0,
    attachments: t.photos ?? [],
    workProgress: t.progress ?? 0,
    satisfactionRating: t.verification_rating ?? undefined,
    reopenCount: t.reopen_count ?? 0,
    timeline: [],
    comments: [],
    isEmergency: t.is_emergency,
  };
}

export function mapApiEvent(e: TicketEvent): Ticket["timeline"][number] {
  const message = e.message;
  const lower = message.toLowerCase();
  let newStatus: TicketStatus | undefined;
  for (const [api, frontend] of Object.entries(STATUS_MAP)) {
    if (lower.includes(api.replace("_", " ")) || lower.includes(api)) {
      newStatus = frontend;
      break;
    }
  }
  return {
    id: e.id,
    timestamp: e.created_at,
    actorName: e.actor_name ?? "System",
    actorRole: "org_admin",
    action: e.event_type.charAt(0).toUpperCase() + e.event_type.slice(1).replace(/_/g, " "),
    notes: message,
    newStatus,
  };
}

export function mapApiComment(c: TicketComment): Ticket["comments"][number] {
  return {
    id: c.id,
    ticketId: c.ticket_id,
    authorId: c.author_id,
    authorName: c.author_name,
    authorRole: "student",
    content: c.content,
    createdAt: c.created_at,
  };
}

// ---- notifications ----

export interface ApiNotification {
  id: string;
  type: string | null;
  title: string;
  message: string | null;
  ticket_id: string | null;
  read_at: string | null;
  created_at: string;
}

export function mapApiNotification(n: ApiNotification) {
  const type: "ticket" | "sla" | "escalation" | "system" =
    n.type === "sla_breach" ? "sla" : n.type === "escalation" ? "escalation" : "ticket";
  return {
    id: n.id,
    title: n.title,
    message: n.message ?? "",
    timestamp: new Date(n.created_at).toLocaleString(),
    read: Boolean(n.read_at),
    type,
    ticketId: n.ticket_id ?? undefined,
  };
}

// ---- users ----

export interface ApiUser {
  id: string;
  org_id: string | null;
  email: string;
  full_name: string;
  role: string;
  skills: string[] | null;
  assigned_blocks?: string[] | null;
  rating: number | null;
  active_load: number | null;
  completed_jobs: number | null;
  is_available: boolean;
  avatar_url?: string | null;
}

export function mapApiUser(u: ApiUser) {
  return {
    id: u.id,
    orgId: u.org_id ?? "",
    name: u.full_name,
    email: u.email,
    role: (ROLE_BY_APP_ROLE[u.role] ?? "student") as Role,
    avatar: u.avatar_url || "",
    skills: u.skills ?? [],
    assignedBlocks: u.assigned_blocks ?? [],
    rating: u.rating ?? undefined,
    totalJobsCompleted: u.completed_jobs ?? 0,
    currentWorkload: u.active_load ?? 0,
    isAvailable: u.is_available,
  };
}

// ---- SLA rules ----

export interface ApiSlaRule {
  id: string;
  category: string;
  priority: string;
  response_hours: number | null;
  resolution_hours: number | null;
}

export function mapApiSlaRule(r: ApiSlaRule) {
  return {
    id: r.id,
    category: r.category,
    priority: (PRIORITY_MAP[r.priority] ?? "normal") as Ticket["priority"],
    responseTimeHours: r.response_hours ?? 4,
    resolutionTimeHours: r.resolution_hours ?? 24,
  };
}

// ---- assets ----

export interface ApiAsset {
  id: string;
  name: string;
  category: string | null;
  qr_tag: string;
  building: string | null;
  room: string | null;
  status: string;
  warranty_until: string | null;
}

export function mapApiAsset(a: ApiAsset) {
  const condition =
    a.status === "operational"
      ? "Optimal"
      : a.status === "under_maintenance"
        ? "Under Repair"
        : "Requires Attention";
  return {
    id: a.id,
    assetTag: a.qr_tag,
    name: a.name,
    category: a.category ?? "General",
    location: a.building ?? "Main Building",
    building: a.building ?? undefined,
    room: a.room ?? undefined,
    installationDate: "",
    warrantyUntil: a.warranty_until ?? undefined,
    condition: condition as "Optimal" | "Requires Attention" | "Under Repair",
  };
}

// ---- preventive maintenance ----

export interface ApiPmSchedule {
  id: string;
  title: string;
  asset_id: string | null;
  frequency: string;
  next_due: string;
  last_completed_at: string | null;
  is_active: boolean;
}

const FREQ_MAP: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  semi_annual: "Yearly",
  annual: "Yearly",
};

export function mapApiPmSchedule(p: ApiPmSchedule) {
  const due = p.next_due ? new Date(p.next_due) : null;
  const overdue = due ? due.getTime() < Date.now() : false;
  return {
    id: p.id,
    title: p.title,
    assetCategory: "General",
    facility: "Main Facility",
    frequency: (FREQ_MAP[p.frequency] ?? "Monthly") as "Daily" | "Weekly" | "Monthly" | "Quarterly" | "Yearly",
    nextDueDate: p.next_due,
    assignedWorkerName: undefined,
    status: (!p.is_active ? "Completed" : overdue ? "Overdue" : "Scheduled") as
      | "Scheduled"
      | "In Progress"
      | "Overdue"
      | "Completed",
    lastCompleted: p.last_completed_at ?? undefined,
  };
}

// ---- audit logs ----

export interface ApiAuditLog {
  id: string;
  actor_name: string | null;
  action: string;
  entity_id: string | null;
  changes: Record<string, { old: unknown; new: unknown }> | null;
  created_at: string;
}

export function mapApiAuditLog(a: ApiAuditLog) {
  return {
    id: a.id,
    user: a.actor_name ?? "System",
    action: a.action.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    ticketId: a.entity_id ?? undefined,
    timestamp: new Date(a.created_at).toLocaleString(),
    details: a.changes ? JSON.stringify(a.changes) : a.action,
  };
}
