import { createClient, type QueryParams } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import { apiVersion, dataset, projectId } from '@/sanity/env';

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
