'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { formatStatusLabel, getStatusColorClass, getPriorityBadge } from '@/lib/utils';
import { Search, Filter, ArrowRight, PlusCircle, Wrench, ShieldAlert, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export default function RequestsListPage() {
  const { getFilteredTickets, activeOrg } = useApp();
  const tickets = getFilteredTickets();

  const [search, setSearch] = useState('');
  const [statusCategory, setStatusCategory] = useState<'all' | 'active' | 'action_needed' | 'closed'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filtered = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()) ||
      t.requesterName.toLowerCase().includes(search.toLowerCase());

    let matchesCategory = true;
    if (statusCategory === 'active') {
      matchesCategory = t.status !== 'closed' && t.status !== 'resolved';
    } else if (statusCategory === 'action_needed') {
      matchesCategory = t.status === 'awaiting_verification' || t.status === 'reopened' || t.status === 'escalated';
    } else if (statusCategory === 'closed') {
      matchesCategory = t.status === 'closed' || t.status === 'resolved';
    }

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const activeCount = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
  const actionNeededCount = tickets.filter((t) => t.status === 'awaiting_verification' || t.status === 'reopened' || t.status === 'escalated').length;
  const closedCount = tickets.filter((t) => t.status === 'closed' || t.status === 'resolved').length;

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">Service Requests Directory</h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Operational work orders for <strong>{activeOrg.name}</strong>
          </p>
        </div>

        <Link
          href="/requests/new"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Request</span>
        </Link>
      </div>

      {/* Mobile Category Pill Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
        <button
          onClick={() => { setStatusCategory('all'); setStatusFilter('all'); }}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
            statusCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          All ({tickets.length})
        </button>

        <button
          onClick={() => setStatusCategory('active')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
            statusCategory === 'active'
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Active ({activeCount})</span>
        </button>

        <button
          onClick={() => setStatusCategory('action_needed')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
            statusCategory === 'action_needed'
              ? 'bg-yellow-500 text-slate-950 shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-950" />
          <span>Action Needed ({actionNeededCount})</span>
        </button>

        <button
          onClick={() => setStatusCategory('closed')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
            statusCategory === 'closed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Closed ({closedCount})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ticket ID, title, location..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-initial p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="under_review">Under Review</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="awaiting_verification">Awaiting Verification</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
            <option value="escalated">Escalated</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="flex-1 md:flex-initial p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-500">No requests found matching your category filter.</p>
          </div>
        ) : (
          filtered.map((ticket) => {
            const statusStyle = getStatusColorClass(ticket.status);
            const priorityBadge = getPriorityBadge(ticket.priority);

            return (
              <Link
                key={ticket.id}
                href={`/requests/${ticket.id}`}
                className="block p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all shadow-xs hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1 w-full sm:w-auto">
                    <div className="flex items-center justify-between sm:justify-start gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {ticket.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${priorityBadge.bg} ${priorityBadge.text}`}>
                        {priorityBadge.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                      {ticket.title}
                    </h3>

                    <p className="text-xs text-slate-500 font-medium">
                      {ticket.serviceCategory} • {ticket.location}
                    </p>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100 dark:border-slate-800/80 shrink-0">
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-xl border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                      {formatStatusLabel(ticket.status)}
                    </span>

                    <ArrowRight className="w-4 h-4 text-slate-400 sm:ml-3" />
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
