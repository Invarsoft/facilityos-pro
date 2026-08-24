export type Role =
  | 'student'
  | 'resident'
  | 'staff'
  | 'employee'
  | 'worker'
  | 'technician'
  | 'warden'
  | 'manager'
  | 'org_admin'
  | 'admin'
  | 'super_admin';

export type FacilityType =
  | 'university'
  | 'apartment'
  | 'office'
  | 'hostel'
  | 'school'
  | 'hospital'
  | 'residential'
  | 'commercial'
  | 'other';

export type Priority = 'low' | 'normal' | 'high' | 'critical' | 'emergency';

export type TicketStatus =
  | 'new'
  | 'under_review'
  | 'assigned'
  | 'accepted'
  | 'in_progress'
  | 'on_hold'
  | 'completed'
  | 'awaiting_verification'
  | 'resolved'
  | 'closed'
  | 'reopened'
  | 'escalated'
  | 'cancelled';

export interface ServiceCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  defaultPriority: Priority;
  enabled: boolean;
  estimatedHours: number;
}

export interface Organization {
  id: string;
  name: string;
  code: string; // e.g. WOXSEN-2026
  type: FacilityType;
  location: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  welcomeMessage: string;
  contactEmail: string;
  contactPhone: string;
  verified: boolean;
  totalServicesCount: number;
  enabledServiceIds: string[];
}

export interface UserProfile {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar: string;
  department?: string;
  building?: string;
  roomOrUnit?: string;
  accessTokenNo?: string;
  accessPin?: string;
  skills?: string[]; // for workers
  rating?: number; // for workers
  totalJobsCompleted?: number;
  currentWorkload?: number;
  isAvailable?: boolean;
}

export interface TicketTimelineItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: Role;
  actorAvatar?: string;
  action: string;
  notes?: string;
  oldStatus?: TicketStatus;
  newStatus?: TicketStatus;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: Role;
  authorAvatar?: string;
  content: string;
  createdAt: string;
  attachments?: string[];
}

export interface Ticket {
  id: string; // e.g. FOS-2026-004821
  orgId: string;
  title: string;
  description: string;
  serviceId: string; // e.g. plumbing
  serviceCategory: string; // e.g. Plumbing & Sanitary
  priority: Priority;
  status: TicketStatus;
  
  // Location Hierarchy
  location: string;
  building?: string;
  block?: string;
  floor?: string;
  room?: string;
  assetId?: string;
  assetName?: string;

  // People
  requesterId: string;
  requesterName: string;
  requesterRole: Role;
  requesterContact: string;

  assignedWorkerId?: string;
  assignedWorkerName?: string;
  assignedWorkerAvatar?: string;
  assignedWorkerSkill?: string;
  assignedWorkerPhone?: string;
  assignedWorkerRating?: number;

  managerId?: string;
  managerName?: string;

  // SLA & Timestamps
  createdAt: string;
  updatedAt: string;
  preferredVisitTime?: string;
  deadline: string; // SLA deadline
  slaHours: number;
  slaBreached: boolean;
  escalationLevel: number; // 0: Normal, 1: Manager, 2: Admin

  // Artifacts & Work Evidence
  attachments: string[];
  workProgress: number; // 0 - 100%
  workNotes?: string;
  workEvidencePhotos?: string[];
  materialsUsed?: string[];

  // Resolution & Verification
  verifiedByRequester?: boolean;
  satisfactionRating?: number; // 1-5 Stars
  verificationFeedback?: string;
  reopenReason?: string;
  reopenCount: number;

  // Auditing
  timeline: TicketTimelineItem[];
  comments: TicketComment[];
  isEmergency?: boolean;
}

export interface Asset {
  id: string;
  assetTag: string; // e.g. AC-204-B
  name: string;
  category: string;
  location: string;
  building?: string;
  room?: string;
  installationDate: string;
  warrantyUntil?: string;
  condition: 'Optimal' | 'Requires Attention' | 'Under Repair';
  qrCodeUrl?: string;
  lastServiced?: string;
  nextScheduledService?: string;
}

export interface SLARule {
  id: string;
  category: string;
  priority: Priority;
  responseTimeHours: number;
  resolutionTimeHours: number;
}

export interface PreventiveMaintenanceSchedule {
  id: string;
  title: string;
  assetCategory: string;
  facility: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Yearly';
  nextDueDate: string;
  assignedWorkerName?: string;
  status: 'Scheduled' | 'In Progress' | 'Overdue' | 'Completed';
  lastCompleted?: string;
}

export interface AuditLogItem {
  id: string;
  user: string;
  action: string;
  ticketId?: string;
  timestamp: string;
  details: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'ticket' | 'sla' | 'escalation' | 'system';
  ticketId?: string;
}
