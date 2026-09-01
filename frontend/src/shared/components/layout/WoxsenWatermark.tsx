'use client';

import React from 'react';

export function WoxsenWatermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden select-none">
      <img
        src="/woxsen-logo.jpg"
        alt="Woxsen University Watermark"
        className="w-[48rem] max-w-[85vw] opacity-[0.07] mix-blend-multiply object-contain transition-opacity duration-500"
      />
    </div>
  );
}
