'use client';

// =============================================================================
// Homepage - SECTION 08 · WHAT WOULD YOU LIKE TO KNOW  (`.exp` / `.orb`)
// -----------------------------------------------------------------------------
// Ported from the designer's own build ("New Homepage Build/index.html": CSS
// block 13 at ~line 874, markup at 1692, JS block 5 ORBIT TABLIST at 2302 and
// `orbRadius()` at 2354). That page is the executable version of the Figma
// frame, so where the two disagree it wins.
//
// THIS IS A REAL TABLIST, NOT A STATIC LIST. The earlier port rendered only the
// selected state because the Figma frame carries copy for pane 1 alone. The HTML
// carries all six panes, a `role="tablist"` with roving tabindex, and full
// Arrow/Home/End keyboard handling - so all of that is reproduced here, and the
// component is a client component purely to hold the selected index.
//
// THE RING IS POLAR, NOT A HAND-PLACED HEXAGON. Each node is positioned by
//   translate(-50%,-50%) rotate(--a) translateX(--R) rotate(calc(--a * -1))
// off the ring's centre: the first rotate swings it out to its angle, the
// translateX pushes it to the radius, the counter-rotate stands the pill back
// up. --a is a constant per node (-90/-30/30/90/150/210deg); --R is 33.5% of the
// ring's RENDERED width, which only JS can know, hence the ResizeObserver. The
// frame's absolute pixel centres were a trace of this same circle; using them
// pinned each pill to the frame's own text width and drifted on any font metric
// change.
//
// BELOW lg THE RING IS ABANDONED, exactly as the source does at 980: the svg,
// the glow and the core are display:none, `.orb__nodes` becomes a static grid
// and every node becomes a full-width, left-aligned, wrapping button at radius
// 10. 980 has no named Tailwind breakpoint and the house rule forbids mixing an
// arbitrary min-width variant with named ones (v4 emits arbitrary min-widths
// first, so they always lose), so the split is at lg (1024). The 44px of extra
// width is the safer side of the source's number: at 980 the longest pill
// ("My Clinical Genetics") already grazes the ring's left edge.
//
// ICON COLOUR IS THE ONE THING THIS PORT CANNOT DO THE SOURCE'S WAY. The source
// draws every glyph from a `currentColor` sprite, so a node's icon simply
// follows its text colour through the selected/unselected transition. HomeIcon
// serves standalone SVG files as <img>, with the frame's colour BAKED IN - and
// the exported set is a snapshot of ONE state: 7665-292 (heart-pulse) is
// #062927 because pane 1 was selected in the frame, while the other five are
// #faf6ef because theirs were not. Rendered as-is, the heart-pulse would be
// invisible on the unselected pill's #062927 ground and the other five would be
// cream on teal when selected. So each glyph is re-tinted with a filter chain
// that starts at brightness(0) - which flattens whatever colour is baked in -
// and lands on the exact target hex (see TINT_* below).
//
// RADIUS: one radius site-wide - rounded-sm. See docs/DESIGN.md §2.
// written as explicit values.
// =============================================================================

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { HelixGround } from '../HelixGround';
import { HomeIcon } from '../HomeIcon';
import { Reveal } from '../motion';
import { Body, Cta, Heading, Kicker, Section } from '../ui';

/* -------------------------------------------------------------------------- */
/* glyph tints                                                                */
/* -------------------------------------------------------------------------- */

/**
 * Three filter chains that force a single-colour <img> glyph to an exact hex.
 *
 * Every chain opens with `brightness(0) saturate(100%)`, which crushes the
 * source SVG's baked stroke to pure black no matter what it was, so the rest of
 * the chain always starts from the same place. The remaining terms were solved
 * numerically against the target and land on it exactly (cream is out by 1/255
 * on two channels, which is below the perceptual floor).
 *
 * This exists because HomeIcon renders `<img>`, and an <img> cannot inherit
 * `currentColor` - see the header note. If HomeIcon ever gains a mask-based
 * mode, all three constants should be deleted in favour of `text-*`.
 */
/** -> #faf6ef, the source's `--c-cream` */
const TINT_CREAM =
  '[filter:brightness(0)_saturate(100%)_invert(78%)_sepia(36%)_saturate(34%)_hue-rotate(0deg)_brightness(113%)_contrast(102%)]';
/** -> #062927, the source's `--c-teal-ink` */
const TINT_ABYSS =
  '[filter:brightness(0)_saturate(100%)_invert(15%)_sepia(71%)_saturate(368%)_hue-rotate(128deg)_brightness(86%)_contrast(105%)]';
