import { Fragment } from 'react';

// Home / Genetic Testing Kit / Genetic Testing Kits with Reports
// Last crumb is the current page (Heavy Metal, medium); the rest are muted.
export default function Breadcrumb({ items }: { items: string[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-[1180px] px-6 pt-4 md:px-8">
      <ol className="flex flex-wrap items-center gap-1 text-[12.5px] leading-[1.5]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={item}>
              <li className={last ? 'font-medium text-heavy' : 'text-fusc'}>{item}</li>
              {!last && (
                <li className="px-1 text-boulder" aria-hidden>
                  /
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
