import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Intro({ onAboutClick }) {
  return (
    <section className="py-20 md:py-32 bg-ivory">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Photograph */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-sand">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop"
                alt="Crafted furniture in Hyderabad space"
                className="w-full h-full object-cover img-editorial"
              />
            </div>
            {/* Subtle decorative badge */}
            <div className="absolute -bottom-6 -right-6 bg-charcoal text-white p-6 hidden md:block max-w-xs shadow-card">
              <p className="font-serif text-3xl font-light">15+</p>
              <p className="font-sans text-[11px] uppercase tracking-widest text-stone-light/80 mt-1">
                Years of Manufacturing Craftsmanship in Telangana
              </p>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            <div className="inline-block">
              <span className="text-xs font-sans uppercase tracking-ultra text-walnut font-semibold block">
                CRAFTED IN HYDERABAD
              </span>
              <div className="h-0.5 w-12 bg-walnut mt-1" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal leading-[1.15]">
              Furniture Made Around Your Space.
            </h2>

            <p className="font-sans text-base md:text-lg text-stone font-light leading-relaxed">
              We manufacture premium furniture designed to combine functionality, craftsmanship, and refined aesthetics. From individual pieces to complete interiors, we create furniture that fits the way you live and work.
            </p>

            <p className="font-sans text-sm text-stone font-light leading-relaxed">
              Operating directly from our Hyderabad production facility, we serve homeowners, architectural firms, property developers, and commercial enterprises with bespoke furniture engineered to strict quality benchmarks.
            </p>

            <div className="pt-4">
              <button
                onClick={onAboutClick}
                className="inline-flex items-center gap-3 font-sans text-xs uppercase tracking-widest font-semibold text-charcoal hover:text-walnut transition-colors group"
              >
                <span>About Us</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
