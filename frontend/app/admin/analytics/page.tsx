'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { BarChart3, TrendingUp, Clock, Star, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AnalyticsPage() {
  const { activeOrg } = useApp();

  const categoryData = [
    { name: 'Plumbing', count: 42, color: '#3b82f6' },
    { name: 'Electrical', count: 38, color: '#f59e0b' },
    { name: 'AC & HVAC', count: 24, color: '#10b981' },
    { name: 'Carpentry', count: 18, color: '#8b5cf6' },
    { name: 'IT Support', count: 15, color: '#ec4899' },
    { name: 'Cleaning', count: 29, color: '#06b6d4' },
  ];

  const monthlyTrendData = [
    { month: 'Mar', requests: 120, slaPass: 115 },
    { month: 'Apr', requests: 145, slaPass: 138 },
    { month: 'May', requests: 160, slaPass: 152 },
    { month: 'Jun', requests: 190, slaPass: 181 },
    { month: 'Jul', requests: 210, slaPass: 198 },
    { month: 'Aug', requests: 245, slaPass: 232 },
  ];

  const priorityDistribution = [
    { name: 'Low', value: 30, color: '#3b82f6' },
    { name: 'Normal', value: 45, color: '#64748b' },
    { name: 'High', value: 20, color: '#f97316' },
    { name: 'Critical / Emergency', value: 5, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <span>Facility Operational Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            SLA metrics, category breakdown, technician resolution speed for {activeOrg.name}
          </p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
          Last 30 Days Data
        </span>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">Average Resolution Time</span>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">4.2 Hours</p>
          <span className="text-[10px] text-emerald-500 font-bold mt-1 block">↓ 14% faster than last month</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">SLA Compliance Rate</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">94.8%</p>
          <span className="text-[10px] text-emerald-500 font-bold mt-1 block">Target: &gt;90%</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">Requester Satisfaction</span>
          <p className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-1">
            <span>4.85</span>
            <Star className="w-5 h-5 fill-amber-400" />
          </p>
          <span className="text-[10px] text-slate-400 mt-1 block">Based on 182 verified ratings</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400">Reopen Rate</span>
          <p className="text-2xl font-black text-rose-500 mt-1">1.8%</p>
          <span className="text-[10px] text-rose-500 font-bold mt-1 block">Low quality rejection rate</span>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Bar Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Service Request Volume by Category
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Request & SLA Trend Line Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Monthly Volume & SLA Pass Rate Trend
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={3} name="Total Requests" />
                <Line type="monotone" dataKey="slaPass" stroke="#10b981" strokeWidth={3} name="Met SLA" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
