/**
 * Minimal transactional-email helper.
 *
 * Wraps nodemailer behind a tiny, testable surface. SMTP is configured via env
 * (SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / SMTP_SECURE / EMAIL_FROM).
 *
 * Design goals:
 *   - NEVER throw into a caller's critical path. A failed or unconfigured
 *     mailer must not break payment capture. Callers get a result object.
 *   - Graceful no-op when SMTP is not configured: returns { ok:true,
 *     delivered:false } so the caller can log the notification as QUEUED
 *     rather than SENT, without crashing.
 *   - nodemailer is imported dynamically so builds/edge bundles that never
 *     send mail don't pull it in.
 */

export interface MailAttachment {
  filename: string;
  content: Buffer;
  contentType: string;
}

export interface MailInput {
  to: string;
  subject: string;
  text: string;
  html?: string;
  /** Optional Reply-To. Used by the contact form so replying reaches the sender
   *  rather than the no-reply From address. */
  replyTo?: string;
  /**
   * Files to attach.
   *
   * SIZE IS THE CALLER'S PROBLEM, not this module's. Providers differ - Gmail
   * refuses over 25MB, most relays cap lower, and a rejection arrives as an SMTP
   * error long after the caller has moved on. A caller attaching something it
   * did not create should check the size and decide what to do instead, rather
   * than discovering the limit in a log.
   */
  attachments?: MailAttachment[];
}

export interface MailResult {
  /** true unless an actual send was attempted and failed. */
  ok: boolean;
  /** true only when a message was handed to an SMTP server. */
  delivered: boolean;
  providerId?: string | null;
  error?: string;
  /** true when SMTP env is absent and we intentionally skipped sending. */
  skipped?: boolean;
}

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST);
}

export async function sendMail(input: MailInput): Promise<MailResult> {
  if (!isMailConfigured()) {
    // SMTP not wired up yet. Don't fail the caller - record intent upstream.
    console.warn(
      `[mailer] SMTP not configured; skipped email to "${input.to}" (subject: "${input.subject}"` +
        `${input.attachments?.length ? `, ${input.attachments.length} attachment(s)` : ''})`
    );
    return { ok: true, delivered: false, skipped: true };
  }

  try {
    const nodemailer = (await import('nodemailer')).default;
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    const info = await transport.sendMail({
      from: process.env.EMAIL_FROM ?? 'Know Your Genes <no-reply@knowyourgenes.in>',
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
      replyTo: input.replyTo,
      attachments: input.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    });
    return { ok: true, delivered: true, providerId: info.messageId ?? null };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`[mailer] send failed to "${input.to}": ${error}`);
    return { ok: false, delivered: false, error };
  }
}
