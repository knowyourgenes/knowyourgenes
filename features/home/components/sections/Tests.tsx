import Link from 'next/link';
import { getHeroImage } from '@/features/tests';
import type { CSSProperties, ReactNode } from 'react';
import { Container } from '@/components/shared/Container';
import { getTestPage } from '@/lib/testsdata';
import { Carousel } from './Carousel';
import { CONTENT_GAP, EYEBROW, EYEBROW_DASH_TEAL, GRAD_TEXT, HEADING, LEAD, SECTION_PY } from './styles';

/**
 * Tests - "Which one is you?" product line-up.
 *
 * Pure Tailwind, fully static. The legacy version was a JS carousel (a right
 * column track with prev/next arrows + dots). Here the package cards render as a
 * horizontally-scrollable, snap-aligned flex row (no JS, no arrows, no dots).
 * Reveal / parallax effects dropped; plain hover states kept.
 *
 * Per-test accent colours (not part of the global token set) are set as local
 * `--t-accent-*` CSS variables on each card via `style`, then consumed through
 * `bg-[var(--t-accent-50)]` etc. - mirroring the original theme architecture.
 */

type ThemeName = 'wellness' | 'roots' | 'women' | 'men' | 'matri';

const THEME: Record<ThemeName, CSSProperties> = {
  wellness: {
    '--t-accent-50': '#E9F5EE',
    '--t-accent-100': '#D7ECDF',
    '--t-accent-500': '#2F8C5C',
    '--t-accent-700': '#1F6B43',
  } as CSSProperties,
  roots: {
    '--t-accent-50': '#ECEAFC',
    '--t-accent-100': '#DCD8FB',
    '--t-accent-500': '#6F61E8',
    '--t-accent-700': '#4E40C2',
  } as CSSProperties,
  women: {
    '--t-accent-50': '#FBE9F0',
    '--t-accent-100': '#F8D4E1',
    '--t-accent-500': '#C73C70',
    '--t-accent-700': '#9A2855',
  } as CSSProperties,
  men: {
    '--t-accent-50': '#E5EFFA',
    '--t-accent-100': '#D0E2F7',
    '--t-accent-500': '#1F62B8',
    '--t-accent-700': '#154A8E',
  } as CSSProperties,
  matri: {
    '--t-accent-50': '#FAEBD9',
    '--t-accent-100': '#F5D7B0',
    '--t-accent-500': '#B66B16',
    '--t-accent-700': '#8B4F0E',
  } as CSSProperties,
};

/* Decorative accent blob (bottom-right of each card). */
function Blob() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -right-[140px] -bottom-[140px] z-0 h-[360px] w-[360px] rounded-sm bg-[radial-gradient(closest-side,var(--t-accent-50),transparent_72%)]"
    />
  );
}

/* CTA arrow (shared by the panel + package CTAs). */
function CtaArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[14px] w-[14px] transition-transform duration-500 group-hover:translate-x-[3px]"
    >
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

