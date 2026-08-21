// =============================================================================
// Homepage - SECTION 04 · WHY GENETIC TESTING · the ladder
// -----------------------------------------------------------------------------
// Ported from the designer's hand-built page ("New Homepage Build/index.html"):
// CSS section 09 (lines 657-713) and the markup at line 1460. That page is the
// executable design the Figma frame was traced from, so where the two disagreed
// the page won - which is why the headline no longer carries authored <br>s and
// the ladder's indent is now a fluid step rather than six fixed pixel widths.
//
// TWO SHELLS, stacked:
//   1  a 0.82fr / 1.18fr grid - a STICKY side column (kicker, two-voice
//      headline, portrait) beside the six-rung question ladder. The column
//      sticks at header + 44 so the questions scroll past a held headline; that
//      is the whole point of the section and it is why the ladder is long.
//   2  the pull-quote and its CTA, 1.35fr / 0.65fr, bottom-aligned.
//
// THE LADDER IS A STAIRCASE. Each question is indented one --step further than
// the one above (`margin-left: var(--i) * var(--step)`, step = clamp(7,1.5vw,32))
// and a teal hairline is drawn back across that indent from the text's left edge
// - so the questions literally walk right down the page with a leader line
// trailing each one. The indent is fluid, not fixed: at 1440 it is 21.6px per
// step, which is exactly the 0 / 21.6 / 43.2 / 64.8 / 86.4 / 108 series the
// frame was measured at. Reproducing it as six literal class pairs is deliberate
// - Tailwind only sees class strings it can read in the file, so a margin class
// assembled at runtime from the row index would compile to nothing.
//
// Two voices in the headline, as everywhere on this page: Figtree 400 states it,
// Cormorant Garamond 500 italic (1.1em, tracking reset to 0 - the serif runs
// small and tight) turns it. The pull quote closes with the same pairing at 600.
// =============================================================================

import { cn } from '@/lib/utils';

import { Reveal } from '../motion';
import { AssetSlot, Cta, Heading, Kicker, PHOTO, Section } from '../ui';

/**
 * The source's `.fade-t` / `.fade-b`: rules on this page never run edge to edge,
 * they hold full strength to 34% and are gone by 92%. Written as a border-image
 * (which is what the source uses) rather than a gradient pseudo-element, so the
 * rule still belongs to the box and cannot drift out of alignment with it.
 *
 * The transparent border colour it is always paired with is not decoration -
 * border-image needs a border WIDTH to paint into, and without a see-through
 * fallback colour the plain border shows as a hard line wherever border-image
 * fails.
 */
const FADE_RULE =
  '[border-image:linear-gradient(90deg,rgba(27,23,18,0.11)_0%,rgba(27,23,18,0.11)_34%,rgba(27,23,18,0)_92%)_1]';

type Rung = {
  n: string;
  q: string;
  /** the source's `--rd`, in seconds - the reveal stagger down the ladder */
  rd: number;
  /** `margin-left: var(--i) * var(--step)` for this rung */
  indent: string;
  /** the leader line's width - always identical to `indent`, see below */
  leader: string;
};

/**
 * The six questions, top to bottom. `indent` and `leader` MUST stay equal: the
 * leader is drawn from the question's left edge back across exactly the indent
 * it was pushed by, so the line always lands on the rung above's left edge.
 */
