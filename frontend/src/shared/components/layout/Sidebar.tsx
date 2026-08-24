'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  LayoutDashboard,
  UserPlus,
  PlusCircle,
  ClipboardList,
  Wrench,
  UserCheck,
  Building,
  Building2,
  Box,
  CalendarCheck,
  Clock,
  BarChart3,
  Users,
  Settings,
  FileText,
  Shield,
  Bell,
  QrCode,
  LogOut,
} from 'lucide-react';

interface SidebarLink {
  href: string;
  label: string;
  icon: any;
  highlight?: boolean;
  badge?: string;
}

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({ isOpen = true, onClose }) => {
  const pathname = usePathname();
  const { activeRole, activeOrg, logout } = useApp();

  const isRequester = activeRole === 'student' || activeRole === 'resident' || activeRole === 'employee' || activeRole === 'staff';
  const isWorker = activeRole === 'worker' || activeRole === 'technician';
  const isManager = activeRole === 'warden' || activeRole === 'manager';
  const isSuperAdmin = activeRole === 'super_admin';

  const requesterLinks: SidebarLink[] = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/requests/new', label: 'Raise Request', icon: PlusCircle, highlight: true },
    { href: '/my-requests', label: 'My Requests', icon: ClipboardList },
    { href: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const workerLinks: SidebarLink[] = [
    { href: '/worker', label: 'My Task Queue', icon: Wrench },
    { href: '/my-requests', label: 'Completed Jobs', icon: ClipboardList },
    { href: '/notifications', label: 'Alerts', icon: Bell },
  ];

  const managerLinks: SidebarLink[] = [
    { href: '/manager', label: 'Operations Dashboard', icon: LayoutDashboard },
    { href: '/manager/assignments', label: 'Worker Assignments', icon: UserCheck, badge: 'Facos Match' },
    { href: '/requests', label: 'Request Directory', icon: ClipboardList },
    { href: '/admin/analytics', label: 'SLA & Performance', icon: BarChart3 },
    { href: '/admin/facilities', label: 'Facilities', icon: Building },
  ];

  const adminLinks: SidebarLink[] = [
    { href: '/admin', label: 'Command Center', icon: LayoutDashboard },
    ...(isSuperAdmin
      ? [
          { href: '/organizations', label: 'Registered Organizations', icon: Building2, highlight: true, badge: 'Super Admin' },
          { href: '/admin/onboarding', label: 'Onboarding Requests', icon: UserPlus, highlight: true, badge: 'Super Admin' },
        ]
      : []),
    { href: '/admin/analytics', label: 'Analytics & Insights', icon: BarChart3 },
    { href: '/admin/users', label: 'User Directory', icon: Users },
    { href: '/admin/workers', label: 'Worker Fleet', icon: Wrench },
    { href: '/admin/facilities', label: 'Facility Hierarchy', icon: Building },
    { href: '/admin/assets', label: 'Asset Management', icon: Box },
    { href: '/admin/preventive', label: 'Preventive Schedule', icon: CalendarCheck },
    { href: '/admin/sla', label: 'SLA Engine', icon: Clock },
    { href: '/admin/reports', label: 'Export Reports', icon: FileText },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: Shield },
    { href: '/admin/settings', label: 'Org Branding & Setup', icon: Settings },
  ];

  const links = isRequester
    ? requesterLinks
    : isWorker
    ? workerLinks
    : isManager
    ? managerLinks
    : adminLinks;

  return (
    <aside
      className={`fixed md:sticky top-16 z-20 h-[calc(100vh-4rem)] w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 flex flex-col justify-between p-4 transition-all duration-200 ${
        isOpen ? 'left-0' : '-left-64 md:left-0'
      }`}
    >
      <div className="space-y-6 overflow-y-auto pr-1">
        {/* Tenant Active Badge */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <span className="text-xl p-1.5 rounded-lg bg-slate-700">
              {activeRole === 'super_admin' && activeOrg.id === 'global-facilityos-all' ? '🌐' : activeOrg.logo}
            </span>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {activeRole === 'super_admin' && activeOrg.id === 'global-facilityos-all' ? 'FacilityOS Global Platform' : activeOrg.name}
              </p>
              <p className="text-[10px] text-slate-400 font-medium capitalize">
                {activeRole === 'super_admin' ? 'System Super Admin' : `${activeOrg.type} Portal`}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {isRequester ? 'Services & Tracking' : isWorker ? 'Technician Tasks' : isManager ? 'Management Console' : 'Administration'}
          </div>
          <nav className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    link.highlight
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20'
                      : isActive
                      ? 'bg-slate-800 text-blue-400 font-bold border-l-2 border-blue-500'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${link.highlight ? 'text-white' : isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 uppercase tracking-wider">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer User Info & Logout */}
      <div className="pt-4 border-t border-slate-800 space-y-2">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 text-xs font-bold transition-all border border-slate-700/50 hover:border-rose-800/50"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          <span>Sign Out / Logout</span>
        </button>
        <p className="text-[9px] text-center text-slate-500 font-mono">FacilityOS v2.6</p>
      </div>
    </aside>
  );
};
