'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { cn } from '@/lib/utils';
import { FORM_COPY } from '../constants';
import { CONTACT_TOPICS, contactSchema } from '../schemas/contact.schema';
import type { ContactSubmitState } from '../types';
import { ContactEyebrow, ContactIcon } from './ContactIcon';

// Figma: card r28, 1px #222222@10, pad 40, gap 28 (header / form stack).
// Fields r14, 1px #222222@14, white ground, placeholder #9a968b.
//   input    pad 16, 15.5/18.6  -> 53 tall
//   select   pad 14/44/14/16, 15.5/23.2 -> 54 tall
//   textarea pad 14/16, 15.5/23.2, fixed 131 tall
// Radii are explicit arbitrary values - this project remaps the Tailwind radius
// scale, so rounded-xl is 14 but rounded-2xl is 18 and rounded-3xl is 22.
const FIELD_BASE =
  'w-full rounded-[14px] border border-mine/14 bg-white px-4 font-kyg text-[15.5px] text-mine outline-none transition placeholder:text-[#9a968b] focus:border-eden/40 focus:ring-4 focus:ring-java/10 disabled:opacity-60';
const INPUT = `${FIELD_BASE} py-4 leading-[18.6px]`;
const SELECT = `${FIELD_BASE} appearance-none py-[14px] pr-11 leading-[23.2px]`;
const TEXTAREA = `${FIELD_BASE} h-[131px] resize-y py-[14px] leading-[23.2px]`;
// Figtree 700 13/19.5 ls 0.13 (0.01em) #2d2a24 - a single run, so the "*" and
// the "(optional)" qualifier carry the same weight and colour as the label.
const LABEL = 'font-kyg text-[13px] font-bold leading-[19.5px] tracking-[0.01em] text-[#2d2a24]';
const ERR = 'font-kyg text-[12.5px] leading-[18.8px] text-mojo';