/** -> #2ac3a2, the source's `--c-teal-bright` */
const TINT_JAVA2 =
  '[filter:brightness(0)_saturate(100%)_invert(48%)_sepia(46%)_saturate(416%)_hue-rotate(117deg)_brightness(111%)_contrast(145%)]';

/* -------------------------------------------------------------------------- */
/* the six areas                                                              */
/* -------------------------------------------------------------------------- */

type Area = {
  label: string;
  /** the source's `--a`, i.e. where on the ring this node sits */
  angle: string;
  /**
   * One id per area, used at 18px in the node and at 23px in the pane header.
   *
   * The frame does ship a native 23px heart-pulse (7716-761) for pane 1, but it
   * is stroked 1.5 on a 23 viewBox (0.065 relative) while the 18px set is
   * stroked 1.5 on an 18 viewBox (0.083) - which is exactly the source sprite's
   * Lucide ratio (2 on 24). Scaling the 18px glyph up therefore matches the
   * SOURCE's stroke weight and keeps all six pane headers identical, which the
   * mixed set could not.
   */
  icon: string;
  question: string;
  detail: string;
  cta: string;
  /**
   * The source links all six at `href="#"`. Only `wellness` exists in the
   * catalog today (lib/categoriesdata.ts), so the four areas with no category
   * of their own point at the catalog index rather than at a route that 404s.
   */
  href: string;
};

const AREAS: Area[] = [
  {
    label: 'My Everyday Health',
    angle: '-90deg',
    icon: '7665-292',
    question: 'Why does my body respond the way it does?',
    detail:
      'Explore genetic insights related to nutrition, weight, fitness, metabolism, vitamins, food sensitivities, stress, sleep and more.',
    cta: 'Explore Wellness',
    href: '/categories/wellness',
  },
  {
    label: 'Our Future Family',
    angle: '-30deg',
    icon: '7762-468',
    question: 'What should we know before having a child?',
    detail:
      'Carrier screening and reproductive genetic testing can help prospective parents better understand certain inherited genetic risks before or during family planning.',
    cta: 'Explore Reproductive Genetics',
    href: '/categories',
  },
  {
    label: 'My Inherited Health',
    angle: '30deg',
    icon: '7956-462',
    question: 'What could my family history mean for me?',
    detail:
      'Explore genetic testing related to hereditary cancer predispositions, BRCA, cardiovascular health, hypertension, kidney health, eye health and other inherited conditions.',
    cta: 'Explore Health Tests',
    href: '/categories',
  },
  {
    label: 'My Origins',
    angle: '90deg',
    icon: '8053-325',
    question: 'Where did my story begin?',
    detail:
      'Explore your genetic ancestry, origins and inherited traits, and discover another side of the story that made you, you.',
    cta: 'Explore Ancestry',
    href: '/categories/wellness/ancestry',
  },
  {
    label: 'My Longevity',
    angle: '150deg',
    icon: '7956-147',
    question: 'What can I learn about how I’m aging?',
    detail:
      'Explore telomere, epigenetic age, longevity and healthy-aging insights to understand another dimension of your biological story.',
    cta: 'Explore Longevity',
    href: '/categories',
  },
  {
    label: 'My Clinical Genetics',
    angle: '210deg',
    icon: '7762-124',
    question: 'I need answers about a specific health concern.',
    detail:
      'Access specialty genetic testing supported by appropriate expert guidance and a trusted laboratory ecosystem.',
    cta: 'Explore Clinical Tests',
    href: '/categories',
  },
];

/** The source's CSS fallback for `--R`, used until the ring has been measured. */
const R_FALLBACK = 170;

/* -------------------------------------------------------------------------- */

