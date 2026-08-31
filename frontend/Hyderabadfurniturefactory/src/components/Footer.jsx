import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_INFO } from '../data/furnitureData';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Furniture', path: '/furniture' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="bg-charcoal-deep text-ivory border-t border-white/10 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-wider text-white">
              HYDERABAD FURNITURE MFG.
            </h3>
            <p className="font-sans text-xs text-stone-light/80 font-light leading-relaxed max-w-sm">
              Premium furniture manufactured in Hyderabad for homes, villas, apartments, offices, hotels, restaurants, and architectural interior projects.
            </p>
            <p className="font-sans text-[11px] text-stone-light/60">
              IDA Cherlapally & Jubilee Hills Studio • Hyderabad, Telangana, India
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-white font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-light/80 font-light">
              {navLinks.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="hover:text-white transition-colors uppercase tracking-wider text-[11px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Social */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-serif text-sm uppercase tracking-widest text-white font-semibold">
              Direct Contact
            </h4>
            <div className="space-y-2 text-xs text-stone-light/80 font-light">
              <p>Phone: <a href={`tel:${BRAND_INFO.phoneRaw}`} className="hover:text-white">{BRAND_INFO.phone}</a></p>
              <p>WhatsApp: <a href={`https://wa.me/${BRAND_INFO.whatsappRaw}`} target="_blank" rel="noopener noreferrer" className="hover:text-white">{BRAND_INFO.whatsapp}</a></p>
              <p>Email: <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-white">{BRAND_INFO.email}</a></p>
              <p>Location: Hyderabad, Telangana, India</p>
            </div>

            <div className="pt-2 flex items-center space-x-4">
              <a
                href={BRAND_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2 bg-charcoal text-stone-light hover:text-white rounded-full transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href={BRAND_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 bg-charcoal text-stone-light hover:text-white rounded-full transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>

              <a
                href={BRAND_INFO.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="p-2 bg-charcoal text-stone-light hover:text-white rounded-full transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-light/60 text-[11px]">
          <p>© 2026 HYDERABAD FURNITURE MFG. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <span>Bespoke Manufacturing • Hyderabad</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
