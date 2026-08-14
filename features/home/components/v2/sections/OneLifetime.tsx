// =============================================================================
// Homepage - SECTION 06 · ONE LIFETIME. ONE DNA
// -----------------------------------------------------------------------------
// Rebuilt against the designer's own build ("New Homepage Build/index.html",
// `section.sec.life`, CSS block 11) - the page the Figma frame was traced from.
// Where the frame and that HTML disagreed, the HTML won, and it disagreed a lot
// here: the frame flattens a scroll-DRAWN strand into a static vector and pins
// five hand-measured row heights (403 / 106.7 / 403 / 145.3 / 403) so the wave's
// periods land on the dots. None of that is in the source. The source lets every
// station size to its own content and generates the strand from the rail's
// measured box, which is why the pinned heights are gone.
//
// A CENTRED TIMELINE. Each station is a 3-column grid - 1fr / 120px / 1fr - with
// the strand rail absolutely positioned down that middle 120px column. The 13px
// node dot sits on the centre line at the station's vertical midpoint; the
// strand waves PAST it rather than threading through it, exactly as the source
// draws it. Do not "correct" the dots onto the curve.
//
// Rows alternate by nth-child parity in the source, so the side is derived from
// the index here rather than stored as data - storing it would let the two drift
// apart. Odd stations (01/03/05) put the line right-aligned in column 1 and the
// photograph in column 3; even stations (02/04) put the line left-aligned in
// column 3 and carry no art at all.
//
// BREAKPOINT DEVIATION, stated plainly: the source switches to the stacked
// layout at max-width 860 (and dims the helix ground at 820). Tailwind v4 emits
// arbitrary min-width variants BEFORE named ones, so an arbitrary `min-[861px]`
// would always lose to the named breakpoints `Section` already carries for its
// gutter. Both switches therefore use the nearest named breakpoint, md (768).
// At 768 the three-column layout still fits: 704 of content minus the 120 rail
// and two ~15px gaps leaves ~277 per column, which clears the 268 photo.
//
// RADIUS TRAP: the photographs are radius 24 (`--r-md`), written as an explicit
// arbitrary value. This project remaps Tailwind's radius scale (--radius
// .625rem), so the named 2xl/3xl steps resolve to 18/22 and cannot be used here.
// =============================================================================

import { cn } from '@/lib/utils';

import { LifeStrand, Reveal } from '../motion';
import { AssetSlot, Cta, Heading, Kicker, PHOTO, Section } from '../ui';

/* -------------------------------------------------------------------------- */
/* the five life stations                                                     */
/* -------------------------------------------------------------------------- */

type Station = {
  /**
   * The plain head of the line. Keeps its trailing space so head + refrain read
   * as one sentence - the source has them as one text node with an inline <em>.
   */
  line: string;
  /** `.lstn__x em` - the bold teal refrain. Station 05 deliberately drops it. */
  accent?: string;
  /** `figure.lstn__f`. Only the odd stations carry art in the source. */
  photo?: {
    src: string;
    /** the source's own alt text on the `img.ph-img` */
    alt: string;
    /** kept so the labelled plate is still correct if the photo ever goes away */
    title: string;
    meta: string;
    path: string;
  };
};

const STATIONS: Station[] = [
  {
    line: 'Before you were born, ',
    accent: 'it was there.',
    photo: {
      src: PHOTO.life1,
      alt: 'A newborn’s hand curled around a parent’s finger',
      title: 'Life Stage 01',
      meta: 'Newborn hand resting in a parent’s palm · 600 × 760 · 4:5',
      path: 'assets/life-01-newborn.jpg',
    },
  },
  {
    line: 'When you grew, ',
    accent: 'it was there.',
  },
  {
    line: 'When you fell in love, ',
    accent: 'it was there.',
    photo: {
      src: PHOTO.life3,
      alt: 'A young couple talking on a rooftop at golden hour',
      title: 'Life Stage 03',
      meta: 'Young couple, warm evening light, unposed · 600 × 760 · 4:5',
      path: 'assets/life-03-couple.jpg',
    },
  },
  {
    line: 'When you started thinking about a family, ',
    accent: 'it was there.',
  },
  {
    // the turn - the only station the source gives no teal run, because it drops
    // the refrain rather than repeating it
    line: 'As your body changes, it remains part of your story.',
    photo: {
      src: PHOTO.life5,
      alt: 'An older man mid-walk on an early morning',
      title: 'Life Stage 05',
      meta: 'Older adult mid-movement, calm and well · 600 × 760 · 4:5',
      path: 'assets/life-05-older-adult.jpg',
    },
  },
];

/** `--sh-2` - the warm-tinted double drop shadow every plate on this page uses. */
const SH_2 = 'shadow-[0_4px_16px_0_rgba(45,32,18,0.07),0_18px_50px_0_rgba(45,32,18,0.09)]';

