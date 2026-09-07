import { Button, Eyebrow, Heading, Note, Section } from '@/components/shared/kyg';
import { START_WITH_KNOWING as C } from '../../constants';
import { Chain } from '../ui';

/**
 * 12 · Start with knowing - Figma 518:44.
 *
 * The page's close, on sand. Headline and buttons on the left, the note and the
 * chain on the right; they stack in that order below `lg` so the CTAs are never
 * separated from the sentence that earns them.
 */
export default function FinalCta() {
  return (
    <Section id="start-with-knowing" ground="sand" labelledBy="start-heading">
      <div className="flex flex-col gap-[clamp(20px,3.125vw,50px)] lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 lg:max-w-[clamp(600px,58.594vw,937.5px)]">
          <Eyebrow icon="dna">{C.eyebrow}</Eyebrow>

          <Heading
            id="start-heading"
            className="mt-[clamp(11px,1.074vw,17.2px)] text-[clamp(24px,3.193vw,51.1px)] leading-[1.306]"
          >
            {C.headline} <em>{C.turn}</em>
          </Heading>

          <div className="mt-[clamp(16px,1.953vw,31.3px)] flex flex-col gap-[clamp(10px,0.977vw,15.6px)] sm:flex-row sm:items-center">
            <Button href={C.ctas.primary.href}>{C.ctas.primary.label}</Button>
            <Button href={C.ctas.secondary.href} variant="ghost">
              {C.ctas.secondary.label}
            </Button>
          </div>
        </div>

        <div className="min-w-0 shrink-0 lg:w-[clamp(300px,29.297vw,468.8px)]">
          <Note lead={C.note.lead} />
          <p className="mt-[clamp(10px,0.977vw,15.6px)] font-kyg text-[clamp(11.7px,1.143vw,18.3px)] font-normal leading-[1.598] text-fusc">
            {C.note.body}
          </p>
          <Chain items={C.chain} className="mt-[clamp(12px,1.172vw,18.8px)]" />
        </div>
      </div>
    </Section>
  );
}
