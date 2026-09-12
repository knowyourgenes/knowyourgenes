import Link from 'next/link';
import { Fragment } from 'react';

import { cn } from '@/lib/utils';
import { Button, Icon, Rule, Section, SectionTitle, type IconName } from '../ui';

/**
 * The six directions, each phrased as the reader's own sentence rather than as
 * a product name. That first-person framing IS the section: "I want to feel
 * better" is a thing a person thinks; "Wellness Genomics" is not.
 */
const ROWS: { n: string; icon: IconName; title: string; desc: string; cta: string; href: string }[] = [
  {
    n: '01',
    icon: 'heart',
    title: 'I want to feel better.',
    desc: 'Understand your nutrition, fitness, weight, metabolism, vitamins, sleep, stress and everyday wellness.',
    cta: 'Explore Wellness',
    href: '/categories/wellness',
  },
  {
    n: '02',
    icon: 'users',
    title: 'We’re planning our future together.',
    desc: 'Explore carrier screening and reproductive genetics to make more informed decisions as you plan a family.',
    cta: 'Explore Reproductive Genetics',
    href: '/categories',
  },
  {
    n: '03',
    icon: 'dna',
    title: 'I want to understand what runs in my family.',
    desc: 'Explore genetic predispositions associated with hereditary cancers, cardiac conditions, hypertension, kidney health, eye health and more.',
    cta: 'Explore Health Tests',
    href: '/categories',
  },
  {
    n: '04',
    icon: 'globe',
    title: 'I want to know where I come from.',
    desc: 'Discover your ancestry, origins and inherited traits.',
    cta: 'Explore Ancestry',
    href: '/categories/wellness/ancestry',
  },
  {
    n: '05',
    icon: 'hourglass',
    title: 'I want to understand how I’m aging.',
    desc: 'Explore longevity, telomeres, epigenetic age and insights associated with healthy aging.',
    cta: 'Explore Longevity',
    href: '/categories',
  },
  {
    n: '06',
    icon: 'crosshair',
    title: 'I have a specific health concern.',
    desc: 'Explore our range of clinical and specialty genetic tests.',
    cta: 'Explore Clinical Tests',
    href: '/categories',
  },
];

// -----------------------------------------------------------------------------
// The helix behind the left column
// -----------------------------------------------------------------------------
// The designer's note: "A subtle DNA helix visual in the background", pinned in
// the empty space under the sticky headline. Drawn, not a photograph: this is a
// texture on the sand ground, and a raster helix at this opacity is a smudge.
//
// ONE PERIOD, TILED. Two sine strands half a turn apart with rungs between them,
// built once here and repeated down an SVG <pattern>. A sine is periodic, so the
// tile meets itself seamlessly and the helix runs the full height of the list
// however many rows it grows to.

const HELIX_W = 200;
const HELIX_P = 260; // one full turn, top to bottom
const HELIX_A = 68; // strand amplitude from the axis

function strand(sign: 1 | -1): string {
  const pts: string[] = [];
  for (let y = 0; y <= HELIX_P; y += 4) {
    const x = HELIX_W / 2 + sign * HELIX_A * Math.sin((2 * Math.PI * y) / HELIX_P);
    pts.push(`${pts.length ? 'L' : 'M'}${x.toFixed(2)} ${y}`);
  }
  return pts.join(' ');
}

/** Rungs every twelfth of a turn - except where the strands cross, and a rung
 *  would be a dot. */
const RUNGS = Array.from({ length: 12 }, (_, i) => ((i + 0.5) * HELIX_P) / 12)
  .map((y) => ({ y, dx: HELIX_A * Math.sin((2 * Math.PI * y) / HELIX_P) }))
  .filter((r) => Math.abs(r.dx) > HELIX_A * 0.25);

