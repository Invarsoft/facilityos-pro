import React, { useState } from 'react';
import { PROJECTS } from '../data/furnitureData';
import { MapPin, ArrowUpRight } from 'lucide-react';

export default function Projects({ onOpenQuote }) {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Residential', 'Commercial', 'Hospitality'];

  const filteredProjects = filter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  return (
    <section id="projects" className="py-20 md:py-32 bg-ivory border-t border-stone-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
          <div>
            <span className="text-xs font-sans uppercase tracking-ultra text-walnut font-semibold block mb-2">
              COMPLETED INSTALLATIONS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-charcoal">
              Furniture in Real Spaces.
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 text-xs font-sans uppercase tracking-widest transition-colors ${
                  filter === cat
                    ? 'bg-charcoal text-white font-semibold'
                    : 'bg-sand text-stone-dark hover:bg-stone-light/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-sand-light border border-stone-border rounded-sm overflow-hidden group hover:border-walnut transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] bg-sand overflow-hidden relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover img-editorial"
                  />
                  <div className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-sm text-white text-[10px] uppercase font-sans tracking-widest px-3 py-1">
                    {project.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center text-xs text-stone font-sans gap-1.5">
                    <MapPin size={14} className="text-walnut" />
                    <span>{project.location}</span>
                  </div>

                  <h3 className="font-serif text-2xl font-semibold text-charcoal group-hover:text-walnut transition-colors">
                    {project.title}
                  </h3>

                  <p className="font-sans text-xs text-stone-dark leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => onOpenQuote(`Project Inquiry: ${project.title}`)}
                  className="w-full py-2.5 bg-ivory-card border border-stone-border text-charcoal font-sans text-xs uppercase tracking-widest font-semibold hover:bg-charcoal hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <span>Inquire Similar Furniture</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
