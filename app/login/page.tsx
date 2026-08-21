'use client';

// =============================================================================
// /login — the split sign-in screen
// -----------------------------------------------------------------------------
// Built from Figma "KYG - Homepage UI" node 1078:2802 ("Sign In") plus the
// Sign In.pdf export. The frame is 1440 x 900, split
// `minmax(0,44fr) minmax(0,56fr)`: a dark brand ground on the left, the form on
// a cream field to the right.
//
// THE HELIX IS THE HOMEPAGE'S, not a picture of it. The frame shows the strand
// as a flat image fill, but the brief was the live one - so this mounts the
// same <HelixCanvas> the hero uses, with the same HERO_HELIX preset. It keeps
// the pointer interaction (particles are pushed away from the cursor and spring
// back), which is the "helical on hover" behaviour and the reason not to ship
// the flat export.
//
// NO SITE CHROME. /login sits directly under app/ with no route-group layout,
// so SiteHeader and SiteFooter never mount here. That is deliberate and matches
// the frame: the left panel carries its own logo, assurance line and legal
// links, and a second header above it would fight them.
//
// BELOW lg THE BRAND PANEL IS DROPPED and the logo moves above the form. The
// frame only specifies 1440; stacking a 900px-tall decorative panel on top of a
// phone would push the actual sign-in form off-screen, which is the one thing
// this page cannot afford.
// =============================================================================

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { AlertCircle, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

import { KygLogo } from '@/components/shared/Logo';
import { HelixCanvas, HERO_HELIX } from '@/features/home/components/v2/HelixCanvas';
import { HomeIcon } from '@/features/home/components/v2/HomeIcon';

/**
 * Only allow relative paths to flow through `?from`. Anything else (absolute
 * URLs, protocol-relative `//evil.com`, or junk) falls back to '/'. Prevents
 * the page being used as an open-redirect after a successful login.
 */
function safeFrom(raw: string | null): string {
  if (!raw) return '/';
  // Must start with a single forward slash, no double slashes (which would
  // be protocol-relative - `//evil.com` → `https://evil.com`).
  if (!raw.startsWith('/') || raw.startsWith('//')) return '/';
  // No backslash trickery; some browsers normalise `\` → `/` in the URL.
  if (raw.includes('\\')) return '/';
  return raw;
}

/** The five insight areas, with the hero's own 17x17 stroked glyphs. */
const AREAS: { label: string; icon: string }[] = [
  { label: 'Wellness', icon: '638-63' },
  { label: 'Family', icon: '638-184' },
  { label: 'Health', icon: '638-287' },
  { label: 'Longevity', icon: '638-391' },
  { label: 'Ancestry', icon: '638-520' },
];

/** Figtree 700 16/25.6, eden, with the frame's 28%-opacity underline. */
const TLINK =
  'font-kyg text-[15px] font-bold leading-[1.6] tracking-[-0.007em] text-eden ' +
  'shadow-[inset_0_-1px_0_0_rgba(14,77,75,0.28)] transition-shadow hover:shadow-[inset_0_-1px_0_0_rgba(14,77,75,0.9)]';

/** 452 x 62.8, radius 10, white, with the frame's two-layer shadow + inset ring. */
const FIELD_SHELL =
  'relative flex w-full items-center rounded-[10px] bg-white ' +
  'shadow-[0_4px_14px_0_rgba(45,32,18,0.05),0_1px_2px_0_rgba(45,32,18,0.05),inset_0_0_0_1.5px_rgba(27,23,18,0.11)] ' +
  'transition-shadow focus-within:shadow-[0_4px_14px_0_rgba(45,32,18,0.05),0_1px_2px_0_rgba(45,32,18,0.05),inset_0_0_0_1.5px_rgba(14,77,75,0.55)]';

const INPUT =
  'h-[clamp(44px,6.2vh,56px)] w-full rounded-[10px] bg-transparent pl-[44px] pr-[16px] ' +
  'font-kyg text-[16.5px] tracking-[-0.008em] text-bistre outline-none placeholder:text-pewter';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = safeFrom(params.get('from'));

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
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
    <div className="relative isolate min-h-screen bg-linenw lg:h-screen lg:overflow-hidden">
      {/* The homepage's paper grain: the frame carries it as a full-bleed
          `::after` at 42% over a 180x180 noise tile. Fixed rather than
          scrolled - it is texture on the screen, not printed on the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60] opacity-[0.42] mix-blend-soft-light [background-image:url(&quot;data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='180'%20height='180'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='.82'%20numOctaves='3'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='180'%20height='180'%20filter='url(%23n)'/%3E%3C/svg%3E&quot;)]"
      />

      <div className="grid min-h-screen grid-cols-1 lg:h-full lg:min-h-0 lg:grid-cols-[44fr_56fr]">
        {/* ================= brand ground ================= */}
        <aside className="relative isolate hidden min-h-0 flex-col justify-between overflow-hidden bg-[radial-gradient(circle_at_12%_0%,rgba(42,195,162,0.16)_0%,rgba(42,195,162,0)_58%),linear-gradient(163deg,#0E4D4B_0%,#0A3B39_57%,#062927_100%)] px-[clamp(32px,3.4vw,49px)] py-[clamp(28px,2.2vw,31px)] lg:flex">
          {/* The live strand, same component and same preset as the hero. It
              sits at z-0 under the copy, and is pointer-events-none inside the
              component, so it never intercepts a click on the logo. */}
          <HelixCanvas config={HERO_HELIX} className="absolute inset-0 -z-10 h-full w-full" />

          <Link href="/" aria-label="Know Your Genes, home" className="relative w-fit">
            <KygLogo tone="light" className="h-16 w-auto" />
          </Link>

          <div className="relative flex flex-col gap-[clamp(12px,2.1vh,19.2px)] py-[clamp(12px,3vh,27px)]">
            {/* Figtree 800 16.5/20.46 ls 0.15em, textCase=UPPER in the frame */}
            <p className="font-kyg text-[16.5px] font-extrabold uppercase leading-[1.24] tracking-[0.15em] text-java2">
              Your KYG account
            </p>

            {/* Two voices in one heading: Figtree 400 46/52.44 states it,
                Cormorant Garamond 500 italic 50.6/57.68 turns it. The frame
                sets a -1.12 gap between the lines, so they very nearly touch. */}
            <h2 className="max-w-[340px] font-kyg text-[clamp(28px,min(3.2vw,5.1vh),46px)] font-normal leading-[1.12] tracking-[-0.03em] text-linenw">
              Everything you
              <br />
              have learned
              <br />
              about yourself,
              <span className="-mt-[2px] block font-tst text-[clamp(30px,min(3.5vw,5.6vh),50.6px)] font-medium italic leading-[1.14] tracking-normal">
                in one place.
              </span>
            </h2>

            <p className="max-w-[455px] font-kyg text-[clamp(15px,min(1.45vw,2.3vh),20.9px)] font-normal leading-[1.45] tracking-[-0.014em] text-linenw/72">
              Your reports, insights and next steps. Private to you, for as long as you want them.
            </p>

            {/* Five capsules, radius 999, cream at 5% with a 9% inset hairline */}
            <ul className="mt-[6px] flex max-w-[462px] list-none flex-wrap gap-[10px]">
              {AREAS.map((a) => (
                <li
                  key={a.label}
                  className="inline-flex items-center gap-[9px] rounded-full bg-linenw/[0.05] py-[9.5px] pl-[13px] pr-[16px] shadow-[inset_0_0_0_1px_rgba(250,246,239,0.09)]"
                >
                  <HomeIcon id={a.icon} className="h-[17px] w-[17px] shrink-0" />
                  <span className="font-kyg text-[16px] font-semibold leading-[1.6] tracking-[-0.008em] text-linenw/90">
                    {a.label}
                  </span>
                </li>
              ))}
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
          {/* the frame's cool bloom, mint at 55% off the top-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-55 [background:radial-gradient(circle_at_88%_6%,#E2F1ED_0%,rgba(226,241,237,0)_62%)]"
          />

          {/* Only below lg, where the brand panel is gone and the page would
              otherwise open with no mark on it at all. */}
          <div className="mx-auto mb-4 w-full max-w-[404px] sm:mb-6 lg:hidden">
            <Link href="/" aria-label="Know Your Genes, home" className="block w-fit">
              <KygLogo tone="dark" className="h-11 w-auto" />
            </Link>
          </div>

          <div className="mx-auto flex w-full max-w-[404px] flex-col gap-[clamp(12px,2.2vh,19.8px)]">
            <header className="flex flex-col gap-[clamp(6px,1.4vh,12px)]">
              <h1 className="font-kyg text-[clamp(25px,min(2.7vw,4.4vh),40px)] font-normal leading-[1.12] tracking-[-0.03em] text-bistre">
                Good to see you{' '}
                <em className="font-tst text-[clamp(27px,min(3vw,4.8vh),44px)] font-medium italic tracking-normal">
                  again.
                </em>
              </h1>
              <p className="max-w-[430px] font-kyg text-[clamp(14.5px,min(1.25vw,2vh),18px)] leading-[1.45] tracking-[-0.014em] text-nevada">
                Sign in to reach your reports, insights and GENEous Care.
              </p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(10px,1.9vh,18px)] pt-[2.7px]">
              {/* ---- email ---- */}
              <div className="flex flex-col gap-[clamp(5px,1vh,9px)]">
                <label
                  htmlFor="identifier"
                  className="font-kyg text-[15px] font-bold leading-[1.6] tracking-[-0.006em] text-bistre"
                >
                  Email address
                </label>
                <div className={FIELD_SHELL}>
                  <Mail
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[14px] h-[18px] w-[18px] text-pewter"
                  />
                  <input
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="username"
                    required
                    className={INPUT}
                  />
                </div>
              </div>

              {/* ---- password ---- */}
              <div className="flex flex-col gap-[clamp(5px,1vh,9px)]">
                <div className="flex items-baseline justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="font-kyg text-[15px] font-bold leading-[1.6] tracking-[-0.006em] text-bistre"
                  >
                    Password
                  </label>
                  {/* There is no password-reset route in this app - only
                      app/api/auth/register exists, and no /forgot-password page.
                      Rather than ship a link into a 404, this opens a mail to the
                      same care address the frame already prints below as the
                      "locked out" contact, so the two agree. */}
                  <a href="mailto:care@knowyourgenes.in?subject=Password%20reset" className={TLINK}>
                    Forgot password?
                  </a>
                </div>
                <div className={FIELD_SHELL}>
                  <Lock
                    aria-hidden="true"
                    className="pointer-events-none absolute left-[14px] h-[18px] w-[18px] text-pewter"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your password"
                    autoComplete="current-password"
                    required
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
              </div>

              {/* ---- remember ----
                  A real checkbox, visually replaced. The native input keeps the
                  label association, the space key and screen-reader state that a
                  div-with-onClick would throw away. */}
              <label className="inline-flex w-fit cursor-pointer items-center gap-[11px]">
                <span className="relative grid h-[23px] w-[23px] place-items-center">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="peer absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-[7px] shadow-[inset_0_0_0_1.5px_#0E4D4B] transition-colors checked:bg-eden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-java"
                  />
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="pointer-events-none relative h-[15px] w-[15px] text-linenw opacity-0 transition-opacity peer-checked:opacity-100"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                <span className="font-kyg text-[15.5px] leading-[1.55] tracking-[-0.0065em] text-corduroy">
                  Keep me signed in on this device
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
                disabled={loading}
                className="group flex h-[clamp(44px,5.9vh,52px)] w-full items-center justify-center gap-[13px] rounded-[10px] bg-eden font-kyg text-[15.5px] font-bold leading-none tracking-[-0.008em] text-linenw shadow-[0_6px_18px_0_rgba(14,77,75,0.18)] transition-[transform,background,box-shadow] duration-300 hover:-translate-y-[2px] hover:bg-eden2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? 'Signing in…' : 'Sign in'}
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

            {/* ---- or ---- two rules that fade AWAY from the word, so it reads
                as a break in a line rather than a label on a rule. */}
            <div className="flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(27,23,18,0)_0%,rgba(27,23,18,0.11)_100%)]" />
              <span className="font-kyg text-[14px] font-bold uppercase leading-[1.6] tracking-[0.1em] text-pewter">
                or
              </span>
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(27,23,18,0.11)_0%,rgba(27,23,18,0)_100%)]" />
            </div>

            <button
              type="button"
              onClick={() => signIn('google', { callbackUrl: from })}
              className="flex h-[clamp(44px,5.9vh,52px)] w-full items-center justify-center gap-[13px] rounded-[10px] bg-white font-kyg text-[15.5px] font-bold leading-none tracking-[-0.008em] text-bistre shadow-[0_4px_14px_0_rgba(45,32,18,0.05),0_1px_2px_0_rgba(45,32,18,0.05),inset_0_0_0_1.5px_rgba(27,23,18,0.11)] transition-[transform,box-shadow] duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_26px_0_rgba(45,32,18,0.08),inset_0_0_0_1.5px_rgba(27,23,18,0.18)]"
            >
              <GoogleIcon className="h-[21px] w-[21px]" />
              Continue with Google
            </button>

            <div className="border-t border-nevada/40 pt-[25px]">
              <p className="font-kyg text-[15.5px] leading-[1.55] tracking-[-0.0065em] text-nevada">
                New to KYG?{' '}
                <Link href="/register" className={TLINK}>
                  Create an account
                </Link>
                . Locked out?
                <br />
                <a href="mailto:care@knowyourgenes.in" className={TLINK}>
                  care@knowyourgenes.in
                </a>
              </p>
            </div>
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-linenw" />}>
      <LoginForm />
    </Suspense>
  );
}
