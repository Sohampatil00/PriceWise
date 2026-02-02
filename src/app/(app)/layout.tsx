'use client';
import type { ReactNode } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar-layout';

export default function AppLayout({ children }: { children: ReactNode }) {
  // Removed all authentication and authorization checks.
  return <SidebarLayout>{children}</SidebarLayout>;
}
