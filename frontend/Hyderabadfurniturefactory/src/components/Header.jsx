import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare } from 'lucide-react';
import { BRAND_INFO } from '../data/furnitureData';

export default function Header({ onOpenQuote }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Furniture', path: '/furniture' },
    { label: 'About', path: '/about' },
    { label: 'Projects', path: '/projects' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF8F5]/95 backdrop-blur-md py-4 border-b border-stone-border shadow-subtle text-charcoal'
          : 'bg-gradient-to-b from-charcoal/90 via-charcoal/50 to-transparent text-white py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="text-left focus:outline-none group"
        >
          <span
            className={`font-serif text-xl md:text-2xl font-bold tracking-wider block transition-colors ${
              isScrolled ? 'text-charcoal' : 'text-white'
            }`}
          >
            HYDERABAD FURNITURE
          </span>
          <span
            className={`text-[10px] tracking-ultra uppercase block font-sans font-medium transition-colors ${
              isScrolled ? 'text-stone' : 'text-stone-light/80'
            }`}
          >
            FACTORY & CRAFT STUDIO
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-sans font-medium uppercase tracking-widest transition-all duration-200 ${
                  isScrolled
                    ? isActive
                      ? 'text-charcoal border-b border-charcoal pb-0.5 font-semibold'
                      : 'text-stone-dark hover:text-charcoal'
                    : isActive
                    ? 'text-white border-b border-white pb-0.5 font-semibold'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={onOpenQuote}
            className={`px-6 py-2.5 text-xs font-sans font-semibold uppercase tracking-widest transition-all duration-300 ${
              isScrolled
                ? 'bg-charcoal text-white hover:bg-walnut'
                : 'bg-white text-charcoal hover:bg-sand'
            }`}
          >
            Get a Quote
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-md transition-colors ${
            isScrolled ? 'text-charcoal' : 'text-white'
          }`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[73px] bg-[#FAF8F5] z-40 px-6 py-10 flex flex-col justify-between border-t border-stone-border animate-fadeIn">
          <div className="space-y-6">
            <p className="text-[11px] font-sans uppercase tracking-ultra text-stone">
              Navigation Menu
            </p>
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left font-serif text-2xl font-semibold transition-colors ${
                    location.pathname === item.path ? 'text-walnut underline' : 'text-charcoal hover:text-walnut'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-stone-border">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full py-3.5 bg-charcoal text-white font-sans text-xs uppercase tracking-widest font-semibold text-center block"
            >
              Get a Quote
            </button>
            <div className="flex items-center justify-between text-xs text-stone font-sans pt-2">
              <span>HYDERABAD, TELANGANA</span>
              <a
                href={`https://wa.me/${BRAND_INFO.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-walnut font-medium"
              >
                <MessageSquare size={14} /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
