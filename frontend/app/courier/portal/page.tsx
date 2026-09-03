'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  Package,
  QrCode,
  CheckCircle2,
  Clock,
  PlusCircle,
  Search,
  Building2,
  UserCheck,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Check,
  AlertCircle,
  FileImage,
  Layers,
  Inbox,
  ShieldAlert,
  Archive,
  BarChart3,
  Sparkles,
} from 'lucide-react';

interface StaffParcelItem {
  id: string; // PCL-9041
  studentName: string;
  studentRollNo: string;
  studentPhone: string;
  hostelRoom: string;
  courierPartner: 'Amazon' | 'Flipkart' | 'BlueDart' | 'DTDC' | 'FedEx' | 'Myntra' | 'Other';
  trackingNumber: string;
  expectedDeliveryDate?: string;
  proofScreenshotUrl?: string;
  shelfLocation: string;
  arrivedAt: string;
  pickupOtp: string;
  status: 'pre_delivery_requested' | 'pending' | 'collected';
  requestInitiatedBy: 'student' | 'mailroom';
  collectedAt?: string;
  staffOperator?: string;
}

const INITIAL_STAFF_PARCELS: StaffParcelItem[] = [
  {
    id: 'PCL-9045',
    studentName: 'Aarav Sharma',
    studentRollNo: 'WOX-2026-84920',
    studentPhone: '+91 98765 43210',
    hostelRoom: 'Tower T1 - Room 502',
    courierPartner: 'Myntra',
    trackingNumber: 'MYN840291049',
    expectedDeliveryDate: '2026-09-03',
    proofScreenshotUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=80',
    shelfLocation: 'Awaiting Gate Intake',
    arrivedAt: 'Pre-Delivery Request Submitted',
    pickupOtp: '7412',
    status: 'pre_delivery_requested',
    requestInitiatedBy: 'student',
  },
  {
    id: 'PCL-9041',
    studentName: 'Aarav Sharma',
    studentRollNo: 'WOX-2026-84920',
    studentPhone: '+91 98765 43210',
    hostelRoom: 'Tower T1 - Room 502',
    courierPartner: 'Amazon',
    trackingNumber: 'TBA309482019',
    shelfLocation: 'Shelf A-14',
    arrivedAt: 'Today, 11:30 AM',
    pickupOtp: '8492',
    status: 'pending',
    requestInitiatedBy: 'student',
    staffOperator: 'Officer Ramesh Kumar',
  },
  {
    id: 'PCL-9042',
    studentName: 'Aarav Sharma',
    studentRollNo: 'WOX-2026-84920',
    studentPhone: '+91 98765 43210',
    hostelRoom: 'Tower T1 - Room 502',
    courierPartner: 'Flipkart',
    trackingNumber: 'FMPP04928104',
    shelfLocation: 'Shelf B-08',
    arrivedAt: 'Today, 02:15 PM',
    pickupOtp: '3910',
    status: 'pending',
    requestInitiatedBy: 'mailroom',
    staffOperator: 'Officer Ramesh Kumar',
  },
  {
    id: 'PCL-9038',
    studentName: 'K. Aditya Reddy',
    studentRollNo: '24WU0102240',
    studentPhone: '+91 91234 56789',
    hostelRoom: 'Block B - Room 204',
    courierPartner: 'BlueDart',
    trackingNumber: 'BD749201948',
    shelfLocation: 'Shelf C-03',
    arrivedAt: 'Yesterday, 04:00 PM',
    pickupOtp: '5019',
    status: 'collected',
    requestInitiatedBy: 'mailroom',
    collectedAt: 'Yesterday, 06:20 PM',
    staffOperator: 'Officer Ramesh Kumar',
  },
];

