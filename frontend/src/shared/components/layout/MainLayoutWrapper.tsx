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
  const { aiDrawerOpen, setAiDrawerOpen } = useApp();

  // Standalone Sub-Apps (Laundry & Food) render full-screen isolated interfaces:
  const isStandaloneSubApp = pathname === '/laundry' || pathname === '/food';

  if (isStandaloneSubApp) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 transition-colors relative">
        <main className="w-full min-h-screen p-0 m-0">
          {children}
        </main>
        <AssistantDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />
      </div>
    );
  }

  // Pages where full width view is rendered without sidebar:
  const isFullWidthPage =
    pathname === '/select-facility' ||
    pathname === '/organizations' ||
    pathname.startsWith('/organizations/') ||
    pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 transition-colors relative">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex w-full z-10 relative">
        {(!isFullWidthPage || sidebarOpen) && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 p-3.5 sm:p-5 md:p-6 pb-20 md:pb-6 overflow-x-hidden ${isFullWidthPage ? 'w-full max-w-7xl mx-auto' : ''}`}>
          {children}
        </main>
      </div>

      {/* AI Dispatch Desk Slide-Over Drawer */}
      <AssistantDrawer isOpen={aiDrawerOpen} onClose={() => setAiDrawerOpen(false)} />

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
};
