/**
 * End-to-end smoke test of the buying journey.
 *
 *   pnpm dev            # in one terminal
 *   pnpm smoke          # in another
 *
 * Drives the REAL HTTP routes against a running server and the real database -
 * registration, NextAuth sign-in, cart pricing, address, checkout, payment
 * capture - then asserts the order landed correctly and deletes everything it
 * created. Nothing is mocked except Razorpay, which mocks itself when
 * RAZORPAY_KEY_ID is unset (see features/payments/server/razorpay.ts).
 *
 * Env:
 *   SMOKE_BASE_URL   default http://localhost:3000
 *   SMOKE_KEEP=1     keep the test user/order for inspection instead of cleaning up
 *
 * Exit code is 0 only if every step passed, so this is CI-safe.
 */
/* eslint-disable @typescript-eslint/no-explicit-any --
 * This script asserts against raw HTTP JSON from routes it deliberately does
 * not import types from - the whole point is to check the wire format the
 * browser actually receives. Type guards for every nested field would make the
 * assertions harder to read than the thing they are testing. */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const BASE = (process.env.SMOKE_BASE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const KEEP = process.env.SMOKE_KEEP === '1';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Tiny test harness. No framework: this has to run against a live server, and
// a dependency-free script is one less thing to break in CI.
// ---------------------------------------------------------------------------

let passed = 0;
const failures: string[] = [];

function check(label: string, condition: boolean, detail?: unknown) {
  if (condition) {
    passed++;
    console.log(`  \x1b[32m✓\x1b[0m ${label}`);
  } else {
    failures.push(label);
    console.log(`  \x1b[31m✗\x1b[0m ${label}`);
    if (detail !== undefined) console.log(`      ${JSON.stringify(detail)}`);
  }
}

function step(name: string) {
  console.log(`\n\x1b[1m${name}\x1b[0m`);
}

// ---------------------------------------------------------------------------
// Cookie jar - NextAuth needs the CSRF cookie and the session cookie carried
// across requests, which fetch() will not do for us.
// ---------------------------------------------------------------------------

const jar = new Map<string, string>();

function cookieHeader(): string {
  return [...jar].map(([k, v]) => `${k}=${v}`).join('; ');
}

function absorbCookies(res: Response) {
  // getSetCookie() keeps multiple Set-Cookie headers separate, which a plain
  // .get('set-cookie') would join into one unsplittable string.
  for (const raw of res.headers.getSetCookie()) {
    const [pair] = raw.split(';');
    const eq = pair!.indexOf('=');
    if (eq < 1) continue;
    const name = pair!.slice(0, eq);
    const value = pair!.slice(eq + 1);
    if (value === '' || value === 'deleted') jar.delete(name);
    else jar.set(name, value);
  }
}

async function api(
  path: string,
  init: RequestInit & { form?: Record<string, string>; json?: unknown } = {}
): Promise<{ status: number; body: any }> {
  const headers: Record<string, string> = { ...(init.headers as Record<string, string>) };
  const cookies = cookieHeader();
  if (cookies) headers.Cookie = cookies;

  let body: string | undefined;
  if (init.json !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(init.json);
  } else if (init.form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    body = new URLSearchParams(init.form).toString();
  }

  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    body,
    redirect: 'manual', // NextAuth answers sign-in with a 302 we must not follow
  });
  absorbCookies(res);

  const text = await res.text();
  let parsed: any = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    /* HTML or empty - keep the raw text */
  }
  return { status: res.status, body: parsed };
}

// ---------------------------------------------------------------------------

const stamp = Date.now();
const user = {
  name: 'Smoke Test',
  email: `smoke+${stamp}@knowyourgenes.test`,
  // Last 10 digits of a timestamp - unique, and never a real Indian mobile.
  phone: `9${String(stamp).slice(-9)}`,
  password: 'SmokeTest123',
};

let userId = '';
let orderId = '';
let orderNumber = '';
let addressId = '';

