// =============================================================================
// features/tests/structure - THE DEFAULT TEST PAGE
// -----------------------------------------------------------------------------
// Every test page is laid out by `withBuyStructure`, which lib/testsdata.ts runs
// over the whole TEST_PAGES registry. It is the Figma buy frame (07b · Women's
// Health Test · Buy) turned into a rule, so a page file only has to say WHAT it
// contains - the order, the buy surface and which blocks survive are decided
// here, once, for all nine.
//
//   1. RETIRE the editorial blocks the buy frame dropped: hero, aspiration,
//      thenNow, timeline, contrast, worth, outcomes (and nav/footer, which the
//      global chrome already owns).
//   2. DERIVE a buy surface from the page's own content, unless the page wrote
//      one by hand (Women's Health did, from the frame).
//   3. SORT what is left into the frame's order. The sort is stable, so a page
//      that runs one section type more than once - Sleep has three marker grids
//      - keeps them in the order it wrote them.
//
// WHY A FUNCTION AND NOT EIGHT EDITS. Hand-authoring eight buy boxes is eight
// chances to put a stale price, the wrong turnaround or somebody else's gene in
// front of a buyer, and the next page added would still get the old layout. A
// derived surface can only say what its page already says.
//
// WHAT IT WILL NOT DERIVE, because each is a claim only one product can make
// honestly and none of the other eight backs it:
//
//   a star rating or review count     - there are no reviews behind them
//   the MOST POPULAR badge            - it is only true of one test at a time
//   a video thumbnail                 - there is no video
//   any photograph the listing has
//   not vetted                        - see the gallery note on deriveBuyPdp
// =============================================================================

import type { CardTone } from '@/lib/categoriesdata';
import type {
  BuyPdpSection,
  HeroSection,
  IconKey,
  Img,
  MarkerGridSection,
  RiskCardsSection,
  Section,
  SectionEntry,
  TestPage,
} from './types';

/** What a test's category card already knows - the one vetted source for it. */
export interface ListingFacts {
  /** "Men's Wellness DNA" */
  name: string;
  /** "3 health checks" / "52 traits · 4 reports" - the card's count chip. */
  meta?: string;
  /**
   * The card's photograph. lib/categoriesdata.ts only sets this once a REAL
   * photo exists (five tests are still on placeholder stubs), which makes it
   * the one image on the site already vetted as safe to lead with.
   */
  image?: Img;
  icon: IconKey;
  tone: CardTone;
}

type Entry = Section & SectionEntry;

/**
 * Where every section type sits on the default page, or `retired`.
 *
 * A Record over the WHOLE `Section['type']` union, on purpose: add a section
 * type to types.ts and this file stops compiling until the new type is placed.
 * Nothing can fall through the sort unclassified.
 */
const PLACEMENT: Record<Section['type'], number | 'retired'> = {
  buyPdp: 0,
  riskCards: 1,
  markerGrid: 2,
  bodyMap: 3,
  whoFor: 4,
  stats: 5,
  explainer: 6,
  reportPreview: 7,
  steps: 8,
  kit: 9,
  counsellor: 10,
  trust: 11,
  testimonial: 12,
  faqs: 13,
  finalCta: 14,
  disclaimer: 15,

  hero: 'retired',
  aspiration: 'retired',
  thenNow: 'retired',
  timeline: 'retired',
  contrast: 'retired',
  worth: 'retired',
  outcomes: 'retired',
  nav: 'retired',
  footer: 'retired',
};

/** The page, laid out as the default buy page. Idempotent. */
export function withBuyStructure(page: TestPage, listing?: ListingFacts): TestPage {
  const live = page.sections.filter((s) => PLACEMENT[s.type] !== 'retired');

  // Derive from the ORIGINAL sections, not `live`: the retired hero is exactly
  // where the result rows and the sub-line the buy surface needs are written.
  const withBuy: Entry[] = live.some((s) => s.type === 'buyPdp')
    ? live
    : [{ ...deriveBuyPdp(page, listing), ground: 'cream' }, ...live];

  const slot = (s: Entry) => PLACEMENT[s.type] as number;
  const sections = withBuy
    .map((s, i) => ({ s, i }))
    .sort((a, b) => slot(a.s) - slot(b.s) || a.i - b.i)
    .map(({ s }) => s);

  return { ...page, sections };
}

