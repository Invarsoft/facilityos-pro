'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Role, UserProfile } from '@/lib/types';
import { Users, Search, PlusCircle, ShieldCheck, UserCheck, Sparkles, Trash2, Edit2, Building2, Bed, Key } from 'lucide-react';

export default function UserManagementPage() {
  const { users, activeOrg, updateUserRole, addUser, updateUser, deleteUser } = useApp();
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');

  // Modal States for Add & Edit Warden / User
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('warden');
  const [assignedScope, setAssignedScope] = useState('Tower T1 (Boys Residence)');
  const [roomOrUnit, setRoomOrUnit] = useState('Hostel Tower T1');

  const hostelScopeOptions = [
    'Tower T1 (Boys Residence)',
    'Tower T2 (Boys Residence)',
    'Tower T3 (Boys Residence)',
    'Tower T4 (Girls Residence)',
    'Tower T5 (Girls Residence)',
    'Tower T6 (Girls Residence)',
    'Block A (Student Residence)',
    'Block B (Student Residence)',
    'Block C (Student Residence)',
    'Block D (Student Residence)',
    'Block E (Student Residence)',
    'Block F (Student Residence)',
    'Block G (Student Residence)',
  ];

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
    setNotice(`Updated role for ${userName} to ${newRole.toUpperCase()}. Portal access updated.`);
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPhone('+91 98000 ');
    setRole('warden');
    setAssignedScope('Tower T1 (Boys Residence)');
    setRoomOrUnit('Hostel Tower T1');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u: UserProfile) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone || '');
    setRole(u.role);
    setAssignedScope(u.department || 'Tower T1 (Boys Residence)');
    setRoomOrUnit(u.roomOrUnit || 'Hostel Tower T1');
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This will revoke their portal access.`)) {
      deleteUser(userId);
      setNotice(`Successfully deleted ${userName} from Woxsen Portal.`);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please fill in user name and email address.');
      return;
    }

    if (editingUser) {
      // Edit User / Warden
      updateUser(editingUser.id, {
        name,
        email,
        phone,
        role,
        department: role === 'warden' ? `Assigned: ${assignedScope}` : editingUser.department,
        roomOrUnit,
      });
      setNotice(`Updated Warden/User details for ${name}. Assigned Scope: ${assignedScope}.`);
    } else {
      // Add New Warden / User
      const newUser: UserProfile = {
        id: 'user-' + Date.now(),
        orgId: 'woxsen-university',
        name,
        email,
        phone,
        role,
        avatar: role === 'warden' 
          ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        department: role === 'warden' ? `Assigned: ${assignedScope}` : 'Woxsen Campus',
        roomOrUnit,
        accessTokenNo: `WOX-${Math.floor(1000 + Math.random() * 9000)}-T`,
        accessPin: '2026',
      };
      addUser(newUser);
      setNotice(`Added new Warden/User ${name} with access to ${assignedScope}.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Woxsen Warden & User Directory</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Add, edit, or delete Wardens, assign Hostel Towers (T1–T6) & Blocks (A–G), and manage user portal roles.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Warden / User</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="text-xs underline font-extrabold">Dismiss</button>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-blue-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search warden name, email, assigned tower/block..."
          className="w-full bg-transparent text-xs text-slate-900 focus:outline-none font-bold"
        />
      </div>

      {/* User & Warden Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Warden / User</th>
              <th className="p-4">Assigned Role</th>
              <th className="p-4">Assigned Tower / Block Scope</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Access Token</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenantUsers.map((u) => {
              const isWarden = u.role === 'warden';

              return (
                <tr key={u.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/20" />
                    <div>
                      <span className="font-extrabold text-slate-900 block">{u.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{u.email}</span>
                    </div>
                  </td>

                  {/* Interactive Admin Role Selector */}
                  <td className="p-4">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, u.name, e.target.value as Role)}
                      className="p-1.5 rounded-xl bg-white text-xs font-black border border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 uppercase"
                    >
                      <option value="student">Student / Requester</option>
                      <option value="worker">Worker / Technician</option>
                      <option value="warden">Hostel Area Admin (Towers T1–T6 & Blocks A–G)</option>
                      <option value="admin">Woxsen Chief Admin</option>
                    </select>
                  </td>

                  <td className="p-4">
                    {isWarden ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{u.department || 'Assigned: Towers T1–T6'}</span>
                      </span>
                    ) : (
                      <span className="text-slate-600 font-medium">{u.department || u.roomOrUnit || 'Woxsen Campus'}</span>
                    )}
                  </td>

                  <td className="p-4 font-mono font-bold text-slate-700">{u.phone || 'N/A'}</td>

                  <td className="p-4 font-mono font-bold text-blue-600">
                    <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {u.accessTokenNo || 'WOX-8849-T'}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all"
                        title="Edit Warden / Assign Scope"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all"
                        title="Delete Warden"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Warden & User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>{editingUser ? 'Edit Warden / User Scope' : 'Add New Warden / Staff'}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Verma"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Woxsen Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. warden.hostela@woxsen.edu.in"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 94450 99887"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Portal Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="warden">Hostel Area Admin / Warden</option>
                  <option value="admin">Woxsen Chief Admin</option>
                  <option value="worker">Worker / Technician</option>
                  <option value="student">Student / Requester</option>
                </select>
              </div>

              {role === 'warden' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Hostel Tower / Block Scope</label>
                  <select
                    value={assignedScope}
                    onChange={(e) => setAssignedScope(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-blue-300 text-xs font-black text-blue-900 focus:ring-2 focus:ring-blue-600"
                  >
                    {hostelScopeOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md"
                >
                  {editingUser ? 'Save Scope Changes' : 'Create Warden Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
