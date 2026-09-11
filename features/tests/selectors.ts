// =============================================================================
// features/tests - read helpers for a section-array TestPage
// -----------------------------------------------------------------------------
// Consumers outside this feature (the homepage test cards, the llms.txt writer,
// the sitemap) need a couple of specific values out of a page. They must NOT
// walk `page.sections` themselves: the array is ordered and optional, so a page
// that drops or reorders a section would silently break them.
//
// These helpers return `undefined` when a page does not include that section,
// which is a legitimate state - callers are expected to fall back.
// =============================================================================

import type { BuyPdpSection, FaqsSection, HeroSection, Img, Section, TestPage } from './types';

/** First section of a given `type`, or undefined if the page has none. */
export function findSection<T extends Section['type']>(
  page: TestPage,
  type: T
): Extract<Section, { type: T }> | undefined {
  return page.sections.find((s): s is Extract<Section, { type: T }> & { ground?: never } => s.type === type) as
    | Extract<Section, { type: T }>
    | undefined;
}

/**
 * The page's lead image - used for cards and social previews.
 *
 * Pages in TEST_PAGES have had their `hero` retired by `withBuyStructure`, so
 * this falls back to the buy surface's first slide. That slide is only ever a
 * vetted photograph (see structure.ts), so a test without one returns
 * undefined here - which is correct: Men's old hero was a blood draw.
 */
export function getHeroImage(page: TestPage): Img | undefined {
  return (
    (findSection(page, 'hero') as HeroSection | undefined)?.image ??
    (findSection(page, 'buyPdp') as BuyPdpSection | undefined)?.gallery.slides[0]
  );
}

/** FAQ pairs, for llms.txt and FAQPage structured data. */
export function getFaqItems(page: TestPage): FaqsSection['items'] {
  return (findSection(page, 'faqs') as FaqsSection | undefined)?.items ?? [];
}
