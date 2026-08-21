import ContactChannels from './ContactChannels';
import ContactForm from './ContactForm';
import ContactHero from './ContactHero';
import SelfServe from './SelfServe';

/**
 * The /contact page body.
 *
 * The route lives under app/(site)/, so the global SiteHeader/SiteFooter wrap
 * this. The Figma frame draws its own header and footer, but those are ordinary
 * SITE chrome (brand, nav, CTA / dark 3-column footer) rather than anything
 * page-specific - forking a third bespoke copy per page is exactly what caused
 * the duplication already flagged across this repo. Aligning SiteHeader and
 * SiteFooter with the frame is a separate, site-wide change.
 *
 * MAIN section geometry: 1180 rail with 32 side padding, left column 499,
 * right column 585, 32 gap - reproduced here as a 499/585 fractional grid so it
 * holds its proportions at every width and stacks below `lg`.
 */
export default function ContactPage() {
  return (
    <>
      <ContactHero />

      <section className="bg-linenw px-5 pb-[clamp(48px,6vw,80px)] sm:px-10 lg:px-20">
        <div className="mx-auto grid w-full max-w-[1600px] items-start gap-8 lg:grid-cols-[minmax(0,499fr)_minmax(0,585fr)] lg:px-8">
          <ContactChannels />
          <ContactForm />
        </div>
      </section>

      <SelfServe />
    </>
  );
}
