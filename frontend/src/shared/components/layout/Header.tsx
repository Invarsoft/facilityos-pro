'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { Role, FacilityType } from '@/lib/types';
import { getRoleDisplayName } from '@/lib/utils';
import {
  Building2,
  UserCheck,
  Sun,
  Moon,
  Bell,
  AlertTriangle,
  ChevronDown,
  Menu,
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  LogOut,
  User,
  Send,
  LogIn,
} from 'lucide-react';
import { EmergencyModal } from '@/src/features/tickets/components/EmergencyModal';
import { AddFacilityModal } from './AddFacilityModal';
import { RequestFacilityOnboardingModal } from './RequestFacilityOnboardingModal';

function HeaderContent({ toggleSidebar }: { toggleSidebar?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    activeOrg,
    isAuthenticated,
    activeRole,
    setActiveRole,
    currentUser,
    logout,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    setAiDrawerOpen,
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [addFacilityModalOpen, setAddFacilityModalOpen] = useState(false);
  const [requestOnboardingModalOpen, setRequestOnboardingModalOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Determine if current page is unauthenticated or public onboarding
  const isUnauthenticatedPage =
    !isAuthenticated ||
    pathname.startsWith('/login') ||
    pathname === '/' ||
    pathname === '/select-facility' ||
    pathname === '/organizations';

  const availableRoles: { role: Role; label: string }[] = [
    {
      role: activeOrg.type === 'university' ? 'student' : activeOrg.type === 'apartment' ? 'resident' : 'employee',
      label: activeOrg.type === 'university' ? 'Student / Requester' : activeOrg.type === 'apartment' ? 'Resident / Requester' : 'Employee / Requester',
    },
    { role: 'worker', label: 'Technician / Field Worker' },
    {
      role: activeOrg.type === 'university' ? 'warden' : 'manager',
      label: getRoleDisplayName(activeOrg.type === 'university' ? 'warden' : 'manager', activeOrg.type),
    },
    { role: 'org_admin', label: `${activeOrg.name} Admin` },
    { role: 'super_admin', label: 'FacilityOS System Super Admin' },
  ];

  const closeAllDropdowns = () => {
    setRoleDropdownOpen(false);
    setNotifDropdownOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full max-w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-2.5 sm:px-4 backdrop-blur-md transition-colors overflow-x-clip">
        {/* Left Section: Logo & Static Tenant Badge */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {toggleSidebar && !isUnauthenticatedPage && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
              aria-label="Toggle Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group" onClick={closeAllDropdowns}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform text-sm sm:text-base">
              F
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  FacilityOS
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 hidden sm:inline-block">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden md:block">
                Manage. Maintain. Resolve.
              </p>
            </div>
          </Link>

          {/* Static Tenant Badge - NO POPUP DROPDOWN */}
          {!isUnauthenticatedPage && (
            <>
              <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block" />

              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span className="text-base">{activeOrg.logo}</span>
                <span className="max-w-[140px] truncate">{activeOrg.name}</span>
                {activeOrg.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
              </div>
            </>
          )}
        </div>

        {/* Right Section: Actions, Role Selector & Profile / Sign In */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Emergency Alert Button - ONLY SHOWN WHEN AUTHENTICATED */}
          {!isUnauthenticatedPage && (
            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 animate-pulse transition-transform active:scale-95"
              title="Trigger Immediate Emergency Maintenance Dispatch"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden lg:inline">Emergency</span>
            </button>
          )}

          {/* Dispatch Desk Trigger - ONLY SHOWN WHEN AUTHENTICATED */}
          {!isUnauthenticatedPage && (
            <button
              onClick={() => setAiDrawerOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
            >
              <UserCheck className="w-4 h-4 text-violet-200" />
              <span className="hidden lg:inline">Dispatch Desk</span>
            </button>
          )}

          {/* Quick Demo Role Switcher Bar - ONLY SHOWN WHEN AUTHENTICATED */}
          {!isUnauthenticatedPage && (
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setNotifDropdownOpen(false);
                  setUserMenuOpen(false);
                }}
                className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-[11px] sm:text-xs font-semibold hover:bg-amber-500/20 transition-all max-w-[110px] sm:max-w-none"
              >
                <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="hidden md:inline">Role:</span>
                <span className="font-bold truncate max-w-[55px] sm:max-w-[140px]">{getRoleDisplayName(activeRole, activeOrg.type, activeOrg.name)}</span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500 shrink-0" />
              </button>

              {roleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                      Demo Role Switcher
                    </div>
                    <p className="px-3 pb-2 text-[10px] text-slate-400 border-b border-slate-100 dark:border-slate-800">
                      Instantly preview UI as different system actors:
                    </p>
                    <div className="space-y-1 mt-1">
                      {availableRoles.map((r) => (
                        <button
                          key={r.role}
                          onClick={() => {
                            setActiveRole(r.role);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                            activeRole === r.role
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{r.label}</span>
                          {activeRole === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:block"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Notifications Dropdown - ONLY SHOWN WHEN AUTHENTICATED */}
          {!isUnauthenticatedPage && (
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
                  setRoleDropdownOpen(false);
                  setUserMenuOpen(false);
                }}
                className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              {notifDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-xl z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Notifications</span>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{unreadNotifs.length} new</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto space-y-2 py-2">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                            !n.read
                              ? 'bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50'
                              : 'bg-slate-50 dark:bg-slate-800/40 text-slate-500'
                          }`}
                        >
                          <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">{n.title}</p>
                          <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">{n.timestamp}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                      <Link
                        href="/notifications"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View All Notifications
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* User Profile Menu Dropdown OR Sign In Button */}
          {!isUnauthenticatedPage && currentUser ? (
            <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setRoleDropdownOpen(false);
                  setNotifDropdownOpen(false);
                }}
                className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/30"
                />
                <div className="hidden xl:block">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400">{currentUser.email}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="pb-3 border-b border-slate-100 dark:border-slate-800 space-y-1">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-white">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                      <span className="inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {getRoleDisplayName(activeRole, activeOrg.type, activeOrg.name)}
                      </span>
                    </div>

                    <div className="py-2 space-y-1 text-xs">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <User className="w-4 h-4 text-blue-500" />
                        <span>My Account Portal</span>
                      </Link>

                      <Link
                        href="/select-facility"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Building2 className="w-4 h-4 text-indigo-500" />
                        <span>Browse / Switch Active Facility</span>
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-extrabold text-xs transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span>Sign Out / Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 shrink-0"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </header>

      {/* Emergency Request Modal */}
      {emergencyModalOpen && (
        <EmergencyModal onClose={() => setEmergencyModalOpen(false)} />
      )}

      {/* Admin Facility Provisioning Modal */}
      {addFacilityModalOpen && (
        <AddFacilityModal onClose={() => setAddFacilityModalOpen(false)} />
      )}

      {/* User Facility Onboarding Request Modal */}
      {requestOnboardingModalOpen && (
        <RequestFacilityOnboardingModal onClose={() => setRequestOnboardingModalOpen(false)} />
      )}
    </>
  );
}

export const Header: React.FC<{ toggleSidebar?: () => void }> = (props) => {
  return (
    <Suspense fallback={<div className="h-16 border-b bg-white dark:bg-slate-900" />}>
      <HeaderContent {...props} />
    </Suspense>
  );
};
