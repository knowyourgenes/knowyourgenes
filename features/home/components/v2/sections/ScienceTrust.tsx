// =============================================================================
// Homepage - SECTION 11 · SCIENCE & TRUST
// -----------------------------------------------------------------------------
// Ported against the designer's own page (`New Homepage Build/index.html`):
// `.sci` / `.sci__grid` / `.sci__i` / `.sci__fig` / `.sci__ft` / `.certs`
// (CSS ~1041-1077) and the markup at line 1901. Where that page and the traced
// Figma frame disagreed, the page won - it is the executable design.
//
// TWO GROUNDS IN ONE FRAME, which is why this does not use <Section>:
//   div.sec   the dark half   GRADIENT_LINEAR(#0e4d4b -> #0a3b39 -> #062927)
//   div.certs the cream band  flat #faf6ef, full-bleed
// The gradient reads vertical in the render (sampled #0d4a48 at the top,
// #082f2d two thirds down), so it is 180deg - NOT the 160deg the hero uses.
//
// VERTICAL RHYTHM IS PER-BLOCK, NOT A UNIFORM GAP. The source gives each block
// its own margin (header 46..84, figure 38..60, footer 40..66), so this uses a
// plain block container with margins rather than a flex column with one gap -
// a single gap value cannot express three different distances.
//
// THE GRID HAS NO CARDS, ONLY RULES, and they TAPER - see the long note on
// CLAIMS below, which is the subtlest thing in this file.
//
// RADIUS TRAP: the lab figure is 24, the icon wells are 14, the CTA is 10.
// None of those are Tailwind's remapped rounded-2xl/3xl, so all are arbitrary.
// =============================================================================

import Image from 'next/image';

import { AssetSlot, Body, Cta, Heading, Kicker, PHOTO } from '../ui';
import { HomeIcon } from '../HomeIcon';
import { Reveal } from '../motion';

/**
 * The four trust claims, in frame order (reading order is row-major, so the
 * array order IS the 2x2 order). Icon ids are frame-absolute: this section
 * starts at page y=10877, so the spec's y=388 icon row becomes 11265-*.
 */
const CLAIMS: { icon: string; title: string; body: string }[] = [
  {
    icon: '11265-76', // ic-flask-conical
    title: 'Trusted laboratory network',
    body: 'Testing through carefully selected genetic laboratory partners with relevant certifications and capabilities.',
  },
  {
    icon: '11265-777', // ic-book-open
    title: 'Expert interpretation',
    body: 'Because genetic information needs context, not just a PDF full of terminology.',
  },
  {
    icon: '11521-76', // ic-life-buoy
    title: 'Guidance where it matters',
    body: 'Access to counselling and appropriate expert support depending on the nature of your test.',
  },
  {
    icon: '11521-777', // ic-scale
    title: 'Science, not certainty',
    body: 'Genes can reveal valuable information about inherited variants, traits and predispositions. They don’t determine every aspect of your health or future.',
  },
];

/**
 * THE GRID RULES ARE `border-image` GRADIENTS, NOT FLAT BORDERS - and the two
 * columns get DIFFERENT ones. This is the part that is easy to get wrong.
 *
 * The source declares `border-top:1px solid` on every cell with a HORIZONTAL
 * taper, then re-declares `border-image` on `:nth-child(even)` with a VERTICAL
 * one for the column seam. `border-image` is a single property covering all
 * four edges, so the second declaration replaces the first on the right-hand
 * cells: their top edge is now sliced from the top 1px of a 180deg gradient
 * that starts fully transparent, i.e. it disappears.
 *
 * That is reproduced verbatim and is why the two columns carry mutually
 * exclusive classes rather than a shared base plus an override - two bare
 * `[border-image:…]` utilities on one element would be resolved by stylesheet
 * order, which Tailwind does not guarantee, so the seam could silently lose.
 *
 * What it looks like: each row is topped by a hairline that covers only its
 * LEFT half and fades out, matching the page's `.fade-t` idiom ("rules taper
 * out rather than running edge to edge"). Below lg the seam is dropped but the
 * override is not, so claims 2 and 4 have no rule and the list reads as pairs.
 * The stroke is 17% cream (--line-d), NOT the full-opacity cream a flattened
 * render suggests.
 */
