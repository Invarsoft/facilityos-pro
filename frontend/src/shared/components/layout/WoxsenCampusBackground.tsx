'use client';

import React from 'react';

export function WoxsenCampusBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Campus Photo - Full Rich Visibility */}
      <img
        src="/woxsen-campus-bg.jpg"
        alt="Woxsen University Campus Background"
        className="w-full h-full object-cover opacity-85 scale-100 transition-opacity duration-700 brightness-[0.9] contrast-[1.05]"
      />
      {/* Soft Dark Vignette for Readability */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px]" />
    </div>
  );
}
