'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { UserProfile } from '@/lib/types';
import { Wrench, Star, PlusCircle, Trash2, Edit2, CheckCircle2, Shield, Phone, Mail, Tag } from 'lucide-react';
import { ConfirmationModal } from '@/src/shared/components/ui/ConfirmationModal';

const AVAILABLE_TRADE_SKILLS = [
  'Plumbing',
  'Water Supply',
  'Sanitary Fittings',
  'Electrical',
  'AC & HVAC',
  'Fan Repair',
  'Carpentry',
  'Door & Furniture',
  'Civil & Masonry',
  'Networking & Wifi',
  'General Repairs',
];

export default function WorkerManagementPage() {
  const { users, activeOrg, addUser, updateUser, deleteUser } = useApp();
  const [notice, setNotice] = useState('');

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorker, setEditingWorker] = useState<UserProfile | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 98220 ');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [accessTokenNo, setAccessTokenNo] = useState('WRK-5050-T');
  const [accessPin, setAccessPin] = useState('2026');
  const [tokenType, setTokenType] = useState<'permanent' | 'temporary'>('permanent');
  const [tokenExpiresAt, setTokenExpiresAt] = useState('');
  const [skills, setSkills] = useState<string[]>(['Plumbing', 'Water Supply']);
  const [customSkillInput, setCustomSkillInput] = useState('');

  const workers = users.filter(
    (u) => (u.orgId === activeOrg.id || activeOrg.id === 'woxsen-university') && (u.role === 'worker' || u.role === 'technician')
  );

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

  const handleOpenAddModal = () => {
    const genToken = `WRK-${Math.floor(1000 + Math.random() * 9000)}-T`;
    setEditingWorker(null);
    setName('');
    setEmail('');
    setPhone('+91 98220 ');
    setAvatar('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80');
    setCustomAvatarUrl('');
    setAccessTokenNo(genToken);
    setAccessPin('2026');
    setTokenType('permanent');
    setTokenExpiresAt('');
    setSkills(['Electrical', 'Fan Repair']);
    setCustomSkillInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (w: UserProfile) => {
    setEditingWorker(w);
    setName(w.name);
    setEmail(w.email);
    setPhone(w.phone || '+91 98220 ');
    setAccessTokenNo(w.accessTokenNo || `WRK-${Math.floor(1000 + Math.random() * 9000)}-T`);
    setAccessPin(w.accessPin || '2026');
    setTokenType(w.tokenType || 'permanent');
    setTokenExpiresAt(w.tokenExpiresAt ? new Date(w.tokenExpiresAt).toISOString().slice(0, 16) : '');
    setSkills(w.skills && w.skills.length > 0 ? w.skills : ['General Repairs']);
    setCustomSkillInput('');
    setIsModalOpen(true);
  };

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setCustomSkillInput('');
  };

  const handleDeleteWorker = (id: string, workerName: string) => {
    setDeleteTarget({ id, name: workerName });
  };

  const handleConfirmDeleteWorker = () => {
    if (!deleteTarget) return;
    deleteUser(deleteTarget.id);
    setNotice(`Removed technician ${deleteTarget.name} from active fleet.`);
    setDeleteTarget(null);
  };

  const handleSaveTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      alert('Please enter technician name and email.');
      return;
    }

    const computedExpiration = tokenType === 'temporary' && tokenExpiresAt ? new Date(tokenExpiresAt).toISOString() : undefined;
    const finalAvatar = customAvatarUrl.trim() || avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80';

    if (editingWorker) {
      updateUser(editingWorker.id, {
        name,
        email,
        phone,
        avatar: finalAvatar,
        accessTokenNo,
        accessPin,
        tokenType,
        tokenExpiresAt: computedExpiration,
        skills,
      });
      setNotice(`Updated credentials & skills for technician ${name} (${tokenType.toUpperCase()} Token: ${accessTokenNo} | PIN: ${accessPin}).`);
    } else {
      const newTech: UserProfile = {
        id: 'wrk-' + Date.now(),
        orgId: 'woxsen-university',
        name,
        email,
        phone,
        role: 'worker',
        avatar: finalAvatar,
        skills,
        totalJobsCompleted: 0,
        currentWorkload: 0,
        rating: 5.0,
        accessTokenNo,
        accessPin,
        tokenType,
        tokenExpiresAt: computedExpiration,
        department: 'Technician Fleet',
      };
      addUser(newTech);
      setNotice(`Registered ${name} with ${tokenType.toUpperCase()} Access Code (${accessTokenNo} | PIN: ${accessPin}). Login at /login.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-violet-600" />
            <span>Technician & Worker Fleet Management</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Register new technicians, manage trade skills, workloads, and fleet ratings for {activeOrg.name}.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-xs shadow-lg shadow-violet-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Technician</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200 text-violet-900 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-violet-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="text-xs underline font-extrabold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Grid of Registered Technicians */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {workers.map((w) => (
          <div
            key={w.id}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 hover:border-red-500 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={w.avatar} alt={w.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-red-600/30" />
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{w.name}</h3>
                    <p className="text-[10px] font-mono text-slate-500">{w.email}</p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{w.rating || 4.8} Rating</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-red-50 text-red-900 border border-red-200">
                  {w.accessTokenNo || 'WRK-5050-T'}
                </span>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-500 font-bold block text-[11px] mb-1 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-red-600" />
                    <span>Specialist Trade Skills:</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {w.skills && w.skills.length > 0 ? (
                      w.skills.map((s) => (
                        <span key={s} className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-900 font-bold text-[10px] border border-red-200">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs italic">General Maintenance</span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-600 font-medium">
                  <span>Jobs Completed:</span>
                  <span className="font-bold text-slate-900">{w.totalJobsCompleted || 120}+</span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Active Workload:</span>
                  <span className="font-bold text-red-600">{w.currentWorkload || 0} Active</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEditModal(w)}
                className="px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 font-bold text-xs border border-violet-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Skills</span>
              </button>

              <button
                onClick={() => handleDeleteWorker(w.id, w.name)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Technician Registration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-xl w-full shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-red-600" />
                <span>{editingWorker ? 'Edit Technician Skills & Profile' : 'Register New Technician'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1 transition-colors"
              >
                <span>✕ Close</span>
              </button>
            </div>

            <form onSubmit={handleSaveTechnician} className="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
              {/* Access Credentials Authorization Group */}
              <div className="space-y-3 p-4 rounded-2xl bg-red-50/60 border border-red-200">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black text-red-950">Access Code Type</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setTokenType('permanent');
                        setTokenExpiresAt('');
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        tokenType === 'permanent'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      🛡️ Permanent Staff
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setTokenType('temporary');
                        if (!tokenExpiresAt) {
                          const exp = new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16);
                          setTokenExpiresAt(exp);
                        }
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        tokenType === 'temporary'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      ⏳ Guest / Contractor
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-black text-slate-900 mb-1">🔑 Access Token Number</label>
                    <input
                      type="text"
                      value={accessTokenNo}
                      onChange={(e) => setAccessTokenNo(e.target.value)}
                      placeholder="e.g. WRK-9842-T"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-red-300 text-xs font-bold font-mono text-slate-900 focus:ring-2 focus:ring-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black text-slate-900 mb-1">🔒 Login PIN</label>
                    <input
                      type="text"
                      value={accessPin}
                      onChange={(e) => setAccessPin(e.target.value)}
                      placeholder="e.g. 2026"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-red-300 text-xs font-bold font-mono text-slate-900 focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                </div>

                {tokenType === 'temporary' && (
                  <div className="pt-2 border-t border-red-200/80 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <label className="text-[11px] font-black text-red-950">⏳ Temporary Code Expiration</label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setTokenExpiresAt(new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16))}
                          className="px-2 py-0.5 rounded bg-white text-red-900 font-bold text-[10px] border border-red-300 hover:bg-red-100 cursor-pointer"
                        >
                          24h
                        </button>
                        <button
                          type="button"
                          onClick={() => setTokenExpiresAt(new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16))}
                          className="px-2 py-0.5 rounded bg-white text-red-900 font-bold text-[10px] border border-red-300 hover:bg-red-100 cursor-pointer"
                        >
                          48h
                        </button>
                        <button
                          type="button"
                          onClick={() => setTokenExpiresAt(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16))}
                          className="px-2 py-0.5 rounded bg-white text-red-900 font-bold text-[10px] border border-red-300 hover:bg-red-100 cursor-pointer"
                        >
                          7 Days
                        </button>
                        <button
                          type="button"
                          onClick={() => setTokenExpiresAt(new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 16))}
                          className="px-2 py-0.5 rounded bg-white text-red-900 font-bold text-[10px] border border-red-300 hover:bg-red-100 cursor-pointer"
                        >
                          30 Days
                        </button>
                      </div>
                    </div>

                    <input
                      type="datetime-local"
                      value={tokenExpiresAt}
                      onChange={(e) => setTokenExpiresAt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-red-300 text-xs font-bold font-mono text-red-900 focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                )}
              </div>

              {/* Profile Picture Selector */}
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-3">
                <span className="block text-xs font-black text-red-950">🖼️ Profile Picture / Avatar</span>
                
                <div className="flex items-center gap-3">
                  <img
                    src={customAvatarUrl.trim() || avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80'}
                    alt="Profile Preview"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-red-600/30 shadow-md shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <p className="font-extrabold text-slate-900">Technician Photo</p>
                    <p className="text-[10px] text-slate-500">Upload a photo from your device or select an avatar preset.</p>
                  </div>
                </div>

                {/* Preset Avatars Row */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
                  {[
                    { label: 'Technician Male', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
                    { label: 'Technician Staff', url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80' },
                    { label: 'Executive Male', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80' },
                    { label: 'Staff Lead', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
                    { label: 'Executive Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Technician Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Singh"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Woxsen Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vikram.tech@woxsen.edu.in"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98220 11223"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* Trade Skills Multi-Selection */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-red-50/40 border border-red-200">
                <span className="block text-xs font-extrabold text-red-950">Specialist Trade Skills</span>
                <p className="text-[10px] text-red-800 font-medium">
                  Select trade skills for automated Facos algorithm matching & assignment dispatch.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {AVAILABLE_TRADE_SKILLS.map((skill) => {
                    const isChecked = skills.includes(skill);
                    return (
                      <div
                        key={skill}
                        onClick={() => toggleSkill(skill)}
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
                        <span>{skill}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Custom Skill Input */}
                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    placeholder="Add custom trade skill..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-700 shrink-0 cursor-pointer"
                  >
                    + Add Skill
                  </button>
                </div>
              </div>

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
                  {editingWorker ? 'Save Technician Profile' : 'Register Technician'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Worker Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Remove Technician from Fleet"
        message={`Are you sure you want to remove ${deleteTarget?.name || 'this technician'} from the active technician fleet?`}
        confirmLabel="Yes, Remove Technician"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteWorker}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
