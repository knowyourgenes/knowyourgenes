import { describe, it, expect, vi, beforeEach } from 'vitest';

// -----------------------------------------------------------------------------
// priceCart() is the only place money is calculated, so it is worth testing
// against a fake catalogue rather than the live database - these assertions must
// hold whatever ops have priced things at today.
// -----------------------------------------------------------------------------

const packages = [
  {
    id: 'pkg_sleep',
    slug: 'sleep',
    name: 'Sleep DNA',
    tagline: '28 readings',
    price: 599_900,
    compareAtPrice: 799_900,
    coverImageUrl: null,
    active: true,
    stockQuantity: 100,
    kitShippingFee: 19_900,
    fulfillmentType: 'KIT_BY_POST',
  },
  {
    id: 'pkg_skin',
    slug: 'skin-health',
    name: 'Skin Health DNA',
    tagline: '20 markers',
    price: 649_900,
    compareAtPrice: null,
    coverImageUrl: null,
    active: true,
    stockQuantity: 3, // deliberately scarce
    kitShippingFee: 19_900,
    fulfillmentType: 'KIT_BY_POST',
  },
  {
    id: 'pkg_home',
    slug: 'womens-health',
    name: "Women's Health DNA",
    tagline: '5 health checks',
    price: 799_900,
    compareAtPrice: null,
    coverImageUrl: null,
    active: true,
    stockQuantity: 50,
    kitShippingFee: 0,
    fulfillmentType: 'AT_HOME_PHLEBOTOMIST',
  },
  {
    id: 'pkg_off',
    slug: 'ancestry',
    name: 'Ancestry DNA',
    tagline: '10 regions',
    price: 599_900,
    compareAtPrice: null,
    coverImageUrl: null,
    active: false, // de-listed
    stockQuantity: 10,
    kitShippingFee: 19_900,
    fulfillmentType: 'KIT_BY_POST',
  },
  {
    id: 'pkg_gone',
    slug: 'eye-health',
    name: 'Eye Health DNA',
    tagline: '7 health checks',
    price: 649_900,
    compareAtPrice: null,
    coverImageUrl: null,
    active: true,
    stockQuantity: 0, // sold out
    kitShippingFee: 19_900,
    fulfillmentType: 'KIT_BY_POST',
  },
];

vi.mock('@/server/prisma', () => ({
  prisma: {
    package: {
      findMany: vi.fn(async ({ where }: { where: { slug: { in: string[] } } }) =>
        packages.filter((p) => where.slug.in.includes(p.slug))
      ),
    },
  },
}));

// Coupons: FLAT200 gives ₹200 off, BROKEN always errors.
vi.mock('@/features/orders', () => ({
  applyCoupon: vi.fn(async ({ code, subtotalPaise }: { code: string | null; subtotalPaise: number }) => {
    if (!code) return { discount: 0, couponCode: null };
    if (code === 'FLAT200') return { discount: Math.min(20_000, subtotalPaise), couponCode: 'FLAT200' };
    return { discount: 0, couponCode: null, error: 'Coupon not found' };
  }),
}));

const { priceCart, computeShipping } = await import('@/features/cart/server/cart.pricing');

beforeEach(() => vi.clearAllMocks());

describe('priceCart - totals', () => {
  it('prices a single line', async () => {
    const cart = await priceCart({ lines: [{ slug: 'sleep', quantity: 1 }] });
    expect(cart.subtotal).toBe(599_900);
    expect(cart.shipping).toBe(19_900);
    expect(cart.total).toBe(619_800);
    expect(cart.itemCount).toBe(1);
  });

  it('multiplies by quantity', async () => {
    const cart = await priceCart({ lines: [{ slug: 'sleep', quantity: 3 }] });
    expect(cart.lines[0]!.lineTotal).toBe(599_900 * 3);
    expect(cart.subtotal).toBe(599_900 * 3);
  });

  it('charges kit shipping ONCE for a multi-kit order, not per line', async () => {
    const cart = await priceCart({
      lines: [
        { slug: 'sleep', quantity: 2 },
        { slug: 'skin-health', quantity: 1 },
      ],
    });
    expect(cart.subtotal).toBe(599_900 * 2 + 649_900);
    expect(cart.shipping).toBe(19_900); // not 39_800
    expect(cart.total).toBe(cart.subtotal + 19_900);
  });

  it('charges no shipping when nothing is posted', async () => {
    const cart = await priceCart({ lines: [{ slug: 'womens-health', quantity: 1 }] });
    expect(cart.shipping).toBe(0);
    expect(cart.total).toBe(799_900);
  });

  it('collapses duplicate slugs into one line', async () => {
    const cart = await priceCart({
      lines: [
        { slug: 'sleep', quantity: 1 },
        { slug: 'sleep', quantity: 2 },
      ],
    });
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0]!.quantity).toBe(3);
  });

  it('is empty and free for an empty cart', async () => {
    const cart = await priceCart({ lines: [] });
    expect(cart.lines).toHaveLength(0);
    expect(cart.total).toBe(0);
    expect(cart.shipping).toBe(0);
  });
});

