import React from 'react';
import { BRAND_INFO } from '../data/furnitureData';
import { MapPin, Factory, Award, ShieldCheck } from 'lucide-react';

export default function AboutFactory() {
  return (
    <section id="about" className="py-20 md:py-32 bg-sand-light border-t border-stone-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-block">
              <span className="text-xs font-sans uppercase tracking-ultra text-walnut font-semibold block">
                OUR FACTORY
              </span>
              <div className="h-0.5 w-12 bg-walnut mt-1" />
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal leading-[1.15]">
              Built in Hyderabad. Crafted for Better Living.
            </h2>

            <p className="font-sans text-base text-charcoal font-light leading-relaxed">
              We are a Hyderabad-based furniture manufacturing company focused on creating premium furniture with dependable quality, thoughtful design, and precise craftsmanship.
            </p>

            <p className="font-sans text-sm text-stone font-light leading-relaxed">
              Our manufacturing approach combines modern production techniques with skilled craftsmanship to deliver furniture for homes, offices, hospitality spaces, and custom interior projects.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-border">
              <div className="flex items-center gap-3">
                <Factory size={20} className="text-walnut shrink-0" />
                <div>
                  <h4 className="font-serif text-base font-semibold text-charcoal">Direct Factory</h4>
                  <p className="font-sans text-[11px] text-stone">Cherlapally IDA, Hyderabad</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-walnut shrink-0" />
                <div>
                  <h4 className="font-serif text-base font-semibold text-charcoal">Quality Control</h4>
                  <p className="font-sans text-[11px] text-stone">100% Inspection Standards</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image Collage */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-sand overflow-hidden rounded-sm border border-stone-border">
                <img
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop"
                  alt="Hyderabad Furniture Manufacturing Facility"
                  className="w-full h-full object-cover img-editorial"
                />
              </div>
              <div className="aspect-square bg-sand overflow-hidden rounded-sm border border-stone-border">
                <img
                  src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop"
                  alt="Raw Timber Selection in Hyderabad"
                  className="w-full h-full object-cover img-editorial"
                />
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="aspect-square bg-sand overflow-hidden rounded-sm border border-stone-border">
                <img
                  src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop"
                  alt="Precision Joinery Workshop"
                  className="w-full h-full object-cover img-editorial"
                />
              </div>
              <div className="aspect-[4/5] bg-sand overflow-hidden rounded-sm border border-stone-border">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop"
                  alt="Finished Furniture Installation"
                  className="w-full h-full object-cover img-editorial"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
