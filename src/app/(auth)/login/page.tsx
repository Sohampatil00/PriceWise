'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth, useUser } from '@/firebase';
import { initiateGoogleSignIn } from '@/firebase/auth/non-blocking-login';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons/logo';
import { Loader2 } from 'lucide-react';
import { getRedirectResult } from 'firebase/auth';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.6-1.879,12.84-5.025l-6.19-4.876C28.29,36.4,26.24,37,24,37c-5.218,0-9.61-3.317-11.28-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,4.876C40.091,35.61,44,29.8,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isProcessingSignIn, setIsProcessingSignIn] = useState(true); // To handle both button click and redirect
  const [error, setError] = useState<string | null>(null);

  // This effect handles the redirect result from Google Sign-In
  useEffect(() => {
    // Only run this when the auth instance is available
    if (auth) {
      getRedirectResult(auth)
        .then((result) => {
          // If result is null, it means the user just landed on the page
          // without a redirect. If there's a result, the onAuthStateChanged
          // listener will handle the user state update.
        })
        .catch((err) => {
          // This catches errors from the redirect flow, e.g., account exists with different credential
          console.error("Google Sign-In Redirect Error:", err);
          setError("An error occurred during sign-in. Please try again.");
        })
        .finally(() => {
          // We are done processing the redirect, whether it succeeded, failed, or didn't happen.
           setIsProcessingSignIn(false);
        });
    }
  }, [auth]);

  // This effect handles redirecting the user once they are authenticated
  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleSignIn = () => {
    setIsProcessingSignIn(true);
    setError(null);
    initiateGoogleSignIn(auth);
  };
  
  // Show a global loader while the initial user check is happening or
  // we are processing a sign-in redirect.
  if (isUserLoading || isProcessingSignIn) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }
  
  // If user exists, we should be redirecting, but this prevents a flash of the login page.
  if (user) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex justify-center">
            <Logo className="size-12 text-primary" />
        </div>
        <CardTitle className="font-headline text-2xl">Welcome to PriceWise</CardTitle>
        <CardDescription>Sign in to access the pricing dashboard.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button onClick={handleGoogleSignIn} variant="outline" className="w-full" disabled={isProcessingSignIn}>
            {isProcessingSignIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon className="mr-2" />}
            Sign in with Google
        </Button>
        {searchParams.get('error') === 'auth' && (
            <p className="px-1 text-center text-sm text-destructive">
                You are not authorized to view this page. Please sign in with an administrator account.
            </p>
        )}
        {error && (
             <p className="px-1 text-center text-sm text-destructive">
                {error}
            </p>
        )}
      </CardContent>
    </Card>
  );
}
