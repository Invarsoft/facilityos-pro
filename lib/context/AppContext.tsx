'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Organization,
  UserProfile,
  Role,
  Ticket,
  TicketStatus,
  Asset,
  AppNotification,
  AuditLogItem,
  PreventiveMaintenanceSchedule,
  SLARule,
} from '../types';
import {
  DEMO_ORGANIZATIONS,
  GLOBAL_SUPER_ADMIN_ORG,
  ALL_SERVICE_CATEGORIES,
  DEMO_USERS,
  DEMO_TICKETS,
  DEMO_ASSETS,
  DEMO_SLA_RULES,
  DEMO_PREVENTIVE_SCHEDULES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../mockData';

interface AppContextType {
  // Tenant & Branding
  organizations: Organization[];
  activeOrg: Organization;
  setActiveOrg: (org: Organization) => void;
  addOrganization: (orgData: Partial<Organization>) => Organization;
  updateOrgBranding: (orgId: string, updates: Partial<Organization>) => void;
  toggleOrgService: (orgId: string, serviceId: string) => void;

  // Active Role & User Session
  isAuthenticated: boolean;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  currentUser: UserProfile | null;
  users: UserProfile[];
  login: (user: UserProfile) => void;
  logout: () => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Tickets & Workflow Operations
  tickets: Ticket[];
  getFilteredTickets: () => Ticket[];
  getTicketById: (id: string) => Ticket | undefined;
  createTicket: (data: Partial<Ticket>) => Ticket;
  assignWorker: (ticketId: string, workerId: string, notes?: string) => void;
  updateTicketProgress: (
    ticketId: string,
    progress: number,
    notes?: string,
    photos?: string[],
    materials?: string[]
  ) => void;
  completeWorkerTask: (ticketId: string, notes?: string, photos?: string[]) => void;
  verifyTicket: (
    ticketId: string,
    isResolved: boolean,
    rating?: number,
    feedback?: string,
    reopenReason?: string
  ) => void;
  reopenTicket: (ticketId: string, reason: string) => void;
  escalateTicket: (ticketId: string, level?: number) => void;
  addComment: (ticketId: string, content: string) => void;
  triggerEmergency: (title: string, category: string, location: string, description: string) => Ticket;

  // Facilities & Assets
  assets: Asset[];
  addAsset: (asset: Asset) => void;

  // Preventive Maintenance & SLA
  preventiveSchedules: PreventiveMaintenanceSchedule[];
  addPreventiveSchedule: (sched: PreventiveMaintenanceSchedule) => void;
  slaRules: SLARule[];

  // Notifications & Audit Logs
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  auditLogs: AuditLogItem[];
  
  // AI Assistant drawer
  aiDrawerOpen: boolean;
  setAiDrawerOpen: (open: boolean) => void;
  
  // Quick Reset Demo Data
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>(DEMO_ORGANIZATIONS);
  const [activeOrg, setActiveOrgState] = useState<Organization>(DEMO_ORGANIZATIONS[0]);
  const [activeRole, setActiveRoleState] = useState<Role>('student');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState<UserProfile[]>(DEMO_USERS);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  const [tickets, setTickets] = useState<Ticket[]>(DEMO_TICKETS);
  const [assets, setAssets] = useState<Asset[]>(DEMO_ASSETS);
  const [preventiveSchedules, setPreventiveSchedules] = useState<PreventiveMaintenanceSchedule[]>(DEMO_PREVENTIVE_SCHEDULES);
  const [slaRules] = useState<SLARule[]>(DEMO_SLA_RULES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [aiDrawerOpen, setAiDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTickets = localStorage.getItem('facilityos_tickets');
      if (savedTickets) {
        try {
          setTickets(JSON.parse(savedTickets));
        } catch (e) {
          console.error('Failed to parse saved tickets', e);
        }
      }
      const savedAuth = localStorage.getItem('facilityos_auth');
      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          setIsAuthenticated(authData.isAuthenticated);
          setCurrentUser(authData.currentUser);
          if (authData.currentUser) setActiveRoleState(authData.currentUser.role);
        } catch (e) {
          console.error('Failed to parse auth state', e);
        }
      }
    }
  }, []);

  const saveTickets = (updatedTickets: Ticket[]) => {
    setTickets(updatedTickets);
    if (typeof window !== 'undefined') {
      localStorage.setItem('facilityos_tickets', JSON.stringify(updatedTickets));
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setActiveOrg = (org: Organization) => {
    setActiveOrgState(org);
    if (org.type === 'university') {
      if (activeRole === 'resident' || activeRole === 'employee') setActiveRoleState('student');
    } else if (org.type === 'apartment') {
      if (activeRole === 'student' || activeRole === 'employee') setActiveRoleState('resident');
    } else if (org.type === 'office') {
      if (activeRole === 'student' || activeRole === 'resident') setActiveRoleState('employee');
    }
  };

  const addOrganization = (data: Partial<Organization>): Organization => {
    const newOrg: Organization = {
      id: data.id || 'org-' + Date.now(),
      name: data.name || 'New Facility',
      code: data.code?.toUpperCase() || `FACILITY-${Math.floor(1000 + Math.random() * 9000)}`,
      type: data.type || 'other',
      location: data.location || 'City, State',
      logo: data.logo || '🏢',
      primaryColor: data.primaryColor || '#1e3a8a',
      secondaryColor: '#3b82f6',
      welcomeMessage: data.welcomeMessage || `Welcome to ${data.name} Operations Hub.`,
      contactEmail: data.contactEmail || `admin@facilityos.io`,
      contactPhone: data.contactPhone || `+91 99000 00000`,
      verified: true,
      totalServicesCount: ALL_SERVICE_CATEGORIES.length,
      enabledServiceIds: data.enabledServiceIds || ALL_SERVICE_CATEGORIES.map((s) => s.id),
    };

    setOrganizations((prev) => [...prev, newOrg]);
    setActiveOrgState(newOrg);
    addAuditLog('Facility Admin', `Registered New Facility: ${newOrg.name}`, `Code: ${newOrg.code}`);
    return newOrg;
  };

  const setActiveRole = (role: Role) => {
    setActiveRoleState(role);

    if (role === 'super_admin') {
      setActiveOrgState(GLOBAL_SUPER_ADMIN_ORG);
      const superAdminUser: UserProfile = {
        id: 'user-super-admin-01',
        orgId: GLOBAL_SUPER_ADMIN_ORG.id,
        name: 'FacilityOS System Super Admin',
        email: 'superadmin@facilityos.io',
        phone: '+1 800 FACOS SYS',
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        department: 'FacilityOS Platform Headquarters',
        accessTokenNo: 'FOS-SUPER-01',
        accessPin: '9999',
      };
      setCurrentUser(superAdminUser);
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('facilityos_auth', JSON.stringify({ isAuthenticated: true, currentUser: superAdminUser }));
      }
    } else if (role === 'org_admin') {
      const orgAdminUser: UserProfile = {
        id: `user-admin-${activeOrg.id}`,
        orgId: activeOrg.id,
        name: `${activeOrg.name} Admin`,
        email: activeOrg.contactEmail || `admin@${activeOrg.id}.com`,
        phone: activeOrg.contactPhone || '+91 99000 11223',
        role: 'org_admin',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        department: `${activeOrg.name} Executive Office`,
        accessTokenNo: `${activeOrg.code}-ADM`,
        accessPin: '1010',
      };
      setCurrentUser(orgAdminUser);
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('facilityos_auth', JSON.stringify({ isAuthenticated: true, currentUser: orgAdminUser }));
      }
    } else if (isAuthenticated) {
      const matchedUser = users.find((u) => u.orgId === activeOrg.id && u.role === role) || users.find((u) => u.role === role);
      if (matchedUser) {
        setCurrentUser(matchedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('facilityos_auth', JSON.stringify({ isAuthenticated: true, currentUser: matchedUser }));
        }
      }
    }
  };

  const login = (user: UserProfile) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setActiveRoleState(user.role);
    if (user.role === 'super_admin') {
      setActiveOrgState(GLOBAL_SUPER_ADMIN_ORG);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('facilityos_auth', JSON.stringify({ isAuthenticated: true, currentUser: user }));
    }
    addAuditLog(user.name, 'User Logged In', `Role: ${user.role}`);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('facilityos_auth');
    }
    router.push('/login');
  };

  const updateOrgBranding = (orgId: string, updates: Partial<Organization>) => {
    setOrganizations((prev) =>
      prev.map((o) => (o.id === orgId ? { ...o, ...updates } : o))
    );
    if (activeOrg.id === orgId) {
      setActiveOrgState((prev) => ({ ...prev, ...updates }));
    }
  };

  const toggleOrgService = (orgId: string, serviceId: string) => {
    setOrganizations((prev) =>
      prev.map((o) => {
        if (o.id === orgId) {
          const isEnabled = o.enabledServiceIds.includes(serviceId);
          const updatedServiceIds = isEnabled
            ? o.enabledServiceIds.filter((id) => id !== serviceId)
            : [...o.enabledServiceIds, serviceId];

          return { ...o, enabledServiceIds: updatedServiceIds };
        }
        return o;
      })
    );

    if (activeOrg.id === orgId) {
      const isEnabled = activeOrg.enabledServiceIds.includes(serviceId);
      const updatedServiceIds = isEnabled
        ? activeOrg.enabledServiceIds.filter((id) => id !== serviceId)
        : [...activeOrg.enabledServiceIds, serviceId];

      setActiveOrgState((prev) => ({ ...prev, enabledServiceIds: updatedServiceIds }));
    }

    addAuditLog(currentUser?.name || 'Admin', `Toggled Service ${serviceId} for ${orgId}`, `Action: Toggle Service`, undefined);
  };

  const addAuditLog = (user: string, action: string, details: string, ticketId?: string) => {
    const newLog: AuditLogItem = {
      id: 'al-' + Date.now(),
      user,
      action,
      ticketId,
      timestamp: new Date().toLocaleString(),
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addNotification = (
    title: string,
    message: string,
    type: 'ticket' | 'sla' | 'escalation' | 'system',
    ticketId?: string
  ) => {
    const newNotif: AppNotification = {
      id: 'n-' + Date.now(),
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
      ticketId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const getFilteredTickets = () => {
    if (activeOrg.id === 'global-facilityos-all' || (activeRole === 'super_admin' && activeOrg.id === 'global-facilityos-all')) {
      return tickets;
    }
    return tickets.filter((t) => t.orgId === activeOrg.id);
  };

  const getTicketById = (id: string) => {
    return tickets.find((t) => t.id === id);
  };

  const createTicket = (data: Partial<Ticket>): Ticket => {
    const ticketSeq = Math.floor(100000 + Math.random() * 900000);
    const ticketId = `FOS-2026-${ticketSeq}`;
    
    const categoryObj = ALL_SERVICE_CATEGORIES.find((s) => s.id === data.serviceId);

    const newTicket: Ticket = {
      id: ticketId,
      orgId: activeOrg.id,
      title: data.title || 'Untitled Request',
      description: data.description || '',
      serviceId: data.serviceId || 'plumbing',
      serviceCategory: categoryObj ? categoryObj.name : 'General Maintenance',
      priority: data.priority || 'normal',
      status: 'new',
      location: data.location || 'Main Campus',
      building: data.building || 'Main Building',
      block: data.block || 'Block A',
      floor: data.floor || 'Floor 1',
      room: data.room || 'Room 101',
      assetId: data.assetId,
      assetName: data.assetName,

      requesterId: currentUser?.id || 'user-anon',
      requesterName: currentUser?.name || 'Aarav Sharma',
      requesterRole: currentUser?.role || 'student',
      requesterContact: currentUser?.phone || currentUser?.email || '+91 98765 43210',

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferredVisitTime: data.preferredVisitTime || 'Flexible',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      slaHours: 24,
      slaBreached: false,
      escalationLevel: 0,

      attachments: data.attachments || [],
      workProgress: 0,
      reopenCount: 0,

      timeline: [
        {
          id: 't-new-' + Date.now(),
          timestamp: new Date().toLocaleString(),
          actorName: currentUser?.name || 'Requester',
          actorRole: currentUser?.role || 'student',
          actorAvatar: currentUser?.avatar,
          action: 'Service Request Created',
          notes: 'Ticket submitted via FacilityOS Wizard',
          newStatus: 'new',
        },
      ],
      comments: [],
      isEmergency: data.isEmergency || data.priority === 'emergency',
    };

    saveTickets([newTicket, ...tickets]);
    addAuditLog(currentUser?.name || 'Requester', 'Created Ticket ' + ticketId, `Service: ${newTicket.serviceCategory}`, ticketId);
    addNotification(
      'Service Request Created',
      `Your request ${ticketId} has been created and is under manager review.`,
      'ticket',
      ticketId
    );

    return newTicket;
  };

  const assignWorker = (ticketId: string, workerId: string, notes?: string) => {
    const worker = users.find((u) => u.id === workerId);
    if (!worker) return;

    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        const newTimelineItem = {
          id: 't-' + Date.now(),
          timestamp: new Date().toLocaleString(),
          actorName: currentUser?.name || 'Manager',
          actorRole: currentUser?.role || 'manager',
          actorAvatar: currentUser?.avatar,
          action: `Assigned to ${worker.name}`,
          notes: notes || `Assigned based on AI match score. Skill: ${worker.skills?.[0] || 'Technician'}`,
          oldStatus: t.status,
          newStatus: 'assigned' as TicketStatus,
        };

        return {
          ...t,
          status: 'assigned' as TicketStatus,
          assignedWorkerId: worker.id,
          assignedWorkerName: worker.name,
          assignedWorkerAvatar: worker.avatar,
          assignedWorkerSkill: worker.skills?.[0] || 'Technician',
          assignedWorkerPhone: worker.phone,
          assignedWorkerRating: worker.rating || 4.8,
          managerId: currentUser?.id,
          managerName: currentUser?.name,
          updatedAt: new Date().toISOString(),
          timeline: [...t.timeline, newTimelineItem],
        };
      }
      return t;
    });

    saveTickets(updated);
    addAuditLog(currentUser?.name || 'Manager', `Assigned Ticket ${ticketId}`, `Assigned to worker ${worker.name}`, ticketId);
    addNotification(
      'Worker Assigned',
      `Worker ${worker.name} has been assigned to ticket ${ticketId}.`,
      'ticket',
      ticketId
    );
  };

  const updateTicketProgress = (
    ticketId: string,
    progress: number,
    notes?: string,
    photos?: string[],
    materials?: string[]
  ) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        const newStatus: TicketStatus = progress === 0 ? 'accepted' : 'in_progress';
        const newTimelineItem = {
          id: 't-' + Date.now(),
          timestamp: new Date().toLocaleString(),
          actorName: currentUser?.name || 'Technician',
          actorRole: currentUser?.role || 'worker',
          actorAvatar: currentUser?.avatar,
          action: `Work Progress Updated to ${progress}%`,
          notes: notes || `Technician updated progress to ${progress}%`,
          oldStatus: t.status,
          newStatus,
        };

        return {
          ...t,
          status: newStatus,
          workProgress: progress,
          workNotes: notes || t.workNotes,
          workEvidencePhotos: photos ? [...(t.workEvidencePhotos || []), ...photos] : t.workEvidencePhotos,
          materialsUsed: materials ? [...(t.materialsUsed || []), ...materials] : t.materialsUsed,
          updatedAt: new Date().toISOString(),
          timeline: [...t.timeline, newTimelineItem],
        };
      }
      return t;
    });

    saveTickets(updated);
    addAuditLog(currentUser?.name || 'Technician', `Updated progress for ${ticketId}`, `Progress: ${progress}%`, ticketId);
  };

  const completeWorkerTask = (ticketId: string, notes?: string, photos?: string[]) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        const newTimelineItem = {
          id: 't-' + Date.now(),
          timestamp: new Date().toLocaleString(),
          actorName: currentUser?.name || 'Technician',
          actorRole: currentUser?.role || 'worker',
          actorAvatar: currentUser?.avatar,
          action: 'Worker Marked Work Completed',
          notes: notes || 'Work finished by technician. Submitted for requester verification.',
          oldStatus: t.status,
          newStatus: 'awaiting_verification' as TicketStatus,
        };

        return {
          ...t,
          status: 'awaiting_verification' as TicketStatus,
          workProgress: 100,
          workNotes: notes || t.workNotes,
          workEvidencePhotos: photos ? [...(t.workEvidencePhotos || []), ...photos] : t.workEvidencePhotos,
          updatedAt: new Date().toISOString(),
          timeline: [...t.timeline, newTimelineItem],
        };
      }
      return t;
    });

    saveTickets(updated);
    addAuditLog(
      currentUser?.name || 'Technician',
      `Completed Work on ${ticketId}`,
      'Status set to Awaiting Verification. Requester notified.',
      ticketId
    );
    addNotification(
      'Work Completed — Verification Required',
      `Your service request ${ticketId} has been marked as completed. Please confirm whether the issue is resolved.`,
      'ticket',
      ticketId
    );

    const requesterRole = activeOrg.type === 'university' ? 'student' : activeOrg.type === 'apartment' ? 'resident' : 'employee';
    setActiveRoleState(requesterRole);
  };

  const verifyTicket = (
    ticketId: string,
    isResolved: boolean,
    rating?: number,
    feedback?: string,
    reopenReason?: string
  ) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        if (isResolved) {
          const timelineItem = {
            id: 't-' + Date.now(),
            timestamp: new Date().toLocaleString(),
            actorName: currentUser?.name || 'Requester',
            actorRole: currentUser?.role || 'student',
            actorAvatar: currentUser?.avatar,
            action: 'Resolution Verified & Closed by Requester',
            notes: `Satisfaction Rating: ${rating || 5} Stars. Feedback: ${feedback || 'No comments'}`,
            oldStatus: t.status,
            newStatus: 'closed' as TicketStatus,
          };

          return {
            ...t,
            status: 'closed' as TicketStatus,
            verifiedByRequester: true,
            satisfactionRating: rating || 5,
            verificationFeedback: feedback || '',
            updatedAt: new Date().toISOString(),
            timeline: [...t.timeline, timelineItem],
          };
        } else {
          const timelineItem = {
            id: 't-' + Date.now(),
            timestamp: new Date().toLocaleString(),
            actorName: currentUser?.name || 'Requester',
            actorRole: currentUser?.role || 'student',
            actorAvatar: currentUser?.avatar,
            action: 'Resolution Rejected & Ticket Reopened',
            notes: `Reason: ${reopenReason || 'Issue still exists'}. Sent back to Manager/Warden.`,
            oldStatus: t.status,
            newStatus: 'reopened' as TicketStatus,
          };

          return {
            ...t,
            status: 'reopened' as TicketStatus,
            verifiedByRequester: false,
            reopenReason: reopenReason || 'Issue still exists',
            reopenCount: t.reopenCount + 1,
            workProgress: 50,
            escalationLevel: t.escalationLevel + 1,
            updatedAt: new Date().toISOString(),
            timeline: [...t.timeline, timelineItem],
          };
        }
      }
      return t;
    });

    saveTickets(updated);

    if (isResolved) {
      addAuditLog(currentUser?.name || 'Requester', `Verified & Closed ${ticketId}`, `Rating: ${rating || 5} Stars`, ticketId);
      addNotification('Ticket Closed', `Request ${ticketId} has been verified resolved and closed.`, 'ticket', ticketId);
    } else {
      addAuditLog(currentUser?.name || 'Requester', `Reopened Ticket ${ticketId}`, `Reason: ${reopenReason}`, ticketId);
      addNotification(
        'Ticket Reopened Alert',
        `Requester reported issue still exists for ${ticketId}. Manager intervention required.`,
        'escalation',
        ticketId
      );
    }
  };

  const reopenTicket = (ticketId: string, reason: string) => {
    verifyTicket(ticketId, false, undefined, undefined, reason);
  };

  const escalateTicket = (ticketId: string, level = 2) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        const timelineItem = {
          id: 't-' + Date.now(),
          timestamp: new Date().toLocaleString(),
          actorName: currentUser?.name || 'Manager',
          actorRole: currentUser?.role || 'manager',
          action: `Escalated to Level ${level} (Admin)`,
          notes: 'High priority intervention triggered.',
          oldStatus: t.status,
          newStatus: 'escalated' as TicketStatus,
        };

        return {
          ...t,
          status: 'escalated' as TicketStatus,
          escalationLevel: level,
          updatedAt: new Date().toISOString(),
          timeline: [...t.timeline, timelineItem],
        };
      }
      return t;
    });

    saveTickets(updated);
    addAuditLog(currentUser?.name || 'Manager', `Escalated ${ticketId}`, `Escalation Level: ${level}`, ticketId);
    addNotification('Ticket Escalated', `Ticket ${ticketId} has been escalated to Admin team.`, 'escalation', ticketId);
  };

  const addComment = (ticketId: string, content: string) => {
    const updated = tickets.map((t) => {
      if (t.id === ticketId) {
        const newComment = {
          id: 'c-' + Date.now(),
          ticketId,
          authorId: currentUser?.id || 'c-user',
          authorName: currentUser?.name || 'User',
          authorRole: currentUser?.role || 'student',
          authorAvatar: currentUser?.avatar || '',
          content,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        return {
          ...t,
          comments: [...t.comments, newComment],
          updatedAt: new Date().toISOString(),
        };
      }
      return t;
    });

    saveTickets(updated);
  };

  const triggerEmergency = (
    title: string,
    category: string,
    location: string,
    description: string
  ): Ticket => {
    const ticketSeq = Math.floor(100000 + Math.random() * 900000);
    const ticketId = `FOS-EMERGENCY-${ticketSeq}`;

    const emergencyTicket: Ticket = {
      id: ticketId,
      orgId: activeOrg.id,
      title: `🚨 EMERGENCY: ${title}`,
      description,
      serviceId: category,
      serviceCategory: category,
      priority: 'emergency',
      status: 'under_review',
      location,
      building: location,
      requesterId: currentUser?.id || 'emg-user',
      requesterName: currentUser?.name || 'Aarav Sharma',
      requesterRole: currentUser?.role || 'student',
      requesterContact: currentUser?.phone || currentUser?.email || '+91 98765 43210',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      slaHours: 2,
      slaBreached: false,
      escalationLevel: 2,
      attachments: [],
      workProgress: 0,
      reopenCount: 0,
      isEmergency: true,
      timeline: [
        {
          id: 't-emg-' + Date.now(),
          timestamp: new Date().toLocaleString(),
          actorName: currentUser?.name || 'Requester',
          actorRole: currentUser?.role || 'student',
          action: '🚨 EMERGENCY DISPATCH TRIGGERED',
          notes: 'High priority alert dispatched to on-call manager & quick response team.',
          newStatus: 'under_review',
        },
      ],
      comments: [],
    };

    saveTickets([emergencyTicket, ...tickets]);
    addAuditLog(currentUser?.name || 'Requester', `Triggered EMERGENCY ${ticketId}`, title, ticketId);
    addNotification(
      '🚨 EMERGENCY DISPATCH ACTIVE',
      `Emergency request ${ticketId} logged at ${location}. Dispatchers notified.`,
      'escalation',
      ticketId
    );

    return emergencyTicket;
  };

  const addAsset = (asset: Asset) => {
    setAssets((prev) => [asset, ...prev]);
  };

  const addPreventiveSchedule = (sched: PreventiveMaintenanceSchedule) => {
    setPreventiveSchedules((prev) => [sched, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetDemoData = () => {
    setTickets(DEMO_TICKETS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('facilityos_tickets');
      localStorage.removeItem('facilityos_auth');
    }
  };

  return (
    <AppContext.Provider
      value={{
        organizations,
        activeOrg,
        setActiveOrg,
        addOrganization,
        updateOrgBranding,
        toggleOrgService,

        isAuthenticated,
        activeRole,
        setActiveRole,
        currentUser,
        users,
        login,
        logout,

        theme,
        toggleTheme,

        tickets,
        getFilteredTickets,
        getTicketById,
        createTicket,
        assignWorker,
        updateTicketProgress,
        completeWorkerTask,
        verifyTicket,
        reopenTicket,
        escalateTicket,
        addComment,
        triggerEmergency,

        assets,
        addAsset,

        preventiveSchedules,
        addPreventiveSchedule,
        slaRules,

        notifications,
        markNotificationRead,
        auditLogs,

        aiDrawerOpen,
        setAiDrawerOpen,

        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
