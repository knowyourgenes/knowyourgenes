// Single source of truth for product URLs. Every internal link to a PDP should
// go through productKitHref() so the base segment can move without a sweep.
export const PRODUCT_BASE_PATH = '/pr';

export function productKitHref(slug: string): string {
  return `${PRODUCT_BASE_PATH}/${slug}`;
}