export default function OneLifetime() {
  return (
    <Section
      id="one-lifetime-one-dna"
      ground="cream"
      // `isolate` is load-bearing twice over: it keeps the two negative-z paints
      // below inside this section's stacking context, and it gives the helix
      // ground's multiply blend something local to blend against instead of the
      // whole page.
      className="relative isolate overflow-clip"
      innerClassName="py-[clamp(84px,10vw,168px)]"
    >
      {/* The source's two warm blooms, as one background-image stack rather than
          the frame's two pixel-sized discs. The percentage radii plus a
          `transparent` stop are what keep them reading as WARMTH; the frame's
          860/1020px versions at 0.42/0.5 rendered as two visible cream circles. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(58%_44%_at_50%_30%,rgba(237,221,184,0.5),transparent_66%),radial-gradient(46%_38%_at_84%_84%,rgba(248,228,204,0.42),transparent_64%)]"
      />

      {/* `.hx.hx--l.hx--life` - the ink helix bleeding off the right edge. The
          radial mask is what stops the PNG's rectangle from showing as a hard
          edge, and multiply is what lets the cream ground tint it rather than
          the artwork sitting on top as a grey rectangle. Dimmed on small
          screens (the source's 820 cut) where it would crowd the copy. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute right-[-9%] top-[6%] -z-10 h-[70%] w-[min(32vw,400px)]',
          'bg-[url(/home/brand/helix-ink.png)] bg-contain bg-center bg-no-repeat',
          'opacity-[0.07] mix-blend-multiply md:opacity-[0.15]',
          '[-webkit-mask-image:radial-gradient(closest-side,#000_58%,transparent_100%)]',
          '[mask-image:radial-gradient(closest-side,#000_58%,transparent_100%)]'
        )}
      />

      {/* ---- header ------------------------------------------------------- */}
      <Reveal as="header" className="mb-[clamp(46px,5vw,80px)] text-center">
        <Kicker tone="eden" className="mb-[clamp(22px,2.2vw,32px)]">
          One lifetime. One DNA.
        </Kicker>

        {/* One heading, two voices: Figtree 400 for the statement, then
            Cormorant Garamond 500 italic for the turn - an inline <em>, NOT a
            forced line break. The 19ch cap plus text-wrap:balance is what breaks
            it into two even lines at every width, which a <br> cannot do.
            The 1.1em is the source's `.h2 em` size bump: Cormorant runs small
            against Figtree and looks undersized at the same px. */}
        <Heading
          as="h2"
          className="mx-auto max-w-[19ch] text-balance font-normal tracking-[-0.03em] text-bistre [&_em]:text-[1.1em]"
          html={'Before you knew yourself, <em>your genes were already there.</em>'}
        />
      </Reveal>

      {/* ---- the timeline --------------------------------------------------- */}
      {/* The rail is a SIBLING of the <ol>, not a child: an ordered list may only
          contain <li>. This wrapper is what the rail measures itself against, so
          it must stay exactly as tall as the list. */}
      <div className="relative">
        {/* THE STRAND. Five sine waves under a half-sine envelope, generated
            from the rail's measured pixel box and drawn on scroll by animating
            stroke-dashoffset - the shared LifeStrand is a verbatim port of the
            source's buildStrand()/tick() pair, including the 0.82 -> 0.34
            viewport window.

            The stroke overrides are here rather than in the primitive because
            this section's palette is the source's: a 1.4px eden ghost at 50%
            with a 2.4px java glow at 95% over it. LifeStrand's own defaults are
            two eden strokes at 1.5, which loses the teal entirely on cream.

            Width is what sets the amplitude (min(30, w * 0.4)), so the 120 -> 60
            change below md is not cosmetic: it narrows the wave to 24px of swing
            so it fits the 60px stacked gutter. */}
        <LifeStrand
          className={cn(
            'pointer-events-none absolute inset-y-0 left-[20px] z-0 w-[60px]',
            'md:left-1/2 md:w-[120px] md:-translate-x-1/2',
            '[&>svg>path]:stroke-[#0e4d4b] [&>svg>path]:opacity-50 [&>svg>path]:[stroke-width:1.4]',
            '[&>svg>path:last-child]:stroke-[#25b5ab] [&>svg>path:last-child]:opacity-95 [&>svg>path:last-child]:[stroke-width:2.4]'
          )}
        />

        <ol className="list-none" aria-label="Your genes through your life">
          {STATIONS.map((station, i) => {
            // the source alternates with :nth-child(odd/even); index 0 is the
            // first child, so an even index is an ODD station
            const odd = i % 2 === 0;

            return (
              <Reveal
                key={station.line}
                as="li"
                // the source's --rd ladder: .02 / .06 / .10 / .14 / .18
                delay={0.02 + i * 0.04}
                className={cn(
                  // `group` so the node dot can react to a hover anywhere on the
                  // station, which is what `.lstn:hover::before` does. The
                  // z-index of 1 keeps the copy above the rail, which sits at 0.
                  'group relative z-[1] grid items-center',
                  'grid-cols-[60px_minmax(0,1fr)] gap-x-[18px] py-[22px]',
                  'md:grid-cols-[minmax(0,1fr)_120px_minmax(0,1fr)] md:gap-x-[clamp(10px,2vw,32px)] md:py-[clamp(20px,2.4vw,34px)]'
                )}
              >
                {/* The 13px node dot - cream fill, 2px teal ring, 8px halo, all
                    three drawn as one box-shadow so nothing takes layout space
                    and the halo can grow on hover without nudging the row.

                    Stacked, it moves onto the left rail 34px down (the vertical
                    centre of the first text line); at md it snaps to the centre
                    line. The -6.5px margins do the centring rather than a
                    translate, so a hover transition can never fight a transform. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute left-[20px] top-[34px] z-[2] -ml-[6.5px] -mt-[6.5px] h-[13px] w-[13px] rounded-full',
                    'bg-linenw shadow-[0_0_0_2px_#0e4d4b,0_0_0_8px_rgba(14,77,75,0.09)]',
                    'transition-[box-shadow,background-color] duration-[640ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                    'group-hover:bg-java2 group-hover:shadow-[0_0_0_2px_#2ac3a2,0_0_0_12px_rgba(42,195,162,0.18)]',
                    'motion-reduce:transition-none',
                    'md:left-1/2 md:top-1/2'
                  )}
                />

                {/* Figtree 400 clamp(21,2.2vw,32) / 1.22, ls -0.026em. The
                    refrain is a bold eden <em> with the italic switched OFF -
                    this is the one <em> on the page that is NOT the Cormorant
                    editorial voice. */}
                <p
                  className={cn(
                    'col-start-2 min-w-0 text-balance text-left',
                    'font-kyg text-[clamp(21px,2.2vw,32px)] font-normal leading-[1.22] tracking-[-0.026em] text-bistre',
                    odd ? 'md:col-start-1 md:text-right' : 'md:col-start-3 md:text-left'
                  )}
                >
                  {station.line}
                  {station.accent ? <em className="font-bold not-italic text-eden">{station.accent}</em> : null}
                </p>

                {/* 4:5 photograph, radius 24, capped at 268 (220 stacked). The
                    plate chrome is dropped automatically once `photo` is set -
                    title/meta/path stay only as the fallback if the art is ever
                    pulled. */}
                {station.photo ? <AssetPhoto photo={station.photo} /> : null}
              </Reveal>
            );
          })}
        </ol>
      </div>

      {/* ---- the turn ------------------------------------------------------- */}
      <Reveal className="mt-[clamp(50px,5.5vw,86px)] text-center">
        {/* Cormorant Garamond 500 italic clamp(28,3.2vw,48) - the section's
            close. 20ch + balance breaks it evenly without a hard <br>. */}
        <p className="mx-auto max-w-[20ch] text-balance font-tst text-[clamp(28px,3.2vw,48px)] font-medium italic leading-[1.2] text-bistre">
          Perhaps it’s time you got to know them.
        </p>

        {/* eden fill, not the default java2 - the source's `.btn` base skin on a
            cream ground, with its own 0 6 18 eden shadow */}
        <Cta
          href="/categories"
          icon="6024-796"
          className="mt-[clamp(26px,3vw,38px)] bg-eden text-linenw shadow-[0_6px_18px_0_rgba(14,77,75,0.18)]"
        >
          Discover Your Genes
        </Cta>
      </Reveal>
    </Section>
  );
}

/* -------------------------------------------------------------------------- */
/* one station's photograph                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Split out only because the grid placement, the two width caps and the shadow
 * make one very long className that buries the station markup above.
 *
 * Column placement is unconditional at md: every station that HAS a photo is an
 * odd one, so the source's `:nth-child(even) .lstn__f` rule (column 1,
 * justify-self end) is dead code and is deliberately not ported - porting it
 * would imply an even station could grow art, which would then also need the
 * text moved out of column 3.
 */
function AssetPhoto({ photo }: { photo: NonNullable<Station['photo']> }) {
  return (
    <AssetSlot
      icon={null}
      tone="sand"
      title={photo.title}
      meta={photo.meta}
      path={photo.path}
      photo={photo.src}
      alt={photo.alt}
      // capped at 268 CSS px, so a 2x screen never needs more than ~536
      sizes="(max-width: 767px) 220px, 268px"
      className={cn(
        'col-start-2 mt-[18px] aspect-[4/5] w-[min(100%,220px)] justify-self-start rounded-[24px]',
        SH_2,
        'md:col-start-3 md:mt-0 md:w-[min(100%,268px)]'
      )}
    />
  );
}
