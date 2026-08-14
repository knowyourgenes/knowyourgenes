// =============================================================================
// Homepage — SECTION 14 · THE JOURNAL
// -----------------------------------------------------------------------------
// Rebuilt against the designer's own build ("New Homepage Build/index.html",
// `section.jrn` + CSS block 19), which is the page the Figma frame was traced
// from. Where the two disagree the HTML wins, because it is the executable one.
//
// WHAT CHANGED FROM THE FIGMA READING: the frame flattened this section into a
// 1440-wide artboard holding seven 330.5 cards on a 356 pitch, which read as a
// fixed-width carousel. The HTML shows the real rule — the cards are FLUID,
// `flex:0 0 clamp(250px,25vw,330px)` on a `clamp(16px,1.8vw,26px)` gap — so 330
// and 356 are only what that formula evaluates to at 1320. Nothing here is a
// fixed card width any more.
//
// THE RAIL BLEEDS BY EXACTLY ONE GUTTER. The source nests the scroller in the
// same `.shell` as the header, then cancels the gutter with
// `margin-inline:calc(var(--gutter) * -1)` and pays it back as padding. Net
// effect: card 1's left edge lands on the headline's left edge at every width,
// and the rail runs to the viewport edge up to ~1440 and stops one gutter
// outside the rail beyond it. That is reproduced here with the repo's own
// breakpoint gutter (5/8/63) rather than the source's `--gutter` clamp, so the
// journal's left edge stays flush with every other ported section.
//
// SCROLLBAR IS HIDDEN, deliberately (`scrollbar-width:none` in the source). The
// scroll cue is the sliver of the next card, and keyboard users still traverse
// the rail by tabbing the card links — the browser scrolls each into view and
// honours the scroll-padding below, so nothing is unreachable without a mouse.
//
// RADIUS TRAP: the card figures are var(--r-sm) = 16 and the CTA var(--r-xs) =
// 10. Neither is one of Tailwind's remapped steps (rounded-2xl is 18 here), so
// both are written as explicit arbitrary values.
//
// PHOTOGRAPHY IS DELIVERED for all six editorial thumbs (PHOTO.jrn1..jrn6), so
// AssetSlot renders next/image and drops the labelled plate. `title`/`meta`/
// `path` are still passed: they are the designer's own brief for each frame and
// are what the plate would fall back to if an asset ever went missing.
// =============================================================================

import Link from 'next/link';

import { AssetSlot, Body, Cta, Heading, Kicker, PHOTO } from '../ui';
import { Reveal } from '../motion';
import { HomeIcon } from '../HomeIcon';

/**
 * The six journal cards.
 *
 * `icon` is the card's own 'ic-arrow-right'. The ids are FRAME-ABSOLUTE (spec
 * y=692.x + this section's 14128 offset = 14820) and keyed by each card's x, so
 * they are one-per-card and must not be reused across cards.
 *
 * `meta` / `path` are the placeholder strings exactly as the source stores them,
 * middle dots and multiplication sign included. `alt` is the source's own <img>
 * alt text for the delivered photograph — it describes the picture, not the
 * article, which is correct for an image sitting beside its own visible title.
 *
 * `href` points at the existing /blog route (the journal's real home) with a
 * topic query so the six "Read" links are not six identical destinations. The
 * source ships `href="#"` on all seven because its taxonomy is not wired up yet;
 * these are the repo's real targets and are deliberately kept.
 */
