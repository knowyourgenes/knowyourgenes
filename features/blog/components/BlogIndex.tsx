import { Container } from '@/components/shared/Container';
import { PageMasthead, SECTION_Y } from '@/components/shared/kyg';
import type { BlogListItem } from '@/features/blog';
import { HERO } from '../constants';
import BlogFeed from './BlogFeed';

/**
 * /blog - Figma 343:647.
 *
 * Two bands: the journal masthead over a photograph, and the feed. The masthead
 * is the shared `PageMasthead` - /categories draws the same one.
 *
 * The page is Sanity-driven, so nothing below the masthead is hardcoded: the
 * frame's specimen articles stand in for real documents, and its four tags
 * happen to be exactly the category enum in the blogPost schema.
 */
export default function BlogIndex({ posts, activeCategory }: { posts: BlogListItem[]; activeCategory?: string }) {
  return (
    <div className="kyg-reveals bg-linenw">
      <PageMasthead
        id="journal-heading"
        eyebrow={HERO.eyebrow}
        headline={HERO.headline}
        turn={HERO.turn}
        lede={HERO.lede}
        image="/blog/journal-hero.jpg"
      />

      <section aria-label="Articles" className="w-full bg-linenw">
        <Container className={SECTION_Y}>
          <BlogFeed posts={posts} initialCategory={activeCategory} />
        </Container>
      </section>
    </div>
  );
}
