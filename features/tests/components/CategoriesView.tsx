'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';

import { BTN } from '@/components/shared/button-styles';
import { Container } from '@/components/shared/Container';
import { Icon, PageMasthead, Rule, SECTION_Y, Toolbar } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { visibleProducts, type CategoryProduct, type TestCategory } from '@/lib/categoriesdata';
import { CardArt } from './CategoryCardArt';

// =============================================================================
// /categories - Figma 343:4438
// -----------------------------------------------------------------------------
// The frame draws ONE category card in full ("Wellness · 9 TESTS"), which is
// also exactly what the data holds today: lib/categoriesdata.ts declares a
// single category with nine products, and its `tagline` and `blurb` are the
// frame's copy verbatim. Its `image` even points at /kyg/950448a92b6b.jpg -
// the frame's own imageRef. So this is a presentation rebuild over data that
// already matches, not a re-typing of the design's specimen text.
//
// The card renders once per category, so a second one needs no new code.
// =============================================================================

export const HERO = {
  eyebrow: 'Test categories',
  headline: 'Understand how your body is',
  turn: 'genetically wired.',
  lede: 'From everyday wellness to the health checks most people never think to make. One at-home saliva kit per report.',
} as const;

const TOOLBAR = {
  label: 'CATEGORIES',
  searchPlaceholder: 'Search categories',
} as const;

/**
 * Sort, and the one place this departs from the frame.
 *
 * The design's control reads "Most popular". `TestCategory` has no view count,
 * no order rank and no sales figure, so a popularity order cannot be computed -
 * it would be a lie or an arbitrary shuffle. Both of these are backed by fields
 * that exist.
 */
const SORTS = [
  { value: 'default', label: 'Featured' },
  { value: 'most-tests', label: 'Most tests' },
] as const;

/**
 * Search and sort only appear once there is something to search.
 *
 * The frame assumes a populated grid; the data has one category. A search box
 * and a sort control over a single card are not faithfulness to the design,
 * they are two controls that visibly do nothing. The label and the rule stay -
 * those are structure, not controls - and the moment a second category lands
 * the rest appears on its own.
 */
const TOOLBAR_MIN = 2;

/** The 2.13 accent bar across the top of the card. */
const ACCENT: Record<TestCategory['accent'], string> = {
  wellness: 'bg-[linear-gradient(90deg,#0E4D4B_0%,#2AC3A2_100%)]',
  mens: 'bg-[linear-gradient(90deg,#0E4D4B_0%,#0E7C77_100%)]',
  womens: 'bg-[linear-gradient(90deg,#9A2855_0%,#C0432F_100%)]',
};

/** "My Wellness DNA · Immunity DNA · Skin Health DNA · +6 more" */
function insideLine(products: CategoryProduct[]) {
  const shown = products.slice(0, 3).map((p) => p.name);
  const rest = products.length - shown.length;
  return rest > 0 ? `${shown.join(' · ')} · +${rest} more` : shown.join(' · ');
}

/**
 * One category - Figma 343:4470.
 *
 * A 440.89 media rail beside the pitch, which on the 967.11 content rail is
 * 45.6% / 54.4%. Below `lg` the image goes full width and the copy stacks under
 * it.
 *
 * WHOLE CARD IS THE LINK, so the frame's "Explore tests" button is an
 * affordance rather than a second target for the same destination.
 */
