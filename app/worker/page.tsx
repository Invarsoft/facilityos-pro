'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { formatStatusLabel, getStatusColorClass, getPriorityBadge } from '@/lib/utils';
import {
  Wrench,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function WorkerDashboardPage() {
  const router = useRouter();
  const { getFilteredTickets, currentUser, updateTicketProgress, completeWorkerTask, setActiveRole, activeOrg } = useApp();
  const tickets = getFilteredTickets();

  const workerTasks = tickets.filter(
    (t) => currentUser ? (t.assignedWorkerId === currentUser.id || t.assignedWorkerName === currentUser.name || true) : true
  );

  const metrics = {
    assigned: workerTasks.filter((t) => t.status === 'assigned' || t.status === 'accepted').length,
    inProgress: workerTasks.filter((t) => t.status === 'in_progress').length,
    completed: workerTasks.filter((t) => t.status === 'completed' || t.status === 'awaiting_verification' || t.status === 'closed').length,
    overdue: workerTasks.filter((t) => t.slaBreached).length,
  };

  const handleQuickProgressUpdate = (ticketId: string, progress: number) => {
    if (progress === 100) {
      completeWorkerTask(ticketId, 'Technician completed repair work and verified functionality.', [
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80',
      ]);
      const requesterRole = activeOrg.type === 'university' ? 'student' : activeOrg.type === 'apartment' ? 'resident' : 'employee';
      setActiveRole(requesterRole);
      router.push(`/requests/${ticketId}`);
    } else {
      updateTicketProgress(ticketId, progress, `Worker updated progress to ${progress}%`);
    }
  };

  const workerName = currentUser?.name || 'Ravi Kumar';
  const workerAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80';
  const workerSkills = currentUser?.skills?.join(', ') || 'Plumbing & Electrical';
  const workerRating = currentUser?.rating || 4.8;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Worker Header Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={workerAvatar}
            alt={workerName}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-400"
          />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-300">
              Technician Workspace
            </span>
            <h1 className="text-xl font-extrabold">{workerName}</h1>
            <p className="text-xs text-slate-300">
              Specialist: {workerSkills} • Rating: {workerRating}★
            </p>
          </div>
        </div>

        <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
          <span className="text-[11px] font-bold text-slate-400 block">Current Shift Status</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>On Duty — Available</span>
          </span>
        </div>
      </div>

      {/* Task Metric Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Assigned Today</span>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{metrics.assigned}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">In Progress</span>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{metrics.inProgress}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">Completed Jobs</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{metrics.completed}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400">SLA Overdue</span>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{metrics.overdue}</p>
        </div>
      </div>

      {/* Assigned Tasks Mobile-First Cards List */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Wrench className="w-5 h-5 text-blue-500" />
          <span>My Assigned Work Orders</span>
        </h2>

        <div className="space-y-4">
          {workerTasks.map((task) => {
            const statusStyle = getStatusColorClass(task.status);
            const priorityBadge = getPriorityBadge(task.priority);

            return (
              <div
                key={task.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {task.id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${priorityBadge.bg} ${priorityBadge.text}`}>
                        {priorityBadge.label}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                      {task.title}
                    </h3>
                  </div>

                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full border shrink-0 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                  >
                    {formatStatusLabel(task.status)}
                  </span>
                </div>

                {/* Location & Requester Info */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{task.location}</span>
                      <span className="text-[10px] text-slate-400">{task.building} — {task.room}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">{task.requesterName}</span>
                      <a href={`tel:${task.requesterContact}`} className="text-[10px] text-blue-500 font-semibold hover:underline">
                        Call {task.requesterContact}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Quick Status Buttons */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600 dark:text-slate-400">Work Progress</span>
                    <span className="text-blue-600 dark:text-blue-400">{task.workProgress}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${task.workProgress}%` }}
                    />
                  </div>

                  {/* 1-Tap Mobile Action Bar */}
                  {task.status !== 'closed' && task.status !== 'awaiting_verification' && (
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleQuickProgressUpdate(task.id, 25)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                      >
                        25% Inspection
                      </button>

                      <button
                        onClick={() => handleQuickProgressUpdate(task.id, 50)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold hover:bg-amber-500/20"
                      >
                        50% Work Started
                      </button>

                      <button
                        onClick={() => handleQuickProgressUpdate(task.id, 75)}
                        className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-bold hover:bg-blue-500/20"
                      >
                        75% Almost Complete
                      </button>

                      <button
                        onClick={() => handleQuickProgressUpdate(task.id, 100)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 ml-auto"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>100% Complete & Submit for Student Approval</span>
                      </button>
                    </div>
                  )}

                  {task.status === 'awaiting_verification' && (
                    <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-800 dark:text-yellow-300 text-xs font-bold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span>Submitted for Student Approval. Waiting for Requester Verification.</span>
                      </div>
                      <button
                        onClick={() => {
                          const requesterRole = activeOrg.type === 'university' ? 'student' : activeOrg.type === 'apartment' ? 'resident' : 'employee';
                          setActiveRole(requesterRole);
                          router.push(`/requests/${task.id}`);
                        }}
                        className="px-3 py-1 rounded-lg bg-yellow-500 text-slate-950 text-[10px] font-extrabold shrink-0"
                      >
                        Test Student Approval →
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <Link
                    href={`/requests/${task.id}`}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Ticket & Add Photo Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
