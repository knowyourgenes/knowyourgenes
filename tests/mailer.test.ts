import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import { sendMail, isMailConfigured } from '@/lib/mailer';

const saved = process.env.SMTP_HOST;
afterEach(() => {
  if (saved === undefined) delete process.env.SMTP_HOST;
  else process.env.SMTP_HOST = saved;
});

describe('mailer', () => {
  beforeEach(() => {
    delete process.env.SMTP_HOST;
  });

  it('reports not-configured when SMTP_HOST is absent', () => {
    expect(isMailConfigured()).toBe(false);
  });

  it('no-ops gracefully (ok:true, delivered:false, skipped) with no SMTP config', async () => {
    const res = await sendMail({ to: 'lab@example.com', subject: 'hi', text: 'body' });
    expect(res.ok).toBe(true);
    expect(res.delivered).toBe(false);
    expect(res.skipped).toBe(true);
  });
});
