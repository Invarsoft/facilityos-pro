'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Mail,
  Lock,
  Key,
  UserPlus,
  AlertCircle,
  ChevronRight,
  UserCheck,
} from 'lucide-react';

export function WoxsenAuthCard({ onSuccessRedirect }: { onSuccessRedirect?: string }) {
  const router = useRouter();
  const { loginWithToken, loginWithEmail, signUpStudent } = useApp();

  const [authTab, setAuthTab] = useState<'signin' | 'token' | 'signup'>('signin');

  // Email Sign In States
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Access Token States
  const [tokenInput, setTokenInput] = useState('');
  const [pinInput, setPinInput] = useState('');

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRoom, setSignUpRoom] = useState('');

  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthNotice('');

    const email = emailInput.trim() || 'student@university.edu';
    const pass = passwordInput.trim() || '2026';

    const success = loginWithEmail(email, pass);
    if (success) {
      if (onSuccessRedirect) {
        router.push(onSuccessRedirect);
      }
    } else {
      setAuthError('Invalid email address or password.');
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthNotice('');

    const token = tokenInput.trim() || 'WOXSEN-8849-T';
    const pin = pinInput.trim() || '2026';

    const success = loginWithToken(token, pin);
    if (success) {
      if (onSuccessRedirect) {
        router.push(onSuccessRedirect);
      }
    } else {
      setAuthError('Invalid Access Token or PIN. Use WOXSEN-8849-T & 2026 for demo.');
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!signUpName.trim() || !signUpEmail.trim()) {
      setAuthError('Please enter your full name and Woxsen email.');
      return;
    }

    signUpStudent(signUpName, signUpEmail, signUpRoom);
    setAuthNotice('Welcome to Woxsen Portal! Account created as Student.');
    if (onSuccessRedirect) {
      router.push(onSuccessRedirect);
    }
  };

  const quickDemoLogin = (roleType: 'student' | 'worker' | 'warden' | 'admin') => {
    setAuthError('');
    setAuthNotice('');
    if (roleType === 'student') {
      loginWithEmail('student@university.edu', 'Student@123');
    } else if (roleType === 'worker') {
      loginWithEmail('ravi.kumar@woxsen.edu.in', 'Worker@123');
    } else if (roleType === 'warden') {
      loginWithEmail('warden.hostela@woxsen.edu.in', 'Manager@123');
    } else if (roleType === 'admin') {
      loginWithEmail('admin@woxsen.edu.in', 'Admin@123');
    }

    if (onSuccessRedirect) {
      router.push(onSuccessRedirect);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-w-xl mx-auto">
      {/* Official Woxsen University Logo Header */}
      <div className="flex items-center justify-center pt-1 pb-2">
        <img
          src="/woxsen-logo.jpg"
          alt="Woxsen University Logo"
          className="h-12 w-auto object-contain dark:invert transition-all"
        />
      </div>

      {/* Primary Side-by-Side Tabs: Sign In vs Access Token */}
      <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
        <button
          onClick={() => { setAuthTab('signin'); setAuthError(''); }}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            authTab === 'signin' || authTab === 'signup'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Sign In</span>
        </button>

        <button
          onClick={() => { setAuthTab('token'); setAuthError(''); }}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            authTab === 'token'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Access Token</span>
        </button>
      </div>

      {authError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{authError}</span>
        </div>
      )}

      {/* FORM 1: EMAIL SIGN IN */}
      {authTab === 'signin' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Woxsen Email Address (Role Auto-Detected)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. student@university.edu or warden.hostela@woxsen.edu.in"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Sign In to Woxsen Portal</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Under Sign In: Create Account Link */}
          <div className="pt-2 text-center text-xs">
            <span className="text-slate-500">Don't have an account? </span>
            <button
              type="button"
              onClick={() => { setAuthTab('signup'); setAuthError(''); }}
              className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Create One (Sign Up)
            </button>
          </div>
        </form>
      )}

      {/* FORM 2: TEMPORARY ACCESS TOKEN */}
      {authTab === 'token' && (
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Woxsen Student Access Token
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="e.g. WOXSEN-8849-T"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Access Security PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="e.g. 2026"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-blue-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Authenticate via Access Token</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Under Token: Sign In Link */}
          <div className="pt-2 text-center text-xs">
            <span className="text-slate-500">Have an email account? </span>
            <button
              type="button"
              onClick={() => { setAuthTab('signin'); setAuthError(''); }}
              className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign In with Email
            </button>
          </div>
        </form>
      )}

      {/* FORM 3: SIGN UP */}
      {authTab === 'signup' && (
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
            🎓 <strong>Student Registration Notice:</strong> New accounts are registered directly into the Student Portal. Woxsen Admin can upgrade your role to Staff or Worker in User Management.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              placeholder="e.g. S. Bharat Reddy"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Woxsen Email Address
            </label>
            <input
              type="email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              placeholder="e.g. bharat.reddy@woxsen.edu.in"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Hostel Block & Room # (Optional)
            </label>
            <input
              type="text"
              value={signUpRoom}
              onChange={(e) => setSignUpRoom(e.target.value)}
              placeholder="e.g. Hostel A - Room 204"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-lg shadow-emerald-500/25 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up & Open Student Portal</span>
          </button>

          {/* Under Sign Up: Already have account link */}
          <div className="pt-2 text-center text-xs">
            <span className="text-slate-500">Already have an account? </span>
            <button
              type="button"
              onClick={() => { setAuthTab('signin'); setAuthError(''); }}
              className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Sign In
            </button>
          </div>
        </form>
      )}

      {/* Quick Demo Authenticate Chips */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
          1-Tap Demo Role Auto-Detect Preset Chips
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            onClick={() => quickDemoLogin('student')}
            className="p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-700 dark:text-blue-300 text-xs font-extrabold transition-all text-center flex flex-col items-center gap-1"
          >
            <span>🎓 Student</span>
            <span className="text-[10px] text-slate-500 font-normal">Aarav Sharma</span>
          </button>

          <button
            onClick={() => quickDemoLogin('worker')}
            className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-extrabold transition-all text-center flex flex-col items-center gap-1"
          >
            <span>🛠️ Technician</span>
            <span className="text-[10px] text-slate-500 font-normal">Ravi Kumar</span>
          </button>

          <button
            onClick={() => quickDemoLogin('warden')}
            className="p-3 rounded-2xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-700 dark:text-violet-300 text-xs font-extrabold transition-all text-center flex flex-col items-center gap-1"
          >
            <span>🏛️ Warden</span>
            <span className="text-[10px] text-slate-500 font-normal">Dr. Rajesh Verma</span>
          </button>

          <button
            onClick={() => quickDemoLogin('admin')}
            className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold transition-all text-center flex flex-col items-center gap-1"
          >
            <span>👔 Woxsen Admin</span>
            <span className="text-[10px] text-slate-500 font-normal">Ananya Reddy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
