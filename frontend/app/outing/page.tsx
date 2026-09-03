'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { HostelGateMovement } from '@/lib/types';
import {
  LogOut,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  QrCode,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Send,
  UserCheck,
} from 'lucide-react';

const INITIAL_OUTINGS: HostelGateMovement[] = [
  {
    id: 'OUT-9041',
    studentId: 'user-student-1',
    studentName: 'Aarav Sharma',
    studentRollNo: 'WOX-2026-84920',
    studentPhone: '+91 98765 43210',
    studentRoom: 'Tower T1 - Room 502',
    outingType: 'Day Outing',
    destination: 'Hyderabad City Center & Forum Mall',
    reason: 'Personal shopping and book store visit',
    exitTime: 'Today, 11:30 AM',
    expectedReturnTime: 'Today, 08:30 PM',
    passcode: 'GATE-9041',
    status: 'checked_out',
    approvedByWarden: 'Dr. Rajesh Verma (Warden)',
  },
];

export default function StudentOutingPassPage() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [outings, setOutings] = useState<HostelGateMovement[]>(INITIAL_OUTINGS);

  const [outingType, setOutingType] = useState<'Day Outing' | 'Night Outing' | 'Home Leave'>('Day Outing');
  const [destinationInput, setDestinationInput] = useState('');
  const [reasonInput, setReasonInput] = useState('');
  const [expectedReturnInput, setExpectedReturnInput] = useState('2026-09-03T20:30');
  const [generatedPass, setGeneratedPass] = useState<HostelGateMovement | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleRequestOutingPass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationInput || !reasonInput) return;

    const newPasscode = `GATE-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `OUT-${Math.floor(8000 + Math.random() * 1000)}`;

    const newOuting: HostelGateMovement = {
      id: newId,
      studentId: currentUser?.id || 'user-student-1',
      studentName: currentUser?.name || 'Aarav Sharma',
      studentRollNo: currentUser?.rollNo || 'WOX-2026-84920',
      studentPhone: currentUser?.phone || '+91 98765 43210',
      studentRoom: currentUser?.roomOrUnit || 'Tower T1 - Room 502',
      outingType,
      destination: destinationInput,
      reason: reasonInput,
      exitTime: 'Pending Gate Scan',
      expectedReturnTime: expectedReturnInput.replace('T', ' '),
      passcode: newPasscode,
      status: 'inside_campus',
      approvedByWarden: 'Dr. Rajesh Verma (Warden)',
    };

    setOutings([newOuting, ...outings]);
    setGeneratedPass(newOuting);
    setNotice(`OUTING PASS GENERATED: Gate Passcode ${newPasscode} created! Show code at campus gate.`);
  };

  return (
    <div className="py-6 sm:py-10 px-3.5 sm:px-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER HERO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
              <span>🚪</span>
              <span>Woxsen Hostel Outing & Gate Check-In/Check-Out</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Hostel Student Outing Gate Pass
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Generate digital gate passcodes (`GATE-9041`) for campus exit and entry. Real-time warden movement tracking & return deadline alerts.
          </p>
        </div>
      </div>

      {/* NOTICE BANNER */}
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="font-black underline text-xs cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* REQUEST OUTING PASS FORM */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 md:col-span-1">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Campus Gate Clearance</span>
            <h3 className="text-base font-black text-slate-900">Request Outing Gate Pass</h3>
          </div>

          <form onSubmit={handleRequestOutingPass} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Outing Type *</label>
              <select
                value={outingType}
                onChange={(e) => setOutingType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
              >
                <option value="Day Outing">Day Outing (Return by 08:30 PM)</option>
                <option value="Night Outing">Night Outing (Warden Approved)</option>
                <option value="Home Leave">Home Leave (Weekend / Break)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Destination *</label>
              <input
                type="text"
                required
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                placeholder="e.g. Hyderabad Forum Mall"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Reason for Outing *</label>
              <input
                type="text"
                required
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="e.g. Medical appointment / Personal"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Expected Return Date & Time *</label>
              <input
                type="datetime-local"
                required
                value={expectedReturnInput}
                onChange={(e) => setExpectedReturnInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 cursor-pointer active:scale-95 transition-transform"
            >
              Generate Digital Gate Passcode
            </button>
          </form>
        </div>

        {/* ACTIVE GATE PASSES & HISTORY */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 md:col-span-2">
          <h3 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Active Campus Outing Passcodes & Movement History</h3>

          {generatedPass && (
            <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-300 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-red-900 bg-red-200 px-2 py-0.5 rounded">
                  PASS ACTIVE — PRESENT AT GATE
                </span>
                <span className="font-mono text-sm font-black text-slate-900">{generatedPass.passcode}</span>
              </div>

              <div className="space-y-1 text-xs text-slate-800 font-medium">
                <p>Destination: <strong>{generatedPass.destination}</strong></p>
                <p>Expected Return: <strong className="font-mono text-red-700">{generatedPass.expectedReturnTime}</strong></p>
                <p>Warden Approval: <span className="text-emerald-700 font-bold">{generatedPass.approvedByWarden}</span></p>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            {outings.map((out) => (
              <div key={out.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-red-950 bg-red-100 px-2.5 py-0.5 rounded border border-red-300">
                      {out.passcode}
                    </span>
                    <span className="text-xs font-black text-slate-900">{out.outingType}</span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      out.status === 'checked_out'
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : 'bg-emerald-100 text-emerald-950'
                    }`}
                  >
                    {out.status === 'checked_out' ? '🚶 Checked Out (Outside Campus)' : '🏠 Inside Campus'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 font-semibold space-y-0.5">
                  <p>Destination: <span className="font-bold text-slate-900">{out.destination}</span></p>
                  <p>Expected Return: <span className="font-mono text-slate-900">{out.expectedReturnTime}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
