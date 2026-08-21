// =============================================================================
// features/home/v3 - the sections below the hero
// -----------------------------------------------------------------------------
// Kept in one file because each is short and they share the same primitives;
// splitting five ~40-line sections across five files buys nothing here.
//
// The catalogue grid reads CATEGORIES from lib/categoriesdata and renders it
// with `CardArt` from features/tests - the SAME components the category pages
// use. A homepage that re-implements a product card is how two product cards
// start drifting apart (docs/DESIGN.md §7).
//
// No prices. This is a marketing page; prices live on Package rows and are
// rendered server-side on /search and the PDPs. A homepage that quotes a price
// is a second place for it to go stale.
// =============================================================================

import Link from 'next/link';
import { BTN } from '@/components/shared/button-styles';
import { CATEGORIES, visibleProducts } from '@/lib/categoriesdata';
import { cn } from '@/lib/utils';
import { CardArt } from '@/features/tests/components/CategoryCardArt';
import { Heading, Kicker, Lead, Section } from '../ui';

const CARD_SIZES = '(min-width: 1180px) 300px, (min-width: 760px) 33vw, (min-width: 560px) 50vw, 100vw';

// ---------------------------------------------------------------------------
// Trust strip
// ---------------------------------------------------------------------------

/** Every claim here is one the site already makes elsewhere - nothing new. */
const PROOF = [
  { stat: 'NABL', label: 'Certified partner labs' },
  { stat: '7 days', label: 'From sample to report' },
  { stat: 'Delhi NCR', label: 'We come to your door' },
  { stat: 'One kit', label: 'Saliva, no needles' },
];

