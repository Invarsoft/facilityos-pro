'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  GraduationCap,
  Bed,
  Building,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  FileText,
  Clock,
  CheckCircle2,
  Lock,
  Key,
  Mail,
  UserCheck,
  UserPlus,
  AlertCircle,
  ChevronRight,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function WoxsenCampusPortalPage() {
  const router = useRouter();
  const {
    activeOrg,
    tickets,
    activeRole,
    currentUser,
    isAuthenticated,
    loginWithToken,
    loginWithEmail,
    signUpStudent,
    logout,
  } = useApp();

  const [authTab, setAuthTab] = useState<'token' | 'email' | 'signup'>('token');
  const [tokenInput, setTokenInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Sign Up Form States
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpRoom, setSignUpRoom] = useState('');

  const [authError, setAuthError] = useState('');
  const [authNotice, setAuthNotice] = useState('');

  const activeTicketsCount = tickets.filter((t) => t.status !== 'closed' && t.status !== 'resolved').length;
  const awaitingCount = tickets.filter((t) => t.status === 'awaiting_verification').length;

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthNotice('');

    const token = tokenInput.trim() || 'WOXSEN-8849-T';
    const pin = pinInput.trim() || '2026';

    const success = loginWithToken(token, pin);
    if (!success) {
      setAuthError('Invalid Access Token or PIN. Use WOXSEN-8849-T & 2026 for demo.');
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthNotice('');

    const email = emailInput.trim() || 'student@university.edu';
    const pass = passwordInput.trim() || '2026';

    const success = loginWithEmail(email, pass);
    if (!success) {
      setAuthError('Invalid email address or password.');
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
    setAuthNotice('Welcome to Woxsen Portal! Registered as Student. Woxsen Admin can upgrade your role to Staff in User Management.');
  };

  const quickDemoLogin = (roleType: 'student' | 'worker' | 'warden' | 'admin') => {
    setAuthError('');
    setAuthNotice('');
    if (roleType === 'student') {
      loginWithToken('WOXSEN-8849-T', '2026');
    } else if (roleType === 'worker') {
      loginWithEmail('ravi.kumar@woxsen.edu.in', 'Worker@123');
    } else if (roleType === 'warden') {
      loginWithEmail('warden.hostela@woxsen.edu.in', 'Manager@123');
    } else if (roleType === 'admin') {
      loginWithEmail('admin@facilityos.io', 'Admin@123');
    }
  };

  const woxsenCampusBlocks = [
    {
      id: 'hostel-a',
      title: 'Hostel A (Boys Residence)',
      subtitle: 'Rooms 101 to 450, Common Mess, Laundry Hub & Study Lounges.',
      icon: Bed,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/30',
      activeJobs: 1,
    },
    {
      id: 'hostel-b',
      title: 'Hostel B (Girls Residence)',
      subtitle: 'Rooms 101 to 450, Visitor Lounge, Pantry & Recreation Area.',
      icon: Bed,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/30',
      activeJobs: 1,
    },
    {
      id: 'academic-1',
      title: 'Academic Block 1 & 2',
      subtitle: 'Lecture Theatres, Central Library, Faculty Cabins & Seminar Halls.',
      icon: GraduationCap,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10 border-indigo-500/30',
      activeJobs: 0,
    },
    {
      id: 'aiml-labs',
      title: 'Science & AI/ML Labs',
      subtitle: 'High-Performance GPU Server Room, Robotics Lab & Analytics Bay.',
      icon: Building,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10 border-violet-500/30',
      activeJobs: 0,
    },
    {
      id: 'sports-complex',
      title: 'Sports Complex & Amenities',
      subtitle: 'Indoor Gymnasium, Swimming Pool, Tennis Courts & Cafeteria.',
      icon: ShieldCheck,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      activeJobs: 0,
    },
    {
      id: 'admin-block',
      title: 'Administrative Block',
      subtitle: 'Executive Office, Dean Office, Student Affairs & Accounts Desk.',
      icon: ShieldCheck,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10 border-teal-500/30',
      activeJobs: 0,
    },
  ];

  // =======================================================================
  // VIEW 1: UNAUTHENTICATED VIEW (LOGIN & ACCESS TOKEN WALL)
  // =======================================================================
  if (!isAuthenticated) {
    return (
      <div className="py-6 sm:py-12 px-3.5 sm:px-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Woxsen Brand Banner */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">
            <span>🎓</span>
            <span>Woxsen University Campus Portal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Woxsen Facility Services Sign In
          </h1>

          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto font-medium">
            Sign in with your Temporary Access Token or Email to access Woxsen campus maintenance services. Role is automatically detected on sign in.
          </p>
        </div>

        {/* Auth Gateway Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          {/* Auth Tab Selector (3 Tabs) */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
            <button
              onClick={() => { setAuthTab('token'); setAuthError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                authTab === 'token'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>Temporary Access Token</span>
            </button>

            <button
              onClick={() => { setAuthTab('email'); setAuthError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                authTab === 'email'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email Login</span>
            </button>

            <button
              onClick={() => { setAuthTab('signup'); setAuthError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                authTab === 'signup'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          </div>

          {authError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* TAB 1: TEMPORARY ACCESS TOKEN LOGIN */}
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
                <span>Authenticate & Access Campus Services</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: EMAIL LOGIN (AUTO-DETECTS ROLE: STUDENT / WORKER / WARDEN / ADMIN) */}
          {authTab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address (Role Auto-Detected)
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
                <span>Sign In (Auto-Detect Role)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: SIGN UP (LOGS IN AS STUDENT FIRST; ADMIN CAN CHANGE TO STAFF/WORKER) */}
          {authTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
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
                <span>🎓 Student Demo</span>
                <span className="text-[10px] text-slate-500 font-normal">Token: WOXSEN-8849-T</span>
              </button>

              <button
                onClick={() => quickDemoLogin('worker')}
                className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-extrabold transition-all text-center flex flex-col items-center gap-1"
              >
                <span>🛠️ Technician</span>
                <span className="text-[10px] text-slate-500 font-normal">Ravi Kumar (Plumbing)</span>
              </button>

              <button
                onClick={() => quickDemoLogin('warden')}
                className="p-3 rounded-2xl bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-700 dark:text-violet-300 text-xs font-extrabold transition-all text-center flex flex-col items-center gap-1"
              >
                <span>🏛️ Hostel Warden</span>
                <span className="text-[10px] text-slate-500 font-normal">Dr. Rajesh Verma</span>
              </button>

              <button
                onClick={() => quickDemoLogin('admin')}
                className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold transition-all text-center flex flex-col items-center gap-1"
              >
                <span>👔 Chief Admin</span>
                <span className="text-[10px] text-slate-500 font-normal">Ananya Reddy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security Lock Notice */}
        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-slate-400" />
          <span>Woxsen campus infrastructure and service request wizards are protected until authenticated.</span>
        </div>
      </div>
    );
  }

  // =======================================================================
  // VIEW 2: AUTHENTICATED VIEW (WOXSEN SERVICES DASHBOARD)
  // =======================================================================
  return (
    <div className="py-4 sm:py-8 px-3.5 sm:px-6 max-w-6xl mx-auto space-y-8 sm:space-y-10 animate-in fade-in duration-300">
      {authNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{authNotice}</span>
          </div>
          <button onClick={() => setAuthNotice('')} className="text-xs font-extrabold underline">Dismiss</button>
        </div>
      )}

      {/* Authenticated Brand Hero Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-extrabold uppercase tracking-wider">
              <span>🎓</span>
              <span>Woxsen University Campus Portal</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Role ({activeRole.toUpperCase()}): {currentUser?.name || 'Woxsen User'}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Woxsen Campus Operations & Maintenance System
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Welcome back, {currentUser?.name}. Report hostel issues, track room repairs, verify technician resolution via OTP, and monitor campus SLA compliance 24/7.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 w-full md:w-auto shrink-0">
          <Link
            href="/requests/new"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Raise New Request</span>
          </Link>

          <Link
            href="/my-requests"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all active:scale-95"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Track Requests ({tickets.length})</span>
          </Link>
        </div>
      </div>

      {/* Real-time Status Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Filed</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{tickets.length}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Jobs</span>
            <p className="text-2xl font-black text-amber-500 mt-0.5">{activeTicketsCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Awaiting OTP</span>
            <p className="text-2xl font-black text-yellow-500 mt-0.5">{awaitingCount}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Campus Status</span>
            <p className="text-xs font-black text-emerald-500 mt-1">100% Operational</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Woxsen Campus Infrastructure Blocks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-500" />
            <span>Woxsen Campus Infrastructure & Services</span>
          </h2>
          <span className="text-xs font-semibold text-slate-400">6 Campus Sectors</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {woxsenCampusBlocks.map((block) => {
            const Icon = block.icon;
            return (
              <div
                key={block.id}
                onClick={() => router.push(`/requests/new?building=${encodeURIComponent(block.title)}`)}
                className={`group p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl ${block.bg} ${block.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {block.activeJobs > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                        {block.activeJobs} Active Repair
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {block.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-medium">
                      {block.subtitle}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                  <span>Report Maintenance Issue</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
