// =============================================================================
// features/tests — type model for a data-driven test-detail page
// -----------------------------------------------------------------------------
// A test page is an ORDERED LIST OF SECTIONS. `TestPage.sections` is a
// discriminated union keyed on `type`; <TestPageView/> walks the array and
// renders one component per entry. That means a new test page can:
//
//   • include only the sections it needs      → omit the entry
//   • run them in its own order               → reorder the array
//   • never touch a component to add a page   → data only
//
// Copy fields are `Html` strings rendered via dangerouslySetInnerHTML, so a page
// can inline the design's serif-italic accents and colour spans without a
// component change. Use the `.tst-em` / `.tst-em-teal` classes for those.
//
// Authoring rule: `Html` is TRUSTED input. It is hand-written in
// `lib/testsdata.ts` only — never populate it from a CMS, an API or user input
// without sanitising first.
// =============================================================================

/** A string that may contain trusted inline HTML. Authored in `lib/testsdata.ts` only. */
export type Html = string;

/**
 * Result tone for chips, sample results and the legend.
 *
 * `good` / `avg` / `poor` are the three risk grades every health panel uses.
 * `neutral` is NOT a grade: Ancestry reports a share of your origin, not a
 * risk, so painting "72.91% South Asian" in the red of a poor result would
 * imply a verdict the test never makes. It renders in brand teal instead.
 */
export type RiskTone = 'good' | 'avg' | 'poor' | 'neutral';

/**
 * Which panel a card/hotspot/tab belongs to. Drives accent colour, and doubles
 * as the React key inside a section, so it must be unique within its page.
 *
 * This was the five Women's Health panels as a closed union. It is open now
 * because every test page brings its own panels — seven for Eye and Kidney, ten
 * for Skin, three for Men's. The five original keys still resolve to the exact
 * Figma accents (see RiskCards/BodyMap); anything else falls back to the same
 * palette, cycled by position.
 */
export type PanelKey = string;

/** The five Women's Health panels — the keys with hand-placed Figma accents. */
export const WOMENS_PANELS = ['pcos', 'pregnancy', 'mood', 'bones', 'joints'] as const;

/** Accent family for eyebrow pills and section grounds. */
export type Accent = 'crimson' | 'teal';

/** Section ground colour. Sampled from the Figma frame — see globals.css. */
export type Ground = 'cream' | 'ivory' | 'sage' | 'sand' | 'ink';

/** Named icon key — resolved by `features/tests/components/icons.tsx`. */
export type IconKey = string;

// ---------------------------------------------------------------------------
// Shared leaf shapes
// ---------------------------------------------------------------------------

/** The pill above a section heading, e.g. "● WHO SHOULD TAKE THIS TEST". */
export interface Eyebrow {
  label: string;
  icon?: IconKey;
  accent?: Accent; // default: crimson
}

/** A call-to-action button. `variant` maps to the design's three button styles. */
export interface Cta {
  label: string;
  href: string;
  variant?: 'primary' | 'ghost' | 'light'; // light = white pill on ink grounds
  icon?: IconKey; // trailing glyph; default arrow
}

/** Small rounded chip, e.g. "No needles", "Test once, for life". */
export interface Chip {
  label: Html;
  icon?: IconKey;
}

export interface Img {
  src: string;
  alt: string;
}

/** Standard section head: eyebrow + heading + optional lead paragraph. */
export interface SectionHead {
  eyebrow?: Eyebrow;
  /** H2 — HTML so the serif-italic accent can be inlined via `.tst-em`. */
  titleHtml: Html;
  leadHtml?: Html;
}

// ---------------------------------------------------------------------------
// Section variants
// ---------------------------------------------------------------------------

/** Sticky in-page anchor nav + brand + CTA. */
export interface NavSection {
  type: 'nav';
  brandHref: string;
  links: { label: string; href: string }[];
  cta: Cta;
}

