'use client';

// =============================================================================
// /login - Figma "KYG - Page Designs" node 630:1483 ("00 - Sign In - 1024")
// -----------------------------------------------------------------------------
// The shell, the photo panel, the card box and the reassurance strip all live in
// features/auth/components/auth-ui, shared with /register. This file is the
// card's contents and the sign-in behaviour, nothing else.
//
// IN THE (site) GROUP NOW, so SiteHeader and SiteFooter mount around it - the
// frame draws both. The URL is untouched: a route group is a folder the router
// does not read.
//
// TWO THINGS THE FRAME DRAWS THAT THE APP DOES NOT HAVE, resolved rather than
// faked:
//
//   OTP     There is no OTP anywhere in this codebase - no route, no provider,
//           no template. The button is drawn exactly as designed and says so
//           when pressed, rather than pointing at a 404.
//
//   FORGOT  The frame's "Forgot password?" has no destination. /set-password is
//           the real one: it emails a two-hour link, and it is the same door a
//           guest-checkout buyer uses to claim the account their order created.
// =============================================================================

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

import {
  ALT_BTN,
  AuthScreen,
  CardHead,
  CtaArrow,
  Field,
  GoogleIcon,
  MICRO_LINK,
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
      <CardHead title="Sign in" prompt="Don't have an account?" linkLabel="Create account" href="/register" />

      {/* 24px in the frame between the account line and the first label. */}
      <form onSubmit={handleSubmit} className="mt-[33.75px]" noValidate>
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

        <div className="mt-[22.5px]">
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
            placeholder="Your password"
            autoComplete="current-password"
            required
          />
        </div>

        {/* Not in the frame, which draws only the resting state. It appears in
            the 22px gap above the button, so nothing below it moves. */}
        {error ? (
          <p
            role="alert"
            className="mt-[16px] flex items-center gap-2 rounded-sm bg-mojo/[0.08] px-3 py-2.5 font-kyg text-[14.5px] text-mojo"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={loading} className={cn(PRIMARY_BTN, 'mt-[31px]')}>
          {loading ? 'Signing in...' : 'Sign in'}
          {loading ? null : <CtaArrow className="h-[19px] w-[19px]" />}
        </button>
      </form>

      <div className="mt-[16.9px] flex gap-[16.9px]">
        <button type="button" onClick={() => signIn('google', { callbackUrl: from })} className={ALT_BTN}>
          <GoogleIcon className="h-[22px] w-[22px] lg:h-[25.3px] lg:w-[25.3px]" />
          Google
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
          Login with OTP
        </button>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthScreen
      headline={['Everything you have', 'learned about yourself,']}
      italic="in one place."
      blurb="Your reports, insights and next steps, private to you."
    >
      {/* useSearchParams needs a boundary; the card is the smallest thing that
          reads the query, so it is the only part that waits. */}
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <SignInCard />
      </Suspense>
    </AuthScreen>
  );
}
