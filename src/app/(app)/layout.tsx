'use client';
import type { ReactNode } from 'react';
import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const adminDocRef = useMemoFirebase(() => user ? doc(firestore, 'adminbase', user.uid) : null, [user, firestore]);
  const { data: adminDoc, isLoading: isAdminLoading } = useDoc(adminDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!isAdminLoading && !adminDoc) {
        // Not an admin, or doc doesn't exist
        console.log('User is not an admin, redirecting...');
        router.push('/login?error=auth');
    }
  }, [adminDoc, isAdminLoading, router])


  if (isUserLoading || isAdminLoading || !user || !adminDoc) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return <SidebarLayout>{children}</SidebarLayout>;
}
