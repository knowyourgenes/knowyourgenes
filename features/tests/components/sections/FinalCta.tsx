import Link from 'next/link';
import type { FinalCtaSection, Ground } from '../../types';
import { FigmaIcon } from '../FigmaIcon';
import { Heading, Section } from '../ui';

// =============================================================================
// FINAL — ink closing band, 1440 x 532 (section spec 017114_final)
// -----------------------------------------------------------------------------
// Frame geometry, straight off the node tree:
//
//   FINAL        1440x532, VERTICAL, pad 112/360, fill #141b1a
//   glow         600x600 circle @ x420 y-210, #0e4d4b@55, LAYER_BLUR 90
//   column       720 wide (so pad 360 either side), own 32 padding
//                -> 656 content, VERTICAL gap 16, centred
//     eyebrow    261x46  r999  #25b5ab@14 fill, 1px #25b5ab@28, crimson glow
//     h2          656x75  Figtree 700 57/61.6 ls -0.02em #faf6ef
//                        + Cormorant 600 italic 57 #2ac3a2 accent
//     ticks      656x37  HORIZONTAL gap 24, pad-bottom 16
//     cta        186x60  r999 white, 4px white halo + deep drop
//     note       656x27  pad 7/0/1/0
//   112 + (46+16+75+16+37+16+60+16+27) + 112 = 532 ✓
//
// Two things the raw numbers hide:
//   • every pill/button box in this frame carries a 1px OUTSIDE stroke, which
//     is why 17+22+10+188+22 = 259 is reported as 261 and 17+24+17 = 58 as 60.
//     `border` + border-box reproduces both exactly.
//   • the h2 box is 75 tall but its line box is 61.6 and sits 11 from the top,
//     so the heading carries pt-11/pb-2 rather than a taller leading — that
//     keeps the text where the frame puts it AND the next gap where it lands.
//
// The eyebrow is the tinted-on-ink pill (teal@14 ground, ice label), not the
// white one in ui.tsx, and the CTA carries the frame's own arrow glyph and the
// white-halo shadow pair — same treatment as the THE NUMBERS button. Both are
// built here for that reason.
// =============================================================================

/** The three ticks each carry their own copy of the arrow glyph, in frame order. */
const TICK_ICONS = ['17377-494', '17377-656', '17377-818'] as const;

export default function FinalCta({ data, ground }: { data: FinalCtaSection; ground?: Ground }) {
  return (
    <Section
      ground={ground ?? 'ink'}
      className="relative overflow-hidden"
      innerClassName="relative py-[clamp(72px,7.8vw,112px)]"
    >
      {/* The frame's single decorative element: a 600px eden disc centred on the
          artboard, top at -210 (i.e. -322 from the content top), clipped by the
          band. Figma layer blur 90 ≈ CSS blur(45px) — the radius is twice the
          Gaussian sigma CSS filters take. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-210px] size-[600px] -translate-x-1/2 rounded-full bg-eden/55 blur-[45px]"
      />

      {/* The frame's 32px column padding is the FRAME's own gutter — below sm it
          would sit on top of the shell's px-5 and squeeze the 261px eyebrow into
          216px, so it only kicks in once the viewport can afford it. */}
      <div className="relative mx-auto flex w-full max-w-[720px] flex-col items-center gap-4 text-center sm:px-8">
        {/* ---- eyebrow: 261x46, pad 11/22/11/17, gap 10 -------------------- */}
        {/* min-h + py-[9px] instead of a hard h-[46px]: 26 (glyph) + 18 + 2
            (border) = 46 exactly, so the pill is pixel-identical on the frame,
            but a label that has to wrap grows the pill instead of spilling out. */}
        <span className="inline-flex min-h-[46px] shrink-0 items-center gap-2.5 rounded-full border border-java/28 bg-java/14 py-[9px] pl-[17px] pr-[22px] shadow-tst-crimson">
          {/* 22x26 glyph in a 22px optical box, centred on the pill's midline */}
          <FigmaIcon id="17236-608" className="h-[26px] w-[22px] shrink-0" />
          <span className="font-kyg text-[14px] font-extrabold leading-[21px] tracking-[0.08em] text-ice">
            {data.eyebrow.label}
          </span>
        </span>

        {/* ---- h2: Figtree 700 57/61.6 #faf6ef, java2 serif accent --------- */}
        {/* This is the ONE accent the frame fills flat (#2ac3a2) rather than with
            the 5-stop teal gradient, so `tst-flat` switches the gradient off and
            lets the plain text-java2 utility take over. `leading-[1.08]` is
            restated because tailwind-merge drops the base <Heading> leading when
            a custom text-[...] size is passed in. */}
        <Heading
          html={data.titleHtml}
          className="tst-flat pb-[2px] pt-[11px] text-[clamp(32px,3.96vw,57px)] leading-[1.08] text-linenw [&_.tst-em-teal]:text-java2"
        />

        {/* ---- ticks: gap 24, pad-bottom 16 -------------------------------- */}
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-4">
          {data.chips.map((c, i) => (
            // min-w-0: the three ticks total 453 of the frame's 656, so they
            // never shrink there — but on a 280px phone column a long label has
            // to be allowed to wrap instead of pushing out of the band.
            <li key={i} className="flex min-w-0 items-center gap-2">
              {/* 19x22 glyph pulled to the 19x18 box the frame lays out */}
              <FigmaIcon
                id={TICK_ICONS[i] ?? TICK_ICONS[0]}
                className="my-[-2px] h-[22px] w-[19px] shrink-0"
              />
              <span
                className="wrap-break-word font-kyg text-[13.5px] font-semibold leading-[20.2px] text-linenw/70"
                dangerouslySetInnerHTML={{ __html: c.label }}
              />
            </li>
          ))}
        </ul>

        {/* ---- cta: 186x60, pad 17/34, gap 10, Figtree 800 16/24 #0e4d4b --- */}
        {/* ls is 0.06 PX in the frame (0.00375em), not 0.004em — written in px so
            it stays exact and does not scale with the fixed 16px label. */}
        <Link
          href={data.cta.href}
          className="group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-full border border-white bg-white px-[34px] py-[17px] font-kyg text-[16px] font-extrabold leading-6 tracking-[0.06px] text-eden shadow-[0_0_0_4px_rgba(255,255,255,0.16),0_14px_32px_0_rgba(0,0,0,0.22)] transition duration-200 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-java"
        >
          {data.cta.label}
          <FigmaIcon
            id="17449-758"
            className="h-6 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>

        {/* ---- note: Figtree 400 12.5/18.8 #faf6ef@55, pad 7/0/1/0 --------- */}
        <p
          className="wrap-break-word pb-px pt-[7px] font-kyg text-[12.5px] leading-[18.8px] text-linenw/55"
          dangerouslySetInnerHTML={{ __html: data.noteHtml }}
        />
      </div>
    </Section>
  );
}
