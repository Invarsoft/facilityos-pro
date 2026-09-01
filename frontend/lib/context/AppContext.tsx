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
import { useAuthStore } from '@/src/features/auth/store';
import { api } from '@/src/shared/api/client';
import {
  mapApiTicket,
  mapApiEvent,
  mapApiComment,
  mapApiNotification,
  mapApiUser,
  mapApiSlaRule,
  mapApiAsset,
  mapApiPmSchedule,
  mapApiAuditLog,
} from '@/src/features/tickets/adapter';
import type { ApiTicket } from '@/src/features/tickets/api';

interface AppContextType {
  // Tenant & Branding
  organizations: Organization[];
  activeOrg: Organization;
  setActiveOrg: (org: Organization) => void;
  addOrganization: (orgData: Partial<Organization>) => Organization;
  updateOrgBranding: (orgId: string, updates: Partial<Organization>) => void;
  toggleOrgService: (orgId: string, serviceId: string) => void;

  // Live backend mode (real API data when logged in with JWT)
  serverMode: boolean;
  refreshServerTickets: () => Promise<void>;
  loadTicketDetail: (id: string) => Promise<void>;

  // Active Role & User Session
  isAuthenticated: boolean;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  currentUser: UserProfile | null;
  users: UserProfile[];
  login: (user: UserProfile) => void;
  loginWithToken: (token: string, pin: string) => boolean;
  loginWithEmail: (email: string, pass: string) => boolean;
  signUpStudent: (name: string, email: string, room?: string) => UserProfile;
  addUser: (user: UserProfile) => void;
  updateUser: (userId: string, updates: Partial<UserProfile>) => void;
  deleteUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: Role) => void;
  logout: () => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Tickets & Workflow Operations
  tickets: Ticket[];
  getFilteredTickets: () => Ticket[];
  getTicketById: (id: string) => Ticket | undefined;
  createTicket: (data: Partial<Ticket>) => Promise<Ticket>;
  assignWorker: (ticketId: string, workerId: string, notes?: string) => Promise<void>;
  updateTicketProgress: (
    ticketId: string,
    progress: number,
    notes?: string,
    photos?: string[],
    materials?: string[]
  ) => Promise<void>;
  completeWorkerTask: (ticketId: string, notes?: string, photos?: string[]) => Promise<void>;
  verifyTicket: (
    ticketId: string,
    isResolved: boolean,
    rating?: number,
    feedback?: string,
    reopenReason?: string,
    otp?: string
  ) => Promise<void>;
  reopenTicket: (ticketId: string, reason: string) => Promise<void>;
  escalateTicket: (ticketId: string, level?: number) => Promise<void>;
  addComment: (ticketId: string, content: string) => Promise<void>;
  triggerEmergency: (title: string, category: string, location: string, description: string) => Promise<Ticket>;

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const [tickets, setTickets] = useState<Ticket[]>(DEMO_TICKETS);
  const [assets, setAssets] = useState<Asset[]>(DEMO_ASSETS);
  const [preventiveSchedules, setPreventiveSchedules] = useState<PreventiveMaintenanceSchedule[]>(DEMO_PREVENTIVE_SCHEDULES);
  const [slaRules, setSlaRules] = useState<SLARule[]>(DEMO_SLA_RULES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [aiDrawerOpen, setAiDrawerOpen] = useState<boolean>(false);

  // ---- Live backend mode: when signed in with a real JWT, all data comes
  // from the FastAPI server. Offline/fallback → legacy demo data. ----
  const authUser = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [serverMode, setServerMode] = useState(false);

  const refreshServerTickets = async () => {
    if (!authUser) return;
    const apiTickets = await api.get<ApiTicket[]>('/tickets');
    setTickets(apiTickets.map((t) => mapApiTicket(t, authUser)));
  };

  useEffect(() => {
    if (!accessToken || !authUser) {
      setServerMode(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const apiTickets = await api.get<ApiTicket[]>('/tickets');
        if (cancelled) return;
        setTickets(apiTickets.map((t) => mapApiTicket(t, authUser)));
        setServerMode(true);
        // notifications + workers enrich in background — failures are non-fatal
        try {
          const notifs = await api.get<any[]>('/notifications');
          if (!cancelled) setNotifications(notifs.map(mapApiNotification));
        } catch { /* non-fatal */ }
        try {
          if (authUser.role !== 'requester') {
            const workers = await api.get<any[]>('/users/workers');
            if (!cancelled) {
              const mapped = workers.map(mapApiUser);
              setUsers((prev) => [
                ...prev.filter((p) => !mapped.some((m) => m.email === p.email)),
                ...mapped,
              ]);
            }
          }
        } catch { /* non-fatal */ }
        try {
          const rules = await api.get<any[]>('/sla-rules');
          if (!cancelled) setSlaRules(rules.map(mapApiSlaRule));
        } catch { /* requester lacks permission — keep demo rules */ }
        try {
          const assets = await api.get<any[]>('/assets');
          if (!cancelled) setAssets(assets.map(mapApiAsset));
        } catch { /* non-fatal */ }
        try {
          const pms = await api.get<any[]>('/pm-schedules');
          if (!cancelled) setPreventiveSchedules(pms.map(mapApiPmSchedule));
        } catch { /* non-fatal */ }
        try {
          const logs = await api.get<any[]>('/audit-logs');
          if (!cancelled) setAuditLogs(logs.map(mapApiAuditLog));
        } catch { /* non-fatal */ }
      } catch (err) {
        // backend unreachable → demo fallback; real API errors → still server mode
        if (!cancelled && !(err instanceof TypeError)) setServerMode(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, authUser?.id]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.remove('dark');
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

  const loginWithToken = (tokenInput: string, pinInput: string): boolean => {
    const matchedUser =
      users.find(
        (u) =>
          u.accessTokenNo?.toLowerCase() === tokenInput.toLowerCase() ||
          tokenInput.toUpperCase().includes('WOXSEN')
      ) || users[0];

    if (matchedUser) {
      login(matchedUser);
      return true;
    }
    return false;
  };

  const loginWithEmail = (emailInput: string, passInput: string): boolean => {
    const matchedUser =
      users.find((u) => u.email.toLowerCase() === emailInput.toLowerCase()) || users[0];

    if (matchedUser) {
      login(matchedUser);
      return true;
    }
    return false;
  };

  const signUpStudent = (name: string, email: string, room?: string): UserProfile => {
    const newStudent: UserProfile = {
      id: 'user-student-' + Date.now(),
      orgId: 'woxsen-university',
      name: name.trim() || 'New Woxsen Student',
      email: email.trim() || 'student@woxsen.edu.in',
      phone: '+91 98000 ' + Math.floor(10005 + Math.random() * 89999),
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Woxsen Student',
      roomOrUnit: room?.trim() || 'Hostel A - Room 101',
      accessTokenNo: `WOX-${Math.floor(1000 + Math.random() * 9000)}-T`,
      accessPin: '2026',
    };

    setUsers((prev) => [...prev, newStudent]);
    login(newStudent);
    return newStudent;
  };

  const addUser = (user: UserProfile) => {
    setUsers((prev) => [user, ...prev]);
  };

  const updateUser = (userId: string, updates: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const updateUserRole = (userId: string, newRole: Role) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
      setActiveRoleState(newRole);
    }
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
    // Backend already scopes by org + role — return as-is in server mode
    if (serverMode) return tickets;
    if (activeOrg.id === 'global-facilityos-all' || (activeRole === 'super_admin' && activeOrg.id === 'global-facilityos-all')) {
      return tickets;
    }
    return tickets.filter((t) => t.orgId === activeOrg.id);
  };

  const getTicketById = (id: string) => {
    return tickets.find((t) => t.id === id);
  };

  const createTicket = async (data: Partial<Ticket>): Promise<Ticket> => {
    if (serverMode) {
      const created = await api.post<ApiTicket>('/tickets', {
        title: data.title || 'Untitled Request',
        description: data.description || '',
        category: data.serviceId || 'plumbing',
        priority: data.priority === 'normal' ? 'medium' : data.priority === 'critical' ? 'high' : data.priority || 'medium',
        location: data.location || undefined,
        room: data.room || undefined,
        photos: data.attachments || [],
      });
      const mapped = mapApiTicket(created, authUser);
      setTickets((prev) => [mapped, ...prev]);
      return mapped;
    }

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

  const assignWorker = async (ticketId: string, workerId: string, notes?: string) => {
    if (serverMode) {
      await api.post(`/tickets/${ticketId}/assign`, { worker_id: workerId });
      await refreshServerTickets();
      return;
    }
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
          notes: notes || `Assigned based on trade match score. Skill: ${worker.skills?.[0] || 'Technician'}`,
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

  const updateTicketProgress = async (
    ticketId: string,
    progress: number,
    notes?: string,
    photos?: string[],
    materials?: string[]
  ) => {
    if (serverMode) {
      await api.post(`/tickets/${ticketId}/progress`, {
        progress,
        note: notes || undefined,
        photos: photos || [],
      });
      await refreshServerTickets();
      return;
    }
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

  const completeWorkerTask = async (ticketId: string, notes?: string, photos?: string[]) => {
    if (serverMode) {
      await api.post(`/tickets/${ticketId}/complete`, {
        note: notes || undefined,
        photos: photos || [],
      });
      await refreshServerTickets();
      return;
    }
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
  };

  const verifyTicket = async (
    ticketId: string,
    isResolved: boolean,
    rating?: number,
    feedback?: string,
    reopenReason?: string,
    otp?: string
  ) => {
    if (serverMode) {
      if (isResolved) {
        await api.post(`/tickets/${ticketId}/verify`, {
          otp_code: otp || '0000',
          rating: rating || 5,
          feedback: feedback || undefined,
        });
      } else {
        await api.post(`/tickets/${ticketId}/reopen`, { reason: reopenReason || 'Issue still exists' });
      }
      await refreshServerTickets();
      return;
    }
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

  const reopenTicket = async (ticketId: string, reason: string) => {
    await verifyTicket(ticketId, false, undefined, undefined, reason);
  };

  const escalateTicket = async (ticketId: string, level = 2) => {
    if (serverMode) {
      await api.post(`/tickets/${ticketId}/escalate`, { reason: `Escalated to level ${level} by ${currentUser?.name || 'manager'}` });
      await refreshServerTickets();
      return;
    }
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

  const addComment = async (ticketId: string, content: string) => {
    if (serverMode) {
      await api.post(`/tickets/${ticketId}/comments`, { content });
      await refreshServerTickets();
      return;
    }
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

  const triggerEmergency = async (
    title: string,
    category: string,
    location: string,
    description: string
  ): Promise<Ticket> => {
    if (serverMode) {
      const created = await api.post<ApiTicket>('/tickets/emergency', {
        title,
        description,
        category,
        location: location || undefined,
      });
      const mapped = mapApiTicket(created, authUser);
      setTickets((prev) => [mapped, ...prev]);
      return mapped;
    }
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
    if (serverMode) {
      api.post(`/notifications/${id}/read`).catch(() => { /* non-fatal */ });
    }
  };

  // Fetch immutable timeline events + comments for the ticket detail page
  const loadTicketDetail = async (id: string) => {
    if (!serverMode) return;
    try {
      const events = await api.get<any[]>(`/tickets/${id}/events`);
      const comments = await api.get<any[]>(`/tickets/${id}/comments`);
      setTickets((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, timeline: events.map(mapApiEvent), comments: comments.map(mapApiComment) }
            : t
        )
      );
    } catch { /* non-fatal — page still renders base ticket */ }
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
        serverMode,
        refreshServerTickets,
        loadTicketDetail,
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
        loginWithToken,
        loginWithEmail,
        signUpStudent,
        addUser,
        updateUser,
        deleteUser,
        updateUserRole,
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
