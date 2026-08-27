import 'server-only';

import { prisma } from '@/server/prisma';
import { sendMail, type MailAttachment } from '@/lib/mailer';

import {
  renderKitDispatched,
  renderOrderConfirmed,
  renderReportReady,
  renderSetPassword,
  type KitDispatchedData,
  type OrderConfirmedData,
  type ReportReadyData,
  type SetPasswordData,
  type TemplateKey,
} from './templates';

/**
 * Sends a customer email and records that it happened.
 *
 * NEVER THROWS. Every caller is on a path where the email is the least important
 * thing occurring - a payment capturing, a courier being booked, a report being
 * published - and a mail server having a bad afternoon must not roll any of that
 * back. Failures are returned and recorded, not raised.
 *
 * Every send writes a Notification row whatever the outcome, because "we think
 * we told them" and "we told them" are different facts and support needs to be
 * able to tell which one applies. With SMTP unset the mailer skips and the row
 * is QUEUED, which is the honest description of a message that was composed and
 * never left the building.
 */

export interface NotifyResult {
  status: 'sent' | 'queued' | 'failed' | 'no-recipient';
  detail?: string;
}

type Payload =
  | { template: 'ORDER_CONFIRMED'; data: OrderConfirmedData }
  | { template: 'KIT_DISPATCHED'; data: KitDispatchedData }
  | { template: 'REPORT_READY'; data: ReportReadyData }
  | { template: 'SET_PASSWORD'; data: SetPasswordData };

function render(p: Payload) {
  switch (p.template) {
    case 'ORDER_CONFIRMED':
      return renderOrderConfirmed(p.data);
    case 'KIT_DISPATCHED':
      return renderKitDispatched(p.data);
    case 'REPORT_READY':
      return renderReportReady(p.data);
    case 'SET_PASSWORD':
      return renderSetPassword(p.data);
  }
}

export async function notifyCustomer(
  opts: Payload & {
    to: string | null | undefined;
    userId?: string | null;
    /** Files to send with the message. See MailInput.attachments on size. */
    attachments?: MailAttachment[];
  }
): Promise<NotifyResult> {
  if (!opts.to) {
    console.warn(`[notify] ${opts.template}: no recipient address`);
    return { status: 'no-recipient' };
  }

  let email;
  try {
    email = render(opts);
  } catch (err) {
    // A template that throws is our bug, not the customer's problem, and it must
    // not take the caller down with it.
    const detail = err instanceof Error ? err.message : String(err);
    console.error(`[notify] ${opts.template}: render failed - ${detail}`);
    return { status: 'failed', detail };
  }

  const result = await sendMail({
    to: opts.to,
    subject: email.subject,
    text: email.text,
    html: email.html,
    attachments: opts.attachments,
  });

  // The Notification row is bookkeeping, not the send. If writing it fails the
  // customer has still had their email, so this is caught too.
  try {
    await prisma.notification.create({
      data: {
        userId: opts.userId ?? null,
        channel: 'EMAIL',
        template: opts.template satisfies TemplateKey,
        to: opts.to,
        status: result.delivered ? 'SENT' : result.ok ? 'QUEUED' : 'FAILED',
        payload: {
          subject: email.subject,
          // Recorded because "we emailed them the report" and "we emailed them a
          // link to the report" are different facts, and support will be asked
          // which one happened.
          attachments: (opts.attachments ?? []).map((a) => ({ filename: a.filename, bytes: a.content.length })),
        },
        providerId: result.providerId ?? null,
        sentAt: result.delivered ? new Date() : null,
        errorMessage: result.error ?? null,
      },
    });
  } catch (err) {
    console.error(`[notify] ${opts.template}: could not record Notification`, err);
  }

  if (!result.ok) return { status: 'failed', detail: result.error };
  return { status: result.delivered ? 'sent' : 'queued' };
}
