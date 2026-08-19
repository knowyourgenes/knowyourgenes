// NOTE: this barrel must stay CLIENT-SAFE. lib/catalog.ts imports from here and
// is itself pulled into client components (the cart), so anything with
// `import "server-only"` at the top belongs in a sub-path import instead - see
// features/products/server/kit-pricing.ts, imported directly by the PDP route.
export { default as ProductKitPage } from './components/ProductKitPage';
export { getProductKit, PRODUCT_KITS, PRODUCT_KIT_SLUGS } from './data';
export { PRODUCT_BASE_PATH, productKitHref } from './routes';
export type { ProductKit } from './types';
