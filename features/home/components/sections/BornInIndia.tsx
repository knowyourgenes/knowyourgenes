import Image from 'next/image';

import { Lead, Rule, Section, SectionTitle } from '../ui';

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

export default function BornInIndia() {
  return (
    <Section id="born-in-india" ground="ink" labelledBy="india-heading">
      <SectionTitle id="india-heading" eyebrow="Born in India" tone="dark">
        Born in India. <em>Built for every body.</em>
      </SectionTitle>

      <Lead tone="dark" className="mt-[18px] text-[clamp(19px,1.45vw,24px)] leading-[1.46] tracking-[-0.015em]">
        Genetics belongs to everyone.
      </Lead>

      <div className="mt-[clamp(18px,min(3.7vw,3.6vh),52px)] grid items-stretch gap-[clamp(24px,3vw,60px)] lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)]">
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
            {POINTS.map(([x, y, r], i) => (
              <span key={i} className="absolute" style={{ left: `${x * 100}%`, top: `${y * 100}%` }}>
                {r >= 4.5 ? (
                  <span
                    aria-hidden="true"
                    className="absolute rounded-full ring-1 ring-eden/55"
                    style={{ width: r * 5, height: r * 5, left: -r * 2.5, top: -r * 2.5 }}
                  />
                ) : null}
                <span
                  aria-hidden="true"
                  className="absolute rounded-full bg-eden"
                  style={{ width: r * 2, height: r * 2, left: -r, top: -r, opacity: r >= 4.5 ? 1 : 0.66 }}
                />
              </span>
            ))}
          </div>
        </div>

        {/* The four lines as a set you pick from, rather than four dashes on
            hairlines. The first is shown selected. */}
        <div className="flex min-w-0 flex-col">
          <ul className="grid list-none gap-[12px]">
            {AUDIENCE.map((line, i) => (
              <li
                key={line}
                className={
                  i === 0
                    ? 'flex items-center gap-[14px] rounded-sm bg-java2/[0.14] px-[20px] py-[22px] ring-1 ring-inset ring-java2/[0.42]'
                    : 'flex items-center gap-[14px] rounded-sm bg-linenw/[0.045] px-[20px] py-[22px] ring-1 ring-inset ring-linenw/[0.1]'
                }
              >
                <span
                  aria-hidden="true"
                  className={
                    i === 0 ? 'h-2 w-2 shrink-0 rounded-full bg-java2' : 'h-2 w-2 shrink-0 rounded-full bg-linenw/30'
                  }
                />
                <span
                  className={
                    i === 0
                      ? 'min-w-0 font-kyg text-[17px] font-semibold leading-[1.5] text-linenw'
                      : 'min-w-0 font-kyg text-[17px] font-medium leading-[1.5] text-linenw/80'
                  }
                >
                  {line}
                </span>
              </li>
            ))}
          </ul>

          <Lead tone="dark" className="mt-[28px] max-w-[56ch] text-[17px]">
            Our ambition is to make genetic science more understandable, responsible and accessible.
          </Lead>
        </div>
      </div>

      <Rule tone="dark" className="mt-[clamp(16px,min(3.6vw,3vh),46px)]" />

      {/* The couplet as a full-width footer. Stacked and touching (which is what
          the old build did) the second line read as an orphan; opposite each
          other across the rail they land as an ending. */}
      <div className="mt-[30px] flex flex-wrap items-center justify-between gap-[20px]">
        <p className="font-kyg text-[clamp(22px,2.4vw,36px)] font-light leading-[1.16] tracking-[-0.028em] text-linenw">
          India is where we begin.
        </p>
        <p className="font-tst text-[clamp(18px,1.8vw,27px)] font-semibold italic leading-[1.2] text-java2">
          The world is where we&rsquo;re going.
        </p>
      </div>
    </Section>
  );
}
