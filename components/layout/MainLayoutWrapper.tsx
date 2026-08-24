'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AssistantDrawer } from '../assistant/AssistantDrawer';
import { MobileBottomNav } from './MobileBottomNav';

export const MainLayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Pages where full landing or login view is rendered without sidebar:
  const isFullWidthPage =
    pathname === '/' ||
    pathname === '/select-facility' ||
    pathname === '/organizations' ||
    pathname.startsWith('/organizations/') ||
    pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors relative">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex w-full">
        {!isFullWidthPage && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 p-3.5 sm:p-5 md:p-6 pb-20 md:pb-6 overflow-x-hidden ${isFullWidthPage ? 'w-full max-w-7xl mx-auto' : ''}`}>
          {children}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileBottomNav />

      <AssistantDrawer isOpen={false} onClose={() => {}} />
    </div>
  );
};
