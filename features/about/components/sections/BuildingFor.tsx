// =============================================================================
// About Us — SECTION 09 · "Who we're building for"
// -----------------------------------------------------------------------------
// Figma frame: 1440 × 1470, pad 92/20, ground = linear gradient #faf6ef → #f1f7f6
// (linenw → sage, the token literally commented "WHO IT'S FOR gradient end").
// Inner stack gap 48: header → four "Maybe…" statement rows → four audience
// profile cards (319 × 231, gap 20) → the closing line.
//
// Radius trap: the frame's 16 / 24 are NOT on the remapped Tailwind scale, so
// they are written as explicit arbitrary values.
//
// The frame's middle block is a two-column row on the 1336 rail: a 580 x 724
// "Editorial portrait" imgslot (x=52..632) over a 612 x 756 blurred gradient
// backing, a 48 gutter, then the statement rows (x=680, w=708), with the right
// column centred against the taller left one.
//
// The slot now carries the designer's portrait (frame 2084:4145). Filling it
// sets the placeholder overlay — glyph 9814-325 plus the caption "Editorial
// portrait" — to HIDDEN in the frame, so the photo replaces the stand-in rather
// than sitting behind it. The blurred backing stays.
//
// PROFILE AVATARS: all four 56px slots carry photography, and all four are
// VERIFIED against the design — every slot's imageRef was read from the frame
// and matches the file shipped here.
//
// Card 04 took a detour worth recording. Its image landed in Figma after the
// REST nodes endpoint had been quota-locked (~59h), so the slot could not be
// read at the time and the image was identified from the file's image manifest
// instead: the other three avatars are all exactly 1254x1254 PNG from one
// generation batch, and of the images added since, exactly one shared that
// signature. That inference was later confirmed directly — the frame's slot for
// "The Informed" carries imageRef 65bb1d69…, which is what shipped.
// =============================================================================

import { AboutIcon } from '../AboutIcon';
import { Body, Eyebrow, Heading, Photo, Section } from '../ui';

/** The four "Maybe…" rows. Glyph ids are page-absolute (section offset 9202). */
const STATEMENTS: { icon: string; text: string }[] = [
  {
    icon: '9716-701',
    text: "Maybe you've always been curious about what your genes say about you.",
  },
  {
    icon: '9786-701',
    text: "Maybe you're trying to make smarter lifestyle choices.",
  },
  {
    icon: '9856-701',
    text: "Maybe you're looking beyond routine health checks.",
  },
  {
    icon: '9926-701',
    text:
      "Maybe you simply believe that waiting for something to go wrong isn't the only way to think about health.",
  },
];

/** The four audience profile cards. */
const PROFILES: {
  num: string;
  icon: string;
  title: string;
  question: string;
  /** Designer photography. Absent = the frame left that slot unfilled. */
  img?: string;
  alt?: string;
}[] = [
  {
    num: '01',
    icon: '10302-99',
    title: 'The Curious',
    question: 'What can my genes tell me about myself?',
    img: '/about/img/profile-01.jpg',
    alt: '',
  },
  {
    num: '02',
    icon: '10302-438',
    title: 'The Proactive',
    question: 'Can I understand potential tendencies before they become concerns?',
    img: '/about/img/profile-02.jpg',
    alt: '',
  },
  {
    num: '03',
    icon: '10302-777',
    title: 'The Health-Conscious',
    question: 'Can genetics add another layer to what I already know about my health?',
    img: '/about/img/profile-03.jpg',
    alt: '',
  },
  {
    num: '04',
    icon: '10302-1116',
    title: 'The Informed',
    question: 'Can I make better decisions with better information?',
    img: '/about/img/profile-04.jpg',
    alt: '',
  },
];

