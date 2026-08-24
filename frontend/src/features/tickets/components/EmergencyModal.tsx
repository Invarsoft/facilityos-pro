'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { AlertTriangle, ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface EmergencyModalProps {
  onClose: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({ onClose }) => {
  const { triggerEmergency, activeOrg } = useApp();
  const [emergencyType, setEmergencyType] = useState<string>('Electrical Danger / Fire Hazard');
  const [location, setLocation] = useState<string>('Hostel A - Room 204');
  const [details, setDetails] = useState<string>('Sparks coming out of main circuit breaker panel.');
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const emergencyTypes = [
    'Electrical Danger / Fire Hazard',
    'Major Water Flooding / Main Burst',
    'Elevator Breakdown with Passenger',
    'Gas Leak / Hazardous Chemical',
    'Structural Safety Hazard',
  ];

  const handleSubmit = () => {
    if (!confirmed) return;
    const ticket = triggerEmergency(emergencyType, 'Emergency Dispatch', location, details);
    setSubmittedTicketId(ticket.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-rose-600 overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider">FacilityOS Emergency Dispatch</h3>
              <p className="text-[10px] text-rose-100 font-medium">Immediate Priority Response for {activeOrg.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white hover:bg-rose-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {submittedTicketId ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Emergency Alert Dispatched!
                </h4>
                <p className="text-xs text-rose-600 font-bold mt-1">Ticket ID: {submittedTicketId}</p>
                <p className="text-xs text-slate-500 mt-2">
                  The on-call Facility Operations Supervisor and Quick Response Unit have been notified via SMS & Push Alert.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs"
              >
                Close & Track Emergency Ticket
              </button>
            </div>
          ) : (
            <>
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 font-medium">
                ⚠️ Emergency requests trigger immediate alarms to Facility Management. Please use only for critical hazards threatening safety or major structural damage.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Select Emergency Category:
                </label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500"
                >
                  {emergencyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Exact Location:
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Hostel A - Block B - Floor 2 - Room 204"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Situation Details:
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe the hazard and immediate safety risk..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500"
                  rows={2}
                />
              </div>

              {/* Mandatory Confirmation Step */}
              <label className="flex items-center gap-2 p-3 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30 text-xs text-rose-900 dark:text-rose-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                />
                <span className="font-bold">I confirm this is a genuine high-priority emergency.</span>
              </label>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="w-1/3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  disabled={!confirmed}
                  onClick={handleSubmit}
                  className={`w-2/3 py-2.5 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all ${
                    confirmed
                      ? 'bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/30 animate-pulse'
                      : 'bg-slate-400 cursor-not-allowed'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>TRIGGER EMERGENCY DISPATCH</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
