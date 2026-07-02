// =============================================================================
// features/tests - type model for a data-driven test-detail page
// -----------------------------------------------------------------------------
// Every test page (e.g. Men's Health) is rendered purely from a `TestPage`
// object declared in `lib/testsdata.ts`. To keep per-page styling flexible, most
// copy fields are `Html` strings: they are rendered with dangerouslySetInnerHTML,
// so a page can inline its own markup (a purple <span>, a <b>, a <br/>, an accent
// highlight, etc.) without any component changes.
//
// Structural, repeating content (pains, steps, faqs, bundles) is modelled as
// typed arrays whose text fields are still `Html`, so the shape stays safe while
// the copy stays free-form.
// =============================================================================

/** A string that may contain trusted inline HTML. Rendered via
 *  dangerouslySetInnerHTML - author it in `lib/testsdata.ts` only. */
export type Html = string;

/** Risk grade used by result cards + the grading legend. */
export type RiskTone = 'good' | 'avg' | 'poor';

/** Pain-card accent family (drives the accent bar, label + icon chip colour).
 *  `fertility | hormones | hairloss` are the Men's Health topics; `pcos |
 *  pregnancy | depression | bones | joints` are the Women's Health topics. Each
 *  value must have a matching entry in the `PAIN` style map in
 *  `features/tests/components/TestPage.tsx`. */
export type PainAccent =
  | 'fertility'
  | 'hormones'
  | 'hairloss'
  | 'pcos'
  | 'pregnancy'
  | 'depression'
  | 'bones'
  | 'joints';

/** Bundle visual family. */
export type BundleTheme = 'recommended' | 'complete' | 'couple';

export interface HeroBadge {
  label: string;
  /** optional leading image (e.g. small DNA / NABL mark) under /public */
  img?: string;
  imgAlt?: string;
}

export interface TrustTile {
  /** svg filename under /tests/mens-health/icons, or an inline key */
  icon: string;
  line1: Html;
  line2: Html;
}

export interface StatTile {
  num: Html;
  label: string;
}

/** A compact bundle card - reused in the sidebar and the bundles section. */
export interface Bundle {
  key: string;
  theme: BundleTheme;
  /** icon shown beside the bundle title (path under /public) */
  icon: string;
  badge?: string;
  title: string;
  subtitle: string;
  desc: Html;
  bestFor?: Html;
  ctaLabel: string;
  href: string;
}

export interface Hero {
  badges: HeroBadge[];
  /** big H1 - HTML so the highlight span can be coloured per page */
  titleHtml: Html;
  /** rotating gradient pain word(s), e.g. "Fertility." */
  anchorWord: string;
  bodyHtml: Html;
  ctaLabel: string;
  ctaHref: string;
  /** optional one-line note rendered under the CTA (e.g. Ancestry's marker line) */
  ctaNoteHtml?: Html;
  trust: TrustTile[];
  image: string;
  imageAlt: string;
  imageCaption: string;
  stats: StatTile[];
}

export interface Pain {
  key: string;
  accent: PainAccent;
  icon: string;
  label: Html;
  question: Html;
  answerHtml: Html;
  calloutHtml: Html;
  badge: string;
  badgeTone: RiskTone;
  checksLabel: string;
  checksBodyHtml: Html;
  sampleHtml: Html;
  /** the right result card gets a tinted background for high-risk pains */
  resultTinted?: boolean;
  signsTitle: string;
  signs: Html[];
}

export interface Stat {
  quoteHtml: Html;
  subQuoteHtml: Html;
  emphasisHtml: Html;
  bodyHtml: Html;
  bigNum: Html;
  bigNumLabel: Html;
  ctaLabel: string;
  ctaHref: string;
  fineprint: Html;
}

export interface ReportCard {
  title: string;
  /** icon shown in the tinted chip beside the title (path under /public) */
  icon: string;
  whatLabel: string;
  desc: Html;
  result: string;
  resultLabel: string;
  tone: RiskTone;
  noteHtml: Html;
}

export interface RiskLevel {
  label: string;
  sub: string;
  tone: RiskTone;
  descHtml: Html;
}

export interface Step {
  num: string;
  icon: string;
  title: Html;
  subHtml: Html;
  bodyHtml: Html;
  dark?: boolean;
}

export interface CareMini {
  title: string;
  bodyHtml: Html;
}

export interface ChatBubble {
  from: 'them' | 'me';
  textHtml: Html;
}

export interface CertTile {
  img?: string;
  svg?: string;
  alt: string;
  label: string;
}

export interface CertRow {
  label: Html;
  descHtml: Html;
}

export interface Faq {
  q: Html;
  aHtml: Html;
}

// -----------------------------------------------------------------------------
// Ancestry-only section models. These power the optional sections on the
// Ancestors In Me page (discovery layers, the 10-region table, the gift block,
// and the trust "trace note"). Health pages simply omit them.
// -----------------------------------------------------------------------------

/** Discovery-layer accent family (teal / blue / amber / navy). */
export type LayerAccent = 'primary' | 'secondary' | 'trace' | 'journey';

/** One ancestry "discovery layer" card (replaces a health `Pain`). */
export interface DiscoveryLayer {
  key: string;
  accent: LayerAccent;
  label: Html; // e.g. "Layer 1 · Primary ancestry"
  question: Html; // h3
  bodyHtml: Html[]; // left-column paragraphs
  cardTitle: string; // right-card heading, e.g. "What your report shows"
  shows?: Html[]; // optional bullet list
  chips?: string[]; // optional region chips, e.g. "Malayan 7.79%"
  quoteHtml?: Html; // optional pull-quote (Gene Journey excerpt)
  noteHtml?: Html; // optional closing note / sample result
}

