// =============================================================================
// Homepage - SECTION 03 · HERO
// -----------------------------------------------------------------------------
// Rebuilt against the designer's own build ("New Homepage Build/index.html",
// `section.hero`), which is the page the Figma frame was traced from. Where the
// two disagree the HTML wins, because it is the executable version.
//
// GROUND - three paints, in this order (the frame flattens them, the HTML does
// not, and the positions matter):
//   radial 78% 62% at 74%  8%   #25b5ab @0.20
//   radial 64% 54% at  6% 96%   #edddb8 @0.10
//   linear 168deg  #0a3b39 -> #093330 58% -> #062927
//
// PAINT ORDER is the whole trick of this section, and it is expressed in z-index
// rather than DOM order:
//   z-1  the portrait, bleeding off the right edge behind a diagonal MASK
//   z-2  the particle helix canvas - over the portrait, spanning the section
//   z-3  the copy shell and the ledger band
// The wrapper around the portrait is `relative` with NO z-index, so it does not
// open a stacking context and its child can still be compared against the
// canvas. Giving that wrapper a z-index would trap the portrait beneath the
// whole group and the canvas would paint over the headline.
//
// THE PORTRAIT IS MASKED, NOT OVERLAID. The source uses
// `mask-image:linear-gradient(97deg,...)`, so the photo's left edge genuinely
// dissolves into the ground. An opaque gradient laid on top instead - which is
// what this section used to do - cannot do that over a moving canvas, because
// the overlay would also cover the helix.
// =============================================================================

import { AssetSlot, Body, Cta, Kicker, PHOTO } from '../ui';
import { HeroReveal } from '../motion';
import { HelixCanvas, HERO_HELIX } from '../HelixCanvas';
import { HomeIcon } from '../HomeIcon';

/** The five insight areas, with the frame's own 18x18 stroked glyphs. */
const AREAS: { label: string; icon: string }[] = [
  { label: 'Wellness', icon: '638-63' },
  { label: 'Family', icon: '638-184' },
  { label: 'Health', icon: '638-287' },
  { label: 'Longevity', icon: '638-391' },
  { label: 'Ancestry', icon: '638-520' },
];

/** The ledger's right-hand chips. Same five words, deliberately restated. */
const LEDGER_CHIPS = ['Wellness', 'Family', 'Health', 'Longevity', 'Ancestry'];

