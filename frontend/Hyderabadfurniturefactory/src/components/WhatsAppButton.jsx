import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { BRAND_INFO } from '../data/furnitureData';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Subtle Tooltip */}
      {showTooltip && (
        <div className="mb-3 bg-charcoal text-white text-xs font-sans p-3 rounded-sm shadow-card max-w-xs border border-white/10 animate-fadeIn flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-sand-light">Need a Quick Furniture Estimate?</p>
            <p className="text-[11px] text-stone-light">Chat directly with our Hyderabad factory team.</p>
          </div>
          <button onClick={() => setShowTooltip(false)} className="text-stone-light hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={`https://wa.me/${BRAND_INFO.whatsappRaw}?text=Hello,%20I%20am%20interested%20in%20custom%20furniture%20manufacturing%20in%20Hyderabad.`}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="bg-charcoal text-white hover:bg-walnut transition-all duration-300 p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-floating flex items-center gap-2 group border border-white/20"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
        <span className="hidden sm:inline text-xs font-sans font-semibold uppercase tracking-widest">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
}
