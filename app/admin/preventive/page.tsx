'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { CalendarCheck, PlusCircle, Clock, CheckCircle2 } from 'lucide-react';

export default function PreventiveMaintenancePage() {
  const { preventiveSchedules, activeOrg } = useApp();

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-purple-500" />
            <span>Preventive Maintenance Scheduler</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Automated recurring work orders and safety inspections for {activeOrg.name}
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md">
          <PlusCircle className="w-4 h-4" />
          <span>Schedule New Inspection</span>
        </button>
      </div>

      <div className="space-y-3">
        {preventiveSchedules.map((pm) => (
          <div
            key={pm.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  {pm.frequency} Recurring
                </span>
                <span className="text-xs text-slate-400 font-mono">Next Due: {pm.nextDueDate}</span>
              </div>

              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{pm.title}</h3>
              <p className="text-xs text-slate-500">
                Category: <strong>{pm.assetCategory}</strong> • Location: <strong>{pm.facility}</strong> • Assigned: {pm.assignedWorkerName}
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {pm.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
