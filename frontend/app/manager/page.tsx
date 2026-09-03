'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { getRoleDisplayName, formatStatusLabel, getStatusColorClass, getPriorityBadge } from '@/lib/utils';
import { WorkerRecommendModal } from '@/src/features/assistant/components/WorkerRecommendModal';
import { Ticket, UserProfile } from '@/lib/types';
import {
  LayoutDashboard,
  UserCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Bed,
  Search,
  Users,
  UserPlus,
  RefreshCw,
  History,
  FileCheck,
  AlertCircle,
  Sparkles,
  MapPin,
  XCircle,
  Layers,
} from 'lucide-react';

import { sortBlockNamesSequentially } from '@/lib/utils/sortingUtils';

export default function ManagerDashboardPage() {
  const {
    getFilteredTickets,
    activeOrg,
    activeRole,
    currentUser,
    users,
    sectors,
    updateUser,
  } = useApp();

  const allTickets = getFilteredTickets();

  // Navigation Workstation Tabs: 'maintenance' | 'occupancy' | 'approvals' | 'transfers' | 'incidents' | 'outings'
  const [activeConsoleTab, setActiveConsoleTab] = useState<'maintenance' | 'occupancy' | 'approvals' | 'transfers' | 'incidents' | 'outings'>('maintenance');

  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<Ticket | null>(null);
  const [selectedHostelSector, setSelectedHostelSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  // Transfer Modal State
  const [transferringStudent, setTransferringStudent] = useState<any | null>(null);
  const [targetTowerInput, setTargetTowerInput] = useState('Tower T1');
  const [targetRoomInput, setTargetRoomInput] = useState('Tower T1 - Room 502');
  const [transferReasonInput, setTransferReasonInput] = useState('Warden Allocation Optimization');

  // Warden Allocated Scope
  const liveUser = users.find((u) => u.id === currentUser?.id || u.email === currentUser?.email) || currentUser;
  const wardenName = liveUser?.name || currentUser?.name || '';
  const userAssignedBlocks = liveUser?.assignedBlocks || currentUser?.assignedBlocks || [];

  const validAssignedBlocks = userAssignedBlocks.filter((bName) => {
    const sec = sectors.find((s) => s.name.toLowerCase() === bName.toLowerCase());
    if (sec) {
      if (sec.assignedWarden === 'Unassigned') return false;
      if (wardenName && sec.assignedWarden && !sec.assignedWarden.toLowerCase().includes(wardenName.toLowerCase())) {
        return false;
      }
    }
    return true;
  });

  const wardenAllocatedBlocks = sortBlockNamesSequentially(validAssignedBlocks);

  // Filter tickets for Warden scope
  const tickets = allTickets.filter((t) => {
    const ticketLoc = `${t.location || ''} ${t.building || ''} ${t.block || ''}`.toLowerCase();
    if (wardenAllocatedBlocks.length > 0) {
      const isInScope = wardenAllocatedBlocks.some((blk) => ticketLoc.includes(blk.toLowerCase()));
      if (!isInScope) return false;
    }
    if (selectedHostelSector === 'all') return true;
    return ticketLoc.includes(selectedHostelSector.toLowerCase());
  });

  // Filter Students pending approval (RULE 2)
  const pendingStudentsList = users.filter(
    (u) => u.role === 'student' && u.approvalStatus === 'PENDING_WARDEN_APPROVAL'
  );

  const activeStudentsList = users.filter(
    (u) => u.role === 'student' && u.approvalStatus === 'ACTIVE'
  );

  // Sample Room Occupancy Directory (HARD RULE 1: MAX 3 OCCUPANTS)
  const roomDirectory = [
    {
      roomNo: 'Hostel Block B - Room 204',
      building: 'Hostel Block B',
      floor: 2,
      capacity: 3,
      currentOccupancy: 2, // 2/3 PARTIALLY OCCUPIED
      status: 'PARTIALLY OCCUPIED',
      residents: [
        { name: 'Aarav Sharma', rollNo: 'WOX-2026-84920', email: 'student@woxsen.edu.in', dept: 'B.Tech CSE - Sec A' },
        { name: 'K. Aditya Reddy', rollNo: '24WU0102240', email: 'aditya.reddy@woxsen.edu.in', dept: 'B.Tech AIML - Sec B' },
      ],
    },
    {
      roomNo: 'Tower T1 - Room 502',
      building: 'Tower T1',
      floor: 5,
      capacity: 3,
      currentOccupancy: 3, // 3/3 FULL
      status: 'FULL (MAX CAPACITY)',
      residents: [
        { name: 'Rohan Varma', rollNo: 'WOX-2026-88120', email: 'rohan.v@woxsen.edu.in', dept: 'MBA - Sec A' },
        { name: 'V. Siddharth', rollNo: 'WOX-2026-88121', email: 'siddharth.v@woxsen.edu.in', dept: 'MBA - Sec A' },
        { name: 'Manish Kumar', rollNo: 'WOX-2026-88122', email: 'manish.k@woxsen.edu.in', dept: 'MBA - Sec A' },
      ],
    },
    {
      roomNo: 'Hostel Block A - Room 101',
      building: 'Hostel Block A',
      floor: 1,
      capacity: 3,
      currentOccupancy: 1, // 1/3 PARTIALLY OCCUPIED
      status: 'PARTIALLY OCCUPIED',
      residents: [
        { name: 'S. Bharat Reddy', rollNo: '24WU0101095', email: 'bharat.reddy@woxsen.edu.in', dept: 'B.Tech ECE' },
      ],
    },
    {
      roomNo: 'Tower T2 - Room 304',
      building: 'Tower T2',
      floor: 3,
      capacity: 3,
      currentOccupancy: 0, // 0/3 AVAILABLE
      status: 'AVAILABLE',
      residents: [],
    },
  ];

  // Room Change Requests (RULE 4)
  const roomChangeRequestsList = [
    {
      id: 'RCR-8401',
      studentName: 'S. Bharat Reddy',
      studentRollNo: '24WU0101095',
      currentRoom: 'Hostel Block A - Room 101',
      requestedRoom: 'Tower T1 - Room 502',
      reason: 'Medical condition requiring AC and elevator access.',
      status: 'PENDING_WARDEN_APPROVAL',
      createdAt: 'Today, 02:30 PM',
    },
  ];

  // Room Transfer History Records (RULE 6)
  const transferHistoryList = [
    {
      id: 'RTH-901',
      studentName: 'Aarav Sharma',
      previousRoom: 'Hostel Block A - Room 101',
      newRoom: 'Hostel B - Room 204',
      reason: 'Warden Room Allocation Optimization',
      approvedBy: 'Dr. Rajesh Verma (Warden)',
      timestamp: '2026-08-15 10:00 AM',
    },
  ];

  // Master Aggregated Incidents (RULE 8)
  const masterIncidentsList = [
    {
      id: 'INC-2026-041',
      title: 'Floor 3 Central AC Cooling Failure',
      category: 'AC & HVAC',
      building: 'Tower T1',
      floor: 'Floor 3',
      affectedRooms: ['Tower T1 - Room 301', 'Tower T1 - Room 302', 'Tower T1 - Room 303'],
      complaintCount: 3,
      status: 'active',
      possibleRootCause: 'Chilled water supply valve blockage on Floor 3 riser.',
      recommendedAction: 'Inspect Floor 3 HVAC riser valve and clear strainer.',
    },
  ];

  // Student Gate Outing Movement Logs (RULE: WARDEN IN-OUT MONITOR)
  const gateMovementsList = [
    {
      id: 'OUT-9041',
      studentName: 'Aarav Sharma',
      studentRollNo: 'WOX-2026-84920',
      studentRoom: 'Tower T1 - Room 502',
      outingType: 'Day Outing',
      destination: 'Hyderabad Forum Mall',
      exitTime: 'Today, 11:30 AM',
      expectedReturnTime: 'Today, 08:30 PM',
      passcode: 'GATE-9041',
      status: 'checked_out', // 🚶 Outside Campus
    },
    {
      id: 'OUT-8812',
      studentName: 'Rohan Varma',
      studentRollNo: 'WOX-2026-88120',
      studentRoom: 'Tower T1 - Room 502',
      outingType: 'Night Outing',
      destination: 'Gachibowli',
      exitTime: 'Yesterday, 07:00 PM',
      expectedReturnTime: 'Today, 07:00 AM',
      passcode: 'GATE-8812',
      status: 'overdue_breach', // ⏰ LATE ENTRY BREACH ALERT
    },
  ];

  // RULE 2: WARDEN APPROVES STUDENT REGISTRATION
  const handleApproveStudent = (student: UserProfile) => {
    updateUser(student.id, { approvalStatus: 'ACTIVE' });
    setNotice(`APPROVED: Student ${student.name} (${student.email}) account ACTIVATED! Resident services unlocked.`);
  };

  // RULE 2: WARDEN REJECTS STUDENT REGISTRATION
  const handleRejectStudent = (student: UserProfile) => {
    updateUser(student.id, { approvalStatus: 'REJECTED' });
    setNotice(`REJECTED: Registration for ${student.name} rejected.`);
  };

  // RULE 1 & RULE 5: WARDEN TRANSFERS STUDENT WITH MAX 3 CAPACITY ENFORCEMENT
  const handleExecuteTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferringStudent) return;

    // Check target room capacity
    const targetRoomObj = roomDirectory.find((r) => r.roomNo.toLowerCase() === targetRoomInput.trim().toLowerCase());
    if (targetRoomObj && targetRoomObj.currentOccupancy >= 3) {
      alert(`HARD BUSINESS RULE BREACH: Target room "${targetRoomInput}" is FULL (3/3 occupants max). Select another room.`);
      return;
    }

    updateUser(transferringStudent.id || transferringStudent.email, {
      roomOrUnit: targetRoomInput,
    });

    setNotice(`ROOM TRANSFER COMPLETE: ${transferringStudent.name} transferred to ${targetRoomInput}. Capacity validated & transfer history logged.`);
    setTransferringStudent(null);
  };

  const metrics = {
    newRequests: tickets.filter((t) => t.status === 'new' || t.status === 'under_review').length,
    assigned: tickets.filter((t) => t.status === 'assigned' || t.status === 'accepted').length,
    inProgress: tickets.filter((t) => t.status === 'in_progress').length,
    overdue: tickets.filter((t) => t.slaBreached).length,
    escalated: tickets.filter((t) => t.status === 'escalated').length,
    awaitingVerification: tickets.filter((t) => t.status === 'awaiting_verification').length,
    reopened: tickets.filter((t) => t.status === 'reopened').length,
    closed: tickets.filter((t) => t.status === 'closed' || t.status === 'resolved').length,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* MANAGER HERO HEADER */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 text-white shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl">{activeOrg.logo}</span>
            <span className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/20">
              Hostel Area Admin & Warden Console
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black">
            Woxsen Hostel Residential Operations
          </h1>
          <p className="text-xs text-slate-300 font-medium">
            Dedicated administrative control over allocated Hostel Towers and Blocks. Registered block complaints are automatically routed to your console for immediate technician dispatch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/courier/portal"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
          >
            <span>📦</span>
            <span>Courier Room Portal</span>
          </Link>

          <Link
            href="/sports/portal"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
          >
            <span>⚽</span>
            <span>Sports Area Portal</span>
          </Link>

          <Link
            href="/manager/assignments"
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 shrink-0"
          >
            <UserCheck className="w-4 h-4" />
            <span>Worker Match Center</span>
          </Link>
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

      {/* WORKSTATIONS SWITCHER TABS */}
      <div className="p-2 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-2">
        <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2 pt-1">
          Select Warden Operations Terminal
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          <button
            onClick={() => setActiveConsoleTab('maintenance')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeConsoleTab === 'maintenance'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>🛠️ Dispatch Queue</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('occupancy')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeConsoleTab === 'occupancy'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Bed className="w-4 h-4" />
            <span>🏢 Occupancy (Max 3)</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('approvals')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeConsoleTab === 'approvals'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>🎓 Approvals ({pendingStudentsList.length})</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('transfers')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeConsoleTab === 'transfers'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>🔄 Room Transfers</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('incidents')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeConsoleTab === 'incidents'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>🚨 Incidents ({masterIncidentsList.length})</span>
          </button>

          <button
            onClick={() => setActiveConsoleTab('outings')}
            className={`p-3 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeConsoleTab === 'outings'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span>🚪 Outing Monitor</span>
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      // TERMINAL 1: MAINTENANCE DISPATCH QUEUE
      {/* =================================================================== */}
      {activeConsoleTab === 'maintenance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { label: 'Pending Review', count: metrics.newRequests },
              { label: 'Assigned', count: metrics.assigned },
              { label: 'In Progress', count: metrics.inProgress },
              { label: 'Reopened', count: metrics.reopened },
              { label: 'Overdue SLA', count: metrics.overdue },
              { label: 'Escalated', count: metrics.escalated },
              { label: 'Verification', count: metrics.awaitingVerification },
              { label: 'Closed', count: metrics.closed },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
                <span className="text-[10px] font-extrabold text-slate-500">{m.label}</span>
                <span className="text-xl font-black text-red-600 mt-1">{m.count}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Ticket #</th>
                  <th className="p-4">Hostel Location</th>
                  <th className="p-4">Issue Category</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">
                      <Link href={`/requests/${ticket.id}`} className="text-blue-600 hover:underline">
                        {ticket.id}
                      </Link>
                    </td>
                    <td className="p-4 font-bold text-slate-800">
                      {ticket.location} {ticket.room ? `(${ticket.room})` : ''}
                    </td>
                    <td className="p-4 font-medium text-slate-600">{ticket.serviceCategory}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${getStatusColorClass(ticket.status)}`}>
                        {formatStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedTicketForAssign(ticket)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                      >
                        Facos Match Auto-Dispatch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      // TERMINAL 2: ROOM OCCUPANCY & RESIDENT DIRECTORY (HARD RULE: MAX 3)
      {/* =================================================================== */}
      {activeConsoleTab === 'occupancy' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Hard Business Rule Enforced</span>
              <h3 className="text-base font-black text-slate-900">Hostel Room Directory & Occupancy (Max 3 Students/Room)</h3>
            </div>
            <span className="text-xs font-black text-red-700 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Max Occupancy: 3
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roomDirectory.map((rm) => (
              <div key={rm.roomNo} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded border border-slate-300">
                    {rm.roomNo}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      rm.currentOccupancy >= 3
                        ? 'bg-red-600 text-white shadow-xs'
                        : rm.currentOccupancy === 0
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {rm.currentOccupancy}/3 ({rm.status})
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 block">Registered Residents ({rm.residents.length})</span>
                  {rm.residents.length === 0 ? (
                    <p className="text-xs font-medium text-slate-500 italic">No residents assigned. Room available (0/3).</p>
                  ) : (
                    rm.residents.map((res) => (
                      <div key={res.rollNo} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800">
                        <div>
                          <p className="text-slate-900 font-black">{res.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{res.rollNo} • {res.dept}</p>
                        </div>
                        <button
                          onClick={() => {
                            setTransferringStudent(res);
                            setTargetRoomInput('Tower T2 - Room 304');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 text-[10px] font-black uppercase transition-colors cursor-pointer"
                        >
                          Transfer →
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      // TERMINAL 3: PENDING STUDENT REGISTRATIONS (RULE 2: WARDEN APPROVAL)
      {/* =================================================================== */}
      {activeConsoleTab === 'approvals' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="space-y-1 border-b border-slate-100 pb-3">
            <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Mandatory Warden Verification</span>
            <h3 className="text-base font-black text-slate-900">Pending Student Registrations ({pendingStudentsList.length})</h3>
            <p className="text-xs text-slate-500 font-semibold">
              Students cannot access resident-only features (maintenance, sports, courier) until approved.
            </p>
          </div>

          {pendingStudentsList.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <p className="text-xs font-black text-slate-900">All student registrations approved!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingStudentsList.map((st) => (
                <div key={st.id} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-950">{st.name}</span>
                      <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded">{st.rollNo}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-semibold">{st.email} • {st.department}</p>
                    <p className="text-xs font-bold text-red-700">Claimed Suite: {st.roomOrUnit}</p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => handleRejectStudent(st)}
                      className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-black text-xs uppercase cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproveStudent(st)}
                      className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase shadow-md shadow-red-600/30 cursor-pointer"
                    >
                      Approve & Activate Resident Account
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      // TERMINAL 4: ROOM CHANGE REQUESTS & TRANSFER HISTORY
      {/* =================================================================== */}
      {activeConsoleTab === 'transfers' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
          
          {/* SECTION A: STUDENT ROOM CHANGE REQUESTS */}
          <div className="space-y-3 border-b border-slate-100 pb-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Student Room Change Requests</h3>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                1 Pending Approval
              </span>
            </div>

            {roomChangeRequestsList.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl bg-amber-50/70 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-900 bg-white px-2 py-0.5 rounded border">{req.id}</span>
                    <span className="text-xs font-black text-amber-950">{req.studentName} ({req.studentRollNo})</span>
                  </div>
                  <p className="text-xs text-slate-700 font-bold">
                    Current: <span className="text-slate-900">{req.currentRoom}</span> ➔ Requested: <span className="text-red-700">{req.requestedRoom}</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium italic">Reason: "{req.reason}"</p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => {
                      setTransferringStudent({ name: req.studentName, email: req.studentRollNo });
                      setTargetRoomInput(req.requestedRoom);
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase shadow-md cursor-pointer"
                  >
                    Approve Transfer & Update Occupancy
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SECTION B: PERMANENT RESIDENCE TRANSFER HISTORY LOG */}
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-red-600" />
              <span>Permanent Residence Transfer History Log</span>
            </h3>

            {transferHistoryList.map((hist) => (
              <div key={hist.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-bold text-slate-800">
                <div>
                  <span className="font-mono text-slate-900 font-black mr-2">{hist.id}</span>
                  <span>{hist.studentName}</span>: <span className="text-slate-500">{hist.previousRoom}</span> ➔ <span className="text-red-700">{hist.newRoom}</span>
                </div>

                <div className="text-right text-[11px] text-slate-500">
                  <span>Approved by: {hist.approvedBy}</span> • <span>{hist.timestamp}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* =================================================================== */}
      // TERMINAL 5: AI MASTER INCIDENT AGGREGATOR & ROOT-CAUSE ENGINE
      {/* =================================================================== */}
      {activeConsoleTab === 'incidents' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">AI Campus Intelligence</span>
              <h3 className="text-base font-black text-slate-900">Master Aggregated Incidents & Root-Cause Detection</h3>
            </div>
          </div>

          {masterIncidentsList.map((inc) => (
            <div key={inc.id} className="p-5 rounded-2xl bg-red-50/70 border border-red-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-white bg-red-600 px-2.5 py-0.5 rounded">{inc.id}</span>
                  <span className="text-xs font-black text-red-950">{inc.title}</span>
                </div>
                <span className="text-[10px] font-black uppercase text-red-700 bg-red-100 px-2.5 py-1 rounded-full border border-red-300">
                  {inc.complaintCount} Complaints Aggregated
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-red-200 space-y-1 text-xs">
                <p className="font-bold text-slate-900">Affected Rooms: <span className="font-mono text-red-700">{inc.affectedRooms.join(', ')}</span></p>
                <p className="font-bold text-slate-800">Detected Root Cause: <span className="text-slate-600">{inc.possibleRootCause}</span></p>
                <p className="font-extrabold text-emerald-700">Recommended Action: {inc.recommendedAction}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =================================================================== */}
      // TERMINAL 6: STUDENT GATE MOVEMENT & OUTING MONITOR
      {/* =================================================================== */}
      {activeConsoleTab === 'outings' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Gate Safety & In-Out Log</span>
              <h3 className="text-base font-black text-slate-900">Student Gate Check-In / Check-Out Movement Tracker</h3>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              1 Student Outside Campus • 1 Overdue Late Entry
            </span>
          </div>

          <div className="space-y-3">
            {gateMovementsList.map((mv) => (
              <div key={mv.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-red-950 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                      {mv.passcode}
                    </span>
                    <span className="font-black text-slate-900">{mv.studentName} ({mv.studentRollNo})</span>
                    <span className="text-slate-500 font-bold">• Room: {mv.studentRoom}</span>
                  </div>
                  <p className="text-slate-700 font-bold">Destination: <span className="text-slate-900">{mv.destination}</span> ({mv.outingType})</p>
                  <p className="text-slate-500 font-medium">Exit: {mv.exitTime} • Expected Return: <span className="font-mono font-bold text-red-700">{mv.expectedReturnTime}</span></p>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${
                      mv.status === 'overdue_breach'
                        ? 'bg-red-600 text-white animate-pulse shadow-md'
                        : 'bg-amber-100 text-amber-950 border border-amber-300'
                    }`}
                  >
                    {mv.status === 'overdue_breach' ? '⏰ OVERDUE LATE ENTRY BREACH' : '🚶 Checked Out (Outside Campus)'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: WARDEN EXECUTE ROOM TRANSFER */}
      {transferringStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Hostel Room Allocation</span>
                <h3 className="text-lg font-black text-slate-900">Execute Room Transfer</h3>
              </div>
              <button onClick={() => setTransferringStudent(null)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTransferSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                Student: <strong>{transferringStudent.name}</strong> ({transferringStudent.email})
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Target Building & Room (Max 3 Occupants) *</label>
                <input
                  type="text"
                  required
                  value={targetRoomInput}
                  onChange={(e) => setTargetRoomInput(e.target.value)}
                  placeholder="e.g. Tower T2 - Room 304"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Reason for Transfer</label>
                <input
                  type="text"
                  value={transferReasonInput}
                  onChange={(e) => setTransferReasonInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setTransferringStudent(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-600/30 cursor-pointer">
                  Execute Transfer & Log History
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FACOS MATCH AUTO-DISPATCH MODAL */}
      {selectedTicketForAssign && (
        <WorkerRecommendModal
          ticket={selectedTicketForAssign}
          onClose={() => setSelectedTicketForAssign(null)}
        />
      )}

    </div>
  );
}
