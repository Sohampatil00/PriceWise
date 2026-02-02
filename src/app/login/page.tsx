'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth, useUser, useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons/logo';

function LoginContent() {
  const [email, setEmail] = useState('admin@pricewise.co');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, isUserLoading } = useUser();

  useEffect(() => {
    if (searchParams.get('error') === 'auth') {
      setError('You must be an administrator to access this application.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-credential'
      ) {
        if (email === 'admin@pricewise.co') {
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            const newUser = userCredential.user;

            const isAdmin = email === 'admin@pricewise.co';
            const collectionName = 'adminbase';
            const userRole = 'admin';
            const username = newUser.email?.split('@')[0] || '';

            await setDoc(doc(firestore, collectionName, newUser.uid), {
              id: newUser.uid,
              email: newUser.email,
              username: username,
              role: userRole,
            });

            router.push('/dashboard');
          } catch (creationError: any)
          {
            console.error('Auto-creation failed:', creationError);
            setError(
              'Auto-creation failed. Please try again or create the user in the Firebase Console.'
            );
          }
        } else {
          setError('Login failed. Invalid email or password.');
        }
      } else {
        console.error('Login failed:', err);
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleLogin}>
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4 flex items-center justify-center">
              <Logo className="size-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-2xl">
              Welcome Back
            </CardTitle>
            <CardDescription>
              Sign in to access the PriceWise dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@pricewise.co"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or use the demo account
                </span>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  setEmail('admin@pricewise.co');
                  setPassword('password');
                  setError(null);
                }}
              >
                Admin Demo
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><p>Loading...</p></div>}>
      <LoginContent />
    </Suspense>
  );
}
