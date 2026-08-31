import React from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';

export default function Hero({ onOpenQuote, onExplore }) {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Architectural Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop"
          alt="Luxury Modern Interior Furniture in Hyderabad"
          className="w-full h-full object-cover object-center scale-105 animate-subtle-zoom"
        />
        {/* Subtle Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/40 to-charcoal/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pt-24 pb-16">
        <span className="inline-block text-xs md:text-sm font-sans uppercase tracking-ultra text-sand-dark mb-4 bg-charcoal/40 backdrop-blur-sm px-4 py-1.5 border border-white/10 rounded-full">
          Hyderabad Furniture Manufacturing Factory
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto text-balance">
          Furniture Crafted for Exceptional Spaces.
        </h1>

        <p className="font-sans text-base sm:text-lg md:text-xl text-stone-light/90 max-w-2xl mx-auto font-light leading-relaxed mb-10">
          Premium furniture manufactured in Hyderabad with precision, quality, and timeless design.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onOpenQuote}
            className="w-full sm:w-auto px-8 py-4 bg-white text-charcoal font-sans text-xs uppercase tracking-widest font-semibold hover:bg-sand transition-all duration-300 shadow-card flex items-center justify-center gap-2 group"
          >
            Get a Quote
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/40 text-white font-sans text-xs uppercase tracking-widest font-semibold hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center justify-center"
          >
            Explore Furniture
          </button>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/60 flex flex-col items-center gap-2 cursor-pointer hover:text-white transition-colors" onClick={onExplore}>
        <span className="text-[10px] font-sans uppercase tracking-ultra">Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </div>
    </section>
  );
}
