'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { UserProfile } from '@/lib/types';
import { ShieldCheck, LogIn, Lock, Mail, Key, CheckCircle2, Fingerprint } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledService = searchParams.get('serviceId');

  const { activeOrg, users, login } = useApp();

  const [authMode, setAuthMode] = useState<'email' | 'token'>('email');

  const domain = activeOrg.contactEmail ? activeOrg.contactEmail.split('@')[1] : 'facilityos.io';
  const prefix = activeOrg.code ? activeOrg.code.split('-')[0] : 'FACILITY';

  const requesterLabel =
    activeOrg.type === 'university'
      ? 'Student / Resident'
      : activeOrg.type === 'apartment'
      ? 'Resident / Owner'
      : activeOrg.type === 'hospital'
      ? 'Doctor / Staff'
      : activeOrg.type === 'school'
      ? 'Teacher / Parent'
      : 'Employee / Staff';

  const requesterEmail =
    activeOrg.id === 'woxsen-university'
      ? 'student@university.edu'
      : activeOrg.id === 'green-valley'
      ? 'resident@greenvalley.com'
      : activeOrg.id === 'invartech-solutions'
      ? 'employee@company.com'
      : `care@${domain}`;

  const workerEmail =
    activeOrg.id === 'woxsen-university'
      ? 'ravi.kumar@woxsen.edu.in'
      : activeOrg.id === 'green-valley'
      ? 'karthik@greenvalley.org'
      : activeOrg.id === 'invartech-solutions'
      ? 'amit.verma@invartech.com'
      : `technician@${domain}`;

  const managerEmail =
    activeOrg.id === 'woxsen-university'
      ? 'warden.hostela@woxsen.edu.in'
      : activeOrg.id === 'green-valley'
      ? 'manager@greenvalley.org'
      : activeOrg.id === 'invartech-solutions'
      ? 'facilities@invartech.com'
      : `manager@${domain}`;

  const orgAdminEmail = `admin@${domain}`;

  const demoTokenPresets = [
    {
      label: requesterLabel,
      token: `${prefix}-8849-T`,
      pin: '2026',
      role: activeOrg.type === 'university' ? 'student' : activeOrg.type === 'apartment' ? 'resident' : 'employee',
      email: requesterEmail,
    },
    {
      label: 'Technician / Field Worker',
      token: `${prefix}-WRK-10`,
      pin: '5050',
      role: 'worker',
      email: workerEmail,
    },
    {
      label: activeOrg.type === 'university' ? 'Hostel Warden / Manager' : 'Operations Manager',
      token: `${prefix}-MGR-20`,
      pin: '3030',
      role: activeOrg.type === 'university' ? 'warden' : 'manager',
      email: managerEmail,
    },
    {
      label: `${activeOrg.name} Admin (Organization Managed)`,
      token: `${prefix}-ORG-ADM`,
      pin: '1010',
      role: 'org_admin',
      email: orgAdminEmail,
    },
    {
      label: 'FacilityOS System Super Admin (Platform Control)',
      token: 'FOS-SUPER-01',
      pin: '9999',
      role: 'super_admin',
      email: 'superadmin@facilityos.io',
    },
  ];

  // Email form state
  const [emailInput, setEmailInput] = useState(requesterEmail);
  const [password, setPassword] = useState('••••••••');

  // Token & PIN form state
  const [tokenInput, setTokenInput] = useState(`${prefix}-8849-T`);
  const [pinInput, setPinInput] = useState('2026');

  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    setEmailInput(requesterEmail);
    setTokenInput(`${prefix}-8849-T`);
  }, [activeOrg.id]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setErrorMsg('');

    setTimeout(() => {
      let matchedUser = users.find(
        (u) =>
          u.orgId === activeOrg.id &&
          (authMode === 'email'
            ? u.email.toLowerCase() === emailInput.trim().toLowerCase()
            : u.accessTokenNo?.toUpperCase() === tokenInput.trim().toUpperCase())
      );

      if (!matchedUser) {
        matchedUser = users.find(
          (u) =>
            authMode === 'email'
              ? u.email.toLowerCase() === emailInput.trim().toLowerCase()
              : u.accessTokenNo?.toUpperCase() === tokenInput.trim().toUpperCase()
        );
      }

      if (!matchedUser) {
        const isSuper = emailInput.includes('superadmin') || tokenInput.includes('SUPER');
        const isOrgAdmin = emailInput.includes('admin') || tokenInput.includes('ADM');

        const role = isSuper
          ? 'super_admin'
          : isOrgAdmin
          ? 'org_admin'
          : emailInput.includes('worker') || emailInput.includes('tech')
          ? 'worker'
          : emailInput.includes('warden') || emailInput.includes('mgr') || emailInput.includes('manager')
          ? 'manager'
          : activeOrg.type === 'university'
          ? 'student'
          : activeOrg.type === 'apartment'
          ? 'resident'
          : 'employee';

        matchedUser = {
          id: `user-${activeOrg.id}-${Date.now()}`,
          orgId: activeOrg.id,
          name: isSuper ? 'FacilityOS System Super Admin' : `${activeOrg.name} Admin`,
          email: emailInput,
          phone: activeOrg.contactPhone || '+91 99000 11223',
          role: role as any,
          avatar: isSuper
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          department: isSuper ? 'FacilityOS Core Engineering' : `${activeOrg.name} Executive Office`,
          accessTokenNo: tokenInput,
          accessPin: pinInput,
        };
      }

      login(matchedUser);

      if (matchedUser.role === 'worker') {
        router.push('/worker');
      } else if (matchedUser.role === 'warden' || matchedUser.role === 'manager') {
        router.push('/manager');
      } else if (matchedUser.role === 'org_admin' || matchedUser.role === 'admin' || matchedUser.role === 'super_admin') {
        router.push('/admin');
      } else {
        router.push(prefilledService ? `/requests/new?serviceId=${prefilledService}` : '/dashboard');
      }
    }, 600);
  };

  return (
    <div className="py-8 px-4 max-w-md mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Card */}
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white mx-auto flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/30">
          {activeOrg.logo}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Authorised Facility Sign In</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Sign in to access services for <strong className="text-blue-600 dark:text-blue-400">{activeOrg.name}</strong>
          </p>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="p-1 rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center gap-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setAuthMode('email');
            setErrorMsg('');
          }}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            authMode === 'email'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Authorised Email</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setAuthMode('token');
            setErrorMsg('');
          }}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
            authMode === 'token'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Key className="w-4 h-4 text-amber-500" />
          <span>Access Token & PIN</span>
        </button>
      </div>

      {/* Login Form */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
        <form onSubmit={handleLogin} className="space-y-4">
          {authMode === 'email' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {activeOrg.type === 'university'
                    ? 'Campus Authorized Email'
                    : activeOrg.type === 'apartment'
                    ? 'Registered Email / Resident ID'
                    : 'Corporate Work Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={`e.g. care@${domain}`}
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Password</label>
                  <a href="#" className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  FacilityOS Access Token No.
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder={`e.g. ${prefix}-8849-T`}
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold tracking-wider text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Secret Security PIN (4-Digits)
                </label>
                <div className="relative">
                  <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="e.g. 2026"
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs font-mono text-center font-bold tracking-widest text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Remember session</span>
            </label>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Auto Role Detection
            </span>
          </div>

          {errorMsg && <p className="text-xs text-rose-500 font-bold">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all"
          >
            {loggingIn ? (
              <span>Authenticating Credentials...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Verify Credentials & Enter Facility</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Sign-in Presets - DYNAMICALLY GENERATED FOR ACTIVE FACILITY */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {activeOrg.name} Demo Credentials:
          </p>
          <div className="space-y-1.5">
            {demoTokenPresets.map((acc) => (
              <button
                key={acc.token}
                type="button"
                onClick={() => {
                  setEmailInput(acc.email);
                  setTokenInput(acc.token);
                  setPinInput(acc.pin);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl border text-xs text-left transition-colors ${
                  (authMode === 'email' ? emailInput === acc.email : tokenInput === acc.token)
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-200 block text-[11px]">
                    {acc.label}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {authMode === 'email' ? acc.email : `Token: ${acc.token} | PIN: ${acc.pin}`}
                  </span>
                </div>
                {(authMode === 'email' ? emailInput === acc.email : tokenInput === acc.token) && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading sign in page...</div>}>
      <LoginContent />
    </Suspense>
  );
}
