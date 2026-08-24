'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Home,
  Building2,
  PlusCircle,
  FileText,
  LayoutDashboard,
  Bell,
  Wrench,
  UserCheck,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, activeRole, notifications } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getAdminTabHref = () => {
    if (activeRole === 'worker') return '/worker';
    if (activeRole === 'manager' || activeRole === 'warden') return '/manager';
    return '/admin';
  };

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Facilities', href: '/organizations', icon: Building2 },
    { label: 'New', href: '/requests/new', icon: PlusCircle, isHighlight: true },
    { label: 'Requests', href: '/my-requests', icon: FileText },
    {
      label: activeRole === 'worker' ? 'Jobs' : activeRole === 'manager' ? 'Ops' : 'Admin',
      href: getAdminTabHref(),
      icon: LayoutDashboard,
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 pb-safe shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          if (item.isHighlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 ring-4 ring-slate-50 dark:ring-slate-950 active:scale-95 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.label === 'Requests' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
