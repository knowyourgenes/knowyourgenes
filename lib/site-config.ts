// Canonical site identity, consumed by sitemap.ts, robots.ts and the llms.txt
// routes. `siteUrl` is env-driven (NEXT_PUBLIC_SITE_URL) so the same code emits
// correct absolute URLs across local / staging / production without hardcoding a
// domain. Set NEXT_PUBLIC_SITE_URL to the production origin (no trailing slash),
// e.g. https://www.knowyourgenes.in
export const siteConfig = {
  siteName: 'Know Your Genes',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, ''),
  description:
    'Book a DNA test. We come to you. NABL-certified labs, plain-language reports, ' +
    'optional genetic counselling. Delhi NCR only.',
} as const;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = '/'): string {
  return `${siteConfig.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Strip the brand suffix off a meta title for cleaner labels. */
export function cleanTitle(title: string): string {
  return title
    .replace(/\s*[·|–\-]\s*KYG\s*[·|–\-]\s*Know Your Genes\s*$/i, '')
    .replace(/\s*[·|]\s*Know Your Genes\s*$/i, '')
    .replace(/\s*[·|]\s*KYG\s*$/i, '')
    .trim();
}
