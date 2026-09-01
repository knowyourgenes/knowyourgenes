'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Icon, Lead, Rule, Section, SectionTitle } from '../ui';

/** The four "this is for…" lines, in source order. */
const AUDIENCE = [
  'To someone discovering personalized wellness at 25.',
  'To a couple planning their future.',
  'To a family trying to understand what runs through generations.',
  'To someone simply curious about where they came from.',
];

/**
 * Points scattered across the map. Normalised 0-1 against the artwork, so they
 * hold their positions at every size. They say "across India" and nothing more
 * specific - there are no city labels because the codebase makes no city claims.
 */
const POINTS: [number, number, number][] = [
  [0.31, 0.25, 5],
  [0.44, 0.33, 3],
  [0.5, 0.41, 3.5],
  [0.58, 0.44, 4.5],
  [0.63, 0.35, 3],
  [0.8, 0.33, 3],
  [0.26, 0.34, 3],
  [0.22, 0.43, 3.5],
  [0.3, 0.52, 5],
  [0.42, 0.48, 3],
  [0.38, 0.61, 3.5],
  [0.47, 0.68, 3],
  [0.34, 0.74, 4.5],
  [0.55, 0.55, 3],
  [0.37, 0.85, 3.5],
];

/**
 * The four points the four lines speak to.
 *
 * NOT AN ARBITRARY PAIRING, and not a new one: the map already draws exactly
 * four points with rings around them - the r >= 4.5 entries above - against
 * eleven plain dots, and there are exactly four lines. The ringed four were
 * always the emphasised ones; hovering a line just says which is which.
 *
 * Derived rather than written out, so moving a point in POINTS cannot leave a
 * hand-copied index behind pointing at the wrong place on the map.
 */
const RINGED = POINTS.reduce<number[]>((acc, [, , r], i) => (r >= 4.5 ? [...acc, i] : acc), []);

