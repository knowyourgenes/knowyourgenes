// =============================================================================
// features/about - shared presentational primitives
// -----------------------------------------------------------------------------
// Values read from the Figma "About Us" frame (node 2076:2376) via the REST API.
// The artboard is 1440: section gutter 80, inner rail 1280 with its own 32, so
// the content column is 1216 - the same system as the tests and contact pages.
//
// RADIUS: one radius site-wide - rounded-sm. See docs/DESIGN.md §2.
// =============================================================================

import Image from 'next/image';

import { cn } from '@/lib/utils';
import { AboutIcon } from './AboutIcon';

/**
 * The designer's placeholder photography, dropped into the frame's `div.imgslot`
 * nodes (Figma node 2084:4145 - same layout as 2076:2376, artwork added).
 *
 * In the frame, filling a slot sets its glyph + caption overlay to HIDDEN, so
 * these REPLACE the stand-in rather than layering over it. Every source is
 * larger than its slot and cropped by object-cover, so `position` exists to keep
 * the subject in frame where the source and slot aspect ratios disagree.
 *
 * next/image handles srcset and WebP/AVIF negotiation; the files on disk are
 * plain JPEG at roughly 2x the slot, matching the tests page's convention.
 */
export function Photo({
  src,
  alt,
  className,
  imgClassName,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  position,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  position?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={position ? { objectPosition: position } : undefined}
        className={cn('object-cover', imgClassName)}
      />
    </div>
  );
}

/** Section grounds used by this page. */
export type AboutGround = 'cream' | 'veil' | 'mintFade' | 'sageFade' | 'ink';

export const GROUND: Record<AboutGround, string> = {
  cream: 'bg-linenw text-mine',
  veil: 'bg-white/70 text-mine',
  mintFade: 'bg-gradient-to-b from-linenw to-sage3 text-mine',
  sageFade: 'bg-gradient-to-b from-sage3 to-linenw text-mine',
  ink: 'bg-ink text-linenw',
};

export function Section({
  ground = 'cream',
  id,
  className,
  innerClassName,
  children,
}: {
  ground?: AboutGround;
  id?: string;
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      // scroll-mt clears the 64px sticky SiteHeader on in-page jumps.
      className={cn(GROUND[ground], 'px-5 sm:px-10 lg:px-20', id && 'scroll-mt-[80px]', className)}
    >
      <div className={cn('reveal mx-auto w-full max-w-[1600px] py-[clamp(56px,7vw,92px)] lg:px-8', innerClassName)}>
        {children}
      </div>
    </section>
  );
}

/**
 * Eyebrow pill. The frame uses a mint-tinted capsule with the design's own glyph
 * and an uppercase, letter-spaced label.
 */
export function Eyebrow({
  label,
  icon,
  tone = 'teal',
  className,
}: {
  label: string;
  icon?: string;
  tone?: 'teal' | 'ink';
  className?: string;
}) {
  return (
    // The frame's own metrics: h 38 = 1 + 8 + 20.2 + 8 + 1, pad 8/17/8/13, gap 9,
    // glyph 19x23 (NOT square - forcing it squashes the artwork ~17%), label
    // Figtree 700 13.5/20.2 ls 1.49 (0.11em).
    //
    // DO NOT override this `uppercase` with `[&>span]:normal-case`. Figma stores
    // TEXT in `characters` exactly as the designer typed it and applies case
    // separately via `style.textCase`, so a spec dump that prints only
    // `characters` shows "Start with knowing" for a pill the frame renders as
    // "START WITH KNOWING". Every eyebrow on this page - all 61 uppercase runs
    // in the About frame - is textCase=UPPER; the frame contains no LOWER or
    // TITLE node at all. Three sections had acquired that override on exactly
    // this misreading and were reverted; the 0.11em tracking is uppercase
    // tracking, which is the giveaway.
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-[9px] rounded-sm py-2 pl-[13px] pr-[17px]',
        tone === 'ink'
          ? 'border border-java/28 bg-java/14 text-ice'
          : 'border border-eden/[0.15] bg-eden/[0.07] text-eden',
        className
      )}
    >
      {icon ? <AboutIcon id={icon} className="h-[23px] w-[19px] shrink-0" /> : null}
      <span className="min-w-0 break-words font-kyg text-[13.5px] font-bold uppercase leading-[20.2px] tracking-[0.11em]">
        {label}
      </span>
    </span>
  );
}

/** H2 - Figtree 700, clamped from the frame's desktop size. */
export function Heading({
  html,
  className,
  as: As = 'h2',
}: {
  html: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <As
      className={cn(
        'font-kyg tracking-[-0.02em] text-mine [&_em]:not-italic',
        As === 'h1'
          ? 'text-[clamp(34px,6.4vw,76px)] font-extrabold leading-[1.02]'
          : 'text-[clamp(26px,3.4vw,46px)] font-bold leading-[1.04]',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Body copy - Figtree 400, #5b564e. */
export function Body({ html, className }: { html: string; className?: string }) {
  return (
    <p
      className={cn('break-words font-kyg text-[clamp(15px,1.3vw,18px)] leading-[1.6] text-fusc', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** The small pill used throughout for supporting statements. */
export function Pill({ label, icon, className }: { label: string; icon?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-2 rounded-sm border border-mine/10 bg-white py-2.5 pl-3 pr-4 shadow-tst-soft',
        className
      )}
    >
      {icon ? <AboutIcon id={icon} className="h-[22px] w-[18px] shrink-0" /> : null}
      <span className="min-w-0 break-words font-kyg text-[14.5px] font-semibold leading-[21px] text-[#2d2a24]">
        {label}
      </span>
    </span>
  );
}
