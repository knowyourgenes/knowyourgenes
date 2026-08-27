'use client';

// =============================================================================
// /set-password - the way back into an account
// -----------------------------------------------------------------------------
// TWO STATES IN ONE ROUTE, chosen by whether the URL carries a token:
//   no token  -> ask for an email address and send a link
//   token     -> ask for a new password and set it
//
// It exists because guest checkout creates an account with no password. That is
// the right call - minting a session from an email typed into a form would hand
// a stranger someone else's genetic reports - but until now it left the buyer
// permanently locked out, with no reset route and no admin repair. Their order,
// their address and eventually their report sat somewhere nobody could reach.
//
// Deliberately plain next to /login and /register. Those two are the storefront
// and carry the live helix; this is the door you use when something has gone
// wrong, and it should load fast and read clearly rather than perform.
// =============================================================================

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

import { KygLogo } from '@/components/shared/Logo';
import { BTN } from '@/components/shared/button-styles';
import { cn } from '@/lib/utils';

// rounded-sm throughout, and the button height comes from the shared BTN rather
// than a literal. /login and /register predate both rules and still carry their
// own radii; copying them here would have added two more files to that debt.
const FIELD_SHELL =
  'relative flex w-full items-center rounded-sm bg-white ' +
  'shadow-[0_4px_14px_0_rgba(45,32,18,0.05),0_1px_2px_0_rgba(45,32,18,0.05),inset_0_0_0_1.5px_rgba(27,23,18,0.11)] ' +
  'transition-shadow focus-within:shadow-[0_4px_14px_0_rgba(45,32,18,0.05),0_1px_2px_0_rgba(45,32,18,0.05),inset_0_0_0_1.5px_rgba(14,77,75,0.55)]';

const INPUT =
  'h-[44px] w-full rounded-sm bg-transparent pl-[44px] pr-[16px] ' +
  'font-kyg text-[16.5px] tracking-[-0.008em] text-bistre outline-none placeholder:text-pewter';

const SUBMIT = cn(
  BTN,
  'mt-[18px] w-full bg-eden font-kyg font-bold tracking-[-0.006em] text-spring transition',
  'hover:bg-eden2 disabled:cursor-not-allowed disabled:opacity-55'
);

const LABEL = 'mb-[7px] block font-kyg text-[13.5px] font-semibold tracking-[-0.005em] text-bistre';

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAF7F2] px-5 py-12">
      <div className="w-full max-w-[440px]">
        <Link href="/" aria-label="Know Your Genes" className="mb-8 inline-block">
          <KygLogo className="h-[38px] w-auto" />
        </Link>
        {children}
      </div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-sm bg-white p-7 shadow-[0_4px_24px_0_rgba(45,32,18,0.06),0_1px_2px_0_rgba(45,32,18,0.05)]">
      {children}
    </div>
  );
}

/** Ask for an address; we email a link. */
function RequestForm({ initialEmail }: { initialEmail?: string }) {
  // Prefilled when we already know who this is - the guest checkout prompt links
  // here with the address the order was filed under, and asking them to retype
  // it would be asking a question we have already answered.
  const [email, setEmail] = useState(initialEmail ?? '');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      // Success and "no such account" are the same answer on purpose, so this
      // screen shows the same thing either way.
      setSent(true);
      if (!res.ok && res.status !== 429) toast.error(json.error ?? 'Something went wrong');
    } catch {
      toast.error('Could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <Card>
        <CheckCircle2 aria-hidden="true" className="mb-3 h-7 w-7 text-eden" />
        <h1 className="mb-2 font-kyg text-[22px] font-bold tracking-[-0.018em] text-bistre">Check your inbox</h1>
        <p className="font-kyg text-[15px] leading-[1.6] text-cape">
          If <strong className="text-bistre">{email}</strong> has an account, we have sent it a link to set a password.
          It expires in two hours. Check your spam folder if it has not arrived in a few minutes.
        </p>
        <Link href="/login" className="mt-5 inline-block font-kyg text-[14.5px] font-bold text-eden underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="mb-2 font-kyg text-[22px] font-bold tracking-[-0.018em] text-bistre">Set your password</h1>
      <p className="mb-6 font-kyg text-[15px] leading-[1.6] text-cape">
        Bought as a guest, or forgotten your password? Enter the email you used and we will send you a link.
      </p>
      <form onSubmit={submit} noValidate>
        <label htmlFor="sp-email" className={LABEL}>
          Email address
        </label>
        <div className={FIELD_SHELL}>
          <Mail aria-hidden="true" className="pointer-events-none absolute left-[14px] h-[18px] w-[18px] text-pewter" />
          <input
            id="sp-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={INPUT}
          />
        </div>
        <button type="submit" disabled={busy || !email} className={SUBMIT}>
          {busy ? 'Sending…' : 'Send me a link'}
        </button>
      </form>
      <p className="mt-5 font-kyg text-[14px] text-cape">
        Remembered it?{' '}
        <Link href="/login" className="font-bold text-eden underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </Card>
  );
}

