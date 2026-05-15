'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * Only allow relative paths to flow through `?from`. Anything else (absolute
 * URLs, protocol-relative `//evil.com`, or junk) falls back to '/'. Prevents
 * the page being used as an open-redirect after a successful login.
 */
function safeFrom(raw: string | null): string {
  if (!raw) return '/';
  // Must start with a single forward slash, no double slashes (which would
  // be protocol-relative — `//evil.com` → `https://evil.com`).
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/';
  // No backslash trickery; some browsers normalise `\` → `/` in the URL.
  if (raw.includes('\\')) return '/';
  return raw;
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = safeFrom(params.get('from'));

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn('credentials', { identifier, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError('Invalid email/phone or password.');
      return;
    }
    toast.success('Signed in');
    router.push(from);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,var(--color-brand-soft),transparent_70%)]"
      />
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center" prefetch={false}>
          <Image
            src="/kyglogo.webp"
            alt="Know Your Genes"
            width={200}
            height={56}
            className="h-14 w-auto object-contain"
            style={{ width: 'auto' }}
            priority
          />
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Use your email or phone with your password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or phone</Label>
                <Input
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com or 9876543210"
                  autoComplete="username"
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="h-11 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" size="lg" className="h-11 w-full" disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
            </form>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Separator className="flex-1" /> OR <Separator className="flex-1" />
            </div>

            <Button
              variant="outline"
              size="lg"
              className="h-11 w-full"
              onClick={() => signIn('google', { callbackUrl: from })}
            >
              <GoogleIcon className="h-4 w-4" /> Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted-foreground">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