const QUESTIONS: Rung[] = [
  { n: '01', q: 'Why does my body respond differently?', rd: 0.02, indent: 'ml-0', leader: 'w-0' },
  {
    n: '02',
    q: 'What have I inherited?',
    rd: 0.08,
    indent: 'ml-[clamp(7px,1.5vw,32px)]',
    leader: 'w-[clamp(7px,1.5vw,32px)]',
  },
  {
    n: '03',
    q: 'Could I pass something on?',
    rd: 0.14,
    indent: 'ml-[calc(2*clamp(7px,1.5vw,32px))]',
    leader: 'w-[calc(2*clamp(7px,1.5vw,32px))]',
  },
  {
    n: '04',
    q: 'What does my family history mean for me?',
    rd: 0.2,
    indent: 'ml-[calc(3*clamp(7px,1.5vw,32px))]',
    leader: 'w-[calc(3*clamp(7px,1.5vw,32px))]',
  },
  {
    n: '05',
    q: 'Where did I come from?',
    rd: 0.26,
    indent: 'ml-[calc(4*clamp(7px,1.5vw,32px))]',
    leader: 'w-[calc(4*clamp(7px,1.5vw,32px))]',
  },
  {
    n: '06',
    q: 'How am I aging?',
    rd: 0.32,
    indent: 'ml-[calc(5*clamp(7px,1.5vw,32px))]',
    leader: 'w-[calc(5*clamp(7px,1.5vw,32px))]',
  },
];

