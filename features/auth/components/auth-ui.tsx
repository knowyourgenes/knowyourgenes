'use client';

// =============================================================================
// features/auth - the shared furniture behind /login and /register
// -----------------------------------------------------------------------------
// Built from Figma "KYG - Page Designs" nodes 630:1483 (Sign In) and 655:1582
// (Sign Up). Both frames are 1024-wide artboards of a 1440 design, so EVERY
// number here is the frame's number x 1.40625 (= 1440 / 1024).
//
// That scale is not a guess - three things in the frame pin it exactly:
//   * the SiteHeader instance is 45.511px tall, and the real header is h-16 (64)
//   * every corner radius is 4.267px, and the only radius we ship is 6px
//   * every hairline is 1.2px, and the field ring elsewhere in the app is 1.5px
// Divide any number below by 1.40625 and you will find it in the frame.
//
// THE TWO SCREENS ARE ONE LAYOUT. Photo panel left, white card right, a
// three-point reassurance strip beneath, site chrome above and below. Only the
// headline and the card's contents differ, so the shell lives here and the two
// pages supply their own form. Building it twice is how the previous pair
// drifted into two sets of field heights and two sets of radii.
//
// SITE CHROME IS BACK. The old pair sat at app/login and app/register with no
// route-group layout and therefore no header or footer, because the frames they
// came from were full-bleed split screens. These frames draw both, so the pages
// moved into app/(site)/ - the URLs are unchanged, route groups are invisible
// to the router.
// =============================================================================

import Image from 'next/image';
import Link from 'next/link';
import { useState, type ComponentType, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Container } from '@/components/shared/Container';
import { cn } from '@/lib/utils';

// -----------------------------------------------------------------------------
// Tokens taken straight off the frame
// -----------------------------------------------------------------------------

/**
 * The field box: 44px tall at frame scale, 1.2px ring, radius 4.267.
 *
 * An inset ring rather than a border, so the hairline does not eat into the
 * 62px height and leave the text sitting a pixel high.
 */
const FIELD_SHELL =
  'relative flex w-full items-center rounded-sm bg-white ' +
  'shadow-[inset_0_0_0_1.5px_rgba(27,23,18,0.11)] transition-shadow ' +
  'focus-within:shadow-[inset_0_0_0_1.5px_rgba(14,77,75,0.55)]';

/**
 * Figtree 400 12.5/15, tracking -0.1, placeholder #8a8378.
 *
 * 16px on phones rather than the scaled 17.6 everywhere: iOS zooms the viewport
 * on focus for any input under 16px, and the frame has nothing to say about a
 * 390px screen.
 */
const INPUT =
  'h-[54px] w-full rounded-sm bg-transparent pr-[16px] font-kyg text-[16px] ' +
  'tracking-[-0.008em] text-bistre outline-none placeholder:text-[#8a8378] ' +
  'lg:h-[62px] lg:text-[17.6px]';

/**
 * The frame insets this content 40px in 1024 - 56.25 at true scale - which is
 * WIDER than the site's own 40px chrome gutter, so the panel sits a little
 * inside the nav above it. That is how the frame draws it, and Container is
 * built to take a gutter override for exactly this (see its doc comment), so
 * the shell width rule is still satisfied - only the gutter moves.
 *
 * Left at the ambient gutter below lg, where the frame says nothing and the
 * page needs every pixel it can get.
 */
const GUTTER = 'lg:px-[56.25px]';

/** Figtree 600 11/14, #1b1712. */
export const LABEL =
  'font-kyg text-[13.5px] font-semibold leading-[17px] text-bistre lg:text-[15.5px] lg:leading-[19.7px]';

/**
 * Figtree 600 10.5, eden - the "Forgot password?" affordance.
 *
 * The leading is pinned to the label's, not left to `leading-normal`. Both sit
 * in the same 19.7px row in the frame; without this the smaller type still
 * makes the taller line box and pushes everything under it down 2.8px.
 */
export const MICRO_LINK =
  'font-kyg text-[13px] font-semibold leading-[17px] text-eden underline-offset-[3px] ' +
  'hover:underline lg:text-[14.8px] lg:leading-[19.7px]';

/**
 * Primary CTA: 42px tall at frame scale, with the eden drop shadow.
 *
 * NOT the shared BTN box (44px, docs/DESIGN.md 2). These frames draw a 59px
 * button under a stack of 62px fields, and the shared height would leave the
 * one thing you are meant to press smaller than every box above it. The rule
 * exists to stop six arbitrary heights, not to shrink a designed one - and
 * 59 > 44, so the touch target it protects is still met.
 */
export const PRIMARY_BTN =
  'flex h-[52px] w-full items-center justify-center gap-[8.4px] rounded-sm bg-eden ' +
  'font-kyg text-[15.5px] font-bold leading-[21px] tracking-[-0.007em] text-linenw ' +
  'shadow-[0_6px_18px_0_rgba(14,77,75,0.18)] transition-colors hover:bg-eden2 ' +
  'disabled:cursor-not-allowed disabled:opacity-60 lg:h-[59px] lg:text-[17.6px]';

