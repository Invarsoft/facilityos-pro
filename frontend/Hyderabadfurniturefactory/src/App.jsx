import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import QuoteModal from './components/QuoteModal';
import ScrollToTop from './components/ScrollToTop';

import HomePage from './pages/HomePage';
import FurniturePage from './pages/FurniturePage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteRequirement, setQuoteRequirement] = useState('');

  const handleOpenQuote = (requirement = '') => {
    setQuoteRequirement(requirement);
    setQuoteModalOpen(true);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#FAF8F5] text-[#1A1918] font-sans antialiased selection:bg-[#3D2E24] selection:text-[#FAF8F5]">
        {/* Navigation Header */}
        <Header onOpenQuote={() => handleOpenQuote()} />

        {/* Page Routes */}
        <main>
          <Routes>
            <Route path="/" element={<HomePage onOpenQuote={handleOpenQuote} />} />
            <Route path="/furniture" element={<FurniturePage onOpenQuote={handleOpenQuote} />} />
            <Route path="/about" element={<AboutPage onOpenQuote={handleOpenQuote} />} />
            <Route path="/projects" element={<ProjectsPage onOpenQuote={handleOpenQuote} />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<HomePage onOpenQuote={handleOpenQuote} />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Floating WhatsApp Button */}
        <WhatsAppButton />

        {/* Global Quote Request Modal */}
        <QuoteModal
          isOpen={quoteModalOpen}
          onClose={() => setQuoteModalOpen(false)}
          initialRequirement={quoteRequirement}
        />
      </div>
    </BrowserRouter>
  );
}
