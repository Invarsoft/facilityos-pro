import React from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { BRAND_INFO } from '../data/furnitureData';

export default function FinalCTA({ onOpenQuote }) {
  return (
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop"
          alt="Architectural Furniture Space Hyderabad"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/85 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white space-y-8">
        <span className="text-xs font-sans uppercase tracking-ultra text-sand-dark block">
          START A CONVERSATION
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light leading-tight">
          Have a Furniture Project in Mind?
        </h2>

        <p className="font-sans text-base sm:text-lg text-stone-light/90 font-light max-w-2xl mx-auto leading-relaxed">
          Tell us what you're looking for. We'll help turn your requirements into furniture made specifically for your space.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
          <button
            onClick={onOpenQuote}
            className="w-full sm:w-auto px-9 py-4 bg-white text-charcoal font-sans text-xs uppercase tracking-widest font-semibold hover:bg-sand transition-colors shadow-card flex items-center justify-center gap-2 group"
          >
            Get a Quote
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href={`https://wa.me/${BRAND_INFO.whatsappRaw}?text=Hi,%20I%20have%20a%20furniture%20project%20in%20Hyderabad%20and%20would%20like%20to%20discuss.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-9 py-4 bg-transparent border border-white/40 text-white font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white/10 hover:border-white transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare size={16} />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>
    </section>
  );
}
