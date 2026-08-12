// Generators for /llms.txt and /llms-full.txt (see https://llmstxt.org).
//
// buildLlmsTxt()      → a concise, link-first markdown index of the site.
// buildLlmsFullTxt()  → the same skeleton, but with full blog article bodies
//                        (Portable Text → markdown) and test FAQ Q&A inlined.
//
// Data sources (this project):
//   • Static pages + genetic tests  → @/lib/testsdata (local, always available)
//   • Blog articles                  → Sanity CMS via @/features/blog (best-effort)

import { getFaqItems } from '@/features/tests';
import { siteConfig, absoluteUrl, cleanTitle } from '@/lib/site-config';
import { TEST_PAGES } from '@/lib/testsdata';
import { sanityFetch, blogListQuery, blogPostQuery } from '@/features/blog';

// ---------------------------------------------------------------------------
// Static route registry (discovered routes; route groups/admin/agent excluded)
// ---------------------------------------------------------------------------

const KEY_PAGES: { path: string; label: string; desc: string }[] = [
  { path: '/', label: 'Home', desc: siteConfig.description },
  {
    path: '/womens-health',
    label: "Women's Health DNA - Is your PCOS genetic?",
    desc:
      '1 in 5 Indian women has PCOS. An at-home saliva test reads your THADA gene variant so you can ' +
      'stop guessing and start managing. Part of the 5-panel Women’s Health DNA report.',
  },
  {
    path: '/pregnancy-loss',
    label: 'Recurrent Pregnancy Loss - genetic risk',
    desc:
      'Recurrent miscarriage is often genetic, not bad luck. An at-home saliva test reads your MTHFR and ' +
      'FOXP3 variants so you and your doctor can act before you begin trying.',
  },
  {
    path: '/peripartum-depression',
    label: 'Peripartum Depression - genetic risk',
    desc:
      'Postpartum depression is often biology, not weakness. An at-home saliva test reads your COMT gene ' +
      'variant so you and your doctor can prepare before birth, not react after.',
  },
];

const LEGAL_PAGES: { path: string; label: string }[] = [
  { path: '/privacy', label: 'Privacy Policy' },
  { path: '/terms', label: 'Terms of Service' },
  { path: '/refunds', label: 'Refund Policy' },
  { path: '/shipping', label: 'Shipping & Delivery' },
  { path: '/consent', label: 'Genetic Testing Consent' },
];

/** Blog posts live at /blog/<slug>. NOTE: a public /blog route is not wired yet
 *  - these URLs resolve only once that route exists. */
const blogUrl = (slug: string) => absoluteUrl(`/blog/${slug}`);
const testUrl = (categorySlug: string, slug: string) => absoluteUrl(`/categories/${categorySlug}/${slug}`);

/** Strip inline HTML tags + collapse entities from an HTML copy string. */
const stripHtml = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

// ---------------------------------------------------------------------------
// Sanity blog types (shapes returned by the reused GROQ queries)
// ---------------------------------------------------------------------------

interface BlogListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  publishedAt?: string;
  readMinutes?: number;
  author?: { name?: string; role?: string } | null;
}

interface PortableSpan {
  _type: 'span';
  text?: string;
  marks?: string[];
}

interface PortableBlock {
  _type: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: PortableSpan[];
  markDefs?: { _key: string; _type: string; href?: string }[];
}

interface BlogFullPost extends BlogListItem {
  body?: PortableBlock[];
  author?: { name?: string; role?: string; bio?: string } | null;
}

// ---------------------------------------------------------------------------
// Portable Text → markdown (headings, lists, blockquotes, paragraphs; marks for
// strong/em/links). Images and other non-text blocks are skipped.
// ---------------------------------------------------------------------------

function serializeSpan(span: PortableSpan, markDefs: PortableBlock['markDefs'] = []): string {
  let text = span.text ?? '';
  if (!text) return '';
  const marks = span.marks ?? [];
  if (marks.includes('strong')) text = `**${text}**`;
  if (marks.includes('em')) text = `_${text}_`;
  for (const mark of marks) {
    const def = markDefs?.find((d) => d._key === mark);
    if (def && def._type === 'link' && def.href) text = `[${text}](${def.href})`;
  }
  return text;
}

/**
 * Convert a Portable Text array to markdown.
 * @param headingOffset shifts body headings deeper so they nest under the
 *   article title (the spec's "offset by 2"): h2 → h(2+offset), h3 → h(3+offset).
 */
