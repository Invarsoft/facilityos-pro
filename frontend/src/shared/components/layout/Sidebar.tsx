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
  Key,
  User,
  X,
} from 'lucide-react';

interface SidebarLink {
  href: string;
  label: string;
  icon: any;
  highlight?: boolean;
  badge?: string;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { activeRole, activeOrg, currentUser, logout } = useApp();

  const isCourierManager = activeRole === 'courier_manager';
  const isSportsManager = activeRole === 'sports_manager';
  const isLaundryManager = activeRole === 'laundry_manager';
  const isFoodManager = activeRole === 'food_manager';
  const isRequester = activeRole === 'student' || activeRole === 'resident' || activeRole === 'employee' || activeRole === 'staff';
  const isWorker = activeRole === 'worker' || activeRole === 'technician';
  const isManager = activeRole === 'warden' || activeRole === 'manager';
  const isSuperAdmin = activeRole === 'super_admin';

  const courierManagerLinks: SidebarLink[] = [
    { href: '/courier/portal', label: 'Courier Operations Portal', icon: Box, highlight: true },
    { href: '/courier', label: 'Deliveries & Intake', icon: ClipboardList },
    { href: '/profile', label: 'My Profile', icon: User },
  ];

  const sportsManagerLinks: SidebarLink[] = [
    { href: '/sports/portal', label: 'Sports Admin Portal', icon: QrCode, highlight: true },
    { href: '/sports', label: 'Court Reservations', icon: CalendarCheck },
    { href: '/profile', label: 'My Profile', icon: User },
  ];

  const laundryManagerLinks: SidebarLink[] = [
    { href: '/laundry', label: 'Hostel Laundry Operations', icon: CalendarCheck, highlight: true },
    { href: '/profile', label: 'My Profile', icon: User },
  ];

  const foodManagerLinks: SidebarLink[] = [
    { href: '/food', label: 'Canteen & Food Orders Desk', icon: Box, highlight: true },
    { href: '/profile', label: 'My Profile', icon: User },
  ];

  const wardenLinks: SidebarLink[] = [
    { href: '/manager', label: 'Hostel Operations Console', icon: LayoutDashboard },
    { href: '/manager/assignments', label: 'Worker Match Center', icon: Wrench, badge: 'Facos Match' },
    { href: '/requests', label: 'Hostel Repairs Queue', icon: ClipboardList },
    { href: '/profile', label: 'My Profile', icon: User },
  ];

  const requesterLinks: SidebarLink[] = [
    { href: '/', label: 'Overview', icon: LayoutDashboard },
    { href: '/requests/new', label: 'Raise Request', icon: PlusCircle, highlight: true },
    { href: '/my-requests', label: 'My Requests', icon: ClipboardList },
    { href: '/food', label: 'Canteen & Food Court', icon: Box },
    { href: '/laundry', label: 'Laundry & Washer Bay', icon: CalendarCheck },
    { href: '/outing', label: 'Outing & Gate Pass', icon: Key, badge: 'Gate' },
    { href: '/courier', label: 'Courier & Mailroom', icon: Box, badge: 'OTP' },
    { href: '/sports', label: 'Sports Arena & Courts', icon: QrCode },
    { href: '/amenities', label: 'Space & Amenities', icon: CalendarCheck },
    { href: '/notifications', label: 'Notifications', icon: Bell },
  ];

  const workerLinks: SidebarLink[] = [
    { href: '/worker', label: 'My Task Queue', icon: Wrench },
    { href: '/my-requests', label: 'Completed Jobs', icon: ClipboardList },
    { href: '/notifications', label: 'Alerts', icon: Bell },
  ];

  const links = isCourierManager
    ? courierManagerLinks
    : isSportsManager
    ? sportsManagerLinks
    : isLaundryManager
    ? laundryManagerLinks
    : isFoodManager
    ? foodManagerLinks
    : isManager
    ? wardenLinks
    : isWorker
    ? workerLinks
    : requesterLinks;

