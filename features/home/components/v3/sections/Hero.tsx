// =============================================================================
// features/home/v3 - hero
// -----------------------------------------------------------------------------
// The circledna.com shape: one photograph carrying an oversized centred
// headline, a single supporting line, two CTAs, and two floating trait cards in
// the lower corners showing what a report actually says.
//
// LAYOUT: the hero is an inset CARD, not a full-bleed band. It sits BELOW the
// navbar rather than under it, held off the viewport edges by INSET on all four
// sides, and fills whatever height the header leaves:
//
//     calc(100svh - var(--site-header-h) - INSET * 2)
//
// The INSET is counted TWICE because it is applied twice - above the card and
// below it. The route renders SiteHeader `sticky` (not `overlay`), so the bar
// occupies its own row and this block starts under it; header + top inset +
// card + bottom inset is then exactly one viewport, with nothing of the hero
// hidden behind the bar.
//
// `--site-header-h` is measured and published by SiteHeader itself (a
// ResizeObserver on the bar), so this tracks the real header at every
// breakpoint instead of guessing at it. `svh` not `vh`: on mobile browsers `vh`
// is the tallest possible viewport, so a `100vh` card sits partly behind the
// address bar until you scroll.
//
// `min-h` floors it: on a short landscape phone `100svh - header` collapses to
// something the headline cannot live in.
//
// BACKGROUND: a silent looping video over a still photograph. The photograph is
// not a placeholder to be removed - it is the poster layer, and it stays. It is
// what renders before the video can play, if the file is missing, if autoplay is
// blocked, and for anyone who has asked for reduced motion. See HeroVideo.
//
// The photograph, not the video, is the page's LCP element - hence `priority`
// and `sizes="100vw"`. A <video> cannot be preloaded the way next/image can, so
// making the video the LCP would trade a fast first paint for a slow one.
// The scrim is a three-stop vertical gradient rather than a flat overlay: the
// headline needs contrast through the middle band, the trait cards need the
// corners readable, and a flat wash dark enough for both would grey out the
// picture.
// =============================================================================

import Image from 'next/image';
import Link from 'next/link';
import { BTN, BTN_BLOCK } from '@/components/shared/button-styles';
import { cn } from '@/lib/utils';
import { Heading, Kicker, TraitCard } from '../ui';
import { HeroVideo } from './HeroVideo';

/** Breathing room between the hero card and the viewport edges. */
const INSET = 'clamp(10px,1.1vw,18px)';

export default function Hero() {
  return (
    <div style={{ padding: INSET }}>
      <section
        className="relative isolate w-full overflow-hidden rounded-sm bg-abyss"
        style={{ height: `calc(100svh - var(--site-header-h, 64px) - ${INSET} * 2)`, minHeight: '560px' }}
      >
        <Image
          src="/home/hero-poster.jpg"
          alt="A glowing DNA double helix rendered against a dark field"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <HeroVideo />

        {/* Scrim, tuned for DARK footage. The earlier values (0.66/0.56/0.74)
            were set against a bright daylight photograph; over this helix they
            crushed the artwork to near-black for no contrast gain the type did
            not already have. These are the lightest values that still clear
            4.5:1 for the body line, which is the smallest text on the card. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,36,34,0.46)_0%,rgba(5,36,34,0.34)_42%,rgba(5,36,34,0.58)_100%)]"
        />

        <div className="relative flex h-full w-full flex-col items-center justify-center px-[var(--gutter,clamp(18px,3vw,40px))] py-[clamp(56px,8vh,96px)]">
          <div className="flex max-w-[980px] flex-col items-center gap-[18px] text-center">
            <Kicker tone="onMedia">At-home DNA testing · Delhi NCR</Kicker>

            <Heading as="h1" className="text-white">
              The answers are already in you.
            </Heading>

            <p className="max-w-[680px] text-[clamp(15px,1.35vw,19px)] leading-[1.5] text-white/85">
              One at-home saliva kit, read by NABL-certified labs - and a report written in plain language, not genetics
              jargon.
            </p>

            <div className="mt-[10px] flex w-full flex-col items-center gap-[12px] sm:w-auto sm:flex-row">
              <Link
                href="/categories"
                className={cn(BTN, BTN_BLOCK, 'bg-java2 font-semibold text-abyss transition hover:bg-java')}
              >
                Find My Test
              </Link>
              <Link
                href="#how-it-works"
                className={cn(
                  BTN,
                  BTN_BLOCK,
                  'border border-white/45 font-semibold text-white transition hover:border-white hover:bg-white/10'
                )}
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>

        {/* Floating report readings. Hidden below `lg`: at 268px each they would
            cover the faces the photograph is chosen for, and the hero still
            reads without them. */}
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
