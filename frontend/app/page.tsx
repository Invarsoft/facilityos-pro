'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { WoxsenAuthCard } from '@/src/features/auth/components/WoxsenAuthCard';
import {
  GraduationCap,
  Bed,
  Building,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export default function WoxsenCampusPortalPage() {
  const router = useRouter();
  const {
    tickets,
    activeRole,
    currentUser,
    isAuthenticated,
  } = useApp();

  const [authNotice, setAuthNotice] = useState('');

  const activeTicketsCount = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
  const awaitingCount = tickets.filter((t) => t.status === 'awaiting_verification').length;

  const woxsenCampusBlocks = [
    {
      id: 'hostel-a',
      title: 'Hostel A (Boys Residence)',
      subtitle: 'Rooms 101 to 450, Common Mess, Laundry Hub & Study Lounges.',
      icon: Bed,
      activeJobs: 1,
    },
    {
      id: 'hostel-b',
      title: 'Hostel B (Girls Residence)',
      subtitle: 'Rooms 101 to 450, Visitor Lounge, Pantry & Recreation Area.',
      icon: Bed,
      activeJobs: 1,
    },
    {
      id: 'academic-1',
      title: 'Academic Block 1 & 2',
      subtitle: 'Lecture Theatres, Central Library, Faculty Cabins & Seminar Halls.',
      icon: GraduationCap,
      activeJobs: 0,
    },
    {
      id: 'aiml-labs',
      title: 'Science & AI/ML Labs',
      subtitle: 'High-Performance GPU Server Room, Robotics Lab & Analytics Bay.',
      icon: Building,
      activeJobs: 0,
    },
    {
      id: 'sports-complex',
      title: 'Sports Complex & Amenities',
      subtitle: 'Indoor Gymnasium, Swimming Pool, Tennis Courts & Cafeteria.',
      icon: ShieldCheck,
      activeJobs: 0,
    },
    {
      id: 'admin-block',
      title: 'Administrative Block',
      subtitle: 'Executive Office, Dean Office, Student Affairs & Accounts Desk.',
      icon: ShieldCheck,
      activeJobs: 0,
    },
  ];

  // =======================================================================
  // VIEW 1: UNAUTHENTICATED VIEW (UNIFIED WOXSEN AUTH CARD)
  // =======================================================================
  if (!isAuthenticated) {
    return (
      <div className="py-6 sm:py-12 px-3.5 sm:px-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 relative z-10">
        {/* Woxsen Brand Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
            <span>🎓</span>
            <span>Woxsen University Campus Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight drop-shadow-xs">
            Woxsen Campus Sign In
          </h1>

          <p className="text-xs sm:text-base text-slate-700 max-w-xl mx-auto font-semibold">
            Sign in with your Woxsen Email Address. Your role (Student, Technician, Warden, Admin) is automatically detected on sign in.
          </p>
        </div>

        {/* Shared Unified Auth Card */}
        <WoxsenAuthCard />

        {/* Security Lock Notice */}
        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 text-center text-xs text-slate-700 font-semibold flex items-center justify-center gap-2 max-w-xl mx-auto shadow-lg">
          <Lock className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Woxsen campus infrastructure and service request wizards are protected until authenticated.</span>
        </div>
      </div>
    );
  }

  // =======================================================================
  // VIEW 2: AUTHENTICATED VIEW (WOXSEN SERVICES DASHBOARD)
  // =======================================================================
  return (
    <div className="py-4 sm:py-8 px-3.5 sm:px-6 max-w-6xl mx-auto space-y-8 sm:space-y-10 animate-in fade-in duration-300 relative z-10">
      {authNotice && (
        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-blue-200 text-blue-900 text-xs font-bold flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{authNotice}</span>
          </div>
          <button onClick={() => setAuthNotice('')} className="text-xs font-extrabold underline">Dismiss</button>
        </div>
      )}

      {/* Authenticated Brand Hero Header - Strict Blue & White */}
      <div className="p-6 sm:p-8 rounded-3xl bg-blue-900/90 backdrop-blur-md text-white border border-blue-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-extrabold uppercase tracking-wider">
              <span>🎓</span>
              <span>Woxsen University Campus Portal</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-extrabold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-blue-200" />
              <span>Role ({activeRole.toUpperCase()}): {currentUser?.name || 'Woxsen User'}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Woxsen Campus Operations & Maintenance System
          </h1>

          <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed">
            Welcome back, {currentUser?.name}. Report hostel issues, track room repairs, verify technician resolution via OTP, and monitor campus SLA compliance 24/7.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 w-full md:w-auto shrink-0">
          <Link
            href="/requests/new"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-blue-900 hover:bg-blue-50 font-black text-xs shadow-lg transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>Raise New Request</span>
          </Link>

          <Link
            href="/my-requests"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-800 hover:bg-blue-700 text-white font-bold text-xs border border-blue-700 transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-blue-200" />
            <span>Track Requests ({tickets.length})</span>
          </Link>
        </div>
      </div>

      {/* Real-time Status Metric Pills - Glassmorphism over Campus Background */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Total Filed</span>
            <p className="text-2xl font-black text-blue-900 mt-0.5">{tickets.length}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Active Jobs</span>
            <p className="text-2xl font-black text-blue-600 mt-0.5">{activeTicketsCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Awaiting OTP</span>
            <p className="text-2xl font-black text-blue-600 mt-0.5">{awaitingCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Campus Status</span>
            <p className="text-xs font-black text-blue-600 mt-1">100% Operational</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Woxsen Campus Infrastructure Blocks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/60 shadow-md">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            <span>Woxsen Campus Infrastructure & Services</span>
          </h2>
          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">6 Campus Sectors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {woxsenCampusBlocks.map((block) => {
            const Icon = block.icon;
            return (
              <div
                key={block.id}
                onClick={() => router.push(`/requests/new?building=${encodeURIComponent(block.title)}`)}
                className={`group p-5 rounded-2xl border bg-white/90 backdrop-blur-md border-white/60 hover:border-blue-600 hover:bg-white transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    {block.activeJobs > 0 && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
                        {block.activeJobs} Active Repair
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {block.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      {block.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>Report Maintenance Issue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
