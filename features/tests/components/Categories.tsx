// =============================================================================
// features/tests - the /categories listing and one category's page
// -----------------------------------------------------------------------------
// Both views are server components. The only client code on either page is the
// search island in CategoryTestGrid, mounted by CategoryDetailView.
//
// CategoriesView has TWO layouts on purpose. With a single category (today's
// state - Wellness holds all nine tests) an auto-fill grid drops one 320px card
// into the left third of a 1120px rail and leaves the rest empty, which reads as
// a page that failed to load. So one category renders as a full-width feature
// card instead; two or more fall back to the grid.
// =============================================================================

import Link from 'next/link';
import { visibleProducts, type CategoryProduct, type TestCategory } from '@/lib/categoriesdata';
import { CardArt } from './CategoryCardArt';
import { CategoryTestGrid } from './CategoryTestGrid';
import { Arrow } from './icons';

function countLabel(n: number) {
  return `${n} ${n === 1 ? 'report' : 'reports'}`;
}

const TOP_BAR: Record<TestCategory['accent'], string> = {
  wellness: 'bg-[linear-gradient(90deg,#2F8C5C,#25B5AB)]',
  mens: 'bg-[linear-gradient(90deg,#0E4D4B,#0E7C77)]',
  womens: 'bg-[linear-gradient(90deg,#9A2855,#C0432F)]',
};

const cardHover = 'transition duration-200 hover:-translate-y-[3px] hover:shadow-[0_18px_44px_-22px_rgba(5,36,34,0.4)]';

const countChip =
  'self-start rounded-sm bg-eden/[0.07] px-[11px] py-[5px] text-[11.5px] font-bold uppercase tracking-[0.08em] text-eden';

/** "Women's Health DNA · Men's Wellness DNA · My Wellness DNA · +6 more" */
function insideLine(products: CategoryProduct[]) {
  const shown = products.slice(0, 3).map((p) => p.name);
  const rest = products.length - shown.length;
  return rest > 0 ? `${shown.join(' · ')} · +${rest} more` : shown.join(' · ');
}

// ---- /categories ------------------------------------------------------------

export function CategoriesView({ categories }: { categories: TestCategory[] }) {
  const only = categories.length === 1 ? categories[0] : undefined;

  return (
    <div className="kyg-tests min-h-[70vh] bg-spring font-kyg text-mine antialiased">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,40px)] pt-[clamp(40px,6vw,72px)] pb-[clamp(60px,8vw,100px)]">
        <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-eden2">Explore tests</span>
        <h1 className="mt-3 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.06] tracking-[-0.025em]">
          Choose a category
        </h1>
        <p className="mt-4 max-w-[640px] text-[17px] leading-[1.6] text-cape">
          Every KYG test starts with one at-home saliva kit. Pick a category to see the reports inside it.
        </p>

        {only ? (
          <FeatureCard category={only} />
        ) : (
          <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[22px]">
            {categories.map((c) => (
              <Link
                href={`/categories/${c.slug}`}
                key={c.slug}
                className={`group relative flex flex-col overflow-hidden rounded-sm border border-zeus/[0.09] bg-white shadow-kyg-card ${cardHover}`}
              >
                <span className={`absolute inset-x-0 top-0 z-10 h-1.5 ${TOP_BAR[c.accent]}`} />
                <CardArt
                  image={c.image}
                  icon={c.icon}
                  tone={c.tone}
                  sizes="(min-width: 1120px) 358px, (min-width: 760px) 33vw, (min-width: 560px) 50vw, 100vw"
                  className="aspect-[16/9] w-full"
                />
                <div className="flex flex-1 flex-col gap-3 p-7">
                  <span className={countChip}>{countLabel(visibleProducts(c).length)}</span>
                  <h2 className="text-2xl font-semibold tracking-[-0.02em]">{c.name}</h2>
                  <span className="text-sm font-semibold text-eden2">{c.tagline}</span>
                  <span className="text-[14.5px] leading-[1.55] text-cape">{c.blurb}</span>
                  <span className="mt-auto inline-flex items-center gap-[7px] pt-1.5 text-sm font-bold text-eden">
                    View category <Arrow className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Single-category layout: image rail on the left, the pitch on the right. */
function FeatureCard({ category }: { category: TestCategory }) {
  const products = visibleProducts(category);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className={`group relative mt-10 grid overflow-hidden rounded-sm border border-zeus/[0.09] bg-white shadow-kyg-card md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] ${cardHover}`}
    >
      <span className={`absolute inset-x-0 top-0 z-10 h-1.5 ${TOP_BAR[category.accent]}`} />
      <CardArt
        image={category.image}
        icon={category.icon}
        tone={category.tone}
        priority
        sizes="(min-width: 1120px) 515px, (min-width: 768px) 46vw, 100vw"
        className="aspect-[16/10] w-full md:aspect-auto md:h-full md:min-h-[340px]"
      />
      <div className="flex flex-col gap-3.5 p-[clamp(26px,3.4vw,44px)]">
        <span className={countChip}>{countLabel(products.length)}</span>
        <h2 className="text-[clamp(26px,2.9vw,34px)] font-semibold leading-[1.1] tracking-[-0.022em]">
          {category.name}
        </h2>
        <span className="text-[15px] font-semibold text-eden2">{category.tagline}</span>
        <span className="text-[15px] leading-[1.6] text-cape">{category.blurb}</span>
        <span className="mt-1 border-t border-zeus/[0.08] pt-4 text-[13.5px] leading-[1.5] text-cord">
          <span className="font-semibold text-cape">Inside</span> · {insideLine(products)}
        </span>
        <span className="mt-auto inline-flex items-center gap-[7px] pt-3 text-[15px] font-bold text-eden">
          View category <Arrow className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

// ---- /categories/[category_slug] --------------------------------------------

export function CategoryDetailView({ category }: { category: TestCategory }) {
  const products = visibleProducts(category);

  return (
    <div className="kyg-tests min-h-[70vh] bg-spring font-kyg text-mine antialiased">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,40px)] pt-[clamp(40px,6vw,72px)] pb-[clamp(60px,8vw,100px)]">
        <div className="mb-2 flex items-center gap-2 text-[13.5px] text-cord">
          <Link href="/categories" className="hover:text-eden">
            Categories
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>
        <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-eden2">
          {countLabel(products.length)}
        </span>
        <h1 className="mt-3 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.06] tracking-[-0.025em]">
          {category.name}
        </h1>
        <p className="mt-4 max-w-[640px] text-[17px] leading-[1.6] text-cape">{category.blurb}</p>

        <CategoryTestGrid products={products} />
      </div>
    </div>
  );
}
