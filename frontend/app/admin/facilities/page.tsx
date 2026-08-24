'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Building, Layers, ChevronRight, PlusCircle } from 'lucide-react';

export default function FacilityHierarchyPage() {
  const { activeOrg } = useApp();

  const hierarchy = [
    {
      campus: `${activeOrg.name} Main Campus`,
      buildings: [
        {
          name: 'Hostel A',
          blocks: [
            {
              name: 'Block B',
              floors: [
                { name: 'Floor 1', rooms: ['Room 101', 'Room 102', 'Room 103'] },
                { name: 'Floor 2', rooms: ['Room 201', 'Room 204 (Tap Leak)', 'Room 205'] },
              ],
            },
          ],
        },
        {
          name: 'Hostel B',
          blocks: [
            {
              name: 'Block A',
              floors: [{ name: 'Floor 3', rooms: ['Room 312 (Fan Issue)'] }],
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-6 h-6 text-emerald-500" />
            <span>Facility Organizational Hierarchy</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Hierarchy tree structure for {activeOrg.name} (Campus → Building → Block → Floor → Room)
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md">
          <PlusCircle className="w-4 h-4" />
          <span>Add Building / Block</span>
        </button>
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        {hierarchy.map((c, i) => (
          <div key={i} className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-blue-600 dark:text-blue-400">
              <Layers className="w-5 h-5" />
              <span>{c.campus}</span>
            </div>

            <div className="pl-6 space-y-4 border-l-2 border-slate-200 dark:border-slate-800">
              {c.buildings.map((b) => (
                <div key={b.name} className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-500" />
                    <span>{b.name}</span>
                  </h3>

                  <div className="pl-6 space-y-2">
                    {b.blocks.map((blk) => (
                      <div key={blk.name} className="space-y-2">
                        <span className="text-xs font-semibold text-slate-500 block">Block: {blk.name}</span>
                        <div className="pl-4 space-y-2">
                          {blk.floors.map((flr) => (
                            <div key={flr.name} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                              <span className="font-extrabold text-slate-800 dark:text-slate-200 block mb-1.5">{flr.name}</span>
                              <div className="flex flex-wrap gap-2">
                                {flr.rooms.map((rm) => (
                                  <span key={rm} className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px]">
                                    {rm}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
