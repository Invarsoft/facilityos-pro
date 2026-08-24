'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { FacilityType } from '@/lib/types';
import { AddFacilityModal } from '@/components/layout/AddFacilityModal';
import { RequestFacilityOnboardingModal } from '@/components/layout/RequestFacilityOnboardingModal';
import {
  GraduationCap,
  Home,
  Building2,
  Bed,
  School,
  Hospital,
  Users,
  Building,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Key,
  PlusCircle,
  Send,
} from 'lucide-react';

interface FacilityCategoryCard {
  type: FacilityType;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  gradient: string;
}

export default function FirstScreenSelectPlace() {
  const router = useRouter();
  const { activeRole } = useApp();
  const [addFacilityModalOpen, setAddFacilityModalOpen] = useState(false);
  const [requestOnboardingModalOpen, setRequestOnboardingModalOpen] = useState(false);

  const isAdmin = activeRole === 'admin' || activeRole === 'super_admin';

  const categories: FacilityCategoryCard[] = [
    {
      type: 'university',
      title: 'University / College',
      subtitle: 'Campus maintenance and support services.',
      icon: GraduationCap,
      color: 'text-blue-500',
      gradient: 'from-blue-600/20 to-indigo-600/10 border-blue-500/30',
    },
    {
      type: 'apartment',
      title: 'Apartment / Gated Community',
      subtitle: 'Manage maintenance and community services.',
      icon: Home,
      color: 'text-emerald-500',
      gradient: 'from-emerald-600/20 to-teal-600/10 border-emerald-500/30',
    },
    {
      type: 'office',
      title: 'Office / Corporate Campus',
      subtitle: 'Manage workplace facilities and support.',
      icon: Building2,
      color: 'text-violet-500',
      gradient: 'from-violet-600/20 to-purple-600/10 border-violet-500/30',
    },
    {
      type: 'hostel',
      title: 'Hostel',
      subtitle: 'Report and track hostel maintenance.',
      icon: Bed,
      color: 'text-amber-500',
      gradient: 'from-amber-600/20 to-orange-600/10 border-amber-500/30',
    },
    {
      type: 'school',
      title: 'School',
      subtitle: 'Manage school facilities and maintenance.',
      icon: School,
      color: 'text-cyan-500',
      gradient: 'from-cyan-600/20 to-blue-600/10 border-cyan-500/30',
    },
    {
      type: 'hospital',
      title: 'Hospital',
      subtitle: 'Coordinate facility and maintenance operations.',
      icon: Hospital,
      color: 'text-rose-500',
      gradient: 'from-rose-600/20 to-pink-600/10 border-rose-500/30',
    },
    {
      type: 'residential',
      title: 'Residential Community',
      subtitle: 'Manage services for residents and shared spaces.',
      icon: Users,
      color: 'text-teal-500',
      gradient: 'from-teal-600/20 to-emerald-600/10 border-teal-500/30',
    },
    {
      type: 'commercial',
      title: 'Commercial Building',
      subtitle: 'Manage building maintenance and operations.',
      icon: Building,
      color: 'text-indigo-500',
      gradient: 'from-indigo-600/20 to-blue-600/10 border-indigo-500/30',
    },
    {
      type: 'other',
      title: 'Other Facility',
      subtitle: 'Use FacilityOS for your custom facility.',
      icon: Sparkles,
      color: 'text-slate-400',
      gradient: 'from-slate-600/20 to-slate-700/10 border-slate-500/30',
    },
  ];

  const handleCategorySelect = (type: FacilityType) => {
    router.push(`/organizations?type=${type}`);
  };

  return (
    <div className="py-8 px-4 max-w-6xl mx-auto space-y-12 animate-in fade-in duration-300">
      {/* Brand Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-extrabold uppercase tracking-widest shadow-xs">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>The Operating System for Modern Facility Services</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Where do you need a service?
        </h1>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 font-medium">
          Choose your facility type to access custom services, report maintenance issues, and track verified resolution in real-time.
        </p>
      </div>

      {/* Premium Visual Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.type}
              onClick={() => handleCategorySelect(cat.type)}
              className={`group relative p-6 rounded-2xl border bg-white dark:bg-slate-900 hover:bg-gradient-to-br ${cat.gradient} transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden`}
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">
                    {cat.subtitle}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                <span>Browse Facilities</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Alternative Access & Register Facility Section */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl font-extrabold">Want FacilityOS for your facility?</h3>
          <p className="text-xs text-slate-400 max-w-md">
            Request official onboarding for your campus, hospital, school, or corporate building.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {isAdmin ? (
            <button
              onClick={() => setAddFacilityModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Provision Facility (Admin)</span>
            </button>
          ) : (
            <button
              onClick={() => setRequestOnboardingModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-extrabold text-white shadow-lg shadow-blue-600/30 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Request Facility Onboarding</span>
            </button>
          )}

          <Link
            href="/organizations?action=code"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-100 border border-slate-700 transition-colors"
          >
            <Key className="w-4 h-4 text-amber-400" />
            <span>Enter Facility Code</span>
          </Link>
        </div>
      </div>

      {/* Admin Provisioning Modal */}
      {addFacilityModalOpen && (
        <AddFacilityModal onClose={() => setAddFacilityModalOpen(false)} />
      )}

      {/* User Onboarding Request Modal */}
      {requestOnboardingModalOpen && (
        <RequestFacilityOnboardingModal onClose={() => setRequestOnboardingModalOpen(false)} />
      )}
    </div>
  );
}
