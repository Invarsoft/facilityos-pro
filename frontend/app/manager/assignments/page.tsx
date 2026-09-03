'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Ticket, UserProfile } from '@/lib/types';
import { sortBlockNamesSequentially } from '@/lib/utils/sortingUtils';
import { WorkerRecommendModal } from '@/src/features/assistant/components/WorkerRecommendModal';
import {
  Wrench,
  UserCheck,
  ShieldCheck,
  Clock,
  Star,
  Building2,
  Bed,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function WorkerAssignmentsPage() {
  const { getFilteredTickets, activeOrg, activeRole, currentUser, users } = useApp();
  const allTickets = getFilteredTickets();

  // Warden Allocated Scope
  const liveUser = users.find((u) => u.id === currentUser?.id || u.email === currentUser?.email) || currentUser;
  const rawAssignedBlocks = liveUser?.assignedBlocks !== undefined ? liveUser?.assignedBlocks : [];
  const wardenAllocatedBlocks = sortBlockNamesSequentially(rawAssignedBlocks);

  // Filter tickets in Warden's allocated scope
  const wardenTickets = allTickets.filter((t) => {
    const ticketLoc = `${t.location || ''} ${t.building || ''} ${t.block || ''}`.toLowerCase();
    if (wardenAllocatedBlocks.length > 0) {
      return wardenAllocatedBlocks.some((blk) => ticketLoc.includes(blk.toLowerCase()));
    }
    return true;
  });

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTickets = wardenTickets.filter((t) => {
    if (filterStatus === 'unassigned') return !t.assignedWorkerId;
    if (filterStatus === 'assigned') return !!t.assignedWorkerId;
    return true;
  });

  const technicians = users.filter((u) => u.role === 'worker' || u.role === 'technician');

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header Banner - FACOS MATCH AI Dispatch Hub */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl">{activeOrg.logo}</span>
            <span className="text-xs uppercase font-black tracking-widest px-3 py-1 rounded-full bg-red-600/30 text-red-300 border border-red-500/40 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-red-400" />
              <span>FACOS WORKER DISPATCH ENGINE</span>
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black">
            Worker Match Center & Technician Dispatch
          </h1>
          <p className="text-xs text-slate-300 font-medium max-w-2xl">
            Automated multi-factor matching engine. Select any hostel request below to calculate real-time trade discipline, workload, building proximity, and rating match scores for fast technician dispatch.
          </p>
        </div>

        <Link
          href="/manager"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs border border-white/20 transition-all shrink-0"
        >
          <span>← Back to Dashboard</span>
        </Link>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Scope Tickets</span>
          <p className="text-2xl font-black text-slate-900">{wardenTickets.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Awaiting Worker</span>
          <p className="text-2xl font-black text-red-600">{wardenTickets.filter((t) => !t.assignedWorkerId).length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Assigned / Active</span>
          <p className="text-2xl font-black text-emerald-600">{wardenTickets.filter((t) => !!t.assignedWorkerId).length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-slate-400">Available Technicians</span>
          <p className="text-2xl font-black text-slate-900">{technicians.length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              filterStatus === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Requests ({wardenTickets.length})
          </button>
          <button
            onClick={() => setFilterStatus('unassigned')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              filterStatus === 'unassigned'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Unassigned ({wardenTickets.filter((t) => !t.assignedWorkerId).length})
          </button>
          <button
            onClick={() => setFilterStatus('assigned')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
              filterStatus === 'assigned'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Already Assigned ({wardenTickets.filter((t) => !!t.assignedWorkerId).length})
          </button>
        </div>
      </div>

      {/* Complaints Grid for Worker Match */}
      {filteredTickets.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto opacity-80" />
          <h3 className="text-base font-black text-slate-900">No Tickets Pending Match</h3>
          <p className="text-xs text-slate-500 font-medium">All complaints in your allocated blocks have been dispatched or resolved.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTickets.map((t) => {
            const isAssigned = !!t.assignedWorkerId;

            return (
              <div
                key={t.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-red-300 transition-all shadow-md flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-black text-xs text-red-600">{t.id}</span>
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-50 text-red-900 border border-red-200">
                      {t.serviceCategory}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900">{t.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{t.description}</p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-600 border-t border-slate-100">
                    <div className="flex items-center gap-1 font-bold">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.building || 'Hostel'} • {t.block || ''} ({t.room || ''})</span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">{t.preferredVisitTime || 'ASAP'}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    {isAssigned ? (
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        Assigned: {t.assignedWorkerName}
                      </span>
                    ) : (
                      <span className="text-[11px] font-extrabold text-red-700 bg-red-50 px-2.5 py-1 rounded-xl border border-red-200">
                        Awaiting Dispatch
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>{isAssigned ? 'FACOS Re-Match' : 'FACOS AI Match & Assign'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FACOS MATCH Modal */}
      {selectedTicket && (
        <WorkerRecommendModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}
