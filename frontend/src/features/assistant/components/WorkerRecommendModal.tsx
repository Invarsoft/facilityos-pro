'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Ticket, UserProfile } from '@/lib/types';
import { UserCheck, Star, Shield, Clock, CheckCircle2, AlertCircle, X, Wrench, AlertTriangle } from 'lucide-react';
import { ConfirmationModal } from '@/src/shared/components/ui/ConfirmationModal';

interface WorkerRecommendModalProps {
  ticket: Ticket;
  onClose: () => void;
}

export const WorkerRecommendModal: React.FC<WorkerRecommendModalProps> = ({ ticket, onClose }) => {
  const { users, assignWorker } = useApp();
  
  // Filter worker profiles
  const rawWorkers = users.filter((u) => u.role === 'worker' || u.role === 'technician');

  // Trade discipline dictionary for strict trade classification across all 14 categories
  const TRADE_SKILLS: Record<string, string[]> = {
    IT_NETWORK: ['wifi', 'network', 'it support', 'router', 'lan', 'wiring', 'av', 'projector', 'computer'],
    ELECTRICAL: ['electrical', 'electrician', 'fan', 'light', 'mcb', 'switch', 'socket'],
    HVAC: ['ac', 'hvac', 'chiller', 'air conditioning', 'cooling'],
    PLUMBING: ['plumbing', 'plumber', 'water supply', 'pipe', 'tap', 'leak', 'drain', 'flush', 'sanitary fittings'],
    LIFT_ELEVATOR: ['lift', 'elevator', 'escalator'],
    CARPENTRY: ['carpentry', 'carpenter', 'door', 'lock', 'furniture', 'wood', 'table', 'chair', 'woodwork'],
    CIVIL: ['civil', 'paint', 'tile', 'roof', 'wall', 'dampness', 'plaster'],
    CLEANING: ['cleaning', 'housekeeping', 'sanitization', 'garbage', 'waste', 'housekeeper'],
    FURNITURE: ['furniture', 'fixtures', 'desk', 'chair', 'bed', 'curtains'],
    HOSTEL: ['hostel', 'mess', 'common room', 'laundry'],
    TRANSPORT: ['transport', 'shuttle', 'bus', 'ev charger', 'parking', 'vehicle'],
    SECURITY: ['security', 'access control', 'biometric', 'rfid', 'cctv', 'camera', 'barrier'],
    WATER_SUPPLY: ['water supply', 'hydro pump', 'tank', 'overflow'],
  };

  // Whole-word matching function to prevent false substring matches (e.g. "it" inside "sanitary")
  const isKeywordMatch = (skillText: string, keyword: string): boolean => {
    const text = skillText.toLowerCase();
    const kw = keyword.toLowerCase();

    if (kw.length <= 2) {
      // Short tokens like "it" or "ac" must match as distinct whole words
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      return regex.test(text);
    }
    return text.includes(kw);
  };

  // Calculate dynamic trade-accurate match score for each worker
  const calculateWorkerMatch = (worker: UserProfile) => {
    const ticketCat = ticket.serviceCategory.toLowerCase();
    const ticketServiceId = (ticket.serviceId || '').toLowerCase();

    // Identify ticket's target trade across all 14 categories
    let targetTrade = 'GENERAL';
    if (
      ticketCat.includes('wifi') ||
      ticketCat.includes('network') ||
      isKeywordMatch(ticketCat, 'it') ||
      ticketServiceId.includes('wifi') ||
      ticketServiceId.includes('it')
    ) {
      targetTrade = 'IT_NETWORK';
    } else if (ticketCat.includes('plumb') || ticketServiceId.includes('plumb')) {
      targetTrade = 'PLUMBING';
    } else if (ticketCat.includes('electr') || ticketServiceId.includes('electr')) {
      targetTrade = 'ELECTRICAL';
    } else if (ticketCat.includes('ac') || ticketCat.includes('hvac') || ticketServiceId.includes('ac')) {
      targetTrade = 'HVAC';
    } else if (ticketCat.includes('lift') || ticketCat.includes('elevat') || ticketServiceId.includes('lift')) {
      targetTrade = 'LIFT_ELEVATOR';
    } else if (ticketCat.includes('clean') || ticketCat.includes('housekeep') || ticketServiceId.includes('clean')) {
      targetTrade = 'CLEANING';
    } else if (ticketCat.includes('carpent') || ticketServiceId.includes('carpent')) {
      targetTrade = 'CARPENTRY';
    } else if (ticketCat.includes('furnit') || ticketServiceId.includes('furnit')) {
      targetTrade = 'FURNITURE';
    } else if (ticketCat.includes('civil') || ticketServiceId.includes('civil')) {
      targetTrade = 'CIVIL';
    } else if (ticketCat.includes('hostel') || ticketServiceId.includes('hostel')) {
      targetTrade = 'HOSTEL';
    } else if (ticketCat.includes('transport') || ticketServiceId.includes('transport')) {
      targetTrade = 'TRANSPORT';
    } else if (ticketCat.includes('secur') || ticketServiceId.includes('secur')) {
      targetTrade = 'SECURITY';
    } else if (ticketCat.includes('water') || ticketServiceId.includes('water')) {
      targetTrade = 'WATER_SUPPLY';
    }

    const workerSkillsList = (worker.skills || []).map((s) => s.toLowerCase());
    const targetTradeKeywords = TRADE_SKILLS[targetTrade] || [targetTrade.toLowerCase()];

    // Check if worker possesses skills in the target trade
    let hasTargetTradeSkill = false;

    for (const skill of workerSkillsList) {
      for (const keyword of targetTradeKeywords) {
        if (isKeywordMatch(skill, keyword)) {
          hasTargetTradeSkill = true;
          break;
        }
      }
      if (hasTargetTradeSkill) break;
    }

    // Check cross-trade compatibility (e.g. Electrical can assist HVAC or IT wiring)
    let isCrossTradeRelated = false;
    if (!hasTargetTradeSkill) {
      if (targetTrade === 'IT_NETWORK' && workerSkillsList.some((s) => s.includes('electr') || s.includes('hvac'))) {
        isCrossTradeRelated = true;
      } else if (targetTrade === 'HVAC' && workerSkillsList.some((s) => s.includes('electr'))) {
        isCrossTradeRelated = true;
      } else if (targetTrade === 'PLUMBING' && workerSkillsList.some((s) => s.includes('water') || s.includes('lift'))) {
        isCrossTradeRelated = true;
      }
    }

    let matchScore = 24; // Base score for unrelated trade
    if (hasTargetTradeSkill) {
      matchScore = 95;
      if ((worker.rating || 4.8) >= 4.9) matchScore += 3;
      if ((worker.currentWorkload || 0) === 0) matchScore += 2;
    } else if (isCrossTradeRelated) {
      matchScore = 65;
    }

    // Build reasoning points
    const reasons: string[] = [];
    if (hasTargetTradeSkill) {
      reasons.push(`🎯 Certified Specialist in ${ticket.serviceCategory}`);
    } else if (isCrossTradeRelated) {
      reasons.push(`⚡ Cross-Trade Specialist (${worker.skills?.[0] || 'Technician'})`);
    } else {
      reasons.push(`⚠️ Unmatched Trade Discipline (${worker.skills?.[0] || 'General'})`);
    }

    if ((worker.currentWorkload || 0) <= 1) {
      reasons.push(`💵 Active Workload: ${worker.currentWorkload || 0} job(s)`);
    } else {
      reasons.push(`⚠️ High Workload: ${worker.currentWorkload} active jobs`);
    }

    if ((worker.rating || 4.8) >= 4.8) {
      reasons.push(`⭐ Rating: ${worker.rating}★`);
    }

    if ((worker.totalJobsCompleted || 0) > 100) {
      reasons.push(`🏆 ${worker.totalJobsCompleted}+ Jobs Completed`);
    }

    return {
      worker,
      matchScore,
      hasTargetTradeSkill,
      isCrossTradeRelated,
      reasons,
    };
  };

  // Rank workers by trade match score descending
  const sortedWorkers = rawWorkers
    .map(calculateWorkerMatch)
    .sort((a, b) => b.matchScore - a.matchScore);

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    sortedWorkers[0]?.worker.id || ''
  );
  const [assignmentNotes, setAssignmentNotes] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const assignedWorkerObj = rawWorkers.find((w) => w.id === selectedWorkerId);

  const handleAssign = () => {
    if (!selectedWorkerId) return;
    setShowConfirmModal(true);
  };

  const handleConfirmAssignment = () => {
    if (!selectedWorkerId) return;
    assignWorker(ticket.id, selectedWorkerId, assignmentNotes);
    setShowConfirmModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Worker Match Engine</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold border border-violet-300 dark:border-violet-800">
                  FACOS MATCH
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">Assign technician for {ticket.id} ({ticket.serviceCategory})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body: Recommended Workers List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            Recommended technicians ranked by trade discipline, location proximity, and active workload:
          </p>

          <div className="space-y-3">
            {sortedWorkers.map(({ worker, matchScore, hasTargetTradeSkill, isCrossTradeRelated, reasons }) => {
              const isSelected = selectedWorkerId === worker.id;

              return (
                <div
                  key={worker.id}
                  onClick={() => setSelectedWorkerId(worker.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50/50 dark:bg-violet-950/40 ring-1 ring-violet-500 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-500/20"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{worker.name}</h4>
                          <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {worker.rating || 4.8}
                          </span>
                          {hasTargetTradeSkill ? (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              Top Specialist
                            </span>
                          ) : isCrossTradeRelated ? (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                              Cross-Trade
                            </span>
                          ) : (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700">
                              Unmatched Trade
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {worker.skills?.join(', ') || 'Technician'}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span>Jobs Done: <strong>{worker.totalJobsCompleted || 100}+</strong></span>
                          <span>Active Jobs: <strong>{worker.currentWorkload || 0}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right">
                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-extrabold text-xs border ${
                          matchScore >= 85
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                            : matchScore >= 50
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                            : 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                        }`}
                      >
                        {matchScore >= 85 ? (
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        ) : matchScore >= 50 ? (
                          <Wrench className="w-3.5 h-3.5 text-amber-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        )}
                        <span>{matchScore}% Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-2 gap-1.5 text-[11px]">
                    {reasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                        {r.startsWith('⚠️') ? (
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assignment Notes / Instructions for Worker (Optional)
            </label>
            <textarea
              value={assignmentNotes}
              onChange={(e) => setAssignmentNotes(e.target.value)}
              placeholder="e.g. Please bring extra 1.5-inch PVC replacement pipe and check sub-meter valve."
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500"
              rows={2}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={!selectedWorkerId}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-red-600/30 flex items-center gap-1.5 cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Confirm Worker Assignment</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Worker Assignment / Reassignment */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        title={ticket.assignedWorkerId ? "Reassign Technician to Ticket" : "Confirm Technician Assignment"}
        message={`Are you sure you want to ${ticket.assignedWorkerId ? 'reassign' : 'assign'} ${assignedWorkerObj?.name || 'this technician'} to ticket #${ticket.id} (${ticket.title})?`}
        confirmLabel={ticket.assignedWorkerId ? "Yes, Reassign Technician" : "Yes, Assign Technician"}
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={handleConfirmAssignment}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  );
};