function portableTextToMarkdown(blocks: PortableBlock[] = [], headingOffset = 2): string {
  const lines: { text: string; isList: boolean }[] = [];

  for (const block of blocks) {
    if (block._type !== 'block') continue; // skip images / embeds
    const text = (block.children ?? []).map((c) => serializeSpan(c, block.markDefs)).join('');
    if (!text.trim()) continue;

    if (block.listItem === 'bullet') {
      lines.push({ text: `- ${text}`, isList: true });
      continue;
    }
    if (block.listItem === 'number') {
      lines.push({ text: `1. ${text}`, isList: true });
      continue;
    }

    const style = block.style ?? 'normal';
    if (style === 'blockquote') {
      lines.push({ text: `> ${text}`, isList: false });
    } else if (style === 'h2' || style === 'h3' || style === 'h4') {
      const level = Number(style.slice(1)) + headingOffset;
      lines.push({ text: `${'#'.repeat(Math.min(level, 6))} ${text}`, isList: false });
    } else {
      lines.push({ text, isList: false });
    }
  }

  // Join: consecutive list items hug together; everything else gets a blank line.
  let out = '';
  lines.forEach((line, i) => {
    if (i === 0) {
      out = line.text;
      return;
    }
    const prev = lines[i - 1];
    out += prev.isList && line.isList ? `\n${line.text}` : `\n\n${line.text}`;
  });
  return out;
}

// ---------------------------------------------------------------------------
// Shared section builders
// ---------------------------------------------------------------------------

function keyPagesSection(): string {
  const rows = KEY_PAGES.map((p) => `- [${p.label}](${absoluteUrl(p.path)}): ${p.desc}`);
  return `## Key Pages\n\n${rows.join('\n')}`;
}

function legalSection(): string {
  const rows = LEGAL_PAGES.map((p) => `- [${p.label}](${absoluteUrl(p.path)})`);
  return `## Legal\n\n${rows.join('\n')}`;
}

function testsSection(full: boolean): string {
  const blocks = TEST_PAGES.map((t) => {
    const label = cleanTitle(t.seo.title);
    const url = testUrl(t.categorySlug, t.slug);
    if (!full) return `- [${label}](${url}): ${t.seo.description}`;

    let block = `### ${label}\n${url}\n\n${t.seo.description}`;
    const faqs = getFaqItems(t);
    if (faqs.length) {
      const qa = faqs.map((f) => `**Q: ${stripHtml(f.q)}**\n\n${stripHtml(f.a)}`).join('\n\n');
      block += `\n\n#### FAQ\n\n${qa}`;
    }
    return block;
  });
  const sep = full ? '\n\n' : '\n';
  return `## Genetic Tests\n\n${blocks.join(sep)}`;
}

function formatDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

function authorLine(post: BlogListItem): string {
  const bits = [formatDate(post.publishedAt), post.author?.name, post.category].filter(Boolean);
  return bits.join(' · ');
}

// ---------------------------------------------------------------------------
// Public generators
// ---------------------------------------------------------------------------

const HEADER = (): string => `# ${siteConfig.siteName}\n\n> ${siteConfig.description}`;

export async function buildLlmsTxt(): Promise<string> {
  const sections: string[] = [HEADER(), keyPagesSection(), testsSection(false)];

  // Blog index (best-effort; the local sections above always render).
  let posts: BlogListItem[] = [];
  try {
    posts = await sanityFetch<BlogListItem[]>({ query: blogListQuery, revalidate: 3600 });
  } catch {
    posts = [];
  }
  if (posts.length) {
    const rows = posts.map((p) => `- [${cleanTitle(p.title)}](${blogUrl(p.slug)})${p.excerpt ? `: ${p.excerpt}` : ''}`);
    sections.push(`## Insights (Blog)\n\n${rows.join('\n')}`);
  }

  sections.push(legalSection());
  return `${sections.join('\n\n')}\n`;
}

export async function buildLlmsFullTxt(): Promise<string> {
  const sections: string[] = [HEADER(), keyPagesSection(), testsSection(true)];

  // Full blog bodies (best-effort). Reuse the existing list + per-post queries.
  let list: BlogListItem[] = [];
  try {
    list = await sanityFetch<BlogListItem[]>({ query: blogListQuery, revalidate: 3600 });
  } catch {
    list = [];
  }

  if (list.length) {
    const posts = await Promise.all(
      list.map(async (item) => {
        try {
          return await sanityFetch<BlogFullPost>({
            query: blogPostQuery,
            params: { slug: item.slug },
            revalidate: 3600,
          });
        } catch {
          return null;
        }
      })
    );

    const articles = posts
      .filter((p): p is BlogFullPost => !!p)
      .map((post) => {
        const parts = [`### ${cleanTitle(post.title)}`, blogUrl(post.slug)];
        const meta = authorLine(post);
        if (meta) parts.push(`_${meta}_`);
        if (post.excerpt) parts.push(`> ${post.excerpt}`);
        const body = portableTextToMarkdown(post.body, 2);
        if (body) parts.push(body);
        return parts.join('\n\n');
      });

    if (articles.length) sections.push(`## Insights (Blog)\n\n${articles.join('\n\n---\n\n')}`);
  }

  sections.push(legalSection());
  return `${sections.join('\n\n')}\n`;
}
