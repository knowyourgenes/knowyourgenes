// NOTE: this barrel must stay CLIENT-SAFE - it is imported by the search route
// and by anything that wants to build a /search URL. The Prisma-backed read in
// server/search.queries.ts carries `import "server-only"` and is imported by
// sub-path from the route, the same way features/products does it.
export { searchHref, SEARCH_PATH } from './routes';
export { SIZE_BUCKETS, SORT_OPTIONS } from './types';
export type { SearchProduct, SortKey } from './types';