/** The two secondary buttons under it: 44px at frame scale, a field's own ring. */
export const ALT_BTN =
  'flex h-[54px] flex-1 items-center justify-center gap-[11.25px] rounded-sm bg-white ' +
  'font-kyg text-[16px] font-medium leading-[28px] text-bistre ' +
  'shadow-[inset_0_0_0_1.5px_rgba(27,23,18,0.11)] transition-shadow ' +
  'hover:shadow-[inset_0_0_0_1.5px_rgba(27,23,18,0.22)] lg:h-[62px] lg:text-[19.7px]';

// -----------------------------------------------------------------------------
// Field
// -----------------------------------------------------------------------------

type FieldProps = {
  id: string;
  label: string;
  /** Right-hand side of the label row - the frame only uses it for "Forgot password?". */
  aside?: ReactNode;
  /**
   * Optional, because the frame's "Full name" field genuinely has no glyph
   * while keeping the same 46px text inset as its neighbours. Reproduced as
   * drawn rather than tidied.
   */
  icon?: ComponentType<{ className?: string }>;
  type?: 'text' | 'email' | 'password';
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
  required?: boolean;
};

export function Field({
  id,
  label,
  aside,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoComplete,
  required,
}: FieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className={LABEL}>
          {label}
        </label>
        {aside}
      </div>

      <div className={cn(FIELD_SHELL, 'mt-[8.4px]')}>
        {Icon ? (
          <Icon className="pointer-events-none absolute left-[13px] h-[18px] w-[18px] text-eden lg:left-[15.2px] lg:h-[19.7px] lg:w-[19.7px]" />
        ) : null}
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={cn(INPUT, 'pl-[40px] lg:pl-[46.1px]', isPassword && 'pr-[46px] lg:pr-[52px]')}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            aria-pressed={show}
            tabIndex={-1}
            // The frame puts the glyph 18.56px in from the field's right edge.
            // The button is bigger than the glyph so it can be pressed, so the
            // offset is measured to the glyph: 12.45 + (32 - 19.7) / 2 = 18.6.
            className="absolute right-[6px] grid h-[32px] w-[32px] place-items-center rounded-sm text-[#8a8378] transition-colors hover:text-eden lg:right-[12.45px]"
          >
            {show ? (
              <EyeOff className="h-[18px] w-[18px] lg:h-[19.7px] lg:w-[19.7px]" />
            ) : (
              <Eye className="h-[18px] w-[18px] lg:h-[19.7px] lg:w-[19.7px]" />
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Marks the frame draws
// -----------------------------------------------------------------------------

/** The standard four-colour Google mark, at the frame's 18px (-> 25.3px) box. */
export function GoogleIcon({ className }: { className?: string }) {
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

/** The arrow the frame sets after the CTA label. */
export function CtaArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * The three reassurance glyphs, traced from the frame's own exports rather than
 * taken from the icon library.
 *
 * Mail, Lock and Eye above ARE lucide - those exports are lucide's paths scaled
 * to 14px, to the decimal. These three are not: the first runs its divider the
 * full height where lucide's PanelsTopLeft stops at the crossbar, and the
 * third's rules are 20/14/17 long where lucide's AlignLeft is 21/15/17. Near
 * enough to reach for the library, different enough that it would show.
 */
const WHY_PATHS = {
  panels: <path d="M2.66667 6H13.3333M6 2.66667V13.3333M2.66667 2.66667H13.3333V13.3333H2.66667V2.66667Z" />,
  shield: (
    <path
      d="M6 8L7.33333 9.33333L10 6.66667M8 1.33333L12.6667 4V8C12.6667 11.3333 10.3333 13.3333 8 14.6667C5.66667 13.3333 3.33333 11.3333 3.33333 8V4L8 1.33333Z"
      strokeLinecap="round"
    />
  ),
  lines: <path d="M2.66667 4H13.3333M2.66667 8H9.33333M2.66667 12H11.3333" strokeLinecap="round" />,
} as const;

function WhyIcon({ name }: { name: keyof typeof WHY_PATHS }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinejoin="round"
      aria-hidden
      className="h-[22.5px] w-[22.5px] text-eden"
    >
      {WHY_PATHS[name]}
    </svg>
  );
}

// -----------------------------------------------------------------------------
// The reassurance strip
// -----------------------------------------------------------------------------

const POINTS: { icon: keyof typeof WHY_PATHS; title: string; body: string }[] = [
  {
    icon: 'panels',
    title: 'Your reports, one place',
    body: 'Every test you take is added to the same account and read against the same genome.',
  },
  {
    icon: 'shield',
    title: 'NABL-certified labs',
    body: 'Samples are processed by accredited labs; results are reviewed before they reach you.',
  },
  {
    icon: 'lines',
    title: 'Written in plain language',
    body: 'No genetics jargon. Every insight comes with what it means and what to do next.',
  },
];

function WhyStrip() {
  return (
    <Container as="section" className={cn(GUTTER, 'grid gap-[28px] pb-[65px] pt-[14px] md:grid-cols-3')}>
      {POINTS.map((p) => (
        <div key={p.title} className="rounded-sm border border-[rgba(27,23,18,0.08)] bg-white/60 p-[25px]">
          <span className="grid h-[42px] w-[42px] place-items-center rounded-sm bg-eden/[0.08]">
            <WhyIcon name={p.icon} />
          </span>
          <p className="mt-[22.5px] font-kyg text-[18.3px] font-semibold leading-[23.9px] tracking-[-0.01em] text-bistre">
            {p.title}
          </p>
          <p className="mt-[8.4px] font-kyg text-[16.2px] leading-[23.9px] text-[#646e6c]">{p.body}</p>
        </div>
      ))}
    </Container>
  );
}

// -----------------------------------------------------------------------------
// The screen
// -----------------------------------------------------------------------------

type AuthScreenProps = {
  /** The two Figtree lines. Rendered as given, so the break is the designer's. */
  headline: [string, string];
  /** The Cormorant italic line that closes the headline. */
  italic: string;
  blurb: string;
  children: ReactNode;
};

export function AuthScreen({ headline, italic, blurb, children }: AuthScreenProps) {
  return (
    <div className="bg-linenw">
      {/*
        548 : 372 in the frame, kept as fr so the proportion survives every
        width rather than only 1440. The card gains a few pixels on a wide
        monitor, which is what a field stack should do; pinning it to 523 would
        have opened a gutter that is in no frame.
      */}
      <Container
        as="section"
        className={cn(GUTTER, 'grid gap-[33.75px] pb-[28px] pt-[28px] lg:grid-cols-[548fr_372fr] lg:items-stretch')}
      >
        {/* ---------------- brand panel ---------------- */}
        <div className="relative isolate h-[320px] overflow-hidden rounded-sm sm:h-[420px] lg:h-auto lg:min-h-[675px]">
          <Image
            src="/auth/brand-panel.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
          {/* 8% -> 55% at the 35% stop -> 94%, so the copy sits on ink and the top stays open. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,18,18,0.08)_0%,rgba(13,18,18,0.55)_35%,rgba(13,18,18,0.94)_100%)]"
          />
          {/* Anchored bottom-left at the frame's 40px inset on both axes. */}
          <div className="absolute inset-x-[24px] bottom-[24px] lg:inset-x-[56.25px] lg:bottom-[56.25px]">
            <h2 className="font-kyg text-[30px] font-normal leading-[34px] tracking-[-0.03em] text-white sm:text-[38px] sm:leading-[44px] lg:text-[47.8px] lg:leading-[54.84px]">
              {headline[0]}
              <br />
              {headline[1]}
              <span className="-mt-[2.8px] block font-tst text-[33px] font-medium italic leading-[38px] tracking-normal text-[#eaf6f3] sm:text-[42px] sm:leading-[47px] lg:text-[53.4px] lg:leading-[59.06px]">
                {italic}
              </span>
            </h2>
            <p className="mt-[22.5px] max-w-[506px] font-kyg text-[15px] leading-[23px] text-[#c9dad6] lg:text-[19px] lg:leading-[29.5px]">
              {blurb}
            </p>
          </div>
        </div>

        {/* ---------------- form card ---------------- */}
        <div className="flex flex-col justify-center rounded-sm border border-[rgba(27,23,18,0.08)] bg-white p-[26px] shadow-[0_4px_14px_0_rgba(45,32,18,0.05),0_1px_2px_0_rgba(45,32,18,0.05)] sm:p-[32px] lg:min-h-[675px] lg:p-[39px]">
          {children}
        </div>
      </Container>

      <WhyStrip />
    </div>
  );
}

/** Title + the "Don't have an account? Create account" line under it. */
export function CardHead({
  title,
  prompt,
  linkLabel,
  href,
}: {
  title: string;
  prompt: string;
  linkLabel: string;
  href: string;
}) {
  return (
    <>
      <h1 className="font-kyg text-[30px] font-normal leading-[35px] tracking-[-0.03em] text-bistre sm:text-[34px] sm:leading-[39px] lg:text-[39.4px] lg:leading-[45px]">
        {title}
      </h1>
      <p className="mt-[14px] font-kyg text-[16px] leading-[24px] text-[#8a8378] lg:text-[19.7px] lg:leading-[28.1px]">
        {prompt}{' '}
        <Link href={href} className="font-semibold text-eden underline-offset-[3px] hover:underline">
          {linkLabel}
        </Link>
      </p>
    </>
  );
}
