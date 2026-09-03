'use client';

import React from 'react';
import { AdminAuthGuard } from '@/src/shared/components/layout/AdminAuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
