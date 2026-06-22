import Link from 'next/link';
import { PortableText } from 'next-sanity';
import { CHROME_VARS } from '@/features/auth/server/tokens';
import { categoryLabel, formatPostDate, imageUrl, type BlogFullPost } from '@/features/blog';
import { portableComponents } from './portable-text';

export default function BlogArticle({ post }: { post: BlogFullPost }) {
  const hero = imageUrl(post.heroImage, { width: 1280, height: 720 });
  const authorPhoto = imageUrl(post.author?.photo, { width: 96, height: 96 });

  return (
    <div style={CHROME_VARS} className="min-h-screen bg-[var(--cream)] text-[var(--ink-1)]">
      <article className="mx-auto max-w-[760px] px-[var(--gutter)] py-[clamp(32px,5vw,64px)]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-[var(--ink-3)] transition-colors hover:text-[var(--teal)]"
        >
          <span aria-hidden>←</span> All articles
        </Link>

        <header className="mt-7">
          <span className="inline-flex items-center rounded-full bg-[var(--acc-50)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--teal)]">
            {categoryLabel(post.category)}
          </span>
          <h1 className="mt-4 text-[clamp(30px,4.5vw,46px)] font-semibold leading-[1.1] tracking-[-0.03em]">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-4 text-[18.5px] leading-[1.6] text-[var(--ink-3)]">{post.excerpt}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-[var(--ink-line)] py-4">
            {authorPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authorPhoto}
                alt={post.author?.name ?? ''}
                className="h-11 w-11 rounded-full object-cover"
              />
            ) : null}
            <div className="flex flex-col">
              {post.author?.name ? (
                <span className="text-[14.5px] font-semibold text-[var(--ink-1)]">
                  {post.author.name}
                </span>
              ) : null}
              <span className="text-[13px] text-[var(--ink-3)]">
                {[post.author?.role, formatPostDate(post.publishedAt)].filter(Boolean).join(' · ')}
                {post.readMinutes ? ` · ${post.readMinutes} min read` : ''}
              </span>
            </div>
          </div>
        </header>

        {hero ? (
          <figure className="mt-8 overflow-hidden rounded-[var(--r-lg)] border border-[var(--ink-line)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={hero}
              alt={post.heroImage?.alt ?? post.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </figure>
        ) : null}

        <div className="mt-9">
          {post.body?.length ? (
            <PortableText value={post.body} components={portableComponents} />
          ) : (
            <p className="text-[17px] leading-[1.85] text-[var(--ink-3)]">{post.excerpt}</p>
          )}
        </div>

        {post.author?.bio ? (
          <aside className="mt-14 flex flex-col gap-4 rounded-[var(--r-md)] border border-[var(--ink-line)] bg-white p-6 sm:flex-row sm:items-start">
            {authorPhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={authorPhoto}
                alt={post.author.name ?? ''}
                className="h-14 w-14 shrink-0 rounded-full object-cover"
              />
            ) : null}
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-3)]">
                Written by
              </p>
              <p className="mt-1 text-[16px] font-semibold text-[var(--ink-1)]">
                {post.author.name}
                {post.author.role ? (
                  <span className="font-normal text-[var(--ink-3)]"> · {post.author.role}</span>
                ) : null}
              </p>
              <p className="mt-2 text-[14.5px] leading-[1.6] text-[var(--ink-3)]">
                {post.author.bio}
              </p>
            </div>
          </aside>
        ) : null}

        <div className="mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--ink-line)] bg-white px-5 py-3 text-[14px] font-semibold text-[var(--ink-1)] transition-colors hover:border-[var(--teal)] hover:text-[var(--teal)]"
          >
            <span aria-hidden>←</span> Back to all articles
          </Link>
        </div>
      </article>
    </div>
  );
}
