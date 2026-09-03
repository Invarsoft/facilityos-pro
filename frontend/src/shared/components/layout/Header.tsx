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
import { RoomSearchSelector } from '@/src/shared/components/ui/RoomSearchSelector';

const AVATAR_PRESETS = [
  { label: 'Executive Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Executive Male', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80' },
  { label: 'Academic Director', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { label: 'Staff Lead', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Student Female', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { label: 'Student Male', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { label: 'Technician Specialist', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
];

function HeaderContent({ toggleSidebar }: { toggleSidebar?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    activeOrg,
    isAuthenticated,
    currentUser,
    updateUser,
    logout,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    clearAllNotifications,
    setAiDrawerOpen,
    sectors,
  } = useApp();

  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [addFacilityModalOpen, setAddFacilityModalOpen] = useState(false);
  const [requestOnboardingModalOpen, setRequestOnboardingModalOpen] = useState(false);

  // Profile Picture & Settings Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileAvatar, setProfileAvatar] = useState('');
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileCustomUrl, setProfileCustomUrl] = useState('');

  // Student Profile Fields
  const [profileRollNo, setProfileRollNo] = useState('');
  const [profileAdmissionNo, setProfileAdmissionNo] = useState('');
  const [profileCourseSection, setProfileCourseSection] = useState('');
  const [profileRoomOrUnit, setProfileRoomOrUnit] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const finalAvatar = profileCustomUrl.trim() || profileAvatar || currentUser.avatar;
    updateUser(currentUser.id, {
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      avatar: finalAvatar,
      rollNo: profileRollNo,
      admissionNo: profileAdmissionNo,
      courseSection: profileCourseSection,
      roomOrUnit: profileRoomOrUnit,
    });
    setIsProfileModalOpen(false);
  };

  const unreadNotifs = notifications.filter((n) => !n.read);

  // Determine if current page is unauthenticated or public onboarding
  const isUnauthenticatedPage = !isAuthenticated;

  const closeAllDropdowns = () => {
    setNotifDropdownOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full max-w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-2.5 sm:px-4 backdrop-blur-md transition-colors overflow-x-clip">
        {/* Left Section: Logo & Static Tenant Badge */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 group" onClick={closeAllDropdowns}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform text-sm sm:text-base">
              F
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  FacilityOS
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1 py-0.2 rounded bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 hidden sm:inline-block">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden md:block">
                Manage. Maintain. Resolve.
              </p>
            </div>
          </Link>

          {/* FacilityOS Header Logo */}
        </div>

        {/* Right Section: Actions, Role Selector & Profile / Sign In */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Emergency Alert Button - ONLY SHOWN WHEN AUTHENTICATED */}
          {!isUnauthenticatedPage && (
            <button
              onClick={() => setEmergencyModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 animate-pulse transition-transform active:scale-95"
              title="Trigger Immediate Emergency Maintenance Dispatch"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden lg:inline">Emergency</span>
            </button>
          )}

          {/* Dispatch Desk Trigger - ONLY SHOWN WHEN AUTHENTICATED */}
          {!isUnauthenticatedPage && (
            <button
              type="button"
              onClick={() => setAiDrawerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/20 transition-transform active:scale-95 cursor-pointer"
              title="Open AI Operations & Dispatch Desk Assistant"
            >
              <UserCheck className="w-4 h-4 text-white" />
              <span>Dispatch Desk</span>
            </button>
          )}



          {/* Notifications Dropdown - ONLY SHOWN WHEN AUTHENTICATED */}
          {!isUnauthenticatedPage && (
            <div className="relative">
              <button
                onClick={() => {
                  setNotifDropdownOpen(!notifDropdownOpen);
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
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">Notifications</span>
                        <span className="text-[10px] text-red-700 font-extrabold px-1.5 py-0.5 rounded bg-red-50 border border-red-200">
                          {unreadNotifs.length} new
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-bold">
                        {unreadNotifs.length > 0 && (
                          <button
                            onClick={markAllNotificationsRead}
                            className="text-red-700 hover:text-red-900 cursor-pointer hover:underline"
                            title="Mark all notifications as read"
                          >
                            ✓ Mark Read
                          </button>
                        )}
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="text-slate-500 hover:text-red-700 cursor-pointer hover:underline"
                            title="Clear all notifications"
                          >
                            🗑️ Clear All
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-2 py-2">
                      {notifications.length === 0 ? (
                        <p className="text-center text-slate-400 text-xs py-4 italic font-medium">No notifications left</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between gap-2 ${
                              !n.read
                                ? 'bg-red-50/80 border border-red-200 text-slate-900'
                                : 'bg-slate-50 border border-slate-200 text-slate-500'
                            }`}
                          >
                            <div className="flex-1">
                              <p className="font-extrabold text-slate-900 text-[11px] leading-snug">{n.title}</p>
                              <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                              <span className="text-[9px] text-slate-400 mt-1 block font-mono">{n.timestamp}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              {!n.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markNotificationRead(n.id);
                                  }}
                                  className="px-1.5 py-0.5 rounded bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] cursor-pointer"
                                  title="Mark as Read"
                                >
                                  Read
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearNotification(n.id);
                                }}
                                className="p-1 rounded hover:bg-slate-200 text-slate-400 hover:text-red-700 text-[10px] cursor-pointer"
                                title="Dismiss Notification"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-center">
                      <Link
                        href="/notifications"
                        onClick={() => setNotifDropdownOpen(false)}
                        className="text-[11px] font-extrabold text-red-600 hover:text-red-700 hover:underline"
                      >
                        View Notification Center →
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* User Profile Link */}
          {!isUnauthenticatedPage && currentUser ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <Link
                href="/profile"
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-left cursor-pointer group shrink-0 border border-slate-200 dark:border-slate-700"
                title="Go to My Profile & Account Settings Page"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-red-600/40 group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px] shadow-xs ring-1 ring-white">
                    👤
                  </span>
                </div>
                <div className="flex flex-col">
                  <p className="text-[11px] font-black text-slate-900 dark:text-white leading-tight">Profile</p>
                  <p className="text-[9px] font-bold text-slate-500 hidden md:block">{currentUser.name?.split(' ')[0]}</p>
                </div>
              </Link>
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

      {/* Profile Picture & User Settings Modal */}
      {isProfileModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" />
                <span>My Profile & Avatar Settings</span>
              </h2>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Avatar Preview & Selection */}
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-4 text-center">
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={profileCustomUrl.trim() || profileAvatar || currentUser.avatar}
                    alt={profileName}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-red-600/30 shadow-lg"
                  />
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{profileName || currentUser.name}</h3>
                    <p className="text-xs text-red-800 font-bold">{currentUser.email}</p>
                  </div>
                </div>

                {/* Preset Avatars Grid */}
                <div className="space-y-2 pt-2 border-t border-red-200/80 text-left">
                  <span className="block text-xs font-black text-red-950">Choose Preset Avatar Picture:</span>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          setProfileAvatar(preset.url);
                          setProfileCustomUrl('');
                        }}
                        className={`p-1 rounded-full border-2 transition-all shrink-0 cursor-pointer ${
                          profileAvatar === preset.url && !profileCustomUrl
                            ? 'border-red-600 ring-2 ring-red-500 scale-110'
                            : 'border-slate-200 hover:border-red-300'
                        }`}
                        title={preset.label}
                      >
                        <img src={preset.url} alt={preset.label} className="w-10 h-10 rounded-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom File Upload / URL Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2 border-t border-red-200/80">
                  <div>
                    <label className="block text-[11px] font-black text-slate-900 mb-1">📸 Upload Image File</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-900 mb-1">🔗 Custom Image URL</label>
                    <input
                      type="text"
                      value={profileCustomUrl}
                      onChange={(e) => setProfileCustomUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 rounded-xl border border-red-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                {/* Student Specific Registration Fields */}
                {(currentUser?.role === 'student' || currentUser?.role === 'resident' || true) && (
                  <div className="pt-2 border-t border-slate-100 space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-wider text-red-600">Student & Room Registration Details</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                          <span>Hostel Room No</span>
                          <span className="text-[10px] font-black text-red-600 uppercase">Searchable</span>
                        </label>
                        <RoomSearchSelector
                          value={profileRoomOrUnit}
                          onChange={setProfileRoomOrUnit}
                          sectors={sectors}
                          placeholder="Search room (e.g. Hostel B - Room 204)"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Student Roll No</label>
                        <input
                          type="text"
                          value={profileRollNo}
                          onChange={(e) => setProfileRollNo(e.target.value)}
                          placeholder="e.g. WOX-2026-84920"
                          className="w-full px-4 py-2 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">5-Digit Admission No</label>
                        <input
                          type="text"
                          maxLength={5}
                          value={profileAdmissionNo}
                          onChange={(e) => setProfileAdmissionNo(e.target.value.replace(/\D/g, '').slice(0, 5))}
                          placeholder="e.g. 58492"
                          className="w-full px-4 py-2 rounded-2xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Course & Section</label>
                        <input
                          type="text"
                          value={profileCourseSection}
                          onChange={(e) => setProfileCourseSection(e.target.value)}
                          placeholder="e.g. B.Tech CSE - Sec A"
                          className="w-full px-4 py-2 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  Save Profile Picture & Settings
                </button>
              </div>
            </form>
          </div>
        </div>
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
