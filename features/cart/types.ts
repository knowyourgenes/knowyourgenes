import type { FulfillmentType } from '@prisma/client';

/**
 * What the browser stores. Deliberately the smallest possible thing: a slug and
 * a count. Never a price - the client is not allowed an opinion about money, so
 * a tampered localStorage can only ever ask for the wrong QUANTITY of a known
 * product, which the server then re-prices and clamps to stock.
 */
export interface CartLineInput {
  slug: string;
  quantity: number;
}

/** One priced line, computed server-side from the Package row. */
export interface PricedLine {
  packageId: string;
  slug: string;
  name: string;
  tagline: string;
  coverImageUrl: string | null;
  /** Where this product is sold - used for the line's link back to its page. */
  href: string;
  unitPrice: number;
  compareAtPrice: number | null;
  quantity: number;
  lineTotal: number;
  kitShippingFee: number;
  fulfillmentType: FulfillmentType;
  /** Stock cap - the quantity stepper must not go past this. */
  maxQuantity: number;
}

/** A line the server refused, so the UI can say why instead of silently losing it. */
export interface RejectedLine {
  slug: string;
  reason: 'UNKNOWN' | 'INACTIVE' | 'OUT_OF_STOCK' | 'NOT_SELLABLE';
  message: string;
}

/** A line whose quantity the server had to clamp. */
export interface AdjustedLine {
  slug: string;
  from: number;
  to: number;
  message: string;
}

/**
 * The full server verdict on a cart. This exact shape is what the cart page,
 * the checkout summary and the smoke test all read - there is one pricing
 * calculation in the codebase and this is its output.
 */
export interface PricedCart {
  lines: PricedLine[];
  rejected: RejectedLine[];
  adjusted: AdjustedLine[];

  // All paise.
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;

  coupon: { code: string; applied: boolean; error?: string } | null;

  /** Sum of quantities - what the header badge shows. */
  itemCount: number;
  /**
   * True when any line needs a human to turn up (AT_HOME_PHLEBOTOMIST), which
   * is the only case where checkout must ask for a collection slot.
   */
  requiresSlot: boolean;
}
