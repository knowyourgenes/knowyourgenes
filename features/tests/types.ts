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

/** Pain-card accent family (drives the accent bar, label + icon chip colour). */
export type PainAccent = 'fertility' | 'hormones' | 'hairloss';

/** Bundle visual family. */
export type BundleTheme = 'recommended' | 'complete' | 'couple';

export interface NavLink {
  label: string;
  href: string;
}

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

/** The whole test-detail page, rendered by features/tests/components/TestPage. */
export interface TestPage {
  slug: string;
  categorySlug: string;

  seo: { title: string; description: string };

  nav: {
    brand: string;
    links: NavLink[];
    ctaLabel: string;
    ctaHref: string;
  };

  sidebar: {
    eyebrow: string;
    introHtml: Html;
    bundles: Bundle[];
    noteHtml: Html;
  };

  hero: Hero;

  pains: {
    eyebrow: string;
    titleHtml: Html;
    items: Pain[];
  };

  stat: Stat;

  sampleReport: {
    eyebrow: string;
    titleHtml: Html;
    introHtml: Html;
    cards: ReportCard[];
    legendTitle: string;
    legend: RiskLevel[];
  };

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
  };

  faq: {
    eyebrow: string;
    titleHtml: Html;
    items: Faq[];
  };

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
