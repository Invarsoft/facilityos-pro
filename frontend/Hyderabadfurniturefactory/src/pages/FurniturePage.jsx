import React from 'react';
import Categories from '../components/Categories';
import CustomFurniture from '../components/CustomFurniture';
import Materials from '../components/Materials';
import Gallery from '../components/Gallery';
import FinalCTA from '../components/FinalCTA';

export default function FurniturePage({ onOpenQuote }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Banner Box - Medium Black */}
      <div className="bg-charcoal-light text-white pt-32 pb-20 md:pt-40 md:pb-28 text-center px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-sans uppercase tracking-ultra text-stone-light/80 font-bold block">
            HYDERABAD MANUFACTURING CATALOG
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white">
            Our Furniture Collections
          </h1>
          <p className="font-sans text-base text-stone-light/90 font-light max-w-xl mx-auto leading-relaxed">
            Thoughtfully designed and engineered in Hyderabad for homes, offices, hotels, and custom interior projects.
          </p>
        </div>
      </div>

      {/* Main Categories Section */}
      <Categories onOpenQuote={onOpenQuote} />

      {/* Custom Furniture Configurator */}
      <CustomFurniture onOpenQuote={() => onOpenQuote('Custom Furniture Project')} />

      {/* Materials & Finishes */}
      <Materials />

      {/* Visual Gallery */}
      <Gallery />

      {/* Final CTA */}
      <FinalCTA onOpenQuote={onOpenQuote} />
    </div>
  );
}