export interface RegionRow {
  region: string;
  pct: string;
  connectsHtml: Html;
}

/** The "10 global regions" breakdown table (replaces a health `sampleReport`). */
export interface RegionsTable {
  eyebrow: string;
  titleHtml: Html;
  introHtml: Html;
  headers: [string, string, string];
  rows: RegionRow[];
  footnote: Html;
}

export interface GiftCard {
  title: string;
  bodyHtml: Html;
  bestForHtml: Html;
}

/** The "makes a meaningful gift" block, rendered above the bundles. */
export interface GiftSection {
  eyebrow: string;
  titleHtml: Html;
  introHtml: Html;
  cards: GiftCard[];
  ctaLabel: string;
  ctaHref: string;
}

/** Optional "a note on trace percentages" card inside the trust section. */
export interface TraceNote {
  title: string;
  items: Html[];
}

// -----------------------------------------------------------------------------
// My Wellness-only section models. My Wellness bundles four sub-reports (Diet /
// Weight / Fitness / Detox) into one kit, so it uses `traitReports` (in place of
// `pains`) and a `traitsCatalog` (in place of `sampleReport`). Health pages omit
// both.
// -----------------------------------------------------------------------------

/** Wellness sub-report accent (green / blue / amber / teal). */
export type ReportAccent = 'diet' | 'weight' | 'fitness' | 'detox';

/** One "My Wellness" sub-report card (Diet / Weight / Fitness / Detox). Shaped
 *  like a `Pain` but with a neutral trait-count badge and a bulleted list of
 *  what it tests instead of a risk grade. */
export interface TraitReport {
  key: string;
  accent: ReportAccent;
  label: Html; // e.g. "Report 1 · My Diet DNA"
  question: Html; // h3
  bodyHtml: Html[]; // 1-2 left-column paragraphs
  calloutHtml?: Html; // optional insight callout (Weight has none)
  testsLabel: string; // "What My Diet DNA tests"
  count: string; // neutral badge, e.g. "20 traits"
  groups: Html[]; // bulleted list of trait groups
  sampleHtml: Html; // "Sample result: ..."
  signsTitle: string;
  signs: Html[];
}

/** One category block in the "52 traits" catalog. */
export interface TraitCategory {
  name: string; // "My Diet"
  count: string; // "20 traits"
  accent: ReportAccent;
  groups: Html[]; // trait-group descriptions
}

/** The "what you get - 52 traits" catalog (renders in the sampleReport slot). */
export interface TraitsCatalog {
  eyebrow: string;
  titleHtml: Html;
  introHtml: Html;
  categories: TraitCategory[];
  totalNum: string; // "52"
  totalLabel: string; // "Total"
  totalSub: Html; // "Traits, from one saliva kit, in 7 days."
  legendTitle: string; // "How results are shown"
  legend: RiskLevel[];
}

/** The whole test-detail page, rendered by features/tests/components/TestPage. */
export interface TestPage {
  slug: string;
  categorySlug: string;

  seo: { title: string; description: string };

  sidebar: {
    eyebrow: string;
    introHtml: Html;
    bundles: Bundle[];
    noteHtml: Html;
  };

  hero: Hero;

  /** Health pages: the risk-graded "pains". Omitted by Ancestry. */
  pains?: {
    eyebrow: string;
    titleHtml: Html;
    items: Pain[];
  };

  /** Ancestry: the four "discovery layers" (renders in the pains slot). */
  discoveryLayers?: {
    eyebrow: string;
    titleHtml: Html;
    items: DiscoveryLayer[];
  };

  /** My Wellness: the four sub-report cards (renders in the pains slot). */
  traitReports?: {
    eyebrow: string;
    titleHtml: Html;
    items: TraitReport[];
  };

  stat: Stat;

  /** Health pages: the sample result cards + risk legend. Omitted by Ancestry. */
  sampleReport?: {
    eyebrow: string;
    titleHtml: Html;
    introHtml: Html;
    cards: ReportCard[];
    legendTitle: string;
    legend: RiskLevel[];
  };

  /** Ancestry: the 10-region breakdown table (renders in the sampleReport slot). */
  regionsTable?: RegionsTable;

  /** My Wellness: the "52 traits" catalog (renders in the sampleReport slot). */
  traitsCatalog?: TraitsCatalog;

  howItWorks: {
    eyebrow: string;
    titleHtml: Html;
    introHtml: Html;
    image: string;
    imageAlt: string;
    steps: Step[];
    ctaLabel: string;
    ctaHref: string;
    fineprint: Html;
  };

  care: {
    eyebrow: string;
    titleHtml: Html;
    leadHtml: Html;
    bodyHtml: Html;
    minis: CareMini[];
    pullQuoteHtml: Html;
    chatTitle: string;
    chatStatus: string;
    chat: ChatBubble[];
    coversTitle: string;
    covers: Html[];
  };

  trust: {
    eyebrow: string;
    titleHtml: Html;
    certs: CertTile[];
    rows: CertRow[];
    expert: {
      initials: string;
      name: Html;
      role: Html;
      lab: Html;
      bodyHtml: Html;
      accuracyHtml: Html;
    };
    /** Ancestry only: the "a note on trace percentages" card. */
    traceNote?: TraceNote;
  };

  faq: {
    eyebrow: string;
    titleHtml: Html;
    items: Faq[];
  };

  /** Ancestry only: the "makes a meaningful gift" block, above the bundles. */
  giftSection?: GiftSection;

  bundlesSection: {
    eyebrow: string;
    titleHtml: Html;
    items: Bundle[];
  };

  finalCta: {
    titleHtml: Html;
    subHtml: Html;
    ctaLabel: string;
    ctaHref: string;
    fineprint1: Html;
    fineprint2: Html;
  };
}
