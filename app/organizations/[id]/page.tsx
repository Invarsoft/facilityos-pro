'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { ALL_SERVICE_CATEGORIES } from '@/lib/mockData';
import {
  ShieldCheck,
  MapPin,
  Wrench,
  ArrowRight,
  LogIn,
  PlusCircle,
  Clock,
  Droplets,
  Zap,
  Hammer,
  Wind,
  Building,
  Armchair,
  Wifi,
  Monitor,
  Bed,
  Bus,
  ShieldAlert,
  Waves,
  ArrowUpDown,
  Settings,
  X,
  CheckCircle2,
  Plus,
  Minus,
  Bot,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Droplets,
  Zap,
  Hammer,
  Bot,
  Wind,
  Building,
  Armchair,
  Wifi,
  Monitor,
  Bed,
  Bus,
  ShieldAlert,
  Waves,
  ArrowUpDown,
};

export default function OrganizationServicesPage() {
  const params = useParams();
  const router = useRouter();
  const { organizations, setActiveOrg, activeRole, toggleOrgService } = useApp();

  const orgId = params.id as string;
  const org = organizations.find((o) => o.id === orgId) || organizations[0];
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const isAdmin = activeRole === 'admin' || activeRole === 'org_admin' || activeRole === 'super_admin';

  // Dynamically filter services enabled for this org
  const enabledServices = ALL_SERVICE_CATEGORIES.filter((cat) =>
    org.enabledServiceIds.includes(cat.id)
  );

  const handleProceedToLogin = () => {
    setActiveOrg(org);
    router.push(`/login`);
  };

  const handleDirectRequest = (serviceId: string) => {
    setActiveOrg(org);
    router.push(`/login?serviceId=${serviceId}`);
  };

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Organization Header Banner */}
      <div
        className="p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{
          background: `linear-gradient(135deg, ${org.primaryColor} 0%, #0f172a 100%)`,
        }}
      >
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-3">
            <span className="text-4xl p-2 rounded-2xl bg-white/10 backdrop-blur-md">{org.logo}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black">{org.name}</h1>
                {org.verified && <ShieldCheck className="w-5 h-5 text-blue-400" />}
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{org.location}</span>
                <span className="mx-1">•</span>
                <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-white/20">
                  {org.type}
                </span>
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-200 max-w-xl italic">{org.welcomeMessage}</p>
        </div>

        <div className="z-10 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {isAdmin && (
            <button
              onClick={() => setConfigModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs backdrop-blur-md shadow-lg transition-all"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>⚙️ Configure Services (Add/Remove)</span>
            </button>
          )}

          <button
            onClick={handleProceedToLogin}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 font-extrabold text-xs hover:bg-slate-100 shadow-xl transition-all"
          >
            <LogIn className="w-4 h-4 text-blue-600" />
            <span>Sign In to {org.name}</span>
          </button>
        </div>
      </div>

      {/* Services Title Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-500" />
            <span>Active Services at {org.name}</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              {enabledServices.length} Active Services
            </span>
            {isAdmin && (
              <button
                onClick={() => setConfigModalOpen(true)}
                className="text-xs font-extrabold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>+ Add / Remove Services</span>
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Services configured and maintained by {org.name} Facility Management Team.
        </p>
      </div>

      {/* Dynamic Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enabledServices.map((cat) => {
          const IconComponent = ICON_MAP[cat.iconName] || Wrench;

          return (
            <div
              key={cat.id}
              onClick={() => handleDirectRequest(cat.id)}
              className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>~{cat.estimatedHours}h SLA</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Raise {cat.name} Request</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Service Configuration Modal (Add/Remove Services for Org) */}
      {configModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  <span>Configure Services for {org.name}</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  Click any service below to Add (+) or Remove (-) it from this organization&apos;s active portal in real-time.
                </p>
              </div>
              <button
                onClick={() => setConfigModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                <span>All Available Service Categories ({ALL_SERVICE_CATEGORIES.length})</span>
                <span className="text-blue-600 dark:text-blue-400 font-bold">{org.enabledServiceIds.length} Currently Active</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ALL_SERVICE_CATEGORIES.map((cat) => {
                  const isEnabled = org.enabledServiceIds.includes(cat.id);

                  return (
                    <div
                      key={cat.id}
                      onClick={() => toggleOrgService(org.id, cat.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isEnabled
                          ? 'border-emerald-500/80 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="space-y-0.5 pr-2">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-extrabold">{cat.name}</h4>
                          {isEnabled ? (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300">
                              Active
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-500">
                              Disabled
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">{cat.description}</p>
                      </div>

                      <button
                        type="button"
                        className={`p-2 rounded-xl text-xs font-extrabold shrink-0 flex items-center gap-1 transition-all ${
                          isEnabled
                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-xs'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {isEnabled ? (
                          <>
                            <Minus className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-end">
              <button
                onClick={() => setConfigModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md"
              >
                Done / Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
