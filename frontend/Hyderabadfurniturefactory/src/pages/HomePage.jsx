import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import Intro from '../components/Intro';
import Craftsmanship from '../components/Craftsmanship';
import FinalCTA from '../components/FinalCTA';

export default function HomePage({ onOpenQuote }) {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <Hero
        onOpenQuote={() => onOpenQuote()}
        onExplore={() => navigate('/furniture')}
      />

      {/* Trust Strip */}
      <TrustStrip />

      {/* Brand Introduction */}
      <Intro onAboutClick={() => navigate('/about')} />

      {/* Factory Craftsmanship Showcase */}
      <Craftsmanship />

      {/* Final Call to Action */}
      <FinalCTA onOpenQuote={() => onOpenQuote()} />
    </div>
  );
}
