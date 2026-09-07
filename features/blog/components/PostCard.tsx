import Link from 'next/link';

import { BTN } from '@/components/shared/button-styles';
import { Icon } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { categoryLabel, formatPostDate, imageUrl, type BlogListItem } from '@/features/blog';
import { FEED } from '../constants';

/**
 * The thumbnail's stand-in - Figma EL-f8c0c367.
 *
 * The frame draws every card's media as this pale gradient because it has no
 * artwork in it. Real posts DO carry a heroImage, so the gradient is the
 * fallback rather than the default: a post without one still gets a card whose
 * proportions match its neighbours instead of a collapsed strip.
 */
const THUMB_FALLBACK = 'linear-gradient(135deg,#DFEAE8 0%,#EFF6F5 71%)';

/** author · date · read time, the row the frame repeats in every card. */
export function PostMeta({
  post,
  size = 'sm',
  className,
}: {
  post: BlogListItem;
  /** `sm` in a card (9.244/14.22), `md` under the featured headline (10.311/15.29). */
  size?: 'sm' | 'md';
  className?: string;
}) {
  const date = formatPostDate(post.publishedAt);
  const type = size === 'sm' ? 'text-[clamp(9.2px,0.903vw,14.4px)]' : 'text-[clamp(10.3px,1.007vw,16.1px)]';
  const glyph =
    size === 'sm'
      ? 'h-[clamp(10px,0.972vw,15.6px)] w-[clamp(10px,0.972vw,15.6px)]'
      : 'h-[clamp(11.4px,1.111vw,17.8px)] w-[clamp(11.4px,1.111vw,17.8px)]';

  return (
    <div className={cn('flex flex-wrap items-center gap-x-[clamp(9.9px,0.972vw,15.6px)] gap-y-1', className)}>
      {post.author?.name ? (
        <span className={cn('font-kyg font-bold leading-[1.483] text-eden', type)}>{post.author.name}</span>
      ) : null}

      {date ? (
        <span className="inline-flex items-center gap-[clamp(5px,0.486vw,7.8px)] text-boulder">
          <Icon name="calendar" className={cn('shrink-0', glyph)} />
          <span className={cn('font-kyg font-normal leading-[1.483]', type)}>{date}</span>
        </span>
      ) : null}

      {post.readMinutes ? (
        <span className="inline-flex items-center gap-[clamp(5px,0.486vw,7.8px)] text-boulder">
          <Icon name="clock" className={cn('shrink-0', glyph)} />
          <span className={cn('font-kyg font-normal leading-[1.483]', type)}>{post.readMinutes} min read</span>
        </span>
      ) : null}
    </div>
  );
}

/** The mint category chip. Same box in the card and the featured panel, one size
 *  step apart, so it is one component rather than two lookalikes. */
export function Tag({ category, size = 'sm' }: { category?: string; size?: 'sm' | 'md' }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-sm bg-mint font-kyg font-bold uppercase text-eden',
        size === 'sm'
          ? 'px-[clamp(6.4px,0.625vw,10px)] py-[clamp(2.8px,0.278vw,4.4px)] text-[clamp(9.2px,0.903vw,14.4px)] leading-[1.5] tracking-[0.14em]'
          : 'px-[clamp(7.1px,0.694vw,11.1px)] py-[clamp(3.6px,0.347vw,5.6px)] text-[clamp(10px,0.799vw,12.8px)] leading-[1.478] tracking-[0.14em]'
      )}
    >
      {categoryLabel(category)}
    </span>
  );
}

/**
 * One article card - Figma EL-b192fd04.
 *
 * The frame fixes the card at 367.11 tall with a spacer pushing the meta to the
 * bottom. Reproduced as a flex column with `flex-1` on the copy and `mt-auto` on
 * the footer instead of a fixed height: real titles run to two or three lines
 * where the specimen ones run to one, and a fixed height would clip them. The
 * grid still gives every card in a row the same height, which is what the fixed
 * number was buying.
 *
 * THE WHOLE CARD IS THE LINK. The frame draws a "Read More" button inside, but
 * a button nested in a link is invalid, and two targets for one destination is
 * how a card like this grows a dead zone between them - so the button is styled
 * as an affordance and the card carries the href.
 */
export default function PostCard({ post }: { post: BlogListItem }) {
  const img = imageUrl(post.heroImage, { width: 720, height: 460 });

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group/card flex flex-col overflow-hidden rounded-sm bg-white ring-1 ring-inset ring-zeus/10 shadow-[0_2.8px_9.9px_0_rgba(20,27,26,0.05)] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_10px_28px_0_rgba(20,27,26,0.1)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div
        className="relative h-[clamp(140px,14.583vw,233.3px)] shrink-0 overflow-hidden"
        style={img ? undefined : { backgroundImage: THUMB_FALLBACK }}
      >
        {img ? (
          /* Deliberate <img>: the URL is already a Sanity CDN transform at the
             exact box size, so next/image would add a second optimiser hop. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={post.heroImage?.alt ?? ''}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04] motion-reduce:transition-none"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-[clamp(7.1px,0.694vw,11.1px)] px-[clamp(14px,1.667vw,26.7px)] pb-[clamp(14px,1.667vw,26.7px)] pt-[clamp(13px,1.528vw,24.4px)]">
        <Tag category={post.category} />

        <h3 className="font-kyg text-[clamp(17.1px,1.667vw,26.7px)] font-bold leading-[1.25] tracking-[-0.015em] text-heavy transition-colors duration-300 group-hover/card:text-eden motion-reduce:transition-none">
          {post.title}
        </h3>

        {post.excerpt ? (
          <p className="line-clamp-3 font-kyg text-[clamp(10.3px,1.007vw,16.1px)] font-normal leading-[1.448] text-fusc">
            {post.excerpt}
          </p>
        ) : null}

        {/* the frame's `push` - meta and CTA sit on the card's floor */}
        <PostMeta post={post} className="mt-auto pt-[clamp(6px,0.694vw,11.1px)]" />

        <span
          aria-hidden="true"
          className={cn(
            BTN,
            'mt-[clamp(7px,0.869vw,13.9px)] w-fit bg-eden font-bold text-linenw',
            'transition-colors duration-300 group-hover/card:bg-eden2 motion-reduce:transition-none'
          )}
        >
          {FEED.readMore}
          <Icon
            name="arrow"
            strokeWidth={2}
            className="h-[15px] w-[15px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:translate-x-[3px] motion-reduce:transition-none"
          />
        </span>
      </div>
    </Link>
  );
}
