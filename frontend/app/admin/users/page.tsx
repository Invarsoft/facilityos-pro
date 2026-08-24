'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Users, Search, PlusCircle, ShieldCheck } from 'lucide-react';

export default function UserManagementPage() {
  const { users, activeOrg } = useApp();

  // Filter users by active tenant
  const tenantUsers = users.filter((u) => u.orgId === activeOrg.id);

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            <span>User & Resident Directory</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage authorized requesters, students, residents, and staff for {activeOrg.name}
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md">
          <PlusCircle className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search user name, email, department, room..."
          className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Department / Unit</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Access Token</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {tenantUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-4 flex items-center gap-3">
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 block">{u.name}</span>
                    <span className="text-[10px] text-slate-400">{u.email}</span>
                  </div>
                </td>
                <td className="p-4 uppercase font-bold text-blue-600 dark:text-blue-400 text-[10px]">{u.role}</td>
                <td className="p-4 text-slate-700 dark:text-slate-300">{u.department || u.roomOrUnit || 'Main Facility'}</td>
                <td className="p-4 font-mono text-slate-500">{u.phone || 'N/A'}</td>
                <td className="p-4 font-mono font-bold text-amber-500">{u.accessTokenNo || 'WOX-8849-T'}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="w-3 h-3" /> Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
