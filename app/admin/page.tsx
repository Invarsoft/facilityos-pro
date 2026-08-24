'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { getRoleDisplayName } from '@/lib/utils';
import { AddFacilityModal } from '@/components/layout/AddFacilityModal';
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
} from 'lucide-react';

export default function AdminCommandCenterPage() {
  const { getFilteredTickets, activeOrg, activeRole, users, auditLogs } = useApp();
  const tickets = getFilteredTickets();
  const [addFacilityModalOpen, setAddFacilityModalOpen] = useState(false);

  const isSuperAdmin = activeRole === 'super_admin';

  const total = tickets.length;
  const active = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
  const completed = tickets.filter((t) => t.status === 'completed' || t.status === 'awaiting_verification').length;
  const closed = tickets.filter((t) => t.status === 'closed' || t.status === 'resolved').length;
  const reopened = tickets.filter((t) => t.status === 'reopened').length;
  const escalated = tickets.filter((t) => t.status === 'escalated').length;
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
      : activeOrg.id === 'green-valley'
      ? [
          { text: 'Karthik Nair updated progress on Tower 3 Elevator Door Sensor to 75%', time: '10:30 AM' },
          { text: 'Water pressure valve flushed at Tower 1 Main Line', time: '09:45 AM' },
          { text: 'Priya Nambiar created request FOS-2026-008101', time: '08:00 AM' },
        ]
      : activeOrg.id === 'invartech-solutions'
      ? [
          { text: 'Amit Verma accepted Executive Boardroom AC Chiller job', time: '11:00 AM' },
          { text: 'Floor 4 Bay C MCB trip logged by Vikram Mehta', time: '09:00 AM' },
          { text: 'HVAC gas recharge completed for Central Chiller B', time: '08:30 AM' },
        ]
      : [
          { text: 'Ravi Kumar started work on FOS-2026-004821 (Bathroom tap leakage)', time: '11:30 AM' },
          { text: 'Suresh Patel completed capacitor replacement on FOS-2026-004822', time: '10:00 AM' },
          { text: 'Dr. Rajesh Verma assigned ticket FOS-2026-004821 to Ravi Kumar', time: '09:30 AM' },
          { text: 'Aarav Sharma submitted service request FOS-2026-004821', time: '09:15 AM' },
        ];

  const gisBuildingMarkers =
    activeOrg.id === 'green-valley'
      ? [
          { name: 'Tower 1 Resident Block', activeJobs: 0, status: 'Clear', coords: '12.9716° N, 77.5946° E' },
          { name: 'Tower 3 Elevator Well', activeJobs: 1, status: 'In Progress', coords: '12.9718° N, 77.5948° E' },
          { name: 'Community Clubhouse & Pool', activeJobs: 0, status: 'Optimal', coords: '12.9720° N, 77.5950° E' },
        ]
      : activeOrg.id === 'invartech-solutions'
      ? [
          { name: 'Main Block - Floor 5 Boardroom', activeJobs: 1, status: 'In Progress', coords: '28.4595° N, 77.0266° E' },
          { name: 'Floor 4 Software Bay C', activeJobs: 0, status: 'Optimal', coords: '28.4597° N, 77.0268° E' },
          { name: 'Datacenter Server Room A', activeJobs: 0, status: 'Secure', coords: '28.4599° N, 77.0270° E' },
        ]
      : [
          { name: 'Hostel A (Boys Hostel)', activeJobs: 1, status: 'In Progress', coords: '17.3850° N, 78.4867° E' },
          { name: 'Hostel B (Girls Hostel)', activeJobs: 1, status: 'Awaiting Verification', coords: '17.3852° N, 78.4869° E' },
          { name: 'Academic Block 1 Labs', activeJobs: 0, status: 'Optimal', coords: '17.3855° N, 78.4872° E' },
        ];

  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
        {/* Top Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{isSuperAdmin ? '🌐' : activeOrg.logo}</span>
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-400">
                {getRoleDisplayName(activeRole, activeOrg.type, activeOrg.name)}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black">
              {isSuperAdmin ? 'FacilityOS System Super Admin Console' : `${activeOrg.name} Executive Operations`}
            </h1>
            <p className="text-xs text-slate-400">
              {isSuperAdmin
                ? 'Platform-wide control, facility tenant onboarding, system audit logs, and global SLA engine control.'
                : `Internal organization administration, technician fleet management, asset tracking, and SLA enforcement for ${activeOrg.name}.`}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                href={mod.href}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-md group space-y-2"
              >
                <div className={`w-10 h-10 rounded-2xl ${mod.bg} ${mod.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{mod.title}</h3>
                  <p className="text-[11px] text-slate-400">{mod.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* GIS Live Map Simulation & Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* GIS Map Box */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-500" />
                <span>GIS Dispatch Map — {isSuperAdmin ? 'FacilityOS Global Platform' : activeOrg.name}</span>
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                Live Dispatch Active
              </span>
            </div>

            <div className="relative h-64 rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center p-4">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="z-10 w-full space-y-3">
                <p className="text-xs text-slate-400 font-mono text-center mb-2">BUILDING INFRASTRUCTURE MARKERS:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {gisBuildingMarkers.map((b) => (
                    <div key={b.name} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-white block text-[11px] truncate">{b.name}</span>
                      <span className="text-[10px] text-slate-400 block font-mono">{b.coords}</span>
                      <div className="pt-1 flex items-center justify-between text-[10px]">
                        <span className={b.activeJobs > 0 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                          {b.activeJobs} Active Jobs
                        </span>
                        <span className="text-slate-400 font-semibold">{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Operational Activity Feed */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span>Live Operations Feed</span>
              </h2>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            </div>

            <div className="space-y-3">
              {liveActivities.map((act, i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">{act.text}</p>
                  <span className="text-[9px] text-slate-400 font-mono block">{act.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Facility Provisioning Modal */}
      {addFacilityModalOpen && (
        <AddFacilityModal onClose={() => setAddFacilityModalOpen(false)} />
      )}
    </>
  );
}
