'use client';

import Image from 'next/image';
import type { CSSProperties } from 'react';

import { cn } from '@/lib/utils';
import { useScrollPin } from '../lib/use-scroll-pin';
import { Button, Icon, PHOTO, Section, SectionTitle, type IconName } from '../ui';

/**
 * 04 - One life. One DNA. Five stations on a rising curve that LIGHTS AS YOU
 * READ IT.
 *
 * The layout is the design's, unchanged: one 967.111 x 426.667 band holding all
 * five stations at once. What moves is the light - the curve fills, the station
 * it reaches lifts out of the row, and the rest sits back. Scrolling the PAGE
 * drives it, not a scrollbar of its own: the band already fits on screen at
 * every width from 1024 up, so there is nothing to scroll sideways THROUGH, and
 * a rail that has to be dragged to be read would hide four fifths of a life
 * behind an interaction.
 *
 * EVERYTHING IS A PERCENTAGE OF THE STAGE. The stage is an aspect-ratio box at
 * the design's own dimensions, every station is placed in % of it, and the
 * curve is one path stretched across the same box. The composition therefore
 * scales as a unit from 1024 to the 1600 the Container caps at, with nothing to
 * re-derive. Type cannot scale in %, so it scales in vw on the same ratio the
 * rest of the page uses: the design's value at 1024, ceilinged at 1600
 * (x1.5625).
 */

/** Stations. `top` is the photo's top edge as a share of the stage height. */
const STATIONS: {
  n: string;
  cx: number;
  top: number;
  icon: IconName;
  title: string;
  line: string;
  photo: string;
  alt: string;
}[] = [
  {
    n: '1',
    cx: 10,
    top: 40.02,
    icon: 'focus',
    title: 'Before you were born',
    line: 'It was already written.',
    photo: PHOTO.life1,
    alt: 'A newborn’s hand curled around a parent’s finger',
  },
  {
    n: '2',
    cx: 30,
    top: 40.14,
    icon: 'user',
    title: 'When you grew',
    line: 'It shaped how you responded.',
    photo: PHOTO.life3,
    alt: 'A young couple talking on a rooftop at golden hour',
  },
  {
    n: '3',
    cx: 50,
    top: 31.1,
    icon: 'heart',
    title: 'When you fell in love',
    line: 'It was part of what you would pass on.',
    photo: PHOTO.life5,
    alt: 'A man walking outdoors on an early morning',
  },
  {
    n: '4',
    cx: 70,
    top: 19.46,
    icon: 'users',
    title: 'When you thought of family',
    line: 'It mattered more than ever.',
    photo: PHOTO.care1,
    alt: 'Two women talking across a table over a report',
  },
  {
    n: '5',
    cx: 90,
    top: 16.01,
    icon: 'figure',
    title: 'As your body changes',
    line: 'It remains part of your story.',
    photo: PHOTO.life2,
    alt: 'An older woman tending plants on a sunlit balcony',
  },
];

/** Offsets from the photo's top edge, in % of stage height. Measured off the design. */
const OFFSET = { numeral: 14.67, node: 29.5, title: 39.67, line: 44.67 } as const;

/** The caption column and the watermark, as shares of the stage width. */
const TEXT_W = 17.353;
const NUMERAL_W = 10.294;

/**
 * The curve, in the design's own 967.111 x 426.667 space.
 *
 * Inlined rather than served from public/ because the fill is animated, and you
 * cannot reach inside an <img> to move a dash offset. The export samples the
 * line every 3.56px - 262 points, 9.6KB - which is more resolution than a 1px
 * stroke can show. Every fourth point is kept: 67 points, 897 bytes, and the
 * largest deviation from the original anywhere along it is 0.13px.
 */
