# Operational runbooks

How to do specific ops tasks. Each runbook is self-contained.

---

## R1 — First-time DB setup

```powershell
pnpm install
cp .env.example .env             # fill DATABASE_URL + AUTH_SECRET at minimum
pnpm db:generate                  # generate Prisma client
pnpm prisma migrate deploy        # apply all committed migrations
pnpm db:seed                      # demo packages, users, coupon
pnpm db:seed-pincodes             # ~155K India pincodes (~30s)
```

After this you have:
- A working admin login (see seed output for credentials).
- A demo package catalog.
- ~19K unique pincodes (154K area rows), all `active=false`.

To open service area for orders:
- Tree view: `/admin/service-area` → toggle a state or district.
- Or bulk activate Delhi NCR: `pnpm tsx scripts/activate-delhi-ncr.ts`.

---

## R2 — Switching courier provider

The codebase supports two couriers behind one interface ([lib/courier.ts](../lib/courier.ts)). Switch with one env var:

```bash
COURIER_PROVIDER=shiprocket   # multi-courier aggregator (default at launch)
# or
COURIER_PROVIDER=delhivery    # direct integration (switch when volume justifies KAM rates)
```

Existing shipments keep their original courier on the `Shipment.courier` column, so tracking refreshes/cancels still hit the right vendor after a switch.

### Shiprocket onboarding checklist

