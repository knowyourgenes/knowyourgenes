import { Section, SectionTitle } from '@/components/shared/kyg';
import { FORM_COPY } from '../constants';
import ContactForm from './ContactForm';

/**
 * 03 · Send a message - Figma 346:1155.
 *
 * A 369.78 copy column beside a filling form card, 39.822 apart. The copy
 * column is the shared `SectionTitle` without an aside - the form is not an
 * aside, it is the other half of the row - so the two sit in a grid and the
 * title keeps its own stacking.
 */
export default function SendMessage() {
  return (
    <Section id="send-a-message" ground="cream" labelledBy="send-heading">
      <div className="grid items-start gap-[clamp(28px,3.889vw,62px)] lg:grid-cols-[minmax(0,369.78fr)_minmax(0,557.51fr)]">
        <div className="min-w-0">
          <SectionTitle id="send-heading" eyebrow={FORM_COPY.eyebrow}>
            {FORM_COPY.headline} <em>{FORM_COPY.turn}</em>
          </SectionTitle>

          {/* 14.222 under the heading, capped at the design's 312.89 */}
          <p className="mt-[clamp(14.2px,1.389vw,22.2px)] max-w-[clamp(312.9px,30.556vw,488.9px)] font-kyg text-[clamp(12.4px,1.215vw,19.4px)] font-normal leading-[1.64] text-fusc">
            {FORM_COPY.lead}
          </p>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
