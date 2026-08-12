import { cn } from '@/lib/utils';
import type { Ground, MarkerGridSection } from '../../types';
import { Icon } from '../icons';
import { Head, Section, TONE_PILL } from '../ui';

// =============================================================================
// MARKER GRID — graded tiles in labelled groups.
// -----------------------------------------------------------------------------
// Skin Health reads twenty markers from the same saliva sample, and ten of them
// are not conditions: six food sensitivities and four nutrients. They carry no
// photography, no gene story and no filter, so `riskCards` is the wrong shape —
// six of those 389px cards would run to three rows of near-empty artwork.
//
// Two densities, both off the same item:
//   compact  6-up icon tiles     — 44px badge, title, marker, tone pill
//   detail   4-up cards          — badge + pill on one row, then title and copy
//
// Everything below reuses the frame's own tokens (r16 badges, tst-soft cards,
// the shared TONE_PILL) so the band sits inside the same visual system as the
// risk cards above it.
// =============================================================================

const BADGE: Record<'crimson' | 'teal', string> = {
  crimson: 'bg-blush text-crimson',
  teal: 'bg-mint text-eden',
};

/** Figtree 700 10.5/15.8 ls 0.06em, white on the tone fill. */
function TonePill({
  tone,
  label,
}: {
  tone: MarkerGridSection['groups'][number]['items'][number]['tone'];
  label: string;
}) {
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

export default function MarkerGrid({ data, ground }: { data: MarkerGridSection; ground?: Ground }) {
  return (
    <Section ground={ground ?? 'ivory'} id="markers" className="border-y border-mine/10">
      <div className="flex flex-col gap-[clamp(32px,3.4vw,48px)]">
        <Head data={data.head} />

        {data.groups.map((group) => (
          <div key={group.kicker} className="flex flex-col gap-4">
            {/* Figtree 700 12.5/18.8 ls 0.12em #7a7a7a */}
            <span className="font-kyg text-[12.5px] font-bold uppercase leading-[18.8px] tracking-[0.12em] text-boulder">
              {group.kicker}
            </span>

            {group.variant === 'compact' ? (
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {group.items.map((item) => (
                  <li
                    key={item.title}
                    className="lift flex flex-col items-center gap-1 rounded-[22px] border border-mine/10 bg-white p-5 text-center shadow-tst-soft"
                  >
                    <span
                      className={cn(
                        'mb-2 grid size-11 shrink-0 place-items-center rounded-[16px]',
                        BADGE[item.accent ?? 'teal']
                      )}
                    >
                      <Icon name={item.icon} className="size-[22px]" />
                    </span>
                    <span className="font-kyg text-[16.5px] font-extrabold leading-tight text-mine">{item.title}</span>
                    <span className="font-kyg text-[11px] font-bold uppercase leading-[16.5px] tracking-[0.08em] text-boulder">
                      {item.meta}
                    </span>
                    <span className="mt-2">
                      <TonePill tone={item.tone} label={item.toneLabel} />
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {group.items.map((item) => (
                  <li
                    key={item.title}
                    className="lift flex flex-col rounded-[24px] border border-mine/10 bg-white p-7 shadow-tst-soft"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span
                        className={cn(
                          'grid size-11 shrink-0 place-items-center rounded-[16px]',
                          BADGE[item.accent ?? 'teal']
                        )}
                      >
                        <Icon name={item.icon} className="size-[22px]" />
                      </span>
                      <TonePill tone={item.tone} label={item.toneLabel} />
                    </div>

                    <h3 className="mb-2 font-kyg text-[20px] font-bold leading-tight tracking-[-0.02em] text-mine">
                      {item.title}
                    </h3>

                    {item.bodyHtml ? (
                      <p
                        className="mb-3 font-kyg text-[15.5px] leading-snug text-fusc"
                        dangerouslySetInnerHTML={{ __html: item.bodyHtml }}
                      />
                    ) : null}

                    {/* pushed to the card foot so a short body does not leave the
                        marker floating mid-card next to a longer neighbour */}
                    <span className="mt-auto border-t border-mine/10 pt-3 font-kyg text-[11px] font-bold uppercase leading-[16.5px] tracking-[0.08em] text-boulder">
                      {item.meta}
                    </span>
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
