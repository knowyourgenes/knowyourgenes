import { Button, Lead, Section, SectionTitle } from '../ui';

/**
 * The closing panel.
 *
 * It uses the SAME header shape as every section above it rather than a centred
 * column of its own, which is what stops the page ending in a different design
 * language from the one it spent thirteen sections establishing.
 *
 * "Genetics for a lifetime." used to sit under a KNOW YOUR GENES wordmark below
 * ~154px of deliberate empty space. The wordmark is gone; the line survives as
 * this section's eyebrow rather than being dropped.
 */
export default function FinalCta() {
  return (
    <Section id="final-cta" ground="sand" labelledBy="final-heading">
      <SectionTitle
        id="final-heading"
        eyebrow="Genetics for a lifetime"
        aside={
          <div>
            <Lead className="max-w-[52ch]">
              One sample can open a new conversation with your body, your health, your family and your story.
            </Lead>
            <p className="mt-[18px] font-tst text-[clamp(19px,2vw,27px)] font-medium italic leading-[1.3] text-eden">
              There is more to you than you know.
            </p>
          </div>
        }
      >
        You have known yourself all your life. <em>Or have you?</em>
      </SectionTitle>

      <div className="mt-[clamp(18px,min(3.7vw,3.4vh),46px)] flex flex-wrap items-center gap-[14px]">
        <Button href="/categories">Find My Test</Button>
        <Button href="#what-would-you-like-to-know" variant="ghost">
          Explore Your Genes
        </Button>
      </div>
    </Section>
  );
}
