// =============================================================================
// Homepage — SECTION 10 · GENEous CARE
// -----------------------------------------------------------------------------
// Ported from the designer's hand-built page, `New Homepage Build/index.html`:
// CSS block "15 · GENEous CARE" (~line 995) and the markup at line 1820. That
// page is the executable design the Figma frame was traced from, so where it and
// the frame disagreed, it won — the notable corrections are recorded below.
//
// Ground is `--c-cream-2` (#f5eddf), which is exactly this project's `sand`
// token, so the section takes ground="sand" rather than a hex override. Cards on
// top are linenw (--c-cream), so the whole section reads as cards floating on
// sand — that contrast IS the design, and swapping the ground for linenw would
// flatten it.
//
// RHYTHM IS MARGINS, NOT A FLEX GAP. The source spaces the five blocks with five
// DIFFERENT clamps (.kick 22→32, .lead 22, .flow 34→56 / 34→54, .care__lead
// 30→46, .care__ft 38→62 + 24→34 of padding). A single flex gap would flatten
// all of that into one number, so each block carries its own margin here.
//
// CASE TRAP: the kicker is `.kick--case`, unlike every other kicker on this
// page. "GENEous Care" is a brand lockup whose lowercase "ous" is the whole joke
// (GENE + genius); uppercasing it to "GENEOUS CARE" destroys it. The
// corroborating tell is the tracking — .03em, a quarter of the .13em the real
// UPPER kickers carry. Hence `upper={false}` on <Kicker>.
//
// RADIUS TRAP: this project remaps Tailwind's radius scale (--radius .625rem),
// so rounded-2xl is 18px and rounded-3xl is 22px. The card and its photo are
// --r-md (24), the icon badge 14, the CTA --r-xs (10); only the flow pills are
// 999. All written as explicit arbitrary values.
// =============================================================================

import { Fragment } from 'react';

import { AssetSlot, Body, Chip, Cta, Heading, Kicker, PHOTO, Section } from '../ui';
import { HomeIcon } from '../HomeIcon';
import { Reveal } from '../motion';

/** `--e-soft`, the source's easing for every settle-into-place transition. */
const E_SOFT = 'ease-[cubic-bezier(0.16,1,0.3,1)]';

/**
 * The "result → next step" progression.
 *
 * The source drives all four pills off one custom property, `--k` = 0..3:
 *
 *   background   rgba(14,77,75, .05 + k * .05)
 *   colour       color-mix(in oklab, --ink-3, --c-teal calc(k * 42%))
 *   inset ring   rgba(14,77,75, .10 + k * .12)
 *
 * and then `:last-of-type` overrides the terminal pill to solid teal on cream
 * with no ring at all. Tailwind scans raw file text, so the tints cannot be
 * computed from an index — every class has to appear literally, which is why
 * this is a table rather than a formula.
 *
 * `arrow` is the connector that FOLLOWS the pill; the last step has none.
 * Ids are frame-absolute: spec y=503 + section offset 9406 = 9909.
 */
const FLOW: { label: string; skin: string; arrow?: string }[] = [
  // k=0 mixes in 0% teal, i.e. --ink-3 untouched — that is the `nevada` token.
  { label: 'Result', skin: 'bg-eden/5 text-nevada ring-eden/10', arrow: '9909-166' },
  {
    label: 'Context',
    skin: 'bg-eden/10 text-[color:color-mix(in_oklab,#5c6b68,#0e4d4b_42%)] ring-eden/[0.22]',
    arrow: '9909-313',
  },
  {
    label: 'Understanding',
    skin: 'bg-eden/15 text-[color:color-mix(in_oklab,#5c6b68,#0e4d4b_84%)] ring-eden/[0.34]',
    arrow: '9909-511',
  },
  // `:last-of-type` — solid eden, cream label, and NO inset ring. ring-0 kills
  // the one <Chip> would otherwise inherit from the shared FLOW_PILL string.
  { label: 'Next step', skin: 'bg-eden text-linenw ring-0' },
];

/**
 * The three care offers.
 *
 * `meta` / `path` are the source's own placeholder labels and are kept even
 * though the photography has since been delivered: they are the brief for what
 * each frame must show, and re-shooting a card without them loses that.
 * `alt` is the source's own alt text, verbatim. Badge ids are spec y=949 + 9406.
 * `delay` is the source's `--rd` stagger on `.care__i`, in seconds.
 */
