'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { getRoleDisplayName } from '@/lib/utils';
import { AddFacilityModal } from '@/src/shared/components/layout/AddFacilityModal';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Wrench,
  Building,
  Building2,
  Box,
  CalendarCheck,
  Clock,
  Shield,
  FileText,
  AlertTriangle,
  MapPin,
  Activity,
  Star,
  CheckCircle2,
  PlusCircle,
  FilePlus,
  QrCode,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export default function AdminCommandCenterPage() {
  const { getFilteredTickets, activeOrg, activeRole, users, auditLogs, currentUser } = useApp();
  const tickets = getFilteredTickets();
  const [addFacilityModalOpen, setAddFacilityModalOpen] = useState(false);

  const isRequesterRole = activeRole === 'student' || activeRole === 'resident' || activeRole === 'employee';
  const isSuperAdmin = activeRole === 'super_admin';

  const myTickets = tickets.filter(
    (t) => t.requesterName === currentUser?.name || t.room?.includes('204') || t.orgId === activeOrg.id
  );

  const total = tickets.length;
  const active = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
  const completed = tickets.filter((t) => t.status === 'completed' || t.status === 'awaiting_verification').length;
  const closed = tickets.filter((t) => t.status === 'closed' || t.status === 'resolved').length;
  const reopened = tickets.filter((t) => t.status === 'reopened').length;
  const slaBreaches = tickets.filter((t) => t.slaBreached).length;

  // Filter audit logs dynamically for active tenant
  const tenantLogs = auditLogs.filter((log) => {
    if (!log.ticketId) return true;
    const matchedTicket = tickets.find((t) => t.id === log.ticketId);
    return matchedTicket ? matchedTicket.orgId === activeOrg.id : true;
  });

  const liveActivities =
    tenantLogs.length > 0
      ? tenantLogs.slice(0, 5).map((log) => ({
          text: `${log.user}: ${log.action} (${log.details})`,
          time: log.timestamp.includes(':') ? log.timestamp.split(' ')[1] || 'Just now' : log.timestamp,
        }))
      : [
          { text: 'Ravi Kumar started work on FOS-2026-004821 (Bathroom tap leakage)', time: '11:30 AM' },
          { text: 'Suresh Patel completed capacitor replacement on FOS-2026-004822', time: '10:00 AM' },
          { text: 'Dr. Rajesh Verma assigned ticket FOS-2026-004821 to Ravi Kumar', time: '09:30 AM' },
        ];

  // IF ROLE IS A REQUESTER (STUDENT / RESIDENT / EMPLOYEE), SHOW REQUESTER DASHBOARD
  if (isRequesterRole) {
    return (
      <div className="py-4 sm:py-8 px-3.5 sm:px-6 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Requester Hero Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <span>{activeOrg.logo}</span>
              <span>{getRoleDisplayName(activeRole, activeOrg.type, activeOrg.name)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">{activeOrg.name} Helpdesk</h1>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed font-medium">
              Welcome, {currentUser?.name || 'Requester'}. Report facility issues, track repair progress, and verify resolution in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap z-10 w-full sm:w-auto">
            <Link
              href="/requests/new"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-blue-500/30"
            >
              <FilePlus className="w-4 h-4" />
              <span>Raise New Request</span>
            </Link>
            <Link
              href="/my-requests"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>My Requests</span>
            </Link>
          </div>
        </div>

        {/* Demo Switcher Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Currently previewing as <strong>{getRoleDisplayName(activeRole, activeOrg.type)}</strong>. Switch role in top bar to access Manager / Admin controls.</span>
          </div>
        </div>

        {/* Requester Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Filed</span>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{myTickets.length}</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">In Progress</span>
            <p className="text-3xl font-black text-amber-500 mt-1">
              {myTickets.filter((t) => t.status === 'assigned' || t.status === 'in_progress').length}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Awaiting Verification</span>
            <p className="text-3xl font-black text-yellow-500 mt-1">
              {myTickets.filter((t) => t.status === 'awaiting_verification').length}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Resolved</span>
            <p className="text-3xl font-black text-emerald-500 mt-1">
              {myTickets.filter((t) => t.status === 'closed' || t.status === 'resolved').length}
            </p>
          </div>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/requests/new"
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <FilePlus className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold group-hover:text-blue-600 transition-colors">Report Issue</h3>
              <p className="text-xs text-slate-500 font-medium">Plumbing, electrical, AC cooling, Wi-Fi, or room repair.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Open Wizard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/my-requests"
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold group-hover:text-indigo-600 transition-colors">Track Tickets</h3>
              <p className="text-xs text-slate-500 font-medium">View technician assignment, live status, and resolution OTP.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600">
              <span>View Active</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/organizations"
            className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-violet-500 transition-all group shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold group-hover:text-violet-600 transition-colors">Facility Directory</h3>
              <p className="text-xs text-slate-500 font-medium">Browse facilities, custom services, and campus contact details.</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-violet-600">
              <span>Browse All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // EXECUTIVE ADMIN & MANAGER COMMAND CENTER
  return (
    <>
      <div className="py-4 sm:py-8 px-3.5 sm:px-6 max-w-7xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Top Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{isSuperAdmin ? '🌐' : activeOrg.logo}</span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-400">
                {getRoleDisplayName(activeRole, activeOrg.type, activeOrg.name)}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black">
              {isSuperAdmin ? 'FacilityOS System Super Admin Console' : `${activeOrg.name} Executive Operations`}
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {isSuperAdmin
                ? 'Platform-wide control, facility tenant onboarding, system audit logs, and global SLA engine control.'
                : `Internal organization administration, technician fleet management, asset tracking, and SLA enforcement for ${activeOrg.name}.`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap z-10 w-full sm:w-auto">
            {isSuperAdmin && (
              <button
                onClick={() => setAddFacilityModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-extrabold shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Provision Facility</span>
              </button>
            )}

            <Link
              href="/admin/analytics"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md"
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Analytics</span>
            </Link>

            <Link
              href="/admin/settings"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
            >
              Org Settings
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Total Requests</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{total}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Active Jobs</span>
            <p className="text-2xl font-black text-amber-500 mt-1">{active}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Awaiting Confirm</span>
            <p className="text-2xl font-black text-yellow-500 mt-1">{completed}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Closed & Resolved</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">{closed}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Reopened</span>
            <p className="text-2xl font-black text-orange-500 mt-1">{reopened}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">SLA Breaches</span>
            <p className="text-2xl font-black text-rose-500 mt-1">{slaBreaches}</p>
          </div>
        </div>

        {/* Admin Modules Hub */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            ...(isSuperAdmin
              ? [
                  {
                    title: 'Registered Organizations',
                    desc: 'Manage 20+ Registered Facilities',
                    href: '/organizations',
                    icon: Building2,
                    color: 'text-indigo-500',
                    bg: 'bg-indigo-500/10',
                  },
                ]
              : []),
            { title: 'User Directory', desc: 'Requesters & Residents', href: '/admin/users', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { title: 'Technician Fleet', desc: 'Skills & Workload', href: '/admin/workers', icon: Wrench, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { title: 'Asset Inventory', desc: 'Equipment & QR Tags', href: '/admin/assets', icon: Box, color: 'text-violet-500', bg: 'bg-violet-500/10' },
            { title: 'Preventive Schedule', desc: 'Maintenance Routines', href: '/admin/preventive', icon: CalendarCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            { title: 'SLA Engine', desc: 'Response Deadlines', href: '/admin/sla', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { title: 'Export Reports', desc: 'CSV & Executive PDFs', href: '/admin/reports', icon: FileText, color: 'text-rose-500', bg: 'bg-rose-500/10' },
            { title: 'Audit Trail', desc: 'Security Logs', href: '/admin/audit-logs', icon: Shield, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
            { title: 'Facility Hierarchy', desc: 'Buildings & Blocks', href: '/admin/facilities', icon: Building, color: 'text-teal-500', bg: 'bg-teal-500/10' },
          ].map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.title}
                href={m.href}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all group shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.desc}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Activity Stream Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span>Tenant Live Activity Feed ({activeOrg.name})</span>
          </h3>

          <div className="space-y-2.5">
            {liveActivities.map((act, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium">{act.text}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 shrink-0 ml-2">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {addFacilityModalOpen && <AddFacilityModal onClose={() => setAddFacilityModalOpen(false)} />}
    </>
  );
}
