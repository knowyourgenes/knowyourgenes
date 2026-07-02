// Shapes returned by the blog GROQ projections in ./server/sanity.ts.
// Kept loose on the Portable Text body - the PortableText renderer handles it.

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

/** A single Portable Text node - kept open; the renderer maps the known types. */
export interface PortableBlock {
  _type: string;
  _key?: string;
  [key: string]: unknown;
}

export interface BlogFullPost extends BlogListItem {
  body?: PortableBlock[];
}

/** A heading pulled from the article body, used by the sticky quick-nav. */
export interface BlogHeading {
  /** the source block's _key (used to match the rendered heading's id) */
  key: string;
  /** anchor id (slug of the text, de-duplicated) */
  id: string;
  text: string;
  level: 2 | 3;
  /** the FAQ section heading and its question sub-headings; kept out of the
   *  quick-nav (still rendered with an anchor id for deep links). */
  faq: boolean;
}

function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  );
}

/** Pull the h2/h3 headings out of a Portable Text body for the table of
 *  contents. Anchor ids are slugs of the heading text, de-duplicated by suffix
 *  so they stay unique and match what `buildPortableComponents` renders. */
export function extractHeadings(body?: PortableBlock[]): BlogHeading[] {
  if (!body?.length) return [];
  const out: BlogHeading[] = [];
  const seen = new Map<string, number>();
  // The FAQ section (an h2 like "FAQ" / "Frequently asked …") and every h3 under
  // it, up to the next h2, are flagged so the quick-nav can drop them.
  let inFaq = false;
  for (const block of body) {
    if (block._type !== 'block') continue;
    const style = block.style as string | undefined;
    if (style !== 'h2' && style !== 'h3') continue;
    const children = (block.children as Array<{ text?: string }> | undefined) ?? [];
    const text = children
      .map((c) => c?.text ?? '')
      .join('')
      .trim();
    if (!text) continue;
    const level: 2 | 3 = style === 'h2' ? 2 : 3;
    if (level === 2) inFaq = /^\s*(faqs?\b|frequently asked)/i.test(text);
    const base = slugifyHeading(text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    const id = n === 0 ? base : `${base}-${n + 1}`;
    out.push({ key: (block._key as string) || id, id, text, level, faq: inFaq });
  }
  return out;
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