export default function Hero() {
  return (
    <section
      id="home-hero"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-clip bg-[radial-gradient(78%_62%_at_74%_8%,rgba(37,181,171,0.20),transparent_62%),radial-gradient(64%_54%_at_6%_96%,rgba(237,221,184,0.10),transparent_60%),linear-gradient(168deg,#0a3b39_0%,#093330_58%,#062927_100%)] text-linenw"
    >
      {/* ---- upper region: portrait + copy ---------------------------------
          `relative` with no z-index on purpose - see the header note. Its only
          job is to give the portrait a bottom edge at the top of the ledger,
          which is what the source computes in JS as `--ledger-h`. Doing it with
          a wrapper instead means no measurement and no layout shift. */}
      <div className="relative flex flex-col">
        {/* ---- copy shell --------------------------------------------------
            RAIL: padding on the outer box, max-width on the inner one. Both on
            one element caps the OUTER box at 1313 and then eats the gutter out
            of it, leaving 1187 of content - the frame wants 1313 from x=63.

            TOP PADDING MUST CLEAR THE FIXED HEADER. SiteHeader is `overlay`
            here - fixed, 64px - so it sits ON the hero; the source's header is
            sticky and takes its own space. Reproducing the source's 88px pad
            literally put the kicker 17px behind the bar at every width up to
            768. So the pad is 64 + 78, floored at 84 on phones. */}
        <div className="relative z-[3] px-5 pb-[clamp(38px,4.4vw,64px)] pt-[clamp(72px,6.6vw,100px)] sm:px-8 lg:px-[63px]">
          <div className="mx-auto flex w-full max-w-[1313px] flex-col justify-center lg:min-h-[max(440px,calc(100svh-64px-190px))]">
            <div className="flex w-full max-w-full flex-col gap-[10px] lg:max-w-[min(58%,760px)]">
              <HeroReveal delay={0.05}>
                <Kicker>Genetics for a lifetime</Kicker>
              </HeroReveal>

              {/* Figtree 300 then 800, both 70.6/69.2 ls -2.47. Only the word
                  "KYG" is teal - a character run inside the line, not its own
                  node, hence the inline <b>. The two lines carry separate
                  entrance delays, so each is its own reveal.

                  THE TWO LINES ARE A MATCHED PAIR and the styling carries the
                  argument: line one is light and dimmed because it states what
                  is already true and unremarkable, line two is extra-bold and
                  full-strength because it is the turn. "KYC" and "KYG" sit in
                  the same position in both lines, so the eye reads the swap
                  before it reads the sentence - which is the whole idea, and
                  why neither line may be re-wrapped independently of the other.

                  This copy is ~70% longer than the line it replaced, so at the
                  70.6px cap it wraps to two visual lines per span inside the
                  760px column. `text-balance` keeps those wraps even rather
                  than leaving one word stranded on line two. */}
              <h1
                id="hero-heading"
                className="text-balance pb-[10px] pt-[10px] font-kyg text-[clamp(30px,3.9vw,56px)] leading-[1.02] tracking-[-0.035em]"
              >
                <HeroReveal as="span" delay={0.14} className="block font-light text-linenw/72">
                  KYC tells the world who you are.
                </HeroReveal>
                <HeroReveal as="span" delay={0.24} className="block font-extrabold text-linenw">
                  <b className="font-extrabold text-java2">KYG</b> tells who you are within.
                </HeroReveal>
              </h1>

              {/* The acronym expansion rail (KYC · Know Your Customer / KYG ·
                  Know Your Genes) was removed here to bring the whole hero into
                  a single viewport. It cost roughly 90px of vertical space plus
                  its gap, and it was the most expendable block in the stack: the
                  headline now spells both terms out in plain English, so the
                  rail was restating what the line above had just said.

                  The entrance delays below keep their original values rather
                  than being re-sequenced. They were tuned as a wave against the
                  designer's build, and closing the 0.34 gap would compress the
                  stagger everywhere after it. */}
              <HeroReveal delay={0.42}>
                <p className="max-w-[24ch] pt-[14px] font-kyg text-[clamp(16px,1.3vw,19px)] font-medium leading-[1.42] tracking-[-0.018em] text-linenw">
                  Your DNA has been with you through every chapter of your life.
                </p>
              </HeroReveal>

              <HeroReveal delay={0.5}>
                <Body className="max-w-[44ch] text-linenw/70">Now, it can help you understand what comes next.</Body>
              </HeroReveal>

              {/* five insight areas - one row at desktop, wrapping below */}
              <HeroReveal delay={0.58}>
                <ul className="flex list-none flex-wrap gap-x-[26px] gap-y-[10px] pt-[16px]">
                  {AREAS.map((a) => (
                    <li key={a.label} className="group inline-flex min-w-0 items-center gap-[9px]">
                      <HomeIcon
                        id={a.icon}
                        className="h-[18px] w-[18px] shrink-0 opacity-90 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:scale-110"
                      />
                      <span className="min-w-0 font-kyg text-[clamp(15px,1.18vw,17px)] font-semibold leading-[1.62] tracking-[-0.005em] text-linenw/90">
                        {a.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </HeroReveal>

              {/* Cormorant Garamond 500 italic 22/29.7 - the editorial close */}
              <HeroReveal delay={0.64}>
                <p className="pb-px pt-[12px] font-tst text-[clamp(17px,1.35vw,20px)] font-medium italic leading-[1.35] text-linenw/66">
                  One you. A lifetime of genetic insight.
                </p>
              </HeroReveal>

              <HeroReveal delay={0.72}>
                <div className="flex flex-wrap gap-4 pt-[clamp(20px,2.2vw,28px)]">
                  {/* `.btn--glow` in the source: a ring that breathes outward so
                      the eye finds the primary action. Paused on hover, where
                      the button's own lift and shadow take over. */}
                  <Cta
                    href="/categories"
                    icon="767-204"
                    className="animate-hv2-cta-pulse hover:[animation-play-state:paused] motion-reduce:animate-none"
                  >
                    Find My Test
                  </Cta>
                  <Cta href="#what-would-you-like-to-know" variant="ghost">
                    Explore Your Genes
                  </Cta>
                </div>
              </HeroReveal>
            </div>
          </div>
        </div>

        {/* ---- the portrait -------------------------------------------------
            DOM order is the MOBILE order, and it is deliberate: the source's
            `@media (max-width:1000px)` makes the hero a flex column and gives
            the copy order:1 and the art order:2, so on a phone the photograph
            follows the CTAs as a stacked card. It is NOT dropped - a hero with
            no photograph on the device most people arrive on is the one thing
            this section cannot afford.

            At lg it lifts out of flow to bleed off the right edge, where the
            diagonal mask and the bottom fade both switch on. Below lg the
            source explicitly turns both off (`mask-image:none`,
            `::after{display:none}`) because a rounded card needs neither. */}
        <div className="px-5 pt-[clamp(28px,4vw,44px)] sm:px-8 lg:absolute lg:inset-y-0 lg:right-0 lg:z-[1] lg:w-[min(47vw,760px)] lg:p-0">
          <div
            className={[
              'relative mx-auto h-[min(88vw,440px)] w-full max-w-[1313px] overflow-hidden rounded-[34px]',
              'lg:pointer-events-none lg:h-full lg:max-w-none lg:rounded-none',
              'lg:[-webkit-mask-image:linear-gradient(97deg,transparent_0%,rgba(0,0,0,0.6)_13%,#000_34%)]',
              'lg:[mask-image:linear-gradient(97deg,transparent_0%,rgba(0,0,0,0.6)_13%,#000_34%)]',
            ].join(' ')}
          >
            <AssetSlot
              title="Portrait Asset"
              meta="A person considering what their genes might reveal · 1400 × 1900 · 3:4"
              path="assets/hero-portrait.jpg"
              photo={PHOTO.hero}
              alt=""
              priority
              sizes="(max-width: 1024px) 100vw, 47vw"
              className="h-full w-full"
            />
            {/* `.hero__art::after` - grounds the photo's bottom edge into the
                ledger so the crop never reads as a hard cut. Desktop only. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 hidden bg-[linear-gradient(to_top,#062927_0%,rgba(6,41,39,0.55)_12%,transparent_34%)] lg:block"
            />
          </div>
        </div>
      </div>

      {/* ---- the particle helix --------------------------------------------
          Spans the WHOLE section (the ledger included, as in the source) and
          sits at z-2: over the portrait, under the copy. */}
      <HelixCanvas config={HERO_HELIX} className="pointer-events-none absolute inset-0 z-[2] h-full w-full" />

      {/* ---- ledger band ----------------------------------------------------
          Full-bleed #062927 @0.42 with a 1px hairline above, split .82fr/1.18fr
          with the right column inset and carrying a left rule that fades out at
          both ends. Same rail split as above: gutter outside, 1313 cap inside. */}
      {/* Below lg the source gives the ledger `margin-top:clamp(34px,6vw,52px)`
          to separate it from the stacked portrait; at lg it sits flush under
          the copy, so the margin goes away. */}
      <HeroReveal delay={0.86} className="relative z-[3] mt-[clamp(34px,6vw,52px)] lg:mt-0">
        <div className="border-t border-linenw/[0.17] bg-[#062927]/[0.42]">
          <div className="px-5 sm:px-8 lg:px-[63px]">
            <div className="mx-auto grid w-full max-w-[1313px] grid-cols-1 gap-y-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-y-0">
              <div className="flex flex-col gap-[7px] py-[clamp(24px,2.6vw,36px)]">
                {/* Figtree 700 14/22.7 ls 2.1 - textCase=UPPER in the frame */}
                <p className="font-kyg text-[14px] font-bold uppercase leading-[1.62] tracking-[0.15em] text-linenw/50">
                  What you know
                </p>
                <p className="mt-[1px] font-kyg text-[clamp(30px,3.1vw,46px)] font-extrabold leading-none tracking-[-0.03em] text-linenw/80">
                  TODAY
                </p>
                <p className="mt-[3px] font-kyg text-[clamp(15px,1.18vw,17px)] font-medium leading-[1.62] tracking-[-0.005em] text-linenw/66">
                  Name · Age · Story
                </p>
              </div>

              <div className="relative flex flex-col gap-[7px] py-[clamp(24px,2.6vw,36px)] lg:border-l lg:border-transparent lg:pl-[clamp(24px,3.4vw,58px)] lg:[border-image:linear-gradient(180deg,rgba(250,246,239,0)_0%,rgba(250,246,239,0.17)_22%,rgba(250,246,239,0.17)_78%,rgba(250,246,239,0)_100%)_1]">
                <p className="font-kyg text-[14px] font-bold uppercase leading-[1.62] tracking-[0.15em] text-linenw/50">
                  What there is to know
                </p>
                <p className="mt-[1px] font-kyg text-[clamp(30px,3.1vw,46px)] font-extrabold leading-none tracking-[-0.03em] text-java2">
                  MORE
                </p>
                <ul className="flex list-none flex-wrap gap-[8px_10px] pt-[5px]">
                  {LEDGER_CHIPS.map((c) => (
                    <li
                      key={c}
                      className="inline-flex min-h-10 items-center rounded-full px-[15px] py-[7px] font-kyg text-[clamp(14px,1.08vw,15.5px)] font-semibold leading-[1.62] tracking-[-0.005em] text-linenw/86 ring-1 ring-inset ring-linenw/[0.17] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-java2/[0.12] hover:ring-java2/50"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* "SCROLL" + its 40px hairline with a lit segment falling down it,
              pinned to the right edge above the band. Desktop-only: the source
              hides it below 760, and the frame puts it flush to x=1440 where a
              phone has nowhere to put it. */}
          <a
            href="#why-genetic-testing"
            aria-label="Scroll to why genetic testing"
            className="absolute bottom-full right-0 hidden items-center gap-[11px] pb-[18px] font-kyg text-[14px] font-bold uppercase leading-[1.62] tracking-[0.14em] text-linenw/55 transition-colors duration-500 hover:text-java2 lg:flex"
          >
            Scroll
            <i aria-hidden="true" className="relative block h-10 w-px overflow-hidden bg-linenw/[0.17] not-italic">
              <span className="absolute left-0 top-0 block h-[14px] w-px bg-java2 animate-hv2-trickle motion-reduce:animate-none" />
            </i>
          </a>
        </div>
      </HeroReveal>
    </section>
  );
}
