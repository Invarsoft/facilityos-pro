'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Trophy,
  Calendar,
  Clock,
  UserCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Users,
  ShieldCheck,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Search,
  Dumbbell,
  ShieldAlert,
  Sliders,
  Check,
  AlertCircle,
  Activity,
  Award,
} from 'lucide-react';

interface StaffSportsBooking {
  id: string; // e.g. SPT-9041
  studentName: string;
  studentRollNo: string;
  studentPhone: string;
  courtName: string;
  sportCategory: 'badminton' | 'tennis' | 'football' | 'basketball' | 'squash' | 'tt';
  location: string;
  slotDate: string;
  slotTime: string;
  equipmentRequested: string;
  passcode: string;
  status: 'confirmed' | 'checked_in' | 'completed' | 'cancelled';
  checkedInAt?: string;
  staffOperator?: string;
}

const INITIAL_STAFF_BOOKINGS: StaffSportsBooking[] = [
  {
    id: 'BK-8401',
    studentName: 'Aarav Sharma',
    studentRollNo: 'WOX-2026-84920',
    studentPhone: '+91 98765 43210',
    courtName: 'Indoor Synthetic Badminton Court 1 & 2',
    sportCategory: 'badminton',
    location: 'Woxsen Indoor Sports Complex — Level 1',
    slotDate: '2026-09-03',
    slotTime: '06:00 PM - 07:00 PM',
    equipmentRequested: '2 Yonex Rackets & Mavis 350 Shuttles',
    passcode: 'SPT-9041',
    status: 'confirmed',
  },
  {
    id: 'BK-8402',
    studentName: 'Aarav Sharma',
    studentRollNo: 'WOX-2026-84920',
    studentPhone: '+91 98765 43210',
    courtName: 'AstroTurf 5-a-Side Football & Cricket Pitch',
    sportCategory: 'football',
    location: 'Woxsen Main Sports Arena',
    slotDate: '2026-09-03',
    slotTime: '06:30 PM - 08:00 PM',
    equipmentRequested: 'Nike Size 5 Football & Bibs',
    passcode: 'SPT-9042',
    status: 'confirmed',
  },
  {
    id: 'BK-8399',
    studentName: 'Rohan Varma',
    studentRollNo: '24WU0109920',
    studentPhone: '+91 91234 56789',
    courtName: 'Floodlit Outdoor Tennis Court A',
    sportCategory: 'tennis',
    location: 'Woxsen Sports Arena — West Wing',
    slotDate: '2026-09-02',
    slotTime: '05:00 PM - 06:30 PM',
    equipmentRequested: 'Head Rackets & Dunlop Balls',
    passcode: 'SPT-8399',
    status: 'checked_in',
    checkedInAt: 'Today, 05:02 PM',
    staffOperator: 'Guard Suresh Rao',
  },
  {
    id: 'BK-8395',
    studentName: 'Priya Nair',
    studentRollNo: '24WU0108840',
    studentPhone: '+91 99887 76655',
    courtName: 'Glass-Backed Squash Court 1',
    sportCategory: 'squash',
    location: 'Woxsen Indoor Sports Complex — Level 2',
    slotDate: '2026-09-02',
    slotTime: '04:00 PM - 05:00 PM',
    equipmentRequested: 'Dunlop Squash Rackets',
    passcode: 'SPT-8395',
    status: 'completed',
    checkedInAt: 'Today, 04:01 PM',
    staffOperator: 'Guard Suresh Rao',
  },
];

