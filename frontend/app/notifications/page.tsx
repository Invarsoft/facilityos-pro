'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Bell, CheckCircle2, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    clearAllNotifications,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-red-600" />
            <span>Notification & Alert Center</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time updates on ticket progress, SLA countdowns, and requester verification alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-extrabold text-xs border border-red-200 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-red-600" />
              <span>Mark All Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 font-extrabold text-xs border border-slate-200 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-slate-500 hover:text-red-600" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto opacity-70" />
            <p className="text-sm font-black text-slate-900">All Caught Up!</p>
            <p className="text-xs text-slate-500 font-medium">You have no unread notifications or alerts.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                !n.read
                  ? 'bg-red-50/60 border-red-200 text-slate-900'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-sm text-slate-900">{n.title}</span>
                  {!n.read ? (
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white">NEW</span>
                  ) : (
                    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">READ</span>
                  )}
                </div>
                <p className="text-xs text-slate-700 font-medium">{n.message}</p>
                <span className="text-[10px] text-slate-400 font-mono block pt-1">{n.timestamp}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    ✓ Mark Read
                  </button>
                )}

                {n.ticketId && (
                  <Link
                    href={`/requests/${n.ticketId}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-xs transition-all"
                  >
                    View Ticket →
                  </Link>
                )}

                <button
                  onClick={() => clearNotification(n.id)}
                  className="p-2 rounded-xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-700 border border-slate-200 transition-all cursor-pointer"
                  title="Clear / Dismiss Notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