export default function BornInIndia({
  chevrons = false,
  /**
   * Light the paired map point when a line is hovered.
   *
   * Decoration, deliberately: the points carry no labels and the map is
   * aria-hidden, so nothing here is information a pointer is required to reach.
   * The lines are not controls and are not focusable - if they ever become
   * links, this wants to answer to focus as well as hover.
   */
  linkedMap = false,
  /**
   * Place the section the way the design draws it rather than the way it was
   * built. Four differences, all measured off node 142:2583 at 1024:
   *
   *   - "Genetics belongs to everyone." sits OPPOSITE the headline, not under
   *     it. That one line is why the head row is a row at all.
   *   - the map takes 369.778 of the 967.111 rail against the audience column's
   *     554.666, a 0.667 : 1 split. It was a flat 520px, which is the right
   *     width at exactly one viewport and too wide at every other.
   *   - the chips are 12.444px type in a 14.2 / 12.8 / 15.6 box. They were
   *     17px in a 20 / 22 box - half again too big, which is what pushed the
   *     ambition line off the bottom of the section.
   *   - the closing couplet and its rule take the design's 32.7 / 21.3.
   */
  designPlacement = false,
}: { chevrons?: boolean; linkedMap?: boolean; designPlacement?: boolean } = {}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Section id="born-in-india" ground="ink" labelledBy="india-heading">
      <SectionTitle
        id="india-heading"
        eyebrow="Born in India"
        tone="dark"
        asideAlign="top"
        aside={
          designPlacement ? (
            // 17.067 / 24.889 on linenw at 78%, and it does not wrap: the design
            // sets it as one line opposite the headline.
            <p className="font-kyg text-[clamp(17.1px,1.667vw,26.7px)] font-normal leading-[1.459] tracking-[-0.015em] text-linenw/[0.78] lg:whitespace-nowrap">
              Genetics belongs to everyone.
            </p>
          ) : undefined
        }
      >
        Born in India. <em>Built for every body.</em>
      </SectionTitle>

      {!designPlacement ? (
        <Lead tone="dark" className="mt-[18px] text-[clamp(19px,1.45vw,24px)] leading-[1.46] tracking-[-0.015em]">
          Genetics belongs to everyone.
        </Lead>
      ) : null}

      <div
        className={cn(
          'grid items-stretch',
          designPlacement
            ? // 42.667 between the columns, 39.822 above the row
              'mt-[clamp(39.8px,3.889vw,62.2px)] gap-[clamp(42.7px,4.166vw,66.7px)] lg:grid-cols-[minmax(0,0.667fr)_minmax(0,1fr)]'
            : 'mt-[clamp(18px,min(3.7vw,3.6vh),52px)] gap-[clamp(24px,3vw,60px)] lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]'
        )}
      >
        {/* The map panel. `map-india-teal.png` is the fully opaque export - the
            pale `map-india.png` beside it in that folder is low-alpha artwork for
            LIGHT grounds and is invisible here whatever opacity it is given. */}
        <div className="relative grid min-h-[300px] place-items-center overflow-hidden rounded-sm bg-linenw/[0.035] ring-1 ring-inset ring-linenw/[0.11]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(42,195,162,0.16),transparent_68%)]"
          />
          <div className="relative aspect-square w-[min(78%,340px)]">
            <Image
              src="/home/brand/map-india-teal.png"
              alt="Map of India"
              fill
              sizes="340px"
              className="object-contain [filter:brightness(1.6)_saturate(1.35)]"
            />
            {POINTS.map(([x, y, r], i) => {
              // Which line this point answers to, or -1 for the eleven that
              // answer to none.
              const paired = RINGED.indexOf(i);
              const lit = linkedMap && paired !== -1 && paired === hovered;
              return (
                <span key={i} className="absolute" style={{ left: `${x * 100}%`, top: `${y * 100}%` }}>
                  {r >= 4.5 ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute rounded-full ring-1 transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                        lit ? 'scale-[1.7] ring-java2' : 'scale-100 ring-eden/55'
                      )}
                      style={{ width: r * 5, height: r * 5, left: -r * 2.5, top: -r * 2.5 }}
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute rounded-full transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                      lit ? 'scale-[1.5] bg-java2 shadow-[0_0_14px_2px_rgba(42,195,162,0.75)]' : 'scale-100 bg-eden'
                    )}
                    style={{ width: r * 2, height: r * 2, left: -r, top: -r, opacity: r >= 4.5 ? 1 : 0.66 }}
                  />
                </span>
              );
            })}
          </div>
        </div>

        {/* The four lines as a set you pick from, rather than four dashes on
            hairlines. The first is shown selected. */}
        <div className="flex min-w-0 flex-col">
          <ul className={cn('grid list-none', designPlacement ? 'gap-[clamp(8.5px,0.833vw,13.3px)]' : 'gap-[12px]')}>
            {AUDIENCE.map((line, i) => (
              <li
                key={line}
                onMouseEnter={linkedMap ? () => setHovered(i) : undefined}
                onMouseLeave={linkedMap ? () => setHovered(null) : undefined}
                className={cn(
                  'group/line flex items-center rounded-sm ring-1 ring-inset',
                  // the design's 14.222 / 12.8 / 15.644 box and its 9.956 gap
                  designPlacement
                    ? 'gap-[clamp(9.9px,0.972vw,15.6px)] py-[clamp(15.6px,1.527vw,24.4px)] pl-[clamp(14.2px,1.389vw,22.2px)] pr-[clamp(12.8px,1.25vw,20px)]'
                    : 'gap-[14px] px-[20px] py-[22px]',
                  // NOTHING IS SELECTED AT REST once the map is linked. The
                  // design shows line 01 highlighted, which reads as a choice
                  // already made on your behalf - and with the map answering to
                  // hover it also lit a point nobody was pointing at. All four
                  // start equal and the highlight follows the cursor.
                  linkedMap || i !== 0 ? 'bg-linenw/[0.045] ring-linenw/[0.1]' : 'bg-java2/[0.14] ring-java2/[0.42]',
                  // The lift is the page's own card hover (DESIGN.md §5), one
                  // step quieter: these are lines you read, not cards you open,
                  // so they rise 2px rather than the 3 a real card takes.
                  linkedMap && [
                    'transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                    'hover:-translate-y-[2px] hover:bg-java2/[0.14] hover:ring-java2/[0.42]',
                  ]
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'shrink-0 rounded-full',
                    // 5.689 square, against the 8 it was drawn at
                    designPlacement ? 'h-[clamp(5.7px,0.556vw,8.9px)] w-[clamp(5.7px,0.556vw,8.9px)]' : 'h-2 w-2',
                    linkedMap || i !== 0 ? 'bg-linenw/30' : 'bg-java2',
                    // The bullet answers with the map: same java2, same moment.
                    linkedMap &&
                      'transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/line:scale-[1.4] group-hover/line:bg-java2 group-hover/line:shadow-[0_0_10px_1px_rgba(42,195,162,0.7)] motion-reduce:transition-none'
                  )}
                />
                <span
                  className={cn(
                    // The weight does NOT change on hover - going medium to
                    // semibold reflows the line under the cursor.
                    'min-w-0 font-kyg leading-[1.486]',
                    // 12.444, not 17 - the single biggest reason this column
                    // outgrew the map beside it
                    designPlacement ? 'text-[clamp(12.4px,1.215vw,19.4px)]' : 'text-[17px] leading-[1.5]',
                    linkedMap || i !== 0 ? 'font-medium text-linenw/80' : 'font-semibold text-linenw',
                    linkedMap &&
                      'transition-colors duration-500 group-hover/line:text-linenw motion-reduce:transition-none'
                  )}
                >
                  {line}
                </span>
                {/* Trailing chevron. Decorative - these four are a set you read,
                    not links, so the glyph must not suggest four destinations
                    to a screen reader. `Icon` is aria-hidden by construction. */}
                {chevrons ? (
                  <Icon
                    name="chevron"
                    strokeWidth={2}
                    className={cn(
                      'shrink-0',
                      designPlacement
                        ? 'h-[clamp(12.1px,1.181vw,18.9px)] w-[clamp(12.1px,1.181vw,18.9px)]'
                        : 'h-[17px] w-[17px]',
                      linkedMap || i !== 0 ? 'text-linenw/40' : 'text-java2',
                      // 3px, the same nudge every arrow on the page takes.
                      linkedMap &&
                        'transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/line:translate-x-[3px] group-hover/line:text-java2 motion-reduce:transition-none'
                    )}
                  />
                ) : null}
              </li>
            ))}
          </ul>

          <Lead
            tone="dark"
            className={cn(
              designPlacement
                ? 'mt-[clamp(19.9px,1.944vw,31.1px)] text-[clamp(12.8px,1.25vw,20px)] leading-[1.622] text-linenw/[0.62]'
                : 'mt-[28px] max-w-[56ch] text-[17px]'
            )}
          >
            Our ambition is to make genetic science more understandable, responsible and accessible.
          </Lead>
        </div>
      </div>

      <Rule
        tone="dark"
        className={cn(designPlacement ? 'mt-[clamp(32.7px,3.194vw,51.1px)]' : 'mt-[clamp(16px,min(3.6vw,3vh),46px)]')}
      />

      {/* The couplet as a full-width footer. Stacked and touching (which is what
          the old build did) the second line read as an orphan; opposite each
          other across the rail they land as an ending. */}
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-[20px]',
          designPlacement ? 'mt-[clamp(21.3px,2.083vw,33.3px)]' : 'mt-[30px]'
        )}
      >
        <p
          className={cn(
            'font-kyg font-light leading-[1.167] tracking-[-0.028em] text-linenw',
            designPlacement ? 'text-[clamp(25.6px,2.5vw,40px)]' : 'text-[clamp(22px,2.4vw,36px)]'
          )}
        >
          India is where we begin.
        </p>
        <p
          className={cn(
            'font-tst font-semibold italic leading-[1.333] text-java2',
            designPlacement ? 'text-[clamp(19.2px,1.875vw,30px)]' : 'text-[clamp(18px,1.8vw,27px)]'
          )}
        >
          The world is where we&rsquo;re going.
        </p>
      </div>
    </Section>
  );
}
