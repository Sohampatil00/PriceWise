'use client';

import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useUser } from '@/firebase';
import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { Loader2 } from 'lucide-react';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading, userError } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login.
    if (!isUserLoading && !user) {
      router.replace('/login');
    }
  }, [user, isUserLoading, router]);

  // While checking auth, show a loading screen.
  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If there's an error, display it.
  if (userError) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p className="text-destructive">Error: {userError.message}</p>
      </div>
    );
  }

  // If a user is finally confirmed, render the main app layout.
  if (user) {
    return <SidebarLayout>{children}</SidebarLayout>;
  }

  // If no user (and not loading), router should have already redirected.
  // This is a fallback.
  return null;
}
