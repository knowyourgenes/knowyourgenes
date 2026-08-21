import type { CategoryProduct } from '@/lib/categoriesdata';

/**
 * One row on /search: the marketing content for a test, joined to the commerce
 * facts the results page filters and sorts on.
 *
 * Commerce fields are nullable because the join can miss. A content page with no
 * active Package row renders unpriced rather than "₹0" - the same rule
 * features/products/server/kit-pricing.ts already follows for the PDP. A test
 * whose commerce row is missing must look unpriced, not free.
 */
export type SearchProduct = CategoryProduct & {
  categorySlug: string;
  categoryName: string;
  /** paise, or null when no active Package row matches the slug */
  price: number | null;
  /** paise; higher than `price` when the test is discounted */
  compareAtPrice: number | null;
  inStock: boolean;
  biomarkerCount: number | null;
};

/** Result ordering. `relevance` is the catalogue's own order. */
export type SortKey = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

/**
 * Report-size buckets, over Package.biomarkerCount.
 *
 * Bucketed rather than a second slider because the number means very different
 * things across the range - the gap between a 5-check report and a 28-reading
 * one is a different KIND of product, not a bigger one, and nobody drags a
 * handle to "about 20 markers".
 */
export const SIZE_BUCKETS: { value: string; label: string; min: number; max: number }[] = [
  { value: 'focused', label: 'Focused (under 10)', min: 0, max: 9 },
  { value: 'broad', label: 'Broad (10–29)', min: 10, max: 29 },
  { value: 'deep', label: 'Deep (30+)', min: 30, max: Number.MAX_SAFE_INTEGER },
];