export interface HeroSection {
  type: 'hero';
  eyebrow: Eyebrow;
  titleHtml: Html;
  kickerHtml: Html; // "One saliva test, at home."
  subHtml: Html;
  /** Benefit checklist between the sub-line and the CTAs. */
  bullets?: Html[];
  ctas: Cta[];
  chips: Chip[];
  /** Serif-italic line under the chips. */
  footnoteHtml: Html;
  image: Img;
  /** Floating "Your results" card overlapping the hero image. */
  resultCard: {
    title: string;
    icon?: IconKey;
    /** Right-aligned label in the card header, e.g. "KYG Lab". */
    titleRight?: string;
    rows: { label: string; value: string; tone: RiskTone }[];
    /** Line under the rows, e.g. "Confidential · Report Enclosed". */
    footNoteHtml?: Html;
  };
}

/** "This test is for you if…" — intro block + a grid of sign cards. */
export interface WhoForSection {
  type: 'whoFor';
  head: SectionHead;
  image: Img;
  introTitleHtml: Html;
  introBodyHtml: Html;
  chips: Chip[];
  signs: { icon: IconKey; accent: Accent; textHtml: Html }[];
  closingHtml: Html;
  ctas: Cta[];
}

/** "From Hollywood to Bollywood" — image with floating badges + 3 icon rows. */
export interface AspirationSection {
  type: 'aspiration';
  head: SectionHead;
  image: Img;
  badgeTop: Chip;
  badgeBottom: Chip;
  rows: { icon: IconKey; title: string; subtitle: string }[];
  bodyHtml: Html;
  /** Tinted quote panel under the body. */
  quoteHtml: Html;
}

/** Two-up "how it used to be" vs "how it works now" comparison.
 *  `footerHtml` is the emphasised line some decks rule off below the items. */
export interface ThenNowSection {
  type: 'thenNow';
  then: { icon: IconKey; kicker: string; title: string; items: Html[]; footerHtml?: Html };
  now: { icon: IconKey; kicker: string; title: string; items: Html[]; footerHtml?: Html };
  closingHtml: Html;
  cta?: Cta;
}

/**
 * Hand-placed diagram geometry for one hotspot, in the 720 x 492 figure box.
 * The frame draws each leader line by hand — no two share a slope — so a page
 * whose panels are not the Women's Health five MUST supply its own numbers.
 * See the note at the top of `sections/BodyMap.tsx` for what each field means.
 */
export interface HotspotGeom {
  /** group bbox — x, y, w, h (also the pointer target) */
  box: [number, number, number, number];
  /** dot centre */
  dot: [number, number];
  /** leader line — x1,y1 at the text end, x2,y2 at the dot end */
  line: [number, number, number, number];
  /** label anchor: `x` is the RIGHT edge for a left-side label, the LEFT edge for a right-side one */
  text: { side: 'left' | 'right'; x: number; y: number };
  /** 18px outer disc */
  ring: string;
  /** 16px inner disc — also the leader-line stroke */
  core: string;
}

/** Interactive body diagram with labelled hotspots. */
export interface BodyMapSection {
  type: 'bodyMap';
  head: SectionHead;
  image: Img;
  hotspots: {
    key: PanelKey;
    label: string;
    caption: string;
    /** Tooltip heading, e.g. "PCOS · Gene THADA". */
    tipTitle: string;
    /** Tooltip body — the question this panel answers. */
    tipBody: string;
    /** Percentage coordinates on the figure, so it scales with the image. */
    x: number;
    y: number;
    side: 'left' | 'right';
    /** Diagram geometry. Required for any key outside `WOMENS_PANELS`. */
    geom?: HotspotGeom;
  }[];
}

/** "Five risks that stay silent" — filter tabs + detail cards. */
export interface RiskCardsSection {
  type: 'riskCards';
  head: SectionHead;
  allLabel: string; // "All five"
  cards: {
    key: PanelKey;
    tabLabel: string;
    image: Img;
    imageCaption: string;
    geneLabel: string; // "PCOS · Gene THADA"
    question: Html;
    /** Serif-italic scene set above the body, on an accent rule. */
    scenarioHtml?: Html;
    bodyHtml: Html;
    /** Symptom pills between the body and the warning. */
    chips?: string[];
    warningHtml: Html;
    sample: {
      label: string;
      valueHtml: Html;
      tone: RiskTone;
      percent: number;
      /** Line under the rail, e.g. "A high risk result is a warning, not a final answer." */
      noteHtml?: Html;
    };
    /**
     * Badge glyph, top-right of the image. The Women's Health panels have their
     * own Figma artwork and leave this unset; every other page names a registry
     * icon here, because that artwork only exists for those five.
     */
    icon?: IconKey;
  }[];
  cta?: Cta;
  ctaNoteHtml?: Html;
}

