import React from 'react';
import { MapPin, Phone, Mail, MessageSquare, Clock, Navigation } from 'lucide-react';
import { BRAND_INFO } from '../data/furnitureData';
import QuoteForm from './QuoteForm';

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-32 bg-ivory border-t border-stone-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-xs font-sans uppercase tracking-ultra text-walnut font-semibold block">
            GET IN TOUCH
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal">
            Let's Build Something Beautiful.
          </h2>
          <p className="font-sans text-base text-stone font-light leading-relaxed">
            Whether you're furnishing a home, office, commercial space, or complete interior project, we'd love to hear about your requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Contact Details & Map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-sand text-walnut rounded-sm shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-charcoal mb-1">
                    Factory & Production Works
                  </h4>
                  <p className="font-sans text-xs text-stone leading-relaxed">
                    {BRAND_INFO.factoryAddress}
                  </p>
                  <p className="font-sans text-[11px] text-walnut font-semibold mt-1">
                    Experience Studio: {BRAND_INFO.experienceCenter}
                  </p>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-sand text-walnut rounded-sm shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-charcoal mb-1">
                    Phone & WhatsApp
                  </h4>
                  <p className="font-sans text-xs text-stone mb-1">
                    Direct Line: <a href={`tel:${BRAND_INFO.phoneRaw}`} className="text-charcoal font-medium hover:underline">{BRAND_INFO.phone}</a>
                  </p>
                  <a
                    href={`https://wa.me/${BRAND_INFO.whatsappRaw}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-walnut font-semibold hover:underline"
                  >
                    <MessageSquare size={14} /> Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-sand text-walnut rounded-sm shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-charcoal mb-1">
                    Email Inquiries
                  </h4>
                  <a href={`mailto:${BRAND_INFO.email}`} className="font-sans text-xs text-charcoal hover:underline">
                    {BRAND_INFO.email}
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-sand text-walnut rounded-sm shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-semibold text-charcoal mb-1">
                    Factory Hours
                  </h4>
                  <p className="font-sans text-xs text-stone">
                    {BRAND_INFO.hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Google Map Representation */}
            <div className="border border-stone-border rounded-sm overflow-hidden bg-sand-light p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-semibold text-charcoal flex items-center gap-2">
                  <Navigation size={14} className="text-walnut" /> Hyderabad Manufacturing Facility Location
                </span>
                <a
                  href={BRAND_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-sans text-walnut hover:underline font-semibold"
                >
                  Open Maps ↗
                </a>
              </div>
              <div className="relative aspect-[16/9] w-full bg-stone-border rounded-sm overflow-hidden">
                <iframe
                  title="Hyderabad Furniture Factory Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15224.957640248446!2d78.572111!3d17.448243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9c2ec17e3f89%3A0x6b8404a3f1244d56!2sCherlapally%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(0.7) contrast(1.1)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>

          {/* Right Quote Form */}
          <div className="lg:col-span-7">
            <h3 className="font-serif text-2xl font-semibold text-charcoal mb-4">
              Request a Custom Manufacturing Quote
            </h3>
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
