import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Button, Eyebrow } from '../ui';
import { HeroVideo } from './HeroVideo';

/** Breathing room between the hero card and the viewport edges. */
const INSET = 'clamp(10px,1.1vw,18px)';

/**
 * A single genetic finding, drawn the way a report draws it: the trait, where
 * this person lands, and a scale showing what landing there means.
 *
 * This is the one piece of the reference worth copying outright - a marketing
 * hero that shows the product's actual OUTPUT beats one that describes it.
 * `position` is 0-100 along the scale; the marker sits on it.
 */
function TraitCard({
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
        'group w-[min(268px,72vw)] rounded-sm border border-white/70 bg-white/[0.92] p-[14px] shadow-kyg-deep backdrop-blur-[6px]',
        className
      )}
    >
      <figcaption className="text-[13.5px] font-semibold text-mine">{trait}</figcaption>
      <p className="mt-[2px] text-[13px] font-semibold text-mojo">{reading}</p>

      {/* Two segments, not a gradient: the report says which BAND you are in,
          and a gradient would imply a precision the science does not have. */}
      <div className="relative mt-[14px]">
        {/* The marker. An SVG, not the old CSS border triangle: a zero-size box
            whose "arrow" is only its borders drew fine in a browser but vanished
            when the page was captured into Figma, which is why the designer saw
            no arrow on the Diabetes card at all.

            ON HOVER it travels the scale - back to the low end, up past the
            reading, and settles on it - so the card reads as a result being
            placed rather than a static label. It starts AND ends on `--pos`, so
            there is no jump when the pointer arrives or leaves. The reading
            itself never changes: letting a pointer drag it would suggest the
            result is adjustable, which a genetic finding is not. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 7"
          className="absolute -top-[10px] block h-[7px] w-[12px] -translate-x-1/2 fill-mine group-hover:animate-kyg-trait-sweep motion-reduce:group-hover:animate-none"
          style={{ left: `${position}%`, ['--pos' as string]: `${position}%` }}
        >
          <path d="M0 0h12L6 7z" />
        </svg>
        <div className="flex h-[5px] w-full overflow-hidden rounded-sm">
          <span className="h-full flex-1 bg-java" />
          <span className="h-full flex-1 bg-mojo" />
        </div>
        <div className="mt-[6px] flex justify-between text-[11px] font-medium text-cord">
          <span>{low}</span>
          <span>{high}</span>
        </div>
      </div>
    </figure>
  );
}

/**
 * The hero is an inset CARD, not a full-bleed band. It sits BELOW the navbar,
 * held off the viewport edges by INSET on all four sides, and fills whatever
 * height the header leaves:
 *
 *     calc(100svh - var(--site-header-h) - INSET * 2)
 *
 * INSET is counted twice because it is applied twice, above and below. The route
 * renders SiteHeader sticky (not overlay), so header + inset + card + inset is
 * exactly one viewport with nothing hidden behind the bar. `--site-header-h` is
 * measured and published by SiteHeader itself, so this tracks the real bar.
 *
 * `svh` not `vh`: on mobile browsers `vh` is the TALLEST possible viewport, so a
 * 100vh card sits partly behind the address bar until you scroll.
 *
 * The photograph, not the video, is the LCP element - hence `priority`. A
 * <video> cannot be preloaded the way next/image can.
 */
export default function Hero() {
  return (
    <div style={{ padding: INSET }}>
      <section
        aria-labelledby="hero-heading"
        className="relative isolate w-full overflow-hidden rounded-sm bg-abyss"
        style={{ height: `calc(100svh - var(--site-header-h, 64px) - ${INSET} * 2)`, minHeight: '560px' }}
      >
        <Image src="/home/hero-poster.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
        <HeroVideo />

        {/* Three stops, not a flat wash: the headline needs contrast through the
            middle band and the trait cards need the corners readable, and a flat
            overlay dark enough for both greys out the picture. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,36,34,0.46)_0%,rgba(5,36,34,0.34)_42%,rgba(5,36,34,0.58)_100%)]"
        />

        <div className="relative flex h-full w-full flex-col items-center justify-center px-[clamp(18px,3vw,40px)] py-[clamp(56px,8vh,96px)]">
          <div className="flex max-w-[980px] flex-col items-center gap-[18px] text-center">
            <Eyebrow tone="dark" data-rise-load="1" className="bg-white/[0.12] text-white ring-white/25">
              At-home DNA testing · Delhi NCR
            </Eyebrow>

            <h1
              data-rise-load="2"
              id="hero-heading"
              className="font-kyg text-[clamp(34px,4.6vw,62px)] font-bold leading-[1.1] tracking-[-0.025em] text-white text-balance"
            >
              {/* The brand, named in the view. The mark in the navbar is the KYG
                  monogram only, so until now "Know Your Genes" appeared nowhere
                  above the fold. It leads the h1 rather than sitting in its own
                  line above it: that is the most prominent text on the page, and
                  it puts the brand in the heading search engines read first. */}
              {/* ice, not java. The helix in the video is java's own hue AND
                  lightness, so java letters dissolved wherever a bright strand
                  crossed them - measured down to 1.3:1. ice (#7fe3d6) is the same
                  teal, lighter, so it stays the brand colour but clears the
                  strands. The halo is for the video, not decoration: a tight
                  3px/10px edge where the letters meet a strand, and the wide
                  28px one to darken the ground around the whole line. */}
              <span className="block text-ice [text-shadow:0_0_3px_rgba(4,30,28,0.85),0_0_10px_rgba(4,30,28,0.8),0_0_28px_rgba(4,30,28,0.9)]">
                Know Your Genes.
              </span>{' '}
              {/* The space is for anything that reads the markup without layout
                  (text extractors, some crawlers): without it they get
                  "Genes.The". It collapses at the line start, so nothing moves. */}
              The answers are already in you.
            </h1>

            <p
              data-rise-load="3"
              className="max-w-[680px] font-kyg text-[clamp(15px,1.35vw,19px)] leading-[1.5] text-white/85"
            >
              One at-home saliva kit, read by NABL-certified labs - and a report written in plain language, not genetics
              jargon.
            </p>

            <div
              data-rise-load="4"
              className="mt-[10px] flex w-full flex-col items-center gap-[12px] sm:w-auto sm:flex-row"
            >
              <Button href="/categories" variant="onDark" block>
                Find My Test
              </Button>
              <Button href="#how-it-works" variant="ghostDark" block arrow={false}>
                How It Works
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden below lg: at 268px each they would cover the faces the
            photograph is chosen for, and the hero still reads without them. */}
        <TraitCard
          trait="Vitamin D"
          reading="Higher needs"
          low="Normal needs"
          high="Higher needs"
          position={74}
          className="absolute bottom-[clamp(20px,3vh,40px)] left-[clamp(18px,3vw,52px)] hidden lg:block"
        />
        <TraitCard
          trait="Type 2 Diabetes"
          reading="Elevated risk"
          low="Average risk"
          high="Elevated risk"
          position={68}
          className="absolute bottom-[clamp(20px,3vh,40px)] right-[clamp(18px,3vw,52px)] hidden lg:block"
        />
      </section>
    </div>
  );
}
