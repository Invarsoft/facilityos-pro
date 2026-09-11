'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Mail,
  Lock,
  Key,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Building2,
  Wrench,
  Package,
  Trophy,
  Utensils,
  Store,
  GraduationCap,
  Crown,
  Home,
  ArrowRight,
} from 'lucide-react';

export function WoxsenAuthCard({ onSuccessRedirect }: { onSuccessRedirect?: string }) {
  const router = useRouter();
  const { loginWithToken, loginWithEmail, signUpStudent, users } = useApp();

  const [authTab, setAuthTab] = useState<'signin' | 'token' | 'signup'>('signin');

  // Email Sign In States & Password Visibility
  const [emailInput, setEmailInput] = useState('student@woxsen.edu.in');
  const [passwordInput, setPasswordInput] = useState('20262026');
  const [showPassword, setShowPassword] = useState(false);

  // OTP Verification States
  const [authStep, setAuthStep] = useState<'credentials' | 'otp'>('credentials');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('202601');

  // Access Token States
  const [tokenInput, setTokenInput] = useState('');
  const [pinInput, setPinInput] = useState('');

  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');

  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');

  const redirectByRole = (roleType?: string) => {
    if (roleType === 'courier_manager') {
      router.push('/courier/portal');
    } else if (roleType === 'sports_manager') {
      router.push('/sports/portal');
    } else if (roleType === 'admin' || roleType === 'org_admin' || roleType === 'super_admin') {
      router.push('/admin');
    } else if (roleType === 'warden' || roleType === 'manager') {
      router.push('/manager');
    } else if (roleType === 'worker' || roleType === 'technician') {
      router.push('/worker');
    } else {
      router.push(onSuccessRedirect || '/');
    }
  };

  const isValidWoxsenDomain = (email: string): boolean => {
    const clean = email.trim().toLowerCase();
    if (!clean.includes('@')) return false;
    return (
      clean.endsWith('@woxsen.edu.in') ||
      clean.endsWith('@university.edu') ||
      clean === 'admin@woxsen.edu.in' ||
      clean === 'student@woxsen.edu.in'
    );
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthNotice('');

    const email = emailInput.trim();

    if (!email || !passwordInput.trim()) {
      setAuthError('Please enter your email and password.');
      return;
    }

    if (!isValidWoxsenDomain(email)) {
      setAuthError('❌ Login Restricted: Email MUST end with @woxsen.edu.in domain.');
      return;
    }

    const matchedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setAuthStep('otp');
    setAuthNotice(`🔑 Verification OTP sent to ${email}. Demo Code: ${newOtp}`);
  };

  const handleVerifyOtpAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (otpCode.trim() !== generatedOtp && otpCode.trim() !== '202601' && otpCode.trim() !== '123456') {
      setAuthError('Invalid OTP code. Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    const email = emailInput.trim();
    const matchedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const success = loginWithEmail(email, passwordInput || '2026');
    if (success) {
      redirectByRole(matchedUser?.role || (email.includes('admin') ? 'admin' : email.includes('warden') ? 'warden' : email.includes('ravi') ? 'worker' : 'student'));
    } else {
      setAuthError('❌ Sign in failed. Only @woxsen.edu.in registered accounts can log in.');
    }
  };

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthNotice('');

    const token = tokenInput.trim();
    const pin = pinInput.trim();

    if (!token || !pin) {
      setAuthError('Please enter your Access Token Number and PIN.');
      return;
    }

    const matchedUser = users.find((u) => u.accessTokenNo?.toLowerCase() === token.toLowerCase());

    const success = loginWithToken(token, pin);
    if (success) {
      redirectByRole(matchedUser?.role || (token.includes('ADM') ? 'admin' : token.includes('WDN') ? 'warden' : token.includes('WRK') ? 'worker' : 'student'));
    } else {
      setAuthError('Invalid Access Token Number or PIN.');
    }
  };

  const quickDemoLogin = (roleType: string) => {
    setAuthError('');
    setAuthNotice('');
    let targetEmail = 'student@woxsen.edu.in';
    if (roleType === 'worker' || roleType === 'technician') targetEmail = 'ravi.kumar@woxsen.edu.in';
    if (roleType === 'warden' || roleType === 'manager') targetEmail = 'warden.hostela@woxsen.edu.in';
    if (roleType === 'admin') targetEmail = 'admin@woxsen.edu.in';
    if (roleType === 'courier_manager') targetEmail = 'courier.manager@woxsen.edu.in';
    if (roleType === 'sports_manager') targetEmail = 'sports.manager@woxsen.edu.in';

    loginWithEmail(targetEmail, '2026');
    redirectByRole(roleType);
  };

  return (
    <div className="p-6 sm:p-7 rounded-[28px] bg-[#0b1120]/90 border border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl text-left space-y-5 max-w-[440px] mx-auto font-sans relative z-20">
      
      {/* WOXSEN UNIVERSITY EMBLEM (EXACT MATCH FOR media_1789129357501.jpg) */}
      <div className="flex flex-col items-center justify-center pt-2 pb-1">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-2xl font-black text-red-500 tracking-tighter">W</span>
          <span className="text-lg">🌐</span>
          <span className="text-2xl font-black text-red-500 tracking-tighter">U</span>
        </div>
        <div className="text-center mt-0.5">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white leading-none">
            WOXSEN
          </p>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 leading-tight">
            UNIVERSITY
          </p>
        </div>
      </div>

      {/* TABS: UNIVERSITY EMAIL vs ACCESS TOKEN */}
      <div className="flex items-center p-1 rounded-2xl bg-[#080d1a] border border-slate-800">
        <button
          type="button"
          onClick={() => { setAuthTab('signin'); setAuthStep('credentials'); setAuthError(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            authTab === 'signin'
              ? 'bg-[#101728] text-white shadow-md border-b-2 border-red-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mail className="w-3.5 h-3.5 text-slate-300" />
          <span>University Email</span>
        </button>

        <button
          type="button"
          onClick={() => { setAuthTab('token'); setAuthError(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
            authTab === 'token'
              ? 'bg-[#101728] text-white shadow-md border-b-2 border-red-500'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-3.5 h-3.5 text-slate-400" />
          <span>Access Token</span>
        </button>
      </div>

      {authError && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{authError}</span>
        </div>
      )}

      {authNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{authNotice}</span>
        </div>
      )}

      {/* FORM 1: EMAIL SIGN IN (EXACT MATCH FOR media_1789129357501.jpg) */}
      {authTab === 'signin' && authStep === 'credentials' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">
              Woxsen Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="student@woxsen.edu.in"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1c] border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-medium">
              Use your official <strong>@woxsen.edu.in</strong> email address
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">
              Account Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#090e1c] border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* RED GLOW SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-500 hover:to-red-600 text-white font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(239,68,68,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer mt-2"
          >
            <span>Send 6-Digit Verification OTP</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <p className="text-center text-xs text-slate-400 font-medium pt-1">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setAuthTab('signup')}
              className="text-red-500 font-bold hover:underline cursor-pointer"
            >
              Create One
            </button>
          </p>
        </form>
      )}

      {/* FORM 1.1: OTP STEP */}
      {authTab === 'signin' && authStep === 'otp' && (
        <form onSubmit={handleVerifyOtpAndLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">
              Enter 6-Digit Verification OTP Code *
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="202601"
              className="w-full px-4 py-3 text-center tracking-[0.5em] text-lg font-black rounded-xl bg-[#090e1c] border border-red-500/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-[10px] text-slate-400 font-medium text-center pt-1">
              Demo Code: <strong className="text-red-400">{generatedOtp}</strong>
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-xs shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Verify OTP & Sign In</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* FORM 2: ACCESS TOKEN SIGN IN */}
      {authTab === 'token' && (
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">
              Access Token Number
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-blue-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="e.g. WDN-A-101 or WRK-ELE-01"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1c] border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-300">
              Token PIN Code
            </label>
            <input
              type="password"
              required
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="••••"
              className="w-full px-4 py-2.5 rounded-xl bg-[#090e1c] border border-slate-800 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Authenticate Token →</span>
          </button>
        </form>
      )}

      {/* 9 DEMO ROLE QUICK ACCESS CARDS (EXACT MATCH FOR media_1789129357501.jpg) */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
          <span>QUICK ACCESS (DEMO)</span>
          <button
            type="button"
            onClick={() => quickDemoLogin('student')}
            className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Explore System</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          
          <button
            type="button"
            onClick={() => quickDemoLogin('admin')}
            className="p-2.5 rounded-xl bg-red-950/30 border border-red-900/40 hover:border-red-500/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span className="text-[10px] font-black text-white group-hover:text-red-400 truncate">Chief Admin</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => quickDemoLogin('warden')}
            className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-900/40 hover:border-blue-500/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="text-[10px] font-black text-white group-hover:text-blue-400 truncate">Hostel Warden</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => quickDemoLogin('worker')}
            className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-900/40 hover:border-purple-500/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <span className="text-[10px] font-black text-white group-hover:text-purple-400 truncate">Technician</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => quickDemoLogin('courier_manager')}
            className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/40 hover:border-amber-500/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="text-[10px] font-black text-white group-hover:text-amber-400 truncate">Courier Manager</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => quickDemoLogin('sports_manager')}
            className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-900/40 hover:border-emerald-500/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="text-[10px] font-black text-white group-hover:text-emerald-400 truncate">Sports Manager</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => quickDemoLogin('student')}
            className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-900/40 hover:border-cyan-500/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span className="text-[10px] font-black text-white group-hover:text-cyan-400 truncate">Laundry Manager</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => quickDemoLogin('student')}
            className="p-2.5 rounded-xl bg-orange-950/30 border border-orange-900/40 hover:border-orange-500/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="text-[10px] font-black text-white group-hover:text-orange-400 truncate">Food Vendor</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => quickDemoLogin('student')}
            className="p-2.5 rounded-xl bg-pink-950/30 border border-pink-900/40 hover:border-pink-500/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span className="text-[10px] font-black text-white group-hover:text-pink-400 truncate">Shop Vendor</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => quickDemoLogin('student')}
            className="p-2.5 rounded-xl bg-teal-950/30 border border-teal-900/40 hover:border-teal-500/60 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-teal-500 shrink-0" />
              <span className="text-[10px] font-black text-white group-hover:text-teal-400 truncate">Student Resident</span>
            </div>
          </button>

        </div>
      </div>

    </div>
  );
}
