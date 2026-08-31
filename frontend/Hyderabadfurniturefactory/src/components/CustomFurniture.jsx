import React from 'react';
import { ArrowRight, Sliders, Palette, Maximize } from 'lucide-react';

export default function CustomFurniture({ onOpenQuote }) {
  const features = [
    {
      icon: Maximize,
      title: "Custom Dimensions",
      desc: "Designed specifically for your space and wall measurements."
    },
    {
      icon: Sliders,
      title: "Custom Design",
      desc: "Built around your layout, style preference, and storage needs."
    },
    {
      icon: Palette,
      title: "Custom Finish",
      desc: "Choose solid wood types, polish sheens, fabrics, and hardware."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-sand-light border-t border-stone-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="lg:col-span-6 space-y-8">
            <div>
              <span className="text-xs font-sans uppercase tracking-ultra text-walnut font-semibold block mb-2">
                CUSTOM MANUFACTURING
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal leading-[1.15] mb-4">
                Made to Fit Your Space.
              </h2>
              <p className="font-sans text-base text-stone font-light leading-relaxed">
                Your space is unique. We design and manufacture furniture to your dimensions, preferred materials, finishes, and functional requirements.
              </p>
            </div>

            {/* Three Features */}
            <div className="space-y-6 pt-2">
              {features.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-ivory-card border border-stone-border rounded-sm">
                  <div className="p-3 bg-sand text-walnut rounded-sm shrink-0">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal mb-1">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs text-stone leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenQuote}
                className="px-8 py-4 bg-charcoal text-white font-sans text-xs uppercase tracking-widest font-semibold hover:bg-walnut transition-all duration-300 shadow-card inline-flex items-center gap-3 group"
              >
                <span>Start Your Project</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Large Image */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/5] bg-sand overflow-hidden rounded-sm border border-stone-border shadow-floating">
              <img
                src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1400&auto=format&fit=crop"
                alt="Custom furniture manufacturing in Hyderabad"
                className="w-full h-full object-cover img-editorial"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
