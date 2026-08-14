// =============================================================================
// Homepage - SECTION 15 · FINAL CTA
// -----------------------------------------------------------------------------
// Rebuilt against the designer's own build ("New Homepage Build/index.html",
// `section.fin`, CSS section 20), which is the page the Figma frame was traced
// from. Where the flattened frame and the HTML disagree the HTML wins, because
// it is the executable version - and it disagreed about the whole backdrop.
//
// WHAT THE BACKDROP ACTUALLY IS. The frame reads as "helix artwork at 75%", so
// this section used to render an exported PNG. It is not a PNG: it is the
// SECOND live particle helix (`<canvas id="helix2">`), the same `makeHelix`
// instance that runs behind the hero, tuned quieter. The 0.75 the frame
// recorded is `.fin__cv{ opacity:.75 }` on that canvas.
//
// PAINT ORDER, straight from the source's z-indexes:
//   section background   radial bloom over the 172deg linear (one `background`,
//                        two layers - the bloom is a layer of the fill, NOT a
//                        separate element, so it can never sit over the canvas)
//   z-1  .fin__cv        the particle strand, spanning the whole panel
//   z-2  .fin__in        the copy shell
// Reproduced here as `isolate` on the section plus `-z-10` on the canvas: a
// negative z-index child paints above its stacking context's own background but
// below every in-flow sibling, which is exactly the 1/2 split above, and it
// needs no z-index on the copy at all.
//
// The two headline faces share ONE line-height: `.fin__h` is 1.12 and the
// Cormorant `em` inherits it at 1.1em of the size. Do not "fix" that to a px
// value - the italic's larger body would then sit off the sans baseline.
//
// CASE TRAP: "KNOW YOUR GENES" is stored uppercase in the source's own markup -
// it is not a text-transform. It is written out literally and carries no
// `uppercase` class. Its FLUID tracking (clamp .06em -> .18em) is what makes the
// line read as a wordmark; at 320px the 0.18em would push it to three lines,
// which is why the source lets the tracking shrink with the type.
//
// RADIUS TRAP: both CTAs are radius 10, not capsules - that comes free from
// <Cta> (`--r-xs:10px` in the source). Nothing here is 999.
// =============================================================================

import { Body, Cta, Heading, Section } from '../ui';
import { HelixCanvas, FINAL_HELIX } from '../HelixCanvas';
import { Reveal } from '../motion';

