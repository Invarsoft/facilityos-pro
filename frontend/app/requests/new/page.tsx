'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { ALL_SERVICE_CATEGORIES } from '@/lib/mockData';
import { Priority } from '@/lib/types';
import {
  Wrench,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Droplets,
  Zap,
  Hammer,
  Wind,
  Building,
  Armchair,
  Wifi,
  Monitor,
  Bed,
  Bus,
  ShieldAlert,
  Waves,
  ArrowUpDown,
} from 'lucide-react';

const ICON_MAP: Record<string, any> = {
  Droplets,
  Zap,
  Hammer,
  Wind,
  Building,
  Armchair,
  Wifi,
  Monitor,
  Bed,
  Bus,
  ShieldAlert,
  Waves,
  ArrowUpDown,
};

function RequestWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledServiceId = searchParams.get('serviceId');
  const scannedAssetTag = searchParams.get('assetTag');

  const { activeOrg, currentUser, activeRole, createTicket, assets, sectors } = useApp();

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

  const isStudent = currentUser?.role === 'student' || currentUser?.role === 'resident';

  const [step, setStep] = useState<number>(1);
  const [masterPortalSelected, setMasterPortalSelected] = useState<boolean>(!!prefilledServiceId);

  const enabledServices = ALL_SERVICE_CATEGORIES.filter((cat) =>
    activeOrg.enabledServiceIds.includes(cat.id)
  );

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    prefilledServiceId || enabledServices[0]?.id || 'plumbing'
  );
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [building, setBuilding] = useState<string>('Hostel A');
  const [block, setBlock] = useState<string>('Block B');
  const [floor, setFloor] = useState<string>('Floor 2');
  const [room, setRoom] = useState<string>('Room 204');
  const [preferredVisitTime, setPreferredVisitTime] = useState<string>('Today 4:00 PM - 6:00 PM');
  const [priority, setPriority] = useState<Priority>('high');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<{ category?: string; priority?: Priority } | null>(null);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (scannedAssetTag) {
      const foundAsset = assets.find((a) => a.assetTag === scannedAssetTag);
      if (foundAsset) {
        setTitle(`Issue with asset ${foundAsset.assetTag} (${foundAsset.name})`);
        if (foundAsset.building) setBuilding(foundAsset.building);
        if (foundAsset.room) setRoom(foundAsset.room);
        setSelectedServiceId(
          foundAsset.category.toLowerCase().includes('ac') ? 'ac_hvac' : 'plumbing'
        );
      }
    }
  }, [scannedAssetTag, assets]);

  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    const lower = text.toLowerCase();
    if (lower.includes('water') || lower.includes('leak') || fontMatch(lower, ['tap', 'pipe', 'flush', 'sink'])) {
      setAiSuggestion({ category: 'Plumbing', priority: 'high' });
    } else if (fontMatch(lower, ['fan', 'light', 'spark', 'switch', 'power', 'current', 'wire'])) {
      setAiSuggestion({ category: 'Electrical', priority: 'high' });
    } else if (fontMatch(lower, ['ac', 'cooling', 'hvac', 'chiller', 'remote'])) {
      setAiSuggestion({ category: 'AC & HVAC', priority: 'normal' });
    }
  };

  function fontMatch(str: string, terms: string[]) {
    return terms.some((t) => str.includes(t));
  }

  const handleApplyAISuggestion = () => {
    if (!aiSuggestion) return;
    if (aiSuggestion.category) {
      const matchedCat = ALL_SERVICE_CATEGORIES.find(
        (c) => c.name.toLowerCase() === aiSuggestion.category?.toLowerCase()
      );
      if (matchedCat) setSelectedServiceId(matchedCat.id);
    }
    if (aiSuggestion.priority) setPriority(aiSuggestion.priority);
  };

  const handleSimulatePhotoUpload = () => {
    const mockPhotos = [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
    ];
    setAttachments((prev) => [...prev, ...mockPhotos]);
  };

  const handleSubmitRequest = async () => {
    setSubmitting(true);
    try {
      const newTicket = await createTicket({
        title: title || `${ALL_SERVICE_CATEGORIES.find((s) => s.id === selectedServiceId)?.name} Request`,
        description,
        serviceId: selectedServiceId,
        location: `${activeOrg.name} — ${building}`,
        building,
        block,
        floor,
        room,
        preferredVisitTime,
        priority,
        attachments,
        assetId: scannedAssetTag || undefined,
      });

      setCreatedTicketId(newTicket.id);
      setStep(4);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-6 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Step Progress Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between text-xs font-extrabold mb-3">
          <span className="text-slate-900 dark:text-white">Raise Service Request</span>
          <span className="text-blue-600 dark:text-blue-400">Step {step} of 4</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {['1. Service', '2. Details', '3. Review', '4. Confirmation'].map((label, idx) => {
            const stepNum = idx + 1;
            const isDone = step > stepNum;
            const isCurrent = step === stepNum;

            return (
              <div key={label} className="space-y-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    isDone
                      ? 'bg-emerald-500'
                      : isCurrent
                      ? 'bg-blue-600'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                />
                <span
                  className={`text-[10px] font-bold block text-center ${
                    isCurrent
                      ? 'text-blue-600 dark:text-blue-400'
                      : isDone
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* QR Prefill Alert Banner */}
      {scannedAssetTag && step === 1 && (
        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4 text-blue-600 shrink-0" />
            <span>QR Asset Scanned: <strong>{scannedAssetTag}</strong>. Location automatically pre-filled.</span>
          </div>
          <span className="text-[10px] font-bold bg-blue-200 dark:bg-blue-900 px-2 py-0.5 rounded">QR Auto-Fill</span>
        </div>
      )}

      {/* Step 1: Select Service Category */}
      {step === 1 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          {/* LEVEL 1: MASTER PORTAL CHOICE CARDS (When not selected yet) */}
          {!masterPortalSelected && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">Step 1 — Master Service Category</span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">What would you like to book or report today?</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select between Hostel Maintenance, Sports Courts Booking, or Courier & Mailroom Packages.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CHOICE 1: HOSTEL & FACILITY MAINTENANCE */}
                <div
                  onClick={() => setMasterPortalSelected(true)}
                  className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-red-600 text-slate-900 space-y-4 shadow-md hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform">
                        🛠️
                      </div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-red-100 text-red-800 border border-red-200">
                        Hostel Repairs
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors">
                        Hostel & Facility Maintenance
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                        Report Plumbing, Electrical, AC/HVAC, Carpentry, and Cleaning complaints in your hostel room.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-xs font-black text-red-600 flex items-center justify-between">
                    <span>View Maintenance Categories</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* CHOICE 2: SPORTS ARENA BOOKING */}
                <div
                  onClick={() => router.push('/sports')}
                  className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-amber-500 text-slate-900 space-y-4 shadow-md hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform">
                        ⚽
                      </div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                        Floodlit Arena
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                        Sports Arena & Courts Booking
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                        Reserve Badminton, Tennis, 5-a-Side Football Turf, and Basketball Courts with instant gate passes.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-xs font-black text-amber-700 flex items-center justify-between">
                    <span>Book Sports Court Slot</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* CHOICE 3: COURIER & MAILROOM PACKAGES */}
                <div
                  onClick={() => router.push('/courier')}
                  className="p-6 rounded-3xl bg-white border-2 border-slate-200 hover:border-blue-600 text-slate-900 space-y-4 shadow-md hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform">
                        📦
                      </div>
                      <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                        4-Digit OTP Pass
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-700 transition-colors">
                        Courier & Mailroom Desk
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                        Track Amazon, Flipkart, BlueDart packages and get 4-digit pickup OTP passcodes.
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 text-xs font-black text-blue-700 flex items-center justify-between">
                    <span>Open Mailroom & View Packages</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 2: MAINTENANCE CATEGORIES GRID (Revealed after clicking Hostel Maintenance) */}
          {masterPortalSelected && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => setMasterPortalSelected(false)}
                  className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Change Service Portal
                </button>
                <span className="text-xs font-black text-slate-900 bg-red-50 text-red-900 px-3 py-1 rounded-xl border border-red-200">
                  🛠️ Hostel Maintenance Active
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900">Select Maintenance Work Category</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose the specific maintenance trade for <strong>{activeOrg.name}</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {enabledServices.map((cat) => {
                  const IconComponent = ICON_MAP[cat.iconName] || Wrench;
                  const isSelected = selectedServiceId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      onClick={() => setSelectedServiceId(cat.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-red-600 bg-red-50/60 dark:bg-red-950/60 text-red-950 dark:text-red-100 ring-2 ring-red-500/20'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-red-600" />}
                      </div>
                      <h3 className="text-xs font-extrabold">{cat.name}</h3>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{cat.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-md shadow-red-600/20 cursor-pointer transition-transform active:scale-95"
                >
                  <span>Continue to Problem Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Step 2: Problem Details */}
      {step === 2 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Step 2 — Problem Details & Location</h2>
            <p className="text-xs text-slate-500 mt-1">Provide clear information so technicians can arrive equipped.</p>
          </div>

          {aiSuggestion && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-purple-500/10 border border-violet-500/30 flex items-center justify-between text-xs text-violet-900 dark:text-violet-200">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-5 h-5 text-violet-600 shrink-0" />
                <div>
                  <p className="font-extrabold">Smart Service Classification</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Detected: <strong>{aiSuggestion.category}</strong> • Suggested Priority: <strong>{aiSuggestion.priority?.toUpperCase()}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={handleApplyAISuggestion}
                className="px-3 py-1.5 rounded-xl bg-violet-600 text-white font-bold text-[11px] hover:bg-violet-700 shrink-0"
              >
                Apply AI Config
              </button>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Request Title / Short Summary *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Bathroom washbasin tap leaking water continuously"
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Describe the issue in detail. AI will analyze your description..."
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            {isStudent && (
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-2">
                <span className="text-emerald-600 text-base">🔒</span>
                <span>Location locked to your allocated hostel room: <strong>{building} ({block}) • {floor} • {room}</strong></span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hostel Tower / Building</label>
                <select
                  value={building}
                  disabled={isStudent}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-bold disabled:bg-slate-100 disabled:text-slate-600"
                >
                  {sectors.filter(s => s.type === 'tower').map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  {sectors.filter(s => s.type === 'tower').length === 0 && (
                    <>
                      <option value="Tower T1">Tower T1</option>
                      <option value="Tower T2">Tower T2</option>
                      <option value="Tower T3">Tower T3</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hostel Block / Wing</label>
                <select
                  value={block}
                  disabled={isStudent}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-bold disabled:bg-slate-100 disabled:text-slate-600"
                >
                  {sectors.filter(s => s.type === 'block').map((s) => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  {sectors.filter(s => s.type === 'block').length === 0 && (
                    <>
                      <option value="Block A">Block A</option>
                      <option value="Block B">Block B</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                {(() => {
                  const selSector = sectors.find((s) => s.name === building) || sectors.find((s) => s.name.includes(building));
                  const maxFloors = selSector?.floorsCount || (building.includes('T1') ? 12 : building.toLowerCase().includes('tower') ? 14 : 5);
                  return (
                    <>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Floor ({maxFloors} Floors)</label>
                      <select
                        value={floor}
                        disabled={isStudent}
                        onChange={(e) => setFloor(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-bold disabled:bg-slate-100 disabled:text-slate-600"
                      >
                        {Array.from({ length: maxFloors }, (_, i) => `Floor ${i + 1}`).map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </>
                  );
                })()}
              </div>

              <div>
                {(() => {
                  const selSector = sectors.find((s) => s.name === building) || sectors.find((s) => s.name.includes(building));
                  const roomsPerFl = selSector?.roomsPerFloor || (building.toLowerCase().includes('tower') ? 24 : 20);
                  const floorNum = parseInt(floor.replace(/\D/g, '')) || 1;
                  
                  let prefix = 'T1';
                  const cleanBld = building.trim();
                  if (cleanBld.toLowerCase().startsWith('block ')) {
                    prefix = cleanBld.replace(/block\s+/i, '').trim().charAt(0).toUpperCase();
                  } else if (cleanBld.toLowerCase().startsWith('tower ')) {
                    const towerPart = cleanBld.replace(/tower\s+/i, '').trim();
                    prefix = towerPart.toUpperCase().startsWith('T') ? towerPart.toUpperCase() : `T${towerPart}`;
                  } else {
                    prefix = cleanBld.split(' ')[0] || 'T1';
                  }

                  return (
                    <>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">Room No ({prefix}-{floorNum}01 to {prefix}-{floorNum}{roomsPerFl})</label>
                      <select
                        value={room}
                        disabled={isStudent}
                        onChange={(e) => setRoom(e.target.value)}
                        className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-bold font-mono disabled:bg-slate-100 disabled:text-slate-600"
                      >
                        {Array.from({ length: roomsPerFl }, (_, i) => {
                          const roomNum = (i + 1).toString().padStart(2, '0');
                          return `${prefix}-${floorNum}${roomNum}`;
                        }).map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value="low">Low (Standard SLA 48h)</option>
                  <option value="normal">Normal (Standard SLA 24h)</option>
                  <option value="high">High (Urgent SLA 12h)</option>
                  <option value="critical">Critical (Immediate SLA 4h)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Preferred Visit Slot</label>
                <input
                  type="text"
                  value={preferredVisitTime}
                  onChange={(e) => setPreferredVisitTime(e.target.value)}
                  placeholder="e.g. Today between 4:00 PM - 6:00 PM"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Attachments (Photos / Proof)
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSimulatePhotoUpload}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Attach Photo</span>
                </button>
                <span className="text-[11px] text-slate-400">{attachments.length} attached</span>
              </div>

              {attachments.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {attachments.map((img, i) => (
                    <img key={i} src={img} alt="Attachment" className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-300" />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20"
            >
              <span>Review Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Step 3 — Review Request Information</h2>
            <p className="text-xs text-slate-500 mt-1">Please confirm details before finalizing submission.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="font-semibold text-slate-500">Service Category:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">
                {ALL_SERVICE_CATEGORIES.find((s) => s.id === selectedServiceId)?.name}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="font-semibold text-slate-500">Title:</span>
              <span className="font-bold text-slate-900 dark:text-white">{title || 'General Repair'}</span>
            </div>

            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="font-semibold text-slate-500">Location:</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {building} — {block} — {floor} — {room}
              </span>
            </div>

            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="font-semibold text-slate-500">Priority:</span>
              <span className="uppercase font-extrabold text-rose-500">{priority}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Preferred Visit:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{preferredVisitTime}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Edit Details</span>
            </button>
            {submitError && (
              <p className="text-xs text-rose-500 font-bold">{submitError}</p>
            )}
            <button
              onClick={handleSubmitRequest}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Submit Service Request'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Submission Confirmation */}
      {step === 4 && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Service Request Submitted Successfully</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Your request has been registered and dispatched to the facility warden/manager.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left space-y-2 text-xs">
            <div className="flex justify-between font-mono font-bold text-blue-600 dark:text-blue-400">
              <span>Ticket ID:</span>
              <span>{createdTicketId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Service Category:</span>
              <span className="font-semibold">{ALL_SERVICE_CATEGORIES.find((s) => s.id === selectedServiceId)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-semibold">{building} ({room})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status:</span>
              <span className="font-bold text-blue-500">New (Under Review)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Expected SLA Response:</span>
              <span className="font-bold text-emerald-500">Within 2 Hours</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => router.push(`/requests/${createdTicketId}`)}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg shadow-blue-600/20"
            >
              Track Live Ticket Status →
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewServiceRequestWizard() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading service request wizard...</div>}>
      <RequestWizardContent />
    </Suspense>
  );
}
