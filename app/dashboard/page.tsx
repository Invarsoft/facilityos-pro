'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { formatStatusLabel, getStatusColorClass, getPriorityBadge } from '@/lib/utils';
import {
  PlusCircle,
  ClipboardList,
  Bell,
  PhoneCall,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  QrCode,
} from 'lucide-react';

export default function DashboardPage() {
  const { currentUser, activeOrg, getFilteredTickets } = useApp();
  const tickets = getFilteredTickets();

  const userName = currentUser?.name || 'Authorized Resident';
  const userAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  // Filter requester tickets
  const myTickets = tickets.filter((t) => currentUser ? (t.requesterId === currentUser.id || t.requesterName === currentUser.name) : true);

  const metrics = {
    total: myTickets.length,
    open: myTickets.filter((t) => t.status === 'new' || t.status === 'under_review').length,
    inProgress: myTickets.filter((t) => t.status === 'in_progress' || t.status === 'assigned' || t.status === 'accepted').length,
    awaitingVerification: myTickets.filter((t) => t.status === 'awaiting_verification').length,
    resolved: myTickets.filter((t) => t.status === 'resolved').length,
    closed: myTickets.filter((t) => t.status === 'closed').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeOrg.logo}</span>
            <span className="text-xs uppercase font-bold tracking-widest text-blue-300">
              {activeOrg.name} Service Portal
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Good afternoon, {userName.split(' ')[0]} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-medium">
            Here&apos;s what&apos;s happening with your facility and service requests.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 w-full md:w-auto">
          <Link
            href="/requests/new"
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise Service Request</span>
          </Link>
        </div>
      </div>

      {/* Verification Required Alert Banner */}
      {metrics.awaitingVerification > 0 && (
        <div className="p-4 rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/40 text-yellow-900 dark:text-yellow-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-pulse">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-yellow-500 shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold">Work Completed — Verification Pending</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You have {metrics.awaitingVerification} completed request(s) waiting for your final approval.
              </p>
            </div>
          </div>
          <Link
            href="/my-requests"
            className="px-4 py-2 rounded-xl bg-yellow-500 text-slate-950 font-black text-xs hover:bg-yellow-600 shrink-0"
          >
            Review & Approve Now →
          </Link>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total Requests', count: metrics.total, color: 'text-slate-900 dark:text-white', bg: 'bg-white dark:bg-slate-900' },
          { label: 'Open Review', count: metrics.open, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50/50 dark:bg-blue-950/40' },
          { label: 'In Progress', count: metrics.inProgress, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50/50 dark:bg-amber-950/40' },
          { label: 'Awaiting Verification', count: metrics.awaitingVerification, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50/50 dark:bg-yellow-950/40' },
          { label: 'Resolved', count: metrics.resolved, color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50/50 dark:bg-teal-950/40' },
          { label: 'Closed', count: metrics.closed, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50/50 dark:bg-emerald-950/40' },
        ].map((m, i) => (
          <div key={i} className={`p-4 rounded-2xl border border-slate-200 dark:border-slate-800 ${m.bg} shadow-xs flex flex-col justify-between`}>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{m.label}</span>
            <p className={`text-2xl font-black ${m.color} mt-1`}>{m.count}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/requests/new"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-md group flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Raise Request</h3>
            <p className="text-xs text-slate-400 mt-0.5">Report tap leak, fan, AC, IT issue</p>
          </div>
        </Link>

        <Link
          href="/my-requests"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all shadow-md group flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Track Requests</h3>
            <p className="text-xs text-slate-400 mt-0.5">View timeline & technician status</p>
          </div>
        </Link>

        <Link
          href="/notifications"
          className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500 transition-all shadow-md group flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Notifications</h3>
            <p className="text-xs text-slate-400 mt-0.5">Stay updated on SLA & progress</p>
          </div>
        </Link>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">Facility Helpdesk</h3>
            <p className="text-xs text-blue-500 font-mono font-bold mt-0.5">{activeOrg.contactPhone}</p>
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Recent Service Requests</h2>
          <Link href="/my-requests" className="text-xs font-bold text-blue-500 hover:underline">
            View All ({myTickets.length}) →
          </Link>
        </div>

        <div className="space-y-3">
          {myTickets.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <p className="text-xs text-slate-500">No service requests raised yet.</p>
              <Link
                href="/requests/new"
                className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
              >
                Raise First Request
              </Link>
            </div>
          ) : (
            myTickets.slice(0, 3).map((ticket) => {
              const statusStyle = getStatusColorClass(ticket.status);
              const priorityBadge = getPriorityBadge(ticket.priority);

              return (
                <Link
                  key={ticket.id}
                  href={`/requests/${ticket.id}`}
                  className="block p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                          {ticket.id}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${priorityBadge.bg} ${priorityBadge.text}`}>
                          {priorityBadge.label}
                        </span>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                        {ticket.title}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {ticket.serviceCategory} • {ticket.building} ({ticket.room})
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        {formatStatusLabel(ticket.status)}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
