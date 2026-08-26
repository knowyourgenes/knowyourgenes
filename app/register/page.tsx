'use client';

// =============================================================================
// /register — the split sign-up screen
// -----------------------------------------------------------------------------
// Built from Figma "KYG - Homepage UI" node 1078:3000 ("Sign Up") plus the
// Sign Up.pdf export. Same 44/56 split and same brand ground as /login, so the
// two read as one pair; only the left column's middle block and the form differ.
//
// THE HELIX IS THE HOMEPAGE'S COMPONENT, as on /login: <HelixCanvas> with the
// HERO_HELIX preset, so the strand reacts to the pointer rather than being a
// flat export of itself.
//
// TWO PLACES THE DESIGN AND THE EXISTING API DISAGREED, resolved rather than
// papered over - if built literally, every signup would have failed:
//
//   PHONE   registerSchema demanded one (min 10). This form has no phone field
//           and the frame shows none. Phone is now optional in the schema;
//           User.phone is `String? @unique` and guest checkout already creates
//           accounts without one, so phone-less users are not new.
//
//   PASSWORD  The schema requires 8+ chars AND an uppercase AND a number, while
//           the frame promises only "At least 8 characters". The rules are kept
//           - they are a security decision already taken - and the meter and its
//           helper line state what is actually still missing, so the screen
//           stops promising something the server will reject.
// =============================================================================

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { signIn } from 'next-auth/react';
import { AlertCircle, Eye, EyeOff, FileText, Lock, Mail, MessagesSquare, ShieldCheck, User } from 'lucide-react';
import { toast } from 'sonner';

import { KygLogo } from '@/components/shared/Logo';
import { HelixCanvas, HERO_HELIX } from '@/features/home/components/v2/HelixCanvas';

/** The three promises on the brand side, in frame order. */
const BENEFITS: { icon: typeof FileText; title: string; body: string }[] = [
  {
    icon: FileText,
    title: 'Every report in one place',
    body: 'Wellness, family, health, longevity and ancestry, side by side.',
  },
  {
    icon: MessagesSquare,
    title: 'Context when you need it',
    body: 'Reach GENEous Care and counselling from inside your account.',
  },
  {
    icon: ShieldCheck,
    title: 'Consent stays yours',
    body: 'See what you have agreed to, and withdraw it whenever you want.',
  },
];

/** Figtree 700 16, eden, with the frame's 30%-opacity underline. */
const TLINK =
  'font-kyg text-[15px] font-bold text-eden shadow-[inset_0_-1px_0_0_rgba(14,77,75,0.3)] ' +
  'transition-shadow hover:shadow-[inset_0_-1px_0_0_rgba(14,77,75,0.9)]';

const FIELD_SHELL =
  'relative flex w-full items-center rounded-[10px] bg-white ' +
  'shadow-[0_4px_14px_0_rgba(45,32,18,0.05),0_1px_2px_0_rgba(45,32,18,0.05),inset_0_0_0_1.5px_rgba(27,23,18,0.11)] ' +
  'transition-shadow focus-within:shadow-[0_4px_14px_0_rgba(45,32,18,0.05),0_1px_2px_0_rgba(45,32,18,0.05),inset_0_0_0_1.5px_rgba(14,77,75,0.55)]';

const INPUT =
  'h-[clamp(44px,6.2vh,56px)] w-full rounded-[10px] bg-transparent pl-[44px] pr-[16px] ' +
  'font-kyg text-[16.5px] tracking-[-0.008em] text-bistre outline-none placeholder:text-pewter';

const LABEL = 'font-kyg text-[15px] font-bold leading-[1.6] tracking-[-0.006em] text-bistre';

/**
 * Scores a password against the rules the SERVER actually enforces, and says
 * what is still missing.
 *
 * The frame's meter is decorative - four grey bars and a fixed "Use 8
 * characters or more". Wiring it to registerSchema instead means the bar can
 * never sit full while the server would still refuse, which is the failure this
 * component exists to prevent.
 */
