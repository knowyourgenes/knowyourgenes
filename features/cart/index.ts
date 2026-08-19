// Public API of features/cart.
//
// Server-only pricing is exported here; the CLIENT pieces (provider, hooks,
// components) are imported from '@/features/cart/components/...' and
// '@/features/cart/hooks/...' directly, per the project convention - pulling
// them through this barrel would drag `server-only` into a client bundle.
export { priceCart, computeShipping, MAX_QUANTITY_PER_LINE } from './server/cart.pricing';
export type { CartLineInput, PricedCart, PricedLine, RejectedLine, AdjustedLine } from './types';