/* Large check (package "What's Included" lists). */
function BigCheck() {
  return (
    <span className="mt-[1px] inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[var(--t-accent-50)] text-[var(--t-accent-500)]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[12px] w-[12px]"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

/* Small check (wellness sub-card lists). */
function SmallCheck() {
  return (
    <span className="mt-[1px] inline-flex h-[16px] w-[16px] shrink-0 text-[var(--t-accent-500)]">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[16px] w-[16px]"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

type WrCard = {
  key: string;
  theme: ThemeName;
  icon: ReactNode;
  name: string;
  blurb: string;
  items: string[];
  tagline: string;
};

const WR_CARDS: WrCard[] = [
  {
    key: 'diet',
    theme: 'wellness',
    icon: <path d="M3 11h18M5 11a7 7 0 0 1 14 0M5 11v1a7 7 0 0 0 14 0v-1M12 4V2" />,
    name: 'My Diet DNA',
    blurb: 'Nutrition insights personalised for your body.',
    items: [
      'Vitamin & micronutrient tendencies',
      'Macro nutrient response',
      'Food sensitivities',
      'Gluten & lactose response',
      'Salt & caffeine sensitivity',
    ],
    tagline: 'Same diet. Different bodies.',
  },
  {
    key: 'weight',
    theme: 'men',
    icon: <path d="M12 3v3M5.5 7h13M7 7l-2.5 8a4 4 0 0 0 8 0L10 7M14 7l2.5 8a4 4 0 0 0 8 0L22 7" />,
    name: 'My Weight DNA',
    blurb: 'Understand your metabolism and weight-related tendencies.',
    items: [
      'Weight management response',
      'Fat storage tendencies',
      'Eating behaviour patterns',
      'Sweet cravings & satiety response',
      'Lipid profile tendencies',
    ],
    tagline: "Your diet didn't fail. Your plan did.",
  },
  {
    key: 'fitness',
    theme: 'roots',
    icon: (
      <>
        <circle cx="13" cy="4" r="1.6" />
        <path d="M11 8l-2 4 3 2 1 6M9 12l-3 1M13 14l3 3M11 8l4-1 3 3" />
      </>
    ),
    name: 'My Fitness DNA',
    blurb: "Train smarter - based on how you're built.",
    items: [
      'Response to exercise',
      'Power vs endurance profile',
      'Aerobic & anaerobic capacity',
      'Injury risk & recovery speed',
    ],
    tagline: 'Sprinter or marathon runner? Your genes know.',
  },
  {
    key: 'detox',
    theme: 'matri',
    icon: <path d="M12 2.7s6 6.3 6 10.3a6 6 0 0 1-12 0c0-4 6-10.3 6-10.3z" />,
    name: 'My Detox DNA',
    blurb: 'How well does your body clean itself out?',
    items: ['Fat soluble toxin clearance', 'Water soluble toxin clearance', 'Oxidative stress response'],
    tagline: "Your body + Delhi's air. Know your risk.",
  },
];

type TestCard = {
  theme: ThemeName;
  tag: string;
  title: string;
  desc: string;
  subLab: string;
  items: string[];
  highlight: string;
  pills: string[];
  cta: { href: string } | null;
};

const TEST_CARDS: TestCard[] = [
  {
    theme: 'roots',
    tag: 'Ancestry',
    title: 'Know Your Roots - Ancestors In Me',
    desc: 'Where did you really come from? Your DNA carries the story of everyone who came before you - across continents, across centuries.',
    subLab: "What's Included",
    items: [
      'Percentage breakdown of your ethnic origins',
      'South Asian, Southeast Asian, Central Asian heritage mapping',
      'Links to West Caucasian, East African, Armenian, Amerindian populations',
      '42,000+ SNP genotyping via Illumina iScan',
      'Your personal Gene Journey narrative report',
    ],
    highlight: 'KYC done. Ab apni asli identity jaano.',
    pills: ['Perfect NRI gift', 'Family heritage', 'Curiosity buy'],
    cta: { href: '/categories/wellness/ancestry' },
  },
  {
    theme: 'women',
    tag: "Women's Health",
    title: 'Know Your Future - She',
    desc: 'Know your risk before it becomes your reality. Five conditions that matter most to Indian women - decoded from your DNA.',
    subLab: "What's Included",
    items: [
      'Polycystic Ovary Syndrome (PCOS) risk',
      'Pregnancy loss & abnormal reproductive function risk',
      'Peripartum (post-pregnancy) depression risk',
      'Osteoporosis & bone density risk',
      'Rheumatoid arthritis predisposition',
      'Personalised lifestyle & nutrition recommendations',
    ],
    highlight: "1 in 5 Indian women has PCOS. Most don't know why. You can.",
    pills: ['Pre-conception', 'Young couples', 'Women 25–45'],
    cta: { href: '/categories/wellness/womens-health' },
  },
  {
    theme: 'men',
    tag: "Men's Health",
    title: 'Know Your Future - He',
    desc: 'Men rarely get tested until something goes wrong. Know your genetic risks early - so you never have to be caught off guard.',
    subLab: "What's Included",
    items: [
      'Pituitary-testicular endocrine function risk',
      'Male fertility & reproductive function risk (azoospermia)',
      'Spot baldness risk (Alopecia Areata)',
      'Good / Average / Poor risk grading per condition',
      'Personalised diet & lifestyle recommendations',
    ],
    highlight: 'Male infertility affects 1 in 8 couples. Know your side of the story.',
    pills: ['Pre-marriage', 'Couples planning', 'Men 25–45'],
    cta: { href: '/categories/wellness/mens-health' },
  },
  {
    theme: 'matri',
    tag: 'Pre-Matrimonial',
    title: 'Know Before You Begin',
    desc: 'You checked the kundali. You met the family. Now know what your genes say - before you begin life together.',
    subLab: "What's Included - For Both Partners",
    items: [
      "Full Women's Health Report (PCOS, pregnancy, osteoporosis, RA, depression)",
      "Full Men's Health Report (fertility, hormones, alopecia)",
      'Carrier screening insights for hereditary conditions',
      'Joint genetic counselling session via WhatsApp',
      'Two at-home saliva kits - one for each partner',
    ],
    highlight: 'Rishta pakka karne se pehle - genes milao.',
    pills: ['For couples', 'Pre-wedding', 'Family planning'],
    cta: null,
  },
];

// NOTE: bundles are NOT sellable yet. Each one is a set of reports that would
// come off a single saliva kit, but there is no Package row behind them and no
// agreed bundle price, so their CTAs point at the catalogue rather than a
// checkout. To make them real: seed a Package per bundle (or add a coupon that
// discounts the set) and swap these hrefs for an add-to-cart.
type Bundle = { title: string; href: string; color: string; icon: ReactNode; desc: string };

const BUNDLES: Bundle[] = [
  {
    title: "Couple's Blueprint",
    href: '/categories/wellness',
    color: '#C73C70',
    icon: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
    ),
    desc: "Wellness + Women's Health + Men's Health",
  },
  {
    title: 'Family Starter',
    href: '/categories/wellness',
    color: '#2F8C5C',
    icon: (
      <>
        <circle cx="9" cy="20" r="2" />
        <circle cx="19" cy="20" r="2" />
        <path d="M3 4h2l2.4 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 7H6" />
      </>
    ),
    desc: "Women's Health + Men's Health + Ancestry",
  },
  {
    title: 'The Complete You',
    href: '/categories/wellness',
    color: '#6F61E8',
    icon: (
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    ),
    desc: 'All 5 reports. The most complete picture of you.',
  },
];

const cardShell =
  'relative flex flex-col overflow-hidden rounded-sm border border-(--ink-line) bg-white p-[clamp(26px,2.8vw,40px)] shadow-[0_2px_6px_rgba(45,32,18,.04),0_18px_50px_-24px_rgba(45,32,18,.18)] max-[560px]:p-[24px]';
const tagPill =
  'inline-flex items-center rounded-sm bg-[var(--t-accent-50)] px-[14px] py-[7px] text-[11.5px] font-bold uppercase tracking-[0.14em] text-[var(--t-accent-700)]';
const subLabCls = 'mb-[16px] text-[12px] font-bold uppercase tracking-[0.16em] text-(--ink-3)';
const softPill =
  'inline-flex items-center rounded-sm border border-(--ink-line) bg-[rgba(31,26,20,.04)] px-[14px] py-[7px] text-[12.5px] font-medium tracking-[-.005em] text-(--ink-3)';

const DEFAULT_TEST_IMAGE = '/kyg/950448a92b6b.jpg';

/**
 * Each card's picture is pulled from its linked test page (dynamic - the same
 * image the detail page shows). Cards without a "Know more" detail page fall
 * back to a default image.
 */
function cardImage(cta: TestCard['cta'], title: string): { src: string; alt: string } {
  const slug = cta?.href.split('/').filter(Boolean).pop();
  const test = slug ? getTestPage(slug) : undefined;
  const hero = test ? getHeroImage(test) : undefined;
  return hero ?? { src: DEFAULT_TEST_IMAGE, alt: title };
}

export default function Tests() {
  return (
    <section id="tests" className={`relative overflow-hidden ${SECTION_PY}`}>
      <Container>
        {/* ===== Section head ===== */}
        <div className="mx-auto mb-[clamp(36px,4vw,56px)] max-w-[760px] text-center">
          <div className={`${EYEBROW} text-(--c-teal)`}>
            <span className={EYEBROW_DASH_TEAL} />
            Our Tests
          </div>
          <h2 className={`mt-[16px] ${HEADING} text-(--ink-1)`}>
            Which one <span className={GRAD_TEXT}>is you?</span>
          </h2>
          <p className={`mt-[18px] ${LEAD} text-(--ink-2)`}>
            Five ways to know yourself better. All from a simple saliva kit.
          </p>
        </div>

        {/* ===== Two-column split: Wellness panel (left) · package row (right) ===== */}
        <div
          className={`mt-[clamp(40px,5vw,64px)] grid grid-cols-[1.05fr_.95fr] items-start ${CONTENT_GAP} max-[1180px]:grid-cols-1`}
        >
          {/* ---------- LEFT: My Wellness Report ---------- */}
          <div className="min-w-0">
            <article style={THEME.wellness} className={cardShell}>
              <Blob />
              <div className="relative z-[1] border-b border-(--ink-line) pb-[clamp(18px,1.8vw,24px)]">
                <span className={tagPill}>Most Popular · Wellness</span>
                <h3 className="mt-[16px] text-[clamp(26px,2.6vw,34px)] font-semibold leading-[1.08] tracking-[-.02em] text-(--ink-1) max-[560px]:text-[26px]">
                  My Wellness Report
                </h3>
                <p className="mt-[12px] text-[clamp(14.5px,1.05vw,16px)] leading-[1.55] text-(--ink-2)">
                  Your body has been operating on guesswork. Diet, weight, fitness, detox - all decoded from your unique
                  DNA. One saliva kit, four life-changing answers.
                </p>
              </div>

              <div className="relative z-[1] pt-[clamp(20px,2vw,26px)]">
                <div className={subLabCls}>What&apos;s Included - 4 Reports</div>
                <div className="grid grid-cols-2 gap-[clamp(14px,1.4vw,20px)] max-[880px]:grid-cols-1">
                  {WR_CARDS.map((c) => (
                    <div
                      key={c.key}
                      style={THEME[c.theme]}
                      className="flex flex-col rounded-sm border border-(--ink-line) bg-(--c-cream) p-[clamp(18px,1.8vw,24px)] transition-[transform,box-shadow,border-color] duration-[450ms] hover:-translate-y-[3px] hover:border-[var(--t-accent-100)] hover:shadow-[0_12px_28px_-12px_rgba(45,32,18,.22)]"
                    >
                      <div className="mb-[14px] flex items-center gap-[12px]">
                        <span className="inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-sm bg-[var(--t-accent-50)] text-[var(--t-accent-500)]">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.9}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-[20px] w-[20px]"
                          >
                            {c.icon}
                          </svg>
                        </span>
                        <span className="text-[clamp(16px,1.4vw,19px)] font-semibold leading-[1.1] tracking-[-.01em] text-(--ink-1)">
                          {c.name}
                        </span>
                      </div>
                      <p className="mb-[14px] text-[13.5px] leading-[1.45] text-(--ink-2)">{c.blurb}</p>
                      <ul className="mt-auto flex flex-col gap-[9px]">
                        {c.items.map((it) => (
                          <li
                            key={it}
                            className="flex items-start gap-[10px] text-[13.5px] leading-[1.4] text-(--ink-1)"
                          >
                            <SmallCheck />
                            {it}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-[14px] rounded-sm bg-[var(--t-accent-50)] px-[14px] py-[10px] text-[13px] font-semibold italic leading-[1.35] text-[var(--t-accent-700)]">
                        {c.tagline}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-[1] mt-[clamp(22px,2.4vw,30px)] flex flex-wrap items-center justify-between gap-[16px] border-t border-(--ink-line) pt-[clamp(18px,2vw,24px)] max-[880px]:flex-col max-[880px]:items-start">
                <div className="flex flex-wrap gap-[8px]">
                  {['Saliva kit', 'No needles', 'NABL labs', 'WhatsApp counselling'].map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center rounded-sm border border-(--ink-line) bg-[rgba(31,26,20,.04)] px-[13px] py-[7px] text-[12px] font-medium tracking-[-.005em] text-(--ink-3)"
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <Link
                  href="/categories/wellness/my-wellness"
                  className="group inline-flex items-center gap-[10px] rounded-sm bg-[var(--t-accent-500)] px-[22px] py-[12px] text-[14.5px] font-semibold tracking-[-.005em] text-white transition-[background,transform,box-shadow] duration-[450ms] hover:-translate-y-[2px] hover:bg-[var(--t-accent-700)] hover:shadow-[0_12px_28px_-8px_rgba(31,107,67,.45)] max-[880px]:w-full max-[880px]:justify-center"
                >
                  Know more
                  <CtaArrow />
                </Link>
              </div>
            </article>
          </div>

          {/* ---------- RIGHT: package row (static scroll-snap, no JS carousel) ---------- */}
          <div className="min-w-0">
            <Carousel label="More ways to know yourself">
              {TEST_CARDS.map((c) => {
                const img = cardImage(c.cta, c.title);
                return (
                  <article
                    key={c.theme}
                    style={THEME[c.theme]}
                    className={`${cardShell} w-full flex-[0_0_100%] snap-center`}
                  >
                    <Blob />
                    <div className="relative z-[1] mb-[clamp(18px,1.8vw,26px)] h-[clamp(150px,16vw,200px)] overflow-hidden rounded-sm bg-(--c-cream-2)">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                    </div>
                    <div className="relative z-[1] border-b border-(--ink-line) pb-[clamp(18px,1.8vw,26px)]">
                      <span className={tagPill}>{c.tag}</span>
                      <h3 className="mt-[18px] text-[clamp(26px,2.6vw,36px)] font-semibold leading-[1.08] tracking-[-.02em] text-(--ink-1) max-[560px]:text-[24px]">
                        {c.title}
                      </h3>
                      <p className="mt-[14px] max-w-[620px] text-[clamp(15px,1.15vw,17px)] leading-[1.55] text-(--ink-2)">
                        {c.desc}
                      </p>
                    </div>

                    <div className="relative z-[1] pt-[clamp(20px,2vw,28px)] pb-[clamp(8px,1.2vw,16px)]">
                      <div className={subLabCls}>{c.subLab}</div>
                      <ul className="flex flex-col gap-[12px]">
                        {c.items.map((it) => (
                          <li
                            key={it}
                            className="flex items-start gap-[14px] text-[clamp(15px,1.1vw,17px)] leading-[1.45] tracking-[-.005em] text-(--ink-1)"
                          >
                            <BigCheck />
                            {it}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-[clamp(22px,2.4vw,30px)] rounded-sm border-l-4 border-l-[var(--t-accent-500)] bg-[var(--t-accent-50)] px-[22px] py-[18px]">
                        <span className="mb-[6px] block text-[11.5px] font-bold uppercase tracking-[0.16em] text-[var(--t-accent-700)]">
                          Highlight
                        </span>
                        <span className="text-[clamp(15px,1.15vw,17px)] font-semibold leading-[1.4] tracking-[-.005em] text-[var(--t-accent-700)]">
                          {c.highlight}
                        </span>
                      </div>
                    </div>

                    <div className="relative z-[1] mt-auto flex flex-wrap items-center justify-between gap-[16px] border-t border-(--ink-line) pt-[clamp(20px,2vw,26px)] max-[880px]:flex-col max-[880px]:items-start">
                      <div className="flex flex-wrap gap-[8px]">
                        {c.pills.map((p) => (
                          <span key={p} className={softPill}>
                            {p}
                          </span>
                        ))}
                      </div>
                      {c.cta && (
                        <a
                          href={c.cta.href}
                          className="group inline-flex items-center gap-[10px] rounded-sm bg-[var(--t-accent-500)] px-[24px] py-[13px] text-[14.5px] font-semibold tracking-[-.005em] text-white transition-[background,transform,box-shadow] duration-500 hover:-translate-y-[2px] hover:bg-[var(--t-accent-700)] hover:shadow-[0_14px_32px_rgba(45,32,18,.18)] max-[880px]:w-full max-[880px]:justify-center"
                        >
                          Know more
                          <CtaArrow />
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </Carousel>
          </div>
        </div>

        {/* ===== Bundles ===== */}
        <div className="mt-[clamp(64px,7vw,96px)] mb-[clamp(30px,3.4vw,44px)] flex items-center justify-center gap-[18px]">
          <span className="h-px max-w-[90px] flex-1 bg-(--ink-line)" />
          <span className="text-[13.5px] font-bold uppercase tracking-[0.22em] text-(--ink-3)">
            {'Or Bundle & Save'}
          </span>
          <span className="h-px max-w-[90px] flex-1 bg-(--ink-line)" />
        </div>

        <div className="grid grid-cols-3 gap-[22px] max-[880px]:grid-cols-1 max-[880px]:gap-[14px]">
          {BUNDLES.map((b) => (
            <a
              key={b.title}
              href={b.href}
              className="relative flex flex-col rounded-sm border-[1.5px] border-(--ink-line) bg-[rgba(255,255,255,.7)] px-[28px] pt-[28px] pb-[26px] backdrop-blur-[8px] transition-[transform,box-shadow,background,border-color] duration-[550ms] hover:-translate-y-[6px] hover:border-[rgba(31,26,20,.16)] hover:bg-white hover:shadow-[0_18px_44px_rgba(45,32,18,.12)] max-[560px]:p-[22px]"
            >
              <div className="mb-[14px] flex items-center gap-[12px]">
                <span
                  className="inline-flex h-[36px] w-[36px] items-center justify-center rounded-sm bg-[rgba(31,26,20,.04)]"
                  style={{ color: b.color }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[20px] w-[20px]"
                  >
                    {b.icon}
                  </svg>
                </span>
                <h4 className="text-[19px] font-semibold tracking-[-.012em] text-(--ink-1)">{b.title}</h4>
              </div>
              <p className="mb-[22px] flex-1 text-[14.5px] leading-[1.5] text-(--ink-3)">{b.desc}</p>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
