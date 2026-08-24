'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Wrench, Star, PlusCircle } from 'lucide-react';

export default function WorkerManagementPage() {
  const { users, activeOrg } = useApp();
  const workers = users.filter(
    (u) => u.orgId === activeOrg.id && (u.role === 'worker' || u.role === 'technician')
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-6 h-6 text-indigo-500" />
            <span>Technician & Worker Fleet</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage worker skills, availability, assignment workloads, and ratings for {activeOrg.name}
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md">
          <PlusCircle className="w-4 h-4" />
          <span>Register New Technician</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {workers.map((w) => (
          <div key={w.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <img src={w.avatar} alt={w.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-violet-500/30" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{w.name}</h3>
                <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{w.rating || 4.8} Rating</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Specialist Skills:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {w.skills?.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 font-bold text-[10px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-slate-500">
                <span>Jobs Completed:</span>
                <span className="font-bold text-slate-900 dark:text-white">{w.totalJobsCompleted || 120}+</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Active Workload:</span>
                <span className="font-bold text-blue-500">{w.currentWorkload || 0} Active</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