const RULE_ROW =
  '[border-image:linear-gradient(90deg,rgba(250,246,239,0.17)_0%,rgba(250,246,239,0.17)_34%,rgba(250,246,239,0)_92%)_1]';
const RULE_SEAM =
  '[border-image:linear-gradient(180deg,rgba(250,246,239,0)_0%,rgba(250,246,239,0.17)_26%,rgba(250,246,239,0.17)_74%,rgba(250,246,239,0)_100%)_1]';

/**
 * The certification strip - REAL MARKS, delivered as 520x300 white-ground JPEGs
 * in `public/home/brand/`. The source sizes them by HEIGHT only
 * (`height:clamp(30px,3.4vw,44px); width:auto`), so every logo lands on one
 * baseline whatever its lockup; the intrinsic size is passed to next/image only
 * so it can reserve the box, and CSS then drives the render.
 *
 * The alt text is the accreditation name, verbatim from the source's `alt`
 * attributes - these are claims about the lab, so they must reach a screen
 * reader rather than being decorative chrome.
 */
const CERTS: { src: string; alt: string }[] = [
  { src: '/home/brand/nabl.jpg', alt: 'NABL accreditation' },
  { src: '/home/brand/iso.jpg', alt: 'ISO certification' },
  { src: '/home/brand/acmg.jpg', alt: 'ACMG guidelines' },
  { src: '/home/brand/cpic.jpg', alt: 'CPIC guidelines' },
  { src: '/home/brand/fda.jpg', alt: 'FDA reference' },
  { src: '/home/brand/hipaa.jpg', alt: 'HIPAA aligned data handling' },
];

/**
 * The certification strip's hover, on the source's `--e` easing and its three
 * different durations - which is why it is one arbitrary `transition` rather
 * than Tailwind's duration utilities (those apply one duration to everything).
 *
 * The source transitions `transform`; this lists `translate` instead because
 * Tailwind v4 compiles `-translate-y-*` to the standalone `translate` property,
 * so a `transform` transition would never fire and the lift would snap.
 *
 * It is gated `motion-safe` rather than cancelled with a `motion-reduce`
 * override: an arbitrary-property declaration and a named utility land in
 * different sort buckets, so a `motion-reduce:transition-none` beside it is not
 * guaranteed to come out later in the sheet. Never emitting it is certain.
 */
const CERT_TRANSITION =
  'motion-safe:[transition:opacity_.58s_cubic-bezier(.22,1,.36,1),filter_.58s_cubic-bezier(.22,1,.36,1),translate_.64s_cubic-bezier(.22,1,.36,1)]';

