'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

/**
 * The login page is no longer needed. This component will redirect any
 * requests for /login to the main dashboard.
 */
export default function LoginPage() {
  useEffect(() => {
    redirect('/dashboard');
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
