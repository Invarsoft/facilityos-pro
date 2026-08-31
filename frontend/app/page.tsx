'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  GraduationCap,
  Bed,
  Building,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  FileText,
  Wrench,
  Wifi,
  Droplets,
  Zap,
  Activity,
  UserCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default function FirstScreenSelectPlace() {
  const router = useRouter();
  const { activeOrg, tickets, activeRole, currentUser } = useApp();

  const activeTicketsCount = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
  const awaitingCount = tickets.filter((t) => t.status === 'awaiting_verification').length;

  const woxsenCampusBlocks = [
    {
      id: 'hostel-a',
      title: 'Hostel A (Boys Residence)',
      subtitle: 'Rooms 101 to 450, Common Mess, Laundry Hub & Study Lounges.',
      icon: Bed,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/30',
      activeJobs: 1,
    },
    {
      id: 'hostel-b',
      title: 'Hostel B (Girls Residence)',
      subtitle: 'Rooms 101 to 450, Visitor Lounge, Pantry & Recreation Area.',
      icon: Bed,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/30',
      activeJobs: 1,
    },
    {
      id: 'academic-1',
      title: 'Academic Block 1 & 2',
      subtitle: 'Lecture Theatres, Central Library, Faculty Cabins & Seminar Halls.',
      icon: GraduationCap,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10 border-indigo-500/30',
      activeJobs: 0,
    },
    {
      id: 'aiml-labs',
      title: 'Science & AI/ML Labs',
      subtitle: 'High-Performance GPU Server Room, Robotics Lab & Analytics Bay.',
      icon: Building,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10 border-violet-500/30',
      activeJobs: 0,
    },
    {
      id: 'sports-complex',
      title: 'Sports Complex & Amenities',
      subtitle: 'Indoor Gymnasium, Swimming Pool, Tennis Courts & Cafeteria.',
      icon: Activity,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      activeJobs: 0,
    },
    {
      id: 'admin-block',
      title: 'Administrative Block',
      subtitle: 'Executive Office, Dean Office, Student Affairs & Accounts Desk.',
      icon: ShieldCheck,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10 border-teal-500/30',
      activeJobs: 0,
    },
  ];

  return (
    <div className="py-4 sm:py-8 px-3.5 sm:px-6 max-w-6xl mx-auto space-y-8 sm:space-y-10 animate-in fade-in duration-300">
      {/* Brand Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-extrabold uppercase tracking-wider">
            <span>🎓</span>
            <span>Woxsen University Campus Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Woxsen Campus Operations & Maintenance System
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Welcome to Woxsen University Maintenance Portal. Report hostel issues, track room repairs, verify technician resolution via OTP, and monitor campus SLA compliance 24/7.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 w-full md:w-auto shrink-0">
          <Link
            href="/requests/new"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise New Request</span>
          </Link>

          <Link
            href="/my-requests"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Track Requests ({tickets.length})</span>
          </Link>
        </div>
      </div>

      {/* Real-time Status Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Filed</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{tickets.length}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Jobs</span>
            <p className="text-2xl font-black text-amber-500 mt-0.5">{activeTicketsCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Awaiting OTP</span>
            <p className="text-2xl font-black text-yellow-500 mt-0.5">{awaitingCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Campus Status</span>
            <p className="text-xs font-black text-emerald-500 mt-1">100% Operational</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Woxsen Campus Infrastructure Blocks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-500" />
            <span>Woxsen Campus Infrastructure & Facilities</span>
          </h2>
          <span className="text-xs font-semibold text-slate-400">6 Campus Sectors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {woxsenCampusBlocks.map((block) => {
            const Icon = block.icon;
            return (
              <div
                key={block.id}
                onClick={() => router.push(`/requests/new?building=${encodeURIComponent(block.title)}`)}
                className={`group p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${block.bg} ${block.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {block.activeJobs > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                        {block.activeJobs} Active Repair
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {block.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                      {block.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
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
