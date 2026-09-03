'use client';

import React from 'react';
import { ManagerAuthGuard } from '@/src/shared/components/layout/ManagerAuthGuard';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return <ManagerAuthGuard>{children}</ManagerAuthGuard>;
}
