import React from 'react';
import { TESTIMONIALS } from '../data/furnitureData';
import { Quote } from 'lucide-react';

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-sand-light border-t border-stone-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-sans uppercase tracking-ultra text-walnut font-semibold block">
            CLIENT FEEDBACK
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal">
            What Our Clients Say
          </h2>
        </div>

        {/* 3 Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-ivory-card border border-stone-border rounded-sm shadow-subtle flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <Quote size={28} className="text-walnut opacity-40" />
                <p className="font-serif text-lg font-normal text-charcoal leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-border">
                <h4 className="font-serif text-base font-semibold text-charcoal">
                  {item.name}
                </h4>
                <p className="font-sans text-xs text-stone">
                  {item.role} • {item.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
