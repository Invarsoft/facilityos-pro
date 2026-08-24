'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { AIAssistantDrawer } from '../ai/AIAssistantDrawer';

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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex w-full">
        {!isFullWidthPage && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 p-4 md:p-6 overflow-x-hidden ${isFullWidthPage ? 'w-full max-w-7xl mx-auto' : ''}`}>
          {children}
        </main>
      </div>

      <AIAssistantDrawer isOpen={false} onClose={() => {}} />
    </div>
  );
};
