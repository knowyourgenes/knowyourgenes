// =============================================================================
// features/tests - where a test page's buy CTAs go
// -----------------------------------------------------------------------------
// Every CTA on a test page is authored as `href: '#kit'` in lib/tests/<slug>.ts
// - 81 of them across the nine tests. That anchor used to scroll to the page's
// own kit section, whose button also pointed at '#kit', so it scrolled to
// itself and nothing could be bought.
//
// They now all hand over to the kit page with this report pre-ticked. Rewriting
// them HERE rather than in the data files means the destination is one line to
// change, and a new test page keeps working by authoring '#kit' as before.
// =============================================================================

import { productKitHref } from '@/features/products/routes';

/** The one kit everything ships in. */
export const KIT_SLUG = 'genetic-testing-kit';

/** The literal the data files author for "take me to checkout". */
export const KIT_ANCHOR = '#kit';

/** /pr/genetic-testing-kit?select=sleep */
export function kitHrefFor(reportSlug: string): string {
  return `${productKitHref(KIT_SLUG)}?select=${encodeURIComponent(reportSlug)}`;
}

/**
 * Rewrites `#kit` to the kit page, deeply, leaving every other href alone.
 *
 * Walks the section objects because CTAs live at many depths (hero.ctas[],
 * worth.cta, finalCta.cta, riskCards[].cta, …) and adding a prop to each of the
 * two dozen section components would be far more code and far easier to miss.
 * Structure is preserved; only matching string values change.
 */
export function resolveKitLinks<T>(sections: T, reportSlug: string): T {
  const target = kitHrefFor(reportSlug);

  const walk = (node: unknown): unknown => {
    if (typeof node === 'string') return node === KIT_ANCHOR ? target : node;
    if (Array.isArray(node)) return node.map(walk);
    if (node && typeof node === 'object') {
      const out: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(node as Record<string, unknown>)) out[key] = walk(value);
      return out;
    }
    return node;
  };

  return walk(sections) as T;
}
