'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  Star,
  Sparkles,
  Printer,
  Download,
  Activity,
  ShieldCheck,
  Building2,
  Send,
  CheckCircle2,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { activeOrg } = useApp();

  // Ask FixO AI Query State
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<{ text: string; metrics: string; action: string } | null>(null);

  const handleAskFixO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const queryLower = aiQuery.toLowerCase();

    if (queryLower.includes('sla') || queryLower.includes('breach')) {
      setAiAnswer({
        text: 'Found 1 active SLA breach in Hostel Block B (Ticket #FOS-2026-004821). Escalated to Level 2 (Warden Dr. Rajesh Verma).',
        metrics: 'Current SLA Pass Rate: 94.8% • Average Resolution: 4.2h',
        action: 'Recommended Action: Auto-assign secondary plumber from Worker Match Center.',
      });
    } else if (queryLower.includes('room') || queryLower.includes('occupancy')) {
      setAiAnswer({
        text: 'Total Hostel Occupancy: 1,240 / 1,400 beds occupied across Towers T1–T6 and Blocks A–G. 3 rooms are at MAXIMUM capacity (3/3).',
        metrics: 'Capacity Utilization: 88.5% • Available Beds: 160',
        action: 'Recommended Action: Review 1 pending student room change request in Warden Console.',
      });
    } else {
      setAiAnswer({
        text: `FixO Intelligence Summary for "${aiQuery}": Campus operations are running optimal across 14 enabled service categories. Zero emergency SOS events active.`,
        metrics: 'Campus Facility Health Index: 88/100 (Optimal)',
        action: 'Recommended Action: Execute monthly preventive AC chiller maintenance scheduled for tomorrow.',
      });
    }
  };

  const handlePrintExecutivePDF = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const categoryData = [
    { name: 'Plumbing', count: 42, color: '#dc2626' },
    { name: 'Electrical', count: 38, color: '#b91c1c' },
    { name: 'AC & HVAC', count: 24, color: '#ef4444' },
    { name: 'Carpentry', count: 18, color: '#991b1b' },
    { name: 'IT Support', count: 15, color: '#7f1d1d' },
    { name: 'Cleaning', count: 29, color: '#e11d48' },
  ];

  const monthlyTrendData = [
    { month: 'Mar', requests: 120, slaPass: 115 },
    { month: 'Apr', requests: 145, slaPass: 138 },
    { month: 'May', requests: 160, slaPass: 152 },
    { month: 'Jun', requests: 190, slaPass: 181 },
    { month: 'Jul', requests: 210, slaPass: 198 },
    { month: 'Aug', requests: 245, slaPass: 232 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300 print:p-0">
      
      {/* HEADER BAR & EXECUTIVE REPORT EXPORTER */}
      <div className="flex items-center justify-between flex-wrap gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-red-600" />
            <span>Campus Command Center & Operational Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            SLA metrics, Health Index, Ask FixO AI, and executive report controls for {activeOrg.name}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handlePrintExecutivePDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>1-Click Executive PDF Report</span>
          </button>

          <Link
            href="/courier/portal"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs transition-all active:scale-95 shrink-0"
          >
            <span>📦</span>
            <span>Courier Portal</span>
          </Link>

          <Link
            href="/sports/portal"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-black text-xs shadow-xs transition-all active:scale-95 shrink-0"
          >
            <span>⚽</span>
            <span>Sports Portal</span>
          </Link>
        </div>
      </div>

      {/* CAMPUS FACILITY HEALTH INDEX & COMMAND CENTER SUMMARY */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
              🟢 REAL-TIME CAMPUS COMMAND CENTER
            </span>
            <span className="text-xs font-mono text-slate-300">Woxsen University Main Campus</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Campus Facility Health Index: <span className="text-emerald-400 font-mono">88/100</span> (Optimal)</h2>
          <p className="text-xs text-slate-300 font-medium max-w-2xl">
            Calculated across HVAC (92%), Electrical (94%), Plumbing (84%), Wi-Fi (96%), Housekeeping (90%), and Room Occupancy SLA compliance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center">
            <span className="text-xs text-slate-300 font-black uppercase block">Active Technicians</span>
            <span className="text-2xl font-black text-amber-400">12 On Duty</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-center">
            <span className="text-xs text-slate-300 font-black uppercase block">Open Complaints</span>
            <span className="text-2xl font-black text-blue-400">5 Active</span>
          </div>
        </div>
      </div>

      {/* ASK FIXO — NATURAL LANGUAGE ADMIN AI ENGINE */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 print:hidden">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-sm font-black text-slate-900">Ask FixO — Natural Language Campus AI</h3>
              <p className="text-[11px] text-slate-500 font-semibold">Ask administrative queries about SLA breaches, room occupancy, costs, and assets</p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
            FixO AI Brain Active
          </span>
        </div>

        <form onSubmit={handleAskFixO} className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder='e.g. "Show SLA breaches in Hostel B" or "Which rooms have high complaints?"'
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer transition-transform active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Ask FixO</span>
          </button>
        </form>

        {aiAnswer && (
          <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-slate-900 text-xs space-y-2 animate-in fade-in">
            <p className="font-bold text-slate-900">{aiAnswer.text}</p>
            <p className="font-mono text-[11px] text-slate-600">{aiAnswer.metrics}</p>
            <p className="font-extrabold text-red-700">{aiAnswer.action}</p>
          </div>
        )}
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md">
          <span className="text-[11px] font-bold text-slate-500">Average Resolution Time</span>
          <p className="text-2xl font-black text-slate-900 mt-1">4.2 Hours</p>
          <span className="text-[10px] text-emerald-600 font-extrabold mt-1 block">↓ 14% faster than last month</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md">
          <span className="text-[11px] font-bold text-slate-500">SLA Compliance Rate</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">94.8%</p>
          <span className="text-[10px] text-emerald-600 font-extrabold mt-1 block">Target: &gt;90%</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md">
          <span className="text-[11px] font-bold text-slate-500">Requester Satisfaction</span>
          <p className="text-2xl font-black text-emerald-600 mt-1 flex items-center gap-1">
            <span>4.85</span>
            <Star className="w-5 h-5 fill-emerald-600 text-emerald-600" />
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block font-medium">Based on 182 verified ratings</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md">
          <span className="text-[11px] font-bold text-slate-500">Reopen Rate</span>
          <p className="text-2xl font-black text-red-600 mt-1">1.8%</p>
          <span className="text-[10px] text-red-700 font-extrabold mt-1 block">Low quality rejection rate</span>
        </div>
      </div>

      {/* CHARTS ROW 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Service Request Volume by Category
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#dc2626" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Request & SLA Trend Line Chart */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Monthly Volume & SLA Pass Rate Trend
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#dc2626" strokeWidth={3} name="Total Requests" />
                <Line type="monotone" dataKey="slaPass" stroke="#16a34a" strokeWidth={3} name="Met SLA (Pass)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
