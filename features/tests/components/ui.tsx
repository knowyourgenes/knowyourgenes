// =============================================================================
// features/tests — shared presentational primitives
// -----------------------------------------------------------------------------
// Every value here is read from the Figma frame via the REST API, not eyeballed.
// The artboard is 1440 wide: section gutter 80, inner rail 1280 with 32 of its
// own padding, so the real content column is 1216px.
//
// Desktop numbers are the clamp() MAX. There is no mobile frame in the file, so
// the lower bounds are a judgement call — but at >=1440 this matches 1:1.
// =============================================================================

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type {
  Accent,
  Chip as ChipT,
  Cta as CtaT,
  Eyebrow as EyebrowT,
  Ground,
  Img,
  RiskTone,
  SectionHead,
} from '../types';
import { FigmaIcon } from './FigmaIcon';
import { Icon } from './icons';

// ---- grounds ---------------------------------------------------------------
// Several sections are gradients over the cream page, and five are plain white
// at 70% — that is `--color-veil` composited on --color-linenw, not a flat hex.

export const GROUND: Record<Ground, string> = {
  cream: 'bg-linenw text-mine',
  ivory: 'bg-white/70 text-mine',
  sage: 'bg-gradient-to-b from-linenw to-sage text-mine',
  sand: 'bg-gradient-to-b from-linenw to-sand text-mine',
  ink: 'bg-ink text-white',
};

