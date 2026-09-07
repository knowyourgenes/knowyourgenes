import { Eyebrow, Heading, Icon, Section } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { BIGGER_PICTURE as C } from '../../constants';
import { Coda, Hr, Kicker } from '../ui';

/**
 * 11 · The bigger picture - Figma 560:387.
 *
 * A photo band carrying the headline, three eras with the middle one lit, and a
 * not-this / but-this pair.
 *
 * The band lays a dark scrim over the photograph rather than tinting the image,
 * so the headline keeps its contrast whatever the picture underneath is doing.
 */
export default function BiggerPicture() {
  return (
    <Section id="bigger-picture" ground="ink" labelledBy="bigger-picture-heading">
      <div
        className="relative isolate flex min-h-[clamp(220px,29.297vw,468.8px)] flex-col justify-end overflow-hidden rounded-sm bg-cover bg-center px-[clamp(20px,3.125vw,50px)] pb-[clamp(20px,2.93vw,46.9px)] pt-[clamp(24px,3.125vw,50px)]"
        style={{
          backgroundImage:
            'linear-gradient(180deg,rgba(20,27,26,0.35) 0%,rgba(20,27,26,0.72) 62%,rgba(20,27,26,0.88) 100%),url(/about/img/persona-detail.jpg)',
        }}
      >
        <Eyebrow icon="dna" tone="teal" className="self-start">
          {C.eyebrow}
        </Eyebrow>

        <Heading
          id="bigger-picture-heading"
          tone="dark"
          className="mt-[clamp(12px,1.172vw,18.8px)] max-w-[clamp(620px,60.547vw,968.8px)] text-[clamp(22px,3.193vw,51.1px)] leading-[1.306] text-linenw"
        >
          {C.headline} <em>{C.turn}</em>
        </Heading>

        <p className="mt-[clamp(10px,0.977vw,15.6px)] max-w-[clamp(560px,54.688vw,875px)] font-kyg text-[clamp(13px,1.27vw,20.3px)] font-normal leading-[1.462] text-white/85">
          {C.lead}
        </p>
      </div>

      {/* The three eras. `Now` is filled - the design's way of saying we are
          mid-shift rather than predicting one. */}
      <ul className="mt-[clamp(16px,2.539vw,40.6px)] grid list-none gap-[clamp(8px,0.781vw,12.5px)] sm:grid-cols-3">
        {C.eras.map((e, i) => {
          const active = i === C.activeEra;
          return (
            <li
              key={e.when}
              className={cn(
                'flex flex-col gap-[clamp(6px,0.781vw,12.5px)] rounded-sm p-[clamp(14px,1.563vw,25px)]',
                active ? 'bg-java2' : 'bg-white/[0.05] ring-1 ring-inset ring-white/[0.12]'
              )}
            >
              <span
                aria-hidden="true"
                className={cn('h-[3px] w-full rounded-sm', active ? 'bg-abyss/50' : 'bg-java2')}
              />
              <Kicker tone={active ? 'eden' : 'java'} className={active ? 'text-abyss/70' : undefined}>
                {e.when}
              </Kicker>
              <span
                className={cn(
                  'font-kyg text-[clamp(14px,1.367vw,21.9px)] font-bold leading-[1.25] tracking-[-0.01em]',
                  active ? 'text-abyss' : 'text-white'
                )}
              >
                {e.what}
              </span>
            </li>
          );
        })}
      </ul>

      <p className="mt-[clamp(12px,1.367vw,21.9px)] flex items-center gap-[clamp(10px,1.172vw,18.8px)] rounded-sm bg-white/[0.04] px-[clamp(14px,1.563vw,25px)] py-[clamp(11px,1.172vw,18.8px)] ring-1 ring-inset ring-white/10">
        <Icon
          name="dna"
          className="h-[clamp(14px,1.367vw,21.9px)] w-[clamp(14px,1.367vw,21.9px)] shrink-0 text-java2"
        />
        <span className="font-tst text-[clamp(15px,1.66vw,26.6px)] font-semibold italic leading-[1.3] text-ice">
          {C.reveal}
        </span>
      </p>

      <div className="mt-[clamp(16px,2.148vw,34.4px)] grid gap-[clamp(12px,1.172vw,18.8px)] md:grid-cols-2">
        {[
          { ...C.not, affirm: false },
          { ...C.but, affirm: true },
        ].map((col) => (
          <div
            key={col.kicker}
            className={cn(
              'flex flex-col gap-[clamp(8px,0.977vw,15.6px)] rounded-sm p-[clamp(16px,1.953vw,31.3px)] ring-1 ring-inset',
              col.affirm ? 'bg-java2/10 ring-java2/30' : 'bg-white/[0.04] ring-white/10'
            )}
          >
            <Kicker tone={col.affirm ? 'java' : 'dim'}>{col.kicker}</Kicker>
            {col.items.map((t) => (
              <p key={t} className="flex items-center gap-[clamp(8px,0.977vw,15.6px)]">
                <span
                  className={cn(
                    'grid h-[clamp(20px,1.953vw,31.3px)] w-[clamp(20px,1.953vw,31.3px)] shrink-0 place-items-center rounded-sm',
                    col.affirm ? 'bg-java2 text-abyss' : 'bg-white/[0.08] text-white/60'
                  )}
                >
                  <Icon
                    name={col.affirm ? 'tick' : 'cross'}
                    strokeWidth={2.4}
                    className="h-[clamp(10px,0.977vw,15.6px)] w-[clamp(10px,0.977vw,15.6px)]"
                  />
                </span>
                <span
                  className={cn(
                    'min-w-0 font-kyg text-[clamp(11.7px,1.143vw,18.3px)] leading-[1.453]',
                    col.affirm ? 'font-semibold text-white' : 'font-normal text-white/70'
                  )}
                >
                  {t}
                </span>
              </p>
            ))}
          </div>
        ))}
      </div>

      <Hr tone="dark" className="mt-[clamp(18px,2.734vw,43.8px)]" />
      <Coda lead={C.foot.lead} turn={C.foot.turn} tone="dark" className="mt-[clamp(14px,1.953vw,31.3px)]" />
    </Section>
  );
}
