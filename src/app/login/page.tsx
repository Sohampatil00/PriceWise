'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@pricewise.co');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();

  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (user) {
      router.push('/dashboard');
      return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError("Login failed. Note: Demo users (admin@pricewise.co, user@pricewise.co) must be created in your Firebase project's Authentication tab.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
        <div className="w-full max-w-md">
          <form onSubmit={handleLogin}>
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center items-center mb-4">
                    <Logo className="size-12 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
                <CardDescription>Sign in to access the PriceWise dashboard.</CardDescription>
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
                      Or use a demo account
                    </span>
                  </div>
                </div>

                <div className="grid w-full grid-cols-2 gap-4">
                  <Button variant="outline" type="button" onClick={() => { setEmail('admin@pricewise.co'); setPassword('password'); setError(null); }}>
                    Admin
                  </Button>
                  <Button variant="outline" type="button" onClick={() => { setEmail('user@pricewise.co'); setPassword('password'); setError(null); }}>
                    User
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        </div>
    </div>
  );
}
