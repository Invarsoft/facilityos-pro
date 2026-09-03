'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Role, UserProfile } from '@/lib/types';
import { Users, Search, PlusCircle, ShieldCheck, UserCheck, Trash2, Edit2, Building2, Bed, Key } from 'lucide-react';
import { ConfirmationModal } from '@/src/shared/components/ui/ConfirmationModal';

export default function UserManagementPage() {
  const { users, activeOrg, sectors, updateUserRole, addUser, updateUser, deleteUser } = useApp();
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Modal States for Add & Edit Warden / User
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('warden');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [assignedBlocks, setAssignedBlocks] = useState<string[]>(['Block A', 'Block B', 'Tower T1']);
  const [roomOrUnit, setRoomOrUnit] = useState('Hostel Tower T1');
  const [accessTokenNo, setAccessTokenNo] = useState('WDN-3030-T');
  const [accessPin, setAccessPin] = useState('2026');
  const [tokenType, setTokenType] = useState<'permanent' | 'temporary'>('permanent');
  const [tokenExpiresAt, setTokenExpiresAt] = useState('');
  const [customSectorInput, setCustomSectorInput] = useState('');

  // Dynamically derive Towers & Blocks strictly from live AppContext sectors (created/deleted in Facility Hierarchy)
  const liveTowers = sectors
    .filter((s) => s.type === 'tower')
    .map((s) => s.name.split(' (')[0]);

  const liveBlocks = sectors
    .filter((s) => s.type === 'block')
    .map((s) => s.name.split(' (')[0]);

  // Keep any custom/legacy assigned blocks for the active user if not in sectors
  const extraTowers = assignedBlocks.filter((b) => b.toLowerCase().includes('tower') && !liveTowers.includes(b));
  const extraBlocks = assignedBlocks.filter((b) => !b.toLowerCase().includes('tower') && !liveBlocks.includes(b));

  const displayTowers = Array.from(new Set([...liveTowers, ...extraTowers]));
  const displayBlocks = Array.from(new Set([...liveBlocks, ...extraBlocks]));

  const allHostelScopeOptions = [...displayTowers, ...displayBlocks];

  const toggleBlockAssignment = (b: string) => {
    setAssignedBlocks((prev) =>
      prev.includes(b) ? prev.filter((item) => item !== b) : [...prev, b]
    );
  };

  const handleAddCustomSector = () => {
    const trimmed = customSectorInput.trim();
    if (!trimmed) return;
    if (!assignedBlocks.includes(trimmed)) {
      setAssignedBlocks((prev) => [...prev, trimmed]);
    }
    setCustomSectorInput('');
  };

  const handleSelectAllBlocks = () => {
    if (assignedBlocks.length === allHostelScopeOptions.length) {
      setAssignedBlocks([]);
    } else {
      setAssignedBlocks([...allHostelScopeOptions]);
    }
  };

  // Filter users by active tenant
  const tenantUsers = users.filter((u) => {
    const matchesTenant = u.orgId === activeOrg.id || activeOrg.id === 'woxsen-university';
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(search.toLowerCase())) ||
      (u.roomOrUnit && u.roomOrUnit.toLowerCase().includes(search.toLowerCase())) ||
      (u.assignedBlocks && u.assignedBlocks.some(b => b.toLowerCase().includes(search.toLowerCase())));

    return matchesTenant && matchesSearch;
  });

  const handleRoleChange = (userId: string, userName: string, newRole: Role) => {
    updateUserRole(userId, newRole);
    if (newRole === 'warden') {
      const targetUser = users.find((u) => u.id === userId);
      if (targetUser) {
        handleOpenEditModal({ ...targetUser, role: 'warden' });
      }
      setNotice(`Updated role for ${userName} to HOSTEL WARDEN. Select assigned towers & blocks below.`);
    } else {
      setNotice(`Updated role for ${userName} to ${newRole.toUpperCase()}. Portal access updated.`);
    }
  };

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('warden');
    setAvatar('https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80');
    setCustomAvatarUrl('');
    setAssignedBlocks(['Block A', 'Block B', 'Tower T1', 'Tower T2']);
    setRoomOrUnit('Hostel Tower T1');
    const genToken = `WDN-${Math.floor(1000 + Math.random() * 9000)}-T`;
    setAccessTokenNo(genToken);
    setAccessPin('2026');
    setTokenType('permanent');
    setTokenExpiresAt('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u: UserProfile) => {
    setEditingUser(u);
    setName(u.name);
    setEmail(u.email);
    setPhone(u.phone || '');
    setRole(u.role);
    setAvatar(u.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80');
    setCustomAvatarUrl('');
    setAccessTokenNo(u.accessTokenNo || `WOX-${Math.floor(1000 + Math.random() * 9000)}-T`);
    setAccessPin(u.accessPin || '2026');
    setTokenType(u.tokenType || 'permanent');
    setTokenExpiresAt(u.tokenExpiresAt ? new Date(u.tokenExpiresAt).toISOString().slice(0, 16) : '');
    
    // Dynamically resolve assigned sectors from sectors state + u.assignedBlocks
    const sectorsAssignedToUser = sectors.filter((s) => s.assignedWarden && s.assignedWarden.includes(u.name)).map((s) => s.name);
    let initialBlocks = Array.from(new Set([...(u.assignedBlocks || []), ...sectorsAssignedToUser]));
    if (initialBlocks.length === 0 && u.department && u.department.includes('Assigned: ')) {
      initialBlocks = u.department
        .replace('Assigned: ', '')
        .split(', ')
        .filter((b) => !b.toLowerCase().includes('operations') && !b.toLowerCase().includes('campus'));
    }
    if (initialBlocks.length === 0 && u.role === 'warden') {
      initialBlocks = ['Block A', 'Block B', 'Tower T1', 'Tower T2'];
    }

    setAssignedBlocks(initialBlocks);
    setRoomOrUnit(u.roomOrUnit || 'Hostel Tower T1');
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    setDeleteTarget({ id: userId, name: userName });
  };

  const handleConfirmDeleteUser = () => {
    if (!deleteTarget) return;
    deleteUser(deleteTarget.id);
    setNotice(`Successfully deleted ${deleteTarget.name} from Woxsen Portal.`);
    setDeleteTarget(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          setCustomAvatarUrl('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please fill in user name and email address.');
      return;
    }

    const scopeSummary = assignedBlocks.length > 0 ? assignedBlocks.join(', ') : 'All Hostel Areas';
    const computedExpiration = tokenType === 'temporary' && tokenExpiresAt ? new Date(tokenExpiresAt).toISOString() : undefined;

    const finalAvatar = customAvatarUrl.trim() || avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80';

    if (editingUser) {
      // Edit User / Warden
      updateUser(editingUser.id, {
        name,
        email,
        phone,
        role,
        avatar: finalAvatar,
        department: role === 'warden' ? `Assigned: ${scopeSummary}` : editingUser.department,
        assignedBlocks: role === 'warden' ? assignedBlocks : [],
        roomOrUnit,
        accessTokenNo,
        accessPin,
        tokenType,
        tokenExpiresAt: computedExpiration,
      });
      setNotice(`Updated profile & credentials for ${name} (${tokenType.toUpperCase()} Token: ${accessTokenNo} | PIN: ${accessPin}).`);
    } else {
      // Add New Warden / User
      const newUser: UserProfile = {
        id: 'user-' + Date.now(),
        orgId: 'woxsen-university',
        name,
        email,
        phone,
        role,
        avatar: finalAvatar,
        department: role === 'warden' ? `Assigned: ${scopeSummary}` : 'Woxsen Campus',
        assignedBlocks: role === 'warden' ? assignedBlocks : [],
        roomOrUnit,
        accessTokenNo,
        accessPin,
        tokenType,
        tokenExpiresAt: computedExpiration,
      };
      addUser(newUser);
      setNotice(`Added ${name} with ${tokenType.toUpperCase()} Access Code (${accessTokenNo} | PIN: ${accessPin}).`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" />
            <span>Woxsen Warden & User Directory</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Add, edit, or delete Wardens, assign multiple Hostel Towers (T1–T6) & Blocks (A–G) to a warden, and manage portal access.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Warden / User</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="text-xs underline font-extrabold cursor-pointer">Dismiss</button>
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
              <th className="p-4">Assigned Towers & Blocks</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenantUsers.map((u) => {
              const isWarden = u.role === 'warden';
              const rawDept = u.department?.replace('Assigned: ', '') || '';
              const sectorsAssignedToUser = sectors.filter((s) => s.assignedWarden && s.assignedWarden.includes(u.name)).map((s) => s.name);
              const combinedBlocks = Array.from(new Set([...(u.assignedBlocks || []), ...sectorsAssignedToUser]));
              const cleanBlocks = combinedBlocks.length > 0
                ? combinedBlocks
                : (rawDept.includes('Hostel Operations') || rawDept.includes('Campus') || !rawDept)
                ? ['Block A', 'Block B', 'Tower T1', 'Tower T2']
                : rawDept.split(', ').filter((b) => !b.toLowerCase().includes('operations'));

              return (
                <tr key={u.id} className="hover:bg-red-50/30 transition-colors">
                  {/* Warden / User Info with Profile Pic Camera Trigger */}
                  <td className="p-4 flex items-center gap-3">
                    <div
                      className="relative group cursor-pointer"
                      onClick={() => handleOpenEditModal(u)}
                      title="Click to edit profile picture & user details"
                    >
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-red-600/30 group-hover:opacity-80 transition-opacity" />
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] shadow-sm ring-1 ring-white">
                        📷
                      </span>
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block">{u.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{u.email}</span>
                    </div>
                  </td>

                  {/* Read-Only Assigned Role Badge (Role can ONLY be changed inside Edit Modal) */}
                  <td className="p-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-black bg-red-50 text-red-900 border border-red-200">
                      {u.role === 'admin' || u.role === 'org_admin'
                        ? 'Woxsen Chief Admin'
                        : u.role === 'warden' || u.role === 'manager'
                        ? 'Hostel Area Admin (Warden)'
                        : u.role === 'worker' || u.role === 'technician'
                        ? 'Worker / Technician'
                        : 'Student / Requester'}
                    </span>
                  </td>

                  <td className="p-4">
                    {isWarden ? (
                      <span className="text-slate-700 font-medium leading-relaxed block max-w-md">
                        {cleanBlocks.length > 0
                          ? `Assigned: ${cleanBlocks.join(', ')}`
                          : 'No Sectors Assigned'}
                      </span>
                    ) : (
                      <span className="text-slate-600 font-medium">{u.department || u.roomOrUnit || 'Woxsen Campus'}</span>
                    )}
                  </td>

                  <td className="p-4 font-mono font-bold text-slate-700 whitespace-nowrap">{u.phone || 'N/A'}</td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(u)}
                        className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-all cursor-pointer"
                        title="Edit Warden / Assign Blocks"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer"
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

      {/* Add / Edit Warden & User Modal with Multi-Block Selector */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-xl w-full shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-red-600" />
                <span>{editingUser ? 'Edit Warden / Assign Blocks' : 'Add New Warden / Staff'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1 transition-colors"
              >
                <span>✕ Close</span>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
              {/* Profile Picture Selector */}
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-3">
                <span className="block text-xs font-black text-red-950">🖼️ Profile Picture / Avatar</span>
                
                <div className="flex items-center gap-3">
                  <img
                    src={customAvatarUrl.trim() || avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
                    alt="Profile Preview"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-red-600/30 shadow-md shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <p className="font-extrabold text-slate-900">Change Profile Picture</p>
                    <p className="text-[10px] text-slate-500">Select a preset avatar or paste a custom image URL below.</p>
                  </div>
                </div>

                {/* Preset Avatars Row */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                  {[
                    { label: 'Executive Male', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80' },
                    { label: 'Executive Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
                    { label: 'Academic Director', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
                    { label: 'Staff Lead', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
                    { label: 'Student Female', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
                    { label: 'Student Male', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setAvatar(preset.url);
                        setCustomAvatarUrl('');
                      }}
                      className={`p-0.5 rounded-full border-2 transition-all shrink-0 cursor-pointer ${
                        avatar === preset.url && !customAvatarUrl ? 'border-red-600 scale-110' : 'border-slate-200'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-8 h-8 rounded-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Local Device Photo Upload & Custom URL Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2 border-t border-red-200/80">
                  <div>
                    <label className="block text-[11px] font-black text-slate-900 mb-1">📁 Upload Photo from Device</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="w-full text-[11px] text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[11px] file:font-extrabold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-900 mb-1">🔗 Or Enter Image Web URL</label>
                    <input
                      type="text"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-1.5 rounded-xl border border-red-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Verma"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
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

              {/* Multi-Block Selection for Wardens */}
              {role === 'warden' && (
                <div className="space-y-3 p-4 rounded-2xl bg-blue-50/50 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-xs font-extrabold text-blue-900">
                        Assign Multiple Blocks / Towers to Warden
                      </label>
                      <p className="text-[10px] text-blue-700 font-medium">
                        Complaints in these blocks will be automatically routed to this Warden.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSelectAllBlocks}
                      className="px-3 py-1 rounded-xl bg-blue-600 text-white font-extrabold text-[10px] hover:bg-blue-700"
                    >
                      {assignedBlocks.length === allHostelScopeOptions.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>

                  {/* Towers Group */}
                  <div>
                    <span className="text-[11px] font-black text-slate-700 block mb-1">Hostel Towers ({displayTowers.length})</span>
                    <div className="grid grid-cols-3 gap-2">
                      {displayTowers.map((t) => {
                        const isChecked = assignedBlocks.includes(t);

                        return (
                          <div
                            key={t}
                            onClick={() => toggleBlockAssignment(t)}
                            className={`p-2 rounded-xl border cursor-pointer text-xs font-bold transition-all flex items-center gap-2 ${
                              isChecked
                                ? 'bg-red-600 text-white border-red-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-red-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="rounded text-red-600 focus:ring-0"
                            />
                            <span>{t}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Blocks Group */}
                  <div>
                    <span className="text-[11px] font-black text-slate-700 block mb-1">Residential Blocks ({displayBlocks.length})</span>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {displayBlocks.map((b) => {
                        const isChecked = assignedBlocks.includes(b);

                        return (
                          <div
                            key={b}
                            onClick={() => toggleBlockAssignment(b)}
                            className={`p-2 rounded-xl border cursor-pointer text-xs font-bold transition-all flex items-center gap-2 ${
                              isChecked
                                ? 'bg-red-600 text-white border-red-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:border-red-400'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="rounded text-red-600 focus:ring-0"
                            />
                            <span>{b}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Sector / Tower Quick Add */}
                  <div className="pt-2">
                    <span className="text-[11px] font-black text-slate-700 block mb-1">Add Custom Tower or Sector Name</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={customSectorInput}
                        onChange={(e) => setCustomSectorInput(e.target.value)}
                        placeholder="e.g. Tower 7, Tower T7, or Block H"
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSector();
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSector}
                        className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-700 shrink-0 cursor-pointer"
                      >
                        + Add to Scope
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-red-900 pt-1">
                    Selected ({assignedBlocks.length}): {assignedBlocks.length > 0 ? assignedBlocks.join(', ') : 'None selected (Admin will oversee all)'}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  {editingUser ? 'Save Block Scope Changes' : 'Create Warden Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete User Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Warden / User Profile"
        message={`Are you sure you want to delete ${deleteTarget?.name || 'this user'}? This will revoke their portal access and remove their account.`}
        confirmLabel="Yes, Delete User"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