1. Create account at https://www.shiprocket.in
2. Complete KYC (PAN of BFG Market Consult, GST, CIN, cancelled cheque, signatory Aadhaar/PAN).
3. Add a pickup address. **Nickname must match `Lab.pickupLocationName` in our DB** (e.g. `KYG-LAB-DELHI`).
4. Create an API user (don't use personal login). Put email/password into `.env`:
   ```
   SHIPROCKET_EMAIL=api@kyg.in
   SHIPROCKET_PASSWORD=...
   SHIPROCKET_PICKUP_LOCATION=KYG-LAB-DELHI
   SHIPROCKET_CHANNEL_ID=<numeric from Settings → API → Channels>
   SHIPROCKET_MOCK=false
   ```
5. Configure webhook: Settings → API → Webhooks → URL `https://kyg.in/api/webhooks/shiprocket`, set `SHIPROCKET_WEBHOOK_TOKEN`.

### Delhivery onboarding checklist

1. Get API token from Delhivery dashboard (Settings → API).
2. Register your warehouse — the "client warehouse name" must match `Lab.pickupLocationName`.
3. Set webhook URL with Delhivery support; use `DELHIVERY_WEBHOOK_SECRET` for header `X-Delhivery-Token`.

Both providers have `*_MOCK=true` defaults that return deterministic fake responses so the order flow is testable end-to-end without live credentials.

---

## R3 — Activating service area in bulk

### Single-click presets

- `pnpm tsx scripts/activate-delhi-ncr.ts` — turns on the official 4-state NCR boundary (Delhi + 14 Haryana + 8 UP + 2 Rajasthan districts).
- Build your own by copying the script and editing `TARGETS`.

### From the admin UI

- `/admin/service-area` → **Browse by region** tab.
- Search a state or district, hit the **Switch** on the row. Confirmation shows row count before commit.

### From an admin script

```ts
await prisma.serviceArea.updateMany({
  where: { state: 'Karnataka', district: 'Bangalore' },
  data: { active: true },
});
```

The next time admin loads `/admin/service-area`, hit **Refresh** in the page header to clear the client-side `sessionStorage` cache and pick up the change.

---

## R4 — Re-seeding pincodes

Run after dropping in an updated India_pincodes.csv from data.gov.in:

```powershell
pnpm db:seed-pincodes resource/<new-file>.csv
```

The seeder is idempotent — composite `(pincode, area)` uniqueness means existing rows keep their `active` flag, only NEW (pincode, area) pairs are inserted.

### Diagnostics

```powershell
pnpm tsx scripts/diagnose-pincode-counts.ts   # CSV vs DB reconcile
pnpm tsx scripts/show-skipped-rows.ts         # show rows the seeder dropped (bad pin, empty area, intra-CSV dupes)
```

---

## R5 — Adding a new package

Two paths:

1. **One-off**: `/admin/packages` → **Add package**. Fill the form. `slug` becomes the URL.
2. **Bulk import / programmatic**: write a one-shot script using `prisma.package.upsert({ where: { slug }, ... })`.

Required fields: slug, name, category, tagline, description, price (paise), sampleType, biomarkerCount. `kitShippingFee` is paise — added to total for `KIT_BY_POST` orders. `fulfillmentType` controls which path the customer can take.

---

## R6 — Issuing a refund

Razorpay refunds are initiated from the Razorpay dashboard. The `refund.processed` webhook will fire `/api/webhooks/razorpay`, which flips the Payment row to `REFUNDED` or `PARTIALLY_REFUNDED`, and the Order to `REFUNDED` if the refund is full.

Manual recovery if the webhook never fires:
```ts
await prisma.payment.update({ where: { id }, data: { status: 'REFUNDED' } });
await prisma.order.update({ where: { id }, data: { status: 'REFUNDED', events: { create: { label: 'Manual refund mark' } } } });
```

---

## R7 — Uploading a customer report

`/admin/reports` → **Upload report** → pick the order, drag the PDF.

The PDF goes to Cloudflare R2 under `reports/<orderId>/<reportNumber>.pdf`. Customers see it via the `/dashboard/reports` page, which calls `/api/admin/reports/[id]/download` to mint a short-lived presigned URL — the bucket is never publicly readable.

---

## R8 — Rotating secrets

When a secret is leaked (committed to git, posted in chat, etc.), rotate in this order:

| Secret                       | Where to rotate                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `AUTH_SECRET`                | `openssl rand -base64 32` — note this invalidates all sessions + signed cookies.  |
| `DATABASE_URL` password      | Aiven console → Users → reset password.                                           |
| `AUTH_GOOGLE_SECRET`         | Google Cloud console → Credentials → regenerate.                                  |
| `RAZORPAY_KEY_SECRET`        | Razorpay dashboard → Settings → API Keys.                                         |
| `RAZORPAY_WEBHOOK_SECRET`    | Razorpay dashboard → Webhooks → regenerate.                                       |
| `SHIPROCKET_PASSWORD`        | Shiprocket dashboard → Profile → password reset (for the API user).               |
| `DELHIVERY_TOKEN`            | Delhivery dashboard → Settings → API.                                             |
| `MAPPLS_API_KEY`             | Mappls console → Cloud → app → regenerate static key.                             |
| `R2_*` credentials            | Cloudflare R2 → API Tokens → revoke + recreate.                                   |

After rotating `AUTH_SECRET`:
- All `kyg_attr` signed cookies become invalid (users will be re-bucketed as direct/none on next landing — same as new visitors).
- All NextAuth JWT sessions invalidate; users must sign in again.

---

## R9 — Performance regressions

If the admin UI gets sluggish or a route times out:

```powershell
pnpm tsx scripts/perf-baseline.ts
```

This times every heavy query against the live DB. Compare numbers to [docs/PERFORMANCE.md](./PERFORMANCE.md). If a number ballooned, run `EXPLAIN ANALYZE` on the underlying SQL — most regressions are missing indexes after a schema change.

---

## R10 — Hard-resetting the client cache

The admin page caches stats + tree + area rows + flat list pages in `sessionStorage` for 5 minutes (stale-while-revalidate). If you change data via DB direct or script and want the admin UI to immediately reflect it, click the **Refresh** button (top right of `/admin/service-area`). That wipes the `kyg:cache:sa:*` namespace and re-fetches everything.

Programmatic equivalent: `sessionStorage` is per-tab, so open a new tab.
