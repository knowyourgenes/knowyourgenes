import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { TESTS } from '@/features/catalog/data/tests';
import { sanityFetch, blogListQuery } from '@/features/blog';

export const revalidate = 3600;

interface BlogSitemapItem {
  slug: string;
  publishedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  const add = (
    path: string,
    opts: { lastModified?: Date; changeFrequency?: MetadataRoute.Sitemap[number]['changeFrequency']; priority?: number }
  ) => {
    const url = absoluteUrl(path);
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({ url, lastModified: opts.lastModified ?? now, ...opts });
  };

  // --- Static pages (always emitted) ---
  add('/', { changeFrequency: 'weekly', priority: 1 });

  for (const path of ['/womens-health', '/pregnancy-loss', '/peripartum-depression']) {
    add(path, { changeFrequency: 'weekly', priority: 0.9 });
  }

  for (const path of ['/privacy', '/terms', '/refunds', '/shipping', '/consent']) {
    add(path, { changeFrequency: 'yearly', priority: 0.3 });
  }

  // --- Genetic tests (local data, always available) ---
  for (const t of TESTS) {
    add(`/${t.categorySlug}/${t.slug}`, { changeFrequency: 'monthly', priority: 0.8 });
  }

  // --- Blog posts from Sanity (best-effort; static routes survive CMS outages) ---
  // NOTE: a public /blog route is not wired yet; these resolve once it exists.
  try {
    const posts = await sanityFetch<BlogSitemapItem[]>({ query: blogListQuery, revalidate: 3600 });
    for (const post of posts) {
      if (!post?.slug) continue;
      add(`/blog/${post.slug}`, {
        lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch {
    // CMS unreachable - static + test routes above are still emitted.
  }

  return entries;
}
