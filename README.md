# Know Your Genes

Direct-to-consumer DNA testing. The customer buys a sample-collection kit on kyg.in, we courier it to their address, they collect a saliva or buccal swab at home, we arrange a reverse pickup, the sample is processed at our NABL-accredited partner lab, and the report is delivered to the customer's account and email.

Optional pre-test and post-test counselling with a qualified genetic counsellor is offered through the same platform.

```
Brand            Know Your Genes (KYG)
Operating entity BFG Market Consult Private Limited (CIN U74999DL2010PTC207582)
Domain           kyg.in
Launch model     KIT_BY_POST — kit shipped to customer, reverse-picked to lab
Future model     AT_HOME_PHLEBOTOMIST — supported in code, Phase 2
Service area     India-wide for kit shipping (limited by Delhivery serviceability)
                 Delhi NCR for phlebotomist visits (when that rolls out)
```

> **This is not a vanilla Next.js project.** See [AGENTS.md](./AGENTS.md). Runs on Next.js 16 / React 19 / Tailwind v4 with Turbopack. Routing and rendering conventions may differ from earlier majors — check `node_modules/next/dist/docs/` before assuming.

## Documentation

| Document                                         | What's in it                                                                |
| ------------------------------------------------ | --------------------------------------------------------------------------- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)     | Deep technical reference. Modules, request lifecycle, state machines, gotchas. |
| [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md) | Step-by-step from current state to live, with priorities and owners.    |
| [AGENTS.md](AGENTS.md)                           | Project-wide guardrail for AI-assisted edits.                              |

For business / spec context: [resource/](resource/) holds the Phase 1 spec, feature list, dev calendar, user journey, sitemap, and the legal-page source-of-truth drafts.

## Tech stack at a glance

| Layer            | Choice                                                                              |
| ---------------- | ----------------------------------------------------------------------------------- |
| Framework        | Next.js 16 (App Router, React 19, Turbopack dev)                                    |
| Styling          | Tailwind v4 + shadcn-style primitives in [components/ui/](components/ui)            |
| Auth             | NextAuth v5 (beta) — Credentials (email/phone + password) + Google OAuth, JWT       |
| DB               | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`)                                      |
| CMS              | Sanity v5 — blog content only, embedded at `/studio`                                |
| Payments         | Razorpay (order create + signature verify + webhook)                                |
| File storage     | Cloudflare R2 (S3-compatible) for private report PDFs, served via presigned URLs    |
| Courier          | Delhivery B2C surface API — forward kit + reverse sample pickup                     |
| Geo              | Mappls (MapMyIndia) for reverse geocoding, autosuggest, pincode serviceability      |
| Comms            | SendGrid / SES email, WhatsApp Business API (Gupshup or Wati)                       |
| Hosting          | VPS + Cloudflare as free CDN/proxy (Workers explicitly rejected — see memory note)  |

## Order lifecycle (kit-by-post, current launch model)

```
                       BOOKED                          customer pays
                          │
                  KIT_DISPATCHED                       courier handed forward shipment
                          │
                   KIT_DELIVERED                       customer receives kit
                          │
                  SAMPLE_PICKED_UP                     reverse pickup completed
                          │
                  SAMPLE_IN_TRANSIT                    sample en route to lab
                          │
                        AT_LAB                         lab receives, processes
                          │
                    REPORT_READY                       PDF in dashboard + email
                          │
                      (terminal)

  Out-of-band terminals: CANCELLED, REFUNDED
