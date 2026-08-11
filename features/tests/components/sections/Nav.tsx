import Link from 'next/link';
import type { Ground, NavSection } from '../../types';

// =============================================================================
// Page chrome — the header. Geometry read 1:1 from the frame (spec
// 000000_header):
//
//   HEADER        1440 × 74, pad 0/80, fill #faf6ef@85, BACKGROUND_BLUR 12,
//                 individualStrokeWeights {bottom:1} #222222@10 → one hairline
//                 under the bar (that 1px is the whole difference between the
//                 74 frame and its 73 tall child).
//   nav.mx-auto   1280 × 73, pad 14/32, HORIZONTAL SPACE_BETWEEN / CENTER
//                 → the real content rail is 1216, and the two 292.5 gaps are
//                 what `justify-between` hands out for free.
//   logo          154 × 32 · Figtree 21/31.5 ls -0.525, ALL #0e4d4b.
//                 characterStyleOverrides split it 4/4/5:
//                 "Know" 800 · "Your" 500 · "Genes" 800 — same teal throughout
//                 (the frame is literally named "Logo stays fully on-brand
//                 teal - never recoloured", so no second colour here).
//   ul.hidden     gap 28 · Figtree 500 14.5/21.75 #5b564e.
//   Component 15  122 × 45 pill, r999, #0e4d4b on a 1px #0e4d4b stroke,
//                 pad 11/22, DROP_SHADOW 0 10 24 rgba(14,77,75,.28);
//                 label Figtree 800 14/21 ls .056 #ffffff.
//                 It carries NO trailing glyph, so it is a plain <Link/> —
//                 <Cta/> from ui.tsx always renders an arrow.
//
// The frame's header is already tinted + blurred + hairlined at scroll 0, so
// there is no "stuck" state to track: sticky is pure CSS and this stays a
// server component.
//
// SMALL SCREENS. The bar is two shrink-0 blocks either side of a hidden ul, so
// its floor is logo 154 + gap 24 + pill 122 = 300. Inside `px-5` that needs a
// 340 viewport, which is fine from 360 up (Android's narrowest common width)
// but blows through 320 by 20px. Rather than shrink the mark on every phone,
// the three `max-[359px]` steps below only bite under 360: logo 21→18 (~132),
// gap 24→12, pill pad 22→16 (~110) = 254 inside 280. Everything at 360+ —
// and therefore everything the frame describes — is untouched.
//
// The ul stays desktop-only: at md the three blocks come to 631 + 2 gaps = 679
// against a 688 rail, so revealing it there would be 9px from overflowing.
// 1024 is the first width with real slack, which is why it is `lg:flex`. Below
// that the anchors have no home — see the escalation note in the audit, this
// is a design decision, not something to invent a hamburger for.
//
// Its links carry `py-3` for a 40px touch target on the 1024-plus tablets that
// do see them. Padding on an INLINE box is hit-tested but never joins the line
// box, so that costs zero layout: the ul stays 22 tall and the bar stays 73.
// =============================================================================

export default function Nav({ data }: { data: NavSection; ground?: Ground }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-mine/10 bg-linenw/85 px-5 backdrop-blur-md sm:px-10 lg:px-20">
      <nav
        aria-label="Test page"
        className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-6 py-3.5 max-[359px]:gap-3 lg:px-8"
      >
        <Link
          href={data.brandHref}
          aria-label="KnowYourGenes"
          className="shrink-0 font-kyg text-[21px] leading-[31.5px] tracking-[-0.525px] text-eden max-[359px]:text-[18px] max-[359px]:leading-6.75"
        >
          <span className="font-extrabold">Know</span>
          <span className="font-medium">Your</span>
          <span className="font-extrabold">Genes</span>
        </Link>

        <ul className="hidden items-center gap-7 lg:flex">
          {data.links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="py-3 font-kyg text-[14.5px] font-medium leading-[21.75px] text-fusc transition-colors duration-200 hover:text-eden"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={data.cta.href}
          className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full border border-eden bg-eden px-[22px] py-[11px] font-kyg text-[14px] font-extrabold leading-[21px] tracking-[0.056px] text-white shadow-[0_10px_24px_0_rgba(14,77,75,0.28)] transition duration-200 hover:bg-eden2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-java max-[359px]:px-4"
        >
          {data.cta.label}
        </Link>
      </nav>
    </header>
  );
}
