'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { SLARule, Priority } from '@/lib/types';
import { Clock, PlusCircle, Edit2, Trash2, ShieldAlert, Wrench, Layers } from 'lucide-react';
import { ConfirmationModal } from '@/src/shared/components/ui/ConfirmationModal';

const CATEGORY_OPTIONS = [
  'Plumbing',
  'Electrical',
  'AC & HVAC',
  'Networking & Wifi',
  'Carpentry & Locksmith',
  'Sanitary Fittings',
  'Civil & Masonry',
  'General Maintenance',
  'Water Supply',
];

export default function SLAManagementPage() {
  const { slaRules: contextSlaRules, activeOrg } = useApp();
  const [slaRules, setSlaRules] = useState<SLARule[]>(contextSlaRules);
  const [notice, setNotice] = useState('');

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; category: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<SLARule | null>(null);

  // Form Fields
  const [category, setCategory] = useState('Plumbing');
  const [customCategory, setCustomCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('high');
  const [responseTimeHours, setResponseTimeHours] = useState<number>(1);
  const [resolutionTimeHours, setResolutionTimeHours] = useState<number>(4);

  const handleOpenAddModal = () => {
    setEditingRule(null);
    setCategory('Plumbing');
    setCustomCategory('');
    setPriority('high');
    setResponseTimeHours(1);
    setResolutionTimeHours(4);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rule: SLARule) => {
    setEditingRule(rule);
    if (CATEGORY_OPTIONS.includes(rule.category)) {
      setCategory(rule.category);
      setCustomCategory('');
    } else {
      setCategory('Other');
      setCustomCategory(rule.category);
    }
    setPriority(rule.priority);
    setResponseTimeHours(rule.responseTimeHours);
    setResolutionTimeHours(rule.resolutionTimeHours);
    setIsModalOpen(true);
  };

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === 'Other' ? customCategory.trim() : category;
    if (!finalCategory) {
      alert('Please select or specify a service category.');
      return;
    }

    if (editingRule) {
      setSlaRules((prev) =>
        prev.map((r) =>
          r.id === editingRule.id
            ? { ...r, category: finalCategory, priority, responseTimeHours, resolutionTimeHours }
            : r
        )
      );
      setNotice(`Updated SLA Rule for ${finalCategory} (${priority.toUpperCase()}).`);
    } else {
      const newRule: SLARule = {
        id: 'sla-' + Date.now(),
        category: finalCategory,
        priority,
        responseTimeHours,
        resolutionTimeHours,
      };
      setSlaRules((prev) => [...prev, newRule]);
      setNotice(`Added new SLA Rule for ${finalCategory} (${priority.toUpperCase()}).`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteRule = (id: string, ruleCategory: string) => {
    setDeleteTarget({ id, category: ruleCategory });
  };

  const handleConfirmDeleteRule = () => {
    if (!deleteTarget) return;
    setSlaRules((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    setNotice(`Deleted SLA Rule for ${deleteTarget.category}.`);
    setDeleteTarget(null);
  };

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'emergency':
        return { label: '🚨 EMERGENCY', bg: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300' };
      case 'critical':
        return { label: '🔴 CRITICAL', bg: 'bg-rose-50 dark:bg-rose-900 text-rose-700 dark:text-rose-300 border-rose-200' };
      case 'high':
        return { label: '🟧 HIGH', bg: 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 border-orange-300' };
      case 'normal':
        return { label: '🟡 NORMAL', bg: 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border-amber-300' };
      default:
        return { label: '🟢 LOW', bg: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300' };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-rose-600" />
            <span>SLA Rule Matrix & Escalation Engine</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure response and resolution deadlines per service category & priority for {activeOrg.name}
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add SLA Rule</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-red-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="text-xs underline font-extrabold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* SLA Rules Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-4 whitespace-nowrap">Service Category</th>
              <th className="p-4 whitespace-nowrap">Priority Level</th>
              <th className="p-4 whitespace-nowrap">Max First Response SLA</th>
              <th className="p-4 whitespace-nowrap">Max Resolution SLA</th>
              <th className="p-4 whitespace-nowrap">Auto-Escalation Flow</th>
              <th className="p-4 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {slaRules.map((rule) => {
              const badge = getPriorityBadge(rule.priority);

              return (
                <tr key={rule.id} className="hover:bg-red-50/40 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{rule.category}</span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border shadow-2xs ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </td>

                  <td className="p-4 font-mono font-bold text-red-700 whitespace-nowrap">
                    <span className="bg-red-50 dark:bg-red-950 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-800">
                      {rule.responseTimeHours} Hours ({rule.responseTimeHours * 60} mins)
                    </span>
                  </td>

                  <td className="p-4 font-mono font-bold text-red-900 whitespace-nowrap">
                    <span className="bg-red-50 dark:bg-red-950 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-800">
                      {rule.resolutionTimeHours} Hours
                    </span>
                  </td>

                  <td className="p-4 text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap">
                    Worker → Hostel Warden → Chief Admin
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(rule)}
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-all cursor-pointer"
                        title="Edit SLA Rule"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteRule(rule.id, rule.category)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer"
                        title="Delete SLA Rule"
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

      {/* Add / Edit SLA Rule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <span>{editingRule ? 'Edit SLA Deadline Rule' : 'Add New SLA Rule'}</span>
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1 transition-colors"
              >
                <span>✕ Close</span>
              </button>
            </div>

            <form onSubmit={handleSaveRule} className="flex-1 overflow-y-auto space-y-4 pt-4 pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Service Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-600"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="Other">+ Custom Category</option>
                </select>
              </div>

              {category === 'Other' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Custom Category Name</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. Elevator Maintenance"
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-600"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-600"
                >
                  <option value="emergency">🚨 EMERGENCY (Immediate Dispatch)</option>
                  <option value="critical">🔴 CRITICAL Priority</option>
                  <option value="high">🟧 HIGH Priority</option>
                  <option value="normal">🟡 NORMAL Priority</option>
                  <option value="low">🟢 LOW Priority</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Max First Response (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={responseTimeHours}
                    onChange={(e) => setResponseTimeHours(parseFloat(e.target.value) || 0.5)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Max Resolution (Hours)</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={resolutionTimeHours}
                    onChange={(e) => setResolutionTimeHours(parseFloat(e.target.value) || 1)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md cursor-pointer"
                >
                  {editingRule ? 'Save SLA Rule Changes' : 'Create SLA Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Rule Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete SLA Deadline Rule"
        message={`Are you sure you want to delete the SLA Rule for ${deleteTarget?.category || 'this category'}? Requests under this category will fallback to default SLA timings.`}
        confirmLabel="Yes, Delete SLA Rule"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteRule}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
