'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import {
  GraduationCap,
  Building2,
  Search,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  ShieldCheck,
  Zap,
  Globe,
  PlusCircle,
} from 'lucide-react';

export default function SelectUniversityGatewayPage() {
  const router = useRouter();
  const { setSelectedOrganization } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>('woxsen_main');

  const universities = [
    {
      id: 'woxsen_main',
      name: 'Woxsen University',
      subtitle: 'Main Residential Campus & Trade Tower',
      location: 'Hyderabad / Telangana',
      code: 'WOX-HYD',
      icon: '🏛️',
      badge: 'Featured Partner',
      students: '4,500+ Students',
      features: ['Food Court & Canteen', 'Hostel Washer Bays', 'Sports Arena', 'Courier Mailroom', 'Digital Gate Pass'],
      bgGradient: 'from-red-600 to-rose-900',
    },
    {
      id: 'woxsen_tech',
      name: 'Woxsen School of Technology',
      subtitle: 'AI, Data Science & Computer Science Hub',
      location: 'Kamkole, Sangareddy',
      code: 'SOT-WOX',
      icon: '💻',
      badge: 'Tech Hub',
      students: '1,800+ Students',
      features: ['AI Innovation Labs', 'Study Pods', 'Robotics Bay'],
      bgGradient: 'from-blue-600 to-indigo-900',
    },
    {
      id: 'woxsen_biz',
      name: 'Woxsen School of Business',
      subtitle: 'MBA & Executive Leadership Campus',
      location: 'Sangareddy, Telangana',
      code: 'SOB-WOX',
      icon: '📈',
      badge: 'Business Center',
      students: '1,200+ Students',
      features: ['Finance Lab', 'Bloomberg Terminals', 'Executive Lounge'],
      bgGradient: 'from-emerald-600 to-teal-900',
    },
    {
      id: 'iit_hyd',
      name: 'IIT Hyderabad',
      subtitle: 'Indian Institute of Technology',
      location: 'Kandi, Sangareddy',
      code: 'IITH-MAIN',
      icon: '⚡',
      badge: 'Partner Institution',
      students: '5,000+ Students',
      features: ['Hostel Mess', 'Central Library', 'Sports Complex'],
      bgGradient: 'from-amber-600 to-orange-900',
    },
    {
      id: 'bits_hyd',
      name: 'BITS Pilani — Hyderabad Campus',
      subtitle: 'Birla Institute of Technology & Science',
      location: 'Jawahar Nagar, Hyderabad',
      code: 'BITS-HYD',
      icon: '🔬',
      badge: 'Partner Institution',
      students: '4,200+ Students',
      features: ['Student Activity Center', 'Laundry Service', 'Courier Desk'],
      bgGradient: 'from-purple-600 to-violet-900',
    },
    {
      id: 'nalsar_law',
      name: 'NALSAR University of Law',
      subtitle: 'National Academy of Legal Studies',
      location: 'Shamirpet, Hyderabad',
      code: 'NALSAR-HYD',
      icon: '⚖️',
      badge: 'Partner Institution',
      students: '1,100+ Students',
      features: ['Moots Court Suite', 'Hostel Maintenance', 'Gate Pass'],
      bgGradient: 'from-slate-700 to-slate-900',
    },
  ];

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAndProceed = (uni: typeof universities[0]) => {
    setSelectedId(uni.id);

    // Update Context / LocalStorage
    if (setSelectedOrganization) {
      setSelectedOrganization({
        id: uni.id,
        name: uni.name,
        slug: uni.code.toLowerCase(),
      } as any);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('selected_university_name', uni.name);
      localStorage.setItem('selected_university_id', uni.id);
    }

    // Proceed to Main Portal Website
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white py-8 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-between">
      
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-red-600/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto w-full space-y-8 relative z-10">
        
        {/* HEADER BRANDING */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-red-500" />
            <span>Campus Selection Gateway</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            Select Your University / College
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
            Choose your campus to access your tailored student portal, live food court tokens, hostel laundry, sports court bookings, and gate pass generator.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="max-w-xl mx-auto relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search university, college name, or campus code..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border-2 border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm font-semibold focus:outline-none focus:border-red-500 transition-all shadow-xl backdrop-blur-md"
          />
        </div>

        {/* UNIVERSITY CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUniversities.map((uni) => {
            const isSelected = selectedId === uni.id;
            return (
              <div
                key={uni.id}
                onClick={() => handleSelectAndProceed(uni)}
                className={`p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900 border-red-500 shadow-2xl shadow-red-600/20 scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900 shadow-lg'
                }`}
              >
                {/* CARD ACCENT TOP GLOW */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${uni.bgGradient}`} />

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{uni.icon}</span>
                    <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                      {uni.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-white group-hover:text-red-400 transition-colors leading-tight">
                      {uni.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5 leading-snug">
                      {uni.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span className="truncate">{uni.location}</span>
                  </div>

                  {/* FEATURE TAGS */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {uni.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/80"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Code: <strong className="text-white">{uni.code}</strong>
                  </span>

                  <button className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs inline-flex items-center gap-1.5 shadow-md transition-all active:scale-95">
                    <span>Enter Campus</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER NOTICE */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2 max-w-xl mx-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Don't see your college listed? Contact your campus administration to register.</span>
        </div>

      </div>

      {/* FOOTER METADATA */}
      <div className="text-center text-[11px] font-bold text-slate-600 pt-8">
        FacilityOS &bull; Smart University Infrastructure Portal &bull; v2.6
      </div>

    </div>
  );
}
