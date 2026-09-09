'use client';

// =============================================================================
// /register - Figma "KYG - Page Designs" node 655:1582 ("00 - Sign Up - 1024")
// -----------------------------------------------------------------------------
// Same shell as /login (features/auth/components/auth-ui); only the headline and
// the card's three fields differ, exactly as the two frames differ.
//
// WHERE THE FRAME AND THE SERVER DISAGREE:
//
//   "Email or phone"  registerSchema requires a real email - every transactional
//        message we send (order confirmed, kit dispatched, report ready) goes to
//        it, so an account created against a phone number alone would be one we
//        could never reach. The label is the frame's; a value with no @ is
//        refused with a sentence that says why, instead of a Zod dump.
//
//   Password  The frame promises nothing about the password. The server wants 8+
//        characters with an uppercase and a digit. Checked here first so the
//        rule arrives before a round trip, and worded as the thing still
//        missing rather than as a list of rules.
//
//   Consent  OPEN, AND DELIBERATELY NOT PAPERED OVER. The previous screen gated
//        submission on an explicit genetic-data consent checkbox. This frame
//        draws no checkbox and its card has three pixels of slack, so there is
//        nowhere in it for even a line of fine print. The gate is therefore
//        gone, and signing up currently references neither the Terms nor the
//        Privacy Policy. Restoring it costs 54px of card height - see the note
//        at the foot of the card - and is a call for whoever owns compliance,
//        not for this file.
//
//   OTP  There is no OTP in this codebase. Drawn as designed, and it says so.
// =============================================================================

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
  PRIMARY_BTN,
} from '@/features/auth/components/auth-ui';
import { cn } from '@/lib/utils';

/**
 * Defaults to `/` rather than `/dashboard`: a brand-new account has an empty
 * dashboard, and the homepage is what they were actually looking at. `?from`
 * still wins, so someone sent here from the middle of a checkout goes back to
 * the checkout.
 */
function safeFrom(raw: string | null): string {
  if (!raw) return '/';
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/';
  if (raw.includes('\\')) return '/';
  return raw;
}

/** What the server will still refuse, said as a sentence. */
function passwordProblem(pw: string): string | null {
  const missing: string[] = [];
  if (pw.length < 8) missing.push('8 characters');
  if (!/[A-Z]/.test(pw)) missing.push('a capital letter');
  if (!/[0-9]/.test(pw)) missing.push('a number');
  if (missing.length === 0) return null;
  return 'Your password still needs ' + missing.join(', ') + '.';
}

function SignUpCard() {
  const router = useRouter();
  const params = useSearchParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError('Please tell us your name.');
      return;
    }
    if (!email.includes('@')) {
      setError('We need an email address - that is where your reports are sent.');
      return;
    }
    const pwProblem = passwordProblem(password);
    if (pwProblem) {
      setError(pwProblem);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(json.error ?? 'Could not create your account');
        return;
      }

      // Straight in - they typed this password a second ago, so bouncing them
      // to /login to type it again would be a pointless wall.
      const signedIn = await signIn('credentials', {
        identifier: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (signedIn?.error) {
        toast.success('Account created', { description: 'Please sign in to continue.' });
        router.push('/login');
        return;
      }
      toast.success('Welcome to KYG');
      router.push(safeFrom(params.get('from')));
      router.refresh();
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <CardHead title="Create account" prompt="Already have an account?" linkLabel="Sign in" href="/login" />

      <form onSubmit={handleSubmit} className="mt-[33.75px]" noValidate>
        {/* No glyph, and the same 46px text inset as the two below it. That is
            how the frame draws it - see the `icon` prop's note in auth-ui. */}
        <Field
          id="name"
          label="Full name"
          value={name}
          onChange={setName}
          placeholder="Your name"
          autoComplete="name"
          required
        />

        <div className="mt-[16.9px]">
          <Field
            id="email"
            label="Email or phone"
            icon={Mail}
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="mt-[16.9px]">
          <Field
            id="password"
            label="Password"
            icon={Lock}
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Your password"
            autoComplete="new-password"
            required
          />
        </div>

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
          {loading ? 'Creating...' : 'Create account'}
          {loading ? null : <CtaArrow className="h-[19px] w-[19px]" />}
        </button>
      </form>

      <div className="mt-[16.9px] flex gap-[16.9px]">
        <button type="button" onClick={() => signIn('google', { callbackUrl: safeFrom(params.get('from')) })} className={ALT_BTN}>
          <GoogleIcon className="h-[22px] w-[22px] lg:h-[25.3px] lg:w-[25.3px]" />
          Google
        </button>
        <button
          type="button"
          onClick={() =>
            toast('One-time passcodes are not live yet', {
              description: 'Create your account with a password or Google for now.',
            })
          }
          className={ALT_BTN}
        >
          Sign up with OTP
        </button>
      </div>

      {/*
        NOTHING BELOW THE ALT ROW. The frame's card is a fixed 675px box whose
        contents measure 593.85 - three pixels of slack - so a consent line here
        makes the card, and with it the photo beside it, 54px taller than every
        other thing on the page was drawn against. Said plainly because it is a
        real gap: this screen no longer surfaces the Terms, the Privacy Policy
        or the genetic-data consent anywhere, and the checkbox that used to gate
        submission is gone with the rest of the old layout.
      */}
    </>
  );
}

export default function RegisterPage() {
  return (
    <AuthScreen
      headline={['Start with what your', 'body already knows,']}
      italic="from day one."
      blurb="One account for every test, report and next step."
    >
      <Suspense fallback={<div className="min-h-[400px]" />}>
        <SignUpCard />
      </Suspense>
    </AuthScreen>
  );
}
