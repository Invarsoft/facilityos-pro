import React from 'react';
import { WHY_CHOOSE_US } from '../data/furnitureData';

export default function WhyUs() {
  return (
    <section className="py-20 md:py-32 bg-ivory border-t border-stone-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-sans uppercase tracking-ultra text-walnut font-semibold block">
            MANUFACTURING ADVANTAGE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal">
            Why Choose Us
          </h2>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_CHOOSE_US.map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-sand-light border border-stone-border rounded-sm space-y-4 hover:border-walnut transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <span className="font-serif text-3xl font-light text-walnut block">
                  0{idx + 1}
                </span>
                <h3 className="font-serif text-xl font-semibold text-charcoal">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-stone font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