function scorePassword(pw: string): { score: number; hint: string } {
  if (!pw) return { score: 0, hint: 'Use 8 characters or more' };
  const long = pw.length >= 8;
  const upper = /[A-Z]/.test(pw);
  const digit = /[0-9]/.test(pw);
  const score = (long ? 1 : 0) + (upper ? 1 : 0) + (digit ? 1 : 0) + (pw.length >= 12 ? 1 : 0);

  const missing: string[] = [];
  if (!long) missing.push('8 characters');
  if (!upper) missing.push('a capital letter');
  if (!digit) missing.push('a number');

  if (missing.length > 0) return { score, hint: 'Still needs ' + missing.join(', ') };
  return { score, hint: pw.length >= 12 ? 'Strong password' : 'Good — 12 characters is stronger' };
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { score, hint } = useMemo(() => scorePassword(password), [password]);
  const canSubmit = !loading && consent && name.trim().length >= 2 && email.includes('@') && score >= 3;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative isolate min-h-screen bg-linenw lg:h-screen lg:overflow-hidden">
      {/* the homepage paper grain, as the frame's full-bleed ::after at 42% */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.42] mix-blend-soft-light [background-image:url(&quot;data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='180'%20height='180'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='.82'%20numOctaves='3'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='180'%20height='180'%20filter='url(%23n)'/%3E%3C/svg%3E&quot;)]"
      />

      <div className="grid min-h-screen grid-cols-1 lg:h-full lg:min-h-0 lg:grid-cols-[44fr_56fr]">
        {/* ================= brand ground ================= */}
        <aside className="relative isolate hidden min-h-0 flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_12%_0%,rgba(42,195,162,0.16)_0%,rgba(42,195,162,0)_58%),linear-gradient(163deg,#0E4D4B_0%,#0A3B39_57%,#062927_100%)] px-[clamp(32px,3.4vw,49px)] py-[clamp(28px,2.2vw,31px)] lg:flex">
          <HelixCanvas config={HERO_HELIX} className="absolute inset-0 -z-10 h-full w-full" />

          <Link href="/" aria-label="Know Your Genes, home" className="relative w-fit">
            <KygLogo tone="light" className="h-16 w-auto" />
          </Link>

          <div className="relative flex flex-col gap-[clamp(12px,2.1vh,19.2px)] py-[clamp(12px,3vh,27px)]">
            <p className="font-kyg text-[16.5px] font-extrabold uppercase leading-[1.24] tracking-[0.15em] text-java2">
              Create your KYG account
            </p>

            {/* Figtree 400 46/52.44 states it; Cormorant Garamond 500 italic
                50.6/57.68 turns it - and here the italic runs to TWO lines, so
                the serif carries more of the headline than it does on /login. */}
            <h2 className="max-w-[340px] font-kyg text-[clamp(28px,min(3.2vw,5.1vh),46px)] font-normal leading-[1.12] tracking-[-0.03em] text-linenw">
              One account.
              <span className="-mt-[2px] block font-tst text-[clamp(30px,min(3.5vw,5.6vh),50.6px)] font-medium italic leading-[1.12] tracking-normal">
                A lifetime of
                <br />
                genetic insight.
              </span>
            </h2>

            <p className="max-w-[455px] font-kyg text-[clamp(15px,min(1.45vw,2.3vh),20.9px)] font-normal leading-[1.45] tracking-[-0.014em] text-linenw/72">
              Set it up once. Everything you learn about yourself gathers here.
            </p>

            {/* Three promises. 38px tile at radius 11 filled java2 @13%, a 19px
                glyph inside, and a 14px gutter to the copy column. */}
            <ul className="mt-[clamp(2px,0.8vh,6px)] flex max-w-[416px] list-none flex-col gap-[clamp(9px,1.8vh,16.2px)]">
              {BENEFITS.map((b) => {
                const Glyph = b.icon;
                return (
                  <li key={b.title} className="grid grid-cols-[38px_minmax(0,1fr)] gap-x-[14px]">
                    <span className="grid h-[38px] w-[38px] place-items-center rounded-[11px] bg-java2/[0.13]">
                      <Glyph className="h-[19px] w-[19px] text-java2" aria-hidden="true" />
                    </span>
                    <div className="flex min-w-0 flex-col">
                      <b className="font-kyg text-[17px] font-bold leading-[1.25] tracking-[-0.012em] text-linenw">
                        {b.title}
                      </b>
                      <span className="mt-[3px] font-kyg text-[15.5px] leading-[1.42] tracking-[-0.007em] text-linenw/60">
                        {b.body}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative border-t border-linenw/50 pt-[clamp(16px,3.4vh,31px)]">
            <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2">
              <span className="inline-flex items-center gap-[9px]">
                <ShieldCheck className="h-4 w-4 shrink-0 text-linenw/85" aria-hidden="true" />
                <span className="font-kyg text-[15.5px] leading-[1.6] tracking-[-0.007em] text-linenw/50">
                  Your data stays confidential
                </span>
              </span>
              <span className="font-kyg text-[15.5px] leading-[1.6] tracking-[-0.007em] text-linenw/50">
                © 2026 Know Your Genes
              </span>
            </div>

            <div className="mt-[7px] flex flex-wrap gap-x-[18px]">
              {[
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
                { label: 'Cookies', href: '/privacy#cookies' },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="font-kyg text-[15.5px] leading-[1.6] tracking-[-0.007em] text-linenw/50 underline-offset-4 transition-colors hover:text-linenw/80 hover:underline"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* ================= form ================= */}
        <main className="relative flex flex-col justify-center overflow-y-auto px-5 py-[clamp(16px,3vh,72px)] sm:px-8 lg:min-h-0 lg:px-[clamp(40px,7vw,120px)] lg:py-[clamp(32px,5vh,88px)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-55 [background:radial-gradient(circle_at_88%_6%,#E2F1ED_0%,rgba(226,241,237,0)_62%)]"
          />

          {/* The frame parks this in the panel's top-right corner. On lg it is
              absolute so it never pushes the centred form down; below lg it
              becomes an ordinary line above the logo. */}
          <p className="order-1 mx-auto mb-3 w-full max-w-[452px] font-kyg text-[15.5px] leading-[1.6] tracking-[-0.0065em] text-nevada lg:absolute lg:right-[clamp(40px,7vw,120px)] lg:top-[30px] lg:mx-0 lg:mb-0 lg:w-auto lg:max-w-none lg:text-[16.5px]">
            Already have an account?{' '}
            <Link href="/login" className={TLINK}>
              Sign in
            </Link>
          </p>

          <div className="order-2 mx-auto mb-4 w-full max-w-[452px] sm:mb-6 lg:hidden">
            <Link href="/" aria-label="Know Your Genes, home" className="block w-fit">
              <KygLogo tone="dark" className="h-11 w-auto" />
            </Link>
          </div>

          <div className="order-3 mx-auto flex w-full max-w-[452px] flex-col gap-[clamp(12px,2.2vh,19.8px)]">
            <header className="flex flex-col gap-[clamp(6px,1.4vh,12px)]">
              <h1 className="font-kyg text-[clamp(25px,min(2.7vw,4.4vh),40px)] font-normal leading-[1.12] tracking-[-0.03em] text-bistre">
                Good to meet{' '}
                <em className="font-tst text-[clamp(27px,min(3vw,4.8vh),44px)] font-medium italic tracking-normal">you.</em>
              </h1>
              <p className="max-w-[460px] font-kyg text-[clamp(14.5px,min(1.25vw,2vh),18px)] leading-[1.45] tracking-[-0.014em] text-nevada">
                Follow your results and what comes next.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(10px,1.9vh,18px)] pt-[2.7px]">
              {/* ---- name ---- */}
              <div className="flex flex-col gap-[clamp(4px,0.8vh,7px)]">
                <label htmlFor="name" className={LABEL}>
                  Full name
                </label>
                <div className={FIELD_SHELL}>
                  <User aria-hidden="true" className="pointer-events-none absolute left-[14px] h-[18px] w-[18px] text-pewter" />
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="As it appears on your ID"
                    autoComplete="name"
                    required
                    className={INPUT}
                  />
                </div>
              </div>

              {/* ---- email ---- */}
              <div className="flex flex-col gap-[clamp(4px,0.8vh,7px)]">
                <label htmlFor="email" className={LABEL}>
                  Email address
                </label>
                <div className={FIELD_SHELL}>
                  <Mail aria-hidden="true" className="pointer-events-none absolute left-[14px] h-[18px] w-[18px] text-pewter" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className={INPUT}
                  />
                </div>
              </div>

              {/* ---- password + meter ---- */}
              <div className="flex flex-col gap-[clamp(4px,0.8vh,7px)]">
                <label htmlFor="password" className={LABEL}>
                  Password
                </label>
                <div className={FIELD_SHELL}>
                  <Lock aria-hidden="true" className="pointer-events-none absolute left-[14px] h-[18px] w-[18px] text-pewter" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    required
                    aria-describedby="pw-hint"
                    className={INPUT + ' !pr-[50px]'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    tabIndex={-1}
                    className="absolute right-[9px] grid h-[clamp(32px,4.1vh,38px)] w-[clamp(32px,4.1vh,38px)] place-items-center rounded-[9px] text-nevada transition hover:bg-eden/[0.06] hover:text-eden"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-[12px] gap-y-1.5 pt-px">
                  <span className="flex min-w-[160px] flex-1 gap-[5px]" aria-hidden="true">
                    {[0, 1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={
                          'h-[4px] flex-1 rounded-[3px] transition-colors duration-300 ' +
                          (i < score ? (score >= 3 ? 'bg-eden' : 'bg-mandalay') : 'bg-bistre/12')
                        }
                      />
                    ))}
                  </span>
                  {/* aria-live so the requirement is announced as it is met,
                      rather than silently changing under a screen reader. */}
                  <span
                    id="pw-hint"
                    aria-live="polite"
                    className="font-kyg text-[14px] font-semibold leading-[1.6] tracking-[-0.0072em] text-pewter"
                  >
                    {hint}
                  </span>
                </div>
              </div>

              {/* ---- consent ----
                  A real checkbox, visually replaced, and REQUIRED: this is the
                  genetic-data consent, so the submit stays disabled until it is
                  ticked rather than failing afterwards. */}
              <label className="flex cursor-pointer gap-[12px]">
                <span className="relative mt-[2px] grid h-[23px] w-[23px] shrink-0 place-items-center">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    required
                    className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[7px] bg-white shadow-[inset_0_0_0_1.5px_rgba(27,23,18,0.11)] transition-colors checked:bg-eden checked:shadow-[inset_0_0_0_1.5px_#0E4D4B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-java"
                  />
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="pointer-events-none relative h-[13px] w-[13px] text-linenw opacity-0 transition-opacity peer-checked:opacity-100"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="font-kyg text-[15px] leading-[1.45] tracking-[-0.0068em] text-corduroy">
                  I agree to the{' '}
                  <Link href="/terms" className={TLINK} onClick={(e) => e.stopPropagation()}>
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className={TLINK} onClick={(e) => e.stopPropagation()}>
                    Privacy Policy
                  </Link>
                  , and consent to KYG processing my genetic data as described there.
                </span>
              </label>

              {error && (
                <p
                  role="alert"
                  className="flex items-center gap-2 rounded-[10px] bg-mojo/[0.08] px-4 py-3 font-kyg text-[15px] text-mojo shadow-[inset_0_0_0_1px_rgba(192,67,47,0.25)]"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="group flex h-[clamp(44px,5.9vh,52px)] w-full items-center justify-center gap-[13px] rounded-[10px] bg-eden font-kyg text-[15.5px] font-bold leading-none tracking-[-0.008em] text-linenw shadow-[0_6px_18px_0_rgba(14,77,75,0.18)] transition-[transform,background,box-shadow] duration-300 hover:-translate-y-[2px] hover:bg-eden2 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
              >
                {loading ? 'Creating your account…' : 'Create account'}
                {!loading && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-[4px]"
                  >
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </form>

            <div className="flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(27,23,18,0)_0%,rgba(27,23,18,0.11)_100%)]" />
              <span className="font-kyg text-[14px] font-bold uppercase leading-[1.6] tracking-[0.1em] text-pewter">
                or
              </span>
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(27,23,18,0.11)_0%,rgba(27,23,18,0)_100%)]" />
            </div>

            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="flex h-[clamp(44px,5.9vh,52px)] w-full items-center justify-center gap-[13px] rounded-[10px] bg-white font-kyg text-[15.5px] font-bold leading-none tracking-[-0.008em] text-bistre shadow-[0_4px_14px_0_rgba(45,32,18,0.05),0_1px_2px_0_rgba(45,32,18,0.05),inset_0_0_0_1.5px_rgba(27,23,18,0.11)] transition-[transform,box-shadow] duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_26px_0_rgba(45,32,18,0.08),inset_0_0_0_1.5px_rgba(27,23,18,0.18)]"
            >
              <GoogleIcon className="h-[21px] w-[21px]" />
              Continue with Google
            </button>
          </div>
        </main>
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
