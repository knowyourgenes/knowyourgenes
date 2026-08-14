import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site-config';
import { TEST_PAGES } from '@/lib/testsdata';
import { CATEGORIES } from '@/lib/categoriesdata';
import { sanityFetch, blogListQuery } from '@/features/blog';
import { PRODUCT_KIT_SLUGS, productKitHref } from '@/features/products';

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

  add('/about', { changeFrequency: 'monthly', priority: 0.6 });
  add('/contact', { changeFrequency: 'monthly', priority: 0.6 });

  for (const path of ['/privacy', '/terms', '/refunds', '/shipping', '/consent']) {
    add(path, { changeFrequency: 'yearly', priority: 0.3 });
  }

  // --- Product kits (PDPs, local data) ---
  for (const slug of PRODUCT_KIT_SLUGS) {
    add(productKitHref(slug), { changeFrequency: 'weekly', priority: 0.9 });
  }

  // --- Categories + genetic tests (local data, always available) ---
  add('/categories', { changeFrequency: 'weekly', priority: 0.7 });
  for (const c of CATEGORIES) {
    add(`/categories/${c.slug}`, { changeFrequency: 'monthly', priority: 0.7 });
  }
  for (const t of TEST_PAGES) {
    add(`/categories/${t.categorySlug}/${t.slug}`, { changeFrequency: 'monthly', priority: 0.8 });
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
