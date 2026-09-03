'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { formatStatusLabel, getStatusColorClass, getPriorityBadge } from '@/lib/utils';
import {
  Search,
  Filter,
  ArrowRight,
  PlusCircle,
  Wrench,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Package,
  Trophy,
  Calendar,
  MapPin,
  QrCode,
  Truck,
  Building2,
  Sparkles,
  Utensils,
  Shirt,
} from 'lucide-react';

export default function RequestsListPage() {
  const router = useRouter();
  const { getFilteredTickets, activeOrg, currentUser, activeRole } = useApp();
  const tickets = getFilteredTickets();

  useEffect(() => {
    const role = currentUser?.role || activeRole;
    if (role === 'courier_manager') {
      router.push('/courier/portal');
    } else if (role === 'sports_manager') {
      router.push('/sports/portal');
    } else if (role === 'warden' || role === 'manager') {
      router.push('/manager');
    } else if (role === 'worker' || role === 'technician') {
      router.push('/worker');
    }
  }, [currentUser, activeRole, router]);

  // Filter Tabs: 'all' | 'maintenance' | 'courier' | 'sports' | 'amenities' | 'food' | 'laundry'
  const [requestTypeTab, setRequestTypeTab] = useState<'all' | 'maintenance' | 'courier' | 'sports' | 'amenities' | 'food' | 'laundry'>('all');
  const [search, setSearch] = useState('');
  const [statusCategory, setStatusCategory] = useState<'all' | 'active' | 'action_needed' | 'closed'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Unified Demo Courier Parcels for Aarav Sharma / Current User
  const studentParcels = [
    {
      id: 'PCL-9041',
      type: 'courier' as const,
      title: 'Amazon Courier Parcel Arrived',
      subtitle: 'Tracking AWB: TBA309482019 • Shelf A-14 (Main Gate Mailroom)',
      courierPartner: 'Amazon',
      location: 'Main Gate Mailroom',
      arrivedAt: 'Today, 11:30 AM',
      pickupOtp: '8492',
      status: 'pending',
      href: '/courier',
    },
    {
      id: 'PCL-9042',
      type: 'courier' as const,
      title: 'Flipkart Delivery Package Arrived',
      subtitle: 'Tracking AWB: FMPP04928104 • Shelf B-08 (Main Gate Mailroom)',
      courierPartner: 'Flipkart',
      location: 'Main Gate Mailroom',
      arrivedAt: 'Today, 02:15 PM',
      pickupOtp: '3910',
      status: 'pending',
      href: '/courier',
    },
  ];

  // Unified Demo Sports Court Bookings
  const studentSportsBookings = [
    {
      id: 'SPT-9041',
      type: 'sports' as const,
      title: 'Indoor Synthetic Badminton Court 1 & 2',
      subtitle: 'Slot: Today (06:00 PM - 07:00 PM) • Gear: Yonex Rackets & Shuttles',
      location: 'Woxsen Indoor Sports Complex — Level 1',
      passcode: 'SPT-9041',
      status: 'confirmed',
      href: '/sports',
    },
    {
      id: 'SPT-9042',
      type: 'sports' as const,
      title: 'AstroTurf 5-a-Side Football & Cricket Pitch',
      subtitle: 'Slot: Tomorrow (06:30 PM - 08:00 PM) • Floodlight Match Arena',
      location: 'Woxsen Main Sports Arena',
      passcode: 'SPT-9042',
      status: 'confirmed',
      href: '/sports',
    },
  ];

  // Unified Demo Amenities Bookings
  const studentAmenityBookings = [
    {
      id: 'AM-9041',
      type: 'amenities' as const,
      title: 'Executive Quiet Study Suite Pod',
      subtitle: 'Slot: Today (08:00 PM - 11:00 PM) • Silent Pod #04',
      location: 'Tower T1 & T4 — Ground Floor',
      passcode: 'WX-8492',
      status: 'confirmed',
      href: '/amenities',
    },
  ];

  // Unified Demo Food Token Orders
  const studentFoodOrders = [
    {
      id: 'FOOD-8401',
      type: 'food' as const,
      title: 'KFC-Style Crispy Chicken Bucket (6 Pcs)',
      subtitle: 'Outlet: Woxsen Crispy Crunch (KFC Style) • Total Amount: ₹340',
      location: 'Academic Block B Plaza',
      tokenCode: 'TK-9402',
      status: 'ready',
      href: '/food',
    },
    {
      id: 'FOOD-8395',
      type: 'food' as const,
      title: 'Schezwan Chicken Fried Rice Bowl',
      subtitle: 'Outlet: Woxsen Asian Wok & Rice Bowl • Total Amount: ₹190',
      location: 'Central Food Court — Counter 1',
      tokenCode: 'TK-8109',
      status: 'collected',
      href: '/food',
    },
  ];

  // Unified Demo Laundry Bookings
  const studentLaundryBookings = [
    {
      id: 'LND-501',
      type: 'laundry' as const,
      title: 'Express Wash & Tumble Dry (12 Clothes, 4.5 kg)',
      subtitle: 'Location: Hostel Central Washer Bay — Washer 3 • Slot: Today 04:00 PM',
      location: 'Hostel Central Washer Bay',
      laundryBarcode: 'LND-TAG-9041',
      status: 'in_wash',
      href: '/laundry',
    },
    {
      id: 'LND-488',
      type: 'laundry' as const,
      title: 'Heavy Wash (Bedding & Jackets) (15 Clothes, 6.0 kg)',
      subtitle: 'Location: Hostel Central Washer Bay • Completed & Handed Over',
      location: 'Hostel Central Washer Bay',
      laundryBarcode: 'LND-TAG-8812',
      status: 'collected',
      href: '/laundry',
    },
  ];

  // Filter maintenance tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()) ||
      t.requesterName.toLowerCase().includes(search.toLowerCase());

    let matchesCategory = true;
    if (statusCategory === 'active') {
      matchesCategory = t.status !== 'closed' && t.status !== 'resolved';
    } else if (statusCategory === 'action_needed') {
      matchesCategory = t.status === 'awaiting_verification' || t.status === 'reopened' || t.status === 'escalated';
    } else if (statusCategory === 'closed') {
      matchesCategory = t.status === 'closed' || t.status === 'resolved';
    }

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
  });

  const totalCount = tickets.length + studentParcels.length + studentSportsBookings.length + studentAmenityBookings.length + studentFoodOrders.length + studentLaundryBookings.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            My Requests & Bookings Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
            Unified status hub for maintenance work orders, courier deliveries, sports court bookings, food tokens, and laundry slots.
          </p>
        </div>
      </div>

      {/* MASTER SERVICE TYPE SWITCHER TABS (INCLUDES FOOD & LAUNDRY) */}
      <div className="p-3 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-2">
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 pt-1">
          Filter Request & Booking Type
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setRequestTypeTab('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              requestTypeTab === 'all'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>All ({totalCount})</span>
          </button>

          <button
            onClick={() => setRequestTypeTab('maintenance')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              requestTypeTab === 'maintenance'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Maintenance ({tickets.length})</span>
          </button>

          <button
            onClick={() => setRequestTypeTab('courier')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              requestTypeTab === 'courier'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Couriers ({studentParcels.length})</span>
          </button>

          <button
            onClick={() => setRequestTypeTab('sports')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              requestTypeTab === 'sports'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Sports ({studentSportsBookings.length})</span>
          </button>

          <button
            onClick={() => setRequestTypeTab('amenities')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              requestTypeTab === 'amenities'
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Amenities ({studentAmenityBookings.length})</span>
          </button>

          <button
            onClick={() => setRequestTypeTab('food')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              requestTypeTab === 'food'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Food Tokens ({studentFoodOrders.length})</span>
          </button>

          <button
            onClick={() => setRequestTypeTab('laundry')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
              requestTypeTab === 'laundry'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Laundry ({studentLaundryBookings.length})</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: FOOD ORDERS (WHEN ALL OR FOOD SELECTED) */}
      {(requestTypeTab === 'all' || requestTypeTab === 'food') && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-600" />
              <span>Food Court Pickup Tokens ({studentFoodOrders.length})</span>
            </h2>
            <Link href="/food" className="text-xs font-bold text-amber-600 hover:underline">
              Order Food →
            </Link>
          </div>

          <div className="space-y-3">
            {studentFoodOrders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                      TOKEN: {ord.tokenCode}
                    </span>
                    <span className="font-mono text-xs font-black text-slate-700 bg-white px-2 py-0.5 rounded border">{ord.id}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{ord.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{ord.subtitle}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${ord.status === 'ready' ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-amber-100 text-amber-950'}`}>
                    {ord.status === 'ready' ? '🍽️ Ready for Pickup' : '✓ Completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: LAUNDRY BOOKINGS (WHEN ALL OR LAUNDRY SELECTED) */}
      {(requestTypeTab === 'all' || requestTypeTab === 'laundry') && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Shirt className="w-5 h-5 text-blue-600" />
              <span>Hostel Laundry Batches ({studentLaundryBookings.length})</span>
            </h2>
            <Link href="/laundry" className="text-xs font-bold text-blue-600 hover:underline">
              Book Washer Slot →
            </Link>
          </div>

          <div className="space-y-3">
            {studentLaundryBookings.map((lnd) => (
              <div key={lnd.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-blue-950 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-300">
                      TAG: {lnd.laundryBarcode}
                    </span>
                    <span className="font-mono text-xs font-black text-slate-700 bg-white px-2 py-0.5 rounded border">{lnd.id}</span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{lnd.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{lnd.subtitle}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${lnd.status === 'in_wash' ? 'bg-blue-100 text-blue-950 border border-blue-300' : 'bg-slate-200 text-slate-800'}`}>
                    {lnd.status === 'in_wash' ? '🧼 In Wash Cycle' : '✓ Completed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: COURIER PARCELS (WHEN ALL OR COURIER SELECTED) */}
      {(requestTypeTab === 'all' || requestTypeTab === 'courier') && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              <span>Arrived Courier Packages ({studentParcels.length})</span>
            </h2>
            <Link href="/courier" className="text-xs font-bold text-blue-600 hover:underline">
              Open Mailroom →
            </Link>
          </div>

          <div className="space-y-3">
            {studentParcels.map((pcl) => (
              <div key={pcl.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-blue-950 bg-blue-100 px-2.5 py-0.5 rounded border border-blue-300">
                      {pcl.id}
                    </span>
                    <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      📦 ARRIVED AT MAILROOM
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{pcl.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{pcl.subtitle}</p>
                </div>

                <div className="p-3 rounded-xl bg-blue-100 border border-blue-300 text-blue-950 text-center">
                  <span className="text-[9px] font-black uppercase tracking-wider block">Pickup OTP</span>
                  <span className="font-mono text-base font-black tracking-widest">{pcl.pickupOtp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: SPORTS BOOKINGS (WHEN ALL OR SPORTS SELECTED) */}
      {(requestTypeTab === 'all' || requestTypeTab === 'sports') && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span>Sports Court Reservations ({studentSportsBookings.length})</span>
            </h2>
            <Link href="/sports" className="text-xs font-bold text-amber-600 hover:underline">
              Book Sports Court →
            </Link>
          </div>

          <div className="space-y-3">
            {studentSportsBookings.map((spt) => (
              <div key={spt.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                      {spt.id}
                    </span>
                    <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      ✓ COURT RESERVED
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{spt.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{spt.subtitle}</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 text-center">
                  <span className="text-[9px] font-black uppercase tracking-wider block">Passcode</span>
                  <span className="font-mono text-sm font-black">{spt.passcode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: AMENITIES BOOKINGS (WHEN ALL OR AMENITIES SELECTED) */}
      {(requestTypeTab === 'all' || requestTypeTab === 'amenities') && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-600" />
              <span>Space & Study Lounge Reservations ({studentAmenityBookings.length})</span>
            </h2>
            <Link href="/amenities" className="text-xs font-bold text-violet-600 hover:underline">
              Reserve Study Lounges →
            </Link>
          </div>

          <div className="space-y-3">
            {studentAmenityBookings.map((am) => (
              <div key={am.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-violet-950 bg-violet-100 px-2.5 py-0.5 rounded border border-violet-300">
                      {am.id}
                    </span>
                    <span className="text-[10px] font-black uppercase text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      ✓ POD RESERVED
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-slate-900">{am.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{am.subtitle}</p>
                </div>

                <div className="p-3 rounded-xl bg-violet-100 border border-violet-300 text-violet-950 text-center">
                  <span className="text-[9px] font-black uppercase tracking-wider block">Lock Passcode</span>
                  <span className="font-mono text-sm font-black">{am.passcode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: MAINTENANCE TICKETS (WHEN ALL OR MAINTENANCE SELECTED) */}
      {(requestTypeTab === 'all' || requestTypeTab === 'maintenance') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-red-600" />
              <span>Hostel Maintenance Tickets ({filteredTickets.length})</span>
            </h2>
          </div>

          {/* Maintenance Ticket List */}
          <div className="space-y-3">
            {filteredTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/requests/${ticket.id}`}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-red-600 shadow-md hover:shadow-xl transition-all block group"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded border">
                        {ticket.id}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusColorClass(ticket.status)}`}>
                        {formatStatusLabel(ticket.status)}
                      </span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        {ticket.location}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 group-hover:text-red-600 transition-colors">
                      {ticket.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold line-clamp-1">{ticket.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