// -----------------------------------------------------------------------------
// The derived buy surface
// -----------------------------------------------------------------------------

/**
 * A buy surface built from nothing but what the page already says.
 *
 * THE GALLERY is the one part that cannot be read off the page safely. Five of
 * the nine tests still ship 136-byte transparent stubs for their section art,
 * so pulling images from the sections puts blank boxes in the gallery - and
 * Men's only non-stub image is its hero, which lib/categoriesdata.ts documents
 * as a clinician drawing blood, i.e. the opposite of the saliva kit being sold.
 * So the gallery is:
 *
 *   - the listing's photograph, which is only set once a real one exists, then
 *   - the first N risk-card images, where the page opts in with
 *     `buy.galleryFromRiskCards` - an explicit statement that those are real,
 *   - and when that leaves nothing, the category card's own tone tile.
 */
function deriveBuyPdp(page: TestPage, listing?: ListingFacts): BuyPdpSection {
  const hero = first<HeroSection>(page, 'hero');
  const risk = first<RiskCardsSection>(page, 'riskCards');
  const grids = page.sections.filter((s): s is MarkerGridSection & SectionEntry => s.type === 'markerGrid');

  // "Men's Wellness DNA Test - hair, hormones and fertility from one sample"
  const title = page.seo.title.split(' - ')[0]!.trim();
  const turnaround = turnaroundOf(page);
  // Only items that name a gene or marker are READINGS. A marker grid is also
  // used for scenario lists and explainer steps - Sleep's first grid is "Six
  // reasons people finally test their sleep", its third "in three steps" - and
  // neither belongs in a list of what the kit reads.
  const markerItems = grids.flatMap((g) => g.groups.flatMap((gr) => gr.items)).filter((it) => it.title && it.meta);
  const count = listing?.meta ?? `${risk?.cards.length ?? markerItems.length} health checks`;

  const slides = dedupe([
    ...(listing?.image ? [listing.image] : []),
    ...(risk?.cards.slice(0, page.buy?.galleryFromRiskCards ?? 0).map((c) => c.image) ?? []),
  ]);

  const included: BuyPdpSection['included'] = risk
    ? {
        title: "What's included",
        items: risk.cards.map((c) => ({
          name: toText(c.tabLabel),
          genes: afterDot(c.geneLabel),
          question: toText(c.question),
          answer: leadSentences(toText(c.bodyHtml)),
        })),
      }
    : {
        title: "What's included",
        // All of them. The accordion starts collapsed past six (BuyPdp), so a
        // long list costs one row until it is asked for - and cutting it to
        // "6 + N more" would print a count that need not match the listing's
        // (Sleep lists 22 items that between them make its 28 readings).
        items: markerItems.map((it) => ({
          name: toText(it.title ?? ''),
          genes: afterGeneLabel(it.meta ?? ''),
          question: '',
          answer: it.bodyHtml ? leadSentences(toText(it.bodyHtml)) : '',
        })),
      };

  return {
    type: 'buyPdp',
    breadcrumb: [{ label: 'Home', href: '/' }, { label: 'Tests', href: '/categories' }, { label: title }],
    gallery: {
      slides,
      fallback: listing ? { icon: listing.icon, tone: listing.tone } : undefined,
      insights: {
        title: 'Key insights',
        // The page's OWN values, never re-read as risk. Ancestry's rows are
        // region shares ("South Asian 72.91%") and Eye's are acuity readings
        // ("20/20 · Good"); translating either into "Low risk" would be a lie.
        rows: (hero?.resultCard.rows ?? []).map((r) => ({ label: r.label, value: r.value, tone: r.tone })),
      },
      overlay: ['Understand your genes.', 'Make informed choices.'],
    },
    pills: [
      { glyph: 'file', label: count },
      { glyph: 'flask', label: '1 saliva kit' },
      ...(turnaround ? [{ glyph: 'truck', label: `Results in ${turnaround}` }] : []),
    ],
    title,
    taxNote: 'Inclusive of all taxes',
    blurb: hero ? toText(hero.subHtml) : page.seo.description,
    features: [
      { tile: 'tile0', lines: [count] },
      { tile: 'tile1', lines: ['At-home kit'] },
      { tile: 'tile2', lines: ['Free shipping'] },
      ...(turnaround ? [{ tile: 'tile3', lines: ['Results in', turnaround] }] : []),
    ],
    // `#kit` is rewritten to the kit page with this report pre-ticked by
    // features/tests/kit-link.ts, exactly as on Women's Health.
    cta: { addToCart: 'Add to cart', buyNow: 'Buy now', href: '#kit' },
    // Both hold on all nine: every page's counsellor section offers the call
    // free, and Razorpay is the site's only checkout (features/payments).
    assurances: [
      { glyph: 'shield', lines: ['Secure checkout', 'via Razorpay'] },
      { glyph: 'geneleaf', lines: ['Free GENEous', 'care call'] },
    ],
    included,
    // Every page states saliva, no needle, no fasting, Illumina, a NABL lab and
    // a scientist's review - checked across all nine before these were written
    // once for all of them.
    specs: [
      {
        title: 'Sample type',
        body: 'Saliva. You spit into the tube in the kit at home - no blood, no needle, no clinic visit, and nothing to fast for.',
      },
      {
        title: 'Testing technique',
        body: 'Illumina genotyping at a NABL-accredited lab, with every report reviewed by a scientist before it reaches you.',
      },
      {
        title: "What you'll receive",
        body: `${capitalise(count)} from one saliva sample, explained in plain language${
          turnaround ? `, ready in ${turnaround}` : ''
        }.`,
      },
    ],
  };
}

