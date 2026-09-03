'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { HostelSector } from '@/lib/types';
import { Building, Building2, Bed, Layers, ChevronRight, PlusCircle, Trash2, Edit2, Search } from 'lucide-react';
import { ConfirmationModal } from '@/src/shared/components/ui/ConfirmationModal';

interface SectorItem {
  id: string;
  name: string;
  type: 'tower' | 'block';
  capacity: string;
  roomsCount: number;
  assignedWarden: string;
}

import { sortSectorsSequentially } from '@/lib/utils/sortingUtils';

export default function FacilityHierarchyPage() {
  const { activeOrg, activeRole, currentUser, users, sectors, addSector, updateSector, deleteSector } = useApp();
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'tower' | 'block'>('all');

  const isChiefAdmin = activeRole === 'admin' || activeRole === 'super_admin' || activeRole === 'org_admin';

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const filteredSectors = sortSectorsSequentially(
    sectors.filter((sec) => {
      // If Warden / Manager, ONLY show towers/blocks allocated to him!
      if (!isChiefAdmin) {
        const liveUser = users.find((u) => u.id === currentUser?.id || u.email === currentUser?.email) || currentUser;
        const wardenName = liveUser?.name || currentUser?.name || '';
        const assignedBlocks = liveUser?.assignedBlocks || currentUser?.assignedBlocks || [];
        const isAssignedWarden = sec.assignedWarden && wardenName && sec.assignedWarden.toLowerCase().includes(wardenName.toLowerCase());
        const isAssignedInBlocks = assignedBlocks.some((b) => b.toLowerCase() === sec.name.toLowerCase());
        if (!isAssignedWarden && !isAssignedInBlocks) {
          return false;
        }
      }

      const matchesType = filterType === 'all' || sec.type === filterType;
      const matchesSearch =
        sec.name.toLowerCase().includes(search.toLowerCase()) ||
        sec.capacity.toLowerCase().includes(search.toLowerCase()) ||
        (sec.assignedWarden && sec.assignedWarden.toLowerCase().includes(search.toLowerCase()));
      return matchesType && matchesSearch;
    })
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState<HostelSector | null>(null);

  // Form Fields
  const [sectorName, setSectorName] = useState('');
  const [sectorType, setSectorType] = useState<'tower' | 'block'>('tower');
  const [floorsCount, setFloorsCount] = useState(14);
  const [roomsPerFloor, setRoomsPerFloor] = useState(24);
  const [occupantsPerRoom, setOccupantsPerRoom] = useState(3);
  const [capacity, setCapacity] = useState('14 Floors • 24 Rooms/Floor • 3 Members/Room (1,008 Student Capacity)');
  const [roomsCount, setRoomsCount] = useState(336);
  const [assignedWarden, setAssignedWarden] = useState('Dr. Rajesh Verma');

  const handleOpenAddModal = () => {
    setEditingSector(null);
    setSectorName('');
    setSectorType('tower');
    setFloorsCount(14);
    setRoomsPerFloor(24);
    setOccupantsPerRoom(3);
    setRoomsCount(336);
    setCapacity('14 Floors • 24 Rooms/Floor • 3 Members/Room (1,008 Student Capacity)');
    setAssignedWarden('Dr. Rajesh Verma');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sec: HostelSector) => {
    setEditingSector(sec);
    setSectorName(sec.name);
    setSectorType(sec.type);
    const defFloors = sec.floorsCount || (sec.name.includes('T1') ? 12 : sec.type === 'tower' ? 14 : 5);
    const defRooms = sec.roomsPerFloor || (sec.type === 'tower' ? 24 : 20);
    const defOccupants = sec.occupantsPerRoom || 3;
    setFloorsCount(defFloors);
    setRoomsPerFloor(defRooms);
    setOccupantsPerRoom(defOccupants);
    setCapacity(sec.capacity);
    setRoomsCount(sec.roomsCount || defFloors * defRooms);
    setAssignedWarden(sec.assignedWarden || 'Unassigned');
    setIsModalOpen(true);
  };

  const handleDeleteSector = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const handleConfirmDeleteSector = () => {
    if (!deleteTarget) return;
    deleteSector(deleteTarget.id);
    setNotice(`Deleted ${deleteTarget.name} from hostel infrastructure list.`);
    setDeleteTarget(null);
  };

  const getSectorPrefix = (name: string): string => {
    const clean = name.trim();
    if (clean.toLowerCase().startsWith('block ')) {
      return clean.replace(/block\s+/i, '').trim().charAt(0).toUpperCase();
    }
    if (clean.toLowerCase().startsWith('tower ')) {
      const towerPart = clean.replace(/tower\s+/i, '').trim();
      if (towerPart.toUpperCase().startsWith('T')) {
        return towerPart.toUpperCase();
      }
      return `T${towerPart}`;
    }
    return clean.split(' ')[0] || 'T1';
  };

  const handleSaveSector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectorName.trim()) {
      alert('Please enter a sector name (e.g. Tower 7 or Block H).');
      return;
    }

    const calculatedRooms = floorsCount * roomsPerFloor;
    const totalStudentCapacity = calculatedRooms * occupantsPerRoom;
    const prefix = getSectorPrefix(sectorName);
    const generatedFormat = `${prefix}-001 to ${prefix}-${floorsCount}${roomsPerFloor.toString().padStart(2, '0')}`;
    const generatedCapacity = `${floorsCount} Floors • ${roomsPerFloor} Rooms/Floor • ${occupantsPerRoom} Members/Room (${totalStudentCapacity.toLocaleString()} Student Capacity | Rooms ${generatedFormat})`;

    if (editingSector) {
      updateSector(editingSector.id, {
        name: sectorName,
        type: sectorType,
        capacity: generatedCapacity,
        roomsCount: calculatedRooms,
        floorsCount,
        roomsPerFloor,
        occupantsPerRoom,
        roomFormat: generatedFormat,
        assignedWarden,
      });
      setNotice(`Updated ${sectorName}: ${floorsCount} Floors x ${roomsPerFloor} Rooms x ${occupantsPerRoom} Members/Room = ${totalStudentCapacity.toLocaleString()} Student Capacity.`);
    } else {
      const newSec: HostelSector = {
        id: 'sec-' + Date.now(),
        name: sectorName,
        type: sectorType,
        capacity: generatedCapacity,
        roomsCount: calculatedRooms,
        floorsCount,
        roomsPerFloor,
        occupantsPerRoom,
        roomFormat: generatedFormat,
        assignedWarden,
      };
      addSector(newSec);
      setNotice(`Added new sector ${sectorName}: ${floorsCount} Floors x ${roomsPerFloor} Rooms x ${occupantsPerRoom} Members/Room = ${totalStudentCapacity.toLocaleString()} Student Capacity.`);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-red-600" />
            <span>Woxsen Hostel Sectors & Towers Management</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {isChiefAdmin
              ? `Manage, add, edit, or remove Hostel Towers & Residential Blocks for ${activeOrg.name}.`
              : `View your assigned Hostel Towers & Residential Blocks for ${activeOrg.name}.`}
          </p>
        </div>

        {isChiefAdmin && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-lg shadow-red-600/30 transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Tower / Block</span>
          </button>
        )}
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice('')} className="text-xs underline font-extrabold">Dismiss</button>
        </div>
      )}

      {/* Search & Sector Type Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
          <Search className="w-4 h-4 text-red-600 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tower or block name (e.g. Tower 7)..."
            className="w-full bg-transparent text-xs text-slate-900 focus:outline-none font-bold"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-red-50 border border-red-200 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-red-600 text-white shadow-xs' : 'text-red-900 hover:text-red-700'
            }`}
          >
            All ({sectors.length})
          </button>
          <button
            onClick={() => setFilterType('tower')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              filterType === 'tower' ? 'bg-red-600 text-white shadow-xs' : 'text-red-900 hover:text-red-700'
            }`}
          >
            Towers ({sectors.filter((s) => s.type === 'tower').length})
          </button>
          <button
            onClick={() => setFilterType('block')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              filterType === 'block' ? 'bg-red-600 text-white shadow-xs' : 'text-red-900 hover:text-red-700'
            }`}
          >
            Blocks ({sectors.filter((s) => s.type === 'block').length})
          </button>
        </div>
      </div>

      {/* Grid of Hostel Sectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSectors.map((sec) => (
          <div
            key={sec.id}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col justify-between space-y-4 hover:border-red-500 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  {sec.type === 'tower' ? <Building2 className="w-5 h-5" /> : <Bed className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-50 text-red-900 border border-red-200">
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
                <span className="font-bold text-red-600">{sec.assignedWarden}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              {isChiefAdmin ? (
                <>
                  <button
                    onClick={() => handleOpenEditModal(sec)}
                    className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSector(sec.id, sec.name)}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-700 font-bold text-xs border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </>
              ) : (
                <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-xs border border-emerald-200 shadow-2xs">
                  🛡️ Allocated Warden Scope
                </span>
              )}
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
                  onChange={(e) => {
                    const newType = e.target.value as 'tower' | 'block';
                    setSectorType(newType);
                    if (newType === 'tower') {
                      setFloorsCount(14);
                      setRoomsPerFloor(24);
                    } else {
                      setFloorsCount(5);
                      setRoomsPerFloor(20);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                >
                  <option value="tower">Hostel Tower (T1: 12 Floors, T2+: 14 Floors)</option>
                  <option value="block">Residential Block (5 Floors)</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Floors</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={floorsCount}
                    onChange={(e) => setFloorsCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Rooms/Floor</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={roomsPerFloor}
                    onChange={(e) => setRoomsPerFloor(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Members/Room</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={occupantsPerRoom}
                    onChange={(e) => setOccupantsPerRoom(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-bold space-y-1">
                <div className="flex items-center justify-between">
                  <span>Total Rooms:</span>
                  <span className="font-extrabold text-blue-700">{floorsCount * roomsPerFloor} Rooms</span>
                </div>
                <div className="flex items-center justify-between text-emerald-800">
                  <span>Total Student Capacity:</span>
                  <span className="font-extrabold text-emerald-700">{(floorsCount * roomsPerFloor * occupantsPerRoom).toLocaleString()} Students</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-blue-700 font-medium">
                  <span>Room Range:</span>
                  <span className="font-mono font-bold">
                    {getSectorPrefix(sectorName)}-001 to {getSectorPrefix(sectorName)}-{floorsCount}{roomsPerFloor.toString().padStart(2, '0')}
                  </span>
                </div>
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

      {/* Custom Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Sector & Facility"
        message={`Are you sure you want to delete ${deleteTarget?.name || 'this sector'}? This will remove it from the hostel infrastructure grid.`}
        confirmLabel="Yes, Delete Sector"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteSector}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
