'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Role } from '@/lib/types';
import { Users, Search, PlusCircle, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';

export default function UserManagementPage() {
  const { users, activeOrg, updateUserRole } = useApp();
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');

  // Filter users by active tenant
  const tenantUsers = users.filter((u) => {
    const matchesTenant = u.orgId === activeOrg.id || activeOrg.id === 'woxsen-university';
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(search.toLowerCase())) ||
      (u.roomOrUnit && u.roomOrUnit.toLowerCase().includes(search.toLowerCase()));

    return matchesTenant && matchesSearch;
  });

  const handleRoleChange = (userId: string, userName: string, newRole: Role) => {
    updateUserRole(userId, newRole);
    setNotice(`Updated role for ${userName} to ${newRole.toUpperCase()}. They now have ${newRole.toUpperCase()} portal access.`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            <span>Woxsen User & Role Management Directory</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage authorized requesters, students, workers/technicians, wardens & admins for {activeOrg.name}
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="text-xs underline font-extrabold">Dismiss</button>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search user name, email, department, hostel room..."
          className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 focus:outline-none"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Assigned Role (Admin Changeable)</th>
              <th className="p-4">Department / Room</th>
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

                {/* Interactive Admin Role Selector */}
                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, u.name, e.target.value as Role)}
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-black border border-slate-300 dark:border-slate-700 text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500 uppercase"
                  >
                    <option value="student">Student / Requester</option>
                    <option value="worker">Worker / Technician</option>
                    <option value="warden">Hostel Warden / Manager</option>
                    <option value="admin">Woxsen Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </td>

                <td className="p-4 text-slate-700 dark:text-slate-300 font-semibold">{u.department || u.roomOrUnit || 'Woxsen Campus'}</td>
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
