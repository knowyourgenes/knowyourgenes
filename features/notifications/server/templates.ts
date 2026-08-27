import 'server-only';

/**
 * Customer-facing transactional email bodies.
 *
 * PLAIN TEXT FIRST, HTML SECOND. Every template returns both, because a
 * genetic-testing receipt that arrives as an unreadable blob in a text-only
 * client is worse than a plain one. The HTML is deliberately table-free and
 * inline-styled: this has to survive Gmail, Outlook and every Indian webmail
 * client without a build step.
 *
 * NOTHING SENSITIVE IN A SUBJECT LINE. Subjects appear on lock screens and in
 * notification shades, so they carry an order number at most - never a package
 * name, never a finding. `REPORT_READY` says a report is ready and makes the
 * customer sign in to read what it says.
 */

const BRAND = 'Know Your Genes';
const INK = '#14181C';
const MUTED = '#4A545E';
const TEAL = '#0E7C6B';

export type TemplateKey = 'ORDER_CONFIRMED' | 'KIT_DISPATCHED' | 'REPORT_READY' | 'SET_PASSWORD';

export interface RenderedEmail {
  subject: string;
  text: string;
  html: string;
}

function appUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.knowyourgenes.in').replace(/\/$/, '');
  return `${base}${path}`;
}

function rupees(paise: number): string {
  return '₹' + Math.floor(paise / 100).toLocaleString('en-IN');
}

/** Shared chrome. Keeps every message recognisably one sender. */
function shell(headline: string, bodyHtml: string, cta?: { label: string; href: string }): string {
  return `<div style="margin:0;padding:24px 16px;background:#F7F7F8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E3E6E9;border-radius:6px;padding:32px 28px;">
    <div style="font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${TEAL};margin-bottom:18px;">${BRAND}</div>
    <h1 style="margin:0 0 16px;font-size:22px;line-height:1.25;color:${INK};font-weight:700;">${headline}</h1>
    <div style="font-size:15px;line-height:1.6;color:${MUTED};">${bodyHtml}</div>
    ${
      cta
        ? `<div style="margin-top:26px;"><a href="${cta.href}" style="display:inline-block;background:${TEAL};color:#FFFFFF;text-decoration:none;font-size:14px;font-weight:700;padding:12px 22px;border-radius:6px;">${cta.label}</a></div>`
        : ''
    }
    <hr style="border:0;border-top:1px solid #E3E6E9;margin:28px 0 16px;" />
    <div style="font-size:12px;line-height:1.55;color:#77828C;">
      Questions? Reply to this email or write to
      <a href="mailto:care@knowyourgenes.in" style="color:${TEAL};">care@knowyourgenes.in</a>.
    </div>
  </div>
</div>`;
}

export interface OrderConfirmedData {
  orderNumber: string;
  customerName: string | null;
  items: { name: string; quantity: number }[];
  total: number;
  byPost: boolean;
}

export interface KitDispatchedData {
  orderNumber: string;
  customerName: string | null;
  courier: string;
  awb: string | null;
}

export interface ReportReadyData {
  orderNumber: string;
  customerName: string | null;
  reportNumber: string;
}

export interface SetPasswordData {
  customerName: string | null;
  link: string;
  expiresInHours: number;
}

const hello = (name: string | null) => (name ? `Hi ${name.split(' ')[0]},` : 'Hi,');

export function renderOrderConfirmed(d: OrderConfirmedData): RenderedEmail {
  const list = d.items.map((i) => `- ${i.name}`).join('\n');
  const next = d.byPost
    ? 'Your saliva collection kit will be posted to the address you gave us. We will email you the tracking details the moment it is dispatched.'
    : 'A trained phlebotomist will visit you in the slot you chose. We will confirm the details shortly.';

  return {
    subject: `Order ${d.orderNumber} confirmed`,
    text: `${hello(d.customerName)}

Thank you - your payment has gone through and order ${d.orderNumber} is confirmed.

What you ordered:
${list}

Total paid: ${rupees(d.total)}

${next}

You can follow your order here: ${appUrl('/dashboard/orders')}

- ${BRAND}`,
    html: shell(
      `Order ${d.orderNumber} is confirmed`,
      `<p style="margin:0 0 14px;">${hello(d.customerName)}</p>
       <p style="margin:0 0 14px;">Thank you — your payment has gone through.</p>
       <p style="margin:0 0 6px;font-weight:600;color:${INK};">What you ordered</p>
       <ul style="margin:0 0 14px;padding-left:20px;">${d.items.map((i) => `<li>${i.name}</li>`).join('')}</ul>
       <p style="margin:0 0 14px;"><strong style="color:${INK};">Total paid: ${rupees(d.total)}</strong></p>
       <p style="margin:0;">${next}</p>`,
      { label: 'Track your order', href: appUrl('/dashboard/orders') }
    ),
  };
}

