'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Camera, CheckCircle2, X } from 'lucide-react';

interface QRScannerModalProps {
  onClose: () => void;
  onScan?: (scannedCode: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ onClose, onScan }) => {
  const router = useRouter();
  const [scanning, setScanning] = useState(true);
  const [scannedAsset, setScannedAsset] = useState<string | null>(null);

  const sampleQRCodes = [
    { tag: 'AC-204-B', name: 'Daikin 1.5T AC (Hostel A - Room 204)', category: 'AC & HVAC' },
    { tag: 'FAN-312-A', name: 'Havells Ceiling Fan (Hostel B - Room 312)', category: 'Electrical' },
    { tag: 'ELEV-T3-GV', name: 'Schindler Elevator (Green Valley Tower 3)', category: 'Lift & Elevator' },
  ];

  const handleScanSample = (tag: string) => {
    setScanning(false);
    setScannedAsset(tag);
    setTimeout(() => {
      onClose();
      router.push(`/requests/new?assetTag=${tag}`);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Scan Facility / Asset QR Code</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Simulation */}
        <div className="p-6 text-center space-y-4">
          {scannedAsset ? (
            <div className="py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                Asset Code Verified: {scannedAsset}
              </h4>
              <p className="text-xs text-slate-500">Redirecting to Service Request Wizard with pre-filled asset information...</p>
            </div>
          ) : (
            <>
              <div className="relative w-56 h-56 mx-auto rounded-2xl border-2 border-dashed border-blue-500 bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
                {/* Laser animation */}
                <div className="absolute inset-x-0 h-0.5 bg-blue-500 shadow-md shadow-blue-500 animate-pulse top-1/2" />
                <Camera className="w-10 h-10 text-blue-400/60 mb-2" />
                <p className="text-[11px] text-slate-400 font-mono">Point camera at QR code</p>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Or test by scanning one of these sample asset QR codes:
                </p>
                <div className="space-y-1.5">
                  {sampleQRCodes.map((qr) => (
                    <button
                      key={qr.tag}
                      onClick={() => handleScanSample(qr.tag)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/60 text-xs text-left transition-colors"
                    >
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200">{qr.tag}</p>
                        <p className="text-[10px] text-slate-400">{qr.name}</p>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Simulate Scan →</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
