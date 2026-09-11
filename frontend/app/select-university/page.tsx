'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Search,
  X,
  ChevronRight,
  LogIn,
  Settings,
  ShieldCheck,
  Users,
  BarChart3,
} from 'lucide-react';

export default function SelectUniversityGatewayPage() {
  const router = useRouter();
  const { setSelectedOrganization } = useApp();

  // Search Query starts empty by default
  const [searchQuery, setSearchQuery] = useState('');

  const allUniversities = [
    { id: 'woxsen_main', name: 'Woxsen University', location: 'Hyderabad, Telangana', code: 'WOX-HYD' },
    { id: 'woxsen_tech', name: 'Woxsen School of Technology', location: 'Kamkole, Sangareddy', code: 'SOT-WOX' },
    { id: 'woxsen_biz', name: 'Woxsen School of Business', location: 'Sangareddy, Telangana', code: 'SOB-WOX' },
    { id: 'woxsen_arts', name: 'Woxsen School of Arts & Design', location: 'Sangareddy, Telangana', code: 'SOA-WOX' },
    { id: 'woxsen_global', name: 'Woxsen Global School', location: 'Kothur, Hyderabad', code: 'WGS-HYD' },
    { id: 'iit_hyd', name: 'IIT Hyderabad', location: 'Kandi, Sangareddy', code: 'IITH' },
    { id: 'bits_hyd', name: 'BITS Pilani — Hyderabad Campus', location: 'Jawahar Nagar, Hyderabad', code: 'BITS' },
    { id: 'nalsar_law', name: 'NALSAR University of Law', location: 'Shamirpet, Hyderabad', code: 'NALSAR' },
    { id: 'mahindra_uni', name: 'Mahindra University', location: 'Bahadurpally, Hyderabad', code: 'MU-HYD' },
    { id: 'isb_hyd', name: 'Indian School of Business (ISB)', location: 'Gachibowli, Hyderabad', code: 'ISB' },
  ];

  // Only show results when user types at least 3 letters
  const hasMinQueryLength = searchQuery.trim().length >= 3;

  const filtered = hasMinQueryLength
    ? allUniversities.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSelectUniversity = (uni: typeof allUniversities[0]) => {
    if (setSelectedOrganization) {
      setSelectedOrganization({
        id: uni.id,
        name: uni.name,
        slug: uni.code.toLowerCase(),
      } as any);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_university_name', uni.name);
      localStorage.setItem('selected_university_id', uni.id);
    }

    // Redirect to main campus portal
    router.push('/');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] text-white flex flex-col justify-between overflow-y-auto font-sans select-none">
      
      {/* VIVID GRADIENT GLOW BACKGROUNDS (EXACT MATCH FOR media_1789124912943.png) */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-red-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-blue-600/25 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-80 bg-gradient-to-t from-[#04060c] via-[#070b14]/90 to-transparent pointer-events-none" />

      {/* 1. TOP HEADER NAVIGATION BAR */}
      <header className="w-full px-4 sm:px-12 py-4 sm:py-5 flex items-center justify-between border-b border-slate-800/40 relative z-20 backdrop-blur-md bg-[#070b14]/70">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white font-black text-lg sm:text-xl flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            F
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-xl tracking-tight text-white">Facility</span>
              <span className="font-black text-base sm:text-xl tracking-tight text-red-500">OS</span>
              <span className="text-[8px] sm:text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                PRO
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold -mt-0.5 tracking-wide hidden sm:block">
              Manage. Maintain. Resolve.
            </p>
          </div>
        </Link>

        {/* RIGHT CONTROLS: SIGN IN BUTTON ONLY */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Sign In</span>
          </Link>
        </div>

      </header>

      {/* 2. HERO SEARCH SECTION (EXACT MATCH FOR media_1789124912943.png) */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative z-10 max-w-4xl mx-auto w-full space-y-6 sm:space-y-8 text-center">
        
        {/* EYEBROW & MAIN TITLE */}
        <div className="space-y-2.5 sm:space-y-3">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-slate-400">
            SMART CAMPUSES. SMOOTHER OPERATIONS.
          </p>

          <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-none">
            Welcome to Facility<span className="text-red-500">OS</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-300 font-medium max-w-md mx-auto">
            Find your university or college to access campus services
          </p>
        </div>

        {/* NEON GLOW SEARCH BAR */}
        <div className="w-full max-w-xl space-y-3">
          <div className="relative group">
            
            {/* NEON BORDER RING GLOW */}
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 opacity-80 blur-sm group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-center rounded-full bg-[#0b101e] border border-blue-500/50 px-4 sm:px-5 py-3 sm:py-3.5 shadow-[0_0_25px_rgba(59,130,246,0.25)]">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 mr-2.5 sm:mr-3" />
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type your university or college..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-xs sm:text-sm font-semibold focus:outline-none"
                autoFocus
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* SEARCH RESULTS CARD CONTAINER (VISIBLE WHEN SEARCH >= 3 LETTERS) */}
          {hasMinQueryLength && (
            <div className="w-full rounded-3xl bg-[#0b1120]/95 border border-slate-800/90 p-4 sm:p-5 shadow-2xl backdrop-blur-xl text-left space-y-3 animate-in fade-in zoom-in-95 duration-200">
              
              {/* HEADER ROW */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-black tracking-wider text-slate-400 uppercase border-b border-slate-800/60 pb-3 px-1">
                <span>UNIVERSITIES & COLLEGES</span>
                <span className="text-slate-400 font-bold">{filtered.length} results</span>
              </div>

              {/* RESULTS LIST */}
              <div className="divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
                {filtered.length > 0 ? (
                  filtered.map((uni) => (
                    <div
                      key={uni.id}
                      onClick={() => handleSelectUniversity(uni)}
                      className="py-3 px-2.5 rounded-2xl hover:bg-slate-800/60 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-0.5">
                        <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-red-400 transition-colors">
                          {uni.name}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-semibold">
                          {uni.location}
                        </p>
                      </div>

                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center space-y-1">
                    <p className="text-xs sm:text-sm font-black text-slate-300">No matching campus found</p>
                    <p className="text-[11px] font-semibold text-slate-500">
                      No university matches "{searchQuery}". Try searching "wox", "iit", or "bits".
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* HELPER CAPTION BELOW CARD */}
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium text-center">
            {hasMinQueryLength
              ? `Showing results for "${searchQuery}"`
              : 'Type at least 3 letters to search'}
          </p>
        </div>

        {/* 3. FOUR FEATURE HIGHLIGHT BADGES (EXACT MATCH FOR media_1789124912943.png) */}
        <div className="w-full pt-6 border-t border-slate-800/40 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
          
          {/* BADGE 1: STREAMLINE OPERATIONS */}
          <div className="flex flex-col items-center text-center space-y-2 group">
            <div className="w-11 h-11 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center shadow-lg shadow-red-500/10 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
              Streamline Operations
            </p>
          </div>

          {/* BADGE 2: SAFETY & COMPLIANCE */}
          <div className="flex flex-col items-center text-center space-y-2 group">
            <div className="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
              Ensure Safety & Compliance
            </p>
          </div>

          {/* BADGE 3: BETTER CAMPUS EXPERIENCE */}
          <div className="flex flex-col items-center text-center space-y-2 group">
            <div className="w-11 h-11 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/10 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
              Better Campus Experience
            </p>
          </div>

          {/* BADGE 4: DATA-DRIVEN DECISIONS */}
          <div className="flex flex-col items-center text-center space-y-2 group">
            <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
              Data-Driven Decisions
            </p>
          </div>

        </div>

      </main>

      {/* 4. FOOTER (EXACT MATCH FOR media_1789124912943.png) */}
      <footer className="w-full px-4 sm:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-semibold text-slate-500 relative z-10 border-t border-slate-800/40 bg-[#04060c]/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-black text-white">Facility<span className="text-red-500">OS</span></span>
          <span className="text-slate-600">|</span>
          <span>&copy; 2025 FacilityOS. All rights reserved.</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 font-bold">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
          <span className="text-slate-700">|</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
          <span className="text-slate-700">|</span>
          <span className="hover:text-white transition-colors cursor-pointer">Support</span>
        </div>
      </footer>

    </div>
  );
}
