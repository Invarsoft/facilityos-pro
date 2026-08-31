'use client';

import React, { Suspense } from 'react';
import { WoxsenAuthCard } from '@/src/features/auth/components/WoxsenAuthCard';
import { Lock } from 'lucide-react';

function LoginContent() {
  return (
    <div className="py-6 sm:py-12 px-3.5 sm:px-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Woxsen Brand Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
          <span>🎓</span>
          <span>Woxsen University Campus Portal</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Woxsen Campus Sign In
        </h1>

        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium">
          Sign in with your Woxsen Email Address. Your role (Student, Technician, Warden, Admin) is automatically detected on sign in.
        </p>
      </div>

      {/* Shared Unified Auth Card */}
      <WoxsenAuthCard onSuccessRedirect="/" />

      {/* Security Lock Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-2 max-w-xl mx-auto">
        <Lock className="w-4 h-4 text-slate-400" />
        <span>Woxsen campus infrastructure and service request wizards are protected until authenticated.</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Woxsen Portal Sign In...</div>}>
      <LoginContent />
    </Suspense>
  );
}
