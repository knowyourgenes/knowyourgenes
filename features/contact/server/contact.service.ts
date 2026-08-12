import 'server-only';

import { prisma } from '@/server/prisma';
import { sendMail, isMailConfigured } from '@/lib/mailer';
import { siteConfig } from '@/lib/site-config';
import type { ContactInput } from '../schemas/contact.schema';

/**
 * Contact-form intake.
 *
 * Ordering matters here: the database write is the SOURCE OF TRUTH and happens
 * first. Email is only a notification, and `sendMail` deliberately no-ops when
 * SMTP is unconfigured (returns { delivered:false, skipped:true }).
 *
 * If we mailed first — or treated a mail failure as an error — a message would
 * be silently lost every time SMTP is down or unset. As it stands, the row is
 * already committed before we try to notify anyone, so nothing can go missing:
 * worst case the team reads it from the ContactMessage table.
 */

/** Where team notifications go. Falls back to the address published on the legal pages. */
const TEAM_INBOX = process.env.CONTACT_INBOX ?? 'care@knowyourgenes.in';

export interface ContactResult {
  id: string;
  /** true only when an SMTP server actually accepted the notification. */
  notified: boolean;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function submitContactMessage(input: ContactInput): Promise<ContactResult> {
  const { name, email, phone, topic, message } = input;

  // 1. Persist first — this is what makes the submission durable.
  const row = await prisma.contactMessage.create({
    data: { name, email, phone: phone ?? null, topic, message },
    select: { id: true, createdAt: true },
  });

  // 2. Notify the team. Best-effort: never rethrow into the request.
  let notified = false;
  try {
    const lines = [
      `New contact message via ${siteConfig.siteUrl}/contact`,
      '',
      `Name:    ${name}`,
      `Email:   ${email}`,
      `Phone:   ${phone ?? '—'}`,
      `Topic:   ${topic}`,
      `Ref:     ${row.id}`,
      '',
      'Message:',
      message,
    ];
    const res = await sendMail({
      to: TEAM_INBOX,
      subject: `[Contact] ${topic} — ${name}`,
      text: lines.join('\n'),
      html:
        `<p><strong>New contact message</strong></p>` +
        `<p><strong>Name:</strong> ${escapeHtml(name)}<br/>` +
        `<strong>Email:</strong> ${escapeHtml(email)}<br/>` +
        `<strong>Phone:</strong> ${escapeHtml(phone ?? '—')}<br/>` +
        `<strong>Topic:</strong> ${escapeHtml(topic)}<br/>` +
        `<strong>Ref:</strong> ${row.id}</p>` +
        `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      // Lets the team hit Reply and land in the sender's inbox.
      replyTo: email,
    });
    notified = res.delivered;
    if (!res.delivered && !isMailConfigured()) {
      console.warn(`[contact] stored ${row.id} but SMTP is unconfigured — no notification sent`);
    }
  } catch (err) {
    // Swallow: the message is already safely stored.
    console.error('[contact] notification failed for', row.id, err);
  }

  return { id: row.id, notified };
}
