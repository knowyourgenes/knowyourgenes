import { handle } from '@/server/api';
import { cartPrice } from '@/lib/validators';
import { priceCart } from '@/features/cart';

/**
 * POST /api/cart
 *
 * Re-prices a cart against live Package rows and returns the authoritative
 * totals. The browser holds only slugs + quantities (see features/cart/types),
 * so this is what turns a localStorage blob into money.
 *
 * Deliberately UNAUTHENTICATED: a visitor must be able to fill a basket and see
 * what it costs before they have an account. Nothing here reads or writes user
 * data, and every number is computed from the database, so there is nothing to
 * leak or tamper with - the worst a caller can do is ask the price of a public
 * catalogue.
 *
 * Checkout does NOT trust the total this returns; POST /api/checkout re-runs the
 * same priceCart() at payment time.
 */
export async function POST(req: Request) {
  return handle(async () => {
    const body = await req.json();
    const input = cartPrice.parse(body);
    return priceCart({ lines: input.lines, couponCode: input.couponCode });
  });
}
