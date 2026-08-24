'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { ALL_SERVICE_CATEGORIES } from '@/lib/mockData';
import { FacilityType } from '@/lib/types';
import { Building2, CheckCircle2, X, PlusCircle } from 'lucide-react';

interface AddFacilityModalProps {
  onClose: () => void;
}

export const AddFacilityModal: React.FC<AddFacilityModalProps> = ({ onClose }) => {
  const router = useRouter();
  const { addOrganization } = useApp();

  const [name, setName] = useState('');
  const [type, setType] = useState<FacilityType>('university');
  const [location, setLocation] = useState('');
  const [code, setCode] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>(
    ALL_SERVICE_CATEGORIES.slice(0, 8).map((s) => s.id)
  );

  const facilityTypes: { type: FacilityType; label: string; logo: string }[] = [
    { type: 'university', label: 'University / College', logo: '🎓' },
    { type: 'apartment', label: 'Apartment / Community', logo: '🏡' },
    { type: 'office', label: 'Office / Corporate HQ', logo: '🏢' },
    { type: 'hostel', label: 'Hostel Maintenance', logo: 'Bed' },
    { type: 'hospital', label: 'Hospital / Medical', logo: '🏥' },
    { type: 'school', label: 'School Facilities', logo: '🏫' },
    { type: 'residential', label: 'Residential Complex', logo: '🏠' },
    { type: 'commercial', label: 'Commercial Building', logo: '🏬' },
    { type: 'other', label: 'Other Managed Facility', logo: '✨' },
  ];

  const handleNameChange = (val: string) => {
    setName(val);
    if (!code) {
      const slug = val.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 6);
      if (slug) setCode(`${slug}-2026`);
    }
  };

  const toggleService = (id: string) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const logo = facilityTypes.find((t) => t.type === type)?.logo || '🏢';

    const newOrg = addOrganization({
      name,
      type,
      location: location || 'City, State',
      code: code || `${name.slice(0, 4).toUpperCase()}-2026`,
      logo,
      contactEmail: contactEmail || `care@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      contactPhone: contactPhone || '+91 99000 11223',
      enabledServiceIds: selectedServices,
      welcomeMessage: `Welcome to ${name} Facility Operations Hub.`,
    });

    onClose();
    router.push(`/organizations/${newOrg.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Register & Add New Facility</h3>
              <p className="text-xs text-slate-500 font-medium">Create custom multi-tenant portal for your organization</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Facility / Organization Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. St. Jude Medical Center"
                required
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Facility Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FacilityType)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {facilityTypes.map((ft) => (
                  <option key={ft.type} value={ft.type}>
                    {ft.logo} {ft.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location (City, State)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, Maharashtra"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Unique Access Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. STJUDE-2026"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>

          {/* Enabled Services Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Select Enabled Services for this Facility:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_SERVICE_CATEGORIES.map((s) => {
                const checked = selectedServices.includes(s.id);
                return (
                  <label
                    key={s.id}
                    onClick={() => toggleService(s.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      checked
                        ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 opacity-70'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {}}
                      className="rounded text-blue-600"
                    />
                    <span>{s.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register & Launch Facility</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
