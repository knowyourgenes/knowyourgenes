// =============================================================================
// features/home/v3 - shared primitives for the /homepage redesign
// -----------------------------------------------------------------------------
// v3 sits beside v1 (`Homepage.tsx` -> /home-redesign) and v2 (`v2/` -> /) as a
// third variant rather than a new feature, because that is how this repo already
// versions the homepage.
//
// Reference: circledna.com - full-bleed photographic hero, oversized centred
// headline, two CTAs, and floating "trait" cards laid over the image. The
// STRUCTURE is borrowed; every colour, radius, width and button here is KYG's
// own (docs/DESIGN.md), not the reference's.
//
// Everything obeys the design system: `Container` for the 1600px shell, `BTN`
// for buttons, `rounded-sm` for every corner, KYG palette tokens for colour.
// =============================================================================

import { Container } from '@/components/shared/Container';
import { cn } from '@/lib/utils';

/** Section shell. Ground runs full-bleed; content stays on the 1600px rail. */
export function Section({
  children,
  className,
  innerClassName,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn('w-full', id && 'scroll-mt-[80px]', className)}>
      <Container className={cn('py-[clamp(56px,6vw,96px)]', innerClassName)}>{children}</Container>
    </section>
  );
}

/**
 * Uppercase eyebrow. Same treatment everywhere, per DESIGN.md §4.
 *
 *   dark     on light grounds
 *   light    brand teal, for FLAT dark grounds - the closing CTA
 *   onMedia  white, for grounds that are photography or video
 *
 * `onMedia` exists because a coloured eyebrow can only be trusted when you
 * control what sits behind it. Brand teal disappeared into the hero's cyan
 * helix footage; white plus a shadow reads over anything.
 */
export function Kicker({
  children,
  tone = 'dark',
  className,
}: {
  children: React.ReactNode;
  tone?: 'dark' | 'light' | 'onMedia';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'text-[11.5px] font-bold uppercase tracking-[0.2em]',
        tone === 'onMedia' && 'text-white [text-shadow:0_1px_12px_rgba(5,36,34,0.9)]',
        tone === 'light' && 'text-java2 [text-shadow:0_1px_10px_rgba(5,36,34,0.85)]',
        tone === 'dark' && 'text-eden',
        className
      )}
    >
      {children}
    </span>
  );
}

export function Heading({
  children,
  as: As = 'h2',
  className,
}: {
  children: React.ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <As
      className={cn(
        'font-kyg tracking-[-0.02em]',
        As === 'h1'
          ? 'text-[clamp(34px,5.2vw,68px)] font-extrabold leading-[1.06]'
          : 'text-[clamp(26px,3.2vw,42px)] font-bold leading-[1.12]',
        className
      )}
    >
      {children}
    </As>
  );
}

export function Lead({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn('max-w-[720px] text-[clamp(15px,1.3vw,18px)] leading-[1.55] text-cord', className)}>{children}</p>
  );
}

/**
 * A single genetic finding, drawn the way a report draws it: the trait, where
 * this person lands, and a scale showing what "lands there" means.
 *
 * These float over the hero photograph. They are the one piece of the reference
 * worth copying outright - a marketing hero that shows the actual OUTPUT of the
 * product beats one that describes it, and this is what a KYG report literally
 * looks like.
 *
 * `position` is 0-100 along the scale. The marker sits on it.
 */
export function TraitCard({
  trait,
  reading,
  low,
  high,
  position,
  className,
}: {
  trait: string;
  reading: string;
  low: string;
  high: string;
  position: number;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        'w-[min(268px,72vw)] rounded-sm border border-white/70 bg-white/92 p-[14px] shadow-kyg-deep backdrop-blur-[6px]',
        className
      )}
    >
      <figcaption className="text-[13.5px] font-semibold text-mine">{trait}</figcaption>
      <p className="mt-[2px] text-[13px] font-semibold text-mojo">{reading}</p>

      {/* The scale. Two segments, not a gradient: the report says which BAND you
          are in, and a gradient would imply a precision the science does not
          have. */}
      <div className="relative mt-[14px]">
        <span
          aria-hidden
          className="absolute -top-[9px] block h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[6px] border-x-transparent border-t-mine"
          style={{ left: `${position}%` }}
        />
        <div className="flex h-[5px] w-full overflow-hidden rounded-sm">
          <span className="h-full flex-1 bg-java" />
          <span className="h-full flex-1 bg-mojo" />
        </div>
        <div className="mt-[6px] flex justify-between text-[10.5px] font-medium text-cord">
          <span>{low}</span>
          <span>{high}</span>
        </div>
      </div>
    </figure>
  );
}
