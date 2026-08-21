import { describe, it, expect } from 'vitest';
import { CATEGORIES, getCategory, searchProducts, visibleProducts } from '@/lib/categoriesdata';

const wellness = getCategory('wellness')!;
const products = visibleProducts(wellness);

/** Slugs a query resolves to, order-independent. */
function slugsFor(query: string) {
  return searchProducts(products, query)
    .map((p) => p.slug)
    .sort();
}

describe('searchProducts', () => {
  it('returns everything for an empty or whitespace query', () => {
    expect(searchProducts(products, '')).toHaveLength(products.length);
    expect(searchProducts(products, '   ')).toHaveLength(products.length);
  });

  // The point of the keyword lists: nobody types the product name.
  it.each([
    ['hair fall', 'mens-health'],
    ['balding', 'mens-health'],
    ['pcos', 'womens-health'],
    ['miscarriage', 'womens-health'],
    ['snoring', 'sleep'],
    ["can't sleep", 'sleep'],
    ['uric acid', 'kidney-health'],
    ['kidney stones', 'kidney-health'],
    ['pimples', 'skin-health'],
    ['spectacles', 'eye-health'],
    ['family tree', 'ancestry'],
    ['weight loss', 'my-wellness'],
    ['always sick', 'immunity-health'],
  ])('“%s” finds %s', (query, slug) => {
    expect(slugsFor(query)).toContain(slug);
  });

  it('ignores apostrophes and case on both sides', () => {
    expect(slugsFor('WOMENS')).toContain('womens-health');
    expect(slugsFor("women's")).toContain('womens-health');
    expect(slugsFor('cant sleep')).toEqual(slugsFor("can't sleep"));
  });

  it('matches partial words so a half-typed query never empties the grid', () => {
    expect(slugsFor('kidn')).toContain('kidney-health');
    expect(slugsFor('ancest')).toContain('ancestry');
  });

  it('ANDs its tokens - extra words narrow, never widen', () => {
    const hair = slugsFor('hair');
    const hairFall = slugsFor('hair fall');
    expect(hairFall.length).toBeLessThanOrEqual(hair.length);
    expect(slugsFor('hair kidney')).toHaveLength(0);
  });

  it('returns nothing for a query that matches no concern', () => {
    expect(slugsFor('quantum tunnelling')).toHaveLength(0);
  });
});

describe('category card data', () => {
  it('every product carries the fields the card needs', () => {
    for (const p of products) {
      expect(p.icon, `${p.slug} icon`).toBeTruthy();
      expect(p.tone, `${p.slug} tone`).toBeTruthy();
      expect(p.keywords.length, `${p.slug} keywords`).toBeGreaterThan(0);
    }
  });

  it('every category carries a fallback mark', () => {
    for (const c of CATEGORIES) {
      expect(c.icon, `${c.slug} icon`).toBeTruthy();
      expect(c.tone, `${c.slug} tone`).toBeTruthy();
    }
  });

  // Guards the one thing that silently ships blank: five tests still have
  // 136-byte transparent stubs under public/tests/<slug>/, so `image` must
  // point at a real file when it is set at all.
  it('never points a card at a placeholder stub', async () => {
    const { statSync } = await import('node:fs');
    const assets = [
      ...products.flatMap((p) => (p.image ? [[p.slug, p.image.src] as const] : [])),
      ...CATEGORIES.flatMap((c) => (c.image ? [[c.slug, c.image.src] as const] : [])),
    ];
    expect(assets.length).toBeGreaterThan(0);
    for (const [slug, src] of assets) {
      expect(statSync(`public${src}`).size, `${slug} → ${src}`).toBeGreaterThan(1024);
    }
  });
});
