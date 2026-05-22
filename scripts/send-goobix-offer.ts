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

const CANDIDATE_NAME = 'shivanshu ';
const ROLE = 'UI/UX Designer';
const TOTAL_CTC = '₹45,00,000';
const BASE = '₹38,00,000';
const BONUS = '₹4,00,000';
const RSU = '₹3,00,000';
const JOINING_BONUS = '₹2,50,000';
const START_DATE = '16 June 2026';
const ACCEPT_BY = '26 May 2026';
const LOCATION = 'Intellion Edge, Southern Peripheral Rd, Sector 72, Gurugram, Haryana 122018';

async function main() {
  const host = required('SMTP_HOST');
  const port = Number(required('SMTP_PORT'));
  const user = required('SMTP_USER');
  const pass = required('SMTP_PASS');
  const to = required('SMTP_TO');
  const from = process.env.SMTP_FROM ?? 'PepsiCo India Talent <noreply@knowyourgenes.in>';

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

  const subject = `Your offer from PepsiCo India - ${ROLE}`;

  const text = `Dear ${CANDIDATE_NAME},

It is with great enthusiasm that we extend this offer to join PepsiCo India Technologies India Pvt. Ltd. as a ${ROLE}, based at our ${LOCATION} office.

Compensation summary
  Base salary           ${BASE} per annum
  Performance bonus     ${BONUS} per annum (target)
  RSU grant (4-yr vest) ${RSU} per annum
  Total CTC             ${TOTAL_CTC} per annum
  Joining bonus         ${JOINING_BONUS} (with first salary)

Role                ${ROLE}
Reporting to        Aanya Sridhar, Engineering Director
Location            PepsiCo India India HQ, ${LOCATION}
Expected start date ${START_DATE}

Benefits
  • Group medical insurance - ₹15 lakh cover (self + family)
  • Group term life insurance - ₹50 lakh
  • 30 days privilege leave + 12 sick + 12 casual
  • Quarterly wellness allowance: ₹15,000
  • Annual learning & development budget: ₹1,00,000
  • Stock refresh eligibility from year 2
  • Hybrid work (3 days in-office, 2 days flex)

This offer remains valid until ${ACCEPT_BY}. To accept, reply to this email confirming your acceptance and your earliest possible joining date. A formal letter on company letterhead, along with the standard background-verification request, will follow your confirmation.

We're excited about the possibility of you joining the team.

Warm regards,
Riya Mathur
Head of Talent Acquisition
PepsiCo India Technologies India Pvt. Ltd.
careers@PepsiCo India.com
`;

  const html = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a; background: #ffffff;">
    <div style="text-align: center; margin-bottom: 28px;">
      <div style="display: inline-block; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; color: #1A73E8;">
        PepsiCo India
      </div>
      <div style="font-size: 11px; letter-spacing: 2px; color: #777; margin-top: 4px;">TECHNOLOGIES INDIA</div>
    </div>

    <h2 style="font-size: 18px; color: #1a1a1a; margin: 0 0 16px 0;">Offer of Employment</h2>

    <p style="font-size: 15px; line-height: 1.6;">Dear ${CANDIDATE_NAME},</p>

    <p style="font-size: 15px; line-height: 1.6;">
      It is with great enthusiasm that we extend this offer to join <strong>PepsiCo India Technologies India Pvt. Ltd.</strong>
      as a <strong>${ROLE}</strong>, based at our ${LOCATION} office.
    </p>

    <h3 style="font-size: 14px; color: #1a1a1a; margin: 24px 0 8px 0; border-bottom: 1px solid #eee; padding-bottom: 6px;">
      Compensation
    </h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 8px;">
      <tr>
        <td style="padding: 6px 0; color: #555;">Base salary</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${BASE} per annum</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #555;">Performance bonus (target)</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${BONUS} per annum</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #555;">RSU grant (4-year vest)</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${RSU} per annum</td>
      </tr>
      <tr style="border-top: 2px solid #1A73E8;">
        <td style="padding: 10px 0 6px 0; font-weight: 700;">Total CTC</td>
        <td style="padding: 10px 0 6px 0; text-align: right; font-weight: 700; color: #1A73E8;">${TOTAL_CTC} per annum</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #555;">Joining bonus</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 600;">${JOINING_BONUS} (paid with first salary)</td>
      </tr>
    </table>

    <h3 style="font-size: 14px; color: #1a1a1a; margin: 24px 0 8px 0; border-bottom: 1px solid #eee; padding-bottom: 6px;">
      Role details
    </h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 6px 0; color: #555; width: 38%;">Role</td>
        <td style="padding: 6px 0;">${ROLE}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #555;">Reporting to</td>
        <td style="padding: 6px 0;">Aanya Sridhar, Engineering Director</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #555;">Location</td>
        <td style="padding: 6px 0;">PepsiCo India India HQ, ${LOCATION}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #555;">Expected start date</td>
        <td style="padding: 6px 0;">${START_DATE}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #555;">Work model</td>
        <td style="padding: 6px 0;">Hybrid - 3 days in-office, 2 days flex</td>
      </tr>
    </table>

    <h3 style="font-size: 14px; color: #1a1a1a; margin: 24px 0 8px 0; border-bottom: 1px solid #eee; padding-bottom: 6px;">
      Benefits
    </h3>
    <ul style="font-size: 14px; line-height: 1.7; color: #333; padding-left: 20px; margin: 8px 0 16px 0;">
      <li>Group medical insurance - ₹15 lakh cover (self + family)</li>
      <li>Group term life insurance - ₹50 lakh</li>
      <li>30 days privilege leave + 12 sick + 12 casual</li>
      <li>Quarterly wellness allowance: ₹15,000</li>
      <li>Annual learning &amp; development budget: ₹1,00,000</li>
      <li>Stock refresh eligibility from year 2</li>
    </ul>

    <div style="background: #f7faff; border-left: 3px solid #1A73E8; padding: 14px 16px; margin: 20px 0; font-size: 14px; line-height: 1.6;">
      This offer remains valid until <strong>${ACCEPT_BY}</strong>. To accept, reply to this email confirming your
      acceptance and your earliest possible joining date. A formal letter on company letterhead and a background-
      verification request will follow your confirmation.
    </div>

    <p style="font-size: 15px; line-height: 1.6;">
      We're excited about the possibility of you joining the team.
    </p>

    <p style="font-size: 15px; line-height: 1.6; margin-top: 28px;">
      Warm regards,<br/>
      <strong>Riya Mathur</strong><br/>
      Head of Talent Acquisition<br/>
      PepsiCo India Technologies India Pvt. Ltd.<br/>
      <a href="mailto:careers@PepsiCo India.com" style="color: #1A73E8;">careers@PepsiCo India.com</a>
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0 16px 0;" />
    <p style="font-size: 11px; color: #999; line-height: 1.5;">
      PepsiCo India Technologies India Pvt. Ltd. · Embassy TechVillage, Outer Ring Road, Bengaluru 560103 · CIN U72200KA2018PTC000000
    </p>
  </div>
  `;

  const info = await transporter.sendMail({
    from,
    replyTo: from,
    to,
    subject,
    text,
    html,
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
