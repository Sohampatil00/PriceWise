'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth, useUser, initiateAnonymousSignIn } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons/logo';
import { Loader2, User as UserIcon } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // This effect handles redirecting the user once they are authenticated
  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleAnonymousSignIn = () => {
    setIsSigningIn(true);
    if (auth) {
        initiateAnonymousSignIn(auth);
        // The onAuthStateChanged listener in the provider will handle the redirect.
    } else {
        // Handle case where auth is not yet available
        console.error("Auth service not available");
        setIsSigningIn(false);
    }
  };
  
  // Show a global loader while the initial user check is happening or if user is already signed in.
  if (isUserLoading || user) {
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
        <Button onClick={handleAnonymousSignIn} variant="outline" className="w-full" disabled={isSigningIn}>
            {isSigningIn ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserIcon className="mr-2" />}
            Sign in Anonymously
        </Button>
      </CardContent>
    </Card>
  );
}

    