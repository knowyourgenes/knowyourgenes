import Link from 'next/link';
import { Container } from '@/components/shared/Container';
import { CHROME_VARS } from '@/features/auth/server/tokens';
import { BLOG_CATEGORIES, categoryLabel, formatPostDate, imageUrl, type BlogListItem } from '@/features/blog';

function MetaLine({ post }: { post: BlogListItem }) {
  const bits = [post.author?.name, formatPostDate(post.publishedAt)].filter(Boolean);
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-(--ink-3)">
      {bits.map((b, i) => (
        <span key={i} className="inline-flex items-center gap-2">
          {i > 0 && <span className="text-(--ink-line)">•</span>}
          {b}
        </span>
      ))}
      {post.readMinutes ? (
        <span className="inline-flex items-center gap-2">
          <span className="text-(--ink-line)">•</span>
          {post.readMinutes} min read
        </span>
      ) : null}
    </div>
  );
}

function CategoryBadge({ category }: { category?: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-(--acc-50) px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-(--teal)">
      {categoryLabel(category)}
    </span>
  );
}

function PostCard({ post }: { post: BlogListItem }) {
  const img = imageUrl(post.heroImage, { width: 720, height: 460 });
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-(--r-md) border border-(--ink-line) bg-white shadow-(--sh-1) transition-[transform,box-shadow] duration-500 ease-(--e-out) hover:-translate-y-1 hover:shadow-(--sh-2)"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-(--cream-2)">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={post.heroImage?.alt ?? post.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-(--e-out) group-hover:scale-[1.05]"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <CategoryBadge category={post.category} />
        <h3 className="text-[19px] font-semibold leading-[1.3] tracking-[-0.015em] text-(--ink-1) transition-colors group-hover:text-(--teal)">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="line-clamp-3 text-[14.5px] leading-[1.6] text-(--ink-3)">{post.excerpt}</p>
        ) : null}
        <div className="mt-auto pt-2">
          <MetaLine post={post} />
        </div>
      </div>
    </Link>
  );
}

function FeaturedCard({ post }: { post: BlogListItem }) {
  const img = imageUrl(post.heroImage, { width: 1100, height: 760 });
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group grid overflow-hidden rounded-(--r-lg) border border-(--ink-line) bg-white shadow-(--sh-1) transition-[transform,box-shadow] duration-500 ease-(--e-out) hover:shadow-(--sh-2) md:grid-cols-2"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-(--cream-2) md:aspect-auto md:min-h-[340px]">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={post.heroImage?.alt ?? post.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-(--e-out) group-hover:scale-[1.04]"
          />
        ) : null}
      </div>
      <div className="flex flex-col justify-center gap-4 p-8 md:p-10">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-(--ink-3)">Featured</span>
          <CategoryBadge category={post.category} />
        </div>
        <h2 className="text-[28px] font-semibold leading-[1.18] tracking-[-0.02em] text-(--ink-1) transition-colors group-hover:text-(--teal) md:text-[32px]">
          {post.title}
        </h2>
        {post.excerpt ? <p className="max-w-[46ch] text-[16px] leading-[1.7] text-(--ink-3)">{post.excerpt}</p> : null}
        <MetaLine post={post} />
      </div>
    </Link>
  );
}

export default function BlogIndex({ posts, activeCategory }: { posts: BlogListItem[]; activeCategory?: string }) {
  const filtered = activeCategory ? posts.filter((p) => p.category === activeCategory) : posts;
  const featured = !activeCategory ? (filtered.find((p) => p.featured) ?? null) : null;
  const rest = featured ? filtered.filter((p) => p._id !== featured._id) : filtered;

  const pill = (label: string, href: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      className={
        'rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors ' +
        (active
          ? 'bg-(--ink-1) text-(--cream)'
          : 'bg-white text-(--ink-2) border border-(--ink-line) hover:border-(--teal) hover:text-(--teal)')
      }
    >
      {label}
    </Link>
  );

  return (
    <div style={CHROME_VARS} className="min-h-screen bg-(--cream) text-(--ink-1)">
      <Container className="py-[clamp(40px,6vw,80px)]">
        <header className="max-w-[640px]">
          <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-(--teal)">The KYG Journal</p>
          <h1 className="mt-3 text-[clamp(34px,5vw,52px)] font-semibold leading-[1.08] tracking-[-0.03em]">
            Genetics, decoded for real life.
          </h1>
          <p className="mt-4 text-[17px] leading-[1.6] text-(--ink-3)">
            Short, science-grounded reads on wellness, genetic literacy, research and the people behind your reports.
          </p>
        </header>

        <nav className="mt-9 flex flex-wrap gap-2" aria-label="Filter by category">
          {pill('All', '/blog', !activeCategory)}
          {BLOG_CATEGORIES.map((c) => pill(c.label, `/blog?category=${c.value}`, activeCategory === c.value))}
        </nav>

        {filtered.length === 0 ? (
          <div className="mt-16 rounded-(--r-md) border border-dashed border-(--ink-line) bg-white/60 px-6 py-16 text-center">
            <p className="text-[18px] font-medium text-(--ink-1)">No articles here yet</p>
            <p className="mt-2 text-[14.5px] text-(--ink-3)">
              {activeCategory
                ? 'Nothing in this category yet - check back soon.'
                : 'New reads are on the way. Check back soon.'}
            </p>
          </div>
        ) : (
          <>
            {featured ? (
              <div className="mt-10">
                <FeaturedCard post={featured} />
              </div>
            ) : null}

            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          </>
        )}
      </Container>
    </div>
  );
}