function DnaHelix({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" width={HELIX_W} className={className}>
      <defs>
        <pattern id="kyg-discover-helix" width={HELIX_W} height={HELIX_P} patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeLinecap="round">
            {RUNGS.map((r) => (
              <line
                key={r.y}
                x1={HELIX_W / 2 - r.dx}
                x2={HELIX_W / 2 + r.dx}
                y1={r.y}
                y2={r.y}
                strokeWidth={1.4}
                strokeOpacity={0.55}
              />
            ))}
            <path d={strand(1)} strokeWidth={2.2} />
            <path d={strand(-1)} strokeWidth={2.2} />
          </g>
        </pattern>
        {/* Barely there behind the headline and fully there under the CTA -
            which is where the designer pinned the note - then gone again at the
            foot. It should read as texture, never as an edge. */}
        <linearGradient id="kyg-discover-helix-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.82" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="kyg-discover-helix-mask" maskContentUnits="objectBoundingBox">
          <rect width="1" height="1" fill="url(#kyg-discover-helix-fade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#kyg-discover-helix)" mask="url(#kyg-discover-helix-mask)" />
    </svg>
  );
}

/**
 * Measured off the design and written as shares of the rail, the same way
 * WhyGeneticTesting is - see the note there for why fixed pixels do not
 * survive the 1024 -> 1600 range.
 *
 * THE NUMERAL IS ITS OWN COLUMN. The design gives it a 55.47 track at the left
 * of the row, with the icon tile sitting INSIDE the title line beside the
 * heading. The previous pass had the tile leftmost and the numeral inline with
 * the title, which put the wrong element in the gutter and left the numerals
 * unable to line up down the list.
 */