export function renderKitDispatched(d: KitDispatchedData): RenderedEmail {
  const tracking = d.awb
    ? `Courier: ${d.courier}\nTracking number: ${d.awb}`
    : `Courier: ${d.courier}. We will add the tracking number shortly.`;

  return {
    subject: `Your kit for ${d.orderNumber} is on its way`,
    text: `${hello(d.customerName)}

Your collection kit for order ${d.orderNumber} has been handed to the courier.

${tracking}

When it arrives, follow the instructions in the box, then use the prepaid return
label to send your sample back. Nothing else is needed from you until then.

Follow your order: ${appUrl('/dashboard/orders')}

- ${BRAND}`,
    html: shell(
      'Your kit is on its way',
      `<p style="margin:0 0 14px;">${hello(d.customerName)}</p>
       <p style="margin:0 0 14px;">Your collection kit for order <strong style="color:${INK};">${d.orderNumber}</strong> has been handed to the courier.</p>
       <p style="margin:0 0 14px;">Courier: <strong style="color:${INK};">${d.courier}</strong>${
         d.awb ? `<br />Tracking number: <strong style="color:${INK};">${d.awb}</strong>` : ''
       }</p>
       <p style="margin:0;">When it arrives, follow the instructions in the box, then use the prepaid return label to send your sample back. Nothing else is needed from you until then.</p>`,
      { label: 'Follow your order', href: appUrl('/dashboard/orders') }
    ),
  };
}

export function renderReportReady(d: ReportReadyData): RenderedEmail {
  // Deliberately says nothing about what the report contains. Findings are read
  // signed in, not in an inbox someone else might be looking at.
  return {
    subject: `Your report for ${d.orderNumber} is ready`,
    text: `${hello(d.customerName)}

Your report (${d.reportNumber}) for order ${d.orderNumber} is ready.

For your privacy we do not put results in email. Sign in to read it:
${appUrl('/dashboard/reports')}

If anything in it raises a question, our genetic counsellors are there to talk
it through - there is a link to book a call on the report page.

- ${BRAND}`,
    html: shell(
      'Your report is ready',
      `<p style="margin:0 0 14px;">${hello(d.customerName)}</p>
       <p style="margin:0 0 14px;">Your report (<strong style="color:${INK};">${d.reportNumber}</strong>) for order ${d.orderNumber} is ready.</p>
       <p style="margin:0 0 14px;">For your privacy we do not put results in email — sign in to read it.</p>
       <p style="margin:0;">If anything in it raises a question, our genetic counsellors are there to talk it through. There is a link to book a call on the report page.</p>`,
      { label: 'Read your report', href: appUrl('/dashboard/reports') }
    ),
  };
}

export function renderSetPassword(d: SetPasswordData): RenderedEmail {
  return {
    subject: 'Set your Know Your Genes password',
    text: `${hello(d.customerName)}

Use this link to set a password for your ${BRAND} account:

${d.link}

The link works once and expires in ${d.expiresInHours} hours.

If you did not ask for this, you can ignore this email - nothing has changed on
your account.

- ${BRAND}`,
    html: shell(
      'Set your password',
      `<p style="margin:0 0 14px;">${hello(d.customerName)}</p>
       <p style="margin:0 0 14px;">Use the button below to set a password for your ${BRAND} account.</p>
       <p style="margin:0 0 14px;">The link works once and expires in ${d.expiresInHours} hours.</p>
       <p style="margin:0;">If you did not ask for this, you can ignore this email — nothing has changed on your account.</p>`,
      { label: 'Set my password', href: d.link }
    ),
  };
}