/** Section shell: ground + the frame's 80px gutter + the 1280px inner rail. */
export function Section({
  ground = 'cream',
  id,
  className,
  innerClassName,
  children,
}: {
  ground?: Ground;
  id?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    // `scroll-mt` only when the section is an anchor target: the global
    // SiteHeader is sticky at 64px, so without it every in-page jump lands
    // with the heading hidden behind the bar.
    <section
      id={id}
      className={cn(GROUND[ground], 'px-5 sm:px-10 lg:px-20', id && 'scroll-mt-[80px]', className)}
    >
      <div
        className={cn(
          'reveal mx-auto w-full max-w-[1280px] py-[clamp(56px,7vw,92px)] lg:px-8',
          innerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

// ---- type ------------------------------------------------------------------
// H1  Figtree 800  64/69.1  ls -1.28  (-0.02em)   #222222
// H2  Figtree 700  51/55    ls -1.02  (-0.02em)   #222222

export function Heading({
  html,
  className,
  as: As = 'h2',
}: {
  html: string;
  className?: string;
  as?: 'h1' | 'h2';
}) {
  return (
    <As
      className={cn(
        'font-kyg tracking-[-0.02em] text-mine',
        As === 'h1'
          ? 'text-[clamp(34px,4.6vw,64px)] font-extrabold leading-[1.08]'
          : 'text-[clamp(28px,3.7vw,51px)] font-bold leading-[1.08]',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Figtree 400 19/28.5 #5b564e */
export function Lead({ html, className }: { html: string; className?: string }) {
  return (
    <p
      className={cn('font-kyg text-[clamp(15px,1.35vw,19px)] leading-[1.5] text-fusc', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Figtree 400 17.5/26 #5b564e — card and column body copy. */
export function Body({ html, className }: { html: string; className?: string }) {
  return (
    <p
      className={cn('font-kyg text-[clamp(14.5px,1.25vw,17.5px)] leading-[1.5] text-fusc', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** The centred closing line: Cormorant Garamond 700 italic 30/45. */
export function Closing({ html, className }: { html: string; className?: string }) {
  return (
    <p
      className={cn(
        'mx-auto max-w-[820px] text-center font-tst text-[clamp(20px,2.2vw,30px)] font-bold italic leading-[1.5] text-mine',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ---- eyebrow ---------------------------------------------------------------
// White pill, 1px #222222@10 hairline, soft shadow, 8px accent dot.
// Label: Figtree 700 11.5/17.2 ls 1.61 (0.14em) #9a2855 (crimson) / #0e4d4b (teal).

const DOT: Record<Accent, string> = { crimson: 'bg-crimson', teal: 'bg-eden' };
const EYEBROW_TEXT: Record<Accent, string> = { crimson: 'text-crimson-deep', teal: 'text-eden' };

export function Eyebrow({ data, className }: { data: EyebrowT; className?: string }) {
  const accent = data.accent ?? 'crimson';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-mine/10 bg-white py-2 pl-3 pr-4 shadow-tst-soft',
        className,
      )}
    >
      {data.icon ? (
        <Icon name={data.icon} className={cn('size-[15px]', accent === 'crimson' ? 'text-crimson' : 'text-eden')} />
      ) : (
        <span className={cn('size-2 rounded-full', DOT[accent])} />
      )}
      <span
        className={cn(
          'font-kyg text-[11.5px] font-bold uppercase tracking-[0.14em]',
          EYEBROW_TEXT[accent],
        )}
      >
        {data.label}
      </span>
    </span>
  );
}

/** Eyebrow + heading + lead, centred. Gaps read from the frame's auto-layout. */
export function Head({ data, className }: { data: SectionHead; className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-5 text-center', className)}>
      {data.eyebrow ? <Eyebrow data={data.eyebrow} /> : null}
      <Heading html={data.titleHtml} className="max-w-[900px]" />
      {data.leadHtml ? <Lead html={data.leadHtml} className="max-w-[760px]" /> : null}
    </div>
  );
}

// ---- buttons ---------------------------------------------------------------
// primary  h60 r999 #0e4d4b  pad 16/34/18/34  ring 0 0 0 4 java@10 + 0 14 32 eden@32
// ghost    h60 r999 #ffffff  1px #0e4d4b@28   0 6 18 rgba(20,27,26,.08)
// light    white pill on ink grounds
// label    Figtree 800 16/24 ls 0.06

// Hover behaviour is the reference build's, not a guess: -3px + 1.02 scale on
// the primary, -3px on the ghost, and the trailing glyph slides 4px. The
// `btn-sheen` class adds the perpetual 4.6s highlight sweep (globals.css).
const BTN_BASE =
  'group btn-sheen inline-flex max-w-full items-center justify-center gap-2.5 whitespace-normal text-center sm:whitespace-nowrap rounded-full font-kyg text-[16px] font-extrabold leading-6 tracking-[0.06px] transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-java';

const BTN_VARIANT = {
  primary:
    'border border-eden bg-eden text-white shadow-tst-cta hover:-translate-y-[3px] hover:scale-[1.02] hover:bg-eden2 hover:shadow-[0_22px_46px_rgba(14,77,75,0.4),0_0_0_5px_rgba(37,181,171,0.16)]',
  ghost:
    'border border-eden/28 bg-white text-eden shadow-tst-ghost hover:-translate-y-[3px] hover:border-eden hover:bg-mint',
  light: 'bg-white text-eden shadow-tst-card hover:-translate-y-[3px] hover:bg-mint',
} as const;

/**
 * The frame's own trailing arrow, in the two colourways it ships in. These are
 * baked-colour SVGs, so the variant picks the file rather than a CSS colour:
 * white on the eden fill, eden on the white fills.
 */
const CTA_ARROW: Record<keyof typeof BTN_VARIANT, string> = {
  primary: '2227-660', // white
  ghost: '2227-856', // eden
  light: '17449-758', // eden right arrow (white pill on an ink ground)
};

export function Cta({ data, className }: { data: CtaT; className?: string }) {
  const variant = data.variant ?? 'primary';
  return (
    <Link
      href={data.href}
      className={cn(BTN_BASE, BTN_VARIANT[variant], 'px-[34px] pb-[18px] pt-4', className)}
    >
      <span className="relative z-[1]">{data.label}</span>
      {/* A data-supplied `icon` means the design uses something other than the
          arrow here (e.g. the hero's "How does it work? ↓"), so honour it via the
          lucide registry. Otherwise use the frame's own arrow glyph. */}
      {data.icon ? (
        <Icon
          name={data.icon}
          className="relative z-[1] size-5 transition-transform duration-300 group-hover:translate-x-1"
        />
      ) : (
        <FigmaIcon
          id={CTA_ARROW[variant]}
          className="relative z-[1] -my-0.5 h-6 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        />
      )}
    </Link>
  );
}

export function CtaRow({ items, className }: { items: CtaT[]; className?: string }) {
  if (!items.length) return null;
  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-3', className)}>
      {items.map((c) => (
        <Cta key={c.label} data={c} />
      ))}
    </div>
  );
}

// ---- chips -----------------------------------------------------------------
// h50 r9999 white, 1px #222222@10, soft shadow, pad 8/16/8/8, gap 8.
// Icon sits in a 32px round badge: mint #e6f4f3 (teal) or blush #fbeef3 (crimson).
// Label: Figtree 700 14.5/21.8 #2d2a24.

export function Chip({
  data,
  accent = 'teal',
  className,
}: {
  data: ChipT;
  accent?: Accent;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-mine/10 bg-white py-2 pl-2 pr-4 shadow-tst-soft',
        className,
      )}
    >
      {data.icon ? (
        <span
          className={cn(
            'grid size-8 shrink-0 place-items-center rounded-full',
            accent === 'crimson' ? 'bg-blush text-crimson' : 'bg-mint text-eden',
          )}
        >
          <Icon name={data.icon} className="size-[18px]" />
        </span>
      ) : null}
      <span
        className="font-kyg text-[14.5px] font-bold leading-[1.5] text-[#2d2a24]"
        dangerouslySetInnerHTML={{ __html: data.label }}
      />
    </span>
  );
}

export function ChipRow({
  items,
  accent,
  className,
}: {
  items: ChipT[];
  accent?: Accent;
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)}>
      {items.map((c, i) => (
        <Chip key={i} data={c} accent={accent} />
      ))}
    </div>
  );
}

// ---- risk tone -------------------------------------------------------------

export const TONE_TEXT: Record<RiskTone, string> = {
  good: 'text-sea',
  avg: 'text-mandalay',
  poor: 'text-mojo',
};
export const TONE_DOT: Record<RiskTone, string> = {
  good: 'bg-sea',
  avg: 'bg-mandalay',
  poor: 'bg-mojo',
};
export const TONE_PILL: Record<RiskTone, string> = {
  good: 'bg-sea text-white',
  avg: 'bg-mandalay text-white',
  poor: 'bg-mojo text-white',
};

/** Thin progress rail under a sample result. */
export function ResultBar({ tone, percent }: { tone: RiskTone; percent: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-mine/10">
      <div
        className={cn('h-full rounded-full', TONE_DOT[tone])}
        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
      />
    </div>
  );
}

// ---- surfaces --------------------------------------------------------------

/** Standard card: 16px radius, white, the frame's soft two-layer shadow. */
export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('rounded-[16px] bg-white shadow-tst-soft', className)}>{children}</div>;
}

export function Media({
  img,
  className,
  imgClassName,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority,
}: {
  img: Img;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn('object-cover', imgClassName)}
      />
    </div>
  );
}
