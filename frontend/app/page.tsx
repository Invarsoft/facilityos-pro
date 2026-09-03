'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { WoxsenAuthCard } from '@/src/features/auth/components/WoxsenAuthCard';
import {
  Building2,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  UserCheck,
  Sparkles,
  Package,
  Trophy,
  Calendar,
  Wrench,
  QrCode,
  MapPin,
  Truck,
  AlertTriangle,
} from 'lucide-react';

export default function WoxsenCampusPortalPage() {
  const router = useRouter();
  const {
    tickets,
    activeRole,
    currentUser,
    isAuthenticated,
  } = useApp();

  React.useEffect(() => {
    if (isAuthenticated) {
      if (activeRole === 'courier_manager') {
        router.push('/courier/portal');
      } else if (activeRole === 'sports_manager') {
        router.push('/sports/portal');
      } else if (activeRole === 'warden' || activeRole === 'manager') {
        router.push('/manager');
      } else if (activeRole === 'worker' || activeRole === 'technician') {
        router.push('/worker');
      } else if (activeRole === 'admin' || activeRole === 'org_admin' || activeRole === 'super_admin') {
        router.push('/admin');
      }
    }
  }, [isAuthenticated, activeRole, router]);

  const activeTicketsCount = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
  const awaitingCount = tickets.filter((t) => t.status === 'awaiting_verification').length;

  const [subCategoryModalOpen, setSubCategoryModalOpen] = useState(false);

  // Demo Courier & Sports Data for Student Dashboard
  const demoCourierCount = 2;
  const demoSportsBookingsCount = 2;

  // =======================================================================
  // VIEW 1: UNAUTHENTICATED VIEW (UNIFIED WOXSEN AUTH CARD)
  // =======================================================================
  if (!isAuthenticated) {
    return (
      <div className="py-6 sm:py-12 px-3.5 sm:px-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 relative z-10">
        {/* Woxsen Brand Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
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
          <Lock className="w-4 h-4 text-red-600 shrink-0" />
          <span>Woxsen campus infrastructure and service request wizards are protected until authenticated.</span>
        </div>
      </div>
    );
  }

  // =======================================================================
  // VIEW 2: AUTHENTICATED MODERN STUDENT/USER DASHBOARD
  // =======================================================================
  return (
    <div className="py-4 sm:py-6 px-3.5 sm:px-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 relative z-10">
      
      {/* 1. COMPACT ELEGANT USER GREETING HEADER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider">
            {activeRole.toUpperCase()} PORTAL
          </span>
          {currentUser?.roomOrUnit && (
            <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-red-600" />
              {currentUser.roomOrUnit}
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Welcome back, {currentUser?.name?.split(' ')[0] || 'Aarav'} 👋
        </h1>
        <p className="text-xs text-slate-500 font-semibold">
          Campus service desk, arrived courier packages & sports court bookings.
        </p>
      </div>

      {/* 2. ALERT BANNER: AWAITING OTP VERIFICATION */}
      {awaitingCount > 0 && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
              🔑
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-950">
                {awaitingCount} Ticket Awaiting Your OTP Verification!
              </h3>
              <p className="text-xs text-amber-900 font-medium">
                Technician has finished repair work. Please provide your 6-digit OTP after verifying.
              </p>
            </div>
          </div>

          <Link
            href="/my-requests"
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md shrink-0 uppercase tracking-wider"
          >
            Verify OTP Now →
          </Link>
        </div>
      )}

      {/* 2. CAMPUS SERVICE & BOOKING DESKS HEADER */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>Campus Service & Booking Desks</span>
          </h2>
          <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
            7 Service Desks
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          
          {/* BOX 1: HOSTEL ROOM MAINTENANCE */}
          <div
            onClick={() => setSubCategoryModalOpen(true)}
            className="aspect-square p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-red-600 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xl sm:text-2xl group-hover:scale-110 transition-transform shadow-xs">
                🛠️
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 hidden sm:inline">
                {activeTicketsCount} Active
              </span>
            </div>

            <div className="space-y-0.5 my-1">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                Hostel Maintenance
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold line-clamp-2 leading-snug">
                Plumbing, Electrical, AC, Carpentry, Housekeeping
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-black text-red-600">
              <span>7 Sub-Categories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* BOX 2: COURIER & MAILROOM DESK */}
          <Link
            href="/courier"
            className="aspect-square p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-blue-600 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl sm:text-2xl group-hover:scale-110 transition-transform shadow-xs">
                📦
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse hidden sm:inline">
                {demoCourierCount} Arrived
              </span>
            </div>

            <div className="space-y-0.5 my-1">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                Courier Mailroom
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold line-clamp-2 leading-snug">
                Amazon, Flipkart packages & 4-digit pickup OTPs
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-black text-blue-600">
              <span>Open Mailroom</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* BOX 3: SPORTS ARENA BOOKING */}
          <Link
            href="/sports"
            className="aspect-square p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-amber-500 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl sm:text-2xl group-hover:scale-110 transition-transform shadow-xs">
                ⚽
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 hidden sm:inline">
                Floodlit Arena
              </span>
            </div>

            <div className="space-y-0.5 my-1">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors leading-tight">
                Sports Arena
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold line-clamp-2 leading-snug">
                Badminton, Tennis, Football Turf & Basketball
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-black text-amber-700">
              <span>Book Court Slot</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* BOX 4: SPACE & STUDY LOUNGES */}
          <Link
            href="/amenities"
            className="aspect-square p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-violet-600 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center font-black text-xl sm:text-2xl group-hover:scale-110 transition-transform shadow-xs">
                📖
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-violet-100 text-violet-900 border border-violet-200 hidden sm:inline">
                Silent Pods
              </span>
            </div>

            <div className="space-y-0.5 my-1">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-violet-600 transition-colors leading-tight">
                Study & Amenities
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold line-clamp-2 leading-snug">
                Quiet Study Pods, Discussion & Music Studio
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-black text-violet-600">
              <span>Reserve Study Suite</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* BOX 5: CANTEEN & FOOD COURT */}
          <Link
            href="/food"
            className="aspect-square p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-amber-600 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xl sm:text-2xl group-hover:scale-110 transition-transform shadow-xs">
                🍔
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 hidden sm:inline">
                Mess & Food Court
              </span>
            </div>

            <div className="space-y-0.5 my-1">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-tight">
                Food Court & Canteen
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold line-clamp-2 leading-snug">
                Order meals from Woxsen Food Court, Fuel Zone & Night Canteen
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-black text-amber-600">
              <span>Order Meals & Tokens</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* BOX 6: HOSTEL LAUNDRY SERVICES */}
          <Link
            href="/laundry"
            className="aspect-square p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-blue-600 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl sm:text-2xl group-hover:scale-110 transition-transform shadow-xs">
                🧺
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200 hidden sm:inline">
                Washer Bays
              </span>
            </div>

            <div className="space-y-0.5 my-1">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                Hostel Laundry Tracker
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold line-clamp-2 leading-snug">
                Reserve washer slots & track wash/dry pickup status
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-black text-blue-600">
              <span>Book Washer Slot</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* BOX 7: HOSTEL OUTING & GATE PASS */}
          <Link
            href="/outing"
            className="aspect-square p-4 sm:p-5 rounded-3xl bg-white border-2 border-slate-200 hover:border-red-600 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xl sm:text-2xl group-hover:scale-110 transition-transform shadow-xs">
                🚪
              </div>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-200 hidden sm:inline">
                Gate Pass
              </span>
            </div>

            <div className="space-y-0.5 my-1">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                Outing & Gate Pass
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 font-semibold line-clamp-2 leading-snug">
                Generate campus exit/entry gate passcodes & QR codes
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-black text-red-600">
              <span>Request Gate Pass</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </div>

      {/* MAINTENANCE SUB-CATEGORIES MODAL */}
      {subCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                  🛠️
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Hostel Maintenance Categories</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">Select a maintenance service category</p>
                </div>
              </div>

              <button
                onClick={() => setSubCategoryModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: 'plumbing', name: 'Plumbing', icon: '💧', desc: 'Tap leakages, pipe blockages, flush', href: '/requests/new?serviceId=plumbing', bg: 'bg-blue-50 border-blue-200 text-blue-700' },
                { id: 'electrical', name: 'Electrical', icon: '⚡', desc: 'Lights, switches, sockets, fans', href: '/requests/new?serviceId=electrical', bg: 'bg-amber-50 border-amber-200 text-amber-700' },
                { id: 'ac_hvac', name: 'AC & HVAC', icon: '❄️', desc: 'AC cooling issues, noise, remote', href: '/requests/new?serviceId=ac_hvac', bg: 'bg-cyan-50 border-cyan-200 text-cyan-700' },
                { id: 'carpentry', name: 'Carpentry', icon: '🪚', desc: 'Doors, windows, study tables, locks', href: '/requests/new?serviceId=carpentry', bg: 'bg-orange-50 border-orange-200 text-orange-700' },
                { id: 'cleaning', name: 'Housekeeping', icon: '🧹', desc: 'Deep room cleaning, garbage', href: '/requests/new?serviceId=cleaning', bg: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
                { id: 'civil', name: 'Civil Work', icon: '🧱', desc: 'Wall dampness, paint peeling, tiles', href: '/requests/new?serviceId=civil', bg: 'bg-purple-50 border-purple-200 text-purple-700' },
                { id: 'wifi', name: 'Wi-Fi & LAN', icon: '📶', desc: 'LAN port repair, slow internet', href: '/requests/new?serviceId=wifi', bg: 'bg-teal-50 border-teal-200 text-teal-700' },
              ].map((sub) => (
                <Link
                  key={sub.id}
                  href={sub.href}
                  onClick={() => setSubCategoryModalOpen(false)}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-red-600 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sub.icon}</span>
                    <h4 className="text-xs font-black text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                      {sub.name}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{sub.desc}</p>
                  <span className="text-[10px] font-extrabold text-red-600 flex items-center justify-end gap-1">
                    <span>Select</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
