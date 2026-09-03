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
} from 'lucide-react';

interface CourtBookingInfo {
  passcode: string;
  studentName: string;
  studentRollNo: string;
  studentRoom: string;
  slotTime: string;
  equipment: string;
  status: 'confirmed' | 'checked_in' | 'completed';
}

interface SportsCourtItem {
  id: string;
  name: string;
  sportCategory: 'badminton' | 'tennis' | 'basketball' | 'football' | 'squash' | 'tt';
  location: string;
  floodlights: boolean;
  image: string;
  description: string;
  availableSlots: string[];
  equipmentAvailable: string;
  status: 'open' | 'booked' | 'maintenance';
  bookedSlots: CourtBookingInfo[];
}

const DEMO_SPORTS_COURTS: SportsCourtItem[] = [
  {
    id: 'spt-1',
    name: 'Indoor Synthetic Badminton Court 1 & 2',
    sportCategory: 'badminton',
    location: 'Woxsen Indoor Sports Complex — Level 1',
    floodlights: true,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80',
    description: 'BWF-approved 4-ply wooden flooring with non-marking synthetic mats and LED floodlights.',
    availableSlots: ['06:00 AM - 07:00 AM', '07:00 AM - 08:00 AM', '05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM', '07:00 PM - 08:00 PM', '08:00 PM - 09:00 PM'],
    equipmentAvailable: 'Yonex Rackets & Yonex Mavis 350 Shuttles available at desk',
    status: 'open',
    bookedSlots: [
      {
        passcode: 'SPT-9041',
        studentName: 'Aarav Sharma',
        studentRollNo: 'WOX-2026-84920',
        studentRoom: 'Tower T1 - Room 502',
        slotTime: '06:00 PM - 07:00 PM',
        equipment: '2 Yonex Rackets & Mavis 350 Shuttles',
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'spt-2',
    name: 'Floodlit Outdoor Tennis Court A',
    sportCategory: 'tennis',
    location: 'Woxsen Sports Arena — West Wing',
    floodlights: true,
    image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600&auto=format&fit=crop&q=80',
    description: 'Hard court acrylic surface with professional net and high-lumen evening floodlights.',
    availableSlots: ['06:00 AM - 07:30 AM', '04:30 PM - 06:00 PM', '06:00 PM - 07:30 PM', '07:30 PM - 09:00 PM'],
    equipmentAvailable: 'Head Tennis Rackets & Dunlop Balls available',
    status: 'open',
    bookedSlots: [
      {
        passcode: 'SPT-8399',
        studentName: 'Rohan Varma',
        studentRollNo: '24WU0109920',
        studentRoom: 'Block B - Room 204',
        slotTime: '05:00 PM - 06:30 PM',
        equipment: 'Head Rackets & Dunlop Balls',
        status: 'checked_in',
      },
    ],
  },
  {
    id: 'spt-3',
    name: 'AstroTurf 5-a-Side Football & Cricket Pitch',
    sportCategory: 'football',
    location: 'Woxsen Main Sports Arena',
    floodlights: true,
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600&auto=format&fit=crop&q=80',
    description: 'All-weather 50mm synthetic grass turf with perimeter netting and evening match lights.',
    availableSlots: ['05:00 PM - 06:30 PM', '06:30 PM - 08:00 PM', '08:00 PM - 09:30 PM'],
    equipmentAvailable: 'Nike Size 5 Footballs & Leather Cricket Gear',
    status: 'open',
    bookedSlots: [
      {
        passcode: 'SPT-9042',
        studentName: 'Aarav Sharma',
        studentRollNo: 'WOX-2026-84920',
        studentRoom: 'Tower T1 - Room 502',
        slotTime: '06:30 PM - 08:00 PM',
        equipment: 'Nike Size 5 Football',
        status: 'confirmed',
      },
    ],
  },
  {
    id: 'spt-4',
    name: 'Acrylic Basketball Arena',
    sportCategory: 'basketball',
    location: 'Woxsen Outdoor Sports Deck',
    floodlights: true,
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
    description: 'Full-court basketball arena with tempered glass backboards and spring breakaway rims.',
    availableSlots: ['06:00 AM - 07:30 AM', '05:00 PM - 06:30 PM', '06:30 PM - 08:00 PM'],
    equipmentAvailable: 'Spalding Basketballs available',
    status: 'open',
    bookedSlots: [],
  },
  {
    id: 'spt-5',
    name: 'Glass-Backed Squash Court 1',
    sportCategory: 'squash',
    location: 'Woxsen Indoor Sports Complex — Level 2',
    floodlights: true,
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&auto=format&fit=crop&q=80',
    description: 'WSF-standard glass-backed court with maple wood flooring and climate control.',
    availableSlots: ['07:00 AM - 08:00 AM', '04:00 PM - 05:00 PM', '05:00 PM - 06:00 PM', '07:00 PM - 08:00 PM'],
    equipmentAvailable: 'Dunlop Squash Rackets & Double Yellow Dot Balls',
    status: 'open',
    bookedSlots: [
      {
        passcode: 'SPT-8395',
        studentName: 'Priya Nair',
        studentRollNo: '24WU0108840',
        studentRoom: 'Block B - Room 102',
        slotTime: '04:00 PM - 05:00 PM',
        equipment: 'Dunlop Squash Racket',
        status: 'completed',
      },
    ],
  },
  {
    id: 'spt-6',
    name: 'Professional Table Tennis Suite',
    sportCategory: 'tt',
    location: 'Hostel Block D & Tower T2 — Recreation Deck',
    floodlights: false,
    image: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?w=600&auto=format&fit=crop&q=80',
    description: '4 Stiga 25mm ITTF-approved competition tables with ITTF 3-star balls.',
    availableSlots: ['04:00 PM - 05:00 PM', '05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM', '08:00 PM - 09:00 PM'],
    equipmentAvailable: 'Stiga Bats & 3-Star Balls',
    status: 'open',
    bookedSlots: [],
  },
];

export default function SportsAreaBookingPage() {
  const router = useRouter();
  const { currentUser, activeRole } = useApp();
  
  const role = currentUser?.role || activeRole;
  const isManagerRole = role === 'sports_manager' || role === 'warden' || role === 'manager' || role === 'admin' || role === 'org_admin' || role === 'super_admin';

  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal State
  const [selectedCourt, setSelectedCourt] = useState<SportsCourtItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('2026-09-03');
  const [needEquipment, setNeedEquipment] = useState<boolean>(true);
  const [confirmedBooking, setConfirmedBooking] = useState<{ passcode: string; courtName: string; slot: string } | null>(null);

  const filteredCourts = DEMO_SPORTS_COURTS.filter((item) => {
    const matchesSport = selectedSport === 'all' || item.sportCategory === selectedSport;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourt || !selectedSlot) return;

    const randomPasscode = `SPT-${Math.floor(1000 + Math.random() * 9000)}`;

    setConfirmedBooking({
      passcode: randomPasscode,
      courtName: selectedCourt.name,
      slot: `${bookingDate} (${selectedSlot})`,
    });

    setSelectedCourt(null);
  };

  return (
    <div className="py-6 sm:py-10 px-3.5 sm:px-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
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

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-wider">
              <span>⚽</span>
              <span>Woxsen Sports Arena & Court Booking</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Reserve Badminton, Tennis & Football Courts
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Book hourly court slots, request sports rackets/balls, and receive digital entry passcodes for the Woxsen sports arena.
          </p>
        </div>

        <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-xs font-extrabold flex items-center gap-2 shrink-0">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Woxsen Sports Guard Passcode Engine</span>
        </div>
      </div>

      {/* Booking Confirmation Notice */}
      {confirmedBooking && (
        <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-500 text-amber-950 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                🏆
              </div>
              <div>
                <h3 className="text-lg font-black text-amber-950">Court Slot Confirmed!</h3>
                <p className="text-xs text-amber-900 font-bold">{confirmedBooking.courtName} • {confirmedBooking.slot}</p>
              </div>
            </div>
            <button
              onClick={() => setConfirmedBooking(null)}
              className="text-xs font-black uppercase px-3 py-1.5 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Arena Entry Passcode</span>
              <span className="text-2xl font-black font-mono text-amber-700">{confirmedBooking.passcode}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Present this passcode to the sports arena guard for court entry & equipment issuing.</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center gap-2 text-xs font-bold text-slate-700">
              <QrCode className="w-8 h-8 text-slate-800" />
              <span>Sports Arena Gate Pass</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search badminton, tennis, turf..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 shadow-xs"
          />
        </div>

        {/* Sport Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: 'all', label: 'All Courts' },
            { id: 'badminton', label: '🏸 Badminton' },
            { id: 'tennis', label: '🎾 Tennis' },
            { id: 'football', label: '⚽ Football & Turf' },
            { id: 'basketball', label: '🏀 Basketball' },
            { id: 'squash', label: '🎾 Squash' },
            { id: 'tt', label: '🏓 Table Tennis' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedSport(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedSport === cat.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Courts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourts.map((court) => (
          <div
            key={court.id}
            className="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={court.image}
                  alt={court.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {court.floodlights && (
                  <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    💡 Floodlight Arena
                  </span>
                )}
              </div>

              <div className="p-5 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors">
                    {court.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>{court.location}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {court.description}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-bold flex items-center gap-2">
                  <span>🎾 Equipment:</span>
                  <span className="text-slate-500 font-medium truncate">{court.equipmentAvailable}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 space-y-3 mt-3">
              {isManagerRole ? (
                /* MANAGER VIEW: FACILITY BOOKINGS, PLAYER PROFILES & RESERVED TIMINGS */
                <div className="space-y-3">
                  <div className="text-[10px] font-black text-amber-700 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-amber-600" />
                      <span>Today's Bookings ({court.bookedSlots.length})</span>
                    </span>
                    <span className="font-mono font-bold text-slate-500">Active Directory</span>
                  </div>

                  {court.bookedSlots.length === 0 ? (
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <p className="text-[11px] font-semibold text-slate-500">No active bookings reserved for this court today.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {court.bookedSlots.map((b) => (
                        <div key={b.passcode} className="p-3 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-black text-amber-950 bg-amber-200 px-2 py-0.5 rounded">
                              {b.passcode}
                            </span>
                            <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              {b.status.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="space-y-0.5">
                            <p className="font-black text-slate-900">{b.studentName} ({b.studentRollNo})</p>
                            <p className="text-[10px] text-slate-600 font-bold">Room: {b.studentRoom}</p>
                            <p className="text-[11px] font-bold text-amber-950 font-mono">Reserved Slot: {b.slotTime}</p>
                            <p className="text-[10px] text-slate-500">Equipment: {b.equipment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Link
                    href="/sports/portal"
                    className="w-full py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Open Sports Gate Terminal</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                /* STUDENT VIEW: BOOK COURT SLOT BUTTON */
                <>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Available Slots Today</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {court.availableSlots.map((slot) => (
                      <span
                        key={slot}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-extrabold border border-slate-200"
                      >
                        {slot}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedCourt(court);
                      setSelectedSlot(court.availableSlots[0]);
                    }}
                    className="w-full py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/20 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Book Court Slot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedCourt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Book Sports Court</span>
                <h3 className="text-xl font-black text-slate-900">{selectedCourt.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCourt(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Booking Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Court Hourly Slot</label>
                <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                  {selectedCourt.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-red-600 text-white shadow-md font-black'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needEquipment}
                    onChange={(e) => setNeedEquipment(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-600"
                  />
                  <span>Request Sports Gear (Rackets / Balls) at Arena Desk</span>
                </label>
                <p className="text-[10px] text-slate-500 pl-6">{selectedCourt.equipmentAvailable}</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCourt(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/30 cursor-pointer"
                >
                  Confirm Court Slot & Get Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