export default function SportsAdminPortalPage() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [bookings, setBookings] = useState<StaffSportsBooking[]>(INITIAL_STAFF_BOOKINGS);
  const [deskTab, setDeskTab] = useState<'verify' | 'bookings' | 'equipment' | 'courts'>('verify');
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // WORKSTATION 1: Gate Pass Verification Terminal State
  const [inputPasscode, setInputPasscode] = useState('');
  const [verifiedBooking, setVerifiedBooking] = useState<StaffSportsBooking | null>(null);

  // Stats
  const activeBookingsCount = bookings.filter((b) => b.status === 'confirmed' || b.status === 'checked_in').length;
  const checkedInCount = bookings.filter((b) => b.status === 'checked_in').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  // WORKSTATION 1 SUBMIT: Verify Gate Passcode
  const handleVerifyPasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPasscode) return;

    const matched = bookings.find(
      (b) =>
        b.passcode.toLowerCase() === inputPasscode.trim().toLowerCase() ||
        b.id.toLowerCase() === inputPasscode.trim().toLowerCase()
    );

    if (!matched) {
      alert(`No active booking found matching Gate Passcode "${inputPasscode}".`);
      return;
    }

    setVerifiedBooking(matched);
  };

  // Confirm Check-In at Arena Gate
  const handleConfirmGateAccess = () => {
    if (!verifiedBooking) return;

    setBookings(
      bookings.map((b) =>
        b.id === verifiedBooking.id
          ? {
              ...b,
              status: 'checked_in',
              checkedInAt: 'Just now',
              staffOperator: currentUser?.name || 'Sports Arena Guard',
            }
          : b
      )
    );

    setNotice(`ACCESS GRANTED: ${verifiedBooking.studentName} checked in for ${verifiedBooking.courtName} (${verifiedBooking.passcode}).`);
    setVerifiedBooking(null);
    setInputPasscode('');
  };

  // Complete Slot & Return Equipment
  const handleMarkCompleted = (bookingId: string) => {
    setBookings(
      bookings.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'completed',
              staffOperator: currentUser?.name || 'Sports Arena Guard',
            }
          : b
      )
    );

    setNotice(`Slot completed & sports equipment returned for Booking ${bookingId}.`);
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.courtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.passcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="py-6 sm:py-10 px-3.5 sm:px-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER SPORTS ADMIN PORTAL HERO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  router.back();
                } else {
                  router.push('/dashboard');
                }
              }}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer active:scale-95 shrink-0"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md">
              <span>⚽</span>
              <span>Woxsen Sports Arena Admin & Gate Guard Desk</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Sports Court Booking Verification Terminal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Verify student digital gate passcodes (`SPT-9041`), check in players, manage equipment rentals, and monitor court schedules.
          </p>
        </div>

        <Link
          href="/sports"
          className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs border border-white/20 shadow-md shrink-0 uppercase tracking-wider"
        >
          View Student Booking Page →
        </Link>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">Today's Active Slots</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-amber-600">{activeBookingsCount}</span>
            <Trophy className="w-6 h-6 text-amber-500" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">Confirmed Reservations</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">Players Checked In</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-600">{checkedInCount}</span>
            <UserCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">Currently On Court</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">Completed Slots</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-blue-600">{completedCount}</span>
            <CheckCircle2 className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">Equipment Returned</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">Court Availability</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-purple-600">6 / 6</span>
            <Activity className="w-6 h-6 text-purple-500" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">100% Operational</span>
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

      {/* WORKSTATION SWITCHER TABS */}
      <div className="p-2 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-2">
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 pt-1">
          Select Sports Operations Workstation
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={() => setDeskTab('verify')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              deskTab === 'verify'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>🔑 Gate Passcode Scanner</span>
          </button>

          <button
            onClick={() => setDeskTab('bookings')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              deskTab === 'bookings'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>📅 Live Bookings Directory</span>
          </button>

          <button
            onClick={() => setDeskTab('equipment')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              deskTab === 'equipment'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>🎾 Equipment Counter</span>
          </button>

          <button
            onClick={() => setDeskTab('courts')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              deskTab === 'courts'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>🛠️ Court Maintenance Desk</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      // WORKSTATION 1: GATE PASSCODE VERIFICATION TERMINAL
      {/* =================================================================== */}
      {deskTab === 'verify' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Keypad Scanner Form */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5 lg:col-span-1">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Gate Access Terminal</span>
              <h3 className="text-base font-black text-slate-900">Scan / Enter Gate Passcode</h3>
            </div>

            <form onSubmit={handleVerifyPasscodeSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Digital Passcode (e.g. SPT-9041) *</label>
                <input
                  type="text"
                  required
                  value={inputPasscode}
                  onChange={(e) => setInputPasscode(e.target.value)}
                  placeholder="e.g. SPT-9041"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-center font-mono font-black text-xl text-slate-900 tracking-wider focus:ring-2 focus:ring-amber-500 uppercase"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 cursor-pointer transition-transform active:scale-95"
              >
                Verify Passcode & Check Court Booking
              </button>
            </form>

            {/* Verified Result Card */}
            {verifiedBooking && (
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                    PASS VALIDATED
                  </span>
                  <span className="font-mono text-xs font-black text-slate-900">{verifiedBooking.passcode}</span>
                </div>

                <div className="space-y-1 text-xs text-slate-800">
                  <p className="font-black text-slate-900">{verifiedBooking.studentName} ({verifiedBooking.studentRollNo})</p>
                  <p className="font-bold text-amber-950">{verifiedBooking.courtName}</p>
                  <p className="text-[11px] text-slate-600 font-mono">Slot: {verifiedBooking.slotTime}</p>
                  <p className="text-[11px] text-slate-600">Equipment: {verifiedBooking.equipmentRequested}</p>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmGateAccess}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  ✓ Confirm Player Gate Check-In
                </button>
              </div>
            )}
          </div>

          {/* Active Player Reservations List */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Today's Confirmed Player Passcodes ({activeBookingsCount})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {bookings
                .filter((b) => b.status === 'confirmed' || b.status === 'checked_in')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-900 bg-amber-100 text-amber-950 px-2 py-0.5 rounded border border-amber-300">
                          {item.passcode}
                        </span>
                        <span className="text-[10px] font-black text-slate-600 uppercase bg-slate-200 px-2 py-0.5 rounded">
                          {item.sportCategory}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900">{item.courtName}</h4>
                      <p className="text-xs text-slate-600 font-bold">{item.studentName} ({item.studentRollNo}) • <span className="font-mono text-slate-900">{item.slotTime}</span></p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between border-t sm:border-0 border-slate-200 pt-2 sm:pt-0">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                          item.status === 'checked_in'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {item.status === 'checked_in' ? '🔑 On Court' : '✓ Reserved'}
                      </span>

                      {item.status === 'confirmed' ? (
                        <button
                          onClick={() => {
                            setInputPasscode(item.passcode);
                            setVerifiedBooking(item);
                          }}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Check In
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMarkCompleted(item.id)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Complete Slot
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      // WORKSTATION 2: LIVE BOOKINGS DIRECTORY
      {/* =================================================================== */}
      {deskTab === 'bookings' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">All Campus Sports Arena Reservations</h3>
              <p className="text-xs text-slate-500 font-semibold">Master schedule across Badminton, Tennis, Football Turf & Basketball</p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search player, court, passcode..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredBookings.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border">{item.id}</span>
                    <span className="font-mono text-xs font-black text-amber-950 bg-amber-100 px-2 py-0.5 rounded">{item.passcode}</span>
                    <span className="text-[10px] font-black uppercase text-slate-500">{item.sportCategory}</span>
                  </div>

                  <h4 className="text-sm font-black text-slate-900">{item.courtName}</h4>
                  <p className="text-xs font-bold text-slate-700">{item.studentName} ({item.studentRollNo}) • Slot: <span className="font-mono text-slate-900">{item.slotTime}</span></p>
                  <p className="text-[11px] text-slate-500">Equipment: {item.equipmentRequested}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      item.status === 'confirmed'
                        ? 'bg-amber-100 text-amber-950 border border-amber-300'
                        : item.status === 'checked_in'
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      // WORKSTATION 3: SPORTS EQUIPMENT COUNTER
      {/* =================================================================== */}
      {deskTab === 'equipment' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">Sports Equipment Rental Counter</h3>
              <p className="text-xs text-slate-500 font-semibold">Track issued rackets, balls, shuttles, and bibs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Yonex Badminton Rackets', issued: 8, total: 20, icon: '🏸' },
              { name: 'Head Tennis Rackets', issued: 4, total: 10, icon: '🎾' },
              { name: 'Nike Size 5 Footballs', issued: 2, total: 6, icon: '⚽' },
              { name: 'Spalding Basketballs', issued: 3, total: 8, icon: '🏀' },
              { name: 'Dunlop Squash Rackets', issued: 2, total: 6, icon: '🎾' },
              { name: 'Stiga Table Tennis Bats', issued: 6, total: 16, icon: '🏓' },
            ].map((eq) => (
              <div key={eq.name} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{eq.icon}</span>
                  <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {eq.issued} Issued / {eq.total} Total
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">{eq.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      // WORKSTATION 4: COURT MAINTENANCE & FLOODLIGHTS
      {/* =================================================================== */}
      {deskTab === 'courts' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">Arena Courts Operational Status</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Badminton Court 1 & 2', status: 'Operational', lights: 'ON' },
              { name: 'Tennis Court A', status: 'Operational', lights: 'ON' },
              { name: '5-a-Side Football Turf', status: 'Operational', lights: 'ON' },
              { name: 'Basketball Arena', status: 'Operational', lights: 'ON' },
              { name: 'Squash Court 1', status: 'Operational', lights: 'ON' },
              { name: 'Table Tennis Suite', status: 'Operational', lights: 'ON' },
            ].map((court) => (
              <div key={court.name} className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    ✓ {court.status}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-600">Floodlights: {court.lights}</span>
                </div>
                <h4 className="text-xs font-black text-slate-900">{court.name}</h4>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
