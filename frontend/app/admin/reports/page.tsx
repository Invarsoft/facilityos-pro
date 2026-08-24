'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { FileText, Download, FileSpreadsheet, FileCode, CheckCircle2 } from 'lucide-react';

export default function ExportReportsPage() {
  const { activeOrg } = useApp();

  const reportTypes = [
    { title: 'Monthly Operations & Request Report', desc: 'Full log of created, resolved, and reopened tickets.' },
    { title: 'SLA Compliance & Breach Analysis', desc: 'Detailed SLA response timings and breach audit log.' },
    { title: 'Technician Performance & Rating Audit', desc: 'Individual worker completion rates and average satisfaction ratings.' },
    { title: 'Asset Maintenance & Warranty Log', desc: 'Asset condition, repair history, and scheduled preventive maintenance.' },
  ];

  const handleExport = (title: string, format: string) => {
    alert(`Downloading ${title} in ${format} format...`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-cyan-500" />
          <span>Operational Reports & Export Hub</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Export audit-ready maintenance and SLA reports for {activeOrg.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reportTypes.map((rep) => (
          <div key={rep.title} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{rep.title}</h3>
              <p className="text-xs text-slate-400">{rep.desc}</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleExport(rep.title, 'PDF')}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-rose-500" />
                <span>PDF</span>
              </button>

              <button
                onClick={() => handleExport(rep.title, 'CSV')}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                <span>CSV</span>
              </button>

              <button
                onClick={() => handleExport(rep.title, 'Excel')}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5"
              >
                <FileCode className="w-3.5 h-3.5 text-blue-500" />
                <span>Excel</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
