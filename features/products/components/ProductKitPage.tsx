import type { ProductKit } from '../types';
import UtilityBar from './sections/UtilityBar';
import Breadcrumb from './sections/Breadcrumb';
import ProductPdp from './sections/ProductPdp';
import FeaturesSection from './sections/FeaturesSection';
import UpgradeSection from './sections/UpgradeSection';
import FaqSection from './sections/FaqSection';
import ReviewsSection from './sections/ReviewsSection';

/**
 * Data-driven Product (PDP) page. Everything between the site header and footer.
 * Figtree is applied via the --font-kyg token; the `kyg-pdp` root only sets the
 * page's warm background + ink color. No reveal-on-scroll gating - the design is
 * static, so content is always visible (robust for no-JS / SEO).
 */
export default function ProductKitPage({ kit }: { kit: ProductKit }) {
  return (
    <div className="bg-linenw text-heavy" style={{ fontFamily: 'var(--font-kyg)' }}>
      <UtilityBar text={kit.utilityBar.text} phone={kit.utilityBar.phone} />
      <Breadcrumb items={kit.breadcrumb} />
      <ProductPdp kit={kit} />
      <FeaturesSection features={kit.features} />
      <UpgradeSection upgrade={kit.upgrade} />
      <FaqSection faq={kit.faq} />
      <ReviewsSection reviews={kit.reviews} />
    </div>
  );
}
