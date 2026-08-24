'use client';

import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  Mail,
  Phone,
  Key,
} from 'lucide-react';

import { useApp } from '@/lib/context/AppContext';
import {
  useOnboardingRequests,
  useApproveOnboarding,
  useRejectOnboarding,
  type ApprovalCredentials,
  type OnboardingRequest,
} from '@/src/features/onboarding/api';

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
  approved: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
  rejected: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
};

function CredentialCard({ cred }: { cred: ApprovalCredentials }) {
  const [copied, setCopied] = useState('');
  const copy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="p-4 rounded-2xl border-2 border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/30 space-y-3 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
          {cred.org_name} is now live on FacilityOS
        </p>
      </div>
      <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
        ⚠ Shown only once — copy and share with the facility securely
      </p>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 font-semibold">Facility Code</span>
          <button onClick={() => copy('code', cred.facility_code)} className="flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-white">
            {cred.facility_code}
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            {copied === 'code' && <span className="text-[9px] text-emerald-600">copied</span>}
          </button>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 font-semibold">Admin Email</span>
          <button onClick={() => copy('email', cred.admin_email)} className="flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-white">
            {cred.admin_email}
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            {copied === 'email' && <span className="text-[9px] text-emerald-600">copied</span>}
          </button>
        </div>
        <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-slate-500 font-semibold">Admin Password</span>
          <button onClick={() => copy('pw', cred.admin_password)} className="flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-white">
            {cred.admin_password}
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            {copied === 'pw' && <span className="text-[9px] text-emerald-600">copied</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

function RequestCard({ request }: { request: OnboardingRequest }) {
  const approve = useApproveOnboarding();
  const reject = useRejectOnboarding();
  const [credentials, setCredentials] = useState<ApprovalCredentials | null>(null);
  const [actionError, setActionError] = useState('');

  const run = (fn: (id: string) => Promise<unknown>) => {
    setActionError('');
    fn(request.id).catch((err) =>
      setActionError(err instanceof Error ? err.message : 'Action failed'),
    );
  };

  if (credentials) return <CredentialCard cred={credentials} />;

  return (
    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
            <Building2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-900 dark:text-white">{request.org_name}</p>
            <p className="text-[10px] text-slate-400 font-medium capitalize">
              {request.vertical ?? 'facility'} · requested {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <span className={`text-[9px] font-extrabold uppercase px-2 py-1 rounded ${STATUS_STYLES[request.status]}`}>
          {request.status}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        {request.contact_name && <span>Contact: <strong className="text-slate-700 dark:text-slate-300">{request.contact_name}</strong></span>}
        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {request.contact_email}</span>
        {request.contact_phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {request.contact_phone}</span>}
      </div>

      {actionError && <p className="text-[11px] text-rose-500 font-bold">{actionError}</p>}

      {request.status === 'pending' && (
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              approve.mutate(request.id, {
                onSuccess: (cred) => setCredentials(cred),
                onError: (err) => setActionError(err instanceof Error ? err.message : 'Approval failed'),
              });
            }}
            disabled={approve.isPending || reject.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-[11px]"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {approve.isPending ? 'Provisioning...' : 'Approve & Provision'}
          </button>
          <button
            onClick={() => run(reject.mutateAsync)}
            disabled={approve.isPending || reject.isPending}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 disabled:opacity-60 text-rose-600 dark:text-rose-300 font-extrabold text-[11px] border border-rose-200 dark:border-rose-900"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      )}

      {request.status === 'approved' && request.created_facility_code && (
        <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
          <Key className="w-3.5 h-3.5" />
          Facility Code: <span className="font-mono">{request.created_facility_code}</span>
          <span className="text-slate-400 font-medium">· admin: {request.created_admin_email}</span>
        </div>
      )}
    </div>
  );
}

export default function OnboardingRequestsPage() {
  const { activeRole } = useApp();
  const pending = useOnboardingRequests('pending');
  const all = useOnboardingRequests();
  const qc = useQueryClient();

  if (activeRole !== 'super_admin') {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-slate-400 font-bold">Super Admin access only.</p>
      </div>
    );
  }

  const requests = all.data ?? [];
  const pendingCount = pending.data?.length ?? 0;

  return (
    <div className="py-4 sm:py-8 px-3.5 sm:px-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Facility Onboarding Queue
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Review facilities requesting FacilityOS. Approving provisions a full tenant — org, admin account, SLA rules, and facility code.
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-extrabold">
          <Clock className="w-4 h-4" />
          {pendingCount} pending
        </span>
      </div>

      {all.isLoading ? (
        <div className="py-16 text-center text-xs text-slate-400 font-bold">Loading requests...</div>
      ) : requests.length === 0 ? (
        <div className="py-16 text-center space-y-2">
          <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="text-sm text-slate-400 font-bold">No onboarding requests yet</p>
          <p className="text-xs text-slate-400">Facilities can request onboarding from the home page.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </div>
      )}
    </div>
  );
}
