'use client';

// =============================================================================
// /login - the split sign-in screen
// -----------------------------------------------------------------------------
// The shell (photograph left, cream ground and card right, trust row beneath)
// lives in features/auth/components/auth-ui, shared with /register. This file
// is the card's contents and the sign-in behaviour, nothing else.
//
// IN THE (site) GROUP, so SiteHeader and SiteFooter mount around it. The URL is
// untouched: a route group is a folder the router does not read.
//
// TWO THINGS THE DESIGN DRAWS THAT THE APP DOES NOT HAVE, resolved rather than
// faked:
//
//   OTP     There is no OTP anywhere in this codebase - no route, no provider,
//           no template. The button is drawn as designed and says so when
//           pressed, rather than pointing at a route that does not exist.
//
//   FORGOT  "Forgot password?" has no destination in the design. /set-password
//           is the real one: it emails a two-hour link, and it is the same door
//           a guest-checkout buyer uses to claim the account their order made.
// =============================================================================

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { AlertCircle, Lock, Mail, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

import {
  ALT_BTN,
  AuthScreen,
  CardFoot,
  CardHead,
  CtaArrow,
  Field,
  GoogleIcon,
  MICRO_LINK,
  OrRule,
  PRIMARY_BTN,
} from '@/features/auth/components/auth-ui';
import { cn } from '@/lib/utils';

/**
 * Only relative paths may flow through `?from`. An absolute URL, a
 * protocol-relative `//evil.com`, or backslash trickery falls back to `/` -
 * otherwise this page is an open redirect that arrives with a fresh session.
 */
function safeFrom(raw: string | null): string {
  if (!raw) return '/';
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/';
  if (raw.includes('\\')) return '/';
  return raw;
}

function SignInCard() {
  const router = useRouter();
  const params = useSearchParams();
  const from = safeFrom(params.get('from'));

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
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
    <>
      <CardHead title="Welcome back" blurb="Sign in to access your reports, orders and more." />

      <form onSubmit={handleSubmit} className="mt-[22px]" noValidate>
        <Field
          id="identifier"
          label="Email or phone"
          icon={Mail}
          value={identifier}
          onChange={setIdentifier}
          placeholder="you@example.com"
          autoComplete="username"
          required
        />

        <div className="mt-[16px]">
          <Field
            id="password"
            label="Password"
            icon={Lock}
            type="password"
            aside={
              <Link href="/set-password" className={MICRO_LINK}>
                Forgot password?
              </Link>
            }
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>

        {/* Not in the design, which draws only the resting state. It takes the
            gap above the button, so nothing below it moves when it appears. */}
        {error ? (
          <p
            role="alert"
            className="mt-[12px] flex items-center gap-2 rounded-sm bg-mojo/[0.08] px-3 py-2.5 font-kyg text-[14px] text-mojo"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={loading} className={cn(PRIMARY_BTN, 'mt-[20px]')}>
          {loading ? 'Signing in...' : 'Sign in'}
          {loading ? null : <CtaArrow className="h-[17px] w-[17px]" />}
        </button>
      </form>

      <OrRule />

      <div className="flex gap-[12px]">
        <button type="button" onClick={() => signIn('google', { callbackUrl: from })} className={ALT_BTN}>
          <GoogleIcon className="h-[19px] w-[19px]" />
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() =>
            toast('One-time passcodes are not live yet', {
              description: 'Sign in with your password or Google for now.',
            })
          }
          className={ALT_BTN}
        >
          <MessageCircle className="h-[18px] w-[18px] text-eden" aria-hidden />
          Login with OTP
        </button>
      </div>

      <CardFoot prompt="Don't have an account?" linkLabel="Create account" href="/register" />
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthScreen
      eyebrow="At-home DNA insights"
      headline={'Your health\nquestions,\nclearer answers.'}
      blurb="Science-backed reports on PCOS, pregnancy, mood, bones and more."
    >
      {/* useSearchParams needs a boundary; the card is the smallest thing that
          reads the query, so it is the only part that waits. */}
      <Suspense fallback={<div className="min-h-[420px]" />}>
        <SignInCard />
      </Suspense>
    </AuthScreen>
  );
}