export default function BuildingFor() {
  return (
    <Section
      id="who-were-building-for"
      ground="cream"
      className="bg-gradient-to-b from-linenw to-sage"
      innerClassName="flex flex-col gap-12"
    >
      {/* ---- header -------------------------------------------------------- */}
      <header className="mx-auto flex w-full max-w-[740px] flex-col items-center gap-[15px] text-center">
        <Eyebrow label="Who we're building for" icon="9301-601" />
        <Heading
          className="text-[clamp(28px,2.92vw,42px)] leading-[1.05] tracking-[-0.018em]"
          html={
            'For the person who <em class="abt-grad">wants to know<br class="hidden md:inline" /> more.</em>'
          }
        />
      </header>

      {/* ---- editorial slot + the four "Maybe…" statements ------------------
          The frame's 580 : 48 : 708 row. Stated as fr so the pair keeps the
          frame's proportion on whatever rail <Section> gives it, and collapses
          to a single column below lg with the slot on top. */}
      <div className="mx-auto grid w-full grid-cols-1 gap-8 lg:grid-cols-[580fr_708fr] lg:items-center lg:gap-12">
        {/* The frame's 580 x 724 portrait slot. Height tracks 724 at 1440
            (724/1440 = 50.28vw) and steps down rather than leaving a huge void
            on smaller screens. The source is 1122x1402 — near enough the slot's
            0.80 ratio that object-cover barely crops. */}
        <div className="relative mx-auto w-full max-w-[580px]">
          {/* the frame's 612 x 756 blurred gradient backing — 16 proud of the
              slot on every side, hence -inset-4 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-4 rounded-[36px] bg-gradient-to-br from-eden/[0.06] to-java/[0.08] blur-[28px]"
          />
          <Photo
            src="/about/img/building-for-portrait.jpg"
            alt="Someone at home, considering what they might want to understand about their health."
            className="relative min-h-[260px] w-full rounded-[28px] border border-mine/10 shadow-tst-float sm:min-h-[360px] lg:min-h-[clamp(420px,50.28vw,724px)]"
            sizes="(min-width: 1024px) 44vw, (min-width: 640px) 90vw, 100vw"
          />
        </div>

        <ul className="flex w-full min-w-0 list-none flex-col gap-3">
          {STATEMENTS.map((statement) => (
            <li
              key={statement.icon}
              className="flex items-start gap-[14px] rounded-[16px] border border-mine/10 bg-white px-5 py-4 shadow-tst-soft"
            >
              <AboutIcon id={statement.icon} className="mt-px h-[25px] w-[21px] shrink-0" />
              <Body
                html={statement.text}
                className="min-w-0 text-[17px] leading-[23.4px] text-[#2d2a24]"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* ---- audience profiles ---------------------------------------------
          The frame puts all four on ONE row (319 wide, gap 20), so xl is the
          four-column breakpoint.

          DO NOT swap xl for an arbitrary pixel variant (a "min-[1330px]" style
          prefix) to dodge the title wrap between 1280 and ~1330. Tailwind v4
          emits arbitrary min-width variants in a block BEFORE the named
          breakpoints, so such a rule lands earlier in the stylesheet than
          `sm:grid-cols-2` and loses the cascade at equal specificity — the grid
          then silently stays two columns at EVERY width. That bug shipped once;
          measured in the built CSS, the arbitrary rule sat at offset 244840 and
          sm at 246491. An arbitrary min-width variant can never beat a named
          breakpoint for the same property. (It is safe against BASE utilities,
          which is why the ones in WhyWeExist and Understandable are fine.)

          Note also that writing such a class inside a comment is enough for the
          Tailwind scanner to emit it — the string above is deliberately broken
          up so no dead rule is generated.

          "THE HEALTH-CONSCIOUS" may take two lines in that narrow band; the
          cards are h-full inside a grid row, so all four grow together and the
          row stays even. */}
      <ul className="grid list-none grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {PROFILES.map((profile) => (
          <li
            key={profile.num}
            className="flex h-full min-w-0 flex-col rounded-[24px] border border-mine/10 bg-white p-7 shadow-tst-soft"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Photo where the frame supplied one (it hides the glyph in that
                  case); the glyph medallion otherwise. Decorative either way —
                  the card's title and question carry the meaning. */}
              {profile.img ? (
                <Photo
                  src={profile.img}
                  alt={profile.alt ?? ''}
                  className="h-14 w-14 shrink-0 rounded-full border border-mine/10"
                  sizes="56px"
                />
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-mine/10 bg-gradient-to-br from-eden/[0.05] to-java/[0.06]">
                  <AboutIcon id={profile.icon} className="h-6 w-5" />
                </span>
              )}
              <span className="shrink-0 font-kyg text-[38px] font-semibold leading-[38px] text-eden/25">
                {profile.num}
              </span>
            </div>

            {/*
              The four profile titles are textCase=UPPER in the frame (manifest
              y=10361.7, 13.5/700, ls 1.62 = 0.12em): the frame renders "THE
              CURIOUS", not "The Curious". Figma keeps `characters` as the
              designer typed it and applies case via `style.textCase`, so the
              sentence-case strings in PROFILES above are correct AS DATA and the
              `uppercase` below is what makes them match the design. Do NOT
              "correct" this to normal-case — the 0.12em tracking is uppercase
              tracking and is the giveaway. The card questions below ARE
              AS_TYPED and must stay sentence case.
            */}
            <p className="mt-5 min-w-0 break-words font-kyg text-[13.5px] font-bold uppercase leading-[20.2px] tracking-[0.12em] text-eden">
              {profile.title}
            </p>

            <Body
              html={profile.question}
              className="mt-[7px] min-w-0 text-[16.5px] leading-[22.7px] text-[#2d2a24]"
            />
          </li>
        ))}
      </ul>

      {/* ---- closing line --------------------------------------------------- */}
      <Body
        html={
          'Different questions. <em class="abt-grad">One simple starting point: know more.</em>'
        }
        className="mx-auto w-full max-w-[900px] text-center text-[clamp(21px,2.22vw,32px)] font-semibold leading-[1.375] text-mine"
      />
    </Section>
  );
}
