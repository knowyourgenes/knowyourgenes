// =============================================================================
// features/products - data model for the data-driven Product (PDP) page.
// -----------------------------------------------------------------------------
// Every product-kit page (the Genetic Testing Kit, and the ~129 tests to come)
// is rendered purely from a `ProductKit` object declared in `data.ts`. The
// route app/pr/[kit_slug] looks the object up by `slug` and renders it
// through <ProductKitPage/>. Add a kit = add an entry; the layout never changes.
// =============================================================================

export interface Pill {
  label: string;
}

export interface Variant {
  value: string;
  label: string;
}

export interface TrustChip {
  /** lucide/material icon key resolved in the Icon map */
  icon: 'saliva' | 'clock' | 'shield' | 'chat';
  line1: string;
  line2: string;
}

/** One "What's included" card (Nutrition / Weight / Fitness / Detox). */
export interface IncludedItem {
  name: string;
  traits: string; // e.g. "20 traits"
  desc: string;
}

/** A collapsible spec row below "What's included". */
export interface SpecItem {
  title: string; // e.g. "SAMPLE TYPE"
  body: string;
}

export interface FeatureCard {
  icon: 'spark' | 'ship' | 'report' | 'lock';
  title: string;
}

export interface UpgradeCard {
  kicker: string; // "UPGRADE TO COMPLETE PACK"
  badge?: string; // "MOST VALUE"
  title: string; // "+ Men's Wellness & Women's Health"
  desc: string; // adds-… paragraph (may contain <b> handled as plain text)
  totalLabel: string; // "Complete Pack total: ₹____"
  ctaLabel: string; // "Upgrade My Order"
  highlighted?: boolean;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Review {
  initials: string; // "C"
  name: string; // "[Customer name]"
  date: string; // "[Date]"
  stars: number; // 5
  quote: string;
}

/**
 * Live commerce data for a kit, read from the Package row that shares its slug.
 * Null on a PDP whose Package is missing or de-listed, in which case the BuyBox
 * shows the content placeholder rather than a price.
 */
export interface KitPricing {
  price: number; // paise
  compareAtPrice: number | null;
  inStock: boolean;
  maxQuantity: number;
  kitShippingFee: number;
}

export interface ProductKit {
  slug: string;

  seo: { title: string; description: string };

  /** Thin black info bar rendered directly under the site header. */
  utilityBar: { text: string; phone: string };

  breadcrumb: string[]; // ["Home", "Genetic Testing Kit", "Genetic Testing Kits with Reports"]

  // ---- PDP: gallery ----
  gallery: {
    brandLabel: string; // "KNOW YOUR GENES"
    title: string; // "Genetic Testing Kit"
    subtitle: string; // "Detox · Weight Management · Fitness · Nutrition · 53 traits"
    thumbCount: number; // 4
  };

  // ---- PDP: buy box ----
  pills: Pill[];
  title: string; // H1 "Genetic Testing Kit"
  rating: number; // 5.0
  reviewCount: number; // 5
  price: string; // "₹____" - placeholder kept from the design
  variantLabel: string; // "SELECT REPORT"
  variants: Variant[];
  upsellLinkLabel: string; // "Want more from one sample? See Complete & Total Pack options"
  trustChips: TrustChip[];
  category: string; // "Genetic Testing Kit" - rendered as "Category: <b>…</b>"

  included: {
    title: string; // "WHAT'S INCLUDED"
    items: IncludedItem[];
  };
  specs: SpecItem[]; // Sample type / Testing technique / What you'll receive

  // ---- Features ----
  features: {
    eyebrow: string; // "WHY KYG"
    heading: string; // "Features"
    cards: FeatureCard[];
  };

  // ---- Upgrade ----
  upgrade: {
    eyebrow: string; // "ONE SAMPLE, MORE ANSWERS"
    heading: string; // "Already ordering?"
    headingAccent: string; // "Get more from the same sample."
    sub: string;
    cards: UpgradeCard[];
  };

  // ---- FAQ ----
  faq: {
    eyebrow: string; // "BEFORE YOU ORDER"
    heading: string; // "FAQs"
    items: Faq[];
  };

  // ---- Reviews ----
  reviews: {
    eyebrow: string; // "REVIEWS"
    heading: string; // "5 reviews for Genetic Testing Kits with Reports"
    disclaimer: string;
    items: Review[];
  };
}