export default function ScienceTrust() {
  return (
    <section id="science-and-trust" className="scroll-mt-20">
      {/* ---- div.sec : the dark half -------------------------------------
          The gradient belongs to div.sec, NOT to the <section>: div.sec is
          1651.9 of the frame's 1885.9, so hanging the paint off the section
          would stretch its 100% stop past the cream seam and land #072e2c
          there instead of the frame's #062927. Scoping it here makes the last
          stop fall exactly where the cream band starts. */}
      <div className="bg-[linear-gradient(180deg,#0e4d4b_0%,#0a3b39_55%,#062927_100%)] px-5 pb-[clamp(56px,7vw,101px)] pt-[clamp(64px,10vw,144px)] text-linenw sm:px-8 lg:px-[63px]">
        <div className="mx-auto w-full max-w-[1313px]">
          {/* ---- header.shead.shead--split.rv ---------------------------
              A 779 / 491 grid (= the source's 1.35fr / 0.85fr, same ratio)
              with the source's clamp(22,3vw,56) gutter. The two columns are
              BOTTOM aligned on desktop, not top: the pull-quote's last line
              and the headline both land on y=259. Below lg the source flips
              to align-items:start, so the quote hangs off the headline
              instead of floating in a stretched cell. */}
          <Reveal
            as="header"
            className="mb-[clamp(46px,5vw,84px)] grid grid-cols-1 items-start gap-[clamp(22px,3vw,56px)] lg:grid-cols-[779fr_491fr] lg:items-end"
          >
            {/* the source spaces the kicker off the headline with a margin,
                clamp(22,2.2vw,32) - expressed as the column's gap */}
            <div className="flex min-w-0 flex-col gap-[clamp(22px,2.2vw,32px)]">
              <Kicker>Science &amp; trust</Kicker>

              {/* One text frame, two typefaces: Figtree 400 for the statement
                  and Cormorant Garamond 500 italic for the turn - the italic
                  run is ~10% LARGER, which Heading's default <em> styling does
                  not do on its own, hence the size override. The base scale is
                  Heading's own (50.4 max), NOT the source's 55: that scale is
                  shared with every other h2 on this 16,000px page and bumping
                  it here alone would make this one headline visibly outsized. */}
              <Heading
                html="Big questions deserve <em>serious science.</em>"
                className="tracking-[-0.03em] text-linenw [&_em]:text-[clamp(33px,3.85vw,55.4px)]"
              />
            </div>

            {/* p.lead - the quote glyph sits in the frame's own 52 left pad,
                outside the text column, so it is absolutely placed rather than
                inlined; that keeps the italic lines flush with each other.
                `top:.16em` is the source's own value and tracks the clamped
                font size, so the glyph stays on the cap line at every width.

                The source zeroes this padding below 820px, which drops the
                absolutely-placed glyph on top of the first line. That is a bug
                in the source, not a design, so the pad is kept (44 on phones,
                where 52 would cost too much of a narrow measure). */}
            <div className="relative min-w-0 pl-[44px] lg:pl-[52px]">
              <HomeIcon id="11057-886" className="absolute left-0 top-[0.16em] h-8 w-8 shrink-0 opacity-60" />
              <p className="font-tst text-[clamp(23px,2.3vw,33px)] font-medium italic leading-[1.28] text-linenw/78">
                Your DNA is deeply personal.
                <br />
                We treat it that way.
              </p>
            </div>
          </Reveal>

          {/* ---- div.sci__grid ------------------------------------------
              No gap and no top pad: the cells' own padding does the spacing and
              the first row's border sits flush on the grid's top edge. Below lg
              the column seam is gone, so the four claims read as a divided
              list - no left border pointing at a gutter that isn't there. */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {CLAIMS.map((c, i) => {
              const rightColumn = i % 2 === 1;
              return (
                // `group` drives the source's `.ic-h` hover, which reacts on the
                // whole cell rather than on the 48px chip alone.
                <Reveal
                  key={c.title}
                  // .02 / .08 / .14 / .20 - the source's own --rd stagger
                  delay={0.02 + i * 0.06}
                  className={[
                    'group flex min-w-0 flex-col border-t border-transparent',
                    'py-[clamp(28px,3vw,44px)] pl-0 pr-[clamp(24px,3vw,50px)]',
                    rightColumn ? `${RULE_SEAM} lg:border-l lg:pl-[clamp(24px,3vw,50px)]` : RULE_ROW,
                  ].join(' ')}
                >
                  {/* span.icb - 48 well, radius 14, java2 at 13%, 22 below.
                      The source's hover ALSO inverts the well (solid java2 with
                      a teal-ink glyph). That half is deliberately not ported:
                      HomeIcon serves static SVGs with their colours baked in,
                      so the glyph cannot follow `color` and would vanish into a
                      java2 fill. Only the lift/rotate/shadow carries over. */}
                  <span
                    className={[
                      'mb-[22px] grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-java2/[0.13]',
                      // translate + rotate, NOT transform: v4 compiles the
                      // motion utilities below to those standalone properties
                      'transition-[translate,rotate,box-shadow] duration-850 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      'group-hover:-translate-y-1 group-hover:-rotate-[5deg]',
                      'group-hover:shadow-[0_12px_28px_rgba(0,0,0,0.34)] motion-reduce:transition-none',
                    ].join(' ')}
                  >
                    <HomeIcon
                      id={c.icon}
                      className="h-[23px] w-[23px] transition-transform duration-850 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.12] motion-reduce:transition-none"
                    />
                  </span>

                  {/* .h3 - clamp(23,1.75vw,29) / 1.16 / -.022em / 700, 12 below */}
                  <h3 className="mb-[12px] font-kyg text-[clamp(23px,1.75vw,29px)] font-bold leading-[1.16] tracking-[-0.022em] text-linenw">
                    {c.title}
                  </h3>

                  {/* flat 17.5, not a clamp - the source's body scale is a fixed
                      size across the whole page, and clamping only this one
                      block would shrink it out of step with its neighbours */}
                  <Body className="text-[17.5px] leading-[1.64] text-linenw/68">{c.body}</Body>
                </Reveal>
              );
            })}
          </div>

          {/* ---- figure#ph-lab -------------------------------------------
              1313 x 500 = 21:8, radius 24, and the photograph has been
              delivered - so this is AssetSlot's filled state and every scrap of
              placeholder chrome (plate, hairline, label stack, and the hand-made
              radial bloom that used to fake the plate's tint) is gone. No
              min-height either: that existed to stop the label stack being
              crushed on a phone, and forcing it now would just distort the 21:8
              crop the photograph was framed for. */}
          <Reveal as="figure" className="mt-[clamp(38px,4vw,60px)]">
            <AssetSlot
              icon={null}
              title="Laboratory"
              meta="Genomics lab bench, sequencer and gloved hands, cool daylight · 2100 × 800 · 21:8"
              path="assets/lab-bench.jpg"
              photo={PHOTO.lab}
              alt="A genomics laboratory bench with sequencing equipment and sample tubes"
              // full rail width at every breakpoint, so no 50vw guess
              sizes="(max-width: 1439px) 100vw, 1320px"
              className="aspect-[21/8] w-full rounded-[24px]"
            />
          </Reveal>

          {/* ---- div.sci__ft --------------------------------------------- */}
          <Reveal className="mt-[clamp(40px,4.4vw,66px)]">
            <Cta href="/about" icon="12389-297">
              Our Science &amp; Standards
            </Cta>
          </Reveal>
        </div>
      </div>

      {/* ---- div.certs : full-bleed cream band, pad 34..52 top and bottom -- */}
      <div className="bg-linenw px-5 py-[clamp(34px,3.6vw,52px)] text-bistre sm:px-8 lg:px-[63px]">
        <Reveal className="mx-auto flex w-full max-w-[1313px] flex-col items-center">
          {/* Figtree 800 14 ls .16em, #92a19e = pewter, textCase=UPPER. It is
              `width:100%` in the source's flex row, which is what forces the
              logos onto their own line. */}
          <Kicker tone="pewter" className="w-full text-center text-[14px] tracking-[0.16em]">
            Verified laboratory / certification logos
          </Kicker>

          {/* THE CREAM FILL ON THIS LIST IS LOAD-BEARING, not decoration. The
              logos are `mix-blend-mode:multiply` so their white JPEG grounds
              drop out into the band. Reveal sets `will-change:opacity,transform`,
              which creates a stacking context and isolates the blend from the
              band behind it - with nothing to multiply against, the white boxes
              would come back as faint lighter rectangles. Repainting the same
              cream INSIDE the isolated group gives the blend its backdrop.

              The row gap is the source's clamp(26,4vw,64); the top margin is
              that plus the label's own 6 margin-bottom, at both ends. */}
          <ul
            className={[
              'mt-[clamp(32px,4vw,70px)] flex list-none flex-wrap items-center justify-center',
              'gap-[clamp(26px,4vw,64px)] bg-linenw',
            ].join(' ')}
          >
            {CERTS.map((c) => (
              <li key={c.src} className="min-w-0">
                <Image
                  src={c.src}
                  alt={c.alt}
                  width={520}
                  height={300}
                  className={[
                    // height drives the row; width follows the lockup
                    'h-[clamp(30px,3.4vw,44px)] w-auto max-w-full',
                    'opacity-55 mix-blend-multiply grayscale contrast-[0.95]',
                    'hover:-translate-y-[3px] hover:opacity-100 hover:grayscale-0 hover:contrast-100',
                    CERT_TRANSITION,
                    'motion-reduce:hover:translate-y-0',
                  ].join(' ')}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