const POSTS: {
  title: string;
  meta: string;
  path: string;
  photo: string;
  alt: string;
  icon: string;
  href: string;
}[] = [
  {
    title: 'Wellness & Genetics',
    meta: 'Wellness & Genetics · 800 × 600 · 4:3',
    path: 'assets/journal-wellness.jpg',
    photo: PHOTO.jrn1,
    alt: 'Lacing a running shoe on the front steps at dawn',
    icon: '14820-107',
    href: '/blog?topic=wellness-genetics',
  },
  {
    title: 'Genes & Family',
    meta: 'Genes & Family · 800 × 600 · 4:3',
    path: 'assets/journal-family.jpg',
    photo: PHOTO.jrn2,
    alt: 'Three generations looking through old family photographs',
    icon: '14820-463',
    href: '/blog?topic=genes-family',
  },
  {
    title: 'Cancer Genetics',
    meta: 'Cancer Genetics · 800 × 600 · 4:3',
    path: 'assets/journal-cancer.jpg',
    photo: PHOTO.jrn3,
    alt: 'Two women walking together on a tree-lined road',
    icon: '14820-819',
    href: '/blog?topic=cancer-genetics',
  },
  {
    title: 'Reproductive Health',
    meta: 'Reproductive Health · 800 × 600 · 4:3',
    path: 'assets/journal-reproductive.jpg',
    photo: PHOTO.jrn4,
    alt: 'A couple talking over chai at their kitchen table in the evening',
    icon: '14820-1175',
    href: '/blog?topic=reproductive-health',
  },
  {
    title: 'Longevity',
    meta: 'Longevity · 800 × 600 · 4:3',
    path: 'assets/journal-longevity.jpg',
    photo: PHOTO.jrn5,
    alt: 'An older woman tending plants on a sunlit balcony',
    icon: '14820-1531',
    href: '/blog?topic=longevity',
  },
  {
    title: 'Ancestry',
    meta: 'Ancestry · 800 × 600 · 4:3',
    path: 'assets/journal-ancestry.jpg',
    photo: PHOTO.jrn6,
    alt: 'A hand-drawn family tree and old photographs on a table',
    icon: '14820-1887',
    href: '/blog?topic=ancestry',
  },
];

/**
 * `.jcard` — the flex item. `flex:0 0 clamp(250px,25vw,330px)` verbatim, so the
 * rail always overflows (7 × 330 + 6 × 26 = 2466 against a 1440 artboard) and
 * scrolls at EVERY width. Nothing is dropped or reflowed on a phone; the design
 * is a carousel, not a grid that happens to scroll.
 */
const CARD = 'min-w-0 flex-[0_0_clamp(250px,25vw,330px)] snap-start';

/**
 * `.jcard__f` — the figure shell.
 *
 * THE HOVER IS A LIFT, NOT A ZOOM. The source moves the whole figure
 * `translateY(-6px)` and swaps --sh-1 for the much deeper --sh-2 over 0.77s;
 * the photograph inside does NOT scale. (Section 10's `.care__f > .ph` is the
 * one place on this page that scales an image, at 1.06 — do not borrow it here.)
 *
 *   --sh-1  0 1px 2px rgba(45,32,18,.05), 0 4px 14px rgba(45,32,18,.05)
 *   --sh-2  0 4px 16px rgba(45,32,18,.07), 0 18px 50px rgba(45,32,18,.09)
 *   --e     cubic-bezier(.22,1,.36,1)
 *
 * `group-hover` rather than a bare `hover` because the trigger in the source is
 * `.jcard:hover`, i.e. anywhere on the card — the title and the "Read" row are
 * part of the same hover target, and the group lives on the wrapping <Link>.
 */
const FIGURE =
  'relative aspect-[4/3] w-full overflow-hidden rounded-[16px] ' +
  'shadow-[0_1px_2px_0_rgba(45,32,18,0.05),0_4px_14px_0_rgba(45,32,18,0.05)] ' +
  'transition-[transform,box-shadow] duration-[770ms] ease-[cubic-bezier(0.22,1,0.36,1)] ' +
  'group-hover:-translate-y-1.5 ' +
  'group-hover:shadow-[0_4px_16px_0_rgba(45,32,18,0.07),0_18px_50px_0_rgba(45,32,18,0.09)] ' +
  'motion-reduce:transition-none';

/** `.jcard__t` — 20/1.28 ls -.018em on ink-1, turning teal over 0.51s on hover. */
const TITLE =
  'mt-[18px] font-kyg text-[20px] font-bold leading-[1.28] tracking-[-0.018em] text-bistre ' +
  'transition-colors duration-[510ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-eden ' +
  'motion-reduce:transition-none';

/** `.jcard__s` — the ask card's subtitle, the only card that carries one. */
const SUB = 'mt-[5px] font-kyg text-[16.5px] font-normal leading-[1.45] text-nevada';

/**
 * `.jcard__r` — the "Read →" / "Ask →" affordance. Figtree 700 15.5 on the body's
 * inherited 1.62 leading, gap 8, teal. The glyph is `.ic--arw` at 19px (the
 * exported SVGs have a 20 viewBox, so the size is set explicitly) and slides 4px
 * right over 0.64s while the card is hovered.
 */
