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
  'h-[44px] min-h-[44px] w-full rounded-sm bg-transparent pr-[16px] font-kyg text-[16px] ' +
  'tracking-[-0.008em] text-bistre outline-none placeholder:text-[#8a8378]';


/** Figtree 600 11/14, #1b1712. */
export const LABEL = 'font-kyg text-[14px] font-semibold leading-[20px] text-bistre';

/**
 * Figtree 600 10.5, eden - the "Forgot password?" affordance.
 *
 * The leading is pinned to the label's, not left to `leading-normal`. Both sit
 * in the same 19.7px row in the frame; without this the smaller type still
 * makes the taller line box and pushes everything under it down 2.8px.
 */
export const MICRO_LINK =
  'font-kyg text-[13px] font-semibold leading-[20px] text-eden underline-offset-[3px] hover:underline ' +
  // The link sits ALONE in the label row, so it does not get the target-size
  // exception that covers a link inline in a sentence. Padding buys a ~40px
  // target; the negative margin keeps the row the same height as the label.
  '-my-[10px] py-[10px]';

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
  'flex h-[44px] min-h-[44px] w-full items-center justify-center gap-[8px] rounded-sm bg-eden ' +
  'font-kyg text-[15px] font-bold leading-[20px] tracking-[-0.007em] text-linenw ' +
  'shadow-[0_6px_18px_0_rgba(14,77,75,0.18)] transition-colors hover:bg-eden2 ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

