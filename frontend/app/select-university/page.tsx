'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Search,
  X,
  ChevronRight,
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

    // Redirect to Login page ONLY after selecting a university
    router.push('/login');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] text-white flex flex-col justify-between overflow-y-auto font-sans select-none">
      
      {/* VIVID GRADIENT GLOW BACKGROUNDS */}
      <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-red-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-blue-600/25 blur-[140px] rounded-full pointer-events-none" />
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

      </header>

      {/* 2. HERO SEARCH SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative z-10 max-w-4xl mx-auto w-full space-y-5 sm:space-y-6 text-center">
        
        {/* EYEBROW & MAIN TITLE */}
        <div className="space-y-2">
          <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-slate-400">
            SMART CAMPUSES. SMOOTHER OPERATIONS.
          </p>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-none">
            Welcome to Facility<span className="text-red-500">OS</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-md mx-auto">
            Find your university or college to access campus services
          </p>
        </div>

        {/* SMALLER, SLEEKER NEON SEARCH BAR */}
        <div className="w-full max-w-md mx-auto space-y-2.5">
          <div className="relative group">
            
            {/* NEON BORDER RING GLOW */}
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-red-500 via-blue-500 to-purple-500 opacity-80 blur-sm group-hover:opacity-100 transition-opacity" />

            <div className="relative flex items-center rounded-full bg-[#0b101e] border border-blue-500/50 px-4 py-2.5 sm:py-3 shadow-[0_0_20px_rgba(59,130,246,0.25)]">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
              
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
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* SEARCH RESULTS CARD CONTAINER */}
          {hasMinQueryLength && (
            <div className="w-full rounded-2xl bg-[#0b1120]/95 border border-slate-800/90 p-4 shadow-2xl backdrop-blur-xl text-left space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
              
              {/* HEADER ROW */}
              <div className="flex items-center justify-between text-[10px] font-black tracking-wider text-slate-400 uppercase border-b border-slate-800/60 pb-2.5 px-1">
                <span>UNIVERSITIES & COLLEGES</span>
                <span className="text-slate-400 font-bold">{filtered.length} results</span>
              </div>

              {/* RESULTS LIST */}
              <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                {filtered.length > 0 ? (
                  filtered.map((uni) => (
                    <div
                      key={uni.id}
                      onClick={() => handleSelectUniversity(uni)}
                      className="py-2.5 px-2.5 rounded-xl hover:bg-slate-800/60 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-0.5">
                        <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-red-400 transition-colors">
                          {uni.name}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-400 font-semibold">
                          {uni.location}
                        </p>
                      </div>

                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  ))
                ) : (
                  <div className="py-5 text-center space-y-1">
                    <p className="text-xs font-black text-slate-300">No matching campus found</p>
                    <p className="text-[10px] font-semibold text-slate-500">
                      No university matches "{searchQuery}". Try searching "wox", "iit", or "bits".
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* HELPER CAPTION BELOW CARD */}
          <p className="text-[10px] text-slate-500 font-medium text-center">
            {hasMinQueryLength
              ? `Showing results for "${searchQuery}"`
              : 'Type at least 3 letters to search'}
          </p>
        </div>

      </main>

      {/* 3. FOOTER */}
      <footer className="w-full px-4 sm:px-12 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[10px] font-semibold text-slate-500 relative z-10 border-t border-slate-800/40 bg-[#04060c]/80 backdrop-blur-md">
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
