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
  Upload,
  FileImage,
  Calendar,
  Phone,
  User,
  History,
  ShieldAlert,
} from 'lucide-react';

interface ParcelItem {
  id: string; // e.g. PCL-9041
  studentName: string;
  studentRollNo: string;
  studentPhone?: string;
  hostelRoom: string;
  courierPartner: 'Amazon' | 'Flipkart' | 'BlueDart' | 'DTDC' | 'FedEx' | 'Myntra' | 'Other';
  trackingNumber: string; // Order ID / Tracking AWB
  expectedDeliveryDate?: string;
  proofScreenshotUrl?: string; // Uploaded order screenshot proof
  shelfLocation: string;
  arrivedAt: string;
  pickupOtp: string; // 4-digit student OTP
  status: 'pre_delivery_requested' | 'accepted_by_mailroom' | 'pending' | 'collected';
  requestInitiatedBy: 'student' | 'mailroom';
  collectedAt?: string;
}

const INITIAL_PARCELS: ParcelItem[] = [
  {
    id: 'PCL-9041',
    studentName: 'Aarav Sharma',
    studentRollNo: 'WOX-2026-84920',
    studentPhone: '+91 98765 43210',
    hostelRoom: 'Tower T1 - Room 502',
    courierPartner: 'Amazon',
    trackingNumber: 'TBA309482019',
    expectedDeliveryDate: '2026-09-02',
    proofScreenshotUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80',
    shelfLocation: 'Shelf A-14 (Main Gate Mailroom)',
    arrivedAt: 'Today, 11:30 AM',
    pickupOtp: '8492',
    status: 'pending',
    requestInitiatedBy: 'student',
  },
  {
    id: 'PCL-9042',
    studentName: 'Aarav Sharma',
    studentRollNo: 'WOX-2026-84920',
    studentPhone: '+91 98765 43210',
    hostelRoom: 'Tower T1 - Room 502',
    courierPartner: 'Flipkart',
    trackingNumber: 'FMPP04928104',
    expectedDeliveryDate: '2026-09-02',
    proofScreenshotUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80',
    shelfLocation: 'Shelf B-08 (Main Gate Mailroom)',
    arrivedAt: 'Today, 02:15 PM',
    pickupOtp: '3910',
    status: 'pending',
    requestInitiatedBy: 'mailroom',
  },
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
    id: 'PCL-9038',
    studentName: 'K. Aditya Reddy',
    studentRollNo: '24WU0102240',
    studentPhone: '+91 91234 56789',
    hostelRoom: 'Block B - Room 204',
    courierPartner: 'BlueDart',
    trackingNumber: 'BD749201948',
    shelfLocation: 'Shelf C-03 (Main Gate Mailroom)',
    arrivedAt: 'Yesterday, 04:00 PM',
    pickupOtp: '5019',
    status: 'collected',
    requestInitiatedBy: 'mailroom',
    collectedAt: 'Yesterday, 06:20 PM',
  },
];