export default function WhatToKnow() {
  const [selected, setSelected] = useState(0);
  // `--R` is 33.5% of the ring's rendered width. It cannot be a percentage in
  // the transform because translateX(%) resolves against the NODE's own width,
  // not the ring's - which is why the source computes it in JS too.
  const [radius, setRadius] = useState(R_FALLBACK);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;
    const measure = () => setRadius(Math.round(el.offsetWidth * 0.335));
    measure();
    // The source re-runs orbRadius() on window resize; a ResizeObserver also
    // catches the ring changing width without the window doing so (a font swap
    // reflowing the grid, the scrollbar appearing), which is the case that
    // leaves the nodes orbiting the wrong radius.
    //
    // Feature-detected with `typeof`, NOT `'ResizeObserver' in window`: the `in`
    // operator narrows, and because ResizeObserver is a declared member of
    // `Window` in lib.dom, the negative branch narrows `window` to `never` and
    // every use of it inside fails to compile.
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** The source's `select(i, focus)`: selection and focus move together. */
  function select(i: number, focus = false) {
    setSelected(i);
    if (focus) tabRefs.current[i]?.focus();
  }

  function onTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    const last = AREAS.length - 1;
    let next: number | null = null;
    // Both axes move the selection, because this tablist is a RING at lg and a
    // vertical stack below it - neither orientation is wrong for it.
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = i === last ? 0 : i + 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = i === 0 ? last : i - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    select(next, true);
  }

  return (
    <Section
      id="what-would-you-like-to-know"
      ground="abyss"
      // The section's own two-stop ground (172deg), NOT the hero's three-stop
      // abyss. `isolate` + a non-transparent fill are what keep HelixGround's
      // z-index:-1 behind this section rather than behind the page.
      className="relative isolate overflow-clip bg-[linear-gradient(172deg,#0a3b39_0%,#062927_100%)]"
      // --sp-sec, this page's section rhythm - larger than the Section
      // primitive's default, which is tuned for the shorter cream sections.
      innerClassName="py-[clamp(84px,10vw,168px)]"
    >
      <HelixGround place="explore" tone="dark" />

      {/* ---- header.shead.shead--split -------------------------------------
          1.35fr / 0.85fr, bottom-aligned so the lead's last line sits on the
          headline's baseline. Below the split it stacks and switches to
          top-aligned, because bottom-aligning a stack does nothing but leave a
          gap above the lead. */}
      <Reveal
        as="header"
        className="mb-[clamp(46px,5vw,84px)] grid items-start gap-[clamp(22px,3vw,56px)] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:items-end"
      >
        <div className="min-w-0">
          <Kicker className="mb-[clamp(22px,2.2vw,32px)]">Explore KYG</Kicker>

          {/* .h2 is 400 weight with the turn in Cormorant italic at 1.1em - one
              <h2>, two typefaces. No <br>: the source relies on text-wrap
              balance, which breaks the line where it actually fits instead of
              where a 1440 artboard happened to. */}
          <Heading
            className="text-balance text-[clamp(31px,3.5vw,55px)] tracking-[-0.03em] text-linenw [&_em]:text-[1.1em]"
            html={'What would you like to know <em>about yourself?</em>'}
          />
        </div>

        {/* .lead - larger than Body's default ramp, hence the overrides. */}
        <Body className="text-[clamp(19px,1.45vw,24px)] leading-[1.46] tracking-[-0.015em] text-linenw/[0.86]">
          Six directions, one set of genes. Choose the question that sounds most like yours.
        </Body>
      </Reveal>

      {/* ---- div.orb -------------------------------------------------------
          Two equal columns at lg, one below. `items-center` hangs the pane's
          330-tall box on the ring's centre line. */}
      <Reveal
        variant="scale"
        className="grid gap-[34px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-[clamp(30px,4vw,72px)]"
      >
        {/* --- div.orb__ring ------------------------------------------------
            Square and capped at 580 only once the ring exists; below lg this
            same box is just the wrapper around the stacked button list, so it
            must NOT keep its aspect ratio or it would reserve a tall empty
            square under the buttons. */}
        <div
          ref={ringRef}
          style={{ '--R': `${radius}px` } as React.CSSProperties}
          className="relative w-full lg:aspect-square lg:max-w-[580px] lg:justify-self-center"
        >
          {/* Three concentric strokes at cream/16. The two outer ones counter-
              rotate at 64s and 96s so the moiré between them never repeats on
              a timescale anyone will sit through; the middle one is static.

              transform-origin is set on BOTH animated circles. The source only
              sets it on `.dash`, which leaves `.dash2` spinning about the
              viewBox origin (0,0) rather than its own centre - a circle swung
              around a corner, which is plainly not the intent. */}
          <svg
            viewBox="0 0 100 100"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          >
            <circle
              cx="50"
              cy="50"
              r="31"
              fill="none"
              stroke="#faf6ef"
              strokeOpacity="0.16"
              strokeWidth="0.5"
              strokeDasharray="2 9"
              strokeLinecap="round"
              className="animate-hv2-spin [transform-origin:50%_50%] motion-reduce:animate-none"
            />
            <circle
              cx="50"
              cy="50"
              r="24"
              fill="none"
              stroke="#faf6ef"
              strokeOpacity="0.16"
              strokeWidth="0.3"
              strokeDasharray="1 3"
            />
            <circle
              cx="50"
              cy="50"
              r="39"
              fill="none"
              stroke="#faf6ef"
              strokeOpacity="0.16"
              strokeWidth="0.35"
              strokeDasharray="1 14"
              className="animate-hv2-spin-slow [transform-origin:50%_50%] motion-reduce:animate-none"
            />
          </svg>

          {/* span.orb__glow - the centring translate is duplicated here AND in
              the keyframes: the animation owns the transform while it runs, but
              under prefers-reduced-motion it is switched off and the static
              translate is all that stops the glow sitting at the ring's
              top-left corner. */}
          <span
            aria-hidden="true"
            className="animate-hv2-pulse pointer-events-none absolute left-1/2 top-1/2 hidden h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(42,195,162,0.3),transparent_68%)] blur-[14px] motion-reduce:animate-none lg:block"
          />

          {/* div.orb__core - 31% of the ring, so it scales with it. "GENES" is
              typed in caps in the source rather than upper-cased in CSS; no
              `uppercase` here, which would hide that. */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 hidden aspect-square w-[31%] -translate-x-1/2 -translate-y-1/2 place-content-center rounded-sm bg-[rgba(6,41,39,0.72)] text-center shadow-[inset_0_0_0_1px_rgba(42,195,162,0.42)] lg:grid"
          >
            <span className="block font-kyg text-[15px] font-semibold leading-[1.62] tracking-[0.06em] text-linenw/60">
              Your
            </span>
            <b className="block font-kyg text-[clamp(19px,2.1vw,28px)] font-extrabold leading-[1.62] tracking-[-0.02em] text-java2">
              GENES
            </b>
          </div>

          {/* --- div.orb__nodes: the tablist -------------------------------
              A static 9-gap grid below lg; the ring's own coordinate space at
              lg, where each child places itself polar off the centre. */}
          <div
            role="tablist"
            aria-label="Areas of discovery"
            className="grid gap-[9px] lg:absolute lg:inset-0 lg:block"
          >
            {AREAS.map((area, i) => {
              const on = i === selected;
              return (
                <button
                  key={area.label}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}t${i}`}
                  aria-controls={`${uid}p${i}`}
                  aria-selected={on}
                  // Roving tabindex: the tablist is ONE tab stop and the arrow
                  // keys move within it.
                  tabIndex={on ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  style={{ '--a': area.angle } as React.CSSProperties}
                  className={cn(
                    'group inline-flex w-full items-center justify-start gap-[10px] whitespace-normal',
                    // 15+15 pad over a 25.1 line box = 55 tall stacked, 47.1 on
                    // the ring - both clear the 44px tap-target floor.
                    'rounded-sm px-[18px] py-[15px] text-left',
                    'font-kyg text-[15.5px] font-bold leading-[1.62] tracking-[-0.008em]',
                    'transition-[background-color,box-shadow,color] duration-580 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    'lg:absolute lg:left-1/2 lg:top-1/2 lg:w-auto lg:whitespace-nowrap lg:rounded-sm lg:px-[17px] lg:py-[11px]',
                    // rotate out -> push to the radius -> stand the pill back up
                    'lg:[transform:translate(-50%,-50%)_rotate(var(--a))_translateX(var(--R))_rotate(calc(var(--a)*-1))]',
                    on
                      ? // the second shadow is a 6px SPREAD at 0 blur, i.e. a
                        // halo ring rather than a glow
                        'bg-java2 text-abyss shadow-[0_0_0_6px_rgba(42,195,162,0.16),0_10px_30px_rgba(0,0,0,0.28)]'
                      : // an INSET hairline, not a border - a border would grow
                        // the 47.1 box and break the ring's spacing
                        'bg-[rgba(6,41,39,0.82)] text-linenw/[0.82] shadow-[inset_0_0_0_1px_rgba(250,246,239,0.17)] hover:text-linenw hover:shadow-[inset_0_0_0_1px_rgba(42,195,162,0.5)]'
                  )}
                >
                  <HomeIcon
                    id={area.icon}
                    className={cn(
                      'h-[18px] w-[18px] shrink-0',
                      // filter joins the source's opacity/transform transition
                      // so the recolour crossfades with the pill instead of
                      // snapping at the start of it
                      // `scale` is listed alongside `transform`: Tailwind v4's
                      // scale-* writes the standalone `scale` property, so a
                      // list naming only `transform` would never animate it
                      'transition-[opacity,transform,scale,filter] duration-770 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      'group-hover:scale-110 motion-reduce:transition-none',
                      on ? cn(TINT_ABYSS, 'opacity-100') : cn(TINT_CREAM, 'opacity-[0.72] group-hover:opacity-100')
                    )}
                  />
                  <span className="min-w-0">{area.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* --- div.orb__panes ----------------------------------------------
            All six panels stay in the DOM and the inactive ones carry `hidden`
            - aria-controls has to resolve to a real element, and re-mounting
            would throw away the panel the user just tabbed into. The 330 floor
            stops the column resizing as the copy changes length; below lg it is
            dropped, where a 330 floor would just add dead space. */}
        <div className="relative lg:min-h-[330px]">
          {AREAS.map((area, i) => {
            const on = i === selected;
            return (
              <div
                key={area.label}
                role="tabpanel"
                id={`${uid}p${i}`}
                aria-labelledby={`${uid}t${i}`}
                // focusable so a keyboard user can leave the tablist and reach
                // the panel's link without a pointer
                tabIndex={0}
                hidden={!on}
                // The class is applied CONDITIONALLY, mirroring the source's
                // `.orb__p:not([hidden])` - that is what re-triggers the
                // entrance on every switch. A permanent class would only ever
                // play once, at mount.
                className={cn('relative', on && 'animate-hv2-pane-in motion-reduce:animate-none')}
              >
                {/* span.orb__hd - the 48 tile is radius 14, and the glyph is
                    re-tinted to teal because the exported file's baked colour
                    is whatever state the frame captured. */}
                <span className="mb-[18px] flex items-center gap-[14px]">
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-sm bg-java2/[0.13]"
                  >
                    <HomeIcon id={area.icon} className={cn('h-[23px] w-[23px]', TINT_JAVA2)} />
                  </span>
                  <span className="min-w-0 font-kyg text-[14px] font-extrabold uppercase leading-[1.62] tracking-[0.16em] text-java2">
                    {area.label}
                  </span>
                </span>

                {/* The source marks this up as a <p>. It is an h3 here because
                    it is the panel's visible title and the only heading in it -
                    subordinate to the section's own h2, never a second section
                    heading. Nothing about the rendering changes: .orb__q is
                    400 weight, so the h3 is explicitly un-bolded. */}
                <h3 className="mb-[18px] text-balance font-kyg text-[clamp(24px,2.5vw,36px)] font-normal leading-[1.14] tracking-[-0.03em] text-linenw">
                  {area.question}
                </h3>

                {/* .orb__d is a flat 18px, not the Body ramp, and 52ch wide.
                    Its bottom margin is 10 rather than the source's 24 because
                    the link below buys the missing 14 back as top padding -
                    see there. */}
                <Body className="mb-[10px] max-w-[52ch] text-[18px] leading-[1.66] text-linenw/70">{area.detail}</Body>

                {/* a.tlink - a text link, no fill and no radius. The rule under
                    it wipes in from the left on hover and the arrow steps 5px
                    right, both from the source.

                    pt-14 IS NOT DECORATION: the source's box is 26.7 of text
                    over 3 of padding, a ~30px tap target. 14 of top padding
                    lifts it to 43.7 without moving the rule, which stays welded
                    to the text's bottom edge; the paragraph above gives up the
                    same 14, so the visual gap is still the source's 24. */}
                <Link
                  href={area.href}
                  className="group/tl relative inline-flex w-fit items-center gap-[10px] pb-[3px] pt-[14px] font-kyg text-[16.5px] font-bold leading-[1.62] tracking-[-0.008em] text-java2"
                >
                  <span>{area.cta}</span>
                  <HomeIcon
                    id="7957-886"
                    className="h-[19px] w-[19px] shrink-0 transition-transform duration-640 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tl:translate-x-[5px] motion-reduce:transition-none"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] origin-left scale-x-0 bg-current transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/tl:scale-x-100 motion-reduce:transition-none"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/* ---- footer.orb__ft ------------------------------------------------
          The rule TAPERS: it is opaque for the first 34% of the width and gone
          by 92%, which is a border-image, not a border-color. A plain border
          would run edge to edge and read as a table rule. */}
      <Reveal className="mt-[clamp(44px,5vw,76px)] flex flex-wrap items-center justify-between gap-[22px] border-t border-solid pt-[clamp(26px,2.8vw,38px)] [border-image:linear-gradient(90deg,rgba(250,246,239,0.17)_0%,rgba(250,246,239,0.17)_34%,rgba(250,246,239,0)_92%)_1]">
        <p className="font-tst text-[clamp(21px,2vw,29px)] font-medium italic leading-[1.3] text-linenw/[0.78]">
          One you. A lifetime of genetic insight.
        </p>

        <Cta href="/categories" icon="8288-1327">
          Explore Your Genes
        </Cta>
      </Reveal>
    </Section>
  );
}