const CURVE =
  'M0 307.77L14.22 308.27L28.44 308.98L42.67 309.69L56.89 310.47L71.11 311.4L85.33 312.25L99.56 313.1L113.78 313.96L128 314.81L142.22 315.52L156.44 316.16L170.67 316.66L184.89 317.01L216.89 317.16L234.67 316.8L248.89 316.3L263.11 315.59L277.33 314.6L291.56 313.39L305.78 311.89L320 310.12L334.22 308.2L348.44 305.92L362.67 303.5L376.89 300.8L391.11 297.88L405.33 294.83L419.56 291.49L433.78 288.07L448 284.44L462.22 280.68L476.44 276.84L490.67 272.93L504.89 268.94L519.11 264.96L533.33 260.91L547.56 256.93L561.78 252.94L576 249.03L590.22 245.26L604.44 241.56L618.67 238.01L632.89 234.6L647.11 231.4L661.33 228.34L675.56 225.49L689.78 222.93L704 220.52L718.22 218.38L732.44 216.53L746.67 214.9L760.89 213.55L775.11 212.41L789.33 211.49L803.56 210.84L817.78 210.42L835.56 210.13L864 210.42L878.22 210.77L892.44 211.27L906.67 211.91L920.89 212.69L935.11 213.48L949.33 214.33L963.55 215.25L967.11 215.47';

/**
 * The curve's length in user units, measured off the points above.
 *
 * IT IS A CONSTANT ON PURPOSE, not `getTotalLength()` in an effect: the server
 * has no DOM, and a length that only exists after mount means the first paint
 * draws the wrong amount of line and then corrects itself.
 *
 * WHY THE DASH IS WRITTEN THIS WAY. The obvious spelling of a fill is
 * `pathLength={1}` with a `strokeDashoffset` counting down from 1, and it is
 * what this section shipped with first. It renders WRONG: `pathLength`
 * normalises the dash pattern in USER space, while `vector-effect:
 * non-scaling-stroke` moves dash and offset into SCREEN space, so the two
 * cancel and the pattern no longer means "fraction of the path" - the line lit
 * from the wrong end and saturated before it ever reached station 05.
 *
 * So: no pathLength, no offset, no non-scaling-stroke. One dash of
 * `LENGTH x fill` followed by a gap longer than the whole path, in the same
 * user units the path itself is drawn in. There is nothing left to interpret.
 *
 * Dropping non-scaling-stroke costs nothing here: the band's box carries the
 * viewBox's own 967:427, so the scale is uniform and the stroke is not
 * distorted - it just grows with the drawing, which is what the design does.
 */
const CURVE_LEN = 978.974;

/**
 * How much of the curve is lit before the pin has been entered at all.
 *
 * 0.12 puts the light just past station 01, so the section is never a dead grey
 * line - and it is what the SERVER renders, so the first paint and the first
 * client render agree and there is nothing to hydrate around.
 */
const FILL_AT_REST = 0.12;

/**
 * The share of the pin the fill is spent over.
 *
 * NOT 1. The last 15% is DWELL: station 05 lights, and then the band holds
 * finished for a moment before the page moves on. Spending the fill over the
 * whole pin means "As your body changes" lights on the very last pixel before
 * the section leaves, which is the one frame nobody sees.
 */
const FILL_SPAN = 0.85;

const SIZE = {
  numeral: 'text-[clamp(83.9px,8.194vw,131.1px)]',
  node: 'h-[clamp(32.7px,3.194vw,51.1px)] w-[clamp(32.7px,3.194vw,51.1px)]',
  nodeIcon: 'h-[clamp(14.2px,1.389vw,22.2px)] w-[clamp(14.2px,1.389vw,22.2px)]',
  title: 'text-[clamp(12.8px,1.25vw,20px)]',
  line: 'text-[clamp(10.3px,1.007vw,16.1px)]',
} as const;

/**
 * The node: an ink disc threaded on the line. `rounded-full` is legitimate
 * under DESIGN.md §2 - equal width and height, and round is the point.
 */
function Node({
  icon,
  lit,
  className,
  style,
}: {
  icon: IconName;
  lit?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={style}
      className={cn(
        'grid place-items-center rounded-full bg-[#141B1A] text-ice',
        'transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        lit
          ? 'shadow-[0_6px_26px_0_rgba(42,195,162,0.6)] ring-[1.5px] ring-inset ring-java2'
          : 'shadow-[0_4px_16px_0_rgba(42,195,162,0.35)] ring-[1.5px] ring-inset ring-java2/[0.55]',
        SIZE.node,
        className
      )}
    >
      <Icon name={icon} className={SIZE.nodeIcon} />
    </span>
  );
}

