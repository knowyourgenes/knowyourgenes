import { Container } from '@/components/shared/Container';
import { Eyebrow, Heading, SECTION_Y } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import type { BlogListItem } from '@/features/blog';
import { HERO } from '../constants';
import BlogFeed from './BlogFeed';

/**
 * /blog - Figma 343:647.
 *
 * Two bands: a journal masthead over a photograph, and the feed.
 *
 * THE HERO IS A WASH, NOT A PICTURE. The frame lays a 90deg cream gradient over
 * the photo - 0.96 opaque at the left, 0.86 at 52%, 0.42 at the right - so the
 * image only ever surfaces behind the empty right-hand third and the headline
 * sits on near-solid ground. Reproduced in that order (gradient FIRST, image
 * second) because CSS paints the first background layer on top.
 *
 * The page is Sanity-driven, so nothing below the masthead is hardcoded: the
 * frame's specimen articles stand in for real documents, and its tags happen to
 * be exactly the four values in the blogPost schema.
 */
export default function BlogIndex({ posts, activeCategory }: { posts: BlogListItem[]; activeCategory?: string }) {
  return (
    <div className="kyg-reveals bg-linenw">
      <section
        aria-labelledby="journal-heading"
        className="w-full bg-linenw bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            'linear-gradient(90deg,rgba(250,246,239,0.96) 0%,rgba(250,246,239,0.86) 52%,rgba(250,246,239,0.42) 100%),url(/blog/journal-hero.jpg)',
        }}
      >
        <Container className={SECTION_Y}>
          <Eyebrow data-rise-load="1">{HERO.eyebrow}</Eyebrow>

          {/* The frame sets this at 32.711 - the page's h2 size, not a hero
              size - because the journal masthead is quieter than a landing
              hero. `Heading`'s own h1 clamp is 4.3vw, so this carries the h2
              clamp explicitly rather than shouting. */}
          <Heading
            as="h1"
            id="journal-heading"
            data-rise-load="2"
            className="mt-[clamp(11.4px,1.111vw,17.8px)] text-[clamp(24px,min(3.194vw,6.2vh),51px)] leading-[1.315]"
          >
            {HERO.headline} <em>{HERO.turn}</em>
          </Heading>

          <p
            data-rise-load="3"
            className="mt-[clamp(12.8px,1.25vw,20px)] max-w-[clamp(440.9px,43.056vw,688.9px)] font-kyg text-[clamp(13.5px,1.319vw,21.1px)] font-normal leading-[1.5] text-fusc"
          >
            {HERO.lede}
          </p>
        </Container>
      </section>

      <section aria-label="Articles" className="w-full bg-linenw">
        <Container className={cn(SECTION_Y)}>
          <BlogFeed posts={posts} initialCategory={activeCategory} />
        </Container>
      </section>
    </div>
  );
}