```

The phlebotomist path (`BOOKED → AGENT_ASSIGNED → AGENT_EN_ROUTE → SAMPLE_COLLECTED → AT_LAB → REPORT_READY`) is also implemented and gated behind `Order.fulfillmentMode = AT_HOME_PHLEBOTOMIST`. Off by default at launch.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full state machine and who triggers each transition.

## Roles (five, but only three are active at launch)

| Role         | Active at launch? | What they do                                                                                   |
| ------------ | ----------------- | ---------------------------------------------------------------------------------------------- |
| `USER`       | Yes               | Buy kits, track shipments, view reports, book counselling.                                     |
| `ADMIN`      | Yes               | Operations — orders, shipments, reports upload, users, packages, coupons, service area, labs.  |
| `COUNSELLOR` | Yes               | Reviews reports, holds counselling sessions. Uses the `/admin` shell with filtered sidebar.    |
| `PARTNER`    | Phase 2           | External lab login. Schema and shell are ready; not seeded at launch.                          |
| `AGENT`      | Phase 2           | Phlebotomist. Mobile-first `/agent` shell exists; not staffed at launch.                       |

Role gating is enforced in two places:
- Edge middleware in [proxy.ts](proxy.ts) + [auth.config.ts](auth.config.ts) for page routes.
- Per-handler `requireRole([...])` in API routes — see [lib/auth-helpers.ts](lib/auth-helpers.ts).

## Quick start

```powershell
pnpm install
cp .env.example .env                  # then fill in the real values

pnpm db:generate                      # generate Prisma client
pnpm db:migrate                       # run migrations
pnpm db:seed-pincodes                 # one-time pincode import (~30 sec, ~155K rows)
pnpm db:seed                          # demo packages, users, orders

pnpm dev                              # http://localhost:3000
```

Required services for full functionality are documented in `.env.example` (every key has a comment explaining what breaks without it). For local development, `DELHIVERY_MOCK=true` (the default) lets the shipping flow run without a courier account.

## Folder structure

```
app/
  (site)/              Public marketing + commerce shell. Header + footer.
                       Includes the five Razorpay-required legal pages.
  admin/               Admin / counsellor / partner shell. Sidebar filters by role.
  agent/               Agent (phlebotomist) shell. Mobile-first. Phase 2.
  api/                 Route handlers — see docs/ARCHITECTURE.md for the full map.
  login/, signup/, forgot-password/
  studio/[[...tool]]/  Embedded Sanity Studio.
  layout.tsx           Root HTML, fonts, providers.

auth.ts                NextAuth full config (DB-backed).
auth.config.ts         Edge-safe config used by proxy.ts.
proxy.ts               Edge middleware — page-route auth gates.

prisma/
  schema.prisma        ~25 models. See docs/ARCHITECTURE.md for the model map.
  migrations/          Generated, committed.
  seed.ts              Demo packages, users, orders.
  seed-pincodes.ts     One-time pincode import.

lib/                   Shared server-side code: prisma client, auth helpers,
                       Delhivery client, R2 client, Mappls client, etc.
components/            Site, admin, agent, and shared UI primitives.
sanity/                Blog schemas + Sanity client setup.
resource/              Internal docs — Phase 1 spec, dev calendar, legal drafts.
docs/                  Architecture and launch documentation.
public/                Static assets.
```

## Quick conventions

- **Money is in paise.** Every monetary integer (price, total, discount, kitShippingFee, etc.) is paise. `₹1 = 100`. Convert only at the rendering edge.
- **Phone numbers are normalised** to 10-digit Indian format (strips non-digits, strips leading `91`). Always normalise before any DB lookup — helper in [auth.ts:16](auth.ts#L16).
- **API handlers do their own auth.** The proxy is bypassed for `/api/*` for performance. Every API route must call `requireRole([...])` or `requireAuth()`.
- **`/admin` is shared.** Counsellor and partner views are the same shell with a filtered sidebar — don't create separate `/counsellor` or `/partner` shells.
- **Soft-delete users.** `User.deletedAt` blocks sign-in via all providers (Credentials and Google).
- **Shipments snapshot addresses.** Editing `Address` after a shipment is created does not retro-rewrite pickup/drop on the shipment.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#conventions-and-gotchas) for the full list.

## Hosting

VPS + Cloudflare CDN/proxy. Cloudflare Workers was evaluated and rejected — Prisma needs raw TCP, Sanity Studio doesn't run on Workers, NextAuth v5 is beta with edge caveats, and the bundle blows past Workers' free-tier limits. Full rationale in [resource/vps-rationale.txt](resource/vps-rationale.txt).

## Status

See [docs/LAUNCH_CHECKLIST.md](docs/LAUNCH_CHECKLIST.md) for what's done, what's pending, and the path to going live.
