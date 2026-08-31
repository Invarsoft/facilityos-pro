import React from 'react';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import FinalCTA from '../components/FinalCTA';

export default function ProjectsPage({ onOpenQuote }) {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Banner Box - Medium Black */}
      <div className="bg-charcoal-light text-white pt-32 pb-20 md:pt-40 md:pb-28 text-center px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-sans uppercase tracking-ultra text-stone-light/80 font-bold block">
            REAL SPACES & FIT-OUTS
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white">
            Furniture in Real Spaces
          </h1>
          <p className="font-sans text-base text-stone-light/90 font-light max-w-xl mx-auto leading-relaxed">
            Explore completed residential, office, restaurant, and hotel furniture projects across Jubilee Hills, HITEC City, Gachibowli, and Hyderabad.
          </p>
        </div>
      </div>

      {/* Projects Showcase */}
      <Projects onOpenQuote={onOpenQuote} />

      {/* Testimonials */}
      <Testimonials />

      {/* Final CTA */}
      <FinalCTA onOpenQuote={onOpenQuote} />
    </div>
  );
}
