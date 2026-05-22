/**
 * Mailer91 SMTP smoke test
 * ========================
 *
 * Sends a single test email via the Mailer91 relay to confirm credentials,
 * domain authentication (SPF/DKIM) and TLS are wired up before we start
 * pushing transactional templates (booking confirmation, kit dispatch,
 * report ready) through it.
 *
 * Credentials are read from env vars so this file is safe to commit. Set
 * them on the command line before running:
 *
 *   PowerShell:
 *     $env:SMTP_HOST="smtp.mailer91.com"
 *     $env:SMTP_PORT="587"
 *     $env:SMTP_USER="emailer@www.knowyourgenes.in"
 *     $env:SMTP_PASS="..."
 *     $env:SMTP_FROM="KYG <emailer@www.knowyourgenes.in>"
 *     $env:SMTP_TO="diwakar@digitallynext.com"
 *     pnpm tsx scripts/send-test-mail.ts
 *
 *   Bash:
 *     SMTP_HOST=smtp.mailer91.com SMTP_PORT=587 \
 *     SMTP_USER=emailer@www.knowyourgenes.in SMTP_PASS=... \
 *     SMTP_FROM='KYG <emailer@www.knowyourgenes.in>' \
 *     SMTP_TO=diwakar@digitallynext.com \
 *     pnpm tsx scripts/send-test-mail.ts
 */

import 'dotenv/config';
import nodemailer from 'nodemailer';

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing required env var: ${name}`);
    process.exit(1);
  }
  return v;
}

async function main() {
  const host = required('SMTP_HOST');
  const port = Number(required('SMTP_PORT'));
  const user = required('SMTP_USER');
  const pass = required('SMTP_PASS');
  const from = process.env.SMTP_FROM ?? user;
  const to = required('SMTP_TO');

  // 587 = STARTTLS (secure: false + requireTLS: true). 465 would be implicit
  // TLS (secure: true). Mailer91 docs recommend 587.
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
  });

  console.log(`→ Connecting to ${host}:${port} as ${user}…`);
  await transporter.verify();
  console.log('✓ SMTP connection verified.');

  const info = await transporter.sendMail({
    from,
    to,
    subject: 'KYG SMTP smoke test',
    text:
      `This is a test email from the KnowYourGenes platform.\n\n` +
      `Sent via ${host}:${port} on ${new Date().toISOString()}.\n` +
      `If you're reading this, transactional email is wired up correctly.`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0E4D4B; margin-bottom: 8px;">KYG SMTP smoke test</h2>
        <p style="color: #555;">This is a test email from the KnowYourGenes platform.</p>
        <p style="color: #555;">
          Sent via <code>${host}:${port}</code> at <strong>${new Date().toISOString()}</strong>.
        </p>
        <p style="color: #555;">
          If you're reading this, the Mailer91 relay is wired up and we can start sending booking
          confirmations, kit-dispatch notices, and report-ready emails through this transport.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">
          KnowYourGenes &middot; BFG Market Consult Pvt. Ltd.
        </p>
      </div>
    `,
  });

  console.log(`✓ Sent: messageId=${info.messageId}`);
  if (info.response) console.log(`  Response: ${info.response}`);
  if (info.accepted?.length) console.log(`  Accepted: ${info.accepted.join(', ')}`);
  if (info.rejected?.length) console.log(`  Rejected: ${info.rejected.join(', ')}`);
}

main().catch((err) => {
  console.error('✗ Failed to send:', err);
  process.exit(1);
});
