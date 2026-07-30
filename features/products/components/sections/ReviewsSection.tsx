import type { ProductKit } from '../../types';
import SectionHeader from '../ui/SectionHeader';
import Stars from '../ui/Stars';

// "Reviews" — disclaimer + five placeholder review cards.
export default function ReviewsSection({ reviews }: { reviews: ProductKit['reviews'] }) {
  return (
    <section id="reviews" className="scroll-mt-24 border-t border-heavy/10 py-14 md:py-[72px]">
      <div className="mx-auto flex w-full max-w-[860px] flex-col gap-3 px-6 md:px-8">
        <SectionHeader
          eyebrow={reviews.eyebrow}
          eyebrowIcon="eyebrow-reviews"
          heading={reviews.heading}
          tone="eden"
          headingClassName="text-[clamp(24px,3.2vw,32px)]"
        />
        <p className="mx-auto max-w-[560px] text-center text-[13px] leading-[1.5] text-boulder">{reviews.disclaimer}</p>

        <div className="flex flex-col gap-5 pt-7">
          {reviews.items.map((r, i) => (
            <div key={i} className="flex gap-4 rounded-[20px] border border-heavy/10 bg-white p-6 shadow-pdp-soft">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gin text-[14px] font-bold text-sea">
                {r.initials}
              </span>
              <div className="flex-1">
                <Stars count={r.stars} className="text-[14px]" />
                <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[13px]">
                  <span className="font-bold text-heavy">{r.name}</span>
                  <span className="text-boulder">{r.date}</span>
                </div>
                <p className="mt-2 text-[13.5px] leading-[1.6] text-fusc">{r.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