const CARDS: {
  icon: string;
  title: string;
  body: string;
  meta: string;
  path: string;
  photo: string;
  alt: string;
  delay: number;
}[] = [
  {
    icon: '10355-98', // ic-messages-square
    title: 'Genetic counselling',
    body: 'Support in understanding what your genetic information means.',
    meta: 'Genetic counsellor and client in conversation, warm consulting room · 960 × 600 · 16:10',
    path: 'assets/care-counselling.jpg',
    photo: PHOTO.care1,
    alt: 'A genetic counsellor talking a client through their report',
    delay: 0.02,
  },
  {
    icon: '10355-545', // ic-leaf
    title: 'Wellness guidance',
    body: 'Help in making sense of the insights relevant to you.',
    meta: 'Everyday wellness still life, fresh food and daylight · 960 × 600 · 16:10',
    path: 'assets/care-wellness.jpg',
    photo: PHOTO.care2,
    alt: 'Everyday home food and a glass of water in morning light',
    delay: 0.08,
  },
  {
    icon: '10355-992', // ic-route
    title: 'Appropriate referral',
    body: 'Referral to the appropriate healthcare professional where needed.',
    meta: 'Clinician greeting a patient at a clinic reception · 960 × 600 · 16:10',
    path: 'assets/care-referral.jpg',
    photo: PHOTO.care3,
    alt: 'A clinician welcoming a patient at a clinic door',
    delay: 0.14,
  },
];

/**
 * Shared pill geometry: pad 13/22, r999, Figtree 700 17 ls -.01em. The source
 * sets no line-height, so the pill inherits the body's 1.62 and lands at 53.5px
 * tall; min-h-[54px] pins that so a wrapped row stays on one baseline grid.
 */
const FLOW_PILL =
  'min-h-[54px] rounded-full border-0 px-[22px] py-[13px] text-[17px] font-bold leading-[1.62] tracking-[-0.01em] ring-1 ring-inset ' +
  'transition-transform duration-640 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-[3px] motion-reduce:transition-none';

