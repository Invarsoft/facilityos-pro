import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data/furnitureData';
import CategoryModal from './CategoryModal';

export default function Categories({ onOpenQuote }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <section id="furniture" className="py-20 md:py-32 bg-sand-light border-t border-stone-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div>
            <span className="text-xs font-sans uppercase tracking-ultra text-walnut font-semibold block mb-2">
              MANUFACTURING PORTFOLIO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal">
              Our Furniture
            </h2>
          </div>
          <p className="font-sans text-sm md:text-base text-stone max-w-md font-light">
            Thoughtfully designed. Precisely crafted.
          </p>
        </div>

        {/* 6 Grid Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-ivory-card border border-stone-border overflow-hidden group flex flex-col justify-between hover:shadow-card transition-all duration-300"
            >
              {/* Category Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                <img
                  src={cat.image}
                  alt={cat.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/bedroom.jpg";
                  }}
                  className="w-full h-full object-cover img-editorial"
                />
                <div className="absolute top-4 left-4 bg-charcoal text-white text-xs font-serif px-3 py-1 tracking-widest">
                  {cat.number}
                </div>
              </div>

              {/* Category Content */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-charcoal mb-2 group-hover:text-walnut transition-colors">
                    {cat.title}
                  </h3>
                  <p className="font-sans text-xs text-stone font-light leading-relaxed mb-4">
                    {cat.subtitle}
                  </p>

                  <ul className="space-y-1.5 mb-6 border-t border-stone-border pt-4">
                    {cat.items.map((item, idx) => (
                      <li key={idx} className="text-xs font-sans text-stone-dark flex items-center gap-2">
                        <span className="w-1 h-1 bg-walnut rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => setSelectedCategory(cat)}
                  className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-charcoal hover:text-walnut pt-2 group/btn"
                >
                  <span>Explore</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Details Modal */}
      {selectedCategory && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => setSelectedCategory(null)}
          onOpenQuote={onOpenQuote}
        />
      )}
    </section>
  );
}