export default function OneLifetimeCurve() {
  const { track, pane, walked } = useScrollPin({ span: FILL_SPAN });
  const fill = FILL_AT_REST + (1 - FILL_AT_REST) * walked;

  return (
    <Section id="one-lifetime-one-dna" ground="ink" labelledBy="one-life-heading">
      {/* ── The pin. The band holds still under the header while the page
          scrolls THROUGH it, and that scroll is what walks the light from
          station 01 to 05. The page only moves on once the walk is done.

          200vh = one viewport of band + one viewport of walking. The band's
          own width never changes; what travels is the light.

          This is sticky, NOT scroll-jacking: nothing intercepts the wheel, the
          scrollbar keeps its meaning, and a flick past the section still gets
          you past it. lg and up only - below 1024 five stations across a 2.27:1
          box puts the captions at ~6px, so the same five run as a list. ──── */}
      <div ref={track} className="relative hidden h-[200vh] lg:block">
        <div
          ref={pane}
          className="sticky top-[var(--site-header-h,104px)] flex h-[calc(100svh-var(--site-header-h,104px))] flex-col justify-center"
        >
          {/* max-h-full is the short-screen valve: the band gives height back
              rather than growing past the pane and clipping station 05. */}
          <div className="relative aspect-[967/427] max-h-full w-full">
            <svg
              aria-hidden="true"
              viewBox="0 0 967.111 426.667"
              preserveAspectRatio="none"
              fill="none"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              {/* The unlit track: where the line has not been reached yet. */}
              <path d={CURVE} stroke="rgba(250,246,239,0.12)" strokeWidth={1.28} />
              {/* The glow and the line are the SAME path with the SAME dash -
              two strokes, not two shapes, so they can never drift apart. One
              dash of `length x fill`, then a gap longer than everything left. */}
              <path
                d={CURVE}
                strokeDasharray={`${CURVE_LEN * fill} ${CURVE_LEN}`}
                stroke="rgba(42,195,162,0.45)"
                strokeWidth={6.4}
                strokeLinecap="round"
                className="[filter:blur(3px)] motion-safe:transition-[stroke-dasharray] motion-safe:duration-300 motion-safe:ease-out"
              />
              <path
                d={CURVE}
                strokeDasharray={`${CURVE_LEN * fill} ${CURVE_LEN}`}
                stroke="#7FE3D6"
                strokeWidth={1.6}
                strokeLinecap="round"
                className="motion-safe:transition-[stroke-dasharray] motion-safe:duration-300 motion-safe:ease-out"
              />
            </svg>

            {/* The header sits INSIDE the band, top left, at the design's 48.53%.
            DO NOT CAP THAT WIDTH: at ~430px the headline stops fitting on two
            lines, wraps to four, grows down the band and lands on station 02's
            photograph. */}
            <div className="absolute left-0 top-0 z-[2] w-[48.53%]">
              <SectionTitle
                id="one-life-heading"
                eyebrow="One life. One DNA."
                tone="dark"
                eyebrowTone="teal"
                // 15.644 under the pill here against the 11.378 the rest of the
                // page uses - the design gives this one section the wider gap.
                headingClassName="mt-[clamp(15.6px,1.527vw,24.4px)]"
              >
                Before you knew yourself, <em>your genes were already there.</em>
              </SectionTitle>
            </div>

            {STATIONS.map((s) => {
              const lit = s.cx / 100 <= fill;
              return (
                <div key={s.n}>
                  {/* A watermark, not a label: centred on the station rather than on
                  its photograph, and behind both. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute -translate-x-1/2 text-center font-kyg font-bold leading-none tracking-[-0.04em]',
                      'transition-colors duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                      lit ? 'text-white/[0.09]' : 'text-white/[0.05]',
                      SIZE.numeral
                    )}
                    style={{ left: `${s.cx}%`, top: `${s.top + OFFSET.numeral}%`, width: `${NUMERAL_W}%` }}
                  >
                    {s.n}
                  </span>

                  {/* The plate takes its height from the stage and its width from
                  the design's own 135.111:93.867, so it cannot be re-cropped by
                  a change to the band's proportions. */}
                  <div
                    className={cn(
                      'absolute aspect-[135/94] -translate-x-1/2 overflow-hidden rounded-sm',
                      'transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                      lit
                        ? 'scale-[1.06] opacity-100 shadow-[0_18px_44px_-12px_rgba(42,195,162,0.45)] ring-1 ring-inset ring-java2/[0.45]'
                        : 'scale-100 opacity-[0.72] ring-1 ring-inset ring-white/[0.14]'
                    )}
                    style={{ left: `${s.cx}%`, top: `${s.top}%`, height: '22%' }}
                  >
                    <Image
                      src={s.photo}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 1599px) 14vw, 224px"
                      className="object-cover"
                    />
                  </div>

                  <Node
                    icon={s.icon}
                    lit={lit}
                    className="absolute z-[1] -translate-x-1/2"
                    style={{ left: `${s.cx}%`, top: `${s.top + OFFSET.node}%` }}
                  />

                  <p
                    className={cn(
                      'absolute -translate-x-1/2 text-center font-kyg font-bold leading-[1.389] tracking-[-0.015em]',
                      'transition-colors duration-500 motion-reduce:transition-none',
                      lit ? 'text-white' : 'text-white/70',
                      SIZE.title
                    )}
                    style={{ left: `${s.cx}%`, top: `${s.top + OFFSET.title}%`, width: `${TEXT_W}%` }}
                  >
                    {s.title}
                  </p>
                  <p
                    className={cn(
                      'absolute -translate-x-1/2 text-center font-kyg font-normal leading-[1.448] text-white/[0.58]',
                      SIZE.line
                    )}
                    style={{ left: `${s.cx}%`, top: `${s.top + OFFSET.line}%`, width: `${TEXT_W}%` }}
                  >
                    {s.line}
                  </p>
                </div>
              );
            })}

            {/* Bottom right, flush with the band's last line - the design ends on
            the CTA rather than opening a new row for it. */}
            <div className="absolute bottom-0 right-0 z-[2]">
              <Button href="/categories" variant="onDark">
                Explore Genetic Testing
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Below lg: the same five stations as a vertical list. ──────────── */}
      <div className="lg:hidden">
        <SectionTitle id="one-life-heading-sm" eyebrow="One life. One DNA." tone="dark" eyebrowTone="teal">
          Before you knew yourself, <em>your genes were already there.</em>
        </SectionTitle>

        <ol className="mt-[clamp(20px,4vw,40px)] grid list-none gap-[18px] sm:grid-cols-2">
          {STATIONS.map((s) => (
            <li
              key={s.n}
              className="flex min-w-0 flex-col rounded-sm bg-linenw/[0.045] p-[16px] ring-1 ring-inset ring-linenw/[0.1]"
            >
              <div className="relative mb-[14px] aspect-[135/94] w-full overflow-hidden rounded-sm">
                <Image src={s.photo} alt={s.alt} fill sizes="(max-width: 639px) 100vw, 50vw" className="object-cover" />
              </div>
              <Node icon={s.icon} className="h-[38px] w-[38px] [&>svg]:h-[17px] [&>svg]:w-[17px]" />
              <h3 className="mt-[12px] font-kyg text-[16px] font-bold leading-[1.3] tracking-[-0.015em] text-white">
                {s.title}
              </h3>
              <p className="mt-[5px] font-kyg text-[14px] leading-[1.5] text-white/[0.58]">{s.line}</p>
            </li>
          ))}
        </ol>

        <div className="mt-[clamp(18px,3vw,32px)] flex">
          <Button href="/categories" variant="onDark" block>
            Explore Genetic Testing
          </Button>
        </div>
      </div>
    </Section>
  );
}
