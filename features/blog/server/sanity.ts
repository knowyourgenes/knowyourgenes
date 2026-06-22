import { createClient, type QueryParams } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { apiVersion, dataset, projectId } from '@/features/blog/sanity/env';
import type { BlogFullPost, BlogListItem, SanityImage } from '@/features/blog/types';

type SanityImageSource = Parameters<ReturnType<typeof imageUrlBuilder>['image']>[0];

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
});

const builder = imageUrlBuilder(sanityClient);
export const urlFor = (source: SanityImageSource) => builder.image(source);

// Generic fetch wrapper with Next.js request-level revalidation.
export async function sanityFetch<T>({
  query,
  params = {},
  tags,
  revalidate = 60,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
}): Promise<T> {
  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags,
    },
  });
}

// ---------------------------------------------------------------------------
// GROQ queries
// ---------------------------------------------------------------------------

export const blogListQuery = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    heroImage,
    publishedAt,
    readMinutes,
    featured,
    "author": author->{ name, role, photo }
  }
`;

export const blogPostQuery = /* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    heroImage,
    publishedAt,
    readMinutes,
    body,
    "author": author->{ name, role, bio, photo }
  }
`;

export const blogSlugsQuery = /* groq */ `
  *[_type == "blogPost" && defined(slug.current)][].slug.current
`;

// ---------------------------------------------------------------------------
// Typed reads (used by the /blog routes). Tagged 'blogPost' so a webhook can
// revalidateTag on publish.
// ---------------------------------------------------------------------------

export function getBlogPosts(): Promise<BlogListItem[]> {
  return sanityFetch<BlogListItem[]>({ query: blogListQuery, tags: ['blogPost'] });
}

export function getBlogPost(slug: string): Promise<BlogFullPost | null> {
  return sanityFetch<BlogFullPost | null>({
    query: blogPostQuery,
    params: { slug },
    tags: ['blogPost'],
  });
}

export function getBlogSlugs(): Promise<string[]> {
  return sanityFetch<string[]>({ query: blogSlugsQuery, revalidate: 3600 });
}

/**
 * Build a sized, format-optimised image URL from a Sanity image, or null when
 * the image is missing. Centralises the `urlFor` cast so callers stay clean.
 */
export function imageUrl(
  source: SanityImage | undefined | null,
  opts: { width?: number; height?: number } = {},
): string | null {
  if (!source?.asset?._ref) return null;
  let b = urlFor(source as SanityImageSource).auto('format');
  if (opts.width) b = b.width(opts.width);
  if (opts.height) b = b.height(opts.height);
  if (opts.width && opts.height) b = b.fit('crop');
  return b.url();
}
