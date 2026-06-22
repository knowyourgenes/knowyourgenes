// Shapes returned by the blog GROQ projections in ./server/sanity.ts.
// Kept loose on the Portable Text body — the PortableText renderer handles it.

export interface SanityImage {
  asset?: { _ref: string; _type?: string };
  alt?: string;
  hotspot?: { x: number; y: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export interface BlogAuthor {
  name?: string;
  role?: string;
  bio?: string;
  photo?: SanityImage;
}

export interface BlogListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  heroImage?: SanityImage;
  publishedAt?: string;
  readMinutes?: number;
  featured?: boolean;
  author?: BlogAuthor | null;
}

/** A single Portable Text node — kept open; the renderer maps the known types. */
export interface PortableBlock {
  _type: string;
  _key?: string;
  [key: string]: unknown;
}

export interface BlogFullPost extends BlogListItem {
  body?: PortableBlock[];
}

// Mirrors the `category` option list in the Sanity blogPost schema.
export const BLOG_CATEGORIES = [
  { value: 'genetic-literacy', label: 'Genetic Literacy' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'research', label: 'Research' },
  { value: 'stories', label: 'Stories' },
] as const;

export function categoryLabel(value?: string): string {
  return BLOG_CATEGORIES.find((c) => c.value === value)?.label ?? 'Insights';
}

/** Human-readable Indian-format date, safe on undefined / bad input. */
export function formatPostDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}
