'use client';

import { useRef } from 'react';
import { cn } from '@/lib/utils';
import type { ActionItem, Bundle, Expert, Panel, Step, Test } from '../data';
import { Badge, Button, SectionHead } from './primitives';
import { BUNDLE_THEME } from './themes';
import { AlertCircle, ArrowRight, BadgeTest, Check, Icon, Plus } from './icons';

// Plain <img> wrapper. next/image needs images.remotePatterns in next.config,
// which is outside the (tests) folder and must not be modified, so we use a
// native <img> (the (landing) page does the same).
function Img(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...props} />;
}

const SECTION = 'reveal pt-[clamp(48px,5.5vw,80px)]';
const STATUS_WORD = { good: 'Good', avg: 'Average', risk: 'Poor' } as const;

// ----------------------------------------------------------------------------- Hero
export function Hero({ hero }: { hero: Test['hero'] }) {
  return (
    <section className="reveal relative">
      <div className="grid grid-cols-[1.15fr_0.85fr] gap-[clamp(24px,3vw,44px)] items-center max-[980px]:grid-cols-1">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 py-2 px-[15px] rounded-full bg-[var(--acc-50)] text-[var(--acc-700)] text-[12.5px] font-bold tracking-[0.13em] uppercase">
            <BadgeTest className="w-[15px] h-[15px]" />
            {hero.badge}
          </span>
          <h1 className="font-semibold text-[clamp(34px,4vw,54px)] leading-[1.03] tracking-[-0.032em] text-[var(--ink-1)] mt-[22px]">
            {hero.titleLead}
            <span className="bg-[linear-gradient(110deg,var(--acc-700)_0%,var(--acc-500)_50%,var(--teal-light)_100%)] bg-clip-text text-transparent">
              {hero.titleHighlight}
            </span>
            {hero.titleTail}
          </h1>
          <p className="text-[clamp(16px,1.35vw,18.5px)] leading-[1.55] text-[var(--ink-2)] mt-[22px] max-w-[520px]">{hero.sub}</p>
          <div className="flex items-center flex-wrap gap-4 mt-[30px] max-[520px]:[&_a]:w-full">
            <Button href="#" variant="accent" size="lg">
              {hero.ctaLabel}
              <ArrowRight />
            </Button>
          </div>
          <p
            className="text-[13.5px] text-[var(--ink-3)] mt-[18px] [&_b]:text-[var(--ink-2)] [&_b]:font-semibold"
            dangerouslySetInnerHTML={{ __html: hero.trustHtml }}
          />
        </div>

        <div className="reveal-r group relative rounded-[var(--r-lg)] overflow-hidden aspect-[4/4.4] bg-[var(--cream-2)] shadow-[var(--sh-2)] max-[980px]:aspect-[16/10] max-[980px]:max-h-[320px] max-[980px]:order-[-1]">
          <Img
            src={hero.image}
            alt={hero.imageAlt}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1300ms] ease-[var(--e-out)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,26,20,0)_45%,rgba(31,26,20,.5)_100%)]" />
          <div className="absolute left-[18px] bottom-[18px] z-[2] text-white text-[13px] font-semibold tracking-[0.01em] py-2 px-[14px] rounded-full bg-white/[0.16] backdrop-blur-[10px] border border-white/[0.24]">
            {hero.imageTag}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-[14px] mt-[36px] max-w-[640px] max-[520px]:grid-cols-2 max-[520px]:gap-x-[14px] max-[520px]:gap-y-[18px]">
        {hero.stats.map((s) => (
          <div key={s.label}>
            <div className="text-[clamp(20px,2vw,26px)] font-bold tracking-[-0.02em] text-[var(--acc-700)] leading-none">{s.num}</div>
            <div className="text-[12.5px] text-[var(--ink-3)] mt-[6px] leading-[1.3]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Divider() {
  return <hr className="h-px bg-[var(--ink-line)] border-0 mt-[clamp(40px,5vw,68px)]" />;
}

// ----------------------------------------------------------------------------- Myth
export function Myth({ myth }: { myth: Test['myth'] }) {
  return (
    <section className={SECTION}>
      <div className="relative grid grid-cols-[1fr_0.9fr] rounded-[var(--r-lg)] overflow-hidden bg-[linear-gradient(150deg,var(--dark-1),var(--dark-3))] shadow-[var(--sh-2)] isolate max-[980px]:grid-cols-1">
        <div className="relative z-[2] p-[clamp(30px,3.4vw,50px)] flex flex-col justify-center">
          <div className="inline-flex items-center gap-3 text-[12.5px] font-bold tracking-[0.16em] uppercase text-[var(--teal-bright)] mb-[18px] before:content-[''] before:w-[30px] before:h-[2px] before:rounded-[2px] before:bg-[var(--teal-bright)]">
            {myth.label}
          </div>
          <p className="font-semibold italic text-[clamp(23px,2.7vw,34px)] leading-[1.16] tracking-[-0.02em] text-white mb-[18px]">
            {myth.quoteLead}
            <em className="not-italic bg-[linear-gradient(110deg,#fff_0%,#F3D5B2_55%,#2AC3A2_100%)] bg-clip-text text-transparent">
              {myth.quoteEmphasis}
            </em>
            {myth.quoteTail}
          </p>
          <p className="text-[15.5px] leading-[1.62] text-white/[0.74] max-w-[440px]">{myth.body}</p>
        </div>
        <div className="relative min-h-[300px] overflow-hidden max-[980px]:order-[-1] max-[980px]:min-h-[200px] max-[980px]:aspect-[16/9] after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,var(--dark-1)_0%,rgba(26,34,32,.5)_30%,rgba(26,34,32,.15)_100%)] max-[980px]:after:bg-[linear-gradient(180deg,rgba(26,34,32,.1)_0%,rgba(26,34,32,.55)_100%)]">
          <Img src={myth.image} alt={myth.imageAlt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------- Discover panels
function ResultCard({ result }: { result: Panel['result'] }) {
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex items-start justify-between gap-[12px]">
        <span className="text-[14.5px] font-semibold tracking-[-0.01em] text-[var(--ink-1)] leading-[1.3]">{result.name}</span>
        <Badge status={result.status}>{result.statusLabel}</Badge>
      </div>
      <div className="text-[12.5px] font-semibold text-[var(--acc-700)] bg-[var(--acc-50)] py-[7px] px-[12px] rounded-[9px] self-start">{result.genes}</div>
      <div className="flex flex-col gap-[3px] bg-white border border-[var(--ink-line)] rounded-[12px] py-[12px] px-[14px]">
        <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--ink-3)]">Interpretation</span>
        <span className="text-[13.5px] leading-[1.5] text-[var(--ink-2)]">{result.interpretation}</span>
      </div>
      <div className="flex flex-col gap-[3px] bg-white border border-[var(--ink-line)] rounded-[12px] py-[12px] px-[14px]">
        <span className="text-[11px] font-bold tracking-[0.08em] uppercase text-[var(--ink-3)]">Recommendation</span>
        <span className="text-[13.5px] leading-[1.5] text-[var(--ink-2)]">{result.recommendation}</span>
      </div>
    </div>
  );
}

function PanelCard({ panel }: { panel: Panel }) {
  const hasExplainer = !!(panel.explainer?.head || panel.explainer?.text || panel.symptoms.length);
  return (
    <article
      id={panel.id}
      className="group grid grid-cols-2 rounded-[var(--r-lg)] overflow-hidden border border-[var(--ink-line)] bg-white shadow-[var(--sh-1)] transition-[box-shadow,transform] duration-500 ease-[var(--e-out)] hover:-translate-y-[3px] hover:shadow-[var(--sh-2)] scroll-mt-[98px] max-[980px]:grid-cols-1"
    >
      <div className="p-[clamp(24px,2.4vw,32px)]">
        <span className="inline-flex items-center justify-center w-[38px] h-[38px] rounded-[11px] bg-[var(--acc-50)] text-[var(--acc-700)] font-bold text-[15px] tracking-[-0.01em]">{panel.number}</span>
        <h3 className="font-semibold text-[clamp(19px,1.7vw,23px)] tracking-[-0.015em] leading-[1.18] text-[var(--ink-1)] mt-[16px] mb-[12px]">{panel.title}</h3>
        <p className="text-[14.5px] leading-[1.6] text-[var(--ink-2)]">{panel.text}</p>

        {panel.indiaNote && (
          <div className="mt-[16px] bg-[var(--acc-50)] rounded-[14px] py-[16px] px-[18px]">
            <span className="block text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--acc-700)] mb-[7px]">{panel.indiaNote.label}</span>
            <p className="text-[13.5px] leading-[1.55] text-[var(--ink-2)]">{panel.indiaNote.text}</p>
          </div>
        )}

        {hasExplainer && (
          <div className="mt-[20px] pt-[18px] border-t border-[var(--ink-line)]">
            {panel.explainer?.head && <div className="font-semibold text-[16px] tracking-[-0.01em] text-[var(--ink-1)] mb-[8px]">{panel.explainer.head}</div>}
            {panel.explainer?.text && <p className="text-[13.5px] leading-[1.6] text-[var(--ink-2)] mb-[16px]">{panel.explainer.text}</p>}
            {panel.symptoms.length > 0 && (
              <>
                <div className="text-[11.5px] font-bold tracking-[0.12em] uppercase text-[var(--ink-3)] mb-[11px]">{panel.symptomsTitle ?? 'Symptoms to watch for'}</div>
                <ul className="list-none flex flex-col gap-[9px]">
                  {panel.symptoms.map((s) => (
                    <li key={s} className="flex gap-[10px] items-start text-[14px] leading-[1.45] text-[var(--ink-2)]">
                      <span className="shrink-0 basis-[18px] w-[18px] h-[18px] text-[var(--acc-500)] mt-[1px]">
                        <AlertCircle className="w-[18px] h-[18px]" />
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>

      <div
        aria-hidden="true"
        className={cn(
          'p-[clamp(22px,2.2vw,30px)] bg-[linear-gradient(160deg,var(--acc-50),#fff_120%)] flex flex-col justify-start gap-[11px]',
          panel.flip
            ? 'border-r border-[var(--ink-line)] order-[-1] max-[980px]:order-0 max-[980px]:border-r-0 max-[980px]:border-t max-[980px]:border-[var(--ink-line)]'
            : 'border-l border-[var(--ink-line)] max-[980px]:border-l-0 max-[980px]:border-t max-[980px]:border-[var(--ink-line)]',
        )}
      >
        <ResultCard result={panel.result} />
      </div>
    </article>
  );
}

export function Discover({ discover }: { discover: Test['discover'] }) {
  return (
    <section className={SECTION}>
      <SectionHead eyebrow={discover.eyebrow} title={discover.title} sub={discover.sub} />
      <div className="grid gap-[20px]">
        {discover.panels.map((p) => (
          <PanelCard key={p.id} panel={p} />
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------- Mid CTA
export function MidCta({ text, ctaLabel }: { text: string; ctaLabel: string }) {
  return (
    <section className={SECTION}>
      <div className="flex items-center justify-between flex-wrap gap-[18px] py-[clamp(22px,2.4vw,30px)] px-[clamp(24px,2.6vw,34px)] rounded-[var(--r-lg)] bg-[linear-gradient(140deg,var(--acc-700),var(--acc-500))] text-white shadow-[0_18px_44px_-18px_rgba(31,107,67,.6)] max-[520px]:flex-col max-[520px]:items-start max-[520px]:[&_a]:w-full">
        <div className="font-semibold text-[clamp(18px,1.8vw,22px)] tracking-[-0.015em] max-w-[560px]">{text}</div>
        <Button href="#" variant="light">
          {ctaLabel}
          <ArrowRight />
        </Button>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------- Report (panel list + grading)
export function Report({ report }: { report: Test['report'] }) {
  return (
    <section className={SECTION}>
      <SectionHead eyebrow={report.eyebrow} title={report.title} sub={report.sub} />

      <div className="flex flex-col gap-[16px]">
        {report.groups.map((g) => (
          <div key={g.name} className="grid grid-cols-[220px_1fr] gap-[24px] p-[clamp(20px,2.2vw,28px)] rounded-[var(--r-md)] bg-white border border-[var(--ink-line)] shadow-[var(--sh-1)] max-[980px]:grid-cols-1 max-[980px]:gap-[14px]">
            <div>
              <div className="font-semibold text-[18px] tracking-[-0.01em] text-[var(--ink-1)] leading-[1.2]">{g.name}</div>
              <span className="inline-block mt-[8px] text-[12px] font-bold tracking-[0.04em] py-[4px] px-[11px] rounded-full bg-[var(--acc-50)] text-[var(--acc-700)]">{g.countLabel}</span>
            </div>
            <div className="flex flex-wrap gap-[8px] content-start">
              {g.items.map((it) =>
                it.isGene ? (
                  <span key={it.label} className="text-[13.5px] font-semibold text-[var(--acc-700)] py-[8px] px-[14px] rounded-full bg-[var(--acc-50)] border border-transparent">{it.label}</span>
                ) : (
                  <span key={it.label} className="text-[13.5px] font-medium text-[var(--ink-1)] py-[8px] px-[14px] rounded-full bg-[var(--cream)] border border-[var(--ink-line)] transition-[background,border-color] duration-[250ms] ease-[var(--e-out)] hover:bg-[var(--acc-50)] hover:border-[var(--acc-100)]">{it.label}</span>
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[18px] border border-[var(--ink-line)] rounded-[var(--r-md)] bg-white overflow-hidden shadow-[var(--sh-1)]">
        <div className="font-semibold text-[15px] text-[var(--ink-1)] py-[16px] px-[20px] border-b border-[var(--ink-line)] bg-[var(--cream)]">{report.gradingTitle}</div>
        {report.grading.map((row) => (
          <div key={row.label} className="flex items-center gap-[14px] py-[14px] px-[20px] border-b border-[var(--ink-line)] flex-wrap last:border-b-0">
            <Badge status={row.status} className="shrink-0 min-w-[88px] text-center">{STATUS_WORD[row.status]}</Badge>
            <span className="text-[13.5px] font-semibold text-[var(--ink-1)] basis-[110px] grow-0 shrink-0 max-[980px]:basis-auto">{row.label}</span>
            <span className="text-[13.5px] leading-[1.45] text-[var(--ink-2)] flex-1 min-w-[200px]">{row.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------- Expertise
function CertLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex items-center justify-center py-[14px] px-[12px] rounded-[14px] bg-white min-h-[84px] border border-[var(--ink-line)] transition-[box-shadow,transform] duration-[400ms] ease-[var(--e-out)] hover:-translate-y-[2px] hover:shadow-[var(--sh-2)]">
      <Img
        src={src}
        alt={alt}
        className="max-w-full max-h-[56px] w-auto h-auto object-contain"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
          e.currentTarget.nextElementSibling?.classList.remove('hidden');
        }}
      />
      <span className="hidden text-[12px] font-bold tracking-[0.04em] text-[var(--ink-3)] text-center px-2">{alt}</span>
    </div>
  );
}

function ExpertCard({ expert }: { expert: Expert }) {
  return (
    <div className="p-[24px] rounded-[var(--r-md)] bg-white border border-[var(--ink-line)] shadow-[var(--sh-1)] flex flex-col transition-[transform,box-shadow] duration-500 ease-[var(--e-out)] hover:-translate-y-[3px] hover:shadow-[var(--sh-2)]">
      <div className="flex items-center gap-[13px] mb-[14px]">
        <div className="shrink-0 basis-[46px] w-[46px] h-[46px] rounded-[14px] inline-flex items-center justify-center bg-[var(--acc-500)] text-white font-bold text-[15px] [&_svg]:w-[22px] [&_svg]:h-[22px]">
          {expert.avatar.type === 'initials' ? expert.avatar.value : <Icon name={expert.avatar.value} />}
        </div>
        <div>
          <div className="font-semibold text-[15.5px] tracking-[-0.01em] text-[var(--ink-1)] leading-[1.15]">{expert.name}</div>
          <div className="text-[12.5px] text-[var(--ink-3)] mt-[2px]">{expert.role}</div>
        </div>
      </div>
      <p className="text-[13.5px] leading-[1.55] text-[var(--ink-2)] mt-auto">{expert.text}</p>
      <div className="text-[12.5px] text-[var(--ink-3)] mt-[10px] pt-[12px] border-t border-[var(--ink-line)]">{expert.lab}</div>
    </div>
  );
}

export function Expertise({ expertise }: { expertise: Test['expertise'] }) {
  return (
    <section className={SECTION}>
      <SectionHead eyebrow={expertise.eyebrow} title={expertise.title} sub={expertise.sub} />

      <ul className="flex flex-col gap-[12px] mb-[28px] max-w-[660px]">
        {expertise.bullets.map((b) => (
          <li key={b} className="flex gap-[12px] items-start text-[15px] leading-[1.5] text-[var(--ink-2)] list-none">
            <span className="shrink-0 basis-[22px] w-[22px] h-[22px] rounded-full bg-[var(--acc-50)] text-[var(--acc-500)] inline-flex items-center justify-center mt-[1px]">
              <Check className="w-[12px] h-[12px]" />
            </span>
            {b}
          </li>
        ))}
      </ul>

      {expertise.certifications.length > 0 && (
        <div className="mb-[28px] border border-[var(--ink-line)] rounded-[var(--r-md)] bg-white p-[10px] shadow-[var(--sh-1)]">
          <div className="grid grid-cols-6 gap-[10px] max-[980px]:grid-cols-3 max-[520px]:grid-cols-2">
            {expertise.certifications.map((c) => (
              <CertLogo key={c.alt} src={c.src} alt={c.alt} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-[18px] max-[1024px]:grid-cols-1">
        {expertise.experts.map((e) => (
          <ExpertCard key={e.name} expert={e} />
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------- Action plan
function ActionCard({ action }: { action: ActionItem }) {
  return (
    <div className="p-[24px] rounded-[var(--r-md)] bg-white border border-[var(--ink-line)] shadow-[var(--sh-1)] transition-[transform,box-shadow,border-color] duration-500 ease-[var(--e-out)] hover:-translate-y-[3px] hover:shadow-[var(--sh-2)] hover:border-[var(--acc-100)]">
      <div className="w-[44px] h-[44px] rounded-[13px] inline-flex items-center justify-center bg-[var(--acc-50)] text-[var(--acc-500)] mb-[16px] [&_svg]:w-[22px] [&_svg]:h-[22px]">
        <Icon name={action.icon} />
      </div>
      <div className="font-semibold text-[18px] tracking-[-0.012em] text-[var(--ink-1)] mb-[8px]">{action.title}</div>
      <p className="text-[14px] leading-[1.55] text-[var(--ink-2)]">{action.text}</p>
    </div>
  );
}

export function ActionPlan({ actionPlan }: { actionPlan: Test['actionPlan'] }) {
  const b = actionPlan.banner;
  return (
    <section className={SECTION}>
      <SectionHead eyebrow={actionPlan.eyebrow} title={actionPlan.title} sub={actionPlan.sub} />

      <div className="reveal group relative rounded-[var(--r-lg)] overflow-hidden aspect-[21/8] mb-[20px] shadow-[var(--sh-2)] bg-[var(--cream-2)] isolate max-[980px]:aspect-[3/2.4]">
        <Img src={b.image} alt={b.imageAlt} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[var(--e-out)] group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(31,26,20,.82)_0%,rgba(31,26,20,.5)_42%,rgba(31,26,20,.05)_78%)] max-[980px]:bg-[linear-gradient(180deg,rgba(31,26,20,.35)_0%,rgba(31,26,20,.8)_100%)]" />
        <div className="absolute inset-0 z-[2] flex flex-col justify-center p-[clamp(24px,3vw,46px)] max-w-[560px] max-[980px]:justify-end">
          <div className="text-[12px] font-bold tracking-[0.18em] uppercase text-[var(--teal-bright)] mb-[12px]">{b.eyebrow}</div>
          <p className="font-semibold text-[clamp(17px,2vw,24px)] leading-[1.3] tracking-[-0.015em] text-white">{b.text}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[18px] max-[980px]:grid-cols-1">
        {actionPlan.actions.map((a) => (
          <ActionCard key={a.title} action={a} />
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------- How it works
function StepCard({ step }: { step: Step }) {
  return (
    <div className="group relative rounded-[var(--r-md)] overflow-hidden bg-white border border-[var(--ink-line)] shadow-[var(--sh-1)] transition-[transform,box-shadow] duration-500 ease-[var(--e-out)] hover:-translate-y-[3px] hover:shadow-[var(--sh-2)]">
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--cream-2)]">
        <Img src={step.image} alt={step.imageAlt} loading="lazy" className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[var(--e-out)] group-hover:scale-[1.06]" />
      </div>
      <div className="font-bold text-[15px] w-[42px] h-[42px] rounded-full inline-flex items-center justify-center bg-[var(--acc-500)] text-white border-[3px] border-white relative z-[2] -mt-[21px] ml-[22px]">{step.num}</div>
      <div className="font-semibold text-[18px] tracking-[-0.012em] text-[var(--ink-1)] mt-[10px] mx-[24px] mb-[9px]">{step.title}</div>
      <p className="text-[14px] leading-[1.55] text-[var(--ink-2)] mt-0 mx-[24px] mb-[26px]">{step.text}</p>
    </div>
  );
}

export function HowItWorks({ howItWorks }: { howItWorks: Test['howItWorks'] }) {
  return (
    <section className={SECTION}>
      <SectionHead eyebrow={howItWorks.eyebrow} title={howItWorks.title} />
      <div className="grid grid-cols-3 gap-[18px] max-[1024px]:grid-cols-1">
        {howItWorks.steps.map((s) => (
          <StepCard key={s.num} step={s} />
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------- FAQ
export function Faq({ faq }: { faq: Test['faq'] }) {
  const ref = useRef<HTMLDivElement>(null);

  // Single-open accordion: when one <details> opens, close the others.
  const onToggle = (e: React.SyntheticEvent<HTMLDetailsElement>) => {
    const el = e.currentTarget;
    if (el.open && ref.current) {
      ref.current.querySelectorAll<HTMLDetailsElement>('details[open]').forEach((d) => {
        if (d !== el) d.open = false;
      });
    }
  };

  return (
    <section className={SECTION}>
      <SectionHead eyebrow={faq.eyebrow} title={faq.title} />
      <div ref={ref} className="flex flex-col gap-[12px] max-w-[760px]">
        {faq.items.map((item) => (
          <details
            key={item.q}
            onToggle={onToggle}
            className="group border border-[var(--ink-line)] rounded-[var(--r-sm)] bg-white overflow-hidden transition-[box-shadow,border-color] duration-[400ms] ease-[var(--e-out)] open:shadow-[var(--sh-1)] open:border-[var(--acc-100)]"
          >
            <summary className="list-none cursor-pointer flex items-center justify-between gap-[16px] py-[18px] px-[22px] font-semibold text-[16px] tracking-[-0.01em] text-[var(--ink-1)] [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="shrink-0 basis-[26px] w-[26px] h-[26px] rounded-full bg-[var(--acc-50)] text-[var(--acc-700)] inline-flex items-center justify-center transition-[transform,background] duration-[400ms] ease-[var(--e-out)] group-open:rotate-45 group-open:bg-[var(--acc-500)] group-open:text-white [&_svg]:w-[14px] [&_svg]:h-[14px]">
                <Plus />
              </span>
            </summary>
            <div className="pt-0 px-[22px] pb-[20px] text-[14.5px] leading-[1.6] text-[var(--ink-2)] max-w-[660px]">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------- Bundles
export function Bundles({ items }: { items: Bundle[] }) {
  return (
    <section className={SECTION}>
      <div className="flex items-center gap-[16px] justify-center mb-[clamp(24px,2.6vw,34px)]">
        <span className="flex-1 max-w-[90px] h-px bg-[var(--ink-line)]" />
        <b className="text-[13px] font-bold tracking-[0.2em] uppercase text-[var(--ink-3)]">Or Bundle &amp; Save</b>
        <span className="flex-1 max-w-[90px] h-px bg-[var(--ink-line)]" />
      </div>
      <div className="grid grid-cols-2 gap-[16px] max-[980px]:grid-cols-1">
        {items.map((b) => {
          const t = BUNDLE_THEME[b.theme];
          return (
            <a
              key={b.name}
              href="#"
              className={cn('group block py-[22px] px-[24px] rounded-[var(--r-md)] transition-[transform,box-shadow] duration-500 ease-[var(--e-out)] hover:-translate-y-[4px] hover:shadow-[var(--sh-2)]', t.bg)}
            >
              <div className={cn('text-[11px] font-bold tracking-[0.13em] uppercase mb-[7px]', t.accent)}>{b.tag}</div>
              <div className={cn('font-semibold text-[19px] tracking-[-0.012em] mb-[5px]', t.name)}>{b.name}</div>
              <p className={cn('text-[13.5px] leading-[1.45] mb-[16px]', t.desc)}>{b.desc}</p>
              <span className={cn('inline-flex items-center gap-[7px] text-[14px] font-semibold transition-[gap] duration-[350ms] ease-[var(--e-out)] group-hover:gap-[11px] [&_svg]:w-[14px] [&_svg]:h-[14px]', t.accent)}>
                View <ArrowRight />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------- Bottom CTA
export function BottomCta({ cta }: { cta: Test['bottomCta'] }) {
  return (
    <section className={SECTION}>
      <div className="relative overflow-hidden py-[clamp(40px,4.6vw,64px)] px-[clamp(28px,3vw,48px)] rounded-[var(--r-lg)] bg-[linear-gradient(150deg,var(--dark-1),var(--dark-3))] text-center before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(40vw_40vh_at_80%_-10%,rgba(42,195,162,.18),transparent_60%)]">
        <h2 className="relative font-semibold text-[clamp(28px,3.2vw,42px)] tracking-[-0.025em] text-white leading-[1.06]">{cta.title}</h2>
        <p className="relative text-[clamp(15px,1.3vw,17.5px)] text-white/70 mt-[18px] mb-[30px] mx-auto max-w-[520px]">{cta.sub}</p>
        <Button href="#" variant="accent" size="lg" className="relative bg-[var(--teal-bright)] text-[var(--dark-1)] hover:bg-white">
          {cta.ctaLabel}
          <ArrowRight />
        </Button>
        <p className="relative text-[14px] text-[var(--teal-bright)] font-semibold mt-[22px]">{cta.nudge}</p>
        <p className="relative text-[13px] text-white/55 mt-[20px]" dangerouslySetInnerHTML={{ __html: cta.trust }} />
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------------- Mobile buy bar
export function BuyBar({ label }: { label: string }) {
  return (
    <div className="hidden max-[980px]:block fixed left-0 right-0 bottom-0 z-[70] py-[12px] px-[var(--gutter)] bg-[rgba(250,246,239,.9)] backdrop-blur-[16px] border-t border-[var(--ink-line)] [&_a]:w-full">
      <Button href="#" variant="accent">
        {label}
        <ArrowRight />
      </Button>
    </div>
  );
}
