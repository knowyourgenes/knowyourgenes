// =============================================================================
// features/tests - one category's page
// -----------------------------------------------------------------------------
// A server component. The only client code here is the search island in
// CategoryTestGrid.
//
// The /categories LISTING moved to ./CategoriesView.tsx when it was rebuilt
// against Figma 343:4438 - it is a client component now (search + sort), and
// keeping the two in one file would have pulled this page into the bundle with
// it.
// =============================================================================

import Link from 'next/link';
import { visibleProducts, type TestCategory } from '@/lib/categoriesdata';
import { CategoryTestGrid } from './CategoryTestGrid';

function countLabel(n: number) {
  return `${n} ${n === 1 ? 'report' : 'reports'}`;
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