/**
 * Tiles in labelled groups — for the parts of a panel that are neither a risk
 * card nor a stat: Skin Health's "what you eat, on your face", Immunity's "fuel
 * and clean-up", My Wellness's "all 52 traits". They carry no photography and
 * no filter, so they stay readable up to six across.
 *
 * Three densities, all off the same item shape:
 *   compact  6-up icon tiles           icon · title · meta · tone pill
 *   detail   3/4-up cards              icon + tone pill · title · body · meta
 *   stat     4-up cards, big numeral   statHtml · title · body
 */
export interface MarkerGridSection {
  type: 'markerGrid';
  head: SectionHead;
  /**
   * Anchor id. Defaults to `markers`. A page that uses this section more than
   * once (Sleep runs three) MUST give the extras their own id — duplicate ids
   * are invalid, and every in-page link would resolve to the first one.
   */
  anchorId?: string;
  groups: {
    /** Omitted when the grid is the whole point and needs no sub-heading. */
    kicker?: string;
    variant: 'compact' | 'detail' | 'stat';
    items: {
      icon?: IconKey;
      /** Icon badge tint. Default: teal. */
      accent?: Accent;
      /** `stat` variant — the numeral that replaces the icon badge. */
      statHtml?: Html;
      title?: string;
      /** Gene or marker under the title, e.g. "CYP1A2". */
      meta?: string;
      tone?: RiskTone;
      /** Pill copy — "Good" / "Average" / "Poor", or a share like "~73%". */
      toneLabel?: string;
      /** `detail` and `stat` variants. */
      bodyHtml?: Html;
      /** `detail` variant — draws the shared result rail under the body. */
      percent?: number;
      /** `detail` variant — the recommendation under the rail. */
      noteHtml?: Html;
    }[];
  }[];
}

/** Ink-ground statistics band. */
export interface StatsSection {
  type: 'stats';
  head: SectionHead;
  stats: {
    kicker: string;
    value: Html;
    /**
     * Numeral + rail colour. The frame runs FOUR distinct accents across five
     * cards, so this is a named colour rather than a two-value tone.
     */
    tone: 'java2' | 'java' | 'ice' | 'pink';
    /** Rail fill, as a percentage of the card's 172px track. */
    barPercent: number;
    /** Line between the numeral and the rail — what the number actually says. */
    leadHtml?: Html;
    bodyHtml: Html;
  }[];
  closingHtml: Html;
  cta?: Cta;
}

/** "Gene testing sounds complicated. It is not." — 3 illustrated cards. */
export interface ExplainerSection {
  type: 'explainer';
  head: SectionHead;
  cards: { image: Img; bodyHtml: Html }[];
  closingHtml: Html;
}

/** "The gap" — birth-to-symptom timeline. */
export interface TimelineSection {
  type: 'timeline';
  head: SectionHead;
  startLabel: string;
  endLabel: string;
  ticks: string[]; // Birth · Age 20 · Age 30 · Age 40
  centreChip: Chip;
}

/** Regret vs peace-of-mind, two illustrated outcome columns. */
export interface ContrastSection {
  type: 'contrast';
  head: SectionHead;
  negative: { badge: Chip; image: Img; kicker: string; title: string; items: Html[] };
  positive: { badge: Chip; image: Img; kicker: string; title: string; items: Html[] };
  closingHtml: Html;
  cta?: Cta;
  /** Note under the CTA, e.g. "3 tests · 1 saliva sample · results in 3 weeks". */
  ctaNoteHtml?: Html;
}

/** "The cost of knowing is small" — argument + price card. */
export interface WorthSection {
  type: 'worth';
  head: SectionHead;
  emphasisHtml: Html;
  price: {
    badge: Chip;
    titleHtml: Html;
    bodyHtml: Html;
    chips: Chip[];
    image: Img;
  };
}