/** The link was followed; choose a password. */
function CompleteForm({ token, email }: { token: string; email: string }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tooShort = password.length > 0 && password.length < 8;
  const mismatch = confirm.length > 0 && confirm !== password;
  const ready = password.length >= 8 && confirm === password;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'That did not work. Please request a new link.');
        return;
      }
      setDone(true);
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <Card>
        <CheckCircle2 aria-hidden="true" className="mb-3 h-7 w-7 text-eden" />
        <h1 className="mb-2 font-kyg text-[22px] font-bold tracking-[-0.018em] text-bistre">Password set</h1>
        <p className="mb-5 font-kyg text-[15px] leading-[1.6] text-cape">
          You can now sign in with <strong className="text-bistre">{email}</strong> and read your orders and reports.
        </p>
        <Link href="/login" className={SUBMIT + ' mt-0'}>
          Sign in
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <h1 className="mb-2 font-kyg text-[22px] font-bold tracking-[-0.018em] text-bistre">Choose a password</h1>
      <p className="mb-6 font-kyg text-[15px] leading-[1.6] text-cape">
        For <strong className="text-bistre">{email}</strong>. At least 8 characters.
      </p>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-sm bg-[#FBE9E7] px-3.5 py-3">
          <AlertCircle aria-hidden="true" className="mt-[1px] h-[17px] w-[17px] shrink-0 text-[#B3261E]" />
          <p className="font-kyg text-[14px] leading-[1.5] text-[#8C1D18]">
            {error}{' '}
            <Link href="/set-password" className="font-bold underline underline-offset-2">
              Request a new link
            </Link>
          </p>
        </div>
      )}

      <form onSubmit={submit} noValidate>
        <label htmlFor="sp-pass" className={LABEL}>
          New password
        </label>
        <div className={FIELD_SHELL}>
          <Lock aria-hidden="true" className="pointer-events-none absolute left-[14px] h-[18px] w-[18px] text-pewter" />
          <input
            id="sp-pass"
            type={show ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className={INPUT + ' pr-[46px]'}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-[13px] grid h-8 w-8 place-items-center rounded-sm text-pewter transition hover:text-cape"
          >
            {show ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
        </div>
        {tooShort && <p className="mt-1.5 font-kyg text-[13px] text-[#B3261E]">Use at least 8 characters.</p>}

        <label htmlFor="sp-confirm" className={LABEL + ' mt-4'}>
          Confirm password
        </label>
        <div className={FIELD_SHELL}>
          <Lock aria-hidden="true" className="pointer-events-none absolute left-[14px] h-[18px] w-[18px] text-pewter" />
          <input
            id="sp-confirm"
            type={show ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type it again"
            className={INPUT}
          />
        </div>
        {mismatch && <p className="mt-1.5 font-kyg text-[13px] text-[#B3261E]">Those do not match.</p>}

        <button type="submit" disabled={busy || !ready} className={SUBMIT}>
          {busy ? 'Setting…' : 'Set password'}
        </button>
      </form>
    </Card>
  );
}

function SetPasswordInner() {
  const params = useSearchParams();
  const token = params.get('token');
  const email = params.get('email');

  // Both halves are required. A link missing either is not a link we issued, so
  // it falls back to the request form rather than showing a form that cannot work.
  if (token && email) return <CompleteForm token={token} email={email} />;
  return <RequestForm initialEmail={email ?? undefined} />;
}

export default function SetPasswordPage() {
  return (
    <Shell>
      <Suspense fallback={<Card>{null}</Card>}>
        <SetPasswordInner />
      </Suspense>
    </Shell>
  );
}
