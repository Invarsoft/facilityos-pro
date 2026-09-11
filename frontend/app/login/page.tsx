'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { WoxsenAuthCard } from '@/src/features/auth/components/WoxsenAuthCard';
import {
  Zap,
  ShieldCheck,
  Users,
  BarChart3,
} from 'lucide-react';

function LoginContent() {
  return (
    <div className="fixed inset-0 z-50 bg-[#060913] text-white flex flex-col justify-between overflow-y-auto font-sans select-none">
      
      {/* 1. DUAL RED/BLUE GLOW LIGHTING BACKGROUND (EXACT MATCH FOR media_1789128936888.jpg) */}
      <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-red-600/25 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/30 blur-[160px] rounded-full pointer-events-none" />

      {/* 2. CAMPUS ARCHITECTURE WATERMARK OVERLAY */}
      <div
        className="absolute inset-0 bg-cover bg-bottom opacity-20 pointer-events-none mix-blend-luminosity"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1920&auto=format&fit=crop')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04060d] via-[#060913]/70 to-transparent pointer-events-none" />

      {/* 3. TOP HEADER NAVIGATION BAR */}
      <header className="w-full px-6 sm:px-12 py-5 flex items-center justify-between border-b border-slate-800/40 relative z-20 backdrop-blur-md bg-[#060913]/60">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
            F
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-white">Facility</span>
              <span className="font-black text-xl tracking-tight text-red-500">OS</span>
              <span className="text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                PRO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold -mt-0.5 tracking-wide">
              Manage. Maintain. Resolve.
            </p>
          </div>
        </Link>

        <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 hidden sm:block">
          SMART CAMPUSES. SMOOTHER OPERATIONS.
        </p>
      </header>

      {/* 4. MAIN LOGIN CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative z-10 max-w-4xl mx-auto w-full space-y-6 text-center">
        
        {/* HERO TITLE */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-none">
            Welcome <span className="text-red-500">Back</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Sign in to access your campus services
          </p>
        </div>

        {/* CENTERED GLASSMOPHIC AUTH CARD CONTAINER */}
        <div className="w-full max-w-md mx-auto">
          <WoxsenAuthCard onSuccessRedirect="/" />
        </div>

        {/* 5. FOUR FEATURE BADGES WITH VERTICAL DIVIDERS */}
        <div className="w-full pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0 max-w-3xl mx-auto divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
            
            {/* BADGE 1 */}
            <div className="flex flex-col items-center text-center space-y-2 p-2 group">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center shadow-lg shadow-red-500/10 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4 fill-red-400" />
              </div>
              <p className="text-[11px] font-black text-slate-300 group-hover:text-white transition-colors">
                Streamline Operations
              </p>
            </div>

            {/* BADGE 2 */}
            <div className="flex flex-col items-center text-center space-y-2 p-2 group">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-black text-slate-300 group-hover:text-white transition-colors">
                Ensure Safety & Compliance
              </p>
            </div>

            {/* BADGE 3 */}
            <div className="flex flex-col items-center text-center space-y-2 p-2 group">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/10 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-black text-slate-300 group-hover:text-white transition-colors">
                Better Campus Experience
              </p>
            </div>

            {/* BADGE 4 */}
            <div className="flex flex-col items-center text-center space-y-2 p-2 group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-4 h-4" />
              </div>
              <p className="text-[11px] font-black text-slate-300 group-hover:text-white transition-colors">
                Data-Driven Decisions
              </p>
            </div>

          </div>
        </div>

      </main>

      {/* 6. FOOTER BAR */}
      <footer className="w-full px-6 sm:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-semibold text-slate-500 relative z-20 border-t border-slate-800/40 bg-[#04060d]/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-black text-white">Facility<span className="text-red-500">OS</span></span>
          <span className="text-slate-700">|</span>
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