export default function CourierRoomStaffPortalPage() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [parcels, setParcels] = useState<StaffParcelItem[]>(INITIAL_STAFF_PARCELS);
  const [deskTab, setDeskTab] = useState<'checkout' | 'pre_delivery' | 'intake' | 'inventory' | 'history'>('checkout');
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // WORKSTATION 1: Quick Verification Checkout State
  const [checkoutParcelId, setCheckoutParcelId] = useState('');
  const [checkoutOtp, setCheckoutOtp] = useState('');

  // WORKSTATION 2: On-Spot Intake State
  const [intakeStudentName, setIntakeStudentName] = useState('');
  const [intakeRollNo, setIntakeRollNo] = useState('');
  const [intakePhone, setIntakePhone] = useState('');
  const [intakeHostelRoom, setIntakeHostelRoom] = useState('');
  const [intakeCourierPartner, setIntakeCourierPartner] = useState<StaffParcelItem['courierPartner']>('Amazon');
  const [intakeTrackingNo, setIntakeTrackingNo] = useState('');
  const [intakeShelf, setIntakeShelf] = useState('Shelf A-01');

  // WORKSTATION 3: Assign Shelf State
  const [selectedPreReq, setSelectedPreReq] = useState<StaffParcelItem | null>(null);
  const [assignedShelf, setAssignedShelf] = useState('Shelf A-15');

  // Stats
  const pendingPickupCount = parcels.filter((p) => p.status === 'pending').length;
  const preDeliveryCount = parcels.filter((p) => p.status === 'pre_delivery_requested').length;
  const collectedCount = parcels.filter((p) => p.status === 'collected').length;

  // WORKSTATION 1 SUBMIT: OTP Checkout & Close Ticket
  const handleVerifyCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutParcelId || !checkoutOtp) return;

    const matched = parcels.find(
      (p) =>
        (p.id.toLowerCase() === checkoutParcelId.trim().toLowerCase() ||
          p.trackingNumber.toLowerCase() === checkoutParcelId.trim().toLowerCase()) &&
        p.status === 'pending'
    );

    if (!matched) {
      alert(`No active pending parcel found matching ID/AWB "${checkoutParcelId}".`);
      return;
    }

    if (matched.pickupOtp !== checkoutOtp.trim()) {
      alert(`Invalid 4-Digit OTP. Correct OTP is required to hand over parcel.`);
      return;
    }

    setParcels(
      parcels.map((p) =>
        p.id === matched.id
          ? {
              ...p,
              status: 'collected',
              collectedAt: 'Just now',
              staffOperator: currentUser?.name || 'Mailroom Officer',
            }
          : p
      )
    );

    setNotice(`SUCCESS: Parcel ${matched.id} (${matched.courierPartner}) handed over to ${matched.studentName}. Ticket CLOSED & archived.`);
    setCheckoutParcelId('');
    setCheckoutOtp('');
  };

  // WORKSTATION 2 SUBMIT: On-Spot Intake
  const handleOnSpotIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intakeStudentName || !intakeTrackingNo) return;

    const generatedOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `PCL-${Math.floor(9000 + Math.random() * 999)}`;

    const newParcel: StaffParcelItem = {
      id: newId,
      studentName: intakeStudentName,
      studentRollNo: intakeRollNo || 'WOX-2026-REG',
      studentPhone: intakePhone || '+91 98765 43210',
      hostelRoom: intakeHostelRoom || 'Hostel Block A',
      courierPartner: intakeCourierPartner,
      trackingNumber: intakeTrackingNo,
      shelfLocation: intakeShelf,
      arrivedAt: 'Just now',
      pickupOtp: generatedOtp,
      status: 'pending',
      requestInitiatedBy: 'mailroom',
      staffOperator: currentUser?.name || 'Mailroom Officer',
    };

    setParcels([newParcel, ...parcels]);
    setNotice(`Intake Complete! Parcel Receiving ID ${newId} logged at ${intakeShelf}. OTP ${generatedOtp} sent to ${intakeStudentName}.`);
    
    // Reset
    setIntakeStudentName('');
    setIntakeRollNo('');
    setIntakePhone('');
    setIntakeHostelRoom('');
    setIntakeTrackingNo('');
  };

  // WORKSTATION 3 SUBMIT: Accept Pre-Delivery & Assign Shelf
  const handleAcceptPreDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPreReq) return;

    setParcels(
      parcels.map((p) =>
        p.id === selectedPreReq.id
          ? {
              ...p,
              status: 'pending',
              shelfLocation: assignedShelf,
              arrivedAt: 'Arrived at Gate Mailroom',
              staffOperator: currentUser?.name || 'Mailroom Officer',
            }
          : p
      )
    );

    setNotice(`Pre-Delivery Request ${selectedPreReq.id} ACCEPTED! Shelf ${assignedShelf} assigned.`);
    setSelectedPreReq(null);
  };

  const filteredList = parcels.filter((p) => {
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hostelRoom.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="py-6 sm:py-10 px-3.5 sm:px-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER STAFF PORTAL HERO */}
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

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-md">
              <span>🏬</span>
              <span>Courier Room & Mailroom Staff Desk</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Campus Courier Operations Terminal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Staff Workstation for Pre-Delivery Approvals, On-Spot Gate Intake, Student OTP Verification, and Shelf Inventory Management.
          </p>
        </div>

        <Link
          href="/courier"
          className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs border border-white/20 shadow-md shrink-0 uppercase tracking-wider"
        >
          View Student Courier Page →
        </Link>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">Ready for Pickup</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-amber-600">{pendingPickupCount}</span>
            <Package className="w-6 h-6 text-amber-500" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">Awaiting Student OTP</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">Pre-Delivery Requests</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-blue-600">{preDeliveryCount}</span>
            <Inbox className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">Pending Staff Approval</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">Total Collected Today</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-emerald-600">{collectedCount}</span>
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">Closed & Archived</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-1">
          <span className="text-[10px] font-black uppercase text-slate-400">Mailroom Shelves</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-purple-600">42 / 120</span>
            <Building2 className="w-6 h-6 text-purple-500" />
          </div>
          <span className="text-[10px] text-slate-500 font-semibold block">35% Capacity Occupied</span>
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

      {/* STAFF WORKSTATIONS SWITCHER */}
      <div className="p-2 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-2">
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 pt-1">
          Select Staff Operations Workstation
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <button
            onClick={() => setDeskTab('checkout')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              deskTab === 'checkout'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>🔑 OTP Checkout Desk</span>
          </button>

          <button
            onClick={() => setDeskTab('pre_delivery')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              deskTab === 'pre_delivery'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>📩 Approve Pre-Requests ({preDeliveryCount})</span>
          </button>

          <button
            onClick={() => setDeskTab('intake')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              deskTab === 'intake'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>🚚 Gate On-Spot Intake</span>
          </button>

          <button
            onClick={() => setDeskTab('inventory')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              deskTab === 'inventory'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>🏢 Shelf Inventory</span>
          </button>

          <button
            onClick={() => setDeskTab('history')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              deskTab === 'history'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>📋 Closed Tickets Log</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      // WORKSTATION 1: VERIFIED OTP CHECKOUT DESK
      {/* =================================================================== */}
      {deskTab === 'checkout' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Keypad Form */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5 lg:col-span-1">
            <div className="space-y-1 border-b border-slate-100 pb-3">
              <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Fast Checkout Terminal</span>
              <h3 className="text-base font-black text-slate-900">Verify OTP & Hand Over Parcel</h3>
            </div>

            <form onSubmit={handleVerifyCheckoutSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Parcel ID or Order AWB *</label>
                <input
                  type="text"
                  required
                  value={checkoutParcelId}
                  onChange={(e) => setCheckoutParcelId(e.target.value)}
                  placeholder="e.g. PCL-9041 or TBA309482019"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Student 4-Digit OTP *</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={checkoutOtp}
                  onChange={(e) => setCheckoutOtp(e.target.value)}
                  placeholder="e.g. 8492"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-center font-mono font-black text-2xl text-slate-900 tracking-widest focus:ring-2 focus:ring-red-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 cursor-pointer transition-transform active:scale-95"
              >
                Verify OTP & Hand Over Parcel
              </button>
            </form>
          </div>

          {/* Active Pending Pickups List */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-red-600" />
                <span>Parcels Ready on Shelves ({pendingPickupCount})</span>
              </h3>
            </div>

            <div className="space-y-3">
              {parcels
                .filter((p) => p.status === 'pending')
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                          {item.id}
                        </span>
                        <span className="text-[10px] font-black text-red-700 uppercase bg-red-100 px-2 py-0.5 rounded">
                          {item.courierPartner}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 font-mono">Order: {item.trackingNumber}</span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900">{item.studentName} ({item.hostelRoom})</h4>
                      <p className="text-xs font-bold text-red-700">Location: {item.shelfLocation}</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between border-t sm:border-0 border-slate-200 pt-2 sm:pt-0">
                      <div className="text-right">
                        <span className="text-[9px] font-black uppercase text-slate-400 block">OTP Code</span>
                        <span className="text-base font-black font-mono text-emerald-700">{item.pickupOtp}</span>
                      </div>

                      <button
                        onClick={() => {
                          setCheckoutParcelId(item.id);
                          setCheckoutOtp(item.pickupOtp);
                        }}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-xs cursor-pointer"
                      >
                        Quick Select
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      // WORKSTATION 2: APPROVE STUDENT PRE-DELIVERY REQUESTS
      {/* =================================================================== */}
      {deskTab === 'pre_delivery' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-5 max-w-4xl mx-auto">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Student Pre-Delivery Approvals</span>
            <h3 className="text-base font-black text-slate-900">Review Proof & Assign Shelf Location</h3>
          </div>

          {preDeliveryCount === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
              <p className="text-xs font-semibold text-slate-500">No pending student pre-delivery requests.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parcels
                .filter((p) => p.status === 'pre_delivery_requested')
                .map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-amber-950 bg-amber-200 px-2.5 py-0.5 rounded">{item.id}</span>
                      <span className="text-[10px] font-black text-red-700 uppercase bg-red-100 px-2 py-0.5 rounded">{item.courierPartner}</span>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900">{item.studentName} ({item.hostelRoom})</h4>
                      <p className="text-xs font-mono text-slate-600">Order ID: {item.trackingNumber}</p>
                      <p className="text-[11px] font-bold text-slate-500 mt-0.5">Expected: {item.expectedDeliveryDate}</p>
                    </div>

                    {item.proofScreenshotUrl && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase text-slate-500">Uploaded Order Screenshot Proof</span>
                        <img src={item.proofScreenshotUrl} alt="Proof" className="w-full h-28 object-cover rounded-xl border border-amber-300" />
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setSelectedPreReq(item);
                        setAssignedShelf('Shelf A-15');
                      }}
                      className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
                    >
                      Accept Request & Assign Shelf
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      // WORKSTATION 3: ON-SPOT GATE INTAKE FORM
      {/* =================================================================== */}
      {deskTab === 'intake' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 max-w-2xl mx-auto">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Gate Courier Intake Terminal</span>
            <h2 className="text-xl font-black text-slate-900">Log Arrived Parcel & Send Student Receiving ID + OTP</h2>
            <p className="text-xs text-slate-500 font-semibold">
              Enter courier details from the package box label to notify student instantly.
            </p>
          </div>

          <form onSubmit={handleOnSpotIntakeSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={intakeStudentName}
                  onChange={(e) => setIntakeStudentName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Student Roll No / ID</label>
                <input
                  type="text"
                  value={intakeRollNo}
                  onChange={(e) => setIntakeRollNo(e.target.value)}
                  placeholder="e.g. WOX-2026-84920"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Student Phone Number</label>
                <input
                  type="text"
                  value={intakePhone}
                  onChange={(e) => setIntakePhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hostel Building & Room</label>
                <input
                  type="text"
                  value={intakeHostelRoom}
                  onChange={(e) => setIntakeHostelRoom(e.target.value)}
                  placeholder="e.g. Tower T1 - Room 502"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Courier Partner</label>
                <select
                  value={intakeCourierPartner}
                  onChange={(e) => setIntakeCourierPartner(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                >
                  <option value="Amazon">Amazon Courier</option>
                  <option value="Flipkart">Flipkart Logistics</option>
                  <option value="BlueDart">BlueDart Express</option>
                  <option value="DTDC">DTDC Courier</option>
                  <option value="FedEx">FedEx Express</option>
                  <option value="Myntra">Myntra Logistics</option>
                  <option value="Other">Other / Local Post</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Order ID / AWB Tracking No *</label>
                <input
                  type="text"
                  required
                  value={intakeTrackingNo}
                  onChange={(e) => setIntakeTrackingNo(e.target.value)}
                  placeholder="e.g. TBA309482019"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Assigned Mailroom Shelf Location</label>
              <input
                type="text"
                value={intakeShelf}
                onChange={(e) => setIntakeShelf(e.target.value)}
                placeholder="e.g. Shelf A-14 (Main Gate)"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 cursor-pointer transition-transform active:scale-95"
            >
              Log Parcel & Send Student Parcel Receiving ID + OTP
            </button>
          </form>
        </div>
      )}

      {/* =================================================================== */}
      // WORKSTATION 4: MAILROOM SHELF INVENTORY MATRIX
      {/* =================================================================== */}
      {deskTab === 'inventory' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-black text-slate-900">Mailroom Storage Shelves Matrix</h3>
              <p className="text-xs text-slate-500 font-semibold">Live occupancy map across Shelves A, B, C, D</p>
            </div>

            <span className="text-xs font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
              42 Shelves Occupied
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {['Shelf A-01', 'Shelf A-02', 'Shelf A-14', 'Shelf B-08', 'Shelf C-03', 'Shelf C-12', 'Shelf D-05', 'Shelf E-01'].map((shelfName, idx) => (
              <div
                key={shelfName}
                className={`p-4 rounded-2xl border text-center space-y-1 ${
                  idx < 5
                    ? 'bg-red-50 border-red-200 text-red-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <span className="text-xs font-black block">{shelfName}</span>
                <span
                  className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full inline-block ${
                    idx < 5 ? 'bg-red-600 text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {idx < 5 ? 'Occupied' : 'Free'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      // WORKSTATION 5: ARCHIVED CLOSED TICKETS LEDGER
      {/* =================================================================== */}
      {deskTab === 'history' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900">Archived Closed Tickets Ledger</h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {collectedCount} Verified Deliveries
            </span>
          </div>

          <div className="space-y-3">
            {parcels
              .filter((p) => p.status === 'collected')
              .map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-bold">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded border">{item.id}</span>
                      <span className="text-red-700 uppercase">{item.courierPartner}</span>
                      <span className="text-slate-500 font-mono">AWB: {item.trackingNumber}</span>
                    </div>
                    <p className="text-slate-900 font-black">{item.studentName} ({item.hostelRoom})</p>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-700 font-black block">✓ Verified OTP {item.pickupOtp}</span>
                    <span className="text-[10px] text-slate-500">Collected: {item.collectedAt}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN SHELF LOCATION FOR PRE-DELIVERY REQUEST */}
      {selectedPreReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Mailroom Intake Approval</span>
                <h3 className="text-lg font-black text-slate-900">Accept Request & Assign Shelf</h3>
              </div>
              <button onClick={() => setSelectedPreReq(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleAcceptPreDelivery} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Assign Mailroom Shelf Location</label>
                <input
                  type="text"
                  required
                  value={assignedShelf}
                  onChange={(e) => setAssignedShelf(e.target.value)}
                  placeholder="e.g. Shelf A-15 (Main Gate)"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setSelectedPreReq(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer">
                  Accept & Assign Shelf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
