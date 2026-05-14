# Architecture

The technical reference companion to [README.md](../README.md). Read this when you need to understand how a piece of the system works, where to add new code, or why something was built a certain way.

---

## Table of contents

1. [Request lifecycle](#1-request-lifecycle)
2. [Auth and role gating](#2-auth-and-role-gating)
3. [Data model](#3-data-model)
4. [Order state machine](#4-order-state-machine)
5. [Shipment subsystem](#5-shipment-subsystem)
6. [Payments](#6-payments)
7. [Reports](#7-reports)
8. [Notifications and comms](#8-notifications-and-comms)
9. [Sanity CMS integration](#9-sanity-cms-integration)
10. [API map](#10-api-map)
11. [Frontend shells and layouts](#11-frontend-shells-and-layouts)
12. [Environment variables](#12-environment-variables)
13. [Conventions and gotchas](#13-conventions-and-gotchas)

---

## 1. Request lifecycle

There are two request paths through the stack — page routes and API routes — and they have different auth + middleware behaviour.

### Page route

```
Browser
   │
   ▼
proxy.ts (Edge middleware, runs on every page route)
   │  uses authConfig from auth.config.ts (no Prisma, no bcrypt — Edge-safe)
   │  reads the JWT session cookie, runs the `authorized` callback
   │  redirects unauthenticated users / wrong-role users to / or /login
   ▼
app/(group)/.../page.tsx  (Server Component by default)
   │  calls auth() if it needs the session
   │  calls prisma directly for DB reads
   │  renders to HTML, streams down to the browser
   ▼
Hydration in the browser. Client components inside the tree take over.
```

### API route

```
Browser / external caller
   │
   ▼
proxy.ts  →  SKIPPED (matcher excludes /api/*)
   │
   ▼
app/api/.../route.ts
   │  calls requireRole([...]) or requireAuth() at the top of the handler
   │  validates input with Zod (lib/validators.ts)
   │  runs Prisma queries
   │  returns NextResponse.json(...)
```

Why the bypass? Running the full NextAuth-on-Edge handshake on every API call costs ~150ms. API handlers re-read the JWT cookie directly via `auth()` from server-side Node code, which is much faster. Documented in [proxy.ts:6-9](../proxy.ts#L6-L9).

---

## 2. Auth and role gating

NextAuth v5 (beta) with two providers and JWT sessions.

### Providers

- **Credentials** — accepts email *or* phone as `identifier`, plus password. Defined in [auth.ts:38-70](../auth.ts#L38-L70). Email/phone discrimination via the `isEmail` helper.
- **Google OAuth** — standard `openid email profile` scopes. Defined in [auth.config.ts:8-21](../auth.config.ts#L8-L21).

### Password handling

- bcrypt with 12 salt rounds — [lib/auth-helpers.ts:11-19](../lib/auth-helpers.ts#L11-L19).
- Passwords are validated at registration time: min 8 chars, ≥1 uppercase, ≥1 digit — [lib/auth-helpers.ts:33-37](../lib/auth-helpers.ts#L33-L37).
- OAuth-only users have `passwordHash = null`. Credentials login is silently rejected for them.

### Session shape

JWT strategy. The token carries `id`, `role`, `phone`. Server components read it via `auth()` from [auth.ts](../auth.ts). Type augmentation lives in [types/](../types/).

### Role gates

Two layers:

**Layer 1 — Edge middleware** at [auth.config.ts:27-58](../auth.config.ts#L27-L58):

```ts
const gates = [
  { prefix: '/admin',     roles: ['ADMIN', 'COUNSELLOR', 'PARTNER'] },
  { prefix: '/agent',     roles: ['AGENT', 'ADMIN'] },
  { prefix: '/dashboard', roles: ['USER',  'ADMIN'] },
];
```

If the URL hits one of these prefixes and the user is not logged in → redirect to `/login`. If logged in but with the wrong role → redirect to `/`. ADMIN is allowed into every shell for impersonation/debug.

**Layer 2 — Per-handler** in API routes via `requireRole([...])` from [lib/auth-helpers.ts:95-99](../lib/auth-helpers.ts#L95-L99). Throws `'UNAUTHORIZED'` or `'FORBIDDEN'`; the route handler turns those into 401/403.

### Soft-delete

`User.deletedAt` is checked at sign-in time in [auth.ts:26-34](../auth.ts#L26-L34). Deactivated users cannot sign in via *any* provider — including Google, because the `signIn` callback runs even for OAuth.

---

## 3. Data model

The Prisma schema is at [prisma/schema.prisma](../prisma/schema.prisma). Models grouped by purpose:

```
AUTH                            CATALOG                ORDERS                       LOGISTICS
─────                           ───────                ──────                       ─────────
User                            Package                Order                        Lab    (KYG-owned facilities)
Account                                                OrderEvent                   Shipment    (per-leg row)
Session                                                Coupon                       ShipmentEvent
VerificationToken                                                                   ↳ enum: ShipmentLeg, ShipmentStatus, ShipmentCourier

ROLE PROFILES                   REPORTS                CONSULTATIONS
─────────────                   ───────                ─────────────
AgentProfile                    Report                 Consultation
AgentAvailability               ReportMarker
CounsellorProfile
LabPartner    (external labs)

PAYMENTS                        ADDRESSES              SERVICE AREA              COMMS / B2B
────────                        ─────────              ────────────              ───────────
Payment                         Address                ServiceArea               Notification
                                                       (~155K pincodes,          PartnerLead
                                                        opt-in by admin)         ContactMessage
```

### Key invariants

- **One Order = exactly zero or one Report.** Enforced by `Report.orderId @unique`.
- **One Order can have multiple Shipments.** Typically one `FORWARD` + one `REVERSE` for KIT_BY_POST. AT_HOME orders have zero shipments.
- **One User has at most one `AgentProfile` / `CounsellorProfile` / `LabPartner`** — each is keyed by `userId @id`.
- **Shipment addresses are denormalised.** [Shipment.pickup{Name,Phone,Line,…}](../prisma/schema.prisma#L475-L485) snapshot the addresses at creation time, so later edits to `Address` don't rewrite history.
- **Money is paise (integer).** Every `price`, `total`, `discount`, `value`, `kitShippingFee`, `amount` is `Int` in paise.
- **`orderNumber`, `reportNumber` are human-facing.** Format: `KYG-2026-000412`, `RPT-000412`.

### Enums you'll touch often

| Enum             | Values                                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `Role`           | `USER`, `AGENT`, `COUNSELLOR`, `PARTNER`, `ADMIN`                                                     |
| `OrderStatus`    | See [Section 4](#4-order-state-machine)                                                                |
| `FulfillmentType`| `AT_HOME_PHLEBOTOMIST`, `KIT_BY_POST`, `EITHER`                                                       |
| `ShipmentLeg`    | `FORWARD` (lab → user), `REVERSE` (user → lab)                                                       |
| `ShipmentStatus` | `CREATED → MANIFESTED → PICKUP_SCHEDULED → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED`, plus `RTO`, `CANCELLED`, `FAILED` |
| `PaymentStatus`  | `PENDING → CAPTURED`, plus `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`                                 |
| `SlotWindow`     | `MORNING` (8–12), `AFTERNOON` (12–16), `EVENING` (16–19) — relevant only to AT_HOME orders            |
| `MarkerResult`   | `LOW`, `MODERATE`, `HIGH`, `TYPICAL` — per-gene severity                                              |

---

## 4. Order state machine

`Order.status` is the source of truth. Two paths through the machine depending on `Order.fulfillmentMode`.

### KIT_BY_POST (launch model)

```
                  BOOKED
                    │
                    │  admin or auto-trigger: create FORWARD Shipment via Delhivery
                    ▼
            KIT_DISPATCHED                  ← Shipment.status = MANIFESTED, AWB issued
                    │
                    │  Delhivery webhook: forward shipment DELIVERED
                    ▼
             KIT_DELIVERED
                    │
                    │  admin or auto-trigger after grace period: create REVERSE Shipment
                    │  user scans kit barcode → registers sample → schedules pickup
                    ▼
            SAMPLE_PICKED_UP                ← REVERSE Shipment.status = PICKUP_SCHEDULED
                    │
                    │  Delhivery webhook: reverse shipment IN_TRANSIT
                    ▼
           SAMPLE_IN_TRANSIT
                    │
                    │  reverse Shipment.status = DELIVERED (sample arrived at lab)
                    ▼
                  AT_LAB
                    │
                    │  ADMIN or PARTNER uploads report PDF + interpretation
                    ▼
              REPORT_READY                  ← Report row created, emails + WhatsApp fired
                    │
                    │  (terminal)
```

### AT_HOME_PHLEBOTOMIST (Phase 2)

```
                  BOOKED
                    │
                    │  admin assigns an AGENT
                    ▼
             AGENT_ASSIGNED
                    │
                    │  agent transitions self via mobile UI
                    ▼
             AGENT_EN_ROUTE
                    │
                    │
                    ▼
            SAMPLE_COLLECTED
                    │
                    │  agent delivers sample to lab
                    ▼
                  AT_LAB → REPORT_READY (same as kit path from here)
```

### Out-of-band terminals

- `CANCELLED` — user-initiated cancellation, or admin-initiated (e.g. unservicable pincode).
- `REFUNDED` — payment refund processed.

### Where transitions live

- **Admin actions** — `app/api/admin/orders/[id]/status/route.ts`, `assign-agent/route.ts`, `shipments/route.ts`.
- **Agent actions** (phleb-only) — `app/api/agent/orders/[id]/transition/route.ts`.
- **Courier webhooks** — `app/api/webhooks/delhivery/route.ts` (and any future Shiprocket equivalent).
- **Side effects per transition** (events, notifications) — `lib/shipments.ts` and inline in each route handler.

Every transition writes an `OrderEvent` row with `label`, optional `meta` JSON, and `actorId` (the userId who triggered it). This is the audit log.

---

## 5. Shipment subsystem

Two-leg model. `Shipment` rows are created per-leg, never reused.

```
Order (KIT_BY_POST)
  │
  ├── Shipment leg=FORWARD   pickup = Lab address      drop = customer address
  │     status: CREATED → MANIFESTED → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED
  │     ShipmentEvent[] — one row per courier scan
  │
  └── Shipment leg=REVERSE   pickup = customer address  drop = Lab address
        status: CREATED → PICKUP_SCHEDULED → IN_TRANSIT → DELIVERED
        ShipmentEvent[] — one row per courier scan
```

### Why a separate `Lab` model

`Lab` is a KYG-owned facility — where kits ship *from* on the forward leg, and where samples come *back* to on the reverse leg. Distinct from `LabPartner`, which is an external lab with its own dashboard login that uploads reports.

`Lab.pickupLocationName` must match the warehouse name registered in the Delhivery portal verbatim — there's no fuzzy match server-side.

### Delhivery client

[lib/delhivery.ts](../lib/delhivery.ts) wraps the B2C surface API. Two modes:
- **Real** — when `DELHIVERY_TOKEN` is set and `DELHIVERY_MOCK !== "true"`.
- **Mock** — returns deterministic fake AWBs. Auto-enabled when the token is empty, or when you set `DELHIVERY_MOCK=true`. Lets the admin UI and seed data work without real credentials.

Higher-level domain code in [lib/shipments.ts](../lib/shipments.ts) handles "create both legs", "refresh tracking", "cancel shipment + revert order status".

### Webhook

`POST /api/webhooks/delhivery` receives push tracking events. Auth is via the `X-Delhivery-Token` header matched against `DELHIVERY_WEBHOOK_SECRET`. The handler:

1. Verifies the secret.
2. Finds the `Shipment` by AWB.
3. Maps Delhivery's scan code to `ShipmentStatus`.
4. Writes a `ShipmentEvent` row.
5. If status reached `DELIVERED`, transitions the parent `Order.status` (`KIT_DELIVERED` for FORWARD, `AT_LAB` for REVERSE).

---

## 6. Payments

### Razorpay flow

```
1. POST /api/orders/checkout                 (TBD route)
   - Server creates Razorpay order via Razorpay SDK
   - Returns razorpayOrderId, key, amount

2. Browser opens Razorpay checkout widget
   - User pays
   - Razorpay calls back to the frontend with paymentId + signature

3. Browser POSTs paymentId+signature to /api/orders/verify-payment   (TBD route)
   - Server verifies signature with RAZORPAY_KEY_SECRET
   - Updates Payment row → CAPTURED
   - Updates Order.status → BOOKED
   - Creates OrderEvent
   - Fires booking-confirmed notification

4. Razorpay also fires a server webhook
   - POST /api/webhooks/razorpay   (TBD route)
   - Idempotent — re-verifies signature and reconciles state
   - Catches the case where the browser was closed mid-redirect
```

The `Order` and `Payment` rows both carry `razorpayOrderId` / `razorpayPaymentId` for reconciliation. The `Payment.razorpaySignature` is stored so disputes can be re-verified months later if needed.

### Consultations

`Consultation` has its own Razorpay refs (`razorpayOrderId`, `razorpayPaymentId`). Same checkout flow, different success path — books a calendar slot with a counsellor instead of dispatching a kit.

### Refunds

Initiated from the admin order page. The handler calls Razorpay's refund endpoint, updates `Payment.status` to `REFUNDED` or `PARTIALLY_REFUNDED`, sets `Order.status = REFUNDED` (if full), and writes an `OrderEvent`.

---

## 7. Reports

Reports are private PDFs stored in Cloudflare R2 and served via short-lived presigned URLs.

### Upload flow

1. Lab partner or admin uploads PDF via `/admin/reports` → `POST /api/admin/reports/upload`.
2. Server stores the PDF in R2 with key `reports/<orderNumber>/<reportNumber>.pdf`.
3. Server creates the `Report` row with `pdfKey` pointing at that R2 object.
4. Server can optionally accept structured marker data and create `ReportMarker[]` rows.
5. Counsellor (if any) reviews and signs off — sets `Report.reviewedById` and optionally `counsellorNotes`.
6. Admin clicks "Deliver" — sets `Report.deliveredAt`, transitions `Order.status → REPORT_READY`, fires email + WhatsApp notifications.

### Download flow

`GET /api/admin/reports/[id]/download` and the equivalent user-side endpoint generate a presigned R2 URL with a TTL of ~5 minutes, and redirect the browser to it. The PDF is never publicly cacheable.

### Why R2

Cheaper than S3, no egress fees, same S3 SDK. The R2 client is set up in [lib/r2.ts](../lib/r2.ts).

---

## 8. Notifications and comms

`Notification` is an append-only outbound comms log. Every WhatsApp / SMS / email we send writes a row.

### Channels

- **Email** — SendGrid or AWS SES, configured via `SENDGRID_API_KEY` and `EMAIL_FROM`.
- **WhatsApp** — Business API via Gupshup or Wati (`WHATSAPP_API_URL` + `WHATSAPP_API_KEY`).
- **SMS** — same WhatsApp provider, typically.

### Templates

`Notification.template` is a string key like `BOOKING_CONFIRMED`, `KIT_DISPATCHED`, `REPORT_READY`. Each template maps to a provider-specific body (WhatsApp HSM template ID, or an inline email body).

### Delivery tracking

`Notification.status` goes `QUEUED → SENT → DELIVERED → READ` (where `READ` is only available on WhatsApp). Provider IDs (`providerId`) are stored for tracing.

---

## 9. Sanity CMS integration

Sanity hosts blog content **only**. All structured business data (packages, orders, users, reports) lives in Postgres.

- **Schemas** — [sanity/schemas/](../sanity/schemas/): `blogPost`, `author`.
- **Studio** — embedded at `/studio`. Sign in with your Sanity account (separate from KYG auth).
- **Client** — [lib/sanity.ts](../lib/sanity.ts) — `next-sanity` client + image URL builder.
- **Public blog routes** — `/blog`, `/blog/[slug]` fetch from Sanity at request time.

Required env: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, optionally `SANITY_API_READ_TOKEN` for drafts.

---

## 10. API map

All API routes live under `/api/`. Auth checked per-handler.

### Auth

```
POST   /api/auth/register
ALL    /api/auth/[...nextauth]          NextAuth's catch-all
```

### Location helpers (public, used by checkout + address form)

```
GET    /api/location/autosuggest
GET    /api/location/geocode
GET    /api/location/resolve            reverse geocode (lat/lng → address)
GET    /api/location/serviceability     check if pincode accepts orders
```

### User dashboard (role: USER)

```
(TBD — userside routes for orders, reports, etc. live as server-component
calls inside app/(site)/dashboard/* rather than as API routes)
```

### Agent (role: AGENT, Phase 2)

```
GET    /api/agent/me
GET    /api/agent/orders
GET    /api/agent/orders/[id]
POST   /api/agent/orders/[id]/transition
GET    /api/agent/availability
POST   /api/agent/availability
GET    /api/agent/profile
PATCH  /api/agent/profile
```

### Admin (role: ADMIN, some COUNSELLOR / PARTNER)

```
GET / PATCH   /api/admin/orders[/:id]
POST          /api/admin/orders/[id]/assign-agent
POST          /api/admin/orders/[id]/status
POST          /api/admin/orders/[id]/shipments

CRUD          /api/admin/users
POST          /api/admin/users/[id]/role
POST          /api/admin/users/[id]/status

CRUD          /api/admin/agents
CRUD          /api/admin/counsellors
CRUD          /api/admin/partners
CRUD          /api/admin/packages
CRUD          /api/admin/coupons
CRUD          /api/admin/labs

GET           /api/admin/shipments
GET           /api/admin/shipments/[id]
POST          /api/admin/shipments/[id]/refresh
POST          /api/admin/shipments/[id]/cancel

GET           /api/admin/reports
POST          /api/admin/reports/upload
GET / PATCH   /api/admin/reports/[id]
GET           /api/admin/reports/[id]/download

GET           /api/admin/service-area
GET           /api/admin/service-area/stats
POST          /api/admin/service-area/bulk-toggle
PATCH         /api/admin/service-area/[pincode]
```

### Webhooks

```
POST   /api/webhooks/delhivery          X-Delhivery-Token verified
POST   /api/webhooks/razorpay           (TBD)
```

### OpenAPI

```
GET    /api/openapi.json                machine-readable spec
```

---

## 11. Frontend shells and layouts

Four route groups, each with its own layout:

| Route group     | Layout                                                       | Audience              |
| --------------- | ------------------------------------------------------------ | --------------------- |
| `app/(site)/`   | [SiteLayout](../app/(site)/layout.tsx) — SiteHeader + SiteFooter | Public + logged-in USER |
| `app/admin/`    | Admin shell with role-filtered sidebar                       | ADMIN, COUNSELLOR, PARTNER |
| `app/agent/`    | Mobile-first agent shell                                     | AGENT (Phase 2)       |
| `app/studio/`   | Sanity Studio                                                | Content editors       |

Auth pages (`/login`, `/signup`, `/forgot-password`) sit outside the `(site)` group and have no header/footer.

### Why route groups

Next.js route groups `(group)/` let you scope a layout to a subset of pages without affecting the URL. `app/(site)/about/page.tsx` resolves to `/about`, not `/site/about`.

---

## 12. Environment variables

Every required + optional env var is documented inline in [.env.example](../.env.example). Summary table:

| Var                        | Required for                                  | Notes                                                              |
| -------------------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| `DATABASE_URL`             | Everything                                    | Postgres connection string                                         |
| `AUTH_SECRET`              | NextAuth                                      | `openssl rand -base64 32`                                          |
| `AUTH_URL`                 | Production only                               | Canonical URL, e.g. `https://kyg.in`                               |
| `AUTH_GOOGLE_ID`           | Google login                                  | from Google Cloud Console                                          |
| `AUTH_GOOGLE_SECRET`       | Google login                                  | from Google Cloud Console                                          |
| `NEXT_PUBLIC_SANITY_*`     | Blog                                          | Sanity project ID, dataset, API version                            |
| `SANITY_API_READ_TOKEN`    | Optional, drafts                              | Server-only token for fetching draft documents                     |
| `RAZORPAY_KEY_ID`          | Checkout                                      | from Razorpay dashboard                                            |
| `RAZORPAY_KEY_SECRET`      | Checkout                                      | from Razorpay dashboard                                            |
| `RAZORPAY_WEBHOOK_SECRET`  | Razorpay webhook                              | configured during webhook setup                                    |
| `R2_ACCOUNT_ID`            | Report storage                                | Cloudflare account id (not bucket id)                              |
| `R2_ACCESS_KEY_ID`         | Report storage                                | from Cloudflare R2 API tokens page                                 |
| `R2_SECRET_ACCESS_KEY`     | Report storage                                | from Cloudflare R2 API tokens page                                 |
| `R2_BUCKET`                | Report storage                                | default `kyg-reports`                                              |
| `SENDGRID_API_KEY`         | Email                                         | or use SES                                                         |
| `EMAIL_FROM`               | Email                                         | `KYG <care@kyg.in>`                                                |
| `WHATSAPP_API_URL`         | WhatsApp                                      | Gupshup or Wati endpoint                                           |
| `WHATSAPP_API_KEY`         | WhatsApp                                      |                                                                    |
| `WHATSAPP_SOURCE_NUMBER`   | WhatsApp                                      | Sender number                                                      |
| `MAPPLS_API_KEY`           | Address autosuggest + reverse geocode         | from apisetu.mappls.com                                            |
| `DELHIVERY_BASE_URL`       | Courier                                       | staging: `https://staging-express.delhivery.com`                   |
| `DELHIVERY_TOKEN`          | Courier                                       | from Delhivery dashboard                                           |
| `DELHIVERY_PICKUP_LOCATION`| Courier (fallback)                            | per-lab names override this — set on `Lab.pickupLocationName`      |
| `DELHIVERY_WEBHOOK_SECRET` | Courier webhook                               | shared secret with Delhivery support                               |
| `DELHIVERY_MOCK`           | Dev mode                                      | `true` to short-circuit all courier calls with fake responses      |

---

## 13. Conventions and gotchas

- **Money is paise.** Schema integers, helper-only conversion at the rendering edge.
- **Phone normalisation** before any DB lookup. Helper at [auth.ts:16](../auth.ts#L16).
- **API auth is per-handler.** Don't rely on the proxy — it's bypassed for `/api/*`.
- **`/admin` is shared.** Filter the sidebar by role; don't create new shells.
- **Soft-delete users** via `deletedAt`. The signIn callback in [auth.ts](../auth.ts) blocks them everywhere.
- **Shipments snapshot addresses.** Editing `Address` after a shipment is created does not retro-rewrite the shipment.
- **`DELHIVERY_MOCK=true` is the dev default.** Set to `false` only with real credentials.
- **Order numbers are human-facing.** Format `KYG-2026-000412`. Generated server-side; do not collide.
- **Use Zod at every input boundary.** Body validators live in [lib/validators.ts](../lib/validators.ts).
- **Don't import from `app/`** into `lib/` or `components/`. Imports flow `app → components → lib`, never up.
- **Cloudflare CDN is in front.** Setting `Cache-Control` on a page route hits Cloudflare too. Default to no-cache on dynamic pages.
- **Next.js 16 / React 19 has breaking changes** from earlier versions. When in doubt, consult `node_modules/next/dist/docs/` rather than memory. Per [AGENTS.md](../AGENTS.md).
- **After `prisma migrate dev` you MUST clear `.next/`.** Turbopack caches compiled server chunks that hold the *previous* Prisma client shape. A bare `pnpm dev` restart isn't enough — the cached chunks survive. Recipe:
  ```powershell
  # After any schema change:
  pnpm db:generate
  Remove-Item -Recurse -Force .next   # delete the stale compiled chunks
  pnpm dev
  ```
  Symptom if you skip the cache clear: `Cannot read properties of undefined (reading '<modelName>')` at runtime, even though typecheck passes.
