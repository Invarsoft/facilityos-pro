'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AssistantDrawer } from '@/src/features/assistant/components/AssistantDrawer';
import { MobileBottomNav } from './MobileBottomNav';

export const MainLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { aiDrawerOpen, setAiDrawerOpen, isAuthenticated } = useApp();

  // Standalone Full-Screen Pages (University Selector, Standalone Food/Laundry apps):
  const isStandalonePage =
    pathname === '/select-university' ||
    pathname === '/select-facility' ||
    pathname === '/laundry' ||
    pathname === '/food';

  if (isStandalonePage) {
    return (
      <div className="min-h-screen bg-[#070b14] text-white transition-colors relative">
        <main className="w-full min-h-screen p-0 m-0">
          {children}
        </main>
        {isAuthenticated && (
          <AssistantDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
        )}
      </div>
    );
  }

  // Full-width pages without sidebar (Login, Organizations):
  const isFullWidthPage =
    pathname === '/organizations' ||
    pathname.startsWith('/organizations/') ||
    pathname === '/login' ||
    !isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors relative">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex w-full z-10 relative">
        {/* Sidebar ONLY rendered when user IS AUTHENTICATED */}
        {isAuthenticated && !isFullWidthPage && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 p-3.5 sm:p-5 md:p-6 pb-20 md:pb-6 overflow-x-hidden ${isFullWidthPage || !isAuthenticated ? 'w-full max-w-7xl mx-auto' : ''}`}>
          {children}
        </main>
      </div>

      {/* AI Dispatch Desk Slide-Over Drawer */}
      {isAuthenticated && (
        <AssistantDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
      )}

      {/* Mobile Fixed Bottom Navigation Bar - ONLY WHEN AUTHENTICATED */}
      {isAuthenticated && <MobileBottomNav />}
    </div>
  );
};
