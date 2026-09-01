'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { formatStatusLabel, getPriorityBadge } from '@/lib/utils';
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  ArrowRight,
  ShieldCheck,
  Building2,
  AlertCircle,
  Play,
  Key,
} from 'lucide-react';

export default function WorkerDashboardPage() {
  const router = useRouter();
  const { getFilteredTickets, currentUser, updateTicketProgress, completeWorkerTask } = useApp();
  const tickets = getFilteredTickets();

  const [isOnDuty, setIsOnDuty] = useState(true);
  const [selectedTaskOtp, setSelectedTaskOtp] = useState<{ id: string; otp: string } | null>(null);

  const workerTasks = tickets.filter(
    (t) => (currentUser ? t.assignedWorkerId === currentUser.id || t.assignedWorkerName === currentUser.name : true)
  );

  const metrics = {
    assigned: workerTasks.filter((t) => t.status === 'assigned' || t.status === 'accepted' || t.status === 'new').length,
    inProgress: workerTasks.filter((t) => t.status === 'in_progress').length,
    awaitingOtp: workerTasks.filter((t) => t.status === 'awaiting_verification').length,
    completed: workerTasks.filter((t) => t.status === 'completed' || t.status === 'resolved' || t.status === 'closed').length,
  };

  const handleStartTask = (ticketId: string) => {
    updateTicketProgress(ticketId, 25, 'Technician arrived at room and started diagnostic repair work.').catch((err) =>
      window.alert(err instanceof Error ? err.message : 'Failed to start repair')
    );
  };

  const handleUpdateProgress = (ticketId: string, progress: number) => {
    updateTicketProgress(ticketId, progress, `Technician updated progress to ${progress}%`).catch((err) =>
      window.alert(err instanceof Error ? err.message : 'Failed to update progress')
    );
  };

  const handleCompleteTask = (ticketId: string) => {
    completeWorkerTask(ticketId, 'Technician completed repair work and verified functionality.', [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
    ])
      .then(() => router.push(`/requests/${ticketId}`))
      .catch((err) => window.alert(err instanceof Error ? err.message : 'Failed to complete task'));
  };

  const workerName = currentUser?.name || 'Ravi Kumar';
  const workerAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';
  const workerSkills = currentUser?.skills?.join(', ') || 'Plumbing, AC & Electrical Repair';
  const workerRating = currentUser?.rating || 4.9;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Technician Duty Header - Strict Blue & White */}
      <div className="p-6 md:p-8 rounded-3xl bg-blue-900 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-blue-800">
        <div className="flex items-center gap-4">
          <img
            src={workerAvatar}
            alt={workerName}
            className="w-16 h-16 rounded-full object-cover ring-4 ring-white/30 shadow-md"
          />
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-wider">
              <Wrench className="w-3 h-3 text-blue-200" />
              <span>Woxsen Campus Technician Desk</span>
            </div>
            <h1 className="text-2xl font-black">{workerName}</h1>
            <p className="text-xs text-blue-100 font-medium">
              Specialist: {workerSkills} • Rating: <strong className="text-white">{workerRating}★</strong> (142 Jobs)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOnDuty(!isOnDuty)}
            className={`px-4 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 shadow-md ${
              isOnDuty
                ? 'bg-white text-blue-900 hover:bg-blue-50'
                : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isOnDuty ? 'bg-blue-600 animate-ping' : 'bg-slate-400'}`} />
            <span>{isOnDuty ? 'On Duty — Available' : 'Off Duty'}</span>
          </button>
        </div>
      </div>

      {/* Task Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Assigned Queue</span>
            <p className="text-2xl font-black text-blue-900 mt-0.5">{metrics.assigned}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">In Repair</span>
            <p className="text-2xl font-black text-blue-600 mt-0.5">{metrics.inProgress}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Wrench className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Awaiting OTP</span>
            <p className="text-2xl font-black text-blue-600 mt-0.5">{metrics.awaitingOtp}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Key className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Completed</span>
            <p className="text-2xl font-black text-blue-600 mt-0.5">{metrics.completed}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Active Work Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" />
            <span>Technician Assigned Work Orders ({workerTasks.length})</span>
          </h2>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Hostel Repair Jobs
          </span>
        </div>

        {workerTasks.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-900">All Assigned Repairs Completed!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
              You have no active repair work orders. Enjoy your shift breakdown break or stand by for new assignments.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {workerTasks.map((t) => {
              const priorityBadge = getPriorityBadge(t.priority);
              const isNew = t.status === 'assigned' || t.status === 'accepted' || t.status === 'new';
              const isInProgress = t.status === 'in_progress';
              const isAwaitingOtp = t.status === 'awaiting_verification';

              return (
                <div
                  key={t.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4 hover:border-blue-500 transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          {t.id}
                        </span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${priorityBadge.bg} ${priorityBadge.text}`}>
                          {priorityBadge.label}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {formatStatusLabel(t.status)}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-slate-900">{t.title}</h3>
                      <p className="text-xs text-slate-600 font-medium">{t.description}</p>
                    </div>

                    <Link
                      href={`/requests/${t.id}`}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs hover:bg-blue-100 shrink-0"
                    >
                      View Details →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{t.building || 'Hostel Tower'} ({t.block || 'Block A'})</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 font-bold">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Room / Unit: {t.room || 'Room 204'}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <User className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>Requester: {t.requesterName}</span>
                    </div>
                  </div>

                  {/* Technician Repair Progress Controls */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    {isNew && (
                      <button
                        onClick={() => handleStartTask(t.id)}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Start Diagnostic & Repair</span>
                      </button>
                    )}

                    {isInProgress && (
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-xs font-extrabold text-slate-700 shrink-0">Progress:</span>
                        <div className="flex items-center gap-1.5 flex-1">
                          {[25, 50, 75].map((pct) => (
                            <button
                              key={pct}
                              onClick={() => handleUpdateProgress(t.id, pct)}
                              className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs"
                            >
                              {pct}%
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handleCompleteTask(t.id)}
                          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shrink-0 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Complete & Generate OTP</span>
                        </button>
                      </div>
                    )}

                    {isAwaitingOtp && (
                      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900 flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>Work Completed! Student was sent 6-digit OTP verification code.</span>
                        </div>
                        <Link href={`/requests/${t.id}`} className="underline text-blue-700 font-extrabold">
                          Enter Student OTP →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