export default function ContactForm() {
  const uid = useId();
  const [state, setState] = useState<ContactSubmitState>({ status: 'idle' });
  const errs = state.status === 'error' ? (state.fieldErrors ?? {}) : {};

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      topic: String(fd.get('topic') ?? ''),
      message: String(fd.get('message') ?? ''),
      consent: fd.get('consent') === 'on',
      website: String(fd.get('website') ?? ''),
    };

    // Validate with the SAME schema the API uses, so the user sees field errors
    // before a round-trip. The server re-validates regardless - this is UX only.
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0] ?? '');
        if (k && !fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setState({ status: 'error', message: 'Please check the highlighted fields.', fieldErrors });
      return;
    }

    setState({ status: 'submitting' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        setState({
          status: 'error',
          message: json?.error ?? 'Something went wrong. Please email hello@kyg.in instead.',
        });
        return;
      }
      setState({ status: 'success' });
    } catch {
      setState({
        status: 'error',
        message: 'Could not reach the server. Please email hello@kyg.in instead.',
      });
    }
  }

  if (state.status === 'success') {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-[28px] border border-mine/10 bg-white p-6 text-center shadow-tst-card sm:p-10">
        <span className="grid size-14 place-items-center rounded-[16px] bg-mint">
          <ContactIcon id={FORM_COPY.eyebrow.icon} className="h-[26px] w-[22px]" />
        </span>
        <h2 className="font-kyg text-[clamp(22px,2.4vw,30px)] font-extrabold leading-[1.15] tracking-[-0.02em] text-mine">
          Message sent.
        </h2>
        <p className="max-w-[380px] break-words font-kyg text-[15.5px] leading-[23.2px] text-fusc">
          Thanks - a real person from the team will get back to you. If it is urgent, email{' '}
          <a className="font-bold text-eden underline" href="mailto:hello@kyg.in">
            hello@kyg.in
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setState({ status: 'idle' })}
          className="mt-2 font-kyg text-[14px] font-bold text-eden underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const busy = state.status === 'submitting';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-7 rounded-[28px] border border-mine/10 bg-white p-[clamp(24px,3vw,40px)] shadow-tst-card"
    >
      {/* header - gap 8; the h2 frame carries 7 top / 1 bottom padding */}
      <div className="flex flex-col gap-2">
        <ContactEyebrow
          label={FORM_COPY.eyebrow.label}
          icon={FORM_COPY.eyebrow.icon}
          className="max-w-full self-start"
        />
        <h2 className="pb-px pt-[7px] font-kyg text-[clamp(24px,2.6vw,34px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-mine">
          {FORM_COPY.title}
        </h2>
        <p className="font-kyg text-[15.5px] leading-[23.2px] text-fusc">{FORM_COPY.lead}</p>
      </div>

      {/* honeypot - hidden from humans, catches naive bots */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* form#contactForm - vertical stack, gap 20 */}
      <div className="flex flex-col gap-5">
        {/* Two-up from sm, but back to ONE column through lg: the page grid
            hands this card only ~414px at 1024, i.e. 165px tracks - narrower
            than the select's widest option ("Which test is right for me") plus
            its 16/44 padding, so the chosen topic would render clipped. It
            widens again at xl, and >= 1440 is the frame's 242px pair.
            min-w-0 on each field: an <input>/<select> keeps an intrinsic
            min-content width from `size`/its longest option, and a grid item's
            automatic minimum size would let that push past minmax(0,1fr). */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-[7px]">
            <label className={LABEL} htmlFor={`${uid}-name`}>
              Full name *
            </label>
            <input
              id={`${uid}-name`}
              name="name"
              autoComplete="name"
              placeholder="Your name"
              disabled={busy}
              aria-invalid={!!errs.name}
              className={cn(INPUT, errs.name && 'border-mojo/60')}
            />
            {errs.name ? <span className={ERR}>{errs.name}</span> : null}
          </div>

          <div className="flex min-w-0 flex-col gap-[7px]">
            <label className={LABEL} htmlFor={`${uid}-email`}>
              Email *
            </label>
            <input
              id={`${uid}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              disabled={busy}
              aria-invalid={!!errs.email}
              className={cn(INPUT, errs.email && 'border-mojo/60')}
            />
            {errs.email ? <span className={ERR}>{errs.email}</span> : null}
          </div>

          <div className="flex min-w-0 flex-col gap-[7px]">
            <label className={LABEL} htmlFor={`${uid}-phone`}>
              Phone (optional)
            </label>
            <input
              id={`${uid}-phone`}
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91"
              disabled={busy}
              aria-invalid={!!errs.phone}
              className={cn(INPUT, errs.phone && 'border-mojo/60')}
            />
            {errs.phone ? <span className={ERR}>{errs.phone}</span> : null}
          </div>

          <div className="flex min-w-0 flex-col gap-[7px]">
            <label className={LABEL} htmlFor={`${uid}-topic`}>
              What&apos;s it about? *
            </label>
            {/* The chevron is the frame's own 24x24 glyph (12x6 stroke-2 #0e4d4b),
                inset 15 from the right edge - not a lucide substitute. */}
            <div className="relative">
              <select
                id={`${uid}-topic`}
                name="topic"
                defaultValue=""
                disabled={busy}
                aria-invalid={!!errs.topic}
                className={cn(SELECT, errs.topic && 'border-mojo/60')}
              >
                <option value="" disabled>
                  Choose a topic
                </option>
                {CONTACT_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ContactIcon
                id="901-1198"
                className="pointer-events-none absolute right-[15px] top-1/2 size-6 -translate-y-1/2"
              />
            </div>
            {errs.topic ? <span className={ERR}>{errs.topic}</span> : null}
          </div>
        </div>

        <div className="flex flex-col gap-[7px] pb-[7px]">
          <label className={LABEL} htmlFor={`${uid}-message`}>
            Message *
          </label>
          <textarea
            id={`${uid}-message`}
            name="message"
            rows={4}
            placeholder="How can we help?"
            disabled={busy}
            aria-invalid={!!errs.message}
            className={cn(TEXTAREA, errs.message && 'border-mojo/60')}
          />
          {errs.message ? <span className={ERR}>{errs.message}</span> : null}
        </div>

        <div className="flex flex-col gap-2">
          {/* 18x18 r2.5 #767676 checkbox, 2px top offset, gap 12; copy is one
              uniform Figtree 400 13.5/18.6 #5b564e run, right inset 31. */}
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="consent"
              disabled={busy}
              aria-invalid={!!errs.consent}
              className="mt-0.5 size-[18px] shrink-0 rounded-[2.5px] border border-[#767676] bg-white accent-eden"
            />
            {/* The 31 right inset only exists to hold the frame's line breaks;
                below sm it would eat 31 of the ~200px the copy has left. */}
            <span className="font-kyg text-[13.5px] leading-[18.6px] text-fusc sm:pr-[31px]">
              {FORM_COPY.consentPrefix}{' '}
              <Link href={FORM_COPY.consentLinkHref} className="underline">
                {FORM_COPY.consentLinkLabel}
              </Link>
              {FORM_COPY.consentSuffix}
            </span>
          </label>
          {errs.consent ? <span className={ERR}>{errs.consent}</span> : null}
        </div>

        {state.status === 'error' && !Object.keys(errs).length ? (
          <p role="alert" className="rounded-[14px] bg-mojo/8 px-4 py-3 font-kyg text-[14px] text-mojo">
            {state.message}
          </p>
        ) : null}

        {/* button row - 4 top padding, gap 16, centred */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-1">
          <button
            type="submit"
            disabled={busy}
            className="group inline-flex items-center gap-2.5 rounded-full border border-eden bg-eden px-8 py-4 font-kyg text-[16px] font-extrabold leading-6 tracking-[0.06px] text-white shadow-tst-cta transition duration-200 hover:-translate-y-px hover:bg-eden2 disabled:translate-y-0 disabled:opacity-70"
          >
            {busy ? 'Sending…' : FORM_COPY.submit}
            <ContactIcon
              id="1242-885"
              className="h-6 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </button>

          <span className="break-words font-kyg text-[13px] leading-[19.5px] text-boulder">
            {FORM_COPY.fallbackPrefix}{' '}
            <a href={`mailto:${FORM_COPY.fallbackEmail}`} className="underline">
              {FORM_COPY.fallbackEmail}
            </a>{' '}
            {FORM_COPY.fallbackSuffix}
          </span>
        </div>
      </div>
    </form>
  );
}
