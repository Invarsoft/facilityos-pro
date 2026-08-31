import React from 'react';
import { CRAFTSMANSHIP_DETAILS } from '../data/furnitureData';

export default function Craftsmanship() {
  const qualities = [
    {
      number: "01",
      title: "Precision",
      desc: "Accurate cutting, tight joinery, and careful attention to floor plan measurements."
    },
    {
      number: "02",
      title: "Materials",
      desc: "Quality teak, oak, walnut, and marine plywood chosen for strength and wood grain."
    },
    {
      number: "03",
      title: "Finish",
      desc: "Multi-stage hand sanding and smooth protective coatings that look and feel natural."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-charcoal text-ivory relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-sans uppercase tracking-ultra text-stone-light/80 font-semibold block">
            FACTORY WORKMANSHIP
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-white">
            Craftsmanship in Every Detail.
          </h2>
          <p className="font-sans text-base text-stone-light/80 font-light leading-relaxed">
            From raw wood selection to cutting, assembly, hand polishing, and final inspection, every piece is made with attention to detail.
          </p>
        </div>

        {/* 3 Qualities Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {qualities.map((item) => (
            <div
              key={item.number}
              className="p-8 bg-charcoal-light border border-white/10 rounded-sm space-y-4 hover:border-white/30 transition-colors"
            >
              <span className="font-serif text-3xl font-light text-stone-light/60 block">
                {item.number}
              </span>
              <h3 className="font-serif text-2xl font-semibold text-white">
                {item.title}
              </h3>
              <p className="font-sans text-xs text-stone-light/80 font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Close-Up Imagery Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CRAFTSMANSHIP_DETAILS.map((detail, idx) => (
            <div key={idx} className="group relative aspect-[16/10] bg-charcoal-deep overflow-hidden rounded-sm border border-white/10">
              <img
                src={detail.image}
                alt={detail.title}
                className="w-full h-full object-cover img-editorial opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-transparent to-transparent p-6 flex flex-col justify-end">
                <h4 className="font-serif text-lg font-semibold text-white mb-1">
                  {detail.title}
                </h4>
                <p className="font-sans text-[11px] text-stone-light/80 font-light">
                  {detail.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
