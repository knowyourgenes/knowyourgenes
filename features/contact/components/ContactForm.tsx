'use client';

import { useId, useState } from 'react';

import { BTN } from '@/components/shared/button-styles';
import { Icon } from '@/components/shared/kyg';
import { cn } from '@/lib/utils';
import { FORM_COPY } from '../constants';
import { CONTACT_TOPICS, contactSchema } from '../schemas/contact.schema';
import type { ContactSubmitState } from '../types';

/**
 * The form card - Figma 346:1169.
 *
 * Card: spring ground, 1px zeus@10, pad 22.756.
 * Field: 34.13 tall, white, 1px zeus@14, pad-x 11.378, placeholder boulder.
 * Label: Figtree 700 9.244/13.51 on heavy, 5.689 above its field.
 *
 * SUBJECT IS A SELECT, and that is the one place this departs from the frame.
 * The design draws a free-text box reading "What is this about?", but the API
 * and `model ContactMessage` both take `topic` from a seven-value enum
 * (contact.schema.ts), and a free string fails that validation. Rather than
 * change the server contract for a visual, the control is a select wearing the
 * design's field: same box, same placeholder as its empty option. Widening
 * `topic` to a string is a schema + Prisma change and belongs on its own.
 *
 * `phone` is simply not drawn here. It is optional in the schema, so omitting
 * the field sends nothing and validates fine.
 */
const FIELD =
  'w-full rounded-sm border border-zeus/[0.14] bg-white px-[clamp(11.4px,1.111vw,17.8px)] font-kyg text-[16px] leading-[1.549] text-heavy lg:text-[clamp(11px,1.076vw,17.2px)] outline-none transition placeholder:text-boulder focus:border-eden/40 focus:ring-4 focus:ring-java/10 disabled:opacity-60';