function ReadLine({ label, icon }: { label: string; icon: string }) {
  return (
    <span className="mt-[10px] inline-flex items-center gap-2 font-kyg text-[15.5px] font-bold leading-[1.62] text-eden">
      {label}
      <HomeIcon
        id={icon}
        className="h-[19px] w-[19px] shrink-0 transition-transform duration-[640ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transition-none"
      />
    </span>
  );
}

export default function Journal() {
  return (
    // `.sec .jrn`: flat cream, padding-block var(--sp-sec) = clamp(84px,10vw,168px).
    // overflow-clip is the source's own guard against the rail's negative margins.
    // The id stays `the-journal` (not the source's `journal`) because it is this
    // repo's existing in-page anchor.
    <section
      id="the-journal"
      aria-labelledby="jrn-heading"
      className="relative overflow-clip scroll-mt-20 bg-linenw py-[clamp(84px,10vw,168px)] text-bistre"
    >
      {/* ---- header shell ---------------------------------------------------
          The gutter goes on the OUTER box and the rail cap on the inner one —
          exactly how <Section> does it. Putting max-w and px on the SAME element
          would make 1313 the border-box (box-sizing:border-box is global),
          leaving only 1187 of content starting 63px right of the card rail. */}
      <div className="px-5 sm:px-8 lg:px-[63px]">
        <div className="mx-auto w-full max-w-[1313px]">
          {/* `.shead .shead--split`: two columns at minmax(0,1.35fr) /
              minmax(0,.85fr), BOTTOM-aligned (the aside ends level with the
              headline), collapsing to one top-aligned column.

              The source collapses at max-width:900px. Tailwind has no 901
              breakpoint and an arbitrary min-width variant would be emitted
              BEFORE the named ones and always lose, so the nearest named step is
              used. lg (1024) rather than md (768): at 768 the aside column
              measures ~250px, which breaks the two-sentence paragraph into a
              ragged stack. */}
          <Reveal
            as="header"
            className="mb-[clamp(46px,5vw,84px)] grid grid-cols-1 items-start gap-[clamp(22px,3vw,56px)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:items-end"
          >
            <div className="min-w-0">
              {/* `.kick` carries its own margin-bottom rather than the column
                  using a gap, because the aside beside it has no kicker and
                  would inherit the wrong rhythm from a shared gap. */}
              <Kicker tone="eden" className="mb-[clamp(22px,2.2vw,32px)]">
                The journal
              </Kicker>

              {/* `.h2`: clamp(31px,3.5vw,55px)/1.14, ls -.03em, weight 400,
                  text-wrap:balance. The italic turn is an INLINE <em> run that
                  runs on after "genetics" — the Figma reading had it as its own
                  block line, which the HTML contradicts. `.h2 em` is Cormorant
                  Garamond 500 italic at 1.1em with the sans tracking dropped,
                  which <Heading> already applies except for the size bump. */}
              {/* The id sits on a wrapper, not the <h2>: <Heading> takes only
                  html/className/as, and aria-labelledby resolves the referenced
                  element's text content — which here is exactly the heading. */}
              <div id="jrn-heading">
                <Heading
                  as="h2"
                  className="text-balance text-[clamp(31px,3.5vw,55px)] font-normal tracking-[-0.03em] text-bistre [&_em]:text-[1.1em]"
                  html={'Discover genetics <em>without the textbook.</em>'}
                />
              </div>
            </div>

            {/* `.jrn__aside`: lead then body, separated by `p + p{margin-top:14px}` */}
            <div className="min-w-0">
              {/* `.lead` — clamp(19px,1.45vw,24px)/1.46 ls -.015em on ink-2 */}
              <p className="font-kyg text-[clamp(19px,1.45vw,24px)] font-normal leading-[1.46] tracking-[-0.015em] text-corduroy">
                The more you know, the better you can ask.
              </p>
              {/* `.body` — a flat 18/1.66 on ink-3, capped at the source's 64ch */}
              <Body className="mt-[14px] max-w-[64ch] text-[18px] leading-[1.66] text-nevada">
                Stories, explainers, myths, conversations and the questions about your body you’ve probably wondered about
                but never knew whom to ask.
              </Body>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ---- the card rail --------------------------------------------------
          Same shell as the header, so the scroller starts on the headline's x;
          the negative margin then lets it bleed one gutter past that rail. */}
      <div className="px-5 sm:px-8 lg:px-[63px]">
        <div className="mx-auto w-full max-w-[1313px]">
          {/* pt/-mt pair: the source only pads the BOTTOM 14px, but `overflow-x:
              auto` makes overflow-y compute to `auto` as well, so the hover
              lift's -6px and the top half of --sh-2 get sheared off. The 14px of
              top padding buys that slack back and the matching negative margin
              cancels it again, leaving the rail on the source's exact y.

              snap-x/snap-mandatory + scroll-px belong HERE, on the scroll
              container. On the children they would be inert. */}
          <ul
            className={[
              '-mx-5 -mt-[14px] flex list-none snap-x snap-mandatory gap-[clamp(16px,1.8vw,26px)]',
              'overflow-x-auto overscroll-x-contain px-5 pb-[14px] pt-[14px] scroll-px-5',
              '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
              'sm:-mx-8 sm:px-8 sm:scroll-px-8',
              'lg:-mx-[63px] lg:px-[63px] lg:scroll-px-[63px]',
            ].join(' ')}
          >
            {POSTS.map((post, i) => (
              /* PER-CARD STAGGER: the source puts one `.rv` on the whole rail,
                 but its own stagger idiom elsewhere (`.lad__i`, `.drow`) is a
                 0.06s step on `--rd`, which is what is used here so the row
                 arrives as a wave rather than a slab.

                 Cards past the rail's right edge are clipped by its
                 `overflow-x`, so the IntersectionObserver reports them as not
                 intersecting and they stay hidden until you scroll them into
                 view — at which point each reveals once. That is a feature of
                 moving the reveal onto the card, not a bug to pad around. */
              <Reveal key={post.title} as="li" delay={i * 0.06} className={CARD}>
                <Link href={post.href} className="group block">
                  <AssetSlot
                    icon={null}
                    tone="sand"
                    title="Journal Thumb"
                    meta={post.meta}
                    path={post.path}
                    photo={post.photo}
                    alt={post.alt}
                    // the card never renders wider than the clamp ceiling
                    sizes="330px"
                    className={FIGURE}
                  />
                  <p className={TITLE}>{post.title}</p>
                  <ReadLine label="Read" icon={post.icon} />
                </Link>
              </Reveal>
            ))}

            {/* ---- card 7: the GENEe card (`.jcard--ask`) --------------------
                Same figure shell, hover lift and shadows as the six thumbs, but
                the plate is filled GRADIENT_LINEAR(158deg, #0e4d4b → #0a3b39)
                with the 72px mark centred inside 28px of padding. It is the one
                card that carries a subtitle.

                The mark is the real exported glyph, not a reconstruction: id
                14604-2328 is in home-icons.json and is drawn to the source's own
                three vectors (a bubble, a question hook and a dot) already
                stroked #2ac3a2 at 3.3, which is exactly what
                `.jcard--ask .jcard__f svg{color:var(--c-teal-bright)}` produces. */}
            <Reveal as="li" delay={POSTS.length * 0.06} className={CARD}>
              <Link href="#meet-genee" className="group block">
                <div
                  className={`grid place-items-center bg-[linear-gradient(158deg,#0e4d4b_0%,#0a3b39_100%)] p-[28px] text-center text-linenw ${FIGURE}`}
                >
                  <HomeIcon id="14604-2328" className="h-[72px] w-[72px] shrink-0" />
                </div>
                <p className={TITLE}>Ask GENEe</p>
                <p className={SUB}>Bring your genetics questions.</p>
                <ReadLine label="Ask" icon="14849-2234" />
              </Link>
            </Reveal>
          </ul>
        </div>
      </div>

      {/* ---- `.jrn__ft` -----------------------------------------------------
          Back on the rail, clamp(34px,3.6vw,50px) below the scroller. `.btn` is
          r10 / pad 19-30 / gap 13 / Figtree 700 17, teal fill with a cream label
          — the inverse of the hero's java button, so the `primary` variant's two
          colours are overridden the way section 10 does it. */}
      <div className="px-5 sm:px-8 lg:px-[63px]">
        <div className="mx-auto mt-[clamp(34px,3.6vw,50px)] w-full max-w-[1313px]">
          <Reveal>
            <Cta
              href="/blog"
              icon="14957-259"
              className="bg-eden text-linenw shadow-[0_6px_18px_0_rgba(14,77,75,0.18)]"
            >
              Explore The Journal
            </Cta>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
