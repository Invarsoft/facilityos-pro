import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ArrowRight } from 'lucide-react';
import { BRAND_INFO } from '../data/furnitureData';

export default function CategoryModal({ category, onClose, onOpenQuote }) {
  if (!category) return null;

  const fallbackImage = "/images/bedroom.jpg";
  const [imgSrc, setImgSrc] = useState(category.image || fallbackImage);

  useEffect(() => {
    setImgSrc(category.image || fallbackImage);
  }, [category]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 md:p-10 animate-fadeIn">
      <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-sm shadow-floating overflow-hidden border border-stone-border relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-charcoal text-white rounded-full hover:bg-walnut transition-colors"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Image */}
          <div className="md:col-span-6 relative min-h-[300px] md:min-h-full bg-sand overflow-hidden">
            <img
              src={imgSrc}
              alt={category.title}
              onError={() => setImgSrc(fallbackImage)}
              className="w-full h-full object-cover min-h-[300px] block"
            />
            <div className="absolute top-6 left-6 bg-charcoal text-white font-serif px-4 py-1 text-sm tracking-widest z-10">
              CATEGORY {category.number}
            </div>
          </div>

          {/* Right Details */}
          <div className="md:col-span-6 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-ultra text-walnut font-bold block mb-1">
                HYDERABAD FACTORY SPECIFICATION
              </span>
              <h2 className="font-serif text-3xl font-normal text-charcoal mb-3">
                {category.title}
              </h2>
              <p className="font-sans text-xs text-stone-dark leading-relaxed mb-6">
                {category.description}
              </p>

              <h4 className="font-serif text-lg font-semibold text-charcoal mb-3 border-b border-stone-border pb-2">
                Manufacturing Capabilities:
              </h4>
              <ul className="space-y-2.5">
                {category.items.map((item, idx) => (
                  <li key={idx} className="text-xs font-sans text-charcoal flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-walnut shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-stone-border">
              <button
                onClick={() => {
                  onClose();
                  onOpenQuote(category.title);
                }}
                className="w-full py-3.5 bg-charcoal text-white font-sans text-xs uppercase tracking-widest font-semibold hover:bg-walnut transition-colors flex items-center justify-center gap-2"
              >
                <span>Request {category.title} Quote</span>
                <ArrowRight size={16} />
              </button>

              <a
                href={`https://wa.me/${BRAND_INFO.whatsappRaw}?text=Hi,%20I%20am%20interested%20in%20${encodeURIComponent(category.title)}%20furniture%20manufacturing%20in%20Hyderabad.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-sand text-charcoal font-sans text-xs uppercase tracking-widest font-semibold hover:bg-stone-light transition-colors text-center block"
              >
                Discuss on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
