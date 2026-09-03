'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { activeRole, currentUser, isAuthenticated } = useApp();

  const isManagerOrAdmin =
    activeRole === 'admin' ||
    activeRole === 'org_admin' ||
    activeRole === 'super_admin' ||
    activeRole === 'warden' ||
    activeRole === 'manager' ||
    currentUser?.role === 'admin' ||
    currentUser?.role === 'org_admin' ||
    currentUser?.role === 'super_admin' ||
    currentUser?.role === 'warden' ||
    currentUser?.role === 'manager';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (!isManagerOrAdmin) {
      // Redirect unauthorized roles (students/workers) after brief delay
      const timer = setTimeout(() => {
        if (currentUser?.role === 'worker' || currentUser?.role === 'technician') {
          router.push('/worker');
        } else {
          router.push('/dashboard');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isManagerOrAdmin, currentUser, router]);

  if (!isAuthenticated || !isManagerOrAdmin) {
    return (
      <div className="p-8 max-w-xl mx-auto my-12 rounded-3xl bg-white border border-rose-200 shadow-2xl text-center space-y-5 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto ring-8 ring-rose-50">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            🔒 ACCESS RESTRICTED
          </span>
          <h2 className="text-xl font-black text-slate-900">Chief Admin Authorization Required</h2>
          <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
            You do not have permission to view administrative analytics or organization management data. Students and Residents are restricted to their personal student portal.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-xs text-rose-900 font-bold flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-rose-600" />
          <span>Redirecting to your authorized student dashboard...</span>
        </div>

        <div className="pt-2">
          <Link
            href={currentUser?.role === 'warden' ? '/manager' : currentUser?.role === 'worker' ? '/worker' : '/dashboard'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Student Portal</span>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
