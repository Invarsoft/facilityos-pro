'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { ALL_SERVICE_CATEGORIES } from '@/lib/mockData';
import { Settings, ShieldCheck, CheckCircle2, Wrench, Palette } from 'lucide-react';

export default function TenantSettingsPage() {
  const { activeOrg, updateOrgBranding, toggleOrgService } = useApp();

  const [name, setName] = useState(activeOrg.name);
  const [welcomeMessage, setWelcomeMessage] = useState(activeOrg.welcomeMessage);
  const [contactEmail, setContactEmail] = useState(activeOrg.contactEmail);
  const [contactPhone, setContactPhone] = useState(activeOrg.contactPhone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrgBranding(activeOrg.id, {
      name,
      welcomeMessage,
      contactEmail,
      contactPhone,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-500" />
          <span>Tenant Branding & Facility Settings</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Customize organization identity, contact info, and enable/disable service categories for {activeOrg.name}
        </p>
      </div>

      {/* Organization Identity Settings */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-500" />
          <span>Organization Identity & Custom Branding</span>
        </h2>

        <form onSubmit={handleSaveBranding} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organization Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Facility OS Code
              </label>
              <input
                type="text"
                value={activeOrg.code}
                disabled
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Portal Welcome Banner Message
            </label>
            <textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Helpdesk Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Helpdesk Hotline Phone
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Branding settings saved successfully!
              </span>
            )}
            <button
              type="submit"
              className="ml-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
            >
              Save Branding Settings
            </button>
          </div>
        </form>
      </div>

      {/* Enabled Services Toggle Matrix */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-500" />
            <span>Configure Active Services Matrix for {activeOrg.name}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Enable or disable specific services based on facility offering (e.g. Hostels enable Hostel Maint, Offices enable IT Support).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ALL_SERVICE_CATEGORIES.map((cat) => {
            const isEnabled = activeOrg.enabledServiceIds.includes(cat.id);

            return (
              <div
                key={cat.id}
                onClick={() => toggleOrgService(activeOrg.id, cat.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isEnabled
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400 opacity-60'
                }`}
              >
                <div className="space-y-0.5">
                  <h3 className="text-xs font-extrabold">{cat.name}</h3>
                  <span className="text-[10px] block opacity-80">{cat.description}</span>
                </div>

                <div
                  className={`w-10 h-6 rounded-full p-1 transition-colors ${
                    isEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      isEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
