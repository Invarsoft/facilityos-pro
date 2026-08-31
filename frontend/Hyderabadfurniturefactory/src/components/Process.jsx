import React from 'react';
import { PROCESS_STEPS } from '../data/furnitureData';

export default function Process() {
  return (
    <section className="py-20 md:py-32 bg-sand-light border-t border-stone-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-sans uppercase tracking-ultra text-walnut font-semibold block">
            PRODUCTION TIMELINE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal">
            From Idea to Finished Furniture.
          </h2>
        </div>

        {/* 4 Steps Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Subtle connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-12 right-12 h-px bg-stone-border -z-0" />

          {PROCESS_STEPS.map((step) => (
            <div
              key={step.step}
              className="relative z-10 bg-ivory-card border border-stone-border p-8 rounded-sm space-y-4 hover:shadow-card transition-shadow"
            >
              <div className="w-12 h-12 bg-charcoal text-white font-serif text-lg font-bold flex items-center justify-center rounded-sm">
                {step.step}
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal">
                {step.title}
              </h3>
              <p className="font-sans text-xs text-stone font-light leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
