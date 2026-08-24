'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Clock, PlusCircle, ShieldAlert } from 'lucide-react';

export default function SLAManagementPage() {
  const { slaRules, activeOrg } = useApp();

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-rose-500" />
            <span>SLA Rule Matrix & Escalation Engine</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure response and resolution deadlines per service category & priority for {activeOrg.name}
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md">
          <PlusCircle className="w-4 h-4" />
          <span>Add SLA Rule</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">Service Category</th>
              <th className="p-4">Priority Level</th>
              <th className="p-4">Max First Response SLA</th>
              <th className="p-4">Max Resolution SLA</th>
              <th className="p-4">Auto-Escalation Flow</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {slaRules.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{rule.category}</td>
                <td className="p-4">
                  <span className="uppercase text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-600">
                    {rule.priority}
                  </span>
                </td>
                <td className="p-4 font-mono font-bold text-blue-500">{rule.responseTimeHours} Hours</td>
                <td className="p-4 font-mono font-bold text-emerald-500">{rule.resolutionTimeHours} Hours</td>
                <td className="p-4 text-slate-500 font-medium">Worker → Manager → Admin</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
