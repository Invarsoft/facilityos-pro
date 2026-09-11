'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { WoxsenAuthCard } from '@/src/features/auth/components/WoxsenAuthCard';
import { Lock, GraduationCap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const [universityName, setUniversityName] = useState('Woxsen University');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('selected_university_name');
      if (stored) {
        setUniversityName(stored);
      }
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#070b14] text-white flex flex-col justify-between overflow-y-auto font-sans select-none">
      
      {/* VIVID GRADIENT GLOW BACKGROUNDS (EXACT MATCH FOR UNIVERSITY SELECTOR) */}
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

        {/* CHANGE UNIVERSITY BUTTON */}
        <Link
          href="/select-university"
          className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-red-500" />
          <span>Change University</span>
        </Link>

      </header>

      {/* 2. LOGIN MAIN CONTENT WITH DARK NEON GLOW STYLE */}
      <main className="flex-1 flex flex-col items-center justify-center px-3.5 sm:px-6 py-8 sm:py-12 relative z-10 max-w-4xl mx-auto w-full space-y-6">
        
        {/* BRAND BANNER WITH SELECTED UNIVERSITY NAME */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-red-500" />
            <span>{universityName}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Campus Sign In
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium">
            Sign in with your official university email address. Your role is automatically detected on sign in.
          </p>
        </div>

        {/* SHARED UNIFIED AUTH CARD */}
        <div className="w-full max-w-md">
          <WoxsenAuthCard onSuccessRedirect="/" />
        </div>

        {/* SECURITY LOCK NOTICE */}
        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2 max-w-md mx-auto backdrop-blur-md">
          <Lock className="w-4 h-4 text-red-500 shrink-0" />
          <span>Campus infrastructure and service requests are protected until authenticated.</span>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Campus Portal Sign In...</div>}>
      <LoginContent />
    </Suspense>
  );
}
