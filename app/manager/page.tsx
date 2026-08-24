'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { getRoleDisplayName, formatStatusLabel, getStatusColorClass, getPriorityBadge } from '@/lib/utils';
import { AIWorkerRecommendModal } from '@/components/ai/AIWorkerRecommendModal';
import { Ticket } from '@/lib/types';
import {
  LayoutDashboard,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';

export default function ManagerDashboardPage() {
  const { getFilteredTickets, activeOrg, activeRole, currentUser } = useApp();
  const tickets = getFilteredTickets();

  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<Ticket | null>(null);

  const managerRoleName = getRoleDisplayName(activeRole, activeOrg.type);

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
      {/* Manager Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeOrg.logo}</span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-300">
              {managerRoleName} Console
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black">{activeOrg.name} Maintenance Operations</h1>
          <p className="text-xs text-slate-300">
            Real-time request dispatching, technician workload balancing, and SLA intervention.
          </p>
        </div>

        <Link
          href="/manager/assignments"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-violet-600/30"
        >
          <UserCheck className="w-4 h-4" />
          <span>Worker Match Center</span>
        </Link>
      </div>

      {/* Reopened Alert Banner if any! */}
      {metrics.reopened > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-900 dark:text-rose-200 flex items-center justify-between gap-3 shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold">Priority Intervention: Reopened Tickets</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Requesters reported unresolved issues on {metrics.reopened} ticket(s). Reassignment required.
              </p>
            </div>
          </div>
          <Link
            href="/requests?status=reopened"
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shrink-0"
          >
            Review Reopened →
          </Link>
        </div>
      )}

      {/* Metric Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Pending Review', count: metrics.newRequests, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50/50 dark:bg-purple-950/40' },
          { label: 'Assigned', count: metrics.assigned, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50/50 dark:bg-indigo-950/40' },
          { label: 'In Progress', count: metrics.inProgress, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50/50 dark:bg-amber-950/40' },
          { label: 'Reopened', count: metrics.reopened, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50/50 dark:bg-rose-950/40' },
          { label: 'Overdue SLA', count: metrics.overdue, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50/50 dark:bg-red-950/40' },
          { label: 'Escalated', count: metrics.escalated, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50/50 dark:bg-orange-950/40' },
          { label: 'Verification', count: metrics.awaitingVerification, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50/50 dark:bg-yellow-950/40' },
          { label: 'Closed', count: metrics.closed, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/50 dark:bg-emerald-950/40' },
        ].map((m, i) => (
          <div key={i} className={`p-3 rounded-2xl border border-slate-200 dark:border-slate-800 ${m.bg} flex flex-col justify-between`}>
            <span className="text-[10px] font-semibold text-slate-500">{m.label}</span>
            <span className={`text-xl font-black ${m.color} mt-1`}>{m.count}</span>
          </div>
        ))}
      </div>

      {/* Unassigned / Pending Review Tickets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <span>Requests Awaiting Assignment & Review</span>
          </h2>
          <Link href="/requests" className="text-xs font-bold text-blue-500 hover:underline">
            View All Directory →
          </Link>
        </div>

        <div className="space-y-3">
          {tickets
            .filter((t) => t.status === 'new' || t.status === 'under_review' || t.status === 'reopened')
            .map((ticket) => {
              const statusStyle = getStatusColorClass(ticket.status);
              const priorityBadge = getPriorityBadge(ticket.priority);

              return (
                <div
                  key={ticket.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {ticket.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${priorityBadge.bg} ${priorityBadge.text}`}>
                        {priorityBadge.label}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        {formatStatusLabel(ticket.status)}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                      {ticket.title}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Category: <strong>{ticket.serviceCategory}</strong> • Location: <strong>{ticket.building} ({ticket.room})</strong> • Requester: {ticket.requesterName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    <button
                      onClick={() => setSelectedTicketForAssign(ticket)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Assign Technician</span>
                    </button>
                    <Link
                      href={`/requests/${ticket.id}`}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* AI Worker Assignment Modal */}
      {selectedTicketForAssign && (
        <AIWorkerRecommendModal
          ticket={selectedTicketForAssign}
          onClose={() => setSelectedTicketForAssign(null)}
        />
      )}
    </div>
  );
}
