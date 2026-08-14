// =============================================================================
// features/home/v2 — shared presentational primitives
// -----------------------------------------------------------------------------
// Built from the Figma frame "Homepage - New UI" (node 1058:5544), 1440 x 16692.
// The artboard's content rail is 1313 wide inside a 63 gutter (x=63 -> 1376),
// which is wider than the cream pages' 1216 rail — this page is deliberately
// more full-bleed.
//
// FONTS — all four already load in app/layout.tsx, so nothing new is imported:
//   Figtree            -> font-kyg      (headings, body, labels)
//   Hind               -> font-kyg-num  (small caps-y labels, acronym rows)
//   Cormorant Garamond -> font-tst      (the italic editorial accents)
//   Geist Mono         -> font-mono     (the design specifies Menlo for the
//                                        placeholder file-path chips)
//
// CASE IS DATA, NOT DECORATION. Figma stores every string in `characters`
// exactly as typed and applies capitalisation separately via style.textCase.
// This frame has 30 UPPER runs against 238 as-typed. Where a component sets
// `uppercase` it is reproducing textCase=UPPER from the frame — the giveaway is
// the wide tracking that always accompanies it. Do not "correct" those strings.
//
// RADIUS TRAP: this project remaps Tailwind's radius scale (--radius 0.625rem),
// so rounded-2xl is 18px and rounded-3xl is 22px. The frame uses
// 2/3.5/4/6.5/7/10/11/12/14/16/17/20/24/33/46/999 — almost none of which map
// cleanly, so they are written as explicit arbitrary values throughout.
// =============================================================================

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

import { HomeIcon } from './HomeIcon';

/* -------------------------------------------------------------------------- */
/* delivered photography                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The 15 photographs delivered with the designer's build, keyed by the slot id
 * they fill in that page (`data-ph id="ph-hero"` and friends). Copied verbatim
 * from `New Homepage Build/Visuals/`.
 *
 * `ph-genee` is deliberately absent: the source points that slot at a Mascot
 * render that was NOT delivered with the build, so MEET GENEe still shows the
 * labelled plate. That is the only section still waiting on art.
 */
export const PHOTO = {
  hero: '/home/photos/ph-hero.webp',
  why: '/home/photos/ph-why.webp',
  life1: '/home/photos/ph-life-1.webp',
  life3: '/home/photos/ph-life-3.webp',
  life5: '/home/photos/ph-life-5.webp',
  care1: '/home/photos/ph-care-1.webp',
  care2: '/home/photos/ph-care-2.webp',
  care3: '/home/photos/ph-care-3.webp',
  lab: '/home/photos/ph-lab.webp',
  jrn1: '/home/photos/ph-jrn-1.webp',
  jrn2: '/home/photos/ph-jrn-2.webp',
  jrn3: '/home/photos/ph-jrn-3.webp',
  jrn4: '/home/photos/ph-jrn-4.webp',
  jrn5: '/home/photos/ph-jrn-5.webp',
  jrn6: '/home/photos/ph-jrn-6.webp',
} as const;

/* -------------------------------------------------------------------------- */
/* section shells                                                             */
/* -------------------------------------------------------------------------- */

export type HomeGround = 'abyss' | 'eden' | 'cream' | 'sand' | 'mist' | 'white';

/** The frame's section grounds. Several are gradients, not flat fills. */
const GROUND: Record<HomeGround, string> = {
  // hero + final CTA: GRADIENT_LINEAR(#0a3b39 -> #093330 -> #062927)
  abyss: 'bg-[linear-gradient(160deg,#0a3b39_0%,#093330_55%,#062927_100%)] text-linenw',
  eden: 'bg-eden text-linenw',
  cream: 'bg-linenw text-bistre',
  // the deeper cream the page alternates to — NOT linenw, which is lighter
  sand: 'bg-sand text-bistre',
  // MEET GENEe's ground. Distinct from --color-mint (#e6f4f3), which is the
  // eyebrow-pill tint on the cream pages and reads noticeably greener.
  mist: 'bg-mist text-bistre',
  white: 'bg-white text-bistre',
};

