import Image from 'next/image';

import { cn } from '@/lib/utils';
import { Button, PHOTO, Section, SectionTitle } from '../ui';

/**
 * The six questions, in the order the section asks them.
 *
 * They are a GRID, not a ladder. The old build indented each row by a further
 * `clamp(7px,1.5vw,32px)` so the six stepped diagonally across the rail; at the
 * one width where that read as intentional it also pushed question six clear of
 * the portrait beside it, and everywhere else it read as a rendering fault.
 */
const QUESTIONS = [
  { n: '01', q: 'Why does my body respond differently?' },
  { n: '02', q: 'What have I inherited?' },
  { n: '03', q: 'Could I pass something on?' },
  { n: '04', q: 'What does my family history mean for me?' },
  { n: '05', q: 'Where did I come from?' },
  { n: '06', q: 'How am I aging?' },
];

/**
 * EVERY MEASUREMENT HERE IS READ OFF THE DESIGN AND WRITTEN AS A SHARE OF THE
 * RAIL, never as a fixed pixel value.
 *
 * The design exists at two artboards - 1440 and 1024 - and the second is the
 * first at 71.1%. So a value that is correct at both is a ratio, and expressing
 * it in vw is what makes the browser reproduce the whole ladder between them
 * and above them. Fixed pixels were the bug in the previous pass: a 375px
 * portrait column is right at 1440 and 40% too wide on the 1600 rail the
 * Container caps at, which dragged the board's height with it.
 *
 * The ceilings are the same ratios taken to 1600, since that is where the rail
 * stops growing.
 */
export default function WhyGeneticTesting() {
  return (
    <Section id="why-genetic-testing" ground="cream" labelledBy="why-heading">
      <SectionTitle
        id="why-heading"
        eyebrow="Why genetic testing?"
        aside={
          <div>
            {/* 56 x 2 at 1440, nevada at 50% - not eden */}
            <span aria-hidden="true" className="block h-[2px] w-[clamp(39.8px,3.889vw,62px)] rounded-sm bg-nevada/50" />
            <p className="mt-[clamp(12.8px,1.25vw,20px)] font-kyg text-[clamp(16.4px,1.597vw,25.5px)] font-light leading-[1.404] tracking-[-0.02em] text-nevada">
              Your DNA may not answer every question.
              <b className="block font-tst text-[1.13em] font-semibold italic leading-[1.405] tracking-normal text-eden">
                But it can help you ask better ones.
              </b>
            </p>
          </div>
        }
      >
        Some questions are worth asking <em>before life asks them for you.</em>
      </SectionTitle>

      {/* ONE BOARD, not a picture beside a list. The portrait is flush inside the
          same bordered box as the six cells, and the cell borders are what draw
          the grid - which is why they are hairlines on every edge rather than
          the tapered top rules the rest of the page uses. Taper them here and
          the box stops reading as a box.

          The portrait is 266.67 of a 967 rail at 1024 and 375 of 1360 at 1440 -
          27.57% in both. */}
      <div className="mt-[clamp(31.3px,3.056vw,49px)] overflow-hidden rounded-sm border border-zeus/[0.13] lg:grid lg:grid-cols-[27.57%_minmax(0,1fr)]">
        {/* The source is a 3:4 portrait being cropped into a box wider than it is
            tall, so a centred crop takes the top of her head off. The subject
            sits high in the frame - hold the crop near the top. */}
        <div className="relative aspect-[375/330] w-full lg:aspect-auto lg:h-full">
          <Image
            src={PHOTO.why}
            alt="A woman looking towards a window in warm daylight"
            fill
            sizes="(max-width: 1023px) 100vw, 28vw"
            className="object-cover object-[50%_12%]"
          />
        </div>

        <ul className="grid list-none grid-cols-1 sm:grid-cols-2">
          {QUESTIONS.map((item, i) => (
            <li
              key={item.n}
              className={cn(
                // a row is 79.93 of 1024 and 112.4 of 1440 - 7.806vw in both
                'flex min-h-[clamp(79.9px,7.806vw,125px)] min-w-0 flex-col justify-center',
                'gap-[clamp(7.1px,0.694vw,11.1px)]',
                // the design's 26 / 26 / 30 / 26
                'px-[clamp(18.5px,1.806vw,28.9px)] pb-[clamp(21.3px,2.083vw,33.3px)] pt-[clamp(18.5px,1.806vw,28.9px)]',
                // every cell takes a left edge, which is also what separates the
                // first column from the portrait
                'border-zeus/[0.13] sm:border-l',
                // a top edge on every cell except the first of its row - the
                // board's own border already draws the line above row one, and
                // which cells start a row changes with the column count
                i > 0 ? 'border-t' : null,
                i === 1 ? 'sm:border-t-0' : null
              )}
            >
              {/* Figtree 500 at 0.16em on boulder - NOT bold, and not pewter */}
              <span className="font-kyg text-[clamp(8.2px,0.799vw,12.8px)] font-medium uppercase leading-[1.48] tracking-[0.16em] text-boulder">
                {item.n}
              </span>
              {/* Figtree 400 - the questions are read, not shouted */}
              <p className="font-kyg text-[clamp(13.5px,1.319vw,21.1px)] font-normal leading-[1.405] tracking-[-0.005em] text-heavy">
                {item.q}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* 30 under the board at 1440, 21.3 at 1024 */}
      <div className="mt-[clamp(21.3px,2.083vw,33.3px)] flex">
        <Button href="/categories">Explore Genetic Testing</Button>
      </div>
    </Section>
  );
}
