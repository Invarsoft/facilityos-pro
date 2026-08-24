import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context/AppContext';
import { AppQueryProvider } from '@/src/providers/AppQueryProvider';
import { MainLayoutWrapper } from '@/src/shared/components/layout/MainLayoutWrapper';

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'FacilityOS — Manage. Maintain. Resolve.',
  description: 'Enterprise multi-tenant facility management and service operations platform.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FacilityOS',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        <AppQueryProvider>
          <AppProvider>
            <MainLayoutWrapper>{children}</MainLayoutWrapper>
          </AppProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}