export function Trust() {
  return (
    <Section className="border-b border-zeus/[0.08] bg-linenw" innerClassName="py-[clamp(32px,3.4vw,52px)]">
      <ul className="grid grid-cols-2 gap-x-[24px] gap-y-[28px] md:grid-cols-4">
        {PROOF.map((p) => (
          <li key={p.label} className="text-center">
            <div className="font-kyg text-[clamp(20px,2vw,26px)] font-extrabold tracking-[-0.02em] text-eden">
              {p.stat}
            </div>
            <div className="mt-[4px] text-[13px] text-cord">{p.label}</div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Shop by goal
// ---------------------------------------------------------------------------

export function ShopByGoal() {
  const products = CATEGORIES.flatMap((c) => visibleProducts(c).map((p) => ({ ...p, categoryName: c.name })));

  return (
    <Section id="tests" className="bg-white">
      <div className="flex flex-col items-center gap-[14px] text-center">
        <Kicker>Shop by goal</Kicker>
        <Heading>Start with what you actually want to know.</Heading>
        <Lead className="text-center">
          Every report comes from the same at-home saliva kit. Pick the one that answers your question - or the whole
          panel.
        </Lead>
      </div>

      <ul className="mt-[clamp(28px,3vw,44px)] grid gap-[20px] min-[560px]:grid-cols-2 min-[1024px]:grid-cols-3">
        {products.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className="group flex h-full flex-col overflow-hidden rounded-sm border border-zeus/[0.08] bg-white shadow-kyg-card transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_44px_-22px_rgba(5,36,34,0.4)]"
            >
              <CardArt
                image={p.image}
                icon={p.icon}
                tone={p.tone}
                sizes={CARD_SIZES}
                className="aspect-[16/10] w-full overflow-hidden"
              />
              <div className="flex flex-1 flex-col p-[18px]">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-cord">
                  {p.categoryName}
                </div>
                <div className="mt-[6px] font-kyg text-[17px] font-bold leading-[1.25] text-mine">{p.name}</div>
                {p.meta && <div className="mt-[4px] text-[12.5px] text-cord">{p.meta}</div>}
                <p className="mt-[10px] line-clamp-2 text-[13.5px] leading-[1.5] text-cape/85">{p.blurb}</p>
                <span className="mt-auto pt-[16px] text-[13.5px] font-semibold text-eden group-hover:text-eden2">
                  See what it covers →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// What a report gives you
// ---------------------------------------------------------------------------

const REPORT_POINTS = [
  {
    title: 'Written for you, not for a doctor',
    body: 'Every finding is a sentence you can act on. No p-values, no gene symbols you have to look up.',
  },
  {
    title: 'Risk in context',
    body: 'A marker on a scale, with what average looks like - so "elevated" means something you can size.',
  },
  {
    title: 'A counsellor, if you want one',
    body: 'Genetic counselling is optional and included on request. Some results are easier heard from a person.',
  },
  {
    title: 'Yours, permanently',
    body: 'Your DNA does not change. Read the same sample against new reports as the science moves.',
  },
];

export function Reports() {
  return (
    <Section className="bg-spring">
      <div className="grid gap-[clamp(28px,4vw,64px)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-[14px]">
          <Kicker>The report</Kicker>
          <Heading>A result you can do something with.</Heading>
          <Lead>
            A genome is only useful once someone has read it properly. That reading is the product - the kit is just how
            we get there.
          </Lead>
        </div>

        <ul className="grid gap-[16px] sm:grid-cols-2">
          {REPORT_POINTS.map((p) => (
            <li key={p.title} className="rounded-sm border border-zeus/[0.08] bg-white p-[20px] shadow-kyg-card">
              <h3 className="font-kyg text-[16px] font-bold leading-[1.3] text-mine">{p.title}</h3>
              <p className="mt-[8px] text-[13.5px] leading-[1.55] text-cord">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// How it works
// ---------------------------------------------------------------------------

const STEPS = [
  { n: '01', title: 'Order your kit', body: 'Pick a report. We deliver the kit anywhere in Delhi NCR.' },
  { n: '02', title: 'Give a saliva sample', body: 'Two minutes at home. No needles, no clinic, no fasting.' },
  { n: '03', title: 'We collect it', body: 'An agent picks it up from your door and takes it to the lab.' },
  { n: '04', title: 'Read your report', body: 'Plain-language results in about 7 days, with counselling on request.' },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="bg-white">
      <div className="flex flex-col items-center gap-[14px] text-center">
        <Kicker>How it works</Kicker>
        <Heading>Four steps, and you never leave the house.</Heading>
      </div>

      <ol className="mt-[clamp(28px,3vw,44px)] grid gap-[20px] sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-sm border border-zeus/[0.08] bg-linenw p-[22px]">
            <div className="font-kyg text-[13px] font-extrabold tracking-[0.14em] text-java">{s.n}</div>
            <h3 className="mt-[10px] font-kyg text-[17px] font-bold leading-[1.25] text-mine">{s.title}</h3>
            <p className="mt-[8px] text-[13.5px] leading-[1.55] text-cord">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// ---------------------------------------------------------------------------
// Closing CTA
// ---------------------------------------------------------------------------

export function FinalCta() {
  return (
    <Section className="bg-abyss text-white">
      <div className="mx-auto flex max-w-[760px] flex-col items-center gap-[18px] text-center">
        <Kicker tone="light">Genetics for a lifetime</Kicker>
        <Heading className="text-white">One sample. Every answer it can give.</Heading>
        <p className="max-w-[600px] text-[clamp(15px,1.3vw,18px)] leading-[1.55] text-white/80">
          Your DNA has been with you through every chapter of your life. Now it can help you understand what comes next.
        </p>
        <div className="mt-[8px] flex flex-col gap-[12px] sm:flex-row">
          <Link href="/categories" className={cn(BTN, 'bg-java2 font-semibold text-abyss transition hover:bg-java')}>
            Find My Test
          </Link>
          <Link
            href="/contact"
            className={cn(
              BTN,
              'border border-white/45 font-semibold text-white transition hover:border-white hover:bg-white/10'
            )}
          >
            Talk to Someone
          </Link>
        </div>
      </div>
    </Section>
  );
}
