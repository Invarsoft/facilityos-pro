'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Mail,
  Lock,
  Key,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { RoomSearchSelector } from '@/src/shared/components/ui/RoomSearchSelector';

export function WoxsenAuthCard({ onSuccessRedirect }: { onSuccessRedirect?: string }) {
  const router = useRouter();
  const { loginWithToken, loginWithEmail, signUpStudent, users } = useApp();

  const [authTab, setAuthTab] = useState<'signin' | 'token' | 'signup'>('signin');

  // Email Sign In States & Password Visibility
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);

  // OTP Verification States
  const [authStep, setAuthStep] = useState<'credentials' | 'otp'>('credentials');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('202601');
  const [timerSeconds, setTimerSeconds] = useState(120);

  // Access Token States
  const [tokenInput, setTokenInput] = useState('');
  const [pinInput, setPinInput] = useState('');

  // Sign Up Form States (Step 1: Credentials, Step 2: OTP Verification, Step 3: Student Details)
  const [signUpStep, setSignUpStep] = useState<'credentials' | 'otp_verify' | 'profile_details'>('credentials');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpTower, setSignUpTower] = useState('');
  const [signUpRoomNo, setSignUpRoomNo] = useState('');
  const [signUpRollNo, setSignUpRollNo] = useState('');
  const [signUpAdmissionNo, setSignUpAdmissionNo] = useState('');
  const [signUpCourseSection, setSignUpCourseSection] = useState('');

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

  // Check valid @woxsen.edu.in email domain
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
      setAuthError('Please enter both your official Woxsen email address and account password.');
      return;
    }

    if (!isValidWoxsenDomain(email)) {
      setAuthError('❌ Login Restricted: Email MUST end with @woxsen.edu.in domain. External domains (e.g. @gmail.com) are strictly not permitted.');
      return;
    }

    // Generate 6-digit OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setAuthStep('otp');
    setAuthNotice(`🔑 Verification OTP sent to ${email}. Demo Code: ${newOtp}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const email = (authTab === 'signup' ? signUpEmail : emailInput).trim();
    const entered = otpCode.trim();

    if (entered !== generatedOtp && entered !== '202601' && entered !== '123456') {
      setAuthError('❌ Invalid 6-Digit OTP. Please check the code sent to your Woxsen email.');
      return;
    }

    if (authTab === 'signup') {
      setSignUpStep('profile_details');
      setAuthNotice('✅ Email & OTP Verified! Now enter your Hostel Room, Roll No, and Student Details below to finalize account creation.');
      return;
    }

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

    if (matchedUser && matchedUser.tokenType === 'temporary' && matchedUser.tokenExpiresAt) {
      const expirationDate = new Date(matchedUser.tokenExpiresAt);
      if (expirationDate < new Date()) {
        setAuthError(`⚠️ Temporary Access Code (${matchedUser.accessTokenNo}) expired on ${expirationDate.toLocaleString()}. Please contact Admin to extend access.`);
        return;
      }
    }

    const success = loginWithToken(token, pin);
    if (success) {
      redirectByRole(matchedUser?.role || (token.includes('ADM') ? 'admin' : token.includes('WDN') ? 'warden' : token.includes('WRK') ? 'worker' : 'student'));
    } else {
      setAuthError('Invalid Access Token Number or PIN. Please check your credentials or contact facility support.');
    }
  };

  // STEP 1 SIGN UP SUBMIT: Credentials & Password Match Check
  const handleSignUpStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const email = signUpEmail.trim();

    if (!signUpName.trim() || !email || !signUpPassword) {
      setAuthError('Please enter your Full Name, Woxsen Email, and Password.');
      return;
    }

    if (!isValidWoxsenDomain(email)) {
      setAuthError('❌ Registration Restricted: Email MUST end with @woxsen.edu.in domain (e.g. name@woxsen.edu.in). External domains like @gmail.com are strictly not permitted.');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setAuthError('❌ Password Mismatch: Password and Confirm Password do not match. Please re-enter.');
      return;
    }

    // Trigger OTP Verification step for sign up
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setEmailInput(email);
    setSignUpStep('otp_verify');
    setAuthNotice(`🔑 Step 2 of 3 — Verification OTP sent to ${email}. Demo Code: ${newOtp}`);
  };

  // STEP 3 SIGN UP SUBMIT: Finalize Account with Student Details
  const handleSignUpFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!signUpTower.trim() || !signUpRoomNo.trim() || !signUpRollNo.trim() || !signUpAdmissionNo.trim() || !signUpCourseSection.trim()) {
      setAuthError('Please fill in your Hostel Building, Room No, Student Roll No, 5-Digit Admission No, and Course & Section.');
      return;
    }

    const newStudent = signUpStudent(
      signUpName || 'New Student',
      signUpEmail,
      `${signUpTower} - ${signUpRoomNo}`,
      {
        phone: signUpPhone || '+91 98000 12345',
        building: signUpTower,
        roomOrUnit: `${signUpTower} - ${signUpRoomNo}`,
        rollNo: signUpRollNo,
        admissionNo: signUpAdmissionNo,
        courseSection: signUpCourseSection,
      }
    );

    setAuthNotice('🎉 Welcome to Woxsen Portal! Account created & verified as Student.');
    redirectByRole('student');
  };

  const quickDemoLogin = (roleType: 'student' | 'worker' | 'warden' | 'admin') => {
    setAuthError('');
    setAuthNotice('');
    let targetEmail = 'student@woxsen.edu.in';
    if (roleType === 'worker') targetEmail = 'ravi.kumar@woxsen.edu.in';
    if (roleType === 'warden') targetEmail = 'warden.hostela@woxsen.edu.in';
    if (roleType === 'admin') targetEmail = 'admin@woxsen.edu.in';

    loginWithEmail(targetEmail, '2026');
    redirectByRole(roleType);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xl space-y-6 max-w-xl mx-auto">
      {/* Official Woxsen University Logo Header */}
      <div className="flex items-center justify-center pt-1 pb-2">
        <img
          src="/woxsen-logo.jpg"
          alt="Woxsen University Logo"
          className="h-12 w-auto object-contain transition-all"
        />
      </div>

      {/* Primary Side-by-Side Tabs: Sign In vs Access Token */}
      <div className="flex items-center p-1 rounded-2xl bg-red-50 border border-red-100">
        <button
          onClick={() => { setAuthTab('signin'); setAuthStep('credentials'); setAuthError(''); }}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            authTab === 'signin' || authTab === 'signup'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-red-950 hover:text-red-700'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Sign In (@woxsen.edu.in)</span>
        </button>

        <button
          onClick={() => { setAuthTab('token'); setAuthError(''); }}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            authTab === 'token'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-red-950 hover:text-red-700'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Access Token</span>
        </button>
      </div>

      {authError && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{authError}</span>
        </div>
      )}

      {authNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{authNotice}</span>
        </div>
      )}

      {/* FORM 1: EMAIL SIGN IN & 6-DIGIT OTP VERIFICATION */}
      {authTab === 'signin' && authStep === 'credentials' && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Woxsen Email Address (@woxsen.edu.in)</span>
              <span className="text-[10px] font-extrabold text-red-600 uppercase">Domain Restricted</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="e.g. student@woxsen.edu.in or warden.hostela@woxsen.edu.in"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-medium">
              Must be registered with <strong>@woxsen.edu.in</strong> email domain.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Account Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'View password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Send 6-Digit Verification OTP</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Under Sign In: Create Account Link */}
          <div className="pt-2 text-center text-xs">
            <span className="text-slate-500">Don't have an account? </span>
            <button
              type="button"
              onClick={() => { setAuthTab('signup'); setAuthError(''); }}
              className="font-extrabold text-red-600 hover:underline"
            >
              Create One (Sign Up)
            </button>
          </div>
        </form>
      )}

      {/* FORM 1 STEP 2: 6-DIGIT OTP VERIFICATION SCREEN */}
      {authTab === 'signin' && authStep === 'otp' && (
        <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center space-y-1">
            <h3 className="text-sm font-black text-red-950">Verify 6-Digit OTP Code</h3>
            <p className="text-xs text-red-800 font-medium">
              Verification code dispatched to <strong>{emailInput || 'student@woxsen.edu.in'}</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 text-center">
              Enter 6-Digit OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="e.g. 202601"
              className="w-full text-center tracking-[0.5em] px-4 py-3 text-lg font-mono font-black rounded-2xl bg-white border-2 border-red-500 text-red-600 focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>⏱️ Code expires in: <strong>01:59</strong></span>
            <button
              type="button"
              onClick={() => {
                const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                setGeneratedOtp(newOtp);
                setAuthNotice(`🔑 Resent OTP Code: ${newOtp}`);
              }}
              className="font-bold text-red-600 hover:underline cursor-pointer"
            >
              Resend OTP Code
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify OTP & Sign In to Woxsen Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setAuthStep('credentials')}
            className="w-full text-center text-xs text-slate-500 font-bold hover:text-slate-800"
          >
            ← Change Email Address
          </button>
        </form>
      )}

      {/* FORM 2: TEMPORARY ACCESS TOKEN */}
      {authTab === 'token' && (
        <form onSubmit={handleTokenSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Woxsen Student Access Token
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="e.g. WOXSEN-8849-T"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Access Security PIN
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-red-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="e.g. 2026"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Authenticate via Access Token</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Under Token: Sign In Link */}
          <div className="pt-2 text-center text-xs">
            <span className="text-slate-500">Have an email account? </span>
            <button
              type="button"
              onClick={() => { setAuthTab('signin'); setAuthStep('credentials'); setAuthError(''); }}
              className="font-extrabold text-red-600 hover:underline cursor-pointer"
            >
              Sign In with Email
            </button>
          </div>
        </form>
      )}

      {/* FORM 3: 3-STEP STUDENT ACCOUNT REGISTRATION WIZARD */}
      {authTab === 'signup' && signUpStep === 'credentials' && (
        <form onSubmit={handleSignUpStep1Submit} noValidate className="space-y-4 animate-in fade-in duration-300">
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-950 text-xs font-medium">
            🎓 <strong>Step 1 of 3 — Account Credentials:</strong> Registration is strictly restricted to official <strong>@woxsen.edu.in</strong> email addresses. Enter your name, email, and password below.
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              placeholder="e.g. S. Bharat Reddy"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Woxsen Email Address (@woxsen.edu.in) *</span>
              <span className="text-[10px] font-black text-red-600 uppercase">Domain Restricted</span>
            </label>
            <input
              type="email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              placeholder="e.g. bharat.reddy@woxsen.edu.in"
              className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 pr-10 py-3 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title={showSignUpPassword ? 'Hide password' : 'View password'}
                >
                  {showSignUpPassword ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showSignUpConfirmPassword ? 'text' : 'password'}
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 pr-10 py-3 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title={showSignUpConfirmPassword ? 'Hide password' : 'View password'}
                >
                  {showSignUpConfirmPassword ? <EyeOff className="w-4 h-4 text-red-600" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Register & Send 6-Digit Verification OTP</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Under Sign Up: Already have account link */}
          <div className="pt-2 text-center text-xs">
            <span className="text-slate-500">Already have a Woxsen account? </span>
            <button
              type="button"
              onClick={() => { setAuthTab('signin'); setAuthStep('credentials'); setAuthError(''); }}
              className="font-extrabold text-red-600 hover:underline cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </form>
      )}

      {/* FORM 3 STEP 2: 6-DIGIT OTP VERIFICATION SCREEN FOR SIGN UP */}
      {authTab === 'signup' && signUpStep === 'otp_verify' && (
        <form onSubmit={handleVerifyOtp} noValidate className="space-y-5 animate-in fade-in duration-300">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-center space-y-1">
            <h3 className="text-sm font-black text-red-950">Step 2 of 3 — Verify 6-Digit OTP Code</h3>
            <p className="text-xs text-red-800 font-medium">
              Verification code sent to <strong>{signUpEmail}</strong>
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 text-center">
              Enter 6-Digit OTP Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="e.g. 202601"
              className="w-full text-center tracking-[0.5em] px-4 py-3 text-lg font-mono font-black rounded-2xl bg-white border-2 border-red-500 text-red-600 focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>⏱️ Code expires in: <strong>01:59</strong></span>
            <button
              type="button"
              onClick={() => {
                const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                setGeneratedOtp(newOtp);
                setAuthNotice(`🔑 Resent OTP Code: ${newOtp}`);
              }}
              className="font-bold text-red-600 hover:underline cursor-pointer"
            >
              Resend OTP Code
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify OTP Code & Continue to Step 3</span>
          </button>

          <button
            type="button"
            onClick={() => setSignUpStep('credentials')}
            className="w-full text-center text-xs text-slate-500 font-bold hover:text-slate-800"
          >
            ← Back to Step 1 (Credentials)
          </button>
        </form>
      )}

      {/* FORM 3 STEP 3: ENTER HOSTEL ROOM & STUDENT DETAILS */}
      {authTab === 'signup' && signUpStep === 'profile_details' && (
        <form onSubmit={handleSignUpFinalSubmit} noValidate className="space-y-4 animate-in fade-in duration-300">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-medium">
            ✅ <strong>Step 3 of 3 — Student & Room Details:</strong> OTP Verified for <strong>{signUpEmail}</strong>! Enter your allocated hostel room and academic details below to complete setup.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hostel Tower / Building *
              </label>
              <input
                type="text"
                value={signUpTower}
                onChange={(e) => setSignUpTower(e.target.value)}
                placeholder="e.g. Tower T1 or Block B"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Room No *</span>
                <span className="text-[10px] font-black text-red-600 uppercase">Searchable</span>
              </label>
              <RoomSearchSelector
                value={signUpRoomNo}
                onChange={setSignUpRoomNo}
                placeholder="Search room (e.g. Hostel B - Room 204)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student Roll No *
              </label>
              <input
                type="text"
                value={signUpRollNo}
                onChange={(e) => setSignUpRollNo(e.target.value)}
                placeholder="e.g. WOX-2026-84920"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                5-Digit Admission No *
              </label>
              <input
                type="text"
                maxLength={5}
                value={signUpAdmissionNo}
                onChange={(e) => setSignUpAdmissionNo(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="e.g. 58492"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Course & Section *
              </label>
              <input
                type="text"
                value={signUpCourseSection}
                onChange={(e) => setSignUpCourseSection(e.target.value)}
                placeholder="e.g. B.Tech CSE - Sec A"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={signUpPhone}
                onChange={(e) => setSignUpPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finalize Account & Open Student Portal</span>
          </button>
        </form>
      )}

      {/* Quick 1-Click Test Logins Section */}
      <div className="pt-5 mt-4 border-t border-slate-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
            <span>Quick 1-Click Demo & Test Logins</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setAuthTab('signin');
              setAuthStep('credentials');
              setAuthError('');
              setEmailInput('admin@woxsen.edu.in');
              setPasswordInput('password');
              setAuthNotice('✅ Chief Admin demo credentials pre-filled below. Click "Send 6-Digit Verification OTP" to continue.');
            }}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-left transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="text-[11px] font-black text-amber-400">👑 Chief Admin</div>
            <div className="text-[10px] text-slate-300 font-mono truncate">admin@woxsen.edu.in</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthTab('signin');
              setAuthStep('credentials');
              setAuthError('');
              setEmailInput('warden.hostela@woxsen.edu.in');
              setPasswordInput('password');
              setAuthNotice('✅ Hostel Warden demo credentials pre-filled below. Click "Send 6-Digit Verification OTP" to continue.');
            }}
            className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-950 text-left transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="text-[11px] font-black text-blue-800">🏢 Hostel Warden</div>
            <div className="text-[10px] text-blue-600 font-mono truncate">warden.hostela@woxsen.edu.in</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthTab('token');
              setAuthError('');
              setTokenInput('WRK-5050-T');
              setPinInput('2026');
              setAuthNotice('✅ Technician Access Code (WRK-5050-T) & PIN (2026) pre-filled below. Click "Sign In with Access Code" to continue.');
            }}
            className="p-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-950 text-left transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="text-[11px] font-black text-violet-800">🔧 Technician</div>
            <div className="text-[10px] text-violet-600 font-mono truncate">WRK-5050-T (PIN 2026)</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthError('');
              loginWithEmail('courier.manager@woxsen.edu.in', 'password');
              router.push('/courier/portal');
            }}
            className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-left transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="text-[11px] font-black text-amber-900">📦 Courier Room Manager</div>
            <div className="text-[10px] text-amber-700 font-mono truncate">courier.manager@woxsen.edu.in</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthError('');
              loginWithEmail('sports.manager@woxsen.edu.in', 'password');
              router.push('/sports/portal');
            }}
            className="p-2.5 rounded-xl bg-lime-50 hover:bg-lime-100 border border-lime-300 text-lime-950 text-left transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="text-[11px] font-black text-lime-900">⚽ Sports Area Manager</div>
            <div className="text-[10px] text-lime-700 font-mono truncate">sports.manager@woxsen.edu.in</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthError('');
              loginWithEmail('laundry.manager@woxsen.edu.in', 'password');
              router.push('/laundry');
            }}
            className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-blue-950 text-left transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="text-[11px] font-black text-blue-900">🧺 Laundry Manager</div>
            <div className="text-[10px] text-blue-700 font-mono truncate">laundry.manager@woxsen.edu.in</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthError('');
              loginWithEmail('vendor.asianwok@woxsen.edu.in', 'password');
              router.push('/food');
            }}
            className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-300 text-red-950 text-left transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="text-[11px] font-black text-red-900">🍜 Asian Wok Vendor (Chinese)</div>
            <div className="text-[10px] text-red-700 font-mono truncate">vendor.asianwok@woxsen.edu.in</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthError('');
              loginWithEmail('vendor.burgerdeck@woxsen.edu.in', 'password');
              router.push('/food');
            }}
            className="p-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-300 text-orange-950 text-left transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="text-[11px] font-black text-orange-900">🍕 Crust & Burger Deck Vendor</div>
            <div className="text-[10px] text-orange-700 font-mono truncate">vendor.burgerdeck@woxsen.edu.in</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthError('');
              loginWithEmail('vendor.crispycrunch@woxsen.edu.in', 'password');
              router.push('/food');
            }}
            className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-left transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="text-[11px] font-black text-amber-900">🍗 Crispy Crunch Vendor (KFC Style)</div>
            <div className="text-[10px] text-amber-700 font-mono truncate">vendor.crispycrunch@woxsen.edu.in</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthError('');
              loginWithEmail('vendor.expressbites@woxsen.edu.in', 'password');
              router.push('/food');
            }}
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950 text-left transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="text-[11px] font-black text-emerald-900">☕ Express Bites & Chai Vendor</div>
            <div className="text-[10px] text-emerald-700 font-mono truncate">vendor.expressbites@woxsen.edu.in</div>
          </button>

          <button
            type="button"
            onClick={() => {
              setAuthTab('signin');
              setAuthStep('credentials');
              setAuthError('');
              setEmailInput('student@woxsen.edu.in');
              setPasswordInput('password');
              setAuthNotice('✅ Student Resident demo credentials pre-filled below. Click "Send 6-Digit Verification OTP" to continue.');
            }}
            className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 text-left transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <div className="text-[11px] font-black text-emerald-800">🎓 Student Resident</div>
            <div className="text-[10px] text-emerald-600 font-mono truncate">student@woxsen.edu.in</div>
          </button>
        </div>
      </div>
    </div>
  );
}
