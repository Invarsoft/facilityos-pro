import React from 'react';
import ContactSection from '../components/ContactSection';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Top Banner Box - Medium Black */}
      <div className="bg-charcoal-light text-white pt-32 pb-20 md:pt-40 md:pb-28 text-center px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-xs font-sans uppercase tracking-ultra text-stone-light/80 font-bold block">
            FACTORY DIRECT INQUIRIES
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-white">
            Get in Touch with Our Team
          </h1>
          <p className="font-sans text-base text-stone-light/90 font-light max-w-xl mx-auto leading-relaxed">
            Visit our Cherlapally production works or Jubilee Hills experience studio, or request an instant manufacturing quote.
          </p>
        </div>
      </div>

      {/* Contact Details, Map & Interactive Quote Form */}
      <ContactSection />
    </div>
  );
}
