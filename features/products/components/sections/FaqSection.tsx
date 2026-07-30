import type { ProductKit } from '../../types';
import SectionHeader from '../ui/SectionHeader';
import Accordion from '../ui/Accordion';

// "Before you order" — six card accordions in a narrower centered column.
export default function FaqSection({ faq }: { faq: ProductKit['faq'] }) {
  return (
    <section className="border-t border-heavy/10 bg-white/60 py-14 md:py-[72px]">
      <div className="mx-auto flex w-full max-w-[860px] flex-col gap-11 px-6 md:px-8">
        <SectionHeader eyebrow={faq.eyebrow} eyebrowIcon="eyebrow-faq" heading={faq.heading} tone="sea" />
        <div className="flex flex-col gap-3">
          {faq.items.map((item) => (
            <Accordion key={item.q} title={item.q} variant="card">
              <p className="text-[13.5px] leading-[1.65] text-fusc">{item.a}</p>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