async function main() {
  console.log(`\x1b[1mKYG smoke test\x1b[0m  →  ${BASE}\n${'─'.repeat(48)}`);

  // ---- 0. server is up ---------------------------------------------------
  step('0. Server reachable');
  try {
    const res = await fetch(`${BASE}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines: [] }),
    });
    check('POST /api/cart answers', res.ok, { status: res.status });
  } catch (err) {
    console.error(
      `\n\x1b[31mCannot reach ${BASE}.\x1b[0m Start the dev server first:\n  pnpm dev\n\n${(err as Error).message}`
    );
    process.exit(1);
  }

  // ---- 1. catalogue ------------------------------------------------------
  step('1. Catalogue is priced');
  const catalogue = await prisma.package.findMany({
    where: { active: true, slug: { in: ['sleep', 'skin-health'] } },
    select: { slug: true, price: true, stockQuantity: true, kitShippingFee: true },
    orderBy: { slug: 'asc' },
  });
  check('sleep + skin-health exist and are active', catalogue.length === 2, catalogue);
  if (catalogue.length !== 2) throw new Error('Run `pnpm db:seed:catalog` first');
  const [skin, sleep] = catalogue; // alphabetical: skin-health, sleep
  check('both have a price', skin!.price > 0 && sleep!.price > 0);
  const stockBefore = { sleep: sleep!.stockQuantity, skin: skin!.stockQuantity };

  // ---- 2. cart pricing (anonymous) --------------------------------------
  step('2. Cart prices without an account');
  const lines = [
    { slug: 'sleep', quantity: 2 },
    { slug: 'skin-health', quantity: 1 },
  ];
  const priced = await api('/api/cart', { method: 'POST', json: { lines } });
  check('200 OK', priced.status === 200, priced.body);
  const cart = priced.body?.data;
  const expectedSubtotal = sleep!.price * 2 + skin!.price;
  check('subtotal = 2×sleep + 1×skin', cart?.subtotal === expectedSubtotal, {
    got: cart?.subtotal,
    want: expectedSubtotal,
  });
  check(
    'shipping charged once, not per line',
    cart?.shipping === Math.max(sleep!.kitShippingFee, skin!.kitShippingFee),
    {
      got: cart?.shipping,
    }
  );
  check('total = subtotal + shipping', cart?.total === expectedSubtotal + cart?.shipping);
  check('itemCount counts quantities', cart?.itemCount === 3, { got: cart?.itemCount });
  check('posted kits need no collection slot', cart?.requiresSlot === false);

  // ---- 2b. the funnel ----------------------------------------------------
  // Browse -> test page -> kit page with that report pre-ticked. The kit itself
  // must never be sellable: it is the vehicle, not a SKU.
  step('2b. Test page hands over to the kit page');
  const testPage = await api('/categories/wellness/sleep');
  const handoff = '/pr/genetic-testing-kit?select=sleep';
  check(
    'test page CTAs point at the kit page with the report pre-ticked',
    typeof testPage.body === 'string' && testPage.body.includes(handoff.replace('?', '?')),
    { looked_for: handoff }
  );
  check(
    'no CTA still dead-ends on the #kit anchor',
    typeof testPage.body === 'string' && !testPage.body.includes('href="#kit"')
  );

  const kitPage = await api('/pr/genetic-testing-kit?select=sleep');
  check('kit page renders', kitPage.status === 200, { status: kitPage.status });
  check('kit page lists reports to tick', typeof kitPage.body === 'string' && kitPage.body.includes('Sleep DNA'));

  const kitAsProduct = await prisma.package.findFirst({
    where: { slug: 'genetic-testing-kit' },
    select: { active: true },
  });
  check('the kit is not itself sellable', kitAsProduct?.active === false, kitAsProduct);

  const kitInCart = await api('/api/cart', {
    method: 'POST',
    json: { lines: [{ slug: 'genetic-testing-kit', quantity: 1 }] },
  });
  check('cart refuses the kit as a line item', kitInCart.body?.data?.rejected?.length === 1, kitInCart.body?.data);

  // ---- 3. checkout is gated ---------------------------------------------
  step('3. Checkout refuses anonymous callers');
  const anon = await api('/api/checkout', { method: 'POST', json: { lines, addressId: 'x' } });
  check('401 without a session', anon.status === 401, { status: anon.status });

  // ---- 4. register + sign in --------------------------------------------
  step('4. Register and sign in');
  const reg = await api('/api/auth/register', { method: 'POST', json: user });
  check('201 Created', reg.status === 201, reg.body);
  userId = reg.body?.user?.id ?? '';
  check('user id returned', Boolean(userId));

  const csrf = await api('/api/auth/csrf');
  const csrfToken = csrf.body?.csrfToken ?? '';
  check('CSRF token issued', Boolean(csrfToken));

  await api('/api/auth/callback/credentials', {
    method: 'POST',
    form: { csrfToken, identifier: user.email, password: user.password, redirect: 'false', json: 'true' },
  });
  const session = await api('/api/auth/session');
  check('session established', session.body?.user?.email === user.email, session.body);

  // ---- 5. address --------------------------------------------------------
  step('5. Save a delivery address');
  const addr = await api('/api/addresses', {
    method: 'POST',
    json: {
      fullName: 'Smoke Test',
      phone: '9876543210',
      line1: '221B Baker Street',
      area: 'Hauz Khas',
      city: 'New Delhi',
      pincode: '110016',
    },
  });
  check('201 Created', addr.status === 201, addr.body);
  addressId = addr.body?.data?.id ?? '';
  check('first address is the default', addr.body?.data?.isDefault === true);

  const addrList = await api('/api/addresses');
  check(
    'address is listed back',
    addrList.body?.data?.some((a: any) => a.id === addressId)
  );

  // ---- 6. checkout -------------------------------------------------------
  step('6. Create the order');
  const checkout = await api('/api/checkout', { method: 'POST', json: { lines, addressId } });
  check('200 OK', checkout.status === 200, checkout.body);
  const co = checkout.body?.data;
  orderId = co?.orderId ?? '';
  orderNumber = co?.orderNumber ?? '';
  check('order number looks like KYG-YYYY-NNNNNN', /^KYG-\d{4}-\d{6}$/.test(orderNumber), orderNumber);
  check('server total matches the cart total', co?.total === cart?.total, { order: co?.total, cart: cart?.total });
  check('razorpay order minted', Boolean(co?.razorpay?.orderId));
  check('running against mock Razorpay', co?.razorpay?.mock === true);

  const booked = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true, payments: true } });
  check(
    '2 line items persisted',
    booked?.items.length === 2,
    booked?.items.map((i) => i.slugSnapshot)
  );
  check('line snapshots carry the price paid', booked?.items.every((i) => i.unitPrice > 0 && i.lineTotal > 0) ?? false);
  check('status BOOKED, not yet paid', booked?.status === 'BOOKED' && booked?.paidAt === null);
  check('payment row is PENDING', booked?.payments[0]?.status === 'PENDING');
  check('no slot stored for a posted kit', booked?.slotDate === null && booked?.slotWindow === null);

  // ---- 7. tampering ------------------------------------------------------
  step('7. Server re-prices rather than trusting the client');

  // 7a. Absurd quantity never even reaches pricing - the schema caps it.
  const absurd = await api('/api/checkout', {
    method: 'POST',
    json: { lines: [{ slug: 'sleep', quantity: 999 }], addressId },
  });
  check('422 for a quantity past the per-line cap', absurd.status === 422, { status: absurd.status });

  // 7b. The real guard: a quantity that is valid but no longer in stock must
  // NOT quietly bill for fewer kits. Squeeze stock to 1 and ask for 2.
  const eye = await prisma.package.findFirstOrThrow({ where: { slug: 'eye-health' } });
  await prisma.package.update({ where: { id: eye.id }, data: { stockQuantity: 1 } });
  try {
    const overstock = await api('/api/checkout', {
      method: 'POST',
      json: { lines: [{ slug: 'eye-health', quantity: 2 }], addressId },
    });
    check('409 when stock cannot honour the cart as sent', overstock.status === 409, {
      status: overstock.status,
      error: overstock.body?.error,
    });
    check('corrected cart handed back', Boolean(overstock.body?.cart));
    check('correction explains itself', overstock.body?.cart?.adjusted?.[0]?.to === 1, overstock.body?.cart?.adjusted);

    const strays = await prisma.order.count({ where: { userId, orderNumber: { not: orderNumber } } });
    check('no order was created by the refused attempt', strays === 0, { strays });
  } finally {
    await prisma.package.update({ where: { id: eye.id }, data: { stockQuantity: eye.stockQuantity } });
  }

  // ---- 8. pay ------------------------------------------------------------
  step('8. Pay and verify');
  const verify = await api('/api/checkout/verify', {
    method: 'POST',
    json: {
      orderId,
      razorpayOrderId: co.razorpay.orderId,
      razorpayPaymentId: `pay_SMOKE${stamp.toString().slice(-10)}`,
      razorpaySignature: 'smoke_signature',
    },
  });
  check('200 OK', verify.status === 200, verify.body);

  const paid = await prisma.order.findUnique({ where: { id: orderId }, include: { payments: true, events: true } });
  check('order marked paid', paid?.paidAt !== null);
  check('payment CAPTURED', paid?.payments.some((p) => p.status === 'CAPTURED') ?? false);
  check('capture event recorded', paid?.events.some((e) => e.label.includes('Payment captured')) ?? false);

  const after = await prisma.package.findMany({
    where: { slug: { in: ['sleep', 'skin-health'] } },
    select: { slug: true, stockQuantity: true },
  });
  const sleepAfter = after.find((p) => p.slug === 'sleep')!.stockQuantity;
  const skinAfter = after.find((p) => p.slug === 'skin-health')!.stockQuantity;
  check(
    'stock decremented by quantity ordered',
    sleepAfter === stockBefore.sleep - 2 && skinAfter === stockBefore.skin - 1,
    {
      sleep: `${stockBefore.sleep} → ${sleepAfter}`,
      skin: `${stockBefore.skin} → ${skinAfter}`,
    }
  );

  // ---- 9. idempotency ----------------------------------------------------
  step('9. Double capture is a no-op');
  const replay = await api('/api/checkout/verify', {
    method: 'POST',
    json: {
      orderId,
      razorpayOrderId: co.razorpay.orderId,
      razorpayPaymentId: `pay_SMOKE${stamp.toString().slice(-10)}`,
      razorpaySignature: 'smoke_signature',
    },
  });
  check('replay still 200', replay.status === 200, replay.body);
  check('reported as already paid', replay.body?.data?.alreadyPaid === true, replay.body?.data);

  const afterReplay = await prisma.package.findFirst({ where: { slug: 'sleep' }, select: { stockQuantity: true } });
  check('stock NOT decremented twice', afterReplay?.stockQuantity === sleepAfter, {
    got: afterReplay?.stockQuantity,
    want: sleepAfter,
  });

  // ---- 10. the customer can see it --------------------------------------
  step('10. Order is visible to its owner');
  const page = await api(`/dashboard/orders/${orderNumber}`);
  check('order detail page renders', page.status === 200, { status: page.status });
  check('page shows the order number', typeof page.body === 'string' && page.body.includes(orderNumber));
}

async function cleanup() {
  if (KEEP) {
    console.log(`\n\x1b[33mSMOKE_KEEP=1\x1b[0m - leaving ${user.email} / ${orderNumber} in the database.`);
    return;
  }
  step('Cleanup');
  try {
    if (orderId) {
      // Give the stock back so repeated runs don't drain the catalogue.
      const items = await prisma.orderItem.findMany({ where: { orderId } });
      for (const i of items) {
        await prisma.package.update({
          where: { id: i.packageId },
          data: { stockQuantity: { increment: i.quantity } },
        });
      }
      await prisma.payment.deleteMany({ where: { orderId } });
      await prisma.orderEvent.deleteMany({ where: { orderId } });
      await prisma.shipment.deleteMany({ where: { orderId } });
      await prisma.order.delete({ where: { id: orderId } }); // items cascade
    }
    if (addressId) await prisma.address.deleteMany({ where: { id: addressId } });
    if (userId) {
      await prisma.session.deleteMany({ where: { userId } });
      await prisma.account.deleteMany({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });
    }
    check('test data removed', true);
  } catch (err) {
    console.log(`  \x1b[33m!\x1b[0m cleanup incomplete: ${(err as Error).message}`);
    console.log(`      user=${userId} order=${orderNumber}`);
  }
}

main()
  .catch((err) => {
    failures.push(`fatal: ${(err as Error).message}`);
    console.error(`\n\x1b[31m${(err as Error).stack}\x1b[0m`);
  })
  .then(cleanup)
  .finally(async () => {
    await prisma.$disconnect();
    console.log(`\n${'─'.repeat(48)}`);
    if (failures.length === 0) {
      console.log(`\x1b[32m\x1b[1mPASS\x1b[0m  ${passed} checks\n`);
      process.exit(0);
    }
    console.log(`\x1b[31m\x1b[1mFAIL\x1b[0m  ${failures.length} of ${passed + failures.length} checks`);
    for (const f of failures) console.log(`  \x1b[31m✗\x1b[0m ${f}`);
    console.log('');
    process.exit(1);
  });
