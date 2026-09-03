'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Home,
  LayoutGrid,
  FileText,
  Utensils,
  Shirt,
  UserCheck,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { activeRole } = useApp();

  const isCourierManager = activeRole === 'courier_manager';
  const isSportsManager = activeRole === 'sports_manager';

  const navItems = isCourierManager
    ? [
        { label: 'Portal', href: '/courier/portal', icon: Home },
        { label: 'Deliveries', href: '/courier', icon: FileText },
        { label: 'Food', href: '/food', icon: Utensils },
        { label: 'Laundry', href: '/laundry', icon: Shirt },
        { label: 'Profile', href: '/profile', icon: UserCheck },
      ]
    : isSportsManager
    ? [
        { label: 'Portal', href: '/sports/portal', icon: Home },
        { label: 'Bookings', href: '/sports', icon: FileText },
        { label: 'Food', href: '/food', icon: Utensils },
        { label: 'Laundry', href: '/laundry', icon: Shirt },
        { label: 'Profile', href: '/profile', icon: UserCheck },
      ]
    : [
        { label: 'Home', href: '/', icon: Home },
        { label: 'Laundry', href: '/laundry', icon: Shirt },
        { label: 'Order Food', href: '/food', icon: Utensils },
        { label: 'Requests', href: '/my-requests', icon: FileText },
        { label: 'Services', href: '/select-facility', icon: LayoutGrid },
      ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 pb-safe shadow-2xl">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-red-600 dark:text-red-400 font-black scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 font-semibold'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
