import type { ReactNode } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar-layout';

export default function AppLayout({ children }: { children: ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
