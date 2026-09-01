import { handle, isResponse, ok, requireApiRole } from '@/server/api';

/**
 * GET /api/admin/diagnostics
 *
 * What this deployment can and cannot do, read from its own live environment.
 *
 * WHY THIS EXISTS. Every integration in this app fails closed on purpose - no
 * Razorpay keys refuses checkout, no courier credentials refuses a booking, no
 * SMTP silently queues instead of sending. That is the right behaviour, and it
 * leaves one question unanswerable from outside: which of them is actually
 * configured HERE? Without that, a missing variable looks identical to a bug,
 * and the only way to tell them apart is to guess and redeploy.
 *
 * NEVER RETURNS A SECRET. Presence and length only - enough to tell "unset" from
 * "set but truncated" from "set with quotes still around it", which are the three
 * ways this actually goes wrong. The one exception is RAZORPAY_KEY_ID, which is
 * already sent to every customer's browser to open the payment modal, so its
 * prefix is not a secret and knowing whether it says rzp_test or rzp_live is
 * worth more than hiding it.
 *
 * ADMIN ONLY. Knowing which integrations are down is a map of where to push.
 *
 * REMEMBER THAT ENV IS BAKED IN AT DEPLOY TIME. These are module-level reads in
 * their own files, evaluated once per cold start, and most hosts freeze the
 * environment into a deployment. Setting a variable in a dashboard changes
 * nothing until something is redeployed - which is the commonest reason a value
 * that "is definitely set" still reads as missing here.
 */

/** Presence and shape, never content. */
function inspect(name: string): { set: boolean; length: number; looksQuoted: boolean; hasSpace: boolean } {
  const raw = process.env[name];
  const v = raw ?? '';
  return {
    set: v.length > 0,
    length: v.length,
    // A value pasted into a dashboard field WITH the quotes from a .env file.
    // It reads as set, passes every emptiness check, and then fails at the API
    // with a 401 that looks nothing like a configuration problem.
    looksQuoted: /^['"].*['"]$/.test(v),
    hasSpace: v !== v.trim(),
  };
}

export async function GET() {
  return handle(async () => {
    const guard = await requireApiRole(['ADMIN']);
    if (isResponse(guard)) return guard;

    const razorpayKeyId = process.env.RAZORPAY_KEY_ID ?? '';

    const groups = {
      payments: {
        // Both must be set or checkout refuses - see RAZORPAY_MISCONFIGURED.
        RAZORPAY_KEY_ID: inspect('RAZORPAY_KEY_ID'),
        RAZORPAY_KEY_SECRET: inspect('RAZORPAY_KEY_SECRET'),
        // Does not block checkout, but without it the webhook fails closed - and
        // the webhook is what captures a payment when the browser drops between
        // the card being charged and the confirmation landing.
        RAZORPAY_WEBHOOK_SECRET: inspect('RAZORPAY_WEBHOOK_SECRET'),
        mode: razorpayKeyId.startsWith('rzp_live') ? 'LIVE' : razorpayKeyId.startsWith('rzp_test') ? 'TEST' : 'UNKNOWN',
      },
      email: {
        SMTP_HOST: inspect('SMTP_HOST'),
        SMTP_PORT: inspect('SMTP_PORT'),
        SMTP_USER: inspect('SMTP_USER'),
        SMTP_PASS: inspect('SMTP_PASS'),
        EMAIL_FROM: inspect('EMAIL_FROM'),
      },
      storage: {
        STORAGE_ENDPOINT: inspect('STORAGE_ENDPOINT'),
        STORAGE_BUCKET: inspect('STORAGE_BUCKET'),
        STORAGE_REGION: inspect('STORAGE_REGION'),
        STORAGE_ACCESS_KEY_ID: inspect('STORAGE_ACCESS_KEY_ID'),
        STORAGE_SECRET_KEY: inspect('STORAGE_SECRET_KEY'),
      },
      courier: {
        COURIER_PROVIDER: inspect('COURIER_PROVIDER'),
        SHIPROCKET_EMAIL: inspect('SHIPROCKET_EMAIL'),
        SHIPROCKET_PASSWORD: inspect('SHIPROCKET_PASSWORD'),
        DELHIVERY_TOKEN: inspect('DELHIVERY_TOKEN'),
        SHIPROCKET_WEBHOOK_TOKEN: inspect('SHIPROCKET_WEBHOOK_TOKEN'),
        DELHIVERY_WEBHOOK_SECRET: inspect('DELHIVERY_WEBHOOK_SECRET'),
      },
      app: {
        NODE_ENV: process.env.NODE_ENV ?? 'unset',
        NEXT_PUBLIC_APP_URL: inspect('NEXT_PUBLIC_APP_URL'),
        DATABASE_URL: inspect('DATABASE_URL'),
        NEXTAUTH_SECRET: inspect('NEXTAUTH_SECRET'),
      },
    };

    // The same conclusions the app itself reaches, so this cannot drift from
    // what the guards actually do.
    const verdicts = {
      checkoutWorks: groups.payments.RAZORPAY_KEY_ID.set && groups.payments.RAZORPAY_KEY_SECRET.set,
      webhookWorks: groups.payments.RAZORPAY_WEBHOOK_SECRET.set,
      emailSends: groups.email.SMTP_HOST.set,
      reportsUpload:
        groups.storage.STORAGE_ENDPOINT.set &&
        groups.storage.STORAGE_BUCKET.set &&
        groups.storage.STORAGE_ACCESS_KEY_ID.set &&
        groups.storage.STORAGE_SECRET_KEY.set,
      courierBooks:
        (groups.courier.SHIPROCKET_EMAIL.set && groups.courier.SHIPROCKET_PASSWORD.set) ||
        groups.courier.DELHIVERY_TOKEN.set,
    };

    const warnings: string[] = [];
    for (const [group, vars] of Object.entries(groups)) {
      for (const [name, v] of Object.entries(vars)) {
        if (typeof v !== 'object' || v === null || !('set' in v)) continue;
        if (v.looksQuoted) {
          warnings.push(`${group}.${name} still has its surrounding quotes - strip them`);
        }
        if (v.hasSpace) {
          warnings.push(`${group}.${name} has leading or trailing whitespace`);
        }
      }
    }
    if (!verdicts.checkoutWorks) {
      warnings.push(
        'Checkout will refuse every payment: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must both be set, ' +
          'and the deployment must be rebuilt after setting them.'
      );
    }

    return ok({ groups, verdicts, warnings, checkedAt: new Date().toISOString() });
  });
}