/**
 * Page section. The frame's rail is 1313 inside a 63 gutter; below lg that
 * collapses to ordinary page padding so nothing is pinned to a desktop rail.
 */
export function Section({
  ground = 'cream',
  id,
  labelledBy,
  className,
  innerClassName,
  children,
}: {
  ground?: HomeGround;
  id?: string;
  /**
   * Names the landmark, as every section in the source does
   * (`<section id="why" aria-labelledby="whyH">` + `<h2 id="whyH">`). Without
   * it a screen reader announces thirteen anonymous "section" landmarks, which
   * is worse than having none at all. Pair with `<Heading id={...}>`.
   */
  labelledBy?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        GROUND[ground],
        'px-5 sm:px-8 lg:px-[63px]',
        // Clears the FIXED SiteHeader on in-page jumps. The source says
        // `calc(--hdr-h-sm + 20px)` = 92, but that is ITS header; ours is 64
        // (components/shared/SiteHeader.tsx), so the equivalent is 84. Using
        // the source's 92 literally would leave 28px of dead space above every
        // anchored section.
        id && 'scroll-mt-[84px]',
        className,
      )}
    >
      {/* The source's `--sp-sec`: clamp(84px, 10vw, 168px) on `.sec`. Two
          sections legitimately override it — `.priv` at clamp(62px,7vw,110px)
          and `.fin` at clamp(96px,11vw,180px) — and those pass innerClassName.
          Everything else must inherit this, or consecutive sections breathe
          differently and the page's vertical rhythm visibly stutters. */}
      <div className={cn('mx-auto w-full max-w-[1313px] py-[clamp(84px,10vw,168px)]', innerClassName)}>
        {children}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* type                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Section kicker — Figtree 800, uppercase, ~0.13em tracking.
 *
 * The `uppercase` is textCase=UPPER in the frame, not a style choice; the
 * strings are stored sentence-case ("Genetics for a lifetime") and render
 * "GENETICS FOR A LIFETIME".
 */
export function Kicker({
  children,
  className,
  tone = 'java',
  upper = true,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'java' | 'pewter' | 'eden';
  /**
   * Most kickers are textCase=UPPER at 0.13em, but not all — section 07's is
   * Figtree 800 18/22.3 ls 0.54, i.e. sentence case at 0.03em. Opting out here
   * beats overriding `uppercase` at the call site, which relies on twMerge
   * resolving two text-transform utilities.
   */
  upper?: boolean;
}) {
  return (
    <p
      className={cn(
        // FLAT, not a clamp. The source's `--fs-kick` is a fixed 16.5px and
        // `.kick--case` is `calc(--fs-kick + 1.5px)` = 18px; neither scales with
        // the viewport. The clamp this used to carry only reached 16.5 at
        // 1435px, so every kicker on the page was undersized at every real
        // width — and 13px on a phone is close to the legibility floor for
        // 0.13em-tracked uppercase.
        'font-kyg font-extrabold leading-[1.24]',
        upper ? 'text-[16.5px] uppercase tracking-[0.13em]' : 'text-[18px] tracking-[0.03em]',
        tone === 'java' && 'text-java2',
        tone === 'pewter' && 'text-pewter',
        tone === 'eden' && 'text-eden',
        className,
      )}
    >
      {children}
    </p>
  );
}

/**
 * Display heading. `html` is used rather than children because the frame colours
 * individual RUNS inside a single text node (e.g. "KYG" teal inside an otherwise
 * cream line), which needs inline markup.
 */
