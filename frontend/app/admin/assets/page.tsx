'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Box, QrCode, PlusCircle, Wrench, ShieldCheck, Printer } from 'lucide-react';

export default function AssetManagementPage() {
  const { assets, activeOrg } = useApp();

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Box className="w-6 h-6 text-amber-500" />
            <span>Asset Management & QR Codes</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Track equipment warranty, maintenance history, and generate printable QR code stickers for {activeOrg.name}
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md">
          <PlusCircle className="w-4 h-4" />
          <span>Register New Asset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {assets.map((ast) => (
          <div key={ast.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900">
                  Tag: {ast.assetTag}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ast.condition === 'Optimal' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600' : 'bg-amber-100 dark:bg-amber-950 text-amber-600'}`}>
                  {ast.condition}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{ast.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{ast.building} — {ast.room}</p>
              </div>

              {/* Printable QR Code Graphic */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <img src={ast.qrCodeUrl} alt={ast.assetTag} className="w-16 h-16 rounded-xl border border-white" />
                <div className="text-[11px] space-y-0.5">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Scan to Raise Request</span>
                  <span className="text-[10px] text-slate-400 block">Installed: {ast.installationDate}</span>
                  <span className="text-[10px] text-slate-400 block">Warranty: {ast.warrantyUntil}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Printing QR Sticker for ${ast.assetTag}`)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Asset QR Sticker</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