// -----------------------------------------------------------------------------
// helpers
// -----------------------------------------------------------------------------

function first<T extends Section>(page: TestPage, type: T['type']): T | undefined {
  return page.sections.find((s) => s.type === type) as T | undefined;
}

/**
 * The turnaround the page itself quotes. Read, never assumed: eight of the nine
 * say three weeks and My Wellness says seven days, so a hard-coded value would
 * be wrong on the page most likely to be compared against the others.
 */
function turnaroundOf(page: TestPage): string | undefined {
  return JSON.stringify(page.sections).match(/Results in (\d+\s+(?:days?|weeks?))/i)?.[1];
}

/** "Cataract · Gene EPHA2" -> "EPHA2"; "My Diet DNA · 20 traits" -> "20 traits". */
function afterDot(label: string): string {
  const i = label.indexOf('·');
  return i < 0
    ? ''
    : label
        .slice(i + 1)
        .trim()
        .replace(/^Genes?\s+/i, '');
}

const ENTITY: Record<string, string> = {
  '&amp;': '&',
  '&nbsp;': ' ',
  '&quot;': '"',
  '&rsquo;': '’',
  '&lsquo;': '‘',
  '&rdquo;': '”',
  '&ldquo;': '“',
  '&hellip;': '…',
  '&mdash;': '—',
  '&ndash;': '–',
};

/**
 * The buy surface renders plain strings; the section copy it borrows is trusted
 * inline HTML (`<b>`, `<em>`, entities). Tags go, entities are decoded.
 */
function toText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&[a-z]+;/gi, (e) => ENTITY[e] ?? e)
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Whole sentences from the start, until there is enough to say something.
 * One sentence is not a rule: Men's Hormones card opens with a bold "Yes."
 * and then the actual answer, and "Yes." alone reads as a broken excerpt.
 */
function leadSentences(text: string, min = 60): string {
  const sentences = text.match(/[^.!?]+[.!?]+(?=\s|$)/g);
  if (!sentences) return text;
  let out = '';
  for (const sentence of sentences) {
    out = `${out} ${sentence.trim()}`.trim();
    if (out.length >= min) break;
  }
  return out;
}

/** "Gene read · CLOCK" / "7 genes · TNF, CYBA" -> the genes, without the label. */
function afterGeneLabel(meta: string): string {
  return meta.includes('·') ? afterDot(meta) : meta;
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function dedupe(imgs: Img[]): Img[] {
  const seen = new Set<string>();
  return imgs.filter((i) => (seen.has(i.src) ? false : (seen.add(i.src), true)));
}
