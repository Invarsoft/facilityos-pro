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
  ChevronRight,
  ChevronDown,
  Search,
  Check,
  GraduationCap,
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
  const [universityModalOpen, setUniversityModalOpen] = useState(false);

  // Available Universities / Colleges List
  const universitiesList = [
    { id: 'woxsen_main', name: 'Woxsen University', campus: 'Main Residential Campus (Sangareddy)', code: 'WOX-HYD', badge: 'Active Campus', icon: '🏛️' },
    { id: 'woxsen_tech', name: 'Woxsen School of Technology', campus: 'AI & Engineering Hub', code: 'SOT-WOX', badge: 'Tech Center', icon: '💻' },
    { id: 'woxsen_biz', name: 'Woxsen School of Business', campus: 'MBA & Leadership Hub', code: 'SOB-WOX', badge: 'Business Center', icon: '📈' },
    { id: 'woxsen_design', name: 'Woxsen School of Art & Design', campus: 'Design & Architecture Hub', code: 'SOA-WOX', badge: 'Design Studio', icon: '🎨' },
    { id: 'woxsen_law', name: 'Woxsen School of Law', campus: 'Legal Studies Block', code: 'SOL-WOX', badge: 'Law Center', icon: '⚖️' },
  ];

  const [selectedUniversity, setSelectedUniversity] = useState(universitiesList[0]);

  // Demo Courier & Sports Data
  const demoCourierCount = 2;

  // Amenity Desks
  const campusAmenities = [
    { id: 'maintenance', title: 'Hostel Maintenance', category: 'Maintenance', icon: '🛠️', bg: 'bg-red-50 text-red-600 border-red-200', href: '/requests/new', badge: `${activeTicketsCount} Active`, desc: 'Plumbing, Electrical, AC, Carpentry & Housekeeping' },
    { id: 'food', title: 'Food Court & Canteen', category: 'Dining', icon: '🍔', bg: 'bg-amber-50 text-amber-600 border-amber-200', href: '/food', badge: 'Live Kitchen Tokens', desc: 'Order from Rise Live, Rise Ready, Blue Embers & Night Canteen' },
    { id: 'laundry', title: 'Hostel Laundry Hub', category: 'Laundry', icon: '🧺', bg: 'bg-blue-50 text-blue-600 border-blue-200', href: '/laundry', badge: 'Washer Bays', desc: 'Book washer slots, steam pressing & dry cleaning status' },
    { id: 'sports', title: 'Sports Arena Booking', category: 'Sports', icon: '⚽', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200', href: '/sports', badge: 'Floodlit Arena', desc: 'Book Badminton, Tennis, Football Turf & Basketball courts' },
    { id: 'courier', title: 'Courier Mailroom', category: 'Mailroom', icon: '📦', bg: 'bg-indigo-50 text-indigo-600 border-indigo-200', href: '/courier', badge: `${demoCourierCount} Arrived`, desc: 'Amazon, Flipkart packages & 4-digit pickup OTPs' },
    { id: 'study', title: 'Study Pods & Suites', category: 'Study', icon: '📖', bg: 'bg-violet-50 text-violet-600 border-violet-200', href: '/amenities', badge: 'Silent Pods', desc: 'Reserve quiet study pods, discussion suites & music studio' },
    { id: 'outing', title: 'Outing & Gate Pass', category: 'Gate Pass', icon: '🚪', bg: 'bg-rose-50 text-rose-600 border-rose-200', href: '/outing', badge: 'QR Gate Pass', desc: 'Generate campus exit/entry passcodes & digital QR passes' },
  ];

  // =======================================================================
  // VIEW 1: UNAUTHENTICATED VIEW (UNIFIED WOXSEN AUTH CARD)
  // =======================================================================
  if (!isAuthenticated) {
    return (
      <div className="py-6 sm:py-12 px-3.5 sm:px-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 relative z-10">
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

        <WoxsenAuthCard />

        <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/60 text-center text-xs text-slate-700 font-semibold flex items-center justify-center gap-2 max-w-xl mx-auto shadow-lg">
          <Lock className="w-4 h-4 text-red-600 shrink-0" />
          <span>Woxsen campus infrastructure and service request wizards are protected until authenticated.</span>
        </div>
      </div>
    );
  }

  // =======================================================================
  // VIEW 2: AUTHENTICATED HOMEPAGE WITH UNIVERSITY / COLLEGE SELECTOR
  // =======================================================================
  return (
    <div className="py-4 sm:py-6 px-3.5 sm:px-6 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 relative z-10">
      
      {/* 1. SELECT UNIVERSITY / COLLEGE BANNER BAR (TOP OF HOMEPAGE) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-700 via-rose-800 to-slate-900 text-white shadow-2xl space-y-3 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20 inline-flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-rose-300" />
              <span>Campus & Institution Selection</span>
            </span>
            <h2 className="text-sm sm:text-base font-black tracking-tight text-white flex items-center gap-2">
              <span>Selected University / College:</span>
            </h2>
          </div>

          {/* INTERACTIVE UNIVERSITY SELECTOR BUTTON */}
          <button
            onClick={() => setUniversityModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-black text-xs sm:text-sm shadow-xl hover:bg-rose-50 flex items-center justify-between gap-3 transition-all cursor-pointer border border-white/80 active:scale-95 shrink-0"
          >
            <div className="flex items-center gap-2 text-left min-w-0">
              <span className="text-lg shrink-0">{selectedUniversity.icon}</span>
              <div className="min-w-0">
                <p className="font-black text-slate-900 leading-tight truncate">{selectedUniversity.name}</p>
                <p className="text-[10px] text-slate-500 font-semibold truncate">{selectedUniversity.campus}</p>
              </div>
            </div>

            <ChevronDown className="w-4 h-4 text-red-600 shrink-0" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-rose-100/90 pt-1 border-t border-white/10">
          <span>Active Institution Code: <strong className="text-white">{selectedUniversity.code}</strong></span>
          <button
            onClick={() => setUniversityModalOpen(true)}
            className="hover:underline flex items-center gap-1 text-white font-extrabold cursor-pointer"
          >
            <span>Change College / Campus</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. COMPACT ELEGANT USER GREETING HEADER */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider">
            {activeRole.toUpperCase()} PORTAL
          </span>
          <span className="px-3 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-600" />
            <span>{currentUser?.roomOrUnit || 'Hostel B - Room 204'}</span>
          </span>
          <span className="px-3 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
            {selectedUniversity.name}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Welcome back, {currentUser?.name?.split(' ')[0] || 'Aarav'} 👋
        </h1>
        <p className="text-xs text-slate-500 font-semibold">
          Access campus service desks, food court ordering, laundry slots & gate passes for {selectedUniversity.name}.
        </p>
      </div>

      {/* 3. ALERT BANNER: AWAITING OTP VERIFICATION */}
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

      {/* 4. CAMPUS SERVICE & BOOKING DESKS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span>{selectedUniversity.name} Service & Booking Desks</span>
          </h2>
          <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
            7 Service Desks
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {campusAmenities.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.id === 'maintenance') {
                  setSubCategoryModalOpen(true);
                } else {
                  router.push(item.href);
                }
              }}
              className="p-4 rounded-3xl bg-white border-2 border-slate-200 hover:border-red-600 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform shadow-xs border ${item.bg}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {item.badge}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-red-600 transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold line-clamp-2 mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-black text-red-600">
                <span>Open Desk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: SELECT UNIVERSITY / COLLEGE MODAL */}
      {universityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                  🎓
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Select University / College</h3>
                  <p className="text-[11px] text-slate-500 font-semibold">Choose your active campus & academic school</p>
                </div>
              </div>

              <button
                onClick={() => setUniversityModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {universitiesList.map((uni) => {
                const isSelected = selectedUniversity.id === uni.id;
                return (
                  <div
                    key={uni.id}
                    onClick={() => {
                      setSelectedUniversity(uni);
                      setUniversityModalOpen(false);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-red-50/80 border-red-600 shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl shrink-0">{uni.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">{uni.name}</h4>
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                            {uni.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-semibold truncate">{uni.campus}</p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 text-center">
              <button
                onClick={() => setUniversityModalOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-slate-900 text-white font-black text-xs shadow-md uppercase tracking-wider cursor-pointer"
              >
                Confirm University Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: HOSTEL MAINTENANCE SUB-CATEGORIES MODAL */}
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
                { id: 'plumbing', name: 'Plumbing', icon: '💧', desc: 'Tap leakages, pipe blockages, flush', href: '/requests/new?serviceId=plumbing' },
                { id: 'electrical', name: 'Electrical', icon: '⚡', desc: 'Lights, switches, sockets, fans', href: '/requests/new?serviceId=electrical' },
                { id: 'ac_hvac', name: 'AC & HVAC', icon: '❄️', desc: 'AC cooling issues, noise, remote', href: '/requests/new?serviceId=ac_hvac' },
                { id: 'carpentry', name: 'Carpentry', icon: '🪚', desc: 'Doors, windows, study tables, locks', href: '/requests/new?serviceId=carpentry' },
                { id: 'cleaning', name: 'Housekeeping', icon: '🧹', desc: 'Deep room cleaning, garbage', href: '/requests/new?serviceId=cleaning' },
                { id: 'civil', name: 'Civil Work', icon: '🧱', desc: 'Wall dampness, paint peeling, tiles', href: '/requests/new?serviceId=civil' },
                { id: 'wifi', name: 'Wi-Fi & LAN', icon: '📶', desc: 'LAN port repair, slow internet', href: '/requests/new?serviceId=wifi' },
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
