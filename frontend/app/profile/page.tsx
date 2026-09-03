'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { getRoleDisplayName } from '@/lib/utils';
import { RoomSearchSelector } from '@/src/shared/components/ui/RoomSearchSelector';
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Upload,
  LogOut,
  ArrowLeft,
  IdCard,
  GraduationCap,
  Sparkles,
  Lock,
} from 'lucide-react';

const AVATAR_PRESETS = [
  { label: 'Executive Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Executive Male', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80' },
  { label: 'Academic Director', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
  { label: 'Staff Lead', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Student Female', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { label: 'Student Male', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { label: 'Technician Specialist', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, updateUser, logout, activeOrg, isAuthenticated } = useApp();

  const isStudent = currentUser?.role === 'student' || currentUser?.role === 'resident';

  const [savedSuccessNotice, setSavedSuccessNotice] = useState('');
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

  useEffect(() => {
    if (currentUser) {
      setProfileAvatar(currentUser.avatar || '');
      setProfileName(currentUser.name || '');
      setProfileEmail(currentUser.email || '');
      setProfilePhone(currentUser.phone || '');
      setProfileRollNo(currentUser.rollNo || '');
      setProfileAdmissionNo(currentUser.admissionNo || '');
      setProfileCourseSection(currentUser.courseSection || '');
      setProfileRoomOrUnit(currentUser.roomOrUnit || '');
    }
  }, [currentUser]);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="py-12 px-4 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-2xl font-black">
          🔒
        </div>
        <h1 className="text-2xl font-black text-slate-900">Access Restricted</h1>
        <p className="text-sm text-slate-600">Please sign in to view your profile and account settings.</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-red-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-red-700 transition-colors"
        >
          Go to Sign In
        </Link>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setProfileAvatar(reader.result);
          setProfileCustomUrl('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
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

    setSavedSuccessNotice('Profile & Avatar updated successfully!');
    setTimeout(() => setSavedSuccessNotice(''), 4000);
  };

  return (
    <div className="py-6 sm:py-10 px-3.5 sm:px-6 max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-36 sm:pb-24">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back();
              } else {
                router.push('/dashboard');
              }
            }}
            className="p-2 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs cursor-pointer active:scale-95"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Profile & Account Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              Manage your personal information, hostel room registration, and avatar settings.
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-extrabold text-xs transition-colors shrink-0 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>

      {/* Success Notice Banner */}
      {savedSuccessNotice && (
        <div className="p-4 rounded-2xl bg-green-500 text-white font-bold text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{savedSuccessNotice}</span>
          </div>
          <button onClick={() => setSavedSuccessNotice('')} className="font-extrabold underline text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Profile Form Card */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* AVATAR & USER SUMMARY CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group shrink-0">
              <img
                src={profileCustomUrl.trim() || profileAvatar || currentUser.avatar}
                alt={profileName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-red-600/30 shadow-md"
              />
              <label
                htmlFor="avatar-file-input"
                className="absolute bottom-0 right-0 p-2.5 rounded-full bg-red-600 text-white shadow-lg cursor-pointer hover:bg-red-700 transition-transform active:scale-95"
                title="Upload Photo"
              >
                <Camera className="w-4 h-4" />
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
                  {getRoleDisplayName(currentUser.role, activeOrg.type, activeOrg.name)}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified @woxsen.edu.in
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{profileName || currentUser.name}</h2>
              <p className="text-xs text-slate-500 font-mono font-medium">{profileEmail || currentUser.email}</p>

              {profileRoomOrUnit && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  <Building2 className="w-3.5 h-3.5 text-red-600" />
                  <span>{profileRoomOrUnit}</span>
                </div>
              )}
            </div>
          </div>

          {/* AVATAR PRESET PICKER */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>Choose Avatar Preset or Upload</span>
              </label>

              <label htmlFor="avatar-file-input" className="text-xs font-bold text-red-600 hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload File
              </label>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setProfileAvatar(preset.url);
                    setProfileCustomUrl('');
                  }}
                  className={`p-1 rounded-2xl border transition-all text-center group cursor-pointer ${
                    (profileAvatar === preset.url && !profileCustomUrl)
                      ? 'border-red-600 ring-2 ring-red-600/30 bg-red-50'
                      : 'border-slate-200 hover:border-slate-400 bg-white'
                  }`}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="w-12 h-12 rounded-xl object-cover mx-auto" />
                  <span className="text-[9px] font-bold text-slate-600 block mt-1 truncate">{preset.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <input
                type="url"
                value={profileCustomUrl}
                onChange={(e) => setProfileCustomUrl(e.target.value)}
                placeholder="Or paste custom image URL (e.g. https://images.unsplash.com/...)"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>
          </div>
        </div>

        {/* PERSONAL DETAILS SECTION */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <User className="w-4 h-4 text-red-600" />
            <span>Personal Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Email Address (Woxsen Domain)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Account Organization</label>
              <div className="px-3.5 py-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-red-600" />
                <span>{activeOrg.name} ({activeOrg.code})</span>
              </div>
            </div>
          </div>
        </div>

        {/* CONDITIONAL CARD: STUDENT DETAILS vs OFFICIAL STAFF CREDENTIALS */}
        {isStudent ? (
          /* STUDENT & ROOM REGISTRATION SECTION */
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <IdCard className="w-4 h-4 text-red-600" />
              <span>Student & Hostel Registration Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Student Roll No</label>
                <div className="relative">
                  <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profileRollNo}
                    onChange={(e) => setProfileRollNo(e.target.value)}
                    placeholder="e.g. 24WU0101095"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Admission No</label>
                <input
                  type="text"
                  value={profileAdmissionNo}
                  onChange={(e) => setProfileAdmissionNo(e.target.value)}
                  placeholder="e.g. ADM-WOX-84920"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Course & Section</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={profileCourseSection}
                    onChange={(e) => setProfileCourseSection(e.target.value)}
                    placeholder="e.g. AIML - Whales / 5 or B.Tech CSE - Sec A"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              {/* Stepped Room Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hostel Building, Floor & Room</label>
                <RoomSearchSelector
                  value={profileRoomOrUnit}
                  onChange={(selectedRoom) => setProfileRoomOrUnit(selectedRoom)}
                />
              </div>
            </div>
          </div>
        ) : (
          /* STAFF & MANAGER OFFICIAL CREDENTIALS SECTION */
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Official Staff Operations Credentials</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-300">Staff Role Title</span>
                <p className="text-sm font-black text-amber-400">{getRoleDisplayName(currentUser.role, activeOrg.type)}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-300">Assigned Department</span>
                <p className="text-sm font-black text-white">{currentUser.department || 'Campus Operations'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-300">Staff Access Code</span>
                <p className="text-sm font-mono font-black text-emerald-400">{currentUser.accessTokenNo || 'STAFF-2026-T'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-300">Security Clearance</span>
                <p className="text-sm font-black text-blue-400">Level 3 Authorized Manager</p>
              </div>
            </div>
          </div>
        )}

        {/* SAVE BUTTON */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-transform active:scale-95 cursor-pointer"
          >
            Save Profile Settings
          </button>
        </div>

        {/* PROMINENT DEDICATED SIGN OUT CARD AT BOTTOM OF PROFILE */}
        <div className="pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={logout}
            className="w-full py-4 px-6 rounded-3xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 text-rose-700 font-black text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out of Woxsen Portal</span>
          </button>
        </div>

      </form>
    </div>
  );
}