export default function GeneousCare() {
  return (
    <Section
      id="geneous-care"
      ground="sand"
      // `.sec` is padding-block:var(--sp-sec) = clamp(84px,10vw,168px), taller
      // than the Section default 56→94.
      innerClassName="py-[clamp(84px,10vw,168px)]"
    >
      {/* ---- header: kicker / two-voice headline / lead ------------------- */}
      <Reveal as="header">
        {/* `.kick--case` — see the CASE TRAP note in the header block. 1.25vw
            hits the source's fixed 18px exactly at the 1440 artboard width. */}
        <Kicker tone="eden" upper={false} className="mb-[clamp(22px,2.2vw,32px)] text-[clamp(15px,1.25vw,18px)]">
          GENEous Care
        </Kicker>

        {/* Two typefaces inside one heading, exactly as the source draws it:
            Figtree 400 for the statement, then Cormorant Garamond 500 italic at
            1.1em for the turn. The serif run continues mid-line rather than
            starting a new block, so it has to be an inline <em> — <Heading>
            styles <em> as the italic serif for exactly this reason.

            NO MANUAL <br>. The source breaks this headline with `max-width:22ch`
            plus `text-wrap:balance` and nothing else; hard-coded breaks were
            landing mid-clause at the in-between widths where 22ch does not wrap
            in the same place. */}
        <Heading
          className="max-w-[22ch] text-balance text-[clamp(31px,3.5vw,55px)] font-normal tracking-[-0.03em] text-bistre [&_em]:text-[1.1em]"
          html={
            'A report shouldn’t be the end of the conversation. ' +
            '<em>It should be the beginning of a better one.</em>'
          }
        />

        {/* `.lead` at the source's inline 56ch: Figtree 400 clamp(19,1.45vw,24)
            / 1.46 ls -.015em on --ink-2 (corduroy), 22 below the headline. */}
        <Body className="mt-[22px] max-w-[56ch] text-[clamp(19px,1.45vw,24px)] leading-[1.46] tracking-[-0.015em] text-corduroy">
          Getting your results is one thing. Understanding what they mean for you is another.
        </Body>
      </Reveal>

      {/* ---- the flow row ---------------------------------------------------
          Result → Context → Understanding → Next step.

          IT WRAPS, IT DOES NOT STACK. The source is one `flex-wrap:wrap` row at
          gap 10 with the pills and arrows as flat siblings, so a narrow viewport
          breaks the sequence across lines and every arrow keeps pointing right —
          into the pill that actually follows it. An earlier version turned this
          into a column below md and rotated the arrows 90°; that reads as a
          different device, and the connectors then point at nothing on the wrap
          rows. Fragment (not a wrapper div) is what keeps the pair flat. */}
      <Reveal className="mb-[clamp(34px,3.6vw,54px)] mt-[clamp(34px,3.6vw,56px)]">
        <div role="group" aria-label="From result to next step" className="flex flex-wrap items-center gap-[10px]">
          {FLOW.map((step) => (
            <Fragment key={step.label}>
              <Chip tone="light" className={`${FLOW_PILL} ${step.skin}`}>
                {step.label}
              </Chip>
              {step.arrow ? <HomeIcon id={step.arrow} className="h-5 w-5 shrink-0 opacity-40" /> : null}
            </Fragment>
          ))}
        </div>
      </Reveal>

      {/* `.body.care__lead` — Figtree 400 18/1.66 on --ink-3 (nevada). The 70ch
          measure is the source's own override of `.body`'s default 64ch, and it
          is what produces the frame's break after "identify". */}
      <Reveal className="mb-[clamp(30px,3.4vw,46px)]">
        <Body className="max-w-[70ch] text-[clamp(15px,1.25vw,18px)] leading-[1.66] text-nevada">
          With GENEous Care, KYG helps you make sense of your results, understand their context and identify appropriate
          next steps. Depending on your test and needs, that may include:
        </Body>
      </Reveal>

      {/* ---- the three care cards ------------------------------------------
          The source is 3-up above 860px and 1-up below, with no 2-up stage.
          860 is not a named Tailwind breakpoint and an arbitrary min-width
          variant would be emitted BEFORE the named ones and lose, so this snaps
          to md (768). The source proves 3-up is comfortable at 249px per card;
          md makes them 221px, which is the smaller of the two available errors
          (lg would leave a 163px-wide band showing one column where the source
          shows three). */}
      {/* Three up, collapsing to one below 860 — `@media (max-width:860px){
          .care__grid{ grid-template-columns:1fr }}`.

          Expressed as a MAX-width variant on a 3-column base rather than
          `md:grid-cols-3`, because md is 768 and the source's breakpoint is
          860: between those two widths a 3-column layout squeezes each card to
          ~240px and the section measured 2.3x shorter than the reference.
          A max-* variant is also the one arbitrary-breakpoint form that is
          safe here — it has no named breakpoint competing for the same
          property, so the cascade-order trap does not apply. */}
      <div className="grid grid-cols-3 gap-[clamp(18px,2vw,28px)] max-[860px]:grid-cols-1">
        {CARDS.map((card) => (
          // The reveal sits OUTSIDE the card, not on it. <Reveal> writes
          // `transform` as an INLINE style, and an inline transform beats any
          // `hover:-translate-y` class — put both on one element and the card
          // silently stops lifting.
          <Reveal key={card.title} delay={card.delay}>
            <article
              // `--sh-1` at rest, `--sh-2` on hover, with the source's 7px lift.
              // The transition names `translate`, NOT `transform`: Tailwind v4
              // compiles -translate-y-* to the standalone `translate` property,
              // so a transition-property list containing only `transform` never
              // fires and the card would snap up instead of easing.
              className={`group relative flex h-full min-w-0 flex-col rounded-[24px] bg-linenw shadow-[0_1px_2px_0_rgba(45,32,18,0.05),0_4px_14px_0_rgba(45,32,18,0.05)] transition-[translate,box-shadow] duration-850 ${E_SOFT} hover:-translate-y-[7px] hover:shadow-[0_4px_16px_0_rgba(45,32,18,0.07),0_18px_50px_0_rgba(45,32,18,0.09)] motion-reduce:transition-none`}
            >
              {/* THE BADGE IS A SIBLING OF THE FIGURE, NOT A CHILD. The source
                  nests it inside `.care__f`, which is `overflow:hidden` — so its
                  own rule (`bottom:-25px`, plus a 22px drop shadow) is clipped
                  flat against the photo's bottom edge. The 44px of top padding
                  waiting for it in `.care__b` shows the overhang is the intent
                  and the clip is not, so the badge is lifted one level into this
                  unclipped wrapper. Same coordinates, shadow intact. */}
              <div className="relative">
                {/* `.care__f` — 16:10, top corners only (the card body supplies
                    the bottom two). overflow-hidden here is load-bearing: it is
                    what crops the 1.06 hover zoom of the photo inside it. */}
                <figure className="relative aspect-[16/10] overflow-hidden rounded-t-[24px]">
                  <AssetSlot
                    title="Care Card"
                    meta={card.meta}
                    path={card.path}
                    photo={card.photo}
                    alt={card.alt}
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className={`h-full w-full transition-transform duration-850 ${E_SOFT} group-hover:scale-[1.06] motion-reduce:transition-none`}
                  />
                </figure>

                {/* `.icb` — 48 square, r14, straddling the seam 25px below the
                    photo. The source transitions its background at 0.83s and its
                    transform/shadow at 0.85s; folded into one 850ms leg because
                    20ms is below the threshold of noticing and one shorthand
                    keeps this class readable. */}
                <span
                  aria-hidden="true"
                  className={`absolute bottom-[-25px] left-[22px] z-[3] grid h-12 w-12 place-items-center rounded-[14px] bg-linenw shadow-[0_8px_22px_0_rgba(45,32,18,0.14)] transition-[background-color,translate,rotate,box-shadow] duration-850 ${E_SOFT} group-hover:-translate-y-1 group-hover:-rotate-[5deg] group-hover:bg-eden group-hover:shadow-[0_12px_26px_0_rgba(14,77,75,0.26)] motion-reduce:transition-none`}
                >
                  {/* HomeIcon serves a static <img> with #0e4d4b baked into the
                      stroke, so the source's glyph recolour (teal → cream on the
                      now-teal badge) cannot be done with `color`. brightness-0
                      crushes the stroke to black and invert takes it to white —
                      the only way to keep the glyph visible once the well turns
                      eden underneath it. */}
                  <HomeIcon
                    id={card.icon}
                    className={`h-[23px] w-[23px] transition-[scale,filter] duration-850 ${E_SOFT} group-hover:scale-[1.12] group-hover:brightness-0 group-hover:invert motion-reduce:transition-none`}
                  />
                </span>
              </div>

              {/* `.care__b` — the 44px top padding is what clears the badge. */}
              <div className="flex min-w-0 flex-1 flex-col px-[clamp(20px,2vw,26px)] pb-[clamp(24px,2.4vw,30px)] pt-[44px]">
                {/* `.h4` + the hover recolour to teal */}
                <h3
                  className={`mb-[10px] font-kyg text-[clamp(19px,1.3vw,22px)] font-bold leading-[1.28] tracking-[-0.015em] text-bistre transition-colors duration-700 ${E_SOFT} group-hover:text-eden motion-reduce:transition-none`}
                >
                  {card.title}
                </h3>
                <p className="font-kyg text-[17px] font-normal leading-[1.6] tracking-[-0.005em] text-nevada">
                  {card.body}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {/* ---- footer ---------------------------------------------------------
          SPACE_BETWEEN across the full rail, above a rule that TAPERS. The rule
          is the page's `.fade-t` recipe: --line (rgba(27,23,18,.11)) held solid
          to 34% and then faded to nothing by 92%, applied as a border-image. It
          is NOT a solid bistre hairline — an earlier reading sampled the 1px
          line off the slice and mistook the darkest pixel at its left end for
          the whole rule. border-transparent is the fallback that keeps a
          border-image failure invisible rather than drawing a full-strength
          line. */}
      <Reveal className="mt-[clamp(38px,4vw,62px)] flex flex-wrap items-center justify-between gap-[22px] border-t border-transparent pt-[clamp(24px,2.6vw,34px)] [border-image:linear-gradient(90deg,rgba(27,23,18,0.11)_0%,rgba(27,23,18,0.11)_34%,rgba(27,23,18,0)_92%)_1]">
        {/* Cormorant Garamond 500 italic on --ink-2. The 28ch measure is the
            narrow one that forces the source's three lines. */}
        <p className="max-w-[28ch] font-tst text-[clamp(21px,2vw,29px)] font-medium italic leading-[1.3] tracking-normal text-corduroy">
          Because information becomes more valuable when you understand it.
        </p>

        {/* `.btn` in its default skin: solid --c-teal on --c-cream rather than
            the primitive's java2, with the source's own eden drop shadow and its
            3px (not 2px) hover lift. */}
        <Cta
          href="/contact"
          icon="10666-1327"
          // the primitive already carries `transition` (all properties) on the
          // same --e-soft curve, so only the duration and the two skins change
          className="bg-eden text-linenw shadow-[0_6px_18px_0_rgba(14,77,75,0.18)] duration-850 hover:-translate-y-[3px] hover:shadow-[0_16px_40px_0_rgba(14,77,75,0.3),0_0_0_6px_rgba(42,195,162,0.16)] motion-reduce:transition-none"
        >
          Discover GENEous Care
        </Cta>
      </Reveal>
    </Section>
  );
}