export default function CourierManagementPage() {
  const router = useRouter();
  const { currentUser, activeRole } = useApp();
  const [parcels, setParcels] = useState<ParcelItem[]>(INITIAL_PARCELS);
  
  // Navigation Tabs: 'my' | 'student_request' | 'mailroom_intake' | 'history'
  const [activeTab, setActiveTab] = useState<'my' | 'student_request' | 'mailroom_intake' | 'history'>('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // WORKFLOW 1: Student Pre-Delivery Request Form State
  const [studentTrackingNo, setStudentTrackingNo] = useState('');
  const [studentCourierPartner, setStudentCourierPartner] = useState<ParcelItem['courierPartner']>('Amazon');
  const [studentExpectedDate, setStudentExpectedDate] = useState('2026-09-03');
  const [studentProofUrl, setStudentProofUrl] = useState('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&auto=format&fit=crop&q=80');

  // WORKFLOW 2: Mailroom On-Spot Intake Form State
  const [staffStudentName, setStaffStudentName] = useState('');
  const [staffRollNo, setStaffRollNo] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffHostelRoom, setStaffHostelRoom] = useState('');
  const [staffCourierPartner, setStaffCourierPartner] = useState<ParcelItem['courierPartner']>('Amazon');
  const [staffTrackingNo, setStaffTrackingNo] = useState('');
  const [staffShelf, setStaffShelf] = useState('Shelf A-01');

  // Mailroom Quick Checkout Modal State
  const [verifyingParcel, setVerifyingParcel] = useState<ParcelItem | null>(null);
  const [enteredOtp, setEnteredOtp] = useState('');

  // Mailroom Assign Shelf Modal State for Pre-Delivery Requests
  const [assigningShelfParcel, setAssigningShelfParcel] = useState<ParcelItem | null>(null);
  const [assignedShelfInput, setAssignedShelfInput] = useState('Shelf A-15');

  const isStaffOrSecurity = activeRole === 'warden' || activeRole === 'manager' || activeRole === 'admin' || activeRole === 'super_admin';

  // ------------------------------------------------------------------------
  // WORKFLOW 1 SUBMIT: Student Pre-Delivery Courier Pickup Request
  // ------------------------------------------------------------------------
  const handleStudentPreDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentTrackingNo) return;

    const generatedOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const parcelId = `PCL-${Math.floor(9000 + Math.random() * 999)}`;

    const newParcel: ParcelItem = {
      id: parcelId,
      studentName: currentUser?.name || 'Aarav Sharma',
      studentRollNo: currentUser?.email?.split('@')[0].toUpperCase() || 'WOX-2026-84920',
      studentPhone: '+91 98765 43210',
      hostelRoom: currentUser?.roomOrUnit || 'Tower T1 - Room 502',
      courierPartner: studentCourierPartner,
      trackingNumber: studentTrackingNo,
      expectedDeliveryDate: studentExpectedDate,
      proofScreenshotUrl: studentProofUrl,
      shelfLocation: 'Awaiting Gate Intake',
      arrivedAt: 'Pre-Delivery Request Submitted',
      pickupOtp: generatedOtp,
      status: 'pre_delivery_requested',
      requestInitiatedBy: 'student',
    };

    setParcels([newParcel, ...parcels]);
    setNotice(`Pre-Delivery Request submitted for Order ${studentTrackingNo}! Parcel Receiving ID ${parcelId} & OTP ${generatedOtp} generated.`);
    setActiveTab('my');

    // Reset Form
    setStudentTrackingNo('');
  };

  // ------------------------------------------------------------------------
  // WORKFLOW 2 SUBMIT: Mailroom On-Spot Gate Intake Request
  // ------------------------------------------------------------------------
  const handleStaffIntakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffStudentName || !staffTrackingNo) return;

    const generatedOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const parcelId = `PCL-${Math.floor(9000 + Math.random() * 999)}`;

    const newParcel: ParcelItem = {
      id: parcelId,
      studentName: staffStudentName,
      studentRollNo: staffRollNo || 'WOX-2026-REG',
      studentPhone: staffPhone || '+91 98765 43210',
      hostelRoom: staffHostelRoom || 'Hostel Block A',
      courierPartner: staffCourierPartner,
      trackingNumber: staffTrackingNo,
      shelfLocation: staffShelf,
      arrivedAt: 'Just now',
      pickupOtp: generatedOtp,
      status: 'pending',
      requestInitiatedBy: 'mailroom',
    };

    setParcels([newParcel, ...parcels]);
    setNotice(`Parcel logged for ${staffStudentName}! Student Parcel Receiving ID ${parcelId} & OTP ${generatedOtp} sent.`);

    // Reset Form
    setStaffStudentName('');
    setStaffRollNo('');
    setStaffPhone('');
    setStaffHostelRoom('');
    setStaffTrackingNo('');
  };

  // Mailroom Accepts Student Pre-Delivery Request & Assigns Shelf
  const handleConfirmAssignShelf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningShelfParcel) return;

    setParcels(
      parcels.map((p) =>
        p.id === assigningShelfParcel.id
          ? {
              ...p,
              status: 'pending',
              shelfLocation: assignedShelfInput,
              arrivedAt: 'Arrived at Gate & Intaken',
            }
          : p
      )
    );

    setNotice(`Pre-delivery request ${assigningShelfParcel.id} accepted! Shelf ${assignedShelfInput} assigned.`);
    setAssigningShelfParcel(null);
  };

  // ------------------------------------------------------------------------
  // VERIFY OTP & CLOSE TICKET (Moved to Previous Tickets / History)
  // ------------------------------------------------------------------------
  const handleConfirmPickup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingParcel) return;

    if (enteredOtp.trim() !== verifyingParcel.pickupOtp) {
      alert('Invalid 4-Digit OTP passcode. Please verify the code in the student app.');
      return;
    }

    setParcels(
      parcels.map((p) =>
        p.id === verifyingParcel.id
          ? { ...p, status: 'collected', collectedAt: 'Just now' }
          : p
      )
    );

    setNotice(`Parcel ${verifyingParcel.id} marked as COLLECTED for ${verifyingParcel.studentName}. Ticket closed & archived to Previous Tickets.`);
    setVerifyingParcel(null);
    setEnteredOtp('');
  };

  // Filtered Parcels List
  const pendingParcels = parcels.filter((p) => p.status === 'pending' || p.status === 'pre_delivery_requested');
  const preDeliveryRequests = parcels.filter((p) => p.status === 'pre_delivery_requested');
  const collectedParcels = parcels.filter((p) => p.status === 'collected');

  const filteredList = parcels.filter((p) => {
    const matchesTab =
      activeTab === 'my'
        ? p.status === 'pending' || p.status === 'pre_delivery_requested'
        : activeTab === 'history'
        ? p.status === 'collected'
        : true;

    const matchesSearch =
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hostelRoom.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

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
              <span>📦</span>
              <span>Woxsen Campus Courier & Parcel Desk</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Campus Parcel & Mailroom Management
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
            Raise pre-delivery pickup requests with order proof, receive 4-digit student OTP passcodes, and complete verified mailroom checkouts.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-xs font-extrabold text-center">
            <span className="text-xl font-black block text-amber-400">{pendingParcels.length}</span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider">Active Deliveries</span>
          </div>

          <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-xs font-extrabold text-center">
            <span className="text-xl font-black block text-emerald-400">{collectedParcels.length}</span>
            <span className="text-[10px] text-slate-300 uppercase tracking-wider">Previous Tickets</span>
          </div>
        </div>
      </div>

      {/* Notice Banner */}
      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="font-black underline text-xs cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Controls & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto pb-1 sm:pb-1">
          <button
            onClick={() => setActiveTab('my')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'my'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 font-bold'
            }`}
          >
            📦 Active Deliveries ({pendingParcels.length})
          </button>

          <button
            onClick={() => setActiveTab('student_request')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'student_request'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 font-bold'
            }`}
          >
            ➕ Pre-Delivery Request
          </button>

          {isStaffOrSecurity && (
            <button
              onClick={() => setActiveTab('mailroom_intake')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'mailroom_intake'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900 font-bold'
              }`}
            >
              🏬 Mailroom Intake ({preDeliveryRequests.length} Pending)
            </button>
          )}

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'history'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-700 hover:text-slate-900 font-bold'
            }`}
          >
            📋 Previous Tickets ({collectedParcels.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID, parcel ID, student..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 shadow-xs"
          />
        </div>
      </div>

      {/* =================================================================== */}
      // TAB 1 & 4: PARCELS LIST (ACTIVE DELIVERIES & PREVIOUS TICKETS)
      {/* =================================================================== */}
      {(activeTab === 'my' || activeTab === 'history') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-3xl bg-white border shadow-xl flex flex-col justify-between space-y-4 transition-all ${
                item.status === 'pending'
                  ? 'border-red-200 ring-1 ring-red-100'
                  : item.status === 'pre_delivery_requested'
                  ? 'border-amber-200 ring-1 ring-amber-100'
                  : 'border-slate-200 opacity-90'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black font-mono uppercase tracking-wider">
                      {item.id}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Truck className="w-3 h-3 text-red-600" />
                      {item.courierPartner}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      item.status === 'pending'
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : item.status === 'pre_delivery_requested'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                        : 'bg-slate-100 text-slate-800 border border-slate-300'
                    }`}
                  >
                    {item.status === 'pending'
                      ? '✓ Ready for Pickup'
                      : item.status === 'pre_delivery_requested'
                      ? '⏳ Pre-Delivery Requested'
                      : '✓ Collected & Closed'}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900">{item.studentName}</h3>
                  <p className="text-xs text-slate-500 font-semibold flex items-center gap-2 flex-wrap">
                    <span>{item.studentRollNo}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      {item.hostelRoom}
                    </span>
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs font-bold text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Order ID / AWB</span>
                    <span className="font-mono text-slate-900">{item.trackingNumber}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Mailroom Shelf</span>
                    <span className="text-red-700 font-extrabold">{item.shelfLocation}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px] text-slate-500">
                    <span>Arrived: {item.arrivedAt}</span>
                    {item.collectedAt && <span className="text-emerald-700 font-extrabold">Closed: {item.collectedAt}</span>}
                  </div>
                </div>

                {/* Proof Screenshot Attachment (If provided by student) */}
                {item.proofScreenshotUrl && (
                  <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                      <FileImage className="w-3.5 h-3.5 text-slate-600" /> Order Proof Screenshot
                    </span>
                    <img
                      src={item.proofScreenshotUrl}
                      alt="Order Screenshot Proof"
                      className="w-full h-28 object-cover rounded-xl border border-slate-300"
                    />
                  </div>
                )}
              </div>

              {/* PICKUP OTP DISPLAY & VERIFY BUTTON */}
              {item.status !== 'collected' && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center gap-2 shrink-0">
                    <QrCode className="w-6 h-6 text-emerald-600" />
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-wider block text-emerald-700">Student OTP</span>
                      <span className="text-lg font-black font-mono leading-none text-emerald-900">{item.pickupOtp}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setVerifyingParcel(item);
                      setEnteredOtp(item.pickupOtp);
                    }}
                    className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/30 cursor-pointer transition-transform active:scale-95 text-center"
                  >
                    Complete Mailroom Pickup
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* =================================================================== */}
      // TAB 2: WORKFLOW 1 — STUDENT PRE-DELIVERY PICKUP REQUEST FORM
      {/* =================================================================== */}
      {activeTab === 'student_request' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 max-w-2xl mx-auto">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Student Pre-Delivery Request</span>
            <h2 className="text-xl font-black text-slate-900">Submit Pre-Delivery Order Details & Proof</h2>
            <p className="text-xs text-slate-500 font-semibold">
              Raise a request before your Amazon or Flipkart delivery arrives at campus to generate a Parcel Receiving ID & OTP.
            </p>
          </div>

          <form onSubmit={handleStudentPreDeliverySubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Order ID / Tracking Number (AWB) *</label>
              <input
                type="text"
                required
                value={studentTrackingNo}
                onChange={(e) => setStudentTrackingNo(e.target.value)}
                placeholder="e.g. TBA309482019 or FMPP04928104"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Courier Partner Company</label>
                <select
                  value={studentCourierPartner}
                  onChange={(e) => setStudentCourierPartner(e.target.value as any)}
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
                <label className="text-xs font-bold text-slate-700">Expected Delivery Date</label>
                <input
                  type="date"
                  required
                  value={studentExpectedDate}
                  onChange={(e) => setStudentExpectedDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Attach Order Confirmation Screenshot Proof *</label>
              <div className="p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 text-center space-y-2">
                <FileImage className="w-8 h-8 text-red-600 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Order Screenshot Attached</p>
                <input
                  type="url"
                  value={studentProofUrl}
                  onChange={(e) => setStudentProofUrl(e.target.value)}
                  placeholder="Screenshot proof URL"
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-[11px] font-mono text-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 cursor-pointer transition-transform active:scale-95"
            >
              Submit Pre-Delivery Request & Get OTP Passcode
            </button>
          </form>
        </div>
      )}

      {/* =================================================================== */}
      // TAB 3: WORKFLOW 2 — MAILROOM ON-SPOT INTAKE FORM (STAFF DESK)
      {/* =================================================================== */}
      {activeTab === 'mailroom_intake' && isStaffOrSecurity && (
        <div className="space-y-8 max-w-4xl mx-auto">
          
          {/* SECTION A: PENDING STUDENT PRE-DELIVERY REQUESTS TO ACCEPT */}
          {preDeliveryRequests.length > 0 && (
            <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 border-2 border-amber-300 shadow-xl space-y-4">
              <div className="space-y-1 border-b border-amber-200 pb-3">
                <span className="text-[10px] font-black uppercase text-amber-900 tracking-wider">Review Pre-Delivery Requests</span>
                <h3 className="text-lg font-black text-amber-950">Student Submitted Pre-Delivery Orders</h3>
                <p className="text-xs text-amber-900 font-medium">Verify order proof and assign mailroom shelf location when couriers arrive.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {preDeliveryRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-2xl bg-white border border-amber-200 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-amber-950 bg-amber-100 px-2.5 py-0.5 rounded">{req.id}</span>
                      <span className="text-[10px] font-black text-red-700 uppercase bg-red-50 px-2 py-0.5 rounded">{req.courierPartner}</span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-slate-900">{req.studentName} ({req.hostelRoom})</h4>
                      <p className="text-[11px] text-slate-500 font-mono">Order ID: {req.trackingNumber}</p>
                    </div>

                    {req.proofScreenshotUrl && (
                      <img src={req.proofScreenshotUrl} alt="Proof" className="w-full h-24 object-cover rounded-xl border border-slate-200" />
                    )}

                    <button
                      onClick={() => {
                        setAssigningShelfParcel(req);
                        setAssignedShelfInput('Shelf A-15');
                      }}
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-wider shadow-sm cursor-pointer"
                    >
                      Accept & Assign Shelf Location
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION B: ON-SPOT MAILROOM INTAKE FORM (When courier arrives at gate) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6 max-w-2xl mx-auto">
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Mailroom On-Spot Intake</span>
              <h2 className="text-xl font-black text-slate-900">Log Arrived Parcel & Send Student Receiving ID + OTP</h2>
              <p className="text-xs text-slate-500 font-semibold">
                If courier has clear student details (ID, Phone, Name), enter details to trigger student OTP.
              </p>
            </div>

            <form onSubmit={handleStaffIntakeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={staffStudentName}
                    onChange={(e) => setStaffStudentName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Student Roll No / ID</label>
                  <input
                    type="text"
                    value={staffRollNo}
                    onChange={(e) => setStaffRollNo(e.target.value)}
                    placeholder="e.g. WOX-2026-84920"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Student Phone Number</label>
                  <input
                    type="text"
                    value={staffPhone}
                    onChange={(e) => setStaffPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Hostel Building & Room</label>
                  <input
                    type="text"
                    value={staffHostelRoom}
                    onChange={(e) => setStaffHostelRoom(e.target.value)}
                    placeholder="e.g. Tower T1 - Room 502"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Courier Partner</label>
                  <select
                    value={staffCourierPartner}
                    onChange={(e) => setStaffCourierPartner(e.target.value as any)}
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
                    value={staffTrackingNo}
                    onChange={(e) => setStaffTrackingNo(e.target.value)}
                    placeholder="e.g. TBA309482019"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Assigned Mailroom Shelf Location</label>
                <input
                  type="text"
                  value={staffShelf}
                  onChange={(e) => setStaffShelf(e.target.value)}
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

        </div>
      )}

      {/* =================================================================== */}
      // MODAL 1: MAILROOM OTP CHECKOUT & TICKET CLOSURE
      {/* =================================================================== */}
      {verifyingParcel && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Mailroom Verified Checkout</span>
                <h3 className="text-lg font-black text-slate-900">Enter Order ID & Student 4-Digit OTP</h3>
              </div>
              <button
                onClick={() => setVerifyingParcel(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1 font-medium text-slate-700">
              <p className="font-extrabold text-slate-900">{verifyingParcel.studentName} ({verifyingParcel.hostelRoom})</p>
              <p className="text-slate-500">Parcel ID: <strong className="font-mono text-slate-900">{verifyingParcel.id}</strong> • Order ID: <strong className="font-mono text-slate-900">{verifyingParcel.trackingNumber}</strong></p>
              <p className="text-red-700 font-bold">Mailroom Location: {verifyingParcel.shelfLocation}</p>
            </div>

            <form onSubmit={handleConfirmPickup} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Verify Student 4-Digit OTP Passcode *</label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-300 text-center font-mono font-black text-2xl text-slate-900 tracking-widest focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyingParcel(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/30 cursor-pointer"
                >
                  Verify OTP & Close Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      // MODAL 2: ASSIGN SHELF LOCATION FOR STUDENT PRE-DELIVERY REQUESTS
      {/* =================================================================== */}
      {assigningShelfParcel && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Mailroom Intake</span>
                <h3 className="text-lg font-black text-slate-900">Accept Request & Assign Shelf</h3>
              </div>
              <button
                onClick={() => setAssigningShelfParcel(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmAssignShelf} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Assign Mailroom Shelf Location</label>
                <input
                  type="text"
                  required
                  value={assignedShelfInput}
                  onChange={(e) => setAssignedShelfInput(e.target.value)}
                  placeholder="e.g. Shelf A-15 (Main Gate)"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAssigningShelfParcel(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-md cursor-pointer"
                >
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