export default function FinalCta() {
  return (
    <Section
      id="final-cta"
      // ground="abyss" supplies the cream ink for this dark panel; the fill
      // itself is overridden below because `.fin` is NOT the hero's ground -
      // it is a flatter 172deg two-stop with its own bloom placed high and
      // centre (60% 56% at 50% 34%), which is what lights the headline rather
      // than the hero's off-centre corner wash.
      ground="abyss"
      className={[
        'relative isolate text-center',
        // `overflow:clip` in the source, not hidden: the panel must never
        // become a scroll container, and the canvas is sized to the box anyway.
        'overflow-clip',
        'bg-[radial-gradient(60%_56%_at_50%_34%,rgba(37,181,171,0.20),transparent_66%),linear-gradient(172deg,#0a3b39_0%,#062927_100%)]',
      ].join(' ')}
      // `.fin{ padding-block:clamp(96px,11vw,180px) }` - the page's deepest
      // section padding, and the reason the closing panel reads as an ending.
      innerClassName="py-[clamp(96px,11vw,180px)]"
    >
      {/* ---- the second particle helix --------------------------------------
          `.fin__cv{ position:absolute; inset:0; z-index:1; opacity:.75 }`.

          <Section> puts the gutter on the <section> itself (px-5 / sm:px-8 /
          lg:px-[63px]) and the containing block of an absolutely positioned
          child is the PADDING box of its nearest positioned ancestor - the
          padding AREA is inside that box, so `inset-0` here is already the full
          1440 bleed, gutter included, even though this canvas is nested inside
          the 1313 rail. The rail div is deliberately NOT `relative`; making it
          so would crop the strand to 1313 and shift its axis off centre.

          FINAL_HELIX is the source's `helixB` argument list verbatim
          (ax .5, rad .05, radMax 66, turns 3.4, per 120, speed .038, dim .62,
          motes 10, rung 4): centred, slower and dimmer than the hero's so the
          strand never competes with the CTA in front of it. */}
      <HelixCanvas
        config={FINAL_HELIX}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-75"
      />

      {/* ---- headline -------------------------------------------------------
          One text node, not two: the source sets `text-wrap:balance` on a 17ch
          measure and lets the browser choose the break. A hard <br> here (which
          this section used to carry) fixes the break at the desktop width and
          leaves an orphaned "Or have you?" on a phone.

          `em` is the Cormorant italic run - <Heading> already styles it
          (font-tst / 500 / italic / tracking-normal); only the source's 1.1em
          size bump is added, because Cormorant runs small against Figtree. */}
      <Reveal>
        <Heading
          as="h2"
          className="mx-auto max-w-[17ch] text-balance text-[clamp(34px,5vw,80px)] font-light leading-[1.12] tracking-[-0.038em] text-linenw [&_em]:text-[1.1em]"
          html="You have known yourself all your life. <em>Or have you?</em>"
        />
      </Reveal>

      {/* `.fin__b`: margin clamp(24px,2.6vw,34px) auto 0, 60ch, 1.64 leading at
          70% cream. The margin lives on the Reveal wrapper rather than the <p>
          so it cannot collapse through the animated box. */}
      <Reveal delay={0.06} className="mt-[clamp(24px,2.6vw,34px)]">
        <Body className="mx-auto max-w-[60ch] leading-[1.64] text-linenw/70">
          One sample can open a new conversation with your body, your health, your family and your story.
        </Body>
      </Reveal>

      {/* `.fin__t`: Cormorant 500 italic, teal-bright, tracking reset to 0 -
          the page's -0.005em body tracking would close the italic up. */}
      <Reveal delay={0.1} className="mt-[22px]">
        <p className="font-tst text-[clamp(22px,2.2vw,31px)] font-medium italic leading-[1.3] tracking-normal text-java2">
          There is more to you than you know.
        </p>
      </Reveal>

      {/* `.fin .ctas`: gap 16, centred, margin-top clamp(34px,3.6vw,48px). Same
          pair as the hero, so the page closes on the journey it opened with.
          flex-wrap is what lets them stack at 320. */}
      <Reveal delay={0.14} className="mt-[clamp(34px,3.6vw,48px)]">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* `.btn--glow` in the source: a ring that breathes outward so the eye
              finds the primary action. Paused on hover, where the button's own
              lift and shadow take over. */}
          <Cta
            href="/categories"
            icon="15692-652"
            className="animate-hv2-cta-pulse hover:[animation-play-state:paused] motion-reduce:animate-none"
          >
            Find My Test
          </Cta>
          <Cta href="#what-would-you-like-to-know" variant="ghost">
            Explore Your Genes
          </Cta>
        </div>
      </Reveal>

      {/* ---- signature ------------------------------------------------------
          `.fin__sig` carries BOTH a margin-top clamp(64px,7vw,110px) and a
          padding-top clamp(30px,3.2vw,44px) - ~154px of air at desktop. Both are
          kept rather than folded into one value: the margin is the gap to the
          CTAs and the padding is the wordmark's own breathing room, and they
          scale on different curves. The empty space IS the design here, which is
          why it shrinks with the viewport instead of being dropped. */}
      <Reveal delay={0.2} className="mt-[clamp(64px,7vw,110px)] pt-[clamp(30px,3.2vw,44px)]">
        <p className="font-kyg text-[clamp(20px,3.4vw,46px)] font-extrabold leading-[1.1] tracking-[clamp(0.06em,0.9vw,0.18em)] text-linenw/90">
          KNOW YOUR GENES
        </p>
        {/* `.fin__sig span`: flat 20px on the source's 1.62 body leading, and
            the same Cormorant italic rule as `.fin__t`. */}
        <p className="mt-[12px] font-tst text-[20px] font-medium italic leading-[1.62] tracking-normal text-linenw/55">
          Genetics for a lifetime.
        </p>
      </Reveal>
    </Section>
  );
}
