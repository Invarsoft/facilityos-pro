'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Bell, CheckCircle2, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, markNotificationRead } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-500" />
          <span>Notification & Alert Center</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Real-time updates on ticket progress, SLA countdowns, and requester verification alerts
        </p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => markNotificationRead(n.id)}
            className={`p-4 rounded-2xl border cursor-pointer transition-all shadow-xs ${
              !n.read
                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{n.title}</span>
                  {!n.read && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">NEW</span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">{n.message}</p>
                <span className="text-[10px] text-slate-400 block">{n.timestamp}</span>
              </div>

              {n.ticketId && (
                <Link
                  href={`/requests/${n.ticketId}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shrink-0"
                >
                  View Ticket →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
