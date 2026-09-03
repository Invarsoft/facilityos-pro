'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, Check, X, Building2, ChevronRight, Layers, ArrowLeft } from 'lucide-react';
import { HostelSector } from '@/lib/types';
import { INITIAL_SECTORS } from '@/lib/mockData';

interface RoomSearchSelectorProps {
  value: string;
  onChange: (selectedRoom: string) => void;
  sectors?: HostelSector[];
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export const RoomSearchSelector: React.FC<RoomSearchSelectorProps> = ({
  value,
  onChange,
  sectors,
  placeholder = 'Select building, floor & room (or type custom room)',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);

  // Stepped Picker States: 1 = Choose Building, 2 = Choose Floor, 3 = Choose Room
  const [activeTab, setActiveTab] = useState<'step' | 'search'>('step');
  const [selectedBuilding, setSelectedBuilding] = useState<HostelSector | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeSectors = useMemo(() => (sectors && sectors.length > 0 ? sectors : INITIAL_SECTORS), [sectors]);

  // Synchronize internal query with external value prop
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  // Generate list of all available rooms across sectors for search mode
  const allRoomsList = useMemo(() => {
    const roomList: { fullLocation: string; sectorName: string; roomNo: string }[] = [];

    activeSectors.forEach((sec) => {
      const floors = sec.floorsCount || 5;
      const roomsPerFloor = sec.roomsPerFloor || 20;

      for (let f = 1; f <= floors; f++) {
        for (let r = 1; r <= roomsPerFloor; r++) {
          const roomNum = `${f}${r < 10 ? '0' + r : r}`;
          const formattedName = `${sec.name} - Room ${roomNum}`;
          roomList.push({
            fullLocation: formattedName,
            sectorName: sec.name,
            roomNo: `Room ${roomNum}`,
          });
        }
      }
    });

    return roomList;
  }, [activeSectors]);

  // Filter options based on user search query
  const filteredRooms = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return allRoomsList.slice(0, 50);

    return allRoomsList
      .filter(
        (item) =>
          item.fullLocation.toLowerCase().includes(query) ||
          item.sectorName.toLowerCase().includes(query) ||
          item.roomNo.toLowerCase().includes(query)
      )
      .slice(0, 100);
  }, [allRoomsList, searchQuery]);

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectRoom = (fullRoomName: string) => {
    setSearchQuery(fullRoomName);
    onChange(fullRoomName);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    onChange(newQuery);
    if (!isOpen) setIsOpen(true);
    if (newQuery.trim().length > 0) setActiveTab('search');
  };

  const handleClear = () => {
    setSearchQuery('');
    onChange('');
    setSelectedBuilding(null);
    setSelectedFloor(null);
    setIsOpen(true);
  };

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Input Box */}
      <div className="relative">
        <MapPin className="w-4 h-4 text-red-600 absolute left-3.5 top-1/2 -translate-y-1/2 shrink-0 z-10" />
        
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-600 focus:border-red-600 shadow-xs"
        />

        {searchQuery ? (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 cursor-pointer"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
        )}
      </div>

      {/* Stepped Dropdown Picker */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 max-h-60 sm:max-h-72 overflow-y-auto touch-pan-y rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 p-2 space-y-2 animate-in fade-in duration-150 scrollbar-thin">
          
          {/* Mode Switcher Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 px-1">
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('step')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                  activeTab === 'step'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 font-bold'
                }`}
              >
                🏢 Select Floor & Room
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${
                  activeTab === 'search'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 font-bold'
                }`}
              >
                🔍 Quick Search
              </button>
            </div>

            <span className="text-[9px] text-slate-400 font-bold hidden sm:inline">Woxsen Campus</span>
          </div>

          {/* TAB 1: STEP-BY-STEP BUILDER */}
          {activeTab === 'step' && (
            <div className="space-y-2">
              {/* STEP 1: BUILDING SELECTION */}
              {!selectedBuilding && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-1">
                    Step 1: Choose Building or Tower
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {activeSectors.map((sec) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => setSelectedBuilding(sec)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-left transition-all group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 group-hover:text-red-700">{sec.name}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600" />
                        </div>
                        <span className="text-[9px] text-slate-500 font-medium block mt-0.5">
                          {sec.floorsCount} Floors • {sec.roomsCount} Rooms
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: FLOOR SELECTION */}
              {selectedBuilding && selectedFloor === null && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <button
                      type="button"
                      onClick={() => setSelectedBuilding(null)}
                      className="text-xs text-red-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Buildings
                    </button>
                    <span className="text-xs font-black text-slate-900 bg-red-50 text-red-900 px-2 py-0.5 rounded-lg border border-red-200">
                      {selectedBuilding.name}
                    </span>
                  </div>

                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-1">
                    Step 2: Select Floor
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                    {Array.from({ length: selectedBuilding.floorsCount || 5 }, (_, i) => i + 1).map((floorNum) => (
                      <button
                        key={floorNum}
                        type="button"
                        onClick={() => setSelectedFloor(floorNum)}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-left transition-all group flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <span className="text-xs font-black text-slate-900 group-hover:text-red-700">Floor {floorNum}</span>
                          <span className="text-[9px] text-slate-500 block font-medium">
                            Rooms {floorNum}01 – {floorNum}{selectedBuilding.roomsPerFloor || 20}
                          </span>
                        </div>
                        <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: ROOM SELECTION */}
              {selectedBuilding && selectedFloor !== null && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <button
                      type="button"
                      onClick={() => setSelectedFloor(null)}
                      className="text-xs text-red-600 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Change Floor
                    </button>
                    <span className="text-xs font-black text-slate-900 bg-red-50 text-red-900 px-2 py-0.5 rounded-lg border border-red-200">
                      {selectedBuilding.name} • Floor {selectedFloor}
                    </span>
                  </div>

                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider px-1">
                    Step 3: Click to Select Room
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-1">
                    {Array.from({ length: selectedBuilding.roomsPerFloor || 20 }, (_, i) => i + 1).map((rNum) => {
                      const formattedRoomNo = `${selectedFloor}${rNum < 10 ? '0' + rNum : rNum}`;
                      const fullLocation = `${selectedBuilding.name} - Room ${formattedRoomNo}`;
                      const isSelected = value === fullLocation;

                      return (
                        <button
                          key={formattedRoomNo}
                          type="button"
                          onClick={() => handleSelectRoom(fullLocation)}
                          className={`p-2 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-red-600 text-white shadow-md font-black'
                              : 'bg-slate-50 hover:bg-red-50 text-slate-800 border border-slate-200 hover:border-red-300'
                          }`}
                        >
                          Room {formattedRoomNo}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SEARCH ALL LIST */}
          {activeTab === 'search' && (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between border-b border-slate-100">
                <span>Matching Rooms ({filteredRooms.length})</span>
                <span className="text-[9px] text-red-600 font-bold">Select or type custom room</span>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                {filteredRooms.length > 0 ? (
                  filteredRooms.map((item) => {
                    const isSelected = value === item.fullLocation;

                    return (
                      <button
                        key={item.fullLocation}
                        type="button"
                        onClick={() => handleSelectRoom(item.fullLocation)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-50 text-red-950 font-black border border-red-200'
                            : 'hover:bg-slate-50 text-slate-700 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Building2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span className="truncate">{item.fullLocation}</span>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-red-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500">
                    No matching room found. <span className="font-bold text-slate-800 font-mono">"{searchQuery}"</span> will be saved as your custom room location.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
