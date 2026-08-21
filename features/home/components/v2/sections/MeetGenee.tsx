// =============================================================================
// Homepage - SECTION 07 · MEET GENEe
// -----------------------------------------------------------------------------
// Rebuilt against the designer's own build ("New Homepage Build/index.html",
// `section.gee` + CSS block 12), which is the page the Figma frame was traced
// from. Where the frame and the HTML disagreed, the HTML won - it is the
// executable version, and several of its numbers (the bubble overhangs, the
// tapering list rules, the inline serif turn in the headline) are things the
// frame could only flatten.
//
// GROUND is `--c-mint` #e2f1ed, which is the `mist` token - NOT `mint`
// (#e6f4f3, the eyebrow-pill tint on the cream pages), which reads greener.
// The section also carries the source's `isolation:isolate` + `overflow:clip`:
// isolate keeps the bubbles' z-3 from escaping into the page's stacking order,
// and clip (not hidden - it never becomes a scroll container) is what contains
// the two bubble overhangs and their rotated tails at every width.
//
// THE ART WAS NEVER DELIVERED. The source points this slot at
// `/Users/honeynandal/…/Mascot (Packaging) - 1.png` - an absolute path on the
// designer's own machine that resolves nowhere - so what the source ACTUALLY
// renders here is the labelled placeholder plate, and so does this. There is no
// `PHOTO.genee`; it is the only section on the page still waiting on art.
//
// THE TWO BUBBLES DELIBERATELY BREAK THE FRAME, one off each side and each
// pointing back at the character with a rotated square tail. They bob on the
// same 6.4s loop, and bubble 2 offsets it by a NEGATIVE delay so it starts
// mid-cycle: a positive delay would leave it parked for 3.2s before it ever
// moved, and matching delays would make the pair pulse in unison like one
// object instead of two independent thoughts.
//
// BREAKPOINT: the source collapses this section at max-width 900 (columns to
// one, art capped at 460, both overhangs pulled back flush). Tailwind's `lg`
// (1024) is used for all of it instead - an arbitrary min-width variant would
// be emitted BEFORE the named ones in v4 and silently lose - so the collapse
// simply happens 124px earlier than in the source. All of it moves together, so
// there is no width at which the layout is half-collapsed.
//
// RADIUS: one radius site-wide - rounded-sm. See docs/DESIGN.md §2.
// =============================================================================

import { cn } from '@/lib/utils';

import { AssetSlot, Body, Cta, Heading, Kicker } from '../ui';
import { Reveal } from '../motion';
import { HomeIcon } from '../HomeIcon';

/**
 * The promise ladder (`ul.gee__list`).
 *
 * `strong` is the source's own `li:last-child` flip, and it drives THREE things
 * at once: the marker fills solid eden with a cream check instead of a 9%-eden
 * disc with an eden minus, the label goes Figtree 700 eden instead of 500
 * corduroy, and the row drops its bottom rule (it closes the list, it does not
 * divide two more items). One flag so they can never drift apart.
 *
 * The glyphs are `<img>` exports with the design's colours baked in, so the
 * marker cannot tint them with `currentColor` the way the source's inline SVG
 * does - the check is already stroked cream (#faf6ef) and both minuses eden
 * (#0e4d4b), which is exactly the pairing each disc needs.
 *
 * Icon ids are frame-absolute: the minus glyphs sit at y=532/588 and the check
 * at y=644 inside a section starting at page y=6207 -> 6739 / 6795 / 6851.
 */
const PROMISES: { icon: string; text: string; strong?: boolean }[] = [
  { icon: '6739-719', text: 'No complicated science lesson.' },
  { icon: '6795-719', text: 'No intimidating jargon.' },
  { icon: '6851-719', text: 'Just better questions and clearer understanding.', strong: true },
];

/** `--sh-2`, the page's warm mid elevation. Carried by the figure and both bubbles. */
const SH2 = 'shadow-[0_4px_16px_0_rgba(45,32,18,0.07),0_18px_50px_0_rgba(45,32,18,0.09)]';

/** `.bub` - everything the two speech bubbles share. Only ground, ink, corner and phase differ. */
const BUBBLE = cn(
  'absolute z-[3] max-w-[min(76%,300px)] rounded-sm px-5 py-[15px]',
  'font-kyg text-[16.5px] font-semibold leading-[1.4] tracking-[-0.01em]',
  SH2,
  'animate-hv2-bob motion-reduce:animate-none'
);

/** `.bub::after` - a 16px square rotated 45deg, half-buried under the bubble's edge. */
const TAIL = 'absolute block h-4 w-4 rotate-45';