describe('priceCart - coupons', () => {
  it('applies a flat discount to goods only, never to shipping', async () => {
    const cart = await priceCart({ lines: [{ slug: 'sleep', quantity: 1 }], couponCode: 'FLAT200' });
    expect(cart.discount).toBe(20_000);
    expect(cart.total).toBe(599_900 - 20_000 + 19_900);
    expect(cart.coupon).toMatchObject({ code: 'FLAT200', applied: true });
  });

  it('surfaces a bad coupon without breaking the cart', async () => {
    const cart = await priceCart({ lines: [{ slug: 'sleep', quantity: 1 }], couponCode: 'NOPE' });
    expect(cart.discount).toBe(0);
    expect(cart.coupon?.applied).toBe(false);
    expect(cart.coupon?.error).toBeTruthy();
    expect(cart.total).toBe(619_800); // undiscounted, still correct
  });

  it('never lets a total go negative', async () => {
    const cart = await priceCart({ lines: [{ slug: 'sleep', quantity: 1 }], couponCode: 'FLAT200' });
    expect(cart.total).toBeGreaterThanOrEqual(0);
  });
});

describe('priceCart - stock and availability', () => {
  it('clamps quantity to stock and says so', async () => {
    const cart = await priceCart({ lines: [{ slug: 'skin-health', quantity: 9 }] });
    expect(cart.lines[0]!.quantity).toBe(3);
    expect(cart.adjusted[0]).toMatchObject({ slug: 'skin-health', from: 9, to: 3 });
    expect(cart.subtotal).toBe(649_900 * 3);
  });

  it('caps at the per-line limit even with deep stock', async () => {
    const cart = await priceCart({ lines: [{ slug: 'sleep', quantity: 50 }] });
    expect(cart.lines[0]!.quantity).toBe(10);
    expect(cart.adjusted[0]?.to).toBe(10);
  });

  it('rejects a sold-out kit', async () => {
    const cart = await priceCart({ lines: [{ slug: 'eye-health', quantity: 1 }] });
    expect(cart.lines).toHaveLength(0);
    expect(cart.rejected[0]).toMatchObject({ slug: 'eye-health', reason: 'OUT_OF_STOCK' });
  });

  it('rejects a de-listed kit', async () => {
    const cart = await priceCart({ lines: [{ slug: 'ancestry', quantity: 1 }] });
    expect(cart.rejected[0]).toMatchObject({ slug: 'ancestry', reason: 'INACTIVE' });
  });

  it('rejects an unknown slug', async () => {
    const cart = await priceCart({ lines: [{ slug: 'not-a-test', quantity: 1 }] });
    expect(cart.rejected[0]).toMatchObject({ slug: 'not-a-test', reason: 'UNKNOWN' });
  });

  it('keeps pricing the good lines when one is rejected', async () => {
    const cart = await priceCart({
      lines: [
        { slug: 'sleep', quantity: 1 },
        { slug: 'eye-health', quantity: 1 },
      ],
    });
    expect(cart.lines).toHaveLength(1);
    expect(cart.rejected).toHaveLength(1);
    expect(cart.total).toBe(619_800);
  });

  it('ignores junk quantities instead of pricing them', async () => {
    const cart = await priceCart({
      lines: [
        { slug: 'sleep', quantity: 0 },
        { slug: 'sleep', quantity: -5 },
      ],
    });
    expect(cart.lines).toHaveLength(0);
    expect(cart.total).toBe(0);
  });
});

describe('priceCart - fulfillment', () => {
  it('flags requiresSlot only when someone has to visit', async () => {
    const posted = await priceCart({ lines: [{ slug: 'sleep', quantity: 1 }] });
    expect(posted.requiresSlot).toBe(false);

    const atHome = await priceCart({ lines: [{ slug: 'womens-health', quantity: 1 }] });
    expect(atHome.requiresSlot).toBe(true);

    const mixed = await priceCart({
      lines: [
        { slug: 'sleep', quantity: 1 },
        { slug: 'womens-health', quantity: 1 },
      ],
    });
    expect(mixed.requiresSlot).toBe(true);
  });
});

describe('computeShipping', () => {
  it('is free with no posted lines', () => {
    expect(computeShipping([{ kitShippingFee: 19_900, fulfillmentType: 'AT_HOME_PHLEBOTOMIST' }])).toBe(0);
  });

  it('takes the highest fee among posted lines, charged once', () => {
    expect(
      computeShipping([
        { kitShippingFee: 19_900, fulfillmentType: 'KIT_BY_POST' },
        { kitShippingFee: 29_900, fulfillmentType: 'KIT_BY_POST' },
        { kitShippingFee: 99_900, fulfillmentType: 'AT_HOME_PHLEBOTOMIST' },
      ])
    ).toBe(29_900);
  });
});