export default function WhyGeneticTesting() {
  return (
    <Section
      // Hero's scroll cue links to #why-genetic-testing, so this id is a live
      // anchor target - it stays as it is even though the source calls it #why.
      id="why-genetic-testing"
      ground="cream"
      // frame pad is 144 top and bottom (10vw at 1440). The source's --sp-sec is
      // clamp(84px,10vw,168px); the two agree exactly at the 1440 design width
      // and this is the value every other section on the page carries, so the
      // page's vertical rhythm stays uniform at the clamp extremes.
      innerClassName="py-[clamp(84px,10vw,168px)]"
    >
      {/* ---- shell 1 · sticky side column + the ladder ----------------------
          align-items:center on the row, align-self:start on the column: the
          column must NOT stretch to the ladder's height, or sticky has no slack
          to travel through and the headline just scrolls away with the
          questions. */}
      <div className="grid grid-cols-1 items-center gap-[clamp(30px,4vw,84px)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <Reveal
          variant="left"
          // sticks at --hdr-h (92) + 44. Desktop only - the source drops back to
          // position:static below 900px, where the column sits above the ladder
          // and there is nothing left for it to stick to.
          className="self-start lg:sticky lg:top-[136px]"
        >
          <Kicker tone="eden" className="mb-[clamp(22px,2.2vw,32px)]">
            Why genetic testing?
          </Kicker>

          {/* 13ch is the source's own measure. It is a hard, narrow column on
              purpose: the headline stacks into five short lines beside the
              ladder rather than running level with it. */}
          <Heading
            html="Some questions are worth asking <em>before life asks them for you.</em>"
            className="max-w-[13ch] text-[clamp(31px,3.5vw,55px)] tracking-[-0.03em] text-balance [&_em]:text-[1.1em]"
          />

          {/* 330 wide at 4:5, radius 24, the warm --sh-1 elevation. Hidden below
              900 in the source: at one column the portrait would sit between the
              headline and the first question and break the ladder's run. */}
          <AssetSlot
            title="Editorial Portrait"
            meta="Woman in her thirties, mid-thought, window light · 900 × 1120 · 4:5"
            path="assets/why-portrait.jpg"
            photo={PHOTO.why}
            alt="A woman pausing mid-morning, thinking about a question"
            // 0px below lg so a phone never downloads a plate it cannot see
            sizes="(max-width: 1023px) 0px, 330px"
            className="mt-[clamp(26px,3vw,42px)] hidden aspect-[4/5] w-full max-w-[330px] rounded-sm shadow-[0_1px_2px_0_rgba(45,32,18,0.05),0_4px_14px_0_rgba(45,32,18,0.05)] lg:block"
          />
        </Reveal>

        <ol
          aria-label="Questions genetic testing can help you ask"
          className={cn('list-none border-t border-transparent', FADE_RULE)}
        >
          {QUESTIONS.map((rung) => (
            // The reveal lives on the <li> and the ROW lives on an inner div.
            // They cannot share an element: Reveal writes an inline
            // `transition: opacity …, transform …`, and an inline transition
            // replaces the class-based one wholesale - the row's background
            // fade would silently never run.
            <Reveal key={rung.n} as="li" delay={rung.rd} className={cn('border-b border-transparent', FADE_RULE)}>
              <div className="group grid grid-cols-[46px_minmax(0,1fr)_26px] items-baseline gap-x-4 gap-y-0 py-[clamp(15px,1.6vw,22px)] pl-[4px] pr-[8px] transition-colors duration-[770ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[rgba(14,77,75,0.035)]">
                {/* Hind 600 at 15/1.62. The tabular figures keep every numeral
                    on one vertical stem, so the ladder reads as a measured
                    scale rather than a list. */}
                <span className="font-kyg-num text-[15px] font-semibold leading-[1.62] tracking-[0.06em] text-pewter tabular-nums transition-colors duration-[510ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-eden">
                  {rung.n}
                </span>

                {/* Tailwind v4 compiles translate-x/scale to the standalone
                    `translate` / `scale` properties, NOT to `transform`, so the
                    transitions below name those properties. Transitioning
                    `transform` here (which is what the source CSS says) would
                    animate nothing at all. */}
                <span
                  className={cn(
                    'relative min-w-0 font-kyg text-[clamp(20px,2.05vw,30px)] font-medium leading-[1.24] tracking-[-0.024em] text-bistre',
                    '[transition:translate_0.7s_cubic-bezier(0.22,1,0.36,1),color_0.51s_cubic-bezier(0.22,1,0.36,1)]',
                    'group-hover:translate-x-[6px] group-hover:text-eden',
                    rung.indent
                  )}
                >
                  {/* the leader: the source's .lad__q::before, as a real child
                      so it inherits the question's font-size. right:100% pins it
                      to the text's left edge and it runs back across the indent
                      - being inside the question is what makes it travel with
                      the 6px hover shift instead of detaching. Its top offset is
                      .66em of the question's own size, i.e. the text's optical
                      centre. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute right-full top-[0.66em] h-px bg-eden opacity-[0.22] transition-opacity duration-[580ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-60',
                      rung.leader
                    )}
                  />
                  {rung.q}
                </span>

                {/* the 7px dot parked at the end of every rung */}
                <span
                  aria-hidden="true"
                  className="h-[7px] w-[7px] self-center justify-self-end rounded-full bg-eden opacity-[0.14] [transition:opacity_0.58s_cubic-bezier(0.22,1,0.36,1),scale_0.64s_cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.35] group-hover:opacity-100"
                />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* ---- shell 2 · the pull quote ---------------------------------------
          No rule above it - the gap alone (96 margin + 46 pad at 1440) carries
          the beat, and the 56x2 tick inside the quote marks it instead. */}
      <Reveal className="mt-[clamp(52px,6vw,96px)] grid grid-cols-1 items-start gap-[clamp(26px,3vw,52px)] pt-[clamp(30px,3vw,46px)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:items-end">
        <blockquote className="font-kyg text-[clamp(25px,2.9vw,44px)] font-light leading-[1.16] tracking-[-0.03em] text-balance text-nevada">
          <span
            aria-hidden="true"
            className="mb-[clamp(20px,2.2vw,30px)] block h-[2px] w-[56px] rounded-sm bg-eden opacity-50"
          />
          Your DNA may not answer every question.
          {/* Cormorant 600 italic at 1.1em, teal, on its own line. The source
              stacks two rules on this <b> at equal specificity, so the later
              one's 600 beats the shared serif rule's 500 - it is a shade
              heavier than every other italic turn on the page. */}
          <b className="block font-tst text-[1.1em] font-semibold italic tracking-normal text-eden">
            But it can help you ask better ones.
          </b>
        </blockquote>

        <div className="lg:justify-self-end">
          <Cta
            href="/categories"
            icon="2185-1191"
            className="bg-eden text-linenw shadow-[0_6px_18px_0_rgba(14,77,75,0.18)]"
          >
            Explore Genetic Testing
          </Cta>
        </div>
      </Reveal>
    </Section>
  );
}