// 44px floor: 3.333vw only reaches 44 at a 1319 viewport, so the frame's 34.1
// would apply at every phone, tablet and 1280 laptop.
const INPUT = `${FIELD} h-[clamp(44px,3.333vw,53.3px)]`;
const LABEL = 'font-kyg text-[clamp(11px,0.903vw,14.4px)] font-bold leading-[1.462] text-heavy';
const ERR = 'mt-[4px] block font-kyg text-[clamp(12px,0.9375vw,15px)] leading-[1.5] text-mojo';
/** 5.689 label -> field, 12.8 between one field group and the next. */
const GROUP = 'flex min-w-0 flex-col gap-[clamp(5.7px,0.556vw,8.9px)]';

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
      <div className="flex min-h-[clamp(280px,26vw,416px)] flex-col items-center justify-center gap-4 rounded-sm border border-zeus/10 bg-spring p-[clamp(20px,2.222vw,35.6px)] text-center">
        <span className="grid h-14 w-14 place-items-center rounded-sm bg-mint text-eden">
          <Icon name="check" className="h-7 w-7" />
        </span>
        <h3 className="font-kyg text-[clamp(20px,2.2vw,28px)] font-bold leading-[1.15] tracking-[-0.02em] text-heavy">
          Message sent.
        </h3>
        <p className="max-w-[380px] font-kyg text-[clamp(11px,1.076vw,17.2px)] leading-[1.6] text-fusc">
          Thanks — a real person from the team will get back to you. If it is urgent, email{' '}
          <a className="font-bold text-eden underline" href="mailto:hello@kyg.in">
            hello@kyg.in
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setState({ status: 'idle' })}
          className="mt-2 inline-flex min-h-[44px] items-center px-[8px] font-kyg text-[14px] font-bold text-eden underline"
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
      className="flex flex-col gap-[clamp(12.8px,1.25vw,20px)] rounded-sm border border-zeus/10 bg-spring p-[clamp(16px,2.222vw,35.6px)]"
    >
      {/* honeypot - hidden from humans, catches naive bots */}
      <div aria-hidden className="hidden">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {/* 11.378 between the two, and one column until there is room for two */}
      <div className="grid gap-[clamp(11.4px,1.111vw,17.8px)] sm:grid-cols-2">
        <div className={GROUP}>
          <label className={LABEL} htmlFor={`${uid}-name`}>
            Your name *
          </label>
          <input
            id={`${uid}-name`}
            name="name"
            autoComplete="name"
            placeholder="Priya Sharma"
            disabled={busy}
            aria-invalid={!!errs.name}
            className={cn(INPUT, errs.name && 'border-mojo/60')}
          />
          {errs.name ? <span className={ERR}>{errs.name}</span> : null}
        </div>

        <div className={GROUP}>
          <label className={LABEL} htmlFor={`${uid}-email`}>
            Email *
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={busy}
            aria-invalid={!!errs.email}
            className={cn(INPUT, errs.email && 'border-mojo/60')}
          />
          {errs.email ? <span className={ERR}>{errs.email}</span> : null}
        </div>
      </div>

      <div className={GROUP}>
        <label className={LABEL} htmlFor={`${uid}-topic`}>
          Subject
        </label>
        <div className="relative">
          <select
            id={`${uid}-topic`}
            name="topic"
            defaultValue=""
            disabled={busy}
            aria-invalid={!!errs.topic}
            className={cn(INPUT, 'appearance-none pr-10', errs.topic && 'border-mojo/60')}
          >
            <option value="" disabled>
              What is this about?
            </option>
            {CONTACT_TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <Icon
            name="chevron"
            strokeWidth={2}
            className="pointer-events-none absolute right-[clamp(11.4px,1.111vw,17.8px)] top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-boulder"
          />
        </div>
        {errs.topic ? <span className={ERR}>{errs.topic}</span> : null}
      </div>

      <div className={GROUP}>
        <label className={LABEL} htmlFor={`${uid}-message`}>
          Message *
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={4}
          placeholder="Tell us what you need…"
          disabled={busy}
          aria-invalid={!!errs.message}
          className={cn(
            FIELD,
            'h-[clamp(82.5px,8.056vw,128.9px)] resize-y py-[clamp(9.9px,0.972vw,15.6px)]',
            errs.message && 'border-mojo/60'
          )}
        />
        {errs.message ? <span className={ERR}>{errs.message}</span> : null}
      </div>

      <div className="flex items-start gap-[clamp(8.5px,0.833vw,13.3px)]">
        <input
          id={`${uid}-consent`}
          name="consent"
          type="checkbox"
          disabled={busy}
          aria-invalid={!!errs.consent}
          className="mt-[3px] h-[24px] w-[24px] shrink-0 rounded-sm border border-eden/30 bg-white accent-eden"
        />
        <label
          htmlFor={`${uid}-consent`}
          className="font-kyg text-[clamp(12px,0.9375vw,15px)] font-normal leading-[1.555] text-fusc"
        >
          {FORM_COPY.consent}
        </label>
      </div>
      {errs.consent ? <span className={ERR}>{errs.consent}</span> : null}

      {state.status === 'error' && state.message ? (
        <p role="alert" className="font-kyg text-[clamp(12px,0.9375vw,15px)] leading-[1.5] text-mojo">
          {state.message}
        </p>
      ) : null}

      <div className="mt-[clamp(2.8px,0.278vw,4.4px)] flex">
        <button
          type="submit"
          disabled={busy}
          className={cn(
            BTN,
            'group/btn bg-eden font-bold text-linenw shadow-[0_4.3px_12.8px_0_rgba(14,77,75,0.18)]',
            'transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-eden2 disabled:opacity-60 motion-reduce:transition-none'
          )}
        >
          {busy ? 'Sending…' : FORM_COPY.submit}
          <Icon
            name="arrow"
            strokeWidth={2}
            className="h-[15px] w-[15px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/btn:translate-x-[3px] motion-reduce:transition-none"
          />
        </button>
      </div>
    </form>
  );
}
