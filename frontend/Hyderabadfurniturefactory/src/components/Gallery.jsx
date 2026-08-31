import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/furnitureData';
import { Maximize2, X } from 'lucide-react';

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('All');
  const [activeImage, setActiveImage] = useState(null);

  const tabs = ['All', 'Living Room', 'Dining', 'Bedroom', 'Office', 'Custom', 'Commercial'];

  const filteredItems = activeTab === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <section className="py-20 md:py-32 bg-ivory border-t border-stone-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <span className="text-xs font-sans uppercase tracking-ultra text-walnut font-semibold block">
            CRAFTED EXCELLENCE
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal">
            Featured Furniture Gallery
          </h2>
          <p className="font-sans text-sm md:text-base text-stone font-light">
            A visual showcase of finished furniture, architectural woodwork, and custom manufacturing.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 text-xs font-sans uppercase tracking-widest transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-charcoal text-white font-semibold'
                  : 'bg-sand text-stone-dark hover:bg-stone-light/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveImage(item)}
              className="group relative aspect-[4/5] bg-sand overflow-hidden cursor-pointer rounded-sm border border-stone-border shadow-subtle"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover img-editorial"
              />

              {/* Minimal Hover Overlay */}
              <div className="absolute inset-0 bg-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 text-white">
                <div className="flex justify-end">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                    <Maximize2 size={16} />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-sans uppercase tracking-ultra text-sand-dark block">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-white">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Lightbox Modal */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-fadeIn" onClick={() => setActiveImage(null)}>
          <div className="relative max-w-5xl max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 p-3 bg-charcoal text-white rounded-full hover:bg-walnut transition-colors"
              aria-label="Close image"
            >
              <X size={20} />
            </button>
            <img
              src={activeImage.image}
              alt={activeImage.title}
              className="max-h-[80vh] w-auto max-w-full object-contain mx-auto rounded-sm"
            />
            <div className="mt-4 text-center text-white">
              <p className="text-xs uppercase tracking-ultra text-stone-light">{activeImage.category}</p>
              <h3 className="font-serif text-2xl font-light">{activeImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
