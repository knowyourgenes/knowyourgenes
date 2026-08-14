// =============================================================================
// About Us - SECTION 10 · WHAT WE BELIEVE (manifesto)
// -----------------------------------------------------------------------------
// Figma frame: 1440 x 1105, ink ground (#141b1a), pad 120/220. The inner rail is
// 1000 with its own 32 -> a 936 content column, narrower than the page's usual
// 1216, so the block is re-centred inside the shared <Section> at max-w-[936px].
//
// The list is four contiguous rows (161/161/161/162) that each carry a 1px
// #faf6ef stroke; contiguous stroked rows read as horizontal rules, so they are
// built as border-t per row plus a closing border-b on the list.
//
// RADIUS TRAP: no radii here except the eyebrow's 999 -> rounded-full.
// =============================================================================

import { Body, Eyebrow, Heading, Section } from '../ui';

/**
 * Frame line 15-29 - the four manifesto statements, verbatim.
 *
 * CASE: these are textCase=AS_TYPED in the frame and must stay sentence case.
 * This section's ONLY textCase=UPPER run is the eyebrow (y=10799.7); the audit of
 * all 61 uppercase runs found nothing between it and SECTION 11 (y=11876), so the
 * four statements below render exactly as typed. Do not "match the eyebrow" here.
 */
const BELIEFS = [
  {
    n: '01',
    // "Your genes don't decide who you\nbecome."
    html: 'Your genes don\'t decide who you<br class="hidden lg:inline" /> become.',
  },
  {
    n: '02',
    // "Genetic information should inform, not\nfrighten."
    html: 'Genetic information should inform, not<br class="hidden lg:inline" /> frighten.',
  },
  {
    n: '03',
    // "Complex information should be\nunderstandable."
    html: 'Complex information should be<br class="hidden lg:inline" /> understandable.',
  },
  {
    n: '04',
    // "Prevention can mean knowing more\nbefore you need to react."
    html: 'Prevention can mean knowing more<br class="hidden lg:inline" /> before you need to react.',
  },
];

export default function Manifesto() {
  return (
    <Section
      ground="ink"
      id="what-we-believe"
      // Frame pad is 120 top/bottom, taller than the shared 92 default.
      innerClassName="py-[clamp(56px,8.3vw,120px)]"
    >
      <div className="mx-auto w-full max-w-[936px]">
        {/* ---- header (frame 'div.text-center', gap 20, centred) ------------ */}
        <div className="flex flex-col items-center gap-5 text-center">
          {/* Frame pill: pad 8/17/8/13, gap 9, glyph 19x23, label Figtree 700
              13.5/20.2 ls 1.49 - every one of those is already the shared
              <Eyebrow> default, so this carries NO local override. The old one
              re-stated the pad/type and forced the glyph into a 19x19 box, which
              letterboxed the 19x23 artwork down ~17% (min(19/19, 19/23) = 0.826)
              and made this eyebrow visibly smaller than its siblings. */}
          {/* textCase=UPPER in the frame (y=10799.7, 13.5/700, ls 1.49 = 0.11em,
              measured width 142) - it renders "WHAT WE BELIEVE", not the sentence
              case stored in `characters`. The shared <Eyebrow> already emits
              `uppercase` at exactly that tracking, so this needs no local class
              and must NOT be given a normal-case override. */}
          <Eyebrow label="What we believe" icon="10799-633" tone="ink" />

          <Heading
            as="h2"
            html={'We don\'t believe in <em class="abt-grad-ink">predicting your future.</em>'}
            // Figtree 700 50/51.5, ls -0.9 (-0.018em), #faf6ef.
            className="text-[clamp(30px,3.5vw,50px)] leading-[1.03] tracking-[-0.018em] text-linenw"
          />

          <Body
            html="We believe in helping you understand your present a little better."
            // Figtree 400 18/27, #faf6ef at 70%.
            className="mx-auto max-w-[560px] leading-[1.5] text-linenw/70"
          />
        </div>

        {/* ---- the four beliefs (frame 'div.flex', gap 64 below the header) - */}
        <ol className="mt-[clamp(40px,4.4vw,64px)] w-full list-none border-b border-linenw">
          {BELIEFS.map((belief) => (
            <li
              key={belief.n}
              className="flex items-start gap-[18px] border-t border-linenw py-8 sm:gap-[28px] lg:gap-[39px]"
            >
              {/* The frame drops the index 11px below the statement block's top in
                  all four rows (385-374, 546-535, 707-696, 867-856). */}
              <span className="mt-[6px] shrink-0 font-kyg text-[clamp(22px,2.4vw,34px)] font-semibold leading-none text-java2/50 sm:mt-[10px] lg:mt-[11px]">
                {belief.n}
              </span>
              <Heading
                as="h3"
                html={belief.html}
                // Figtree 700 46/47.8, ls -0.46 (-0.01em), #faf6ef.
                className="min-w-0 flex-1 tracking-[-0.01em] text-linenw"
              />
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