export default function MeetGenee() {
  return (
    <section
      id="meet-genee"
      aria-labelledby="meet-genee-heading"
      className="relative isolate scroll-mt-20 overflow-clip bg-mist px-5 py-[clamp(84px,10vw,168px)] text-bistre sm:px-8 lg:px-[63px]"
    >
      {/* div.gee__g - minmax(0,.94fr) / minmax(0,1.06fr) with a shared
          clamp(34px,4.4vw,84px) gap. The minmax(0,…) is the source's own and is
          load-bearing: a bare `fr` floors at min-content, so the 300px bubble
          and the long promise strings would push the columns past the rail. */}
      <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-[clamp(34px,4.4vw,84px)] lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        {/* ---- div.gee__art : the character plate + its two bubbles --------
            This IS the positioning context for both bubbles, so `relative`
            belongs on the Reveal itself rather than on an extra wrapper. `.rv-s`
            in the source, i.e. the scale variant - image plates bloom, they do
            not slide.

            The 460 cap is the source's own below its 900 breakpoint: an
            unbounded art column on a phone would render a 9:10 plate taller
            than the viewport before the copy even starts. */}
        <Reveal variant="scale" className="relative w-full min-w-0 max-w-[460px] lg:max-w-none">
          {/* figure.gee__fig - aspect 9/10, radius 46 (--r-xl), --sh-2.

              The ground is the source's DEFAULT `.ph` paint, three stacked
              layers, not AssetSlot's own dark gradient: twMerge drops the
              primitive's because both land in its bg-image group. Percentages
              and positions are the source's verbatim - the teal bloom is a
              118%x84% ellipse at 18%/12%, not a circle at 20%/16%.

              upperTitle={false} is the primitive's documented opt-out for
              exactly this slot (`.ph__t--case`): the string is stored as typed
              and upper-casing it renders "GENEE", destroying the character's
              own name. It also relaxes the title to the 0.06em this plate wants
              WITHOUT touching the meta line's 0.08em, which a call-site
              descendant override could not do. */}
          <AssetSlot
            tone="dark"
            icon="6618-342"
            title="GENEe Character Asset"
            upperTitle={false}
            meta="GENEe, the KYG guide character · transparent PNG · 900 × 1000 · 9:10"
            path="assets/genee-character.png"
            className={cn(
              'aspect-[9/10] w-full rounded-sm',
              'bg-[radial-gradient(118%_84%_at_18%_12%,rgba(42,195,162,0.34),transparent_58%),radial-gradient(96%_78%_at_88%_88%,rgba(237,221,184,0.34),transparent_60%),linear-gradient(158deg,#20605B_0%,#154744_58%,#0E3634_100%)]',
              SH2
            )}
          />

          {/* .bub--1 - GENEe speaking. top 6%, right -4% (of the art column, so
              ~23px past its edge and safely inside the 63px page gutter), tail
              hanging off the BOTTOM edge 32px in from the left. No width: an
              absolutely positioned box shrink-to-fits, which is what keeps this
              one line at every size the 76%/300px cap allows. */}
          <p className={cn(BUBBLE, 'right-0 top-[6%] bg-linenw text-eden lg:right-[-4%]')}>
            Let&rsquo;s ask your genes.
            <span aria-hidden="true" className={cn(TAIL, '-bottom-[6px] left-[32px] bg-linenw')} />
          </p>

          {/* .bub--2 - the reader speaking, so it is the inverse fill and its
              tail points UP-right, back at the character. bottom 9%, left -5%,
              and the -3.2s delay drops it exactly half a cycle out of phase
              with bubble 1 (bob is 6.4s). */}
          <p className={cn(BUBBLE, 'bottom-[9%] left-0 bg-eden text-linenw [animation-delay:-3.2s] lg:left-[-5%]')}>
            Why does the same diet affect two people differently?
            <span aria-hidden="true" className={cn(TAIL, '-top-[6px] right-[36px] bg-eden')} />
          </p>
        </Reveal>

        {/* ---- div.gee__copy ----------------------------------------------
            The source lays this out as a plain block and leans on ADJACENT
            MARGINS, two of which must not collapse: the list's 34 bottom and
            the pill's 36 top both apply there, because the pill is inline-level
            and inline margins never collapse. A block wrapper here would
            collapse them to 36 and close a gap the frame measures at ~67.
            flex-col reproduces the source's spacing exactly, since flex items
            never collapse margins in the first place. */}
        <div className="flex min-w-0 flex-col">
          {/* `.kick--case` - Figtree 800 18/1.24 at 0.03em, sentence case. This
              frame has no UPPER run anywhere in it, hence upper={false} (the
              primitive's own opt-out) rather than fighting `uppercase` with a
              second text-transform utility at the call site. */}
          <Reveal className="mb-[clamp(22px,2.2vw,32px)]">
            <Kicker tone="eden" upper={false} className="text-[18px]">
              Meet GENEe
            </Kicker>
          </Reveal>

          {/* Two voices in ONE LINE, not two: the source runs the Cormorant
              turn inline after a space, at 1.1em of the Figtree statement, and
              lets text-wrap:balance decide where it folds. Forcing the <em> to
              its own block - which this section used to do - hard-codes a break
              the source never asked for and reads as two headlines.

              The id lives on a wrapper because <Heading> is shared and takes no
              id prop; it is what names this section as a landmark. */}
          <div id="meet-genee-heading">
            <Reveal delay={0.05}>
              <Heading
                as="h2"
                html="Genetics sounds complicated. <em>Good thing GENEe doesn&rsquo;t.</em>"
                className="text-balance text-[clamp(31px,3.5vw,55px)] font-normal tracking-[-0.03em] [&_em]:text-[1.1em]"
              />
            </Reveal>
          </div>

          {/* `.lead` - clamp(19,1.45vw,24)/1.46 ls -0.015em, ink-2. No measure:
              the source gives .lead no max-width, and capping it here pulled
              the one-line sentence onto two at desktop. */}
          <Reveal delay={0.1} className="mt-[22px]">
            <Body className="text-[clamp(19px,1.45vw,24px)] leading-[1.46] tracking-[-0.015em] text-corduroy">
              Meet GENEe, your curious guide to the world inside you.
            </Body>
          </Reveal>

          {/* `.body` - a flat 18/1.66 ink-3 on the source's own 64ch measure.
              The size is stated because Body's default clamps to 18.5, wide
              enough to break the first line early and turn this into four lines
              instead of three. */}
          <Reveal delay={0.14} className="mt-[16px]">
            <Body className="max-w-[64ch] text-[18px] leading-[1.66] text-nevada">
              From explaining why the same diet can affect two people differently to helping you understand unfamiliar
              genetic concepts, GENEe makes genetics simpler, friendlier and easier to explore.
            </Body>
          </Reveal>

          <Reveal delay={0.18} className="my-[clamp(24px,2.6vw,34px)]">
            <ul className="grid list-none gap-[2px]">
              {PROMISES.map((p) => (
                <li
                  key={p.text}
                  className={cn(
                    'flex min-w-0 items-start gap-[14px] py-[13px]',
                    'font-kyg text-[18px] leading-[1.45]',
                    p.strong
                      ? 'font-bold text-eden'
                      : cn(
                          'font-medium text-corduroy',
                          // The rules TAPER rather than running the full width:
                          // solid to 34%, then out to nothing by 92%. Written as
                          // a border-image over a flat 1px border so a browser
                          // that drops border-image still gets the plain rule
                          // instead of an invisible one.
                          'border-b border-[rgba(27,23,18,0.11)]',
                          '[border-image:linear-gradient(90deg,rgba(27,23,18,0.11)_0%,rgba(27,23,18,0.11)_34%,rgba(27,23,18,0)_92%)_1]'
                        )
                  )}
                >
                  {/* Top-aligned with a 2px nudge, NOT vertically centred: on a
                      phone the label wraps to two lines, and a centred marker
                      drifts down between them instead of staying beside the
                      first line it belongs to. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'mt-[2px] grid h-6 w-6 shrink-0 place-items-center rounded-full',
                      p.strong ? 'bg-eden' : 'bg-eden/[0.09]'
                    )}
                  >
                    <HomeIcon id={p.icon} className="h-[14px] w-[14px]" />
                  </span>
                  {/* zero minimum width so a long promise wraps inside the flex
                      row rather than forcing the copy column past its track */}
                  <span className="min-w-0">{p.text}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* `.gee__rule` and `.btn` are both inline-level in the source and sit
              on the SAME line, separated by nothing but the whitespace between
              the two tags - which is why the frame measures them 4px apart.
              They read as one control pair. Only the wrap gap is opened up. */}
          <div className="my-[clamp(24px,2.8vw,36px)] flex flex-wrap items-center gap-x-[4px] gap-y-3">
            <Reveal delay={0.22}>
              {/* 999 capsule, eden @7%, pad 12/20/12/16, gap 13. The glyph is
                  already stroked eden, so 65% is opacity alone. */}
              <p className="inline-flex min-w-0 items-center gap-[13px] rounded-sm bg-eden/[0.07] py-3 pl-4 pr-5">
                <HomeIcon id="6969-730" className="h-[22px] w-[22px] shrink-0 opacity-65" />
                {/* nowrap is the source's: this is the brand line, and breaking
                    it across two lines inside a pill reads as an accident. It
                    still clears a 320px viewport at the 21px clamp floor. */}
                <span className="whitespace-nowrap font-tst text-[clamp(21px,1.9vw,28px)] font-medium italic leading-[1.3] tracking-normal text-eden">
                  Let&rsquo;s ask your genes.
                </span>
              </p>
            </Reveal>

            <Reveal delay={0.26}>
              {/* The source's DEFAULT `.btn` - eden fill, cream label - not the
                  java2 primary, which is the on-dark variant. Radius 10, h58,
                  0 6 18 eden shadow all come from the primitive. */}
              <Cta
                href="/categories"
                icon="6975-1128"
                className="bg-eden text-linenw shadow-[0_6px_18px_0_rgba(14,77,75,0.18)]"
              >
                Meet GENEe
              </Cta>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
