'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { formatStatusLabel, getStatusColorClass, getPriorityBadge } from '@/lib/utils';
import { VerificationModal } from '@/src/features/tickets/components/VerificationModal';
import { WorkerRecommendModal } from '@/src/features/assistant/components/WorkerRecommendModal';
import { Ticket } from '@/lib/types';
import {
  Clock,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  MessageSquare,
  Send,
  Star,
  MapPin,
  Phone,
  Wrench,
  Check,
  User,
  ArrowRight,
} from 'lucide-react';

export default function TicketDetailsPage() {
  const params = useParams();
  const ticketId = params.id as string;

  const {
    getTicketById,
    currentUser,
    activeRole,
    addComment,
    completeWorkerTask,
    updateTicketProgress,
    escalateTicket,
    activeOrg,
    serverMode,
    loadTicketDetail,
  } = useApp();

  const ticket = getTicketById(ticketId);

  const [commentInput, setCommentInput] = useState('');
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);

  // Pull real timeline events + comments from the backend
  useEffect(() => {
    if (serverMode && ticketId) loadTicketDetail(ticketId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId, serverMode]);

  if (!ticket) {
    return (
      <div className="py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Ticket Not Found</h2>
        <p className="text-xs text-slate-500">No service request matching ID #{ticketId} was found.</p>
      </div>
    );
  }

  const statusStyle = getStatusColorClass(ticket.status);
  const priorityBadge = getPriorityBadge(ticket.priority);

  const isRequester = activeRole === 'student' || activeRole === 'resident' || activeRole === 'employee' || activeRole === 'staff';
  const isAssignedWorker = activeRole === 'worker' || activeRole === 'technician';
  const isManager = activeRole === 'warden' || activeRole === 'manager' || activeRole === 'admin';

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addComment(ticket.id, commentInput);
    setCommentInput('');
  };

  const handleSwitchToStudentRole = () => {
    setVerificationModalOpen(true);
  };

  const timelineSteps = [
    { label: 'Request Created', status: 'new' },
    { label: 'Under Review', status: 'under_review' },
    { label: 'Worker Assigned', status: 'assigned' },
    { label: 'Job Accepted', status: 'accepted' },
    { label: 'Work In Progress', status: 'in_progress' },
    { label: 'Work Completed', status: 'completed' },
    { label: 'Awaiting Verification', status: 'awaiting_verification' },
    { label: 'Resolved & Closed', status: 'closed' },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'closed' || status === 'resolved') return 7;
    if (status === 'awaiting_verification') return 6;
    if (status === 'completed') return 5;
    if (status === 'in_progress') return 4;
    if (status === 'accepted') return 3;
    if (status === 'assigned') return 2;
    if (status === 'under_review') return 1;
    return 0;
  };

  const currentStepIdx = getStepIndex(ticket.status);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner & Status Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400">
                {ticket.id}
              </span>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                {formatStatusLabel(ticket.status)}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${priorityBadge.bg} ${priorityBadge.text}`}>
                {priorityBadge.label}
              </span>
              {ticket.isEmergency && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white animate-pulse">
                  🚨 EMERGENCY DISPATCH
                </span>
              )}
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">
              {ticket.title}
            </h1>

            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-700 dark:text-slate-300">{ticket.serviceCategory}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {ticket.location} ({ticket.building} - {ticket.room})
              </span>
              <span>•</span>
              <span>Created {new Date(ticket.createdAt).toLocaleString()}</span>
            </p>
          </div>

          {/* SLA Timer Indicator */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-right min-w-[180px]">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">SLA Deadline</div>
            <div className="flex items-center justify-end gap-1.5 mt-0.5">
              <Clock className={`w-4 h-4 ${ticket.slaBreached ? 'text-rose-500 animate-bounce' : 'text-amber-500'}`} />
              <span className={`text-xs font-black font-mono ${ticket.slaBreached ? 'text-rose-500' : 'text-slate-800 dark:text-slate-200'}`}>
                {ticket.slaBreached ? 'Overdue by 2h 15m' : '05h 32m remaining'}
              </span>
            </div>
            {ticket.slaBreached && (
              <span className="text-[9px] font-bold text-rose-500 block mt-0.5">SLA BREACHED — LEVEL {ticket.escalationLevel} ESCALATED</span>
            )}
          </div>
        </div>

        {/* Requester Verification Prompt Banner if status is Awaiting Verification */}
        {ticket.status === 'awaiting_verification' && (
          <div className="p-4 rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/50 text-yellow-900 dark:text-yellow-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div className="space-y-1">
              <h3 className="text-sm font-extrabold flex items-center gap-2">
                <Wrench className="w-5 h-5 text-yellow-500" />
                <span>Verification Required Before Ticket Closure</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Technician <strong>{ticket.assignedWorkerName || 'Ravi Kumar'}</strong> has marked work as completed. Student/Requester verification is required.
              </p>
            </div>

            {isRequester ? (
              <button
                onClick={() => setVerificationModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-slate-950 font-black text-xs shadow-md shrink-0 animate-pulse"
              >
                Verify Resolution Now (YES / NO)
              </button>
            ) : (
              <button
                onClick={handleSwitchToStudentRole}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shrink-0 flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Switch to Student Role to Approve (YES/NO)</span>
              </button>
            )}
          </div>
        )}

        {/* Manager Action Bar */}
        {isManager && ticket.status !== 'closed' && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setAssignmentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md shadow-violet-600/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>Assign / Reassign Worker (AI Match)</span>
            </button>

            {ticket.status !== 'escalated' && (
              <button
                onClick={() => escalateTicket(ticket.id, 2)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Escalate to Admin</span>
              </button>
            )}
          </div>
        )}

        {/* Worker Action Bar */}
        {isAssignedWorker && ticket.status !== 'closed' && ticket.status !== 'awaiting_verification' && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 flex-wrap">
            {ticket.workProgress < 100 && (
              <button
                onClick={() => updateTicketProgress(ticket.id, Math.min(100, ticket.workProgress + 25), 'Inspected and working on fix.')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
              >
                <span>Update Progress ({ticket.workProgress + 25}%)</span>
              </button>
            )}

            <button
              onClick={() => completeWorkerTask(ticket.id, 'Repair work completed. Tested functionality.')}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Complete Work → Submit for Student Approval</span>
            </button>
          </div>
        )}
      </div>

      {/* Visual Timeline Progress Tracker */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
          Visual Service Lifecycle
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {timelineSteps.map((stepItem, idx) => {
            const isCompleted = idx <= currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={stepItem.label}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isCurrent
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-extrabold shadow-sm'
                    : isCompleted
                    ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                }`}
              >
                <div className="w-6 h-6 rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-extrabold">
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <p className="text-[10px] leading-tight">{stepItem.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Description, Timeline, Messaging, Technician Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Problem Description</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {ticket.description}
            </p>

            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Attachments:</span>
                <div className="flex gap-3">
                  {ticket.attachments.map((img, i) => (
                    <img key={i} src={img} alt="Proof" className="w-24 h-24 rounded-2xl object-cover ring-1 ring-slate-300" />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Detailed Event Log & Timeline
            </h3>

            <div className="space-y-4">
              {ticket.timeline.map((item) => (
                <div key={item.id} className="flex items-start gap-3 text-xs border-l-2 border-blue-500 pl-4 py-1">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 dark:text-slate-100">{item.action}</span>
                      <span className="text-[10px] text-slate-400">by {item.actorName} ({item.actorRole})</span>
                    </div>
                    {item.notes && <p className="text-[11px] text-slate-600 dark:text-slate-400">{item.notes}</p>}
                    <span className="text-[9px] text-slate-400 block">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>In-Ticket Communication & Comments</span>
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {ticket.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No messages yet. Ask a question or share instructions.</p>
              ) : (
                ticket.comments.map((c) => (
                  <div key={c.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-blue-600 dark:text-blue-400">{c.authorName} ({c.authorRole})</span>
                      <span className="text-[9px] text-slate-400">{c.createdAt}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{c.content}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendComment} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Type a message to technician or manager..."
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Assigned Technician</h3>

            {ticket.assignedWorkerName ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={ticket.assignedWorkerAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'}
                    alt={ticket.assignedWorkerName}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{ticket.assignedWorkerName}</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">{ticket.assignedWorkerSkill || 'Technician'}</p>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{ticket.assignedWorkerRating || 4.8} Rating</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Contact Phone:</span>
                    <a href={`tel:${ticket.assignedWorkerPhone}`} className="font-bold text-blue-500 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{ticket.assignedWorkerPhone || '+91 98220 11223'}</span>
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Workload:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">1 Job</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <p className="text-xs text-slate-400 italic">No technician assigned yet.</p>
                {isManager && (
                  <button
                    onClick={() => setAssignmentModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold shadow-md"
                  >
                    Assign Worker via AI Match
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3 text-xs">
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Requester Info</h3>
            <div className="flex justify-between">
              <span className="text-slate-500">Name:</span>
              <span className="font-bold">{ticket.requesterName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contact:</span>
              <span className="font-medium">{ticket.requesterContact}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-medium">{ticket.building} ({ticket.room})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {verificationModalOpen && (
        <VerificationModal ticket={ticket} onClose={() => setVerificationModalOpen(false)} />
      )}

      {/* Worker Assignment Modal */}
      {assignmentModalOpen && (
        <WorkerRecommendModal
          ticket={ticket}
          onClose={() => setAssignmentModalOpen(false)}
        />
      )}
    </div>
  );
}
