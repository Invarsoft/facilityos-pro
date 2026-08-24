'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Shield, Search } from 'lucide-react';

export default function AuditLogsPage() {
  const { auditLogs } = useApp();

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-teal-500" />
          <span>System Audit Trail & Security Logs</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Immutable history of all system events, role permissions, and status changes
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Filter audit logs by user, action, ticket ID..."
          className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">User / Actor</th>
              <th className="p-4">Action</th>
              <th className="p-4">Target Ticket</th>
              <th className="p-4">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-mono text-[11px] text-slate-400">{log.timestamp}</td>
                <td className="p-4 font-bold text-slate-900 dark:text-slate-100">{log.user}</td>
                <td className="p-4 font-semibold text-blue-600 dark:text-blue-400">{log.action}</td>
                <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">{log.ticketId || 'System'}</td>
                <td className="p-4 text-slate-500">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
