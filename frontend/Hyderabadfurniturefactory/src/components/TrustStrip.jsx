import React from 'react';
import { TRUST_POINTS } from '../data/furnitureData';

export default function TrustStrip() {
  return (
    <section className="bg-sand-light border-y border-stone-border py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {TRUST_POINTS.map((point) => (
            <div
              key={point.number}
              className="flex flex-col space-y-3 group"
            >
              <div className="flex items-center space-x-3">
                <span className="font-serif text-2xl font-light text-walnut">
                  {point.number}
                </span>
                <div className="h-px bg-stone-border flex-1" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal tracking-wide">
                {point.title}
              </h3>
              <p className="font-sans text-sm text-stone leading-relaxed">
                {point.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
