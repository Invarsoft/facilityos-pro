'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { getRoleDisplayName, formatStatusLabel, getStatusColorClass, getPriorityBadge } from '@/lib/utils';
import { WorkerRecommendModal } from '@/src/features/assistant/components/WorkerRecommendModal';
import { Ticket } from '@/lib/types';
import {
  LayoutDashboard,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Bed,
  Search,
} from 'lucide-react';

export default function ManagerDashboardPage() {
  const { getFilteredTickets, activeOrg, activeRole, currentUser } = useApp();
  const allTickets = getFilteredTickets();

  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<Ticket | null>(null);
  const [selectedHostelSector, setSelectedHostelSector] = useState<string>('all');

  const managerRoleName = getRoleDisplayName(activeRole, activeOrg.type);

  // Filter tickets for Hostel Area Admin
  const tickets = allTickets.filter((t) => {
    if (selectedHostelSector === 'all') return true;
    if (selectedHostelSector === 'towers') {
      return t.building?.toLowerCase().includes('tower') || t.building?.toLowerCase().includes('t1') || t.building?.toLowerCase().includes('t2') || t.building?.toLowerCase().includes('t3') || t.building?.toLowerCase().includes('t4') || t.building?.toLowerCase().includes('t5') || t.building?.toLowerCase().includes('t6');
    }
    if (selectedHostelSector === 'blocks') {
      return t.block?.toLowerCase().includes('block') || t.building?.toLowerCase().includes('block');
    }
    return true;
  });

  const metrics = {
    newRequests: tickets.filter((t) => t.status === 'new' || t.status === 'under_review').length,
    assigned: tickets.filter((t) => t.status === 'assigned' || t.status === 'accepted').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    overdue: tickets.filter((t) => t.slaBreached).length,
    escalated: tickets.filter((t) => t.status === 'escalated').length,
    awaitingVerification: tickets.filter((t) => t.status === 'awaiting_verification').length,
    reopened: tickets.filter((t) => t.status === 'reopened').length,
    closed: tickets.filter((t) => t.status === 'closed' || t.status === 'resolved').length,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Manager Header - Dedicated Hostel Area Admin Scope */}
      <div className="p-6 md:p-8 rounded-3xl bg-blue-900 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-blue-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl">{activeOrg.logo}</span>
            <span className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
              Hostel Area Admin & Warden Console
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black">
            Woxsen Hostel Residential Operations (Towers T1–T6 & Blocks A–G)
          </h1>
          <p className="text-xs text-blue-100 font-medium">
            Dedicated administrative control over Hostel Towers T1 to T6 and Residential Blocks A to G. Real-time technician dispatching & OTP resolution.
          </p>
        </div>

        <Link
          href="/manager/assignments"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-black text-xs shadow-lg transition-all active:scale-95 shrink-0"
        >
          <UserCheck className="w-4 h-4 text-blue-600" />
          <span>Worker Match Center</span>
        </Link>
      </div>

      {/* Hostel Area Scope Selector (All Hostels vs Towers T1-T6 vs Blocks A-G) */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <button
          onClick={() => setSelectedHostelSector('all')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            selectedHostelSector === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>All Hostel Areas (T1–T6 & Blocks A–G)</span>
        </button>

        <button
          onClick={() => setSelectedHostelSector('towers')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            selectedHostelSector === 'towers'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hostel Towers T1 – T6</span>
        </button>

        <button
          onClick={() => setSelectedHostelSector('blocks')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            selectedHostelSector === 'blocks'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 hover:text-blue-600'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Hostel Blocks A – G</span>
        </button>
      </div>

      {/* Reopened Alert Banner if any! */}
      {metrics.reopened > 0 && (
        <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200 text-blue-900 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-blue-600 shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold">Hostel Room Intervention Required: Reopened Tickets</h3>
              <p className="text-xs text-blue-800 font-medium">
                Hostel residents reported unresolved issues on {metrics.reopened} room ticket(s). Reassignment required.
              </p>
            </div>
          </div>
          <Link
            href="/requests?status=reopened"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shrink-0"
          >
            Review Reopened →
          </Link>
        </div>
      )}

      {/* Metric Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Pending Review', count: metrics.newRequests },
          { label: 'Assigned', count: metrics.assigned },
          { label: 'In Progress', count: metrics.inProgress },
          { label: 'Reopened', count: metrics.reopened },
          { label: 'Overdue SLA', count: metrics.overdue },
          { label: 'Escalated', count: metrics.escalated },
          { label: 'Verification', count: metrics.awaitingVerification },
          { label: 'Closed', count: metrics.closed },
        ].map((m, i) => (
          <div key={i} className="p-3 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500">{m.label}</span>
            <span className="text-xl font-black text-blue-600 mt-1">{m.count}</span>
          </div>
        ))}
      </div>

      {/* Unassigned / Pending Review Tickets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span>Hostel Maintenance Requests ({tickets.length})</span>
          </h2>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Hostel Area Scope Active
          </span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-4">Ticket #</th>
                <th className="p-4">Hostel Location</th>
                <th className="p-4">Issue Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.map((t) => {
                const priorityBadge = getPriorityBadge(t.priority);
                const isUnassigned = !t.assignedWorkerId;

                return (
                  <tr key={t.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-600">{t.id}</td>
                    <td className="p-4">
                      <span className="font-extrabold text-slate-900 block">{t.building || 'Hostel Tower'}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">{t.block || 'Block A'} • {t.room || 'Room 204'}</span>
                    </td>
                    <td className="p-4 font-bold text-slate-800">{t.serviceCategory}</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${priorityBadge.bg} ${priorityBadge.text}`}>
                        {priorityBadge.label}
                      </span>
                    </td>
                    <td className="p-4 font-extrabold text-blue-700">{formatStatusLabel(t.status)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedTicketForAssign(t)}
                        className={`px-3 py-1.5 rounded-xl font-extrabold text-xs transition-all ${
                          isUnassigned
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                            : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                        }`}
                      >
                        {isUnassigned ? 'Assign Worker' : 'Reassign'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Worker Recommend & Auto-Match Modal */}
      {selectedTicketForAssign && (
        <WorkerRecommendModal
          ticket={selectedTicketForAssign}
          onClose={() => setSelectedTicketForAssign(null)}
        />
      )}
    </div>
  );
}
