import { cn } from '@/lib/utils';
import type { Ground, MarkerGridSection, RiskTone } from '../../types';
import { Icon } from '../icons';
import { Head, ResultBar, Section, TONE_PILL } from '../ui';

// =============================================================================
// MARKER GRID - tiles in labelled groups.
// -----------------------------------------------------------------------------
// Several panels carry a band that is neither a risk card nor a stat: Skin
// Health reads six food sensitivities and four nutrients, Immunity eleven
// micronutrients and three detox results, My Wellness splits 52 traits across
// four reports. None of them have photography, a gene story or a filter, so
// `riskCards` is the wrong shape - six of those 389px cards would run to three
// rows of near-empty artwork.
//
// Three densities, all off the same item:
//   compact  6-up icon tiles          - 44px badge, title, marker, tone pill
//   detail   3/4-up cards             - badge + pill row, then title and copy
//   stat     4-up cards, big numeral  - the count IS the point, so it leads
//
// Every field on an item is optional bar none, because the three variants use
// different subsets. Everything below reuses the frame's own tokens (r16
// badges, tst-soft cards, the shared TONE_PILL) so the band sits inside the
// same visual system as the risk cards above it.
// =============================================================================

const BADGE: Record<'crimson' | 'teal', string> = {
  crimson: 'bg-blush text-crimson',
  teal: 'bg-mint text-eden',
};

const CARD = 'lift rounded-[24px] border border-mine/10 bg-white shadow-tst-soft';
/** Figtree 700 11/16.5 ls 0.08em #7a7a7a - the marker under a title. */
const META = 'font-kyg text-[11px] font-bold uppercase leading-[16.5px] tracking-[0.08em] text-boulder';

/** Figtree 700 10.5/15.8 ls 0.06em, white on the tone fill. */
function TonePill({ tone, label }: { tone: RiskTone; label: string }) {
  return (
    <span
      className={cn(
        'inline-block shrink-0 rounded-full px-2.5 py-1 font-kyg text-[10.5px] font-bold uppercase leading-[15.8px] tracking-[0.06em]',
        TONE_PILL[tone]
      )}
    >
      {label}
    </span>
  );
}

function IconBadge({ icon, accent }: { icon: string; accent?: 'crimson' | 'teal' }) {
  return (
    <span className={cn('grid size-11 shrink-0 place-items-center rounded-[16px]', BADGE[accent ?? 'teal'])}>
      <Icon name={icon} className="size-[22px]" />
    </span>
  );
}

export default function MarkerGrid({ data, ground }: { data: MarkerGridSection; ground?: Ground }) {
  return (
    <Section ground={ground ?? 'ivory'} id={data.anchorId ?? 'markers'} className="border-y border-mine/10">
      <div className="flex flex-col gap-[clamp(32px,3.4vw,48px)]">
        <Head data={data.head} />

        {data.groups.map((group, gi) => (
          <div key={group.kicker ?? gi} className="flex flex-col gap-4">
            {/* Figtree 700 12.5/18.8 ls 0.12em #7a7a7a */}
            {group.kicker ? (
              <span className="font-kyg text-[12.5px] font-bold uppercase leading-[18.8px] tracking-[0.12em] text-boulder">
                {group.kicker}
              </span>
            ) : null}

            {group.variant === 'compact' ? (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {group.items.map((item, i) => (
                  <li
                    key={item.title ?? i}
                    className={cn(CARD, 'flex flex-col items-center gap-1 rounded-[22px] p-5 text-center')}
                  >
                    {item.icon ? (
                      <span className="mb-2">
                        <IconBadge icon={item.icon} accent={item.accent} />
                      </span>
                    ) : null}
                    {item.title ? (
                      <span className="font-kyg text-[16.5px] font-extrabold leading-tight text-mine">
                        {item.title}
                      </span>
                    ) : null}
                    {item.meta ? <span className={META}>{item.meta}</span> : null}
                    {item.tone && item.toneLabel ? (
                      <span className="mt-2">
                        <TonePill tone={item.tone} label={item.toneLabel} />
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : group.variant === 'stat' ? (
              // The count is the headline here, so it takes the numeral slot the
              // ink-ground Stats band uses - same weight and tracking, on white.
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {group.items.map((item, i) => (
                  <li key={item.title ?? i} className={cn(CARD, 'flex flex-col items-center p-7 text-center')}>
                    {item.statHtml ? (
                      <span
                        className="font-kyg text-[clamp(34px,4.6vw,50px)] font-extrabold leading-none tracking-[-0.02em] text-eden"
                        dangerouslySetInnerHTML={{ __html: item.statHtml }}
                      />
                    ) : null}
                    {item.title ? (
                      <span className="mt-3 font-kyg text-[19px] font-bold leading-tight text-mine">{item.title}</span>
                    ) : null}
                    {item.bodyHtml ? (
                      <p
                        className="mt-2 font-kyg text-[14.5px] leading-snug text-fusc"
                        dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map((item, i) => (
                  <li key={item.title ?? i} className={cn(CARD, 'flex flex-col p-7')}>
                    {item.icon || (item.tone && item.toneLabel) ? (
                      <div className="mb-4 flex items-center justify-between gap-3">
                        {item.icon ? <IconBadge icon={item.icon} accent={item.accent} /> : <span />}
                        {item.tone && item.toneLabel ? <TonePill tone={item.tone} label={item.toneLabel} /> : null}
                      </div>
                    ) : null}

                    {item.title ? (
                      <h3 className="mb-2 font-kyg text-[20px] font-bold leading-tight tracking-[-0.02em] text-mine">
                        {item.title}
                      </h3>
                    ) : null}

                    {item.bodyHtml ? (
                      <p
                        className="mb-3 font-kyg text-[15.5px] leading-snug text-fusc"
                        dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
                      />
                    ) : null}

                    {/* With a rail, the marker reads as its caption and sits
                        directly above it, then the recommendation closes the
                        card. Without one, the marker is the card's footer and
                        gets the rule - which is how Skin and Immunity draw it.
                        `mt-auto` goes on whichever element opens that closing
                        block, so short cards pad at the body rather than
                        leaving the rail floating mid-card. */}
                    {item.percent !== undefined ? (
                      <>
                        {item.meta ? <span className={cn('mt-auto pb-1.5', META)}>{item.meta}</span> : null}
                        <span className={cn('block', !item.meta && 'mt-auto')}>
                          <ResultBar tone={item.tone ?? 'neutral'} percent={item.percent} />
                        </span>
                        {item.noteHtml ? (
                          <p
                            className="pt-2 font-kyg text-[13px] leading-snug text-boulder"
                            dangerouslySetInnerHTML={{ __html: item.noteHtml }}
                          />
                        ) : null}
                      </>
                    ) : (
                      <>
                        {item.noteHtml ? (
                          <p
                            className="font-kyg text-[13px] leading-snug text-boulder"
                            dangerouslySetInnerHTML={{ __html: item.noteHtml }}
                          />
                        ) : null}
                        {item.meta ? (
                          <span className={cn('mt-auto border-t border-mine/10 pt-3', META)}>{item.meta}</span>
                        ) : null}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
