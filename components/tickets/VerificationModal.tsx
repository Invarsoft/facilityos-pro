'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Ticket } from '@/lib/types';
import { CheckCircle2, XCircle, Star, AlertTriangle, MessageSquare, ThumbsUp, RotateCcw, X } from 'lucide-react';

interface VerificationModalProps {
  ticket: Ticket;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ ticket, onClose }) => {
  const { verifyTicket } = useApp();

  const [step, setStep] = useState<'prompt' | 'yes_feedback' | 'no_reopen'>('prompt');
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState<string>('');
  const [reopenReason, setReopenReason] = useState<string>('Issue not fully fixed');
  const [customComment, setCustomComment] = useState<string>('');

  const reopenOptions = [
    'Issue not fully fixed',
    'Same issue returned',
    'Wrong solution provided',
    'Additional work required',
    'Technician did not visit room',
    'Other reason',
  ];

  const handleConfirmYes = () => {
    verifyTicket(ticket.id, true, rating, feedback);
    onClose();
  };

  const handleConfirmNo = () => {
    const finalReason = reopenReason === 'Other reason' ? customComment || 'Issue still exists' : `${reopenReason}${customComment ? `: ${customComment}` : ''}`;
    verifyTicket(ticket.id, false, undefined, undefined, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-950/80 text-yellow-600 dark:text-yellow-400 flex items-center justify-center font-bold">
              ?
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Verify Service Resolution
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Ticket #{ticket.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'prompt' && (
            <div className="text-center space-y-6">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-left">
                <p className="text-xs font-bold text-blue-900 dark:text-blue-200 mb-1">
                  Worker {ticket.assignedWorkerName || 'Technician'} marked this work as COMPLETED:
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                  &ldquo;{ticket.workNotes || 'Technician completed the repair work and tested functionality.'}&rdquo;
                </p>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Please confirm whether the issue has been resolved:
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  FacilityOS requires requester verification before closing any work order.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => setStep('yes_feedback')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold transition-all shadow-sm group"
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs uppercase tracking-wider">YES, ISSUE RESOLVED</span>
                </button>

                <button
                  onClick={() => setStep('no_reopen')}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-bold transition-all shadow-sm group"
                >
                  <XCircle className="w-8 h-8 text-rose-600 dark:text-rose-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs uppercase tracking-wider">NO, ISSUE STILL EXISTS</span>
                </button>
              </div>
            </div>
          )}

          {step === 'yes_feedback' && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-2">
                  <ThumbsUp className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Are you satisfied with the resolution?
                </h4>
                <p className="text-xs text-slate-500">Rate your service experience to help improve facility quality.</p>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center justify-center gap-2 py-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Optional Feedback */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Comments / Feedback:
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share feedback on technician punctuality, cleanliness, quality of repair..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  onClick={() => setStep('prompt')}
                  className="w-1/3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmYes}
                  className="w-2/3 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
                >
                  Confirm Resolution & Close Ticket
                </button>
              </div>
            </div>
          )}

          {step === 'no_reopen' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300">
                    Reopening Ticket #{ticket.id}
                  </h4>
                  <p className="text-[11px] text-rose-700 dark:text-rose-400 mt-0.5">
                    This request will be marked as REOPENED and immediately sent back to the Warden/Manager for priority intervention.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Select Reason Why Issue Presists:
                </label>
                <div className="space-y-2">
                  {reopenOptions.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                        reopenReason === opt
                          ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 font-semibold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reopenReason"
                        checked={reopenReason === opt}
                        onChange={() => setReopenReason(opt)}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Additional Details / Instructions for Manager:
                </label>
                <textarea
                  value={customComment}
                  onChange={(e) => setCustomComment(e.target.value)}
                  placeholder="Describe what went wrong or why the repair was incomplete..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setStep('prompt')}
                  className="w-1/3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                >
                  Back
                </button>
                <button
                  onClick={handleConfirmNo}
                  className="w-2/3 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reopen Ticket & Notify Manager</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