/** Tonight / In a few years / Decades from now. */
export interface OutcomesSection {
  type: 'outcomes';
  cards: { icon: IconKey; kicker: string; title: string; bodyHtml: Html }[];
}

export interface TestimonialSection {
  type: 'testimonial';
  quoteHtml: Html;
  bodyHtml: Html;
  closingHtml: Html;
  cta?: Cta;
}

/** "No gene codes. No jargon." — bullet list + sample report card. */
export interface ReportPreviewSection {
  type: 'reportPreview';
  head: SectionHead;
  bullets: Html[];
  cta: Cta;
  sample: {
    badge: string;
    title: string;
    rows: { label: string; value: string; tone: RiskTone }[];
    legendHtml: Html;
  };
}

/** Numbered "how it works" steps. */
export interface StepsSection {
  type: 'steps';
  head: SectionHead;
  steps: { icon: IconKey; title: string; bodyHtml: Html; accent?: Accent }[];
  cta?: Cta;
  ctaNoteHtml?: Html;
}

/** GENEous Care counsellor block. */
export interface CounsellorSection {
  type: 'counsellor';
  head: SectionHead;
  image: Img;
  points: Html[];
  floatCard: { title: string; subtitle: string; noteHtml: Html; icon?: IconKey };
  expert: { initials: string; name: string; role: string; reviewedByLabel: string };
}

/** "Everything you need, in one box" — contents list + order panel. */
export interface KitSection {
  type: 'kit';
  head: SectionHead;
  contents: { kicker: string; title: string; items: Html[] };
  order: { kicker: string; lines: Html[]; cta: Cta; noteHtml: Html };
}

/** Accreditation badges + trust tiles. */
export interface TrustSection {
  type: 'trust';
  head: SectionHead;
  badges: { icon?: IconKey; line1: string; line2?: string }[];
  tiles: { icon?: IconKey; statHtml?: Html; title: string; bodyHtml: Html; accent?: Accent }[];
  /** Centred line under the tiles, e.g. where the lab actually is. */
  noteHtml?: Html;
}

export interface FaqsSection {
  type: 'faqs';
  head: SectionHead;
  items: { q: Html; a: Html }[];
}

/** Ink-ground closing call to action. */
export interface FinalCtaSection {
  type: 'finalCta';
  eyebrow: Eyebrow;
  titleHtml: Html;
  chips: Chip[];
  cta: Cta;
  noteHtml: Html;
}

/** Legal line rendered between the final CTA and the footer. */
export interface DisclaimerSection {
  type: 'disclaimer';
  bodyHtml: Html;
}

/** Page-owned dark footer (distinct from the global SiteFooter). */
export interface FooterSection {
  type: 'footer';
  brand: string;
  taglineHtml: Html;
  columns: { title: string; links: { label: string; href: string }[] }[];
  copyright: string;
  signoff: string;
}

/** Every section variant. Add a new page layout by adding a member here. */
export type Section =
  | NavSection
  | HeroSection
  | WhoForSection
  | AspirationSection
  | ThenNowSection
  | BodyMapSection
  | RiskCardsSection
  | MarkerGridSection
  | StatsSection
  | ExplainerSection
  | TimelineSection
  | ContrastSection
  | WorthSection
  | OutcomesSection
  | TestimonialSection
  | ReportPreviewSection
  | StepsSection
  | CounsellorSection
  | KitSection
  | TrustSection
  | FaqsSection
  | FinalCtaSection
  | DisclaimerSection
  | FooterSection;

/** Ground colour per section, keyed by index — kept beside the section so a
 *  page can alternate its own rhythm without the renderer hard-coding it. */
export interface SectionEntry {
  ground?: Ground;
}

// ---------------------------------------------------------------------------
// The page
// ---------------------------------------------------------------------------

export interface TestPage {
  slug: string;
  categorySlug: string;
  seo: { title: string; description: string };
  /** Rendered in order. This IS the page layout. */
  sections: (Section & SectionEntry)[];
}
