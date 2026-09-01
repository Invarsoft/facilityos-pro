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

  const { activeOrg, currentUser, createTicket, assets } = useApp();

  const [step, setStep] = useState<number>(1);

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

      {/* Step 1: Select Service */}
      {step === 1 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Step 1 — Select Service Category</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the service type available at <strong>{activeOrg.name}</strong>.
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
                      ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/60 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <h3 className="text-xs font-extrabold">{cat.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{cat.description}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20"
            >
              <span>Continue to Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
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

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hostel Tower / Building</label>
                <select
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-bold"
                >
                  <option value="Tower T1">Tower T1 (Boys Residence)</option>
                  <option value="Tower T2">Tower T2 (Boys Residence)</option>
                  <option value="Tower T3">Tower T3 (Boys Residence)</option>
                  <option value="Tower T4">Tower T4 (Girls Residence)</option>
                  <option value="Tower T5">Tower T5 (Girls Residence)</option>
                  <option value="Tower T6">Tower T6 (Girls Residence)</option>
                  <option value="Academic Block 1 & 2">Academic Block 1 & 2</option>
                  <option value="Science & AI/ML Labs">Science & AI/ML Labs</option>
                  <option value="Sports Complex">Sports Complex</option>
                  <option value="Administrative Block">Administrative Block</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hostel Block / Wing</label>
                <select
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-bold"
                >
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Block C">Block C</option>
                  <option value="Block D">Block D</option>
                  <option value="Block E">Block E</option>
                  <option value="Block F">Block F</option>
                  <option value="Block G">Block G</option>
                  <option value="Main Wing">Main Wing</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Floor</label>
                <input
                  type="text"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  placeholder="e.g. Floor 2"
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Room / Unit</label>
                <input
                  type="text"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  placeholder="e.g. Room 204"
                  className="w-full p-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-bold"
                />
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
