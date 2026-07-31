import type { ProductKit } from '../../types';
import Gallery from './Gallery';
import BuyBox from './BuyBox';

// The product block: sticky gallery (1.05fr) + buy box (0.95fr), 56px gap.
// Collapses to a single column below the lg breakpoint.
export default function ProductPdp({ kit }: { kit: ProductKit }) {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-6 pb-4 pt-6 md:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        <Gallery gallery={kit.gallery} />
        <BuyBox kit={kit} />
      </div>
    </section>
  );
}
