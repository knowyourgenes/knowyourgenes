import type { ProductKit } from '../types';
import type { SelectableReport } from '../server/reports';
import UtilityBar from './sections/UtilityBar';
import Breadcrumb from './sections/Breadcrumb';
import ProductPdp from './sections/ProductPdp';
import FeaturesSection from './sections/FeaturesSection';
import FaqSection from './sections/FaqSection';
import ReviewsSection from './sections/ReviewsSection';

/**
 * Data-driven Product (PDP) page. Everything between the site header and footer.
 * Figtree is applied via the --font-kyg token; the `kyg-pdp` root only sets the
 * page's warm background + ink color. No reveal-on-scroll gating - the design is
 * static, so content is always visible (robust for no-JS / SEO).
 */
export default function ProductKitPage({
  kit,
  reports,
  preselect,
  shippingFee,
}: {
  kit: ProductKit;
  reports: SelectableReport[];
  /** Slugs pre-ticked from ?select= - how a test page hands over. */
  preselect: string[];
  shippingFee: number;
}) {
  return (
    <div className="bg-linenw text-heavy" style={{ fontFamily: 'var(--font-kyg)' }}>
      <UtilityBar text={kit.utilityBar.text} phone={kit.utilityBar.phone} />
      <Breadcrumb items={kit.breadcrumb} />
      <ProductPdp kit={kit} reports={reports} preselect={preselect} shippingFee={shippingFee} />
      <FeaturesSection features={kit.features} />
      {/* UpgradeSection is intentionally not rendered: it sells Complete/Total
          "packs" that have no Package row and show ₹____. The configurator in
          the buy box now does that job properly - every report is tickable. */}
      <FaqSection faq={kit.faq} />
      <ReviewsSection reviews={kit.reviews} />
    </div>
  );
}
