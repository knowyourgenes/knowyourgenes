// =============================================================================
// About Us — SECTION 12 · FINAL CTA
// -----------------------------------------------------------------------------
// Figma frame: 1440 x 841, ink ground (#141b1a), pad 116/310. The 820-wide inner
// column carries its own 32 of padding, so the real content rail is 756 — which
// is what <Section> + max-w-[756px] reproduces at 1440.
//
// Two decorative layers sit behind the copy: a 620px eden circle bleeding off the
// top edge under a 90-radius layer blur, and a full-bleed white radial wash at 5%.
//
// RADIUS TRAP: this project remaps Tailwind's radius scale, so every non-22/26
// radius here is written as an explicit arbitrary value (999 -> rounded-full,
// 2 -> rounded-[2px], 3.5 -> rounded-full on a 7px dot).
// =============================================================================

import Link from 'next/link';

import { AboutIcon } from '../AboutIcon';
import { Body, Eyebrow, Heading, Section } from '../ui';

/** One capsule in the "full-circle" flow strip. Frame: h 49, pad 21, gap 8. */
function ChainNode({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex h-[49px] shrink-0 items-center gap-2 rounded-full border border-eden bg-eden px-[21px] shadow-[0_12px_30px_0_rgba(14,77,75,0.28)]">
      <AboutIcon id={icon} className="h-[25px] w-[21px] shrink-0" />
      <span className="font-kyg text-[15px] font-extrabold leading-[17px] tracking-[0.3px] text-linenw">
        {label}
      </span>
    </span>
  );
}

/**
 * The 52x2 gradient rule between capsules, with its lit 7px node on the left.
 *
 * Only drawn from lg up. The full chain measures 544 (four capsules) + 54 (six
 * 9px gaps) + 156 (three rules) = 754, and the 756 rail only exists at lg and
 * above; below that the connectors are hidden so the capsules can wrap as a
 * clean grid instead of leaving a rule dangling off a row edge. It is also NOT
 * shrink-0: at lg the row is nowrap with just 2px of slack, so the rules absorb
 * any font-metric drift rather than overflowing the rail.
 */
function ChainLink() {
  return (
    <span
      aria-hidden
      className="relative hidden h-[2px] w-[52px] rounded-[2px] bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(42,195,162,0.6),rgba(255,255,255,0.08))] lg:block"
    >
      <span className="absolute left-[-3px] top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full bg-java shadow-[0_0_10px_0_rgba(37,181,171,0.85)]" />
    </span>
  );
}

export default function FinalCta() {
  return (
    <Section
      ground="ink"
      id="start-with-knowing"
      className="relative overflow-hidden"
      innerClassName="py-[clamp(64px,8.06vw,116px)]"
    >
      {/* 620px eden orb, centred on the artboard and bleeding 220 above the edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-220px] z-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-eden/55 blur-[45px]"
      />
      {/* Full-bleed white radial wash at 5%. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),rgba(255,255,255,0))]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[756px] flex-col gap-9">
        {/* ---- eyebrow + headline + standfirst ------------------------------ */}
        <div className="flex flex-col items-center gap-[15px]">
          <Eyebrow
            label="Start with knowing"
            icon="13011-616"
            tone="ink"
            // Every metric (pad 8/17/8/13, gap 9, glyph 19x23, label 13.5/20.2
            // ls 0.11em, weight 700) comes from the shared primitive, INCLUDING
            // the case: this node is textCase=UPPER in the frame, like all 61
            // uppercase runs on the page. See the Eyebrow note in ui.tsx — the
            // `characters` field stores text as-typed, so it reads "Start with
            // knowing" while the frame renders "START WITH KNOWING".
          />

          <Heading
            html="Your health story is <em class='abt-grad-ink'>already being <br class='hidden md:inline' />written.</em>"
            className="pb-px pt-4 text-center text-[clamp(30px,3.5vw,50px)] leading-[1.05] tracking-[-0.018em] text-linenw"
          />

          <Body
            html="You can't rewrite your genes. But you can choose to understand them. And sometimes, knowing a little more about yourself can change the questions you ask, the conversations you have, and the choices you make next."
            className="mx-auto max-w-[600px] pb-px text-center text-[clamp(15px,1.25vw,18px)] leading-[1.62] text-linenw/75"
          />
        </div>

        {/* ---- full-circle: the hero's flow, now complete and fully lit -----
            CASE GUARD — do NOT add `uppercase` to these four capsules. The Hero
            renders the same Genes/Information/Insight/Awareness chain and THOSE
            are textCase=UPPER (manifest y=1107.3, 13px/700, ls 0.14em). This
            chain is a different node: 15px/800, ls 0.3px (0.02em), and it is
            absent from .about-case-manifest.json, i.e. textCase=AS_TYPED. The
            manifest is exhaustive for the About frame, so "same words as the
            hero" is not evidence — sentence case here is frame-accurate. */}
        <div className="flex flex-wrap items-center justify-center gap-x-[9px] gap-y-2.5 pt-1 lg:flex-nowrap">
          <ChainNode icon="13364-363" label="Genes" />
          <ChainLink />
          <ChainNode icon="13364-550" label="Information" />
          <ChainLink />
          <ChainNode icon="13364-777" label="Insight" />
          <ChainLink />
          <ChainNode icon="13364-969" label="Awareness" />
        </div>

        {/* ---- calls to action --------------------------------------------- */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/categories/wellness"
            className="inline-flex min-h-[56px] items-center justify-center gap-[9px] rounded-full border border-white bg-white px-7 py-[15px] shadow-[0_10px_26px_0_rgba(14,77,75,0.22)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span className="font-kyg text-[15.5px] font-bold leading-[23px] text-eden">
              Explore Genetic Testing
            </span>
            <AboutIcon id="13453-688" className="h-[23px] w-[19px] shrink-0" />
          </Link>

          <Link
            href="/categories/wellness/womens-health#how-it-works-steps"
            className="inline-flex min-h-[56px] items-center justify-center gap-[9px] rounded-full border border-[rgba(234,246,243,0.28)] px-7 py-[15px] transition-colors duration-200 hover:border-[rgba(234,246,243,0.55)] hover:bg-white/5"
          >
            <span className="font-kyg text-[15.5px] font-bold leading-[23px] text-[#eaf6f3]">
              See How It Works
            </span>
            <AboutIcon id="13453-913" className="h-[23px] w-[19px] shrink-0" />
          </Link>
        </div>

        {/* ---- closing statement ------------------------------------------- */}
        <p className="pt-5 text-center font-kyg text-[clamp(30px,4.45vw,64px)] font-semibold leading-none tracking-normal text-linenw">
          Start with <em className="abt-grad-ink">knowing.</em>
        </p>
      </div>
    </Section>
  );
}
