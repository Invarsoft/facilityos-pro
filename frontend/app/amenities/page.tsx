'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Building2,
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
} from 'lucide-react';

interface AmenityItem {
  id: string;
  name: string;
  category: 'study' | 'recreation' | 'fitness' | 'music' | 'meeting';
  location: string;
  capacity: string;
  image: string;
  description: string;
  availableSlots: string[];
  status: 'available' | 'full' | 'maintenance';
}

const DEMO_AMENITIES: AmenityItem[] = [
  {
    id: 'am-1',
    name: 'Executive Quiet Study Suite',
    category: 'study',
    location: 'Tower T1 & T4 — Ground Floor',
    capacity: '24 Study Desk Pods',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80',
    description: 'High-speed Wi-Fi, silent study pods, individual power outlets, and ergonomic chairs.',
    availableSlots: ['09:00 AM - 11:00 AM', '11:30 AM - 01:30 PM', '03:00 PM - 05:00 PM', '08:00 PM - 11:00 PM'],
    status: 'available',
  },
  {
    id: 'am-2',
    name: 'Group Project Discussion Pods',
    category: 'meeting',
    location: 'Hostel Block B & E — Common Lounge',
    capacity: '6 Members per Pod',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&auto=format&fit=crop&q=80',
    description: 'Acoustic glass whiteboard pods equipped with 55" display TV for team presentations.',
    availableSlots: ['10:00 AM - 12:00 PM', '02:00 PM - 04:00 PM', '06:00 PM - 08:00 PM'],
    status: 'available',
  },
  {
    id: 'am-3',
    name: 'Hostel Recreation & Indoor Games',
    category: 'recreation',
    location: 'Block D & Tower T2 — Sports Deck',
    capacity: '15 Active Players',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    description: 'Table Tennis tables, Foosball, Carrom boards, and Playstation 5 gaming lounge.',
    availableSlots: ['04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM', '08:00 PM - 10:00 PM'],
    status: 'available',
  },
  {
    id: 'am-4',
    name: 'Campus Fitness & Weight Training Suite',
    category: 'fitness',
    location: 'Woxsen Sports Complex — Level 1',
    capacity: '30 Athletes per Slot',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    description: 'Modern Technogym cardio equipment, free weights, squat racks, and AC environment.',
    availableSlots: ['06:00 AM - 08:00 AM', '08:00 AM - 10:00 AM', '05:00 PM - 07:00 PM', '07:00 PM - 09:00 PM'],
    status: 'available',
  },
  {
    id: 'am-5',
    name: 'Acoustic Music & Jamming Studio',
    category: 'music',
    location: 'Student Activity Center — Basement 1',
    capacity: '8 Musicians',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&auto=format&fit=crop&q=80',
    description: 'Soundproofed studio with acoustic drum kit, amplifiers, keyboards, and recording mic.',
    availableSlots: ['02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM', '08:00 PM - 10:00 PM'],
    status: 'available',
  },
];

export default function AmenitiesBookingPage() {
  const router = useRouter();
  const { currentUser, activeOrg } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Booking Modal State
  const [selectedAmenity, setSelectedAmenity] = useState<AmenityItem | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('2026-09-03');
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{ passcode: string; amenityName: string; slot: string } | null>(null);

  const filteredAmenities = DEMO_AMENITIES.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmenity || !selectedSlot) return;

    const randomPasscode = `WX-${Math.floor(1000 + Math.random() * 9000)}`;

    setConfirmedBooking({
      passcode: randomPasscode,
      amenityName: selectedAmenity.name,
      slot: `${bookingDate} (${selectedSlot})`,
    });

    setSelectedAmenity(null);
  };

  return (
    <div className="py-6 sm:py-10 px-3.5 sm:px-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
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
              <span>📅</span>
              <span>Campus Amenities & Space Booking</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Reserve Study Rooms & Campus Lounges
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Book slots for quiet study pods, group discussion lounges, sports courts, and music studios with instant digital passcodes.
          </p>
        </div>

        <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-xs font-extrabold flex items-center gap-2 shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>Woxsen Passcode Verification Engine</span>
        </div>
      </div>

      {/* Confirmation Success Modal */}
      {confirmedBooking && (
        <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 space-y-4 shadow-xl animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-950">Booking Confirmed!</h3>
                <p className="text-xs text-emerald-800 font-bold">{confirmedBooking.amenityName} • {confirmedBooking.slot}</p>
              </div>
            </div>
            <button
              onClick={() => setConfirmedBooking(null)}
              className="text-xs font-black uppercase px-3 py-1.5 rounded-xl bg-emerald-200 hover:bg-emerald-300 text-emerald-900 cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">Entry Access Passcode</span>
              <span className="text-2xl font-black font-mono text-emerald-700">{confirmedBooking.passcode}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">Show this passcode at the amenity reception or scan QR for entry.</p>
            </div>
            <div className="p-2 rounded-xl bg-slate-100 border border-slate-200 shrink-0 flex items-center gap-2 text-xs font-bold text-slate-700">
              <QrCode className="w-8 h-8 text-slate-800" />
              <span>Digital Access Pass</span>
            </div>
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study rooms, lounges, gym..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 shadow-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {[
            { id: 'all', label: 'All Spaces' },
            { id: 'study', label: '📖 Study Suites' },
            { id: 'meeting', label: '👥 Discussion Pods' },
            { id: 'recreation', label: '🎮 Recreation' },
            { id: 'fitness', label: '🏋️ Gym & Fitness' },
            { id: 'music', label: '🎵 Music Studio' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAmenities.map((amenity) => (
          <div
            key={amenity.id}
            className="rounded-3xl bg-white border border-slate-200 shadow-lg overflow-hidden flex flex-col justify-between group hover:shadow-2xl transition-all"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <img
                  src={amenity.image}
                  alt={amenity.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider">
                  {amenity.capacity}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors">
                    {amenity.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    <span>{amenity.location}</span>
                  </p>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {amenity.description}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 space-y-3 mt-3">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Available Slots Today</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {amenity.availableSlots.map((slot) => (
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
                  setSelectedAmenity(amenity);
                  setSelectedSlot(amenity.availableSlots[0]);
                }}
                className="w-full py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/20 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Reserve Slot Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* BOOKING MODAL */}
      {selectedAmenity && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Reserve Amenity Slot</span>
                <h3 className="text-xl font-black text-slate-900">{selectedAmenity.name}</h3>
              </div>
              <button
                onClick={() => setSelectedAmenity(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Date</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Select Time Slot</label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedAmenity.availableSlots.map((slot) => (
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

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 font-medium">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-red-600" />
                  <span>Reserved for: {currentUser?.name} ({currentUser?.email})</span>
                </div>
                <p className="text-[11px] text-slate-500">Entry passcodes are linked to your Woxsen domain account.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAmenity(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/30 cursor-pointer"
                >
                  Confirm Reservation & Get Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
