// NOTE: this barrel must stay CLIENT-SAFE. lib/catalog.ts imports from here and
// is itself pulled into client components (the cart), so anything with
// `import "server-only"` at the top belongs in a sub-path import instead - see
// features/products/server/kit-pricing.ts, imported directly by the PDP route.
export { default as ProductKitPage } from './components/ProductKitPage';
// The buy-surface primitives. The test pages' PDP hero renders the same
// accordion rows and the same star glyph as /pr, so they are shared through
// this barrel rather than copied (CLAUDE.md rule 3; rule 2 for the path).
export { default as Accordion } from './components/ui/Accordion';
export { default as Stars } from './components/ui/Stars';
export { getProductKit, PRODUCT_KITS, PRODUCT_KIT_SLUGS } from './data';
export { PRODUCT_BASE_PATH, productKitHref } from './routes';
export type { ProductKit } from './types';