/** The two secondary buttons under it: 44px at frame scale, a field's own ring. */
export const ALT_BTN =
  'flex h-[44px] min-h-[44px] flex-1 items-center justify-center gap-[9px] rounded-sm bg-white ' +
  'font-kyg text-[15px] font-medium leading-[20px] text-bistre ' +
  'shadow-[inset_0_0_0_1.5px_rgba(27,23,18,0.11)] transition-shadow ' +
  'hover:shadow-[inset_0_0_0_1.5px_rgba(27,23,18,0.22)]';

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

      <div className={cn(FIELD_SHELL, 'mt-[6px]')}>
        {Icon ? (
          <Icon className="pointer-events-none absolute left-[12px] h-[18px] w-[18px] text-eden" />
        ) : null}
        <input
          id={id}
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={cn(INPUT, 'pl-[38px]', isPassword && 'pr-[44px]')}
        />
        {isPassword ? (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            aria-pressed={show}
            // The frame puts the glyph 18.56px in from the field's right edge.
            // The button is bigger than the glyph so it can be pressed, so the
            // offset is measured to the glyph: 12.45 + (32 - 19.7) / 2 = 18.6.
            className="absolute right-0 grid h-full w-[44px] place-items-center rounded-sm text-[#8a8378] transition-colors hover:text-eden"
          >
            {show ? (
              <EyeOff className="h-[18px] w-[18px]" />
            ) : (
              <Eye className="h-[18px] w-[18px]" />
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
  home: <path d="M2 6.5 L8 1.8 L14 6.5 L14 13.6 L2 13.6 Z M6.1 13.6 L6.1 9.2 L9.9 9.2 L9.9 13.6" strokeLinecap="round" />,
  lock: (
    <path
      d="M3.2 7.2 L12.8 7.2 L12.8 14 L3.2 14 Z M5.3 7.2 L5.3 4.9 C5.3 3.4 6.5 2.2 8 2.2 C9.5 2.2 10.7 3.4 10.7 4.9 L10.7 7.2"
      strokeLinecap="round"
    />
  ),
  leaf: (
    <path
      d="M2.4 13.6 C2.4 6.4 7.2 2.6 13.6 2.6 C13.6 9 9.6 13.6 2.4 13.6 Z M2.8 13.2 L10.2 5.4"
      strokeLinecap="round"
    />
  ),
  shield: (
    <path
      d="M6 8L7.33333 9.33333L10 6.66667M8 1.33333L12.6667 4V8C12.6667 11.3333 10.3333 13.3333 8 14.6667C5.66667 13.3333 3.33333 11.3333 3.33333 8V4L8 1.33333Z"
      strokeLinecap="round"
    />
  ),
  lines: <path d="M2.66667 4H13.3333M2.66667 8H9.33333M2.66667 12H11.3333" strokeLinecap="round" />,
} as const;

function WhyIcon({ name, className }: { name: keyof typeof WHY_PATHS; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinejoin="round"
      aria-hidden
      className={cn('h-[22.5px] w-[22.5px] text-eden', className)}
    >
      {WHY_PATHS[name]}
    </svg>
  );
}

// -----------------------------------------------------------------------------
// The reassurance strip
// -----------------------------------------------------------------------------

/**
 * The three points that ride the photograph.
 *
 * Each is a mark, a title and a half-line of support - the shape the design
 * draws. They live on the panel rather than under the screen, so they cost no
 * vertical space in a layout that has to hold one viewport.
 */
const POINTS: { icon: keyof typeof WHY_PATHS; title: string; body: string }[] = [
  { icon: 'panels', title: 'Comprehensive reports', body: 'All key health insights' },
  { icon: 'shield', title: 'NABL-certified labs', body: 'Trusted & accurate' },
  { icon: 'home', title: 'At-home convenience', body: 'Simple & hassle-free' },
];

/** Lock / shield / leaf, under the card on the cream. */
const TRUST: { icon: keyof typeof WHY_PATHS; title: string; body: string }[] = [
  { icon: 'lock', title: 'Secure & private', body: 'Your data is protected' },
  { icon: 'shield', title: 'Trusted by thousands', body: 'Across India' },
  { icon: 'leaf', title: 'Better health ahead', body: 'Powered by your genes' },
];

// -----------------------------------------------------------------------------
// The screen
// -----------------------------------------------------------------------------

type AuthScreenProps = {
  /** Uppercase kicker over the headline. */
  eyebrow: string;
  /** One string; the line breaks are the designer's, so they ship as written. */
  headline: string;
  blurb: string;
  children: ReactNode;
};

/**
 * The split screen.
 *
 * FULL BLEED, NOT `Container`. The photograph runs to the left edge and the
 * cream ground to the right one, which is the whole idea of the composition -
 * a 1600px column with gutters would float both halves in the middle of the
 * window. The CONTENT inside each half is still capped (560 left, 540 card),
 * so nothing sprawls on a wide monitor, which is what DESIGN.md 1 is actually
 * protecting against.
 *
 * ONE VIEWPORT. `100svh` less the 65px header, so the footer starts at the
 * fold. `svh` rather than `vh` because mobile reports `vh` as the tallest the
 * viewport ever gets, which overshoots while the URL bar is showing.
 */
export function AuthScreen({ eyebrow, headline, blurb, children }: AuthScreenProps) {
  return (
    <div className="grid lg:min-h-[calc(100svh-65px)] lg:grid-cols-2">
      {/* ---------------- left: the photograph ---------------- */}
      <div className="relative isolate h-[220px] overflow-hidden sm:h-[280px] lg:h-auto">
        <Image
          src="/auth/signin-panel.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[0%_22%] lg:object-[0%_50%]"
        />
        {/*
          THE CROP IS THE LAYOUT. The panel is roughly square at every desktop
          size (0.93-1.09), so the frame is cut to 1070x1146 - narrower than all
          of them - and a left anchor pins it. Cover scales to WIDTH almost
          everywhere, which makes the subject's horizontal position a
          fixed FRACTION of the panel (his face starts at 64.5%) instead of
          something that drifts with the window. The copy runs to 423px, so at
          1366 and up the type lands on the window and the plant and stops well
          before his face. What slack a tall panel does create is taken off the
          right, where there is only background.

          Two ramps: a light vertical one so the carousel dots have ink under
          them, and a left-weighted one because the subject sits right of frame
          looking left - the copy goes where he is looking, and the gradient has
          to be heaviest exactly there. Its tail is spent by 76%, before him.
        */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,14,13,0.20)_0%,rgba(8,14,13,0.10)_45%,rgba(8,14,13,0.42)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,14,13,0.88)_0%,rgba(8,14,13,0.66)_34%,rgba(8,14,13,0.30)_56%,rgba(8,14,13,0)_76%)]"
        />

        <div className="absolute inset-0 flex flex-col justify-center px-[24px] py-[28px] sm:px-[40px] lg:px-[64px]">
          <div className="w-full max-w-[560px]">
            <p className="font-kyg text-[12px] font-bold uppercase leading-[16px] tracking-[0.14em] text-[#a9c8c0] lg:text-[13px]">
              {eyebrow}
            </p>
            <h2 className="mt-[14px] whitespace-pre-line font-kyg text-[30px] font-extrabold leading-[1.12] tracking-[-0.028em] text-white sm:text-[36px] lg:mt-[18px] lg:text-[50px]">
              {headline}
            </h2>
            <p className="mt-[14px] max-w-[420px] font-kyg text-[15px] leading-[24px] text-[#cfdcd8] lg:mt-[20px] lg:text-[18px] lg:leading-[27px]">
              {blurb}
            </p>

            <ul className="mt-[26px] hidden list-none lg:mt-[40px] lg:grid lg:gap-[22px]">
              {POINTS.map((p) => (
                <li key={p.title} className="flex items-center gap-[16px]">
                  <span className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-sm bg-white/[0.12] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.18)]">
                    <WhyIcon name={p.icon} className="h-[23px] w-[23px] text-[#8fe0cf]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-kyg text-[17px] font-semibold leading-[22px] tracking-[-0.01em] text-white">
                      {p.title}
                    </span>
                    <span className="mt-[2px] block font-kyg text-[13px] leading-[18px] text-[#b6c9c4]">{p.body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The carousel the design draws. Static: there is one panel image, so
            an interactive control here would promise slides that do not exist. */}
        <div aria-hidden className="absolute bottom-[28px] left-[24px] hidden gap-[7px] sm:left-[40px] lg:left-[64px] lg:flex">
          <span className="h-[4px] w-[26px] rounded-full bg-white/90" />
          <span className="h-[4px] w-[16px] rounded-full bg-white/35" />
          <span className="h-[4px] w-[16px] rounded-full bg-white/35" />
        </div>
      </div>

      {/* ---------------- right: the cream ground ---------------- */}
      <div className="flex flex-col items-center justify-center gap-[20px] bg-[#f7f5f0] px-[20px] py-[32px] sm:px-[32px] lg:px-[48px] lg:py-[28px]">
        <div className="w-full max-w-[540px] rounded-sm bg-white p-[24px] shadow-[0_1px_2px_0_rgba(45,32,18,0.04),0_12px_34px_-8px_rgba(45,32,18,0.10)] sm:p-[32px] lg:p-[40px]">
          {children}
        </div>

        {/* <ul className="grid w-full max-w-[540px] list-none grid-cols-1 gap-[16px] sm:grid-cols-3 lg:gap-[12px]">
          {TRUST.map((t) => (
            <li key={t.title} className="flex items-center gap-[10px]">
              <WhyIcon name={t.icon} className="h-[19px] w-[19px] shrink-0 text-eden" />
              <span className="min-w-0">
                <span className="block font-kyg text-[13px] font-semibold leading-[17px] text-bistre">{t.title}</span>
                <span className="block font-kyg text-[12px] leading-[16px] text-[#8a8378]">{t.body}</span>
              </span>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
}

/** The card's title and the line under it. */
export function CardHead({ title, blurb }: { title: string; blurb: string }) {
  return (
    <>
      <h1 className="font-kyg text-[28px] font-extrabold leading-[34px] tracking-[-0.025em] text-bistre sm:text-[32px] sm:leading-[38px] lg:text-[38px] lg:leading-[45px]">
        {title}
      </h1>
      <p className="mt-[8px] font-kyg text-[16px] leading-[24px] text-[#8a8378]">{blurb}</p>
    </>
  );
}

/** The "OR" rule between the primary CTA and the two alternatives. */
export function OrRule() {
  return (
    <div aria-hidden className="my-[16px] flex items-center gap-[14px]">
      <span className="h-px flex-1 bg-[rgba(27,23,18,0.12)]" />
      <span className="font-kyg text-[12px] font-semibold uppercase tracking-[0.1em] text-[#8a8378]">or</span>
      <span className="h-px flex-1 bg-[rgba(27,23,18,0.12)]" />
    </div>
  );
}

/** The account-switch line that closes the card. */
export function CardFoot({ prompt, linkLabel, href }: { prompt: string; linkLabel: string; href: string }) {
  return (
    <p className="mt-[18px] text-center font-kyg text-[14px] leading-[20px] text-[#8a8378]">
      {prompt}{' '}
      <Link href={href} className="font-semibold text-eden underline-offset-[3px] hover:underline">
        {linkLabel}
      </Link>
    </p>
  );
}
