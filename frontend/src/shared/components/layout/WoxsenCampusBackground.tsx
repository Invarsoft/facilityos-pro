'use client';

import React from 'react';

export function WoxsenCampusBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Campus Photo */}
      <img
        src="/woxsen-campus-bg.jpg"
        alt="Woxsen University Campus Background"
        className="w-full h-full object-cover opacity-[0.18] dark:opacity-[0.25] scale-105 transition-opacity duration-700"
      />
      {/* Soft Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-transparent to-slate-50/90 dark:from-slate-950/70 dark:via-slate-950/40 dark:to-slate-950/95" />
    </div>
  );
}
