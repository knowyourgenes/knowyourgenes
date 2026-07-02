import Link from 'next/link';
import { visibleProducts, type TestCategory } from '@/lib/categoriesdata';
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

export function CategoriesView({ categories }: { categories: TestCategory[] }) {
  return (
    <div className="kyg-tests min-h-[70vh] bg-spring font-kyg text-mine antialiased">
      <div className="mx-auto max-w-[1120px] px-[clamp(20px,4vw,40px)] pt-[clamp(40px,6vw,72px)] pb-[clamp(60px,8vw,100px)]">
        <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-eden2">Explore tests</span>
        <h1 className="mt-3 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.06] tracking-[-0.025em]">
          Choose a category
        </h1>
        <p className="mt-4 max-w-[640px] text-[17px] leading-[1.6] text-cape">
          Every KYG test starts with one at-home saliva kit. Pick a category to see the reports inside it.
        </p>
        <div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[22px]">
          {categories.map((c) => (
            <Link
              href={`/categories/${c.slug}`}
              key={c.slug}
              className={`group relative flex flex-col gap-3 overflow-hidden rounded-3xl border border-zeus/[0.09] bg-white p-7 shadow-kyg-card ${cardHover}`}
            >
              <span className={`absolute inset-x-0 top-0 h-1.5 ${TOP_BAR[c.accent]}`} />
              <span className="self-start rounded-full bg-eden/[0.07] px-[11px] py-[5px] text-[11.5px] font-bold uppercase tracking-[0.08em] text-eden">
                {countLabel(visibleProducts(c).length)}
              </span>
              <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">{c.name}</h2>
              <span className="text-sm font-semibold text-eden2">{c.tagline}</span>
              <span className="text-[14.5px] leading-[1.55] text-cape">{c.blurb}</span>
              <span className="mt-1.5 inline-flex items-center gap-[7px] text-sm font-bold text-eden">
                View category <Arrow className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryDetailView({ category }: { category: TestCategory }) {
  return (
    <div className="kyg-tests min-h-[70vh] bg-spring font-kyg text-mine antialiased">
      <div className="mx-auto max-w-[1120px] px-[clamp(20px,4vw,40px)] pt-[clamp(40px,6vw,72px)] pb-[clamp(60px,8vw,100px)]">
        <div className="mb-2 flex items-center gap-2 text-[13.5px] text-cord">
          <Link href="/categories" className="hover:text-eden">
            Categories
          </Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>
        <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-eden2">
          {countLabel(visibleProducts(category).length)}
        </span>
        <h1 className="mt-3 text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.06] tracking-[-0.025em]">
          {category.name}
        </h1>
        <p className="mt-4 max-w-[640px] text-[17px] leading-[1.6] text-cape">{category.blurb}</p>
        <div className="mt-9 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]">
          {visibleProducts(category).map((p) => (
            <Link
              href={p.href}
              key={p.slug}
              className={`flex flex-col gap-2.5 rounded-[20px] border border-zeus/[0.09] bg-white p-6 shadow-kyg-card ${cardHover}`}
            >
              <div className="flex items-center justify-between gap-2.5">
                <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{p.name}</h3>
                {p.meta && (
                  <span className="whitespace-nowrap rounded-full bg-eden/[0.07] px-2.5 py-1 text-[11.5px] font-bold text-eden">
                    {p.meta}
                  </span>
                )}
              </div>
              <span className="text-sm leading-[1.55] text-cape">{p.blurb}</span>
              <span className="mt-1 inline-flex items-center gap-[7px] text-[13.5px] font-bold text-eden">
                View report <Arrow className="h-[15px] w-[15px]" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