export default function Discover({ hoverTint = false }: { hoverTint?: boolean } = {}) {
  return (
    <Section
      id="discover"
      ground="sand"
      labelledBy="discover-heading"
      // `isolate` so the helix's -z-10 lands above the sand ground and below the
      // copy, instead of slipping behind the section's own background.
      className="isolate"
      // NO PADDING OVERRIDE. This section used to compact itself to 34px at
      // 1024 against the page's shared 61, to keep inside a "no section needs
      // scrolling" budget. The design does not agree: it draws 61.156 here like
      // everywhere else, and the frame is 1065px tall at 1024 - taller than the
      // laptop it was being squeezed for. The budget was a rule the page
      // invented, so the design wins and the shared rhythm comes back.
    >
      {/* 440.89 / 484.98 of the rail with a 41.24 gutter. The left column is
          STICKY and must not stretch: `self-start` is what gives sticky slack to
          travel through. */}
      <div className="relative grid gap-[clamp(28px,4.027vw,64px)] lg:grid-cols-[minmax(0,0.909fr)_minmax(0,1fr)]">
        {/* The helix. It spans the LEFT column's share of the grid (0.909 of
            1.909) at the grid's full height - which is the list's height, the
            taller side - so it fills the empty space under the sticky headline
            at every scroll position without being sticky itself. Only from lg:
            below that the columns stack and there is no empty space to fill. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-[47.6%] lg:block">
          {/* Exactly one tile wide: the pattern repeats sideways as well as down,
              so any wider and the edge of a second helix shows. */}
          <DnaHelix className="mx-auto block h-full text-eden opacity-[0.16]" />
        </div>

        <div className="flex min-w-0 flex-col gap-[clamp(13.5px,1.319vw,21px)] self-start lg:sticky lg:top-[108px]">
          {/* THIS HEADLINE IS SIZED DOWN ON PURPOSE, and it is the only one that
              is. The design sets it at 31.29px in a 440.89 column, and
              "Whatever stage of life you're in," measures ~441px there - it fits
              on one line by less than a pixel. Reproduce that ratio exactly and
              any rounding in font metrics or gutter width tips it over, which is
              what put the bold phrase on two lines. 2.9vw is the same headline
              one notch inside the boundary, so line one holds from 1024 up. */}
          <SectionTitle
            id="discover-heading"
            eyebrow="Discover what’s right for you"
            headingClassName="text-[clamp(23px,min(2.9vw,5.8vh),46px)]"
          >
            Whatever stage of life you’re in, <em>there’s more to know.</em>
          </SectionTitle>

          {/* Figtree 400 12.44/18 on nevada, capped at the design's 278.76 */}
          {/* 278.756 of the 440.889 column, which is what puts "where you want
              answers." on its own second line the way the design breaks it. A
              ch-based cap let it run to one long line instead. */}
          <p className="max-w-[clamp(278.8px,27.222vw,435.6px)] font-kyg text-[clamp(12.4px,1.215vw,19.4px)] font-normal leading-[1.446] tracking-[-0.005em] text-nevada">
            You don’t need to understand genetics to know where you want answers.
          </p>

          <Button href="/categories" className="self-start">
            Explore Genetic Testing
          </Button>
        </div>

        {/* A rule opens the list and closes every row - seven for six rows. */}
        <ul className="grid list-none grid-cols-1">
          <Rule tone="fade" aria-hidden />
          {ROWS.map((row) => (
            <Fragment key={row.n}>
              {/* The design's 25.6 / 8.533 / 25.6 / 12.8 box, and the 16.356
                  between the numeral and the body. The row was carrying 7px of
                  vertical padding against the design's 25.6 - the single
                  biggest reason this section read as cramped. */}
              <li
                className={cn(
                  'group flex min-w-0 items-start gap-[clamp(16.4px,1.597vw,25.5px)] py-[clamp(25.6px,2.5vw,40px)] pl-[clamp(8.5px,0.833vw,13.3px)] pr-[clamp(12.8px,1.25vw,20px)]',
                  // The tint bleeds into the row's own padding rather than
                  // stopping at the text, so the whole row reads as the target -
                  // it is a 156px band, and a hover that lit only the copy would
                  // leave most of what you are pointing at unlit. `mint`, the
                  // palette's existing pale teal.
                  hoverTint && 'rounded-sm transition-colors duration-300 hover:bg-mist active:bg-mist'
                )}
              >
                {/* Figtree 300 at -0.04em on pewter, in its own 55.47 track */}
                <span
                  className={
                    'w-[clamp(55.5px,5.417vw,86.7px)] shrink-0 font-kyg text-[clamp(29.9px,2.917vw,46.7px)] font-light leading-[1.34] tracking-[-0.04em] text-pewter'
                  }
                >
                  {row.n}
                </span>

                {/* 8.533 between the title line, the description and the link -
                    one value for all three, as the design sets it. */}
                <div className="flex min-w-0 flex-1 flex-col gap-[clamp(8.5px,0.833vw,13.3px)]">
                  <div className="flex items-center gap-[clamp(10.7px,1.042vw,16.7px)]">
                    {/* 27.02 square at eden/8%, glyph 13.51 */}
                    <span
                      className={
                        'grid aspect-square w-[clamp(27px,2.639vw,42.2px)] shrink-0 place-items-center rounded-sm bg-eden/[0.08] text-eden'
                      }
                    >
                      <Icon
                        name={row.icon}
                        className="h-[clamp(13.5px,1.319vw,21.1px)] w-[clamp(13.5px,1.319vw,21.1px)]"
                      />
                    </span>
                    <h3
                      className={
                        'min-w-0 flex-1 font-kyg text-[clamp(17.9px,1.75vw,28px)] font-bold leading-[1.34] tracking-[-0.022em] text-bistre'
                      }
                    >
                      {row.title}
                    </h3>
                  </div>

                  <p
                    className={
                      'font-kyg text-[clamp(12.4px,1.215vw,19.4px)] font-normal leading-[1.366] tracking-[-0.005em] text-nevada'
                    }
                  >
                    {row.desc}
                  </p>

                  <Link
                    href={row.href}
                    className={
                      'inline-flex min-h-[44px] items-center gap-[clamp(6.4px,0.625vw,10px)] pt-[clamp(2.8px,0.278vw,4.4px)] font-kyg text-[clamp(11.4px,1.111vw,17.8px)] font-bold leading-[1.32] tracking-[-0.008em] text-eden transition-colors duration-300 hover:text-eden2'
                    }
                  >
                    {row.cta}
                    <Icon
                      name="arrow"
                      strokeWidth={2}
                      className="h-[clamp(14.2px,1.389vw,22.2px)] w-[clamp(14.2px,1.389vw,22.2px)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[3px] motion-reduce:transition-none"
                    />
                  </Link>
                </div>
              </li>
              <Rule tone="fade" aria-hidden />
            </Fragment>
          ))}
        </ul>
      </div>
    </Section>
  );
}
