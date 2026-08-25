'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { checkFacilityCode } from '@/src/features/onboarding/api';
import { usePublicOrganizations } from '@/src/features/organizations/api';
import { Organization, FacilityType } from '@/lib/types';
import {
  Search,
  ShieldCheck,
  MapPin,
  Wrench,
  ArrowRight,
  Key,
  QrCode,
  X,
  PlusCircle,
  Send,
  GraduationCap,
  Hospital,
  Home,
  Building,
  Bed,
  School,
  Building2,
  SlidersHorizontal,
} from 'lucide-react';
import { QRScannerModal } from '@/src/features/assets/components/QRScannerModal';
import { AddFacilityModal } from '@/src/shared/components/layout/AddFacilityModal';
import { RequestFacilityOnboardingModal } from '@/src/shared/components/layout/RequestFacilityOnboardingModal';

function SelectOrganizationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTypeFilter = searchParams.get('type') as FacilityType | null;

  const { organizations, setActiveOrg, activeRole } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>(initialTypeFilter || 'all');
  const [facilityCodeInput, setFacilityCodeInput] = useState('');
  const [codeModalOpen, setCodeModalOpen] = useState(searchParams.get('action') === 'code');
  const [qrModalOpen, setQrModalOpen] = useState(searchParams.get('action') === 'qr');
  const [addFacilityModalOpen, setAddFacilityModalOpen] = useState(false);
  const [requestOnboardingModalOpen, setRequestOnboardingModalOpen] = useState(false);
  const [codeError, setCodeError] = useState('');

  const isSuperAdmin = activeRole === 'super_admin';

  // Backend orgs (source of truth) merged with the branded picker list.
  // Facilities approved via onboarding appear here automatically.
  const { data: backendOrgs } = usePublicOrganizations();
  const allOrganizations = useMemo(() => {
    const backendOnly = (backendOrgs ?? [])
      .filter(
        (b) => !organizations.some(
          (m) => m.name.toLowerCase() === b.name.toLowerCase()
        )
      )
      .map(
        (b) =>
          ({
            id: b.id,
            name: b.name,
            code: b.code ?? '',
            type: (b.vertical ?? 'office') as FacilityType,
            location: 'Onboarded on FacilityOS',
            logo: '🏢',
            primaryColor: '#3b82f6',
            secondaryColor: '#6366f1',
            welcomeMessage: b.welcome_message ?? `Welcome to ${b.name}`,
            contactEmail: '',
            contactPhone: '',
            verified: true,
            totalServicesCount: 14,
            enabledServiceIds: [],
          }) as Organization
      );
    return [...organizations, ...backendOnly];
  }, [organizations, backendOrgs]);

  const isBackendOnlyOrg = (org: Organization) =>
    !organizations.some((m) => m.id === org.id);

  // Category Configuration Array
  const CATEGORIES: { type: FacilityType; label: string; icon: any; color: string; bg: string }[] = [
    { type: 'university', label: 'Universities & Campus Facilities', icon: GraduationCap, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
    { type: 'hospital', label: 'Hospitals & Healthcare Hubs', icon: Hospital, color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/20' },
    { type: 'apartment', label: 'Apartments & Gated Communities', icon: Home, color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { type: 'office', label: 'Corporate Offices & Workplaces', icon: Building, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { type: 'hostel', label: 'Student Hostels & Co-Living', icon: Bed, color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
    { type: 'school', label: 'Schools & K-12 Institutions', icon: School, color: 'text-violet-500', bg: 'bg-violet-500/10 border-violet-500/20' },
    { type: 'commercial', label: 'Commercial Malls & Shopping Hubs', icon: Building2, color: 'text-cyan-500', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  ];

  const filteredOrgs = allOrganizations.filter((org) => {
    const matchesType = selectedType === 'all' || org.type === selectedType;
    const matchesSearch =
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSelectOrg = (org: Organization) => {
    setActiveOrg(org);
    // Backend-only facilities (onboarded) have no mock detail page — go to login
    if (isBackendOnlyOrg(org)) {
      router.push(`/login?code=${encodeURIComponent(org.code)}`);
    } else {
      router.push(`/organizations/${org.id}`);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = facilityCodeInput.trim().toUpperCase();
    setCodeError('');

    // Real check against the backend first; mock fallback when offline.
    try {
      const resolved = await checkFacilityCode(code);
      const matched = allOrganizations.find(
        (o) => o.name === resolved.name || o.code.toUpperCase() === code
      );
      if (matched) {
        setActiveOrg(matched);
        setCodeModalOpen(false);
        if (isBackendOnlyOrg(matched)) {
          router.push(`/login?code=${encodeURIComponent(code)}`);
        } else {
          router.push(`/organizations/${matched.id}`);
        }
        return;
      }
      setCodeError(`Invalid Facility Code "${code}". Please check with your administrator.`);
      return;
    } catch (err) {
      if (!(err instanceof TypeError)) {
        setCodeError(`Invalid Facility Code "${code}". Please check with your administrator.`);
        return;
      }
      // backend offline → legacy mock matching
    }

    const matched = allOrganizations.find((o) => o.code.toUpperCase() === code);
    if (matched) {
      setActiveOrg(matched);
      setCodeModalOpen(false);
      router.push(`/organizations/${matched.id}`);
    } else {
      setCodeError(`Invalid Facility Code "${code}". Please check with your administrator.`);
    }
  };

  return (
    <div className="py-4 sm:py-8 px-3.5 sm:px-6 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2">
            <span>Registered Facility Directory</span>
            {isSuperAdmin && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                Super Admin
              </span>
            )}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Browse and access service portals across all registered universities, hospitals, corporate offices, and residential communities.
          </p>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
          {isSuperAdmin ? (
            <button
              onClick={() => setAddFacilityModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Provision Facility</span>
            </button>
          ) : (
            <button
              onClick={() => setRequestOnboardingModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shrink-0"
            >
              <Send className="w-4 h-4 text-blue-500" />
              <span>Request Onboarding</span>
            </button>
          )}

          <button
            onClick={() => setCodeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          >
            <Key className="w-4 h-4 text-amber-500" />
            <span>Enter Code</span>
          </button>

          <button
            onClick={() => setQrModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Pills */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search facility by name, location, or facility code..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
              selectedType === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
            }`}
          >
            All Facilities ({allOrganizations.length})
          </button>

          {CATEGORIES.map((cat) => {
            const count = allOrganizations.filter((o) => o.type === cat.type).length;
            if (count === 0) return null;

            return (
              <button
                key={cat.type}
                onClick={() => setSelectedType(cat.type)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  selectedType === cat.type
                    ? 'bg-blue-600 text-white shadow-md font-extrabold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{cat.label.split('&')[0].trim()}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categorized Facilities Sections */}
      <div className="space-y-10">
        {CATEGORIES.map((catGroup) => {
          const groupOrgs = filteredOrgs.filter((org) => org.type === catGroup.type);
          if (groupOrgs.length === 0) return null;

          const IconComponent = catGroup.icon;

          return (
            <div key={catGroup.type} className="space-y-4">
              {/* Category Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${catGroup.bg} ${catGroup.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{catGroup.label}</span>
                    </h2>
                    <p className="text-[11px] text-slate-400">
                      {groupOrgs.length} facility organization(s) registered
                    </p>
                  </div>
                </div>
              </div>

              {/* Facility Cards Grid for this category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupOrgs.map((org) => (
                  <div
                    key={org.id}
                    onClick={() => handleSelectOrg(org)}
                    className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <span className="text-3xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                          {org.logo}
                        </span>
                        {org.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            <ShieldCheck className="w-3 h-3 text-blue-500" />
                            Verified
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {org.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{org.location}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Wrench className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {org.enabledServiceIds.length} Services
                        </span>
                      </div>
                      <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>View Services</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filteredOrgs.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
              No facilities found matching &quot;{searchQuery}&quot;
            </h3>
            <p className="text-xs text-slate-400">
              Try searching with a different city or institution name, or clear your category filters.
            </p>
          </div>
        )}
      </div>

      {/* Code Modal */}
      {codeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                <span>Enter Facility Access Code</span>
              </h3>
              <button
                onClick={() => setCodeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Facility Code
                </label>
                <input
                  type="text"
                  value={facilityCodeInput}
                  onChange={(e) => setFacilityCodeInput(e.target.value)}
                  placeholder="e.g. WOXSEN-2026"
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold uppercase text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {codeError && <p className="text-xs text-rose-500 font-bold">{codeError}</p>}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md"
              >
                Access Facility Portal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {qrModalOpen && (
        <QRScannerModal
          onClose={() => setQrModalOpen(false)}
          onScan={(scannedCode) => {
            setQrModalOpen(false);
            const matched = organizations.find((o) => o.code.toUpperCase() === scannedCode.toUpperCase());
            if (matched) {
              setActiveOrg(matched);
              router.push(`/organizations/${matched.id}`);
            }
          }}
        />
      )}

      {/* Provision Facility Modal */}
      {addFacilityModalOpen && (
        <AddFacilityModal onClose={() => setAddFacilityModalOpen(false)} />
      )}

      {/* Request Onboarding Modal */}
      {requestOnboardingModalOpen && (
        <RequestFacilityOnboardingModal onClose={() => setRequestOnboardingModalOpen(false)} />
      )}
    </div>
  );
}

export default function SelectOrganizationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading facilities...</div>}>
      <SelectOrganizationContent />
    </Suspense>
  );
}
