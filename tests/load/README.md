# Lab-notification test & booking load harness

This folder covers the two things asked for:

1. **Does the lab get informed when a test is booked?** - now **yes** (it was a
   gap; see "What changed"). Proven by `tests/lab-notify.test.ts` (run `pnpm test`).
2. **How much booking traffic can it handle?** - a load harness + a code-level
   bottleneck analysis (below). The harness was **authored here but not executed
   in the dev sandbox** (no Postgres/Docker/k6 available). Commands to run it
   yourself are below.

---

## What changed (the fix)

Before: booking a test created only `Order` / `Payment` / `OrderEvent` rows.
No lab was ever emailed, no webhook fired, and `Order.labId` / `Order.partnerId`
were never set. Lab notification simply didn't exist.

Now, on **paid** booking (both `/api/checkout/verify` and the authoritative
`/api/webhooks/razorpay`), `linkLabAndNotify()` runs:

- resolves the default active lab,
- **atomically** links it onto the order (`updateMany` guarded on `labId: null`,
  so the verify path and the webhook can't double-send),
- emails the lab (`lib/mailer.ts`; a safe no-op until SMTP env is set),
- writes a `Notification` comms-log row + an `OrderEvent`.

It **never throws** into the payment path - money is already captured, so a
missing lab or SMTP failure is logged, not fatal.

Files: `lib/mailer.ts`, `features/lab/server/lab-notify.ts`, `features/lab/index.ts`,
and the two capture routes.

To actually send email, set: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`,
`SMTP_SECURE`, `EMAIL_FROM`.

---

## Run the functional tests (no DB needed)

```bash
pnpm test          # vitest: 10 tests, Prisma + mailer mocked
```

---

## Run the booking load test (needs a local Postgres)

**Never** point this at the shared/prod Aiven DB - the harness refuses non-local
`DATABASE_URL` unless `LOADTEST_ALLOW_REMOTE=1`.

```bash
# 1) throwaway Postgres (in-memory, auto-wiped)
docker compose -f tests/load/docker-compose.yml up -d

# 2) schema + seed into it
export DATABASE_URL=postgresql://kyg:kyg@localhost:5433/kyg_load
pnpm prisma migrate deploy      # or: pnpm db:push
pnpm db:seed                    # creates packages + the "Neotech" lab

# 3) run - sweep concurrency to find the ceiling
LOAD_CONCURRENCY=10 LOAD_DURATION_SEC=20 node tests/load/booking-load.mjs
LOAD_CONCURRENCY=25 LOAD_DURATION_SEC=20 node tests/load/booking-load.mjs
LOAD_CONCURRENCY=50 LOAD_DURATION_SEC=20 node tests/load/booking-load.mjs

# 4) teardown
docker compose -f tests/load/docker-compose.yml down
```

Output is JSON: `throughputPerSec`, `errorRatePct`, latency `p50/p90/p95/p99/max`,
and **`duplicateOrderNumbers`** (see bottleneck #1). Raise concurrency until
throughput plateaus and p99 climbs - that knee is your booking ceiling on that
DB tier.

### Full-stack HTTP variant (optional, needs k6 + a running app + a session cookie)

`checkout.k6.js` hits the real `/api/checkout`. Because auth is a next-auth **JWT**
session, supply a real `authjs.session-token` cookie from a logged-in browser and
a valid `PACKAGE_ID` / `ADDRESS_ID`. Run the app with Razorpay keys unset so it
stays in `RAZORPAY_MOCK` mode. See the header of that file.

---

## Bottleneck analysis (from the code - what will break first under load)

1. **`nextOrderNumber()` is a race** - `features/orders/server/orders.ts:14`.
   It does `SELECT count(*)` then builds `KYG-YYYY-NNNNNN`. Two concurrent
   bookings read the same count and mint the **same order number**; the insert
   then collides on the `@unique` constraint (or worse, both succeed if the
   window differs). The code itself flags this: \*"if we hit concurrent inserts

   > 10/sec we'll need a Postgres sequence."\* The harness surfaces it as
   > `duplicateOrderNumbers`. **Fix:** a Postgres `SEQUENCE`/identity or an
   > advisory lock. This is the hard ceiling on booking throughput today.

2. **Sequential awaits per booking** - checkout does several round-trips
   (package + address lookup, coupon, campaign resolve, order+payment insert,
   then a second txn for the Razorpay id). Each is a separate DB round-trip;
   latency is dominated by round-trip count × network RTT to the DB. The
   Aiven-hosted DB adds real RTT vs. a co-located DB.

3. **Connection-pool limits** - `PrismaPg` over `pg` defaults to a small pool.
   Under high concurrency, requests queue on connections; you'll see p99 climb
   sharply once VUs exceed the pool size. Tune the pool and Postgres
   `max_connections` together.

4. **Synchronous lab email in the capture path** - `linkLabAndNotify` awaits the
   SMTP send inside `/verify` and the webhook. A slow SMTP server adds latency to
   payment confirmation. It's resilient (never throws) but for scale this should
   move to a queue/outbox. (Mitigation already in place: it's outside the DB
   transaction and best-effort.)

5. **No idempotency key on `/api/checkout`** - a double-submit creates two orders
   (verify/webhook are idempotent on _payment_, but the create is not). Under
   retries/load this inflates order volume.

Priority: **#1 first** (correctness under concurrency), then #3 (pool sizing),
then #4 (async the email) for latency.