export function Heading({
  html,
  id,
  className,
  as: As = 'h2',
}: {
  html: string;
  /** Target for the owning Section's `labelledBy` — see the note there. */
  id?: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <As
      id={id}
      className={cn(
        'font-kyg tracking-[-0.035em] [&_em]:font-tst [&_em]:font-medium [&_em]:italic [&_em]:tracking-normal',
        As === 'h1'
          ? 'text-[clamp(38px,4.9vw,70.6px)] leading-[0.98]'
          : 'text-[clamp(30px,3.5vw,50.4px)] leading-[1.14]',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Body copy. Figtree 400, generous leading. */
export function Body({
  html,
  children,
  className,
}: {
  html?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const cls = cn(
    'font-kyg text-[clamp(15px,1.29vw,18.5px)] font-normal leading-[1.6] tracking-[-0.005em]',
    className,
  );
  return html ? (
    <p className={cls} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <p className={cls}>{children}</p>
  );
}

/* -------------------------------------------------------------------------- */
/* controls                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The frame's two button shapes.
 *
 * NOT capsules — radius is 10, height 58, pad 19/30, gap 13, label Figtree 700
 * 17/17 ls -0.14. The ghost has no border: the frame draws it with an
 * INNER_SHADOW 0 0 0 2 rgba(250,246,239,0.3), i.e. a 2px INSET ring, which is
 * why it uses ring-inset rather than `border` (a border would change the box).
 *
 * Both carry a `::after` sheen — a translucent cream gradient the width of the
 * button that sweeps across on hover.
 */
export function Cta({
  href,
  children,
  variant = 'primary',
  icon,
  className,
}: {
  href: string;
  children: React.ReactNode;
  /**
   * primary    solid java2 on dark
   * ghost      transparent + cream inset ring, for dark grounds
   * light      solid white + eden ring, for light grounds
   * ghostLight transparent + eden inset ring, for light grounds. Added because
   *            `light` hardcodes bg-white, so an outlined control on a cream
   *            section previously needed a bg-transparent override per call.
   */
  variant?: 'primary' | 'ghost' | 'light' | 'ghostLight';
  icon?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative isolate inline-flex min-h-[58px] max-w-full items-center justify-center gap-[13px]',
        'overflow-hidden rounded-[10px] px-[30px] py-[19px]',
        'font-kyg text-[clamp(15px,1.18vw,17px)] font-bold leading-none tracking-[-0.008em]',
        'transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        // -3px, not -2. The source's `.btn:hover` is translateY(-3px) with a
        // 0 0 0 6px glow ring on top of a deeper shadow; Tailwind's -translate-y-0.5
        // is 2px, which reads as a nudge rather than a lift.
        variant === 'primary' &&
          'bg-java2 text-abyss shadow-[0_6px_18px_0_rgba(14,77,75,0.18)] hover:-translate-y-[3px] hover:shadow-[0_16px_40px_rgba(14,77,75,0.30),0_0_0_6px_rgba(42,195,162,0.16)]',
        variant === 'ghost' &&
          'text-linenw ring-2 ring-inset ring-linenw/30 hover:ring-linenw/55',
        variant === 'light' && 'bg-white text-eden ring-2 ring-inset ring-eden/20 hover:bg-mint',
        variant === 'ghostLight' &&
          'bg-transparent text-eden ring-2 ring-inset ring-eden/25 hover:bg-eden/[0.05] hover:ring-eden/45',
        className,
      )}
    >
      {/* the frame's sheen: parked off the left edge, swept across on hover */}
      <span
        aria-hidden="true"
        className={cn(
          // 36% wide, matching `.btn::after{ width:36% }`. The sweep runs from
          // -40% to 125% of the button in 1.05s on `--e-io`.
          'pointer-events-none absolute inset-y-0 -z-10 w-[36%] -translate-x-[220%] skew-x-[-18deg]',
          'bg-[linear-gradient(90deg,rgba(250,246,239,0),rgba(250,246,239,0.28),rgba(250,246,239,0))]',
          'transition-transform duration-[1050ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-[400%]',
          'motion-reduce:transition-none motion-reduce:group-hover:translate-x-[-220%]',
        )}
      />
      <span className="min-w-0">{children}</span>
      {icon ? (
        // 5px of travel, not 2 — `.btn:hover svg{ transform:translateX(5px) }`.
        // The arrow is the button's whole gesture; at 2px it reads as a jitter.
        <HomeIcon
          id={icon}
          className="h-5 w-5 shrink-0 transition-transform duration-[850ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[5px]"
        />
      ) : null}
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* the designer's asset placeholders                                          */
/* -------------------------------------------------------------------------- */

/**
 * An `figure#ph-*` slot from the frame.
 *
 * TWO STATES, exactly as the designer's build has it (`.ph` and `.ph--filled`):
 *
 *   photo given    the photograph fills the frame, object-cover, and ALL the
 *                  placeholder chrome is dropped — the source does this with
 *                  `.ph--filled{ background:none }` plus `display:none` on its
 *                  ::before/::after/.ph__in.
 *   photo absent   the labelled plate: a tinted gradient ground, a 4-radius
 *                  hairline inset 14, then a centred stack of glyph / uppercase
 *                  title / description / mono file-path chip.
 *
 * Keeping the plate rather than rendering nothing is deliberate — a section
 * whose art has not been delivered reads as obviously pending instead of
 * looking like an intentional empty panel.
 *
 * `next/image` is used with `fill`, so every call site must be `relative` and
 * carry its own size (they all already do — the frame gives each slot an
 * explicit aspect ratio).
 */
export function AssetSlot({
  title,
  meta,
  path,
  photo,
  alt,
  priority = false,
  sizes = '(max-width: 1000px) 100vw, 50vw',
  icon = '420-1087',
  className,
  tone = 'dark',
  compact = false,
  upperTitle = true,
}: {
  title: string;
  meta?: string;
  path?: string;
  /** public path to the delivered photograph, e.g. `/home/photos/ph-hero.webp` */
  photo?: string;
  /** required whenever `photo` is set; the plate state is decorative */
  alt?: string;
  priority?: boolean;
  sizes?: string;
  /**
   * `null` renders NO glyph. Most `div.ph__in` groups in this frame are
   * title/meta/path only — the hero's is one of the few that carries a mark —
   * so sections were reduced to hiding it with `[&_img]:hidden`, which still
   * emitted the element. Passing null is the honest opt-out.
   */
  icon?: string | null;
  className?: string;
  /**
   * dark   — on the deep teal grounds
   * light  — cool sage, for the mint/white sections
   * sand   — warm cream (#f3eada -> #efe3ce + an #edddb8 bloom), which is what
   *          every placeholder on this page's cream sections actually uses
   */
  tone?: 'dark' | 'light' | 'sand';
  compact?: boolean;
  /**
   * Slot titles are textCase=UPPER nearly everywhere, but not always — the
   * GENEe card's title is AS_TYPED and upper-casing it renders "GENEE",
   * destroying the character's own name. Hence an explicit opt-out.
   */
  upperTitle?: boolean;
}) {
  // filled: the photo IS the slot. No gradient behind it (it would show through
  // any transparent edge) and no chrome over it.
  if (photo) {
    return (
      <div className={cn('relative isolate min-w-0 overflow-hidden', className)}>
        <Image
          src={photo}
          alt={alt ?? ''}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'relative isolate flex min-w-0 items-center justify-center overflow-hidden',
        tone === 'dark' && 'bg-[linear-gradient(150deg,#31706a_0%,#1d524d_55%,#123c3a_100%)]',
        tone === 'light' && 'bg-[linear-gradient(150deg,#eef5f3_0%,#e2ece9_100%)]',
        tone === 'sand' &&
          'bg-[radial-gradient(120%_120%_at_18%_12%,rgba(237,221,184,0.75),rgba(237,221,184,0)_60%),linear-gradient(135deg,#f3eada_0%,#efe3ce_100%)]',
        className,
      )}
    >
      {/* the frame's inset hairline: 14 in from every edge, 4 radius, 20% */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-[14px] rounded-[4px] border',
          tone === 'dark' ? 'border-linenw/20' : 'border-eden/15',
        )}
      />
      <div
        className={cn(
          'relative flex min-w-0 flex-col items-center gap-2 p-[26px] text-center',
          compact && 'gap-1.5 p-4',
        )}
      >
        {/* No opacity class here. The exported SVGs already bake the frame's
            instance opacity in (e.g. 06618-0342 carries <g opacity="0.75">), so
            adding opacity-75 on top dimmed every glyph to ~0.56. */}
        {icon ? (
          <HomeIcon id={icon} className={compact ? 'h-6 w-6' : 'h-[30px] w-[30px]'} />
        ) : null}
        {/* Figtree 800 14/19.9 ls 2.1 — textCase=UPPER in the frame. */}
        <span
          className={cn(
            'font-kyg font-extrabold leading-[1.42]',
            upperTitle ? 'uppercase tracking-[0.15em]' : 'tracking-[0.06em]',
            compact ? 'text-[11px]' : 'text-[clamp(12px,1vw,14px)]',
            tone === 'dark' ? 'text-linenw/94' : 'text-eden',
          )}
        >
          {title}
        </span>
        {meta && !compact ? (
          <span
            className={cn(
              // ls 1.08 on Hind 13.5 = 0.08em; the primitive used to drop it
              'max-w-[320px] font-kyg-num text-[clamp(12px,0.94vw,13.5px)] leading-[1.62] tracking-[0.08em]',
              tone === 'dark' ? 'text-linenw/60' : 'text-eden/60',
            )}
          >
            {meta}
          </span>
        ) : null}
        {path && !compact ? (
          <code
            className={cn(
              'mt-1 rounded-[7px] px-[11px] py-1.5 font-mono text-[clamp(10.5px,0.87vw,12.5px)] leading-[1.35]',
              tone === 'dark'
                ? 'bg-black/16 text-linenw/72 ring-1 ring-inset ring-linenw/25'
                : 'bg-eden/[0.06] text-eden/70 ring-1 ring-inset ring-eden/20',
            )}
          >
            {path}
          </code>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* small shared bits                                                          */
/* -------------------------------------------------------------------------- */

/** Label + value row used by the acronym expansion and several stat rows. */
export function DotRow({
  lead,
  children,
  className,
}: {
  lead: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-[13px]', className)}>
      <span className="shrink-0 font-kyg-num text-[15.5px] font-bold leading-[1.62] text-linenw/92">
        {lead}
      </span>
      <span aria-hidden="true" className="h-1 w-1 shrink-0 rounded-[2px] bg-java2/85" />
      <span className="min-w-0 font-kyg-num text-[15.5px] font-medium leading-[1.62] text-linenw/62">
        {children}
      </span>
    </span>
  );
}

/** Rounded outline chip — used by the hero rail and several section headers. */
export function Chip({
  children,
  icon,
  className,
  tone = 'dark',
}: {
  children: React.ReactNode;
  icon?: string;
  className?: string;
  tone?: 'dark' | 'light';
}) {
  return (
    <span
      className={cn(
        'inline-flex min-w-0 items-center gap-2 rounded-full px-[17px] py-2.5',
        'font-kyg text-[clamp(13px,1.05vw,15px)] font-medium leading-[1.5]',
        tone === 'dark'
          ? 'border border-linenw/18 bg-linenw/[0.04] text-linenw/88'
          : 'border border-eden/12 bg-white text-eden',
        className,
      )}
    >
      {icon ? <HomeIcon id={icon} className="h-[18px] w-[18px] shrink-0" /> : null}
      <span className="min-w-0">{children}</span>
    </span>
  );
}