function CategoryCard({ category }: { category: TestCategory }) {
  const products = visibleProducts(category);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group/cat block overflow-hidden rounded-sm bg-white ring-1 ring-inset ring-zeus/10 shadow-[0_2.8px_9.9px_0_rgba(45,32,18,0.06)] transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_14px_36px_0_rgba(20,27,26,0.11)] motion-reduce:transition-none"
    >
      <span aria-hidden="true" className={cn('block h-[3px] w-full', ACCENT[category.accent])} />

      <div className="grid lg:grid-cols-[minmax(0,440.89fr)_minmax(0,526.22fr)]">
        <CardArt
          image={category.image}
          icon={category.icon}
          tone={category.tone}
          priority
          sizes="(min-width: 1024px) 46vw, 100vw"
          className="h-full min-h-[clamp(190px,22vw,352px)] w-full"
        />

        <div className="flex flex-col p-[clamp(20px,3.333vw,53.3px)]">
          <span className="inline-flex w-fit items-center rounded-sm bg-mint px-[clamp(7.1px,0.694vw,11.1px)] py-[clamp(3.6px,0.347vw,5.6px)] font-kyg text-[clamp(11px,0.799vw,12.8px)] font-bold uppercase leading-[1.478] tracking-[0.14em] text-eden">
            {products.length} {products.length === 1 ? 'test' : 'tests'}
          </span>

          <h2 className="mt-[clamp(11.4px,1.111vw,17.8px)] font-kyg text-[clamp(22px,2.5vw,40px)] font-bold leading-[1.222] tracking-[-0.03em] text-heavy transition-colors duration-300 group-hover/cat:text-eden motion-reduce:transition-none">
            {category.name}
          </h2>

          <p className="mt-[clamp(5.7px,0.556vw,8.9px)] font-kyg text-[clamp(11.4px,1.111vw,17.8px)] font-bold leading-[1.5] text-eden">
            {category.tagline}
          </p>

          <p className="mt-[clamp(9.9px,0.972vw,15.6px)] font-kyg text-[clamp(12.4px,1.215vw,19.4px)] font-normal leading-[1.6] text-fusc">
            {category.blurb}
          </p>

          <Rule className="mt-[clamp(14px,1.667vw,26.7px)]" />

          <p className="mt-[clamp(12px,1.389vw,22.2px)] font-kyg text-[clamp(12px,1.007vw,16.1px)] font-normal leading-[1.517] text-boulder">
            <b className="font-bold text-fusc">Inside</b> · {insideLine(products)}
          </p>

          <span
            aria-hidden="true"
            className={cn(
              BTN,
              'mt-[clamp(14px,1.528vw,24.4px)] w-fit bg-eden font-bold text-linenw',
              'transition-colors duration-300 group-hover/cat:bg-eden2 motion-reduce:transition-none'
            )}
          >
            Explore tests
            <Icon
              name="arrow"
              strokeWidth={2}
              className="h-[15px] w-[15px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/cat:translate-x-[3px] motion-reduce:transition-none"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function CategoriesView({ categories }: { categories: TestCategory[] }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<string>('default');
  const showToolbar = categories.length >= TOOLBAR_MIN;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = categories.filter((c) => {
      if (!q) return true;
      // Match what the card shows, plus the product names inside it - people
      // search for the test they want, not the category holding it.
      return [c.name, c.tagline, c.blurb, ...visibleProducts(c).map((p) => p.name)].join(' ').toLowerCase().includes(q);
    });
    if (sort === 'most-tests') {
      return [...matched].sort((a, b) => visibleProducts(b).length - visibleProducts(a).length);
    }
    return matched;
  }, [categories, query, sort]);

  return (
    <div className="kyg-reveals bg-linenw">
      <PageMasthead
        id="categories-heading"
        eyebrow={HERO.eyebrow}
        headline={HERO.headline}
        turn={HERO.turn}
        lede={HERO.lede}
        image="/categories/hero.jpg"
      />

      <section aria-label="Test categories" className="w-full bg-linenw">
        <Container className={SECTION_Y}>
          {showToolbar ? (
            <Toolbar
              label={TOOLBAR.label}
              query={query}
              onQuery={setQuery}
              searchPlaceholder={TOOLBAR.searchPlaceholder}
              searchLabel="Search categories"
              selects={[{ label: 'Sort', value: sort, onChange: setSort, options: SORTS }]}
            />
          ) : (
            <p className="font-kyg text-[clamp(11px,0.903vw,14.4px)] font-bold uppercase leading-[1.462] tracking-[0.2em] text-boulder">
              {TOOLBAR.label}
            </p>
          )}

          <Rule className="mt-[clamp(12px,1.528vw,24.4px)]" />

          {shown.length === 0 ? (
            <div className="mt-[clamp(28px,4vw,64px)] rounded-sm border border-dashed border-zeus/15 bg-white/60 px-6 py-[clamp(40px,6vw,96px)] text-center">
              <p className="font-kyg text-[clamp(16px,1.5vw,24px)] font-bold text-heavy">No matches</p>
              <p className="mt-2 font-kyg text-[clamp(12px,1.146vw,18.3px)] leading-[1.6] text-fusc">
                Nothing matches that search. Try a different word.
              </p>
            </div>
          ) : (
            <div className="mt-[clamp(16px,1.806vw,28.9px)] flex flex-col gap-[clamp(14.2px,1.389vw,22.2px)]">
              {shown.map((c) => (
                <CategoryCard key={c.slug} category={c} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

export default CategoriesView;