  return (
    <aside className="hidden md:flex md:sticky top-16 z-20 h-[calc(100vh-4rem)] w-64 border-r border-slate-800 bg-slate-900 text-slate-100 flex-col justify-between p-4 shadow-2xl shrink-0">
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Header Row: Woxsen Logo + Mobile Close Button */}
          <div className="px-2 py-1 pb-3 border-b border-slate-800/80 flex items-center justify-between">
            <img
              src="/woxsen-logo-transparent.png"
              alt="Woxsen University"
              className="h-10 object-contain filter drop-shadow-sm"
            />
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white md:hidden cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* User Account Profile Card inside Drawer */}
          {currentUser && (
            <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-red-600/40 shrink-0"
                />
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose?.();
                  const avatarBtn = document.querySelector<HTMLButtonElement>('button[title*="Profile"]');
                  if (avatarBtn) avatarBtn.click();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white font-extrabold text-[11px] border border-red-500/30 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Edit Profile & Avatar</span>
              </button>
            </div>
          )}

          {/* Navigation Menu */}
          <div>
            {!isRequester && !isWorker && !isCourierManager && !isSportsManager && !isLaundryManager && !isFoodManager && !isManager ? (
              /* EXECUTIVE ADMIN PANEL CATEGORIZED BOXES */
              <div className="space-y-4">
                {/* BOX 1: OPERATIONS COMMAND */}
                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-1.5 shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Operations & Intelligence</span>
                  </div>
                  <nav className="space-y-1 pt-1">
                    {[
                      { href: '/admin', label: 'Analytics & Insights', icon: BarChart3 },
                      { href: '/my-requests', label: 'Requests Directory', icon: ClipboardList },
                      { href: '/manager', label: 'Hostel Warden Console', icon: LayoutDashboard },
                      ...(isSuperAdmin
                        ? [
                            { href: '/organizations', label: 'Registered Orgs', icon: Building2, highlight: true, badge: 'Super' },
                            { href: '/admin/onboarding', label: 'Onboarding Requests', icon: UserPlus, highlight: true, badge: 'Super' },
                          ]
                        : []),
                    ].map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={onClose}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                            isActive
                              ? 'bg-red-600 text-white font-black shadow-md'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-bold'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span>{link.label}</span>
                          </div>
                          {link.badge && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/20 text-white uppercase">
                              {link.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* BOX 2: WORKFORCE & SECURITY */}
                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-1.5 shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
                    <Users className="w-3.5 h-3.5" />
                    <span>Workforce & Security</span>
                  </div>
                  <nav className="space-y-1 pt-1">
                    {[
                      { href: '/admin/users', label: 'User Directory', icon: Users },
                      { href: '/admin/workers', label: 'Worker Fleet', icon: Wrench },
                      { href: '/admin/access-codes', label: 'Access Code Engine', icon: Key },
                    ].map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={onClose}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                            isActive
                              ? 'bg-red-600 text-white font-black shadow-md'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-bold'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span>{link.label}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* BOX 3: SETUP & AUDITING */}
                <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-1.5 shadow-sm">
                  <div className="text-[10px] font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5 pb-1 border-b border-slate-800/80">
                    <Settings className="w-3.5 h-3.5" />
                    <span>Setup & Auditing</span>
                  </div>
                  <nav className="space-y-1 pt-1">
                    {[
                      { href: '/admin/facilities', label: 'Facility Hierarchy', icon: Building },
                      { href: '/admin/sla', label: 'SLA Engine', icon: Clock },
                      { href: '/admin/reports', label: 'Export Reports', icon: FileText },
                      { href: '/admin/audit-logs', label: 'Audit Logs', icon: Shield },
                      { href: '/admin/settings', label: 'Org Branding & Setup', icon: Settings },
                    ].map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={onClose}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                            isActive
                              ? 'bg-red-600 text-white font-black shadow-md'
                              : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-bold'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span>{link.label}</span>
                          </div>
                        {(link as SidebarLink).badge && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/20 text-white uppercase tracking-wider">
                            {(link as SidebarLink).badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          ) : (
            /* NON-ADMIN REGULAR SIDEBAR */
            <div>
              <div className="px-3 mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                {isRequester ? 'Services & Tracking' : isWorker ? 'Technician Tasks' : 'Management Console'}
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
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs transition-all ${
                        isActive
                          ? 'bg-red-600 text-white font-black shadow-md shadow-red-600/30'
                          : link.highlight
                          ? 'bg-slate-800/70 text-red-400 hover:bg-red-600 hover:text-white font-bold border border-red-500/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : link.highlight ? 'text-red-400' : 'text-slate-400'}`} />
                        <span>{link.label}</span>
                      </div>
                      {link.badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-white/20 text-white uppercase tracking-wider">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
          </div>
        </div>

        {/* Footer User Info & Logout */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-2xl bg-slate-800/70 hover:bg-red-950/70 text-slate-300 hover:text-white text-xs font-black transition-all border border-slate-700/60 hover:border-red-600/60 shadow-xs cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out / Logout</span>
          </button>
          <p className="text-[9px] text-center text-slate-500 font-mono">FacilityOS v2.6</p>
        </div>
      </aside>
  );
};
