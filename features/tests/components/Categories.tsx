import Link from 'next/link';
import { visibleProducts, type TestCategory } from '@/lib/categoriesdata';
import { Arrow } from './icons';

function countLabel(n: number) {
  return `${n} ${n === 1 ? 'report' : 'reports'}`;
}

const CSS = `
.kyg-cat {
  --spring: #F6F3ED; --eden: #0E4D4B; --eden-2: #15605D; --java: #25B5AB;
  --bottle: #052422; --bermuda: #86DAD0; --mine: #222; --cape: #3A4A48; --cord: #5F6F6C;
  --zeus-9: rgba(31,26,20,.09); --pearl-40: rgba(236,230,218,.4);
  --sh-card: 0 4px 14px rgba(10,27,48,.06), 0 1px 2px rgba(10,27,48,.05);
  --ff: var(--font-figtree), system-ui, sans-serif;
  font-family: var(--ff); color: var(--mine); background: var(--spring);
  min-height: 70vh; -webkit-font-smoothing: antialiased;
}
.kyg-cat a { color: inherit; text-decoration: none; }
.kyg-cat__wrap { max-width: 1120px; margin: 0 auto; padding: clamp(40px, 6vw, 72px) clamp(20px, 4vw, 40px) clamp(60px, 8vw, 100px); }
.kyg-cat .eyebrow { font-weight: 700; text-transform: uppercase; letter-spacing: .14em; font-size: 12.5px; color: var(--eden-2); }
.kyg-cat__title { font-weight: 600; font-size: clamp(30px, 4.4vw, 46px); line-height: 1.06; letter-spacing: -0.025em; margin: 12px 0 0; }
.kyg-cat__intro { font-size: 17px; line-height: 1.6; color: var(--cape); max-width: 640px; margin: 16px 0 0; }
.kyg-cat__crumbs { font-size: 13.5px; color: var(--cord); margin-bottom: 8px; display: flex; gap: 8px; align-items: center; }
.kyg-cat__crumbs a:hover { color: var(--eden); }

.kyg-cat__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 22px; margin-top: 40px; }
.kyg-cat__card { position: relative; overflow: hidden; background: #fff; border: 1px solid var(--zeus-9); border-radius: 24px; box-shadow: var(--sh-card); padding: 28px; display: flex; flex-direction: column; gap: 12px; transition: transform .2s, box-shadow .2s; }
.kyg-cat__card:hover { transform: translateY(-3px); box-shadow: 0 18px 44px -22px rgba(5,36,34,.4); }
.kyg-cat__card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 6px; }
.kyg-cat__card[data-acc="wellness"]::before { background: linear-gradient(90deg, #2F8C5C, #25B5AB); }
.kyg-cat__card[data-acc="mens"]::before { background: linear-gradient(90deg, #0E4D4B, #0E7C77); }
.kyg-cat__card[data-acc="womens"]::before { background: linear-gradient(90deg, #9A2855, #C0432F); }
.kyg-cat__chip { align-self: flex-start; font-weight: 700; font-size: 11.5px; text-transform: uppercase; letter-spacing: .08em; color: var(--eden); background: rgba(14,77,75,.07); padding: 5px 11px; border-radius: 9999px; }
.kyg-cat__card h2 { font-weight: 600; font-size: 24px; letter-spacing: -0.02em; margin: 4px 0 0; }
.kyg-cat__card .tag { font-size: 14px; font-weight: 600; color: var(--eden-2); }
.kyg-cat__card .blurb { font-size: 14.5px; line-height: 1.55; color: var(--cape); }
.kyg-cat__card .go { display: inline-flex; align-items: center; gap: 7px; font-weight: 700; font-size: 14px; color: var(--eden); margin-top: 6px; }
.kyg-cat__card .go svg { width: 16px; height: 16px; }

.kyg-cat__products { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; margin-top: 36px; }
.kyg-cat__product { background: #fff; border: 1px solid var(--zeus-9); border-radius: 20px; box-shadow: var(--sh-card); padding: 24px; display: flex; flex-direction: column; gap: 10px; transition: transform .2s, box-shadow .2s; }
.kyg-cat__product:hover { transform: translateY(-3px); box-shadow: 0 18px 44px -22px rgba(5,36,34,.4); }
.kyg-cat__product .ph { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.kyg-cat__product h3 { font-weight: 600; font-size: 19px; letter-spacing: -0.02em; margin: 0; }
.kyg-cat__product .meta { font-size: 11.5px; font-weight: 700; color: var(--eden); background: rgba(14,77,75,.07); padding: 4px 10px; border-radius: 9999px; white-space: nowrap; }
.kyg-cat__product .blurb { font-size: 14px; line-height: 1.55; color: var(--cape); }
.kyg-cat__product .go { display: inline-flex; align-items: center; gap: 7px; font-weight: 700; font-size: 13.5px; color: var(--eden); margin-top: 4px; }
.kyg-cat__product .go svg { width: 15px; height: 15px; }
`;

function Styles() {
  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}

export function CategoriesView({ categories }: { categories: TestCategory[] }) {
  return (
    <div className="kyg-cat">
      <Styles />
      <div className="kyg-cat__wrap">
        <span className="eyebrow">Explore tests</span>
        <h1 className="kyg-cat__title">Choose a category</h1>
        <p className="kyg-cat__intro">
          Every KYG test starts with one at-home saliva kit. Pick a category to see the reports inside it.
        </p>
        <div className="kyg-cat__grid">
          {categories.map((c) => (
            <Link href={`/categories/${c.slug}`} className="kyg-cat__card" data-acc={c.accent} key={c.slug}>
              <span className="kyg-cat__chip">{countLabel(visibleProducts(c).length)}</span>
              <h2>{c.name}</h2>
              <span className="tag">{c.tagline}</span>
              <span className="blurb">{c.blurb}</span>
              <span className="go">
                View category <Arrow />
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
    <div className="kyg-cat">
      <Styles />
      <div className="kyg-cat__wrap">
        <div className="kyg-cat__crumbs">
          <Link href="/categories">Categories</Link>
          <span>/</span>
          <span>{category.name}</span>
        </div>
        <span className="eyebrow">{countLabel(visibleProducts(category).length)}</span>
        <h1 className="kyg-cat__title">{category.name}</h1>
        <p className="kyg-cat__intro">{category.blurb}</p>
        <div className="kyg-cat__products">
          {visibleProducts(category).map((p) => (
            <Link href={p.href} className="kyg-cat__product" key={p.slug}>
              <div className="ph">
                <h3>{p.name}</h3>
                {p.meta && <span className="meta">{p.meta}</span>}
              </div>
              <span className="blurb">{p.blurb}</span>
              <span className="go">
                View report <Arrow />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
