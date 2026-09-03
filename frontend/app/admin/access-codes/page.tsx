'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { UserProfile, AccessTokenType } from '@/lib/types';
import { Key, ShieldCheck, Clock, PlusCircle, Copy, CheckCircle2, Edit2, Trash2, UserCheck, Wrench, AlertTriangle } from 'lucide-react';
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

export default function AccessCodeManagementPage() {
  const { users, activeOrg, currentUser, addUser, updateUser, deleteUser } = useApp();
  const [notice, setNotice] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<'all' | 'permanent' | 'temporary' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Form Fields
  const [techName, setTechName] = useState('');
  const [techEmail, setTechEmail] = useState('');
  const [techPhone, setTechPhone] = useState('+91 98220 ');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Plumbing', 'Water Supply']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [tokenType, setTokenType] = useState<AccessTokenType>('permanent');
  const [accessTokenNo, setAccessTokenNo] = useState('WRK-5050-T');
  const [accessPin, setAccessPin] = useState('2026');
  const [tokenExpiresAt, setTokenExpiresAt] = useState('');

  const handleRevokeCode = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmRevokeCode = () => {
    if (!deleteTarget) return;
    deleteUser(deleteTarget.id);
    setNotice(`Revoked Access Code & deleted credentials for ${deleteTarget.name}.`);
    setDeleteTarget(null);
  };

  // Technician & Worker Accounts
  const technicians = users.filter(
    (u) => (u.orgId === activeOrg.id || activeOrg.id === 'woxsen-university') && (u.role === 'worker' || u.role === 'technician')
  );

  const filteredTechnicians = technicians.filter((w) => {
    const type = w.tokenType || 'permanent';
    const isExpired = type === 'temporary' && w.tokenExpiresAt && new Date(w.tokenExpiresAt) < new Date();

    if (filterType === 'permanent' && type !== 'permanent') return false;
    if (filterType === 'temporary' && type !== 'temporary') return false;
    if (filterType === 'expired' && !isExpired) return false;

    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.accessTokenNo && w.accessTokenNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (w.skills && w.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesSearch;
  });

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
    }
    setCustomSkillInput('');
  };

  const handleOpenAddModal = () => {
    const genToken = `WRK-${Math.floor(1000 + Math.random() * 9000)}-T`;
    setEditingUser(null);
    setTechName('');
    setTechEmail('');
    setTechPhone('+91 98220 ');
    setSelectedSkills(['Electrical', 'Fan Repair']);
    setCustomSkillInput('');
    setTokenType('permanent');
    setAccessTokenNo(genToken);
    setAccessPin('2026');
    setTokenExpiresAt('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (w: UserProfile) => {
    setEditingUser(w);
    setTechName(w.name);
    setTechEmail(w.email);
    setTechPhone(w.phone || '+91 98220 ');
    setSelectedSkills(w.skills && w.skills.length > 0 ? w.skills : ['General Repairs']);
    setCustomSkillInput('');
    setTokenType(w.tokenType || 'permanent');
    setAccessTokenNo(w.accessTokenNo || `WRK-${Math.floor(1000 + Math.random() * 9000)}-T`);
    setAccessPin(w.accessPin || '2026');
    setTokenExpiresAt(w.tokenExpiresAt ? new Date(w.tokenExpiresAt).toISOString().slice(0, 16) : '');
    setIsModalOpen(true);
  };

  const handleCopyCredentials = (tokenNo: string, pin: string, id: string) => {
    const text = `Woxsen Technician Access Code: ${tokenNo} | PIN: ${pin} | Login URL: http://localhost:3000/login`;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveAccessCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!techName.trim() || !techEmail.trim()) {
      alert('Please fill in technician name and email.');
      return;
    }

    const computedExpiration = tokenType === 'temporary' && tokenExpiresAt ? new Date(tokenExpiresAt).toISOString() : undefined;
    const skillsList = selectedSkills.length > 0 ? selectedSkills : ['General Repairs'];

    if (editingUser) {
      updateUser(editingUser.id, {
        name: techName,
        email: techEmail,
        phone: techPhone,
        accessTokenNo,
        accessPin,
        tokenType,
        tokenExpiresAt: computedExpiration,
        skills: skillsList,
      });
      setNotice(`Updated ${tokenType.toUpperCase()} Access Code for ${techName} (${accessTokenNo}).`);
    } else {
      const newTech: UserProfile = {
        id: 'worker-' + Date.now(),
        orgId: activeOrg.id,
        name: techName,
        email: techEmail,
        phone: techPhone || '+91 98220 11223',
        role: 'worker',
        avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        accessTokenNo,
        accessPin,
        tokenType,
        tokenExpiresAt: computedExpiration,
        skills: skillsList,
        rating: 5.0,
        totalJobsCompleted: 0,
        currentWorkload: 0,
        department: 'Technician Fleet',
      };
      addUser(newTech);
      setNotice(`Issued ${tokenType.toUpperCase()} Access Code ${accessTokenNo} (PIN: ${accessPin}) for ${techName}!`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Key className="w-6 h-6 text-red-600" />
            <span>Technician Access Code Management Hub</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Issue, configure, and monitor Permanent & Temporary Access Tokens and PINs for technicians & guest workers. Authorized for Chief Admins and Wardens.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Issue Technician Access Code & PIN</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="text-xs underline font-extrabold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-900 border border-red-200 hover:bg-red-100'
            }`}
          >
            All Codes ({technicians.length})
          </button>

          <button
            onClick={() => setFilterType('permanent')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'permanent'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-900 border border-red-200 hover:bg-red-100'
            }`}
          >
            🛡️ Permanent Staff ({technicians.filter((t) => (t.tokenType || 'permanent') === 'permanent').length})
          </button>

          <button
            onClick={() => setFilterType('temporary')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'temporary'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-900 border border-red-200 hover:bg-red-100'
            }`}
          >
            ⏳ Guest Workers ({technicians.filter((t) => t.tokenType === 'temporary').length})
          </button>

          <button
            onClick={() => setFilterType('expired')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterType === 'expired'
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-red-50 text-red-900 border border-red-200 hover:bg-red-100'
            }`}
          >
            ⚠️ Expired Codes
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search technician name, token, skill..."
          className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 w-full sm:w-64 focus:ring-2 focus:ring-red-600"
        />
      </div>

      {/* Access Code Management Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4 whitespace-nowrap">Technician / Guest</th>
              <th className="p-4 whitespace-nowrap">Code Type</th>
              <th className="p-4 whitespace-nowrap">Access Token & PIN</th>
              <th className="p-4 whitespace-nowrap">Expiration / Status</th>
              <th className="p-4">Specialist Trade Skills</th>
              <th className="p-4 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTechnicians.map((w) => {
              const isTemp = w.tokenType === 'temporary';
              const isExpired = isTemp && w.tokenExpiresAt && new Date(w.tokenExpiresAt) < new Date();
              const expDateFormatted = w.tokenExpiresAt ? new Date(w.tokenExpiresAt).toLocaleDateString() : '';

              return (
                <tr key={w.id} className="hover:bg-red-50/30 transition-colors">
                  {/* Technician / Guest */}
                  <td className="p-4 flex items-center gap-3 whitespace-nowrap">
                    <img src={w.avatar} alt={w.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-red-600/20" />
                    <div>
                      <span className="font-extrabold text-slate-900 block">{w.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{w.email}</span>
                    </div>
                  </td>

                  {/* Code Type */}
                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold border ${
                        isExpired
                          ? 'bg-red-100 text-red-950 border-red-300'
                          : isTemp
                          ? 'bg-red-50 text-red-900 border-red-200'
                          : 'bg-red-50 text-red-900 border-red-200'
                      }`}
                    >
                      {isExpired ? '⚠️ Expired' : isTemp ? '⏳ Temporary' : '🛡️ Permanent'}
                    </span>
                  </td>

                  {/* Access Token & PIN */}
                  <td className="p-4 whitespace-nowrap font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-900 border border-red-200 font-extrabold text-xs">
                        {w.accessTokenNo || 'WRK-5050-T'}
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[11px]">
                        PIN: {w.accessPin || '2026'}
                      </span>
                    </div>
                  </td>

                  {/* Expiration / Status */}
                  <td className="p-4 whitespace-nowrap">
                    {isTemp ? (
                      <span className={`font-semibold text-xs ${isExpired ? 'text-red-700 font-bold' : 'text-red-900'}`}>
                        {isExpired ? `Expired (${expDateFormatted})` : `Expires ${expDateFormatted}`}
                      </span>
                    ) : (
                      <span className="text-slate-500 font-medium">Valid Indefinitely</span>
                    )}
                  </td>

                  {/* Specialist Trade Skills */}
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {w.skills && w.skills.length > 0 ? (
                        w.skills.map((s) => (
                          <span key={s} className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-950 font-bold text-[10px] border border-red-200">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-xs italic">General Repairs</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCredentials(w.accessTokenNo || 'WRK-5050-T', w.accessPin || '2026', w.id)}
                        className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-all cursor-pointer flex items-center gap-1 font-bold text-xs"
                        title="Copy Access Token & PIN"
                      >
                        {copiedId === w.id ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-red-600" />
                            <span className="text-[11px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(w)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-all cursor-pointer"
                        title="Edit Code & Expiration"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleRevokeCode(w.id, w.name)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-700 border border-slate-200 transition-all cursor-pointer"
                        title="Revoke Access Code"
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

      {/* Issue / Edit Access Code Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-xl w-full shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-red-600" />
                <span>{editingUser ? 'Edit Technician Access Credentials' : 'Issue Technician Access Code & PIN'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1 transition-colors"
              >
                <span>✕ Close</span>
              </button>
            </div>

            <form onSubmit={handleSaveAccessCode} className="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
              {/* Token & PIN Configuration Box */}
              <div className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-black text-red-950">Access Authorization Type</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setTokenType('permanent');
                        setTokenExpiresAt('');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        tokenType === 'temporary'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      ⏳ Guest / Vendor
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
                  <div className="pt-2 border-t border-red-200 space-y-2 animate-in fade-in">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <label className="text-[11px] font-black text-red-950">⏳ Temporary Expiration Duration</label>
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Technician / Guest Name</label>
                <input
                  type="text"
                  value={techName}
                  onChange={(e) => setTechName(e.target.value)}
                  placeholder="e.g. Vikram Singh (HVAC Specialist)"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Woxsen Email / Contact</label>
                <input
                  type="email"
                  value={techEmail}
                  onChange={(e) => setTechEmail(e.target.value)}
                  placeholder="e.g. vikram.tech@woxsen.edu.in"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              {/* Specialist Trade Skills Multi-Selection Matrix */}
              <div className="space-y-2.5 p-4 rounded-2xl bg-red-50/40 border border-red-200">
                <span className="block text-xs font-extrabold text-red-950">Specialist Trade Skills</span>
                <p className="text-[10px] text-red-800 font-medium">
                  Select trade skills for automated Facos algorithm matching & assignment dispatch.
                </p>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {AVAILABLE_TRADE_SKILLS.map((skill) => {
                    const isChecked = selectedSkills.includes(skill);
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
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  {editingUser ? 'Save Access Code Details' : 'Issue Access Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Revoke Access Code Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Revoke Access Code & PIN"
        message={`Are you sure you want to revoke Access Code for ${deleteTarget?.name || 'this technician'}? They will no longer be able to sign in.`}
        confirmLabel="Yes, Revoke Code"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmRevokeCode}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
