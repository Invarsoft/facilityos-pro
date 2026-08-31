import React from 'react';
import { MATERIALS_FINISHES } from '../data/furnitureData';
import { Layers } from 'lucide-react';

export default function Materials() {
  return (
    <section className="py-20 md:py-32 bg-ivory border-t border-stone-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div>
            <span className="text-xs font-sans uppercase tracking-ultra text-walnut font-semibold block mb-2">
              SURFACE PALETTE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal">
              Choose Your Finish.
            </h2>
          </div>
          <p className="font-sans text-xs md:text-sm text-stone max-w-md font-light italic">
            "More options available based on specific project requirements."
          </p>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MATERIALS_FINISHES.map((mat, idx) => (
            <div
              key={idx}
              className="bg-sand-light border border-stone-border overflow-hidden rounded-sm group hover:border-walnut transition-all duration-300"
            >
              <div className="aspect-[16/9] bg-sand overflow-hidden relative">
                <img
                  src={mat.image}
                  alt={mat.name}
                  className="w-full h-full object-cover img-editorial"
                />
              </div>

              <div className="p-6 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-semibold text-charcoal">
                    {mat.name}
                  </h3>
                  <Layers size={16} className="text-walnut opacity-60" />
                </div>
                <p className="font-sans text-[11px] font-semibold text-walnut uppercase tracking-wider">
                  {mat.type}
                </p>
                <p className="font-sans text-xs text-stone font-light leading-relaxed">
                  {mat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
