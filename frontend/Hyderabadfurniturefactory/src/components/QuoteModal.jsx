import React from 'react';
import { X } from 'lucide-react';
import QuoteForm from './QuoteForm';

export default function QuoteModal({ isOpen, onClose, initialRequirement = '' }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fadeIn">
      <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-sm shadow-floating border border-stone-border relative p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-charcoal text-white rounded-full hover:bg-walnut transition-colors"
          aria-label="Close quote modal"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <span className="text-[10px] font-sans uppercase tracking-ultra text-walnut font-bold block mb-1">
            FACTORY DIRECT INQUIRY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-charcoal">
            Request a Furniture Quote
          </h2>
          <p className="font-sans text-xs text-stone font-light">
            Specify your project details below. Our technical team in Hyderabad will provide estimated manufacturing timelines and pricing.
          </p>
        </div>

        <QuoteForm defaultSubject={initialRequirement} isModal={true} onClose={onClose} />
      </div>
    </div>
  );
}
