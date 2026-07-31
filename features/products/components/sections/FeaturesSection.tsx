import type { ProductKit } from '../../types';
import SectionHeader from '../ui/SectionHeader';
import Icon, { type IconName } from '../ui/Icon';

const FEATURE_ICON: Record<string, IconName> = {
  spark: 'feature-personalized',
  ship: 'feature-shipping',
  report: 'feature-reports',
  lock: 'feature-secure',
};

// "Why KYG" — centered header + a row of four feature cards.
export default function FeaturesSection({ features }: { features: ProductKit['features'] }) {
  return (
    <section className="border-t border-heavy/10 bg-white/60 py-14 md:py-17.5">
      <div className="mx-auto flex w-full max-w-295 flex-col gap-12 px-6 md:px-8">
        <SectionHeader
          eyebrow={features.eyebrow}
          eyebrowIcon="eyebrow-features"
          heading={features.heading}
          tone="sea"
        />
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {features.cards.map((c) => (
            <div
              key={c.title}
              className="flex flex-col items-center gap-3.75 rounded-[22px] border border-heavy/10 bg-white p-5 text-center shadow-pdp-soft sm:p-7"
            >
              <span className="grid size-14 place-items-center rounded-[16px] bg-gin">
                <Icon name={FEATURE_ICON[c.icon]} className="h-8 w-6.75 text-sea" />
              </span>
              <span className="text-[14.5px] font-semibold leading-snug text-heavy">{c.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
