import Link from 'next/link';

import { BTN } from '@/components/shared/button-styles';
import { Icon } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { imageUrl, type BlogListItem } from '@/features/blog';
import { FEED } from '../constants';
import { PostMeta, Tag } from './PostCard';

/** The frame's media panel - a deep teal ramp, used when the post has no hero
 *  image of its own. */
const MEDIA_FALLBACK = 'linear-gradient(134deg,#0B3C3A 0%,#2DBDAB 72%)';

/**
 * The editor's pick - Figma 343:675.
 *
 * A 440.89-wide media panel beside a copy column, which on the 967.11 rail is
 * 45.6% / 54.4%. Below `lg` the panel goes full width and the copy stacks under
 * it; the badge stays pinned to the media's top-left in both, because it labels
 * the picture, not the column.
 *
 * Whole card is the link, for the same reason as PostCard: the frame's "Read
 * More" is an affordance, not a second tap target.
 */
export default function FeaturedPost({ post }: { post: BlogListItem }) {
  const img = imageUrl(post.heroImage, { width: 1100, height: 760 });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group/feat grid overflow-hidden rounded-sm bg-white ring-1 ring-inset ring-zeus/10 shadow-[0_2.8px_9.9px_0_rgba(45,32,18,0.06)] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_12px_32px_0_rgba(20,27,26,0.1)] motion-reduce:transition-none lg:grid-cols-[minmax(0,440.89fr)_minmax(0,526.22fr)]"
    >
      <div
        className="relative min-h-[clamp(180px,21vw,336px)] overflow-hidden"
        style={img ? undefined : { backgroundImage: MEDIA_FALLBACK }}
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={post.heroImage?.alt ?? ''}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/feat:scale-[1.03] motion-reduce:transition-none"
          />
        ) : null}

        <span className="absolute left-[clamp(12px,1.667vw,26.7px)] top-[clamp(12px,1.667vw,26.7px)] inline-flex items-center gap-[clamp(5.7px,0.556vw,8.9px)] rounded-sm bg-eden py-[clamp(6.4px,0.625vw,10px)] pl-[clamp(9.9px,0.972vw,15.6px)] pr-[clamp(11.4px,1.111vw,17.8px)]">
          <Icon
            name="star"
            strokeWidth={1.6}
            className="h-[clamp(10px,0.972vw,15.6px)] w-[clamp(10px,0.972vw,15.6px)] text-linenw"
          />
          <span className="font-kyg text-[clamp(10px,0.799vw,12.8px)] font-bold uppercase leading-[1.478] tracking-[0.16em] text-linenw">
            {FEED.editorsPick}
          </span>
        </span>
      </div>

      <div className="flex flex-col p-[clamp(20px,3.333vw,53.3px)]">
        <Tag category={post.category} size="md" />

        <h2 className="mt-[clamp(12.8px,1.25vw,20px)] font-kyg text-[clamp(22px,2.5vw,40px)] font-bold leading-[1.222] tracking-[-0.03em] text-heavy transition-colors duration-300 group-hover/feat:text-eden motion-reduce:transition-none">
          {post.title}
        </h2>

        {post.excerpt ? (
          <p className="mt-[clamp(9.9px,0.972vw,15.6px)] font-kyg text-[clamp(12.8px,1.25vw,20px)] font-normal leading-[1.556] text-fusc">
            {post.excerpt}
          </p>
        ) : null}

        {/* 18.49 above the footer, and the footer sits on the column's floor so
            it lines up with the media panel's bottom edge on `lg`. */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-[clamp(12px,1.25vw,20px)] pt-[clamp(16px,1.806vw,28.9px)]">
          <PostMeta post={post} size="md" />

          <span
            aria-hidden="true"
            className={cn(
              BTN,
              'shrink-0 bg-eden font-bold text-linenw',
              'transition-colors duration-300 group-hover/feat:bg-eden2 motion-reduce:transition-none'
            )}
          >
            {FEED.readMore}
            <Icon
              name="arrow"
              strokeWidth={2}
              className="h-[15px] w-[15px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/feat:translate-x-[3px] motion-reduce:transition-none"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
