'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Building, Building2, Bed, Layers, ChevronRight, PlusCircle, Trash2, Edit2, Sparkles } from 'lucide-react';

interface SectorItem {
  id: string;
  name: string;
  type: 'tower' | 'block';
  capacity: string;
  roomsCount: number;
  assignedWarden: string;
}

export default function FacilityHierarchyPage() {
  const { activeOrg } = useApp();
  const [notice, setNotice] = useState('');

  const [sectors, setSectors] = useState<SectorItem[]>([
    // Towers T1 to T6
    { id: 't1', name: 'Tower T1 (Executive Boys Residence)', type: 'tower', capacity: 'Air Conditioned Student Suites', roomsCount: 400, assignedWarden: 'Dr. Rajesh Verma' },
    { id: 't2', name: 'Tower T2 (Boys Residence)', type: 'tower', capacity: 'Standard Student Rooms', roomsCount: 400, assignedWarden: 'Dr. Rajesh Verma' },
    { id: 't3', name: 'Tower T3 (Boys Residence)', type: 'tower', capacity: 'Standard Student Rooms', roomsCount: 400, assignedWarden: 'Unassigned' },
    { id: 't4', name: 'Tower T4 (Executive Girls Residence)', type: 'tower', capacity: 'Air Conditioned Student Suites', roomsCount: 400, assignedWarden: 'Dr. Ananya Sharma' },
    { id: 't5', name: 'Tower T5 (Girls Residence)', type: 'tower', capacity: 'Standard Student Rooms', roomsCount: 400, assignedWarden: 'Dr. Ananya Sharma' },
    { id: 't6', name: 'Tower T6 (Girls Residence)', type: 'tower', capacity: 'Standard Student Rooms', roomsCount: 400, assignedWarden: 'Unassigned' },

    // Blocks A to G
    { id: 'blk-a', name: 'Block A (Student Residence & Mess)', type: 'block', capacity: 'Rooms 101-350 & Dining Hall', roomsCount: 350, assignedWarden: 'Dr. Rajesh Verma' },
    { id: 'blk-b', name: 'Block B (Student Residence & Laundry)', type: 'block', capacity: 'Rooms 101-350 & Laundry Hub', roomsCount: 350, assignedWarden: 'Unassigned' },
    { id: 'blk-c', name: 'Block C (Student Residence & Study Lounge)', type: 'block', capacity: 'Rooms 101-350 & Lounge', roomsCount: 350, assignedWarden: 'Unassigned' },
    { id: 'blk-d', name: 'Block D (Student Residence)', type: 'block', capacity: 'Rooms 101-350', roomsCount: 350, assignedWarden: 'Unassigned' },
    { id: 'blk-e', name: 'Block E (Student Residence)', type: 'block', capacity: 'Rooms 101-350', roomsCount: 350, assignedWarden: 'Unassigned' },
    { id: 'blk-f', name: 'Block F (Student Residence)', type: 'block', capacity: 'Rooms 101-350', roomsCount: 350, assignedWarden: 'Unassigned' },
    { id: 'blk-g', name: 'Block G (Student Residence)', type: 'block', capacity: 'Rooms 101-350', roomsCount: 350, assignedWarden: 'Unassigned' },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<SectorItem | null>(null);

  // Form Fields
  const [sectorName, setSectorName] = useState('');
  const [sectorType, setSectorType] = useState<'tower' | 'block'>('tower');
  const [capacity, setCapacity] = useState('Standard Rooms (400 Capacity)');
  const [roomsCount, setRoomsCount] = useState(400);
  const [assignedWarden, setAssignedWarden] = useState('Dr. Rajesh Verma');

  const handleOpenAddModal = () => {
    setEditingSector(null);
    setSectorName('');
    setSectorType('tower');
    setCapacity('Standard Rooms (400 Capacity)');
    setRoomsCount(400);
    setAssignedWarden('Dr. Rajesh Verma');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sec: SectorItem) => {
    setEditingSector(sec);
    setSectorName(sec.name);
    setSectorType(sec.type);
    setCapacity(sec.capacity);
    setRoomsCount(sec.roomsCount);
    setAssignedWarden(sec.assignedWarden);
    setIsModalOpen(true);
  };

  const handleDeleteSector = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will remove it from the hostel infrastructure grid.`)) {
      setSectors((prev) => prev.filter((s) => s.id !== id));
      setNotice(`Deleted ${name} from hostel infrastructure list.`);
    }
  };

  const handleSaveSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectorName.trim()) {
      alert('Please enter a sector name (e.g. Tower T7 or Block H).');
      return;
    }

    if (editingSector) {
      setSectors((prev) =>
        prev.map((s) =>
          s.id === editingSector.id
            ? { ...s, name: sectorName, type: sectorType, capacity, roomsCount, assignedWarden }
            : s
        )
      );
      setNotice(`Updated hostel sector details for ${sectorName}.`);
    } else {
      const newSec: SectorItem = {
        id: 'sec-' + Date.now(),
        name: sectorName,
        type: sectorType,
        capacity,
        roomsCount,
        assignedWarden,
      };
      setSectors((prev) => [...prev, newSec]);
      setNotice(`Added new hostel sector: ${sectorName}.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span>Woxsen Hostel Sectors & Towers Management</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Add, edit, or delete Hostel Towers (T1–T6) & Residential Blocks (A–G) for {activeOrg.name}.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Tower / Block</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="text-xs underline font-extrabold">Dismiss</button>
        </div>
      )}

      {/* Grid of Hostel Sectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectors.map((sec) => (
          <div
            key={sec.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between space-y-4 hover:border-blue-500 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  {sec.type === 'tower' ? <Building2 className="w-5 h-5" /> : <Bed className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {sec.type === 'tower' ? 'Hostel Tower' : 'Hostel Block'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">{sec.name}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{sec.capacity}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600 font-semibold">
                <span>Rooms Capacity:</span>
                <span className="font-bold text-slate-900">{sec.roomsCount} Rooms</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 font-semibold">
                <span>Assigned Warden:</span>
                <span className="font-bold text-blue-600">{sec.assignedWarden}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEditModal(sec)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-all flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => handleDeleteSector(sec.id, sec.name)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-all flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Sector Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span>{editingSector ? 'Edit Hostel Tower / Block' : 'Add New Hostel Sector'}</span>
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSaveSector} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sector Name</label>
                <input
                  type="text"
                  value={sectorName}
                  onChange={(e) => setSectorName(e.target.value)}
                  placeholder="e.g. Tower T7 (Boys Residence) or Block H"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sector Type</label>
                <select
                  value={sectorType}
                  onChange={(e) => setSectorType(e.target.value as 'tower' | 'block')}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="tower">Hostel Tower (T1 – T12)</option>
                  <option value="block">Residential Block (A – Z)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Capacity & Subtitle</label>
                <input
                  type="text"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  placeholder="e.g. Air Conditioned Student Suites (400 Rooms)"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Room Count</label>
                <input
                  type="number"
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(parseInt(e.target.value) || 100)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Hostel Warden</label>
                <select
                  value={assignedWarden}
                  onChange={(e) => setAssignedWarden(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Dr. Rajesh Verma">Dr. Rajesh Verma (Hostel Warden)</option>
                  <option value="Dr. Ananya Sharma">Dr. Ananya Sharma (Girls Hostel Warden)</option>
                  <option value="Unassigned">Unassigned (Vacant)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 font-bold text-xs text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md"
                >
                  {editingSector ? 'Save Sector Changes' : 'Create Hostel Sector'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
