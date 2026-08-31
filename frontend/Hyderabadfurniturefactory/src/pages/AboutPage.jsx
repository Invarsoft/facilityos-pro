import React from 'react';
import AboutFactory from '../components/AboutFactory';
import Craftsmanship from '../components/Craftsmanship';
import WhyUs from '../components/WhyUs';
import Process from '../components/Process';
import FinalCTA from '../components/FinalCTA';

export default function AboutPage({ onOpenQuote }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Banner Box - Medium Black */}
      <div className="bg-charcoal-light text-white pt-32 pb-20 md:pt-40 md:pb-28 text-center px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-sans uppercase tracking-ultra text-stone-light/80 font-bold block">
            CRAFT & MANUFACTURING STORY
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white">
            Built in Hyderabad. Crafted for Living.
          </h1>
          <p className="font-sans text-base text-stone-light/90 font-light max-w-xl mx-auto leading-relaxed">
            Combining modern production technology with traditional woodworking joinery to manufacture timeless furniture.
          </p>
        </div>
      </div>

      {/* About Factory */}
      <AboutFactory />

      {/* Craftsmanship Dark Section */}
      <Craftsmanship />

      {/* Why Choose Us */}
      <WhyUs />

      {/* Process Workflow */}
      <Process />

      {/* Final CTA */}
      <FinalCTA onOpenQuote={onOpenQuote} />
    </div>
  );
}
