# Website Calendar

Status snapshot + week-by-week plan from "Figma design lands" to public launch.

> **Note on stack.** The WEM line item says "Website on Shopify", but the build is **Next.js 16 / React 19 / Prisma / Postgres** - the Shopify plan was superseded earlier. This calendar tracks the Next.js delivery. If a Shopify rebuild is genuinely required, this calendar is void and the work would restart from zero.

Today: **2026-05-15**. Figma ETA: *TBD - fill in once known.*

Status legend: ✅ done · 🔶 in progress · ⬜ pending · ⛔ blocked · 🎨 needs Figma

---

## 1. Snapshot - what's already done

### Foundation
| Area | Status | Notes |
|---|---|---|
| Next.js 16 + React 19 + Tailwind v4 scaffolding | ✅ | Turbopack dev, App Router |
| Prisma schema (~25 models) | ✅ | 10 migrations committed |
| Postgres on Aiven | ✅ | 154,463 ServiceArea rows seeded |
| NextAuth v5 (Credentials + Google OAuth) | ✅ | JWT sessions, role gates |
| Five-role system (USER / ADMIN / COUNSELLOR / PARTNER / AGENT) | ✅ | Edge middleware + per-route guards |
| File storage (Cloudflare R2) | ✅ | Client wired, bucket pending |
| Email / WhatsApp client stubs | 🔶 | Code in place, provider creds pending |

### Customer-facing site
| Area | Status | Notes |
|---|---|---|
| Site shell (header / footer / layout) | ✅ | Brand-vs-entity disclosure landed |
| Login / Signup / Forgot password | ✅ | With clean `?from=` callback (no ugly URL encoding) |
| Open-redirect guard on login | ✅ | |
| Legal pages - privacy, terms, refunds, shipping, consent | ✅ | All five rewritten for KIT_BY_POST |
| Home page | 🎨 | Needs Figma - hero copy still references phlebotomist |
| About us | 🎨 | Draft in `resource/legal_about_us.txt`, route not built |
| Contact us | 🎨 | Draft in `resource/legal_contact_us.txt`, route not built |
| Package listing page | 🎨 | Needs Figma |
| Package detail page | 🎨 | Needs Figma |
| Cart / checkout UI | 🎨 | API ready, UI needs Figma |
| Customer dashboard (orders / reports / profile) | 🎨 | Routes exist with placeholder UI; need Figma |
| Blog (Sanity-driven) | ⬜ | Sanity Studio mounted at `/studio`, blog routes not built |

### Admin panel
| Area | Status | Notes |
|---|---|---|
| Admin shell (sidebar / role filter / layout) | ✅ | |
| Orders list + detail | ✅ | Empty until checkout produces real orders |
| Shipments list + create/cancel/refresh | ✅ | Through Shiprocket OR Delhivery |
| Packages CRUD | ✅ | |
| Coupons CRUD | ✅ | |
| Users / roles management | ✅ | |
| Agents / counsellors / partners CRUD | ✅ | |
| Labs CRUD | ✅ | KYG-owned warehouses for courier pickup |
| Reports upload + PDF presigned download | ✅ | Wired to R2 |
| Campaigns (UTM link builder) | ✅ | |
| Attribution dashboard | ✅ | 4 queries parallelised |
| Service area (browse-by-region + flat list) | ✅ | Hierarchical tree, lazy-loaded areas, cache layer, optimistic updates |

### Integrations
| Integration | Status | Notes |
|---|---|---|
| Razorpay - checkout, verify, webhook | ✅ | Mock mode auto-enables when keys are empty; live keys pending KYC |
| Shiprocket - JWT auth, create order, AWB assign, pickup, track, cancel | ✅ | Account created, KYC pending |
| Delhivery - full client (forward, reverse, track, cancel) | ✅ | Account not opened (Shiprocket-first launch) |
| Courier abstraction (provider switch via `COURIER_PROVIDER` env) | ✅ | Per-shipment courier stamped on row |
| Mappls reverse-geocode + autosuggest | ✅ | API key needs IP whitelist for prod |
| Cloudflare R2 for report PDFs | ✅ (client) | Bucket not created |
| UTM / attribution cookie (HMAC, 30-day) | ✅ | First-touch model; click-id derivation; multi-platform referrer rules |
| AttributionVisit table + beacon (client-side) | ✅ | Records every UTM landing, not just conversions |
| Sanity CMS for blog | ✅ (Studio) | Consumer-side fetch wrapper exists but unused until blog page lands |

### Performance & infrastructure
| Item | Status |
|---|---|
| Service-area stats endpoint optimised (1.1 s → 140 ms) | ✅ |
| Service-area tree optimised (155 ms → 110 ms) | ✅ |
| Pincode search optimised (601 ms → 51 ms via pg_trgm GIN + smart query shape) | ✅ |
| Attribution dashboard parallelised (sum → max of 4 queries) | ✅ |
| Client-side `sessionStorage` cache with stale-while-revalidate | ✅ |
| In-flight request dedupe + optimistic updates | ✅ |
| Index inventory documented | ✅ ([PERFORMANCE.md](PERFORMANCE.md)) |

### Documentation
| Document | Status |
|---|---|
| README.md | ✅ |
| docs/ARCHITECTURE.md | ✅ |
| docs/API.md | ✅ (new) |
| docs/RUNBOOKS.md | ✅ (new) |
| docs/PERFORMANCE.md | ✅ (new) |
| docs/LAUNCH_CHECKLIST.md | ✅ |
| docs/REPORTS_REQUIRED.md | ✅ |
| docs/REQUIRED_FROM_MANAGEMENT.md | ✅ |

---

## 2. What's pending (and why)

### Blocked on Figma
- Home page hero + sections
- Packages list + detail visual treatment
- Cart + checkout UI
- Customer dashboard pages (visuals only; data layer ready)
- About + contact page layouts
- Blog template
- Email templates (basic HTML at minimum)
- WhatsApp message templates (text - but tone/CTA needs design lead's voice)

### Not blocked on Figma - can move in parallel
- Razorpay live KYC submission → live keys
- Shiprocket KYC verification → live AWB generation
- Mappls API key IP whitelist for prod server
- Cloudflare R2 bucket creation
- SendGrid/SES sender domain verification (`kyg.in`)
- WhatsApp Business Profile + template approval (Gupshup or Wati)
- VPS provisioning, nginx/caddy, deploy pipeline
- DNS - Cloudflare nameservers + records
- Complementary domains (.com, .net, .co.in, kyglabs.in etc.) - register + redirect to kyg.in
- Analytics - GA4 property, GTM container, server-side tag (optional)
- Sentry / error monitoring on the Next.js process

### Phase-2 (post-launch)
- Agent (phlebotomist) shell - already coded, off by default
- Lab partner shell - already coded, no partners onboarded
- Blog routes + Sanity content
- Refer-a-friend / store credit
- Re-analysis flow (re-run report on existing sample after new science)

---

## 3. Week-by-week - assuming Figma lands at week 0

| Week | Theme | Deliverables | Owner |
|---|---|---|---|
| **W0 - Figma arrives** | Kickoff | Designer walks devs through every screen. Identify components vs page-specific. Estimate component count. | D + Designer |
| **W0** | Parallel ops track | Razorpay KYC submitted · Shiprocket KYC submitted · Mappls IP whitelist requested · SendGrid sender verification started · R2 bucket created · GA4 + GTM properties created | D |
| **W1** | UI primitives | Translate Figma tokens → Tailwind theme. Build/refresh button, card, badge, input, dialog, select, switch, tabs primitives to match Figma. | Dev |
| **W1** | Marketing pages | Home page + About + Contact rewritten to Figma. Hero CTA wired to `/packages`. Trust strip / press logos / FAQ blocks. | Dev |
| **W2** | Packages | Packages list (filter by category) + package detail (FAQ, biomarkers, sample type, price/compare-at). Both server components. | Dev |
| **W2** | Analytics | GA4 + GTM live on prod with consent banner. Server-side attribution already in place. Conversion event `purchase` fires on `/checkout/verify` success. | Dev |
| **W3** | Checkout UI | Cart drawer → checkout form (address, slot, coupon) → Razorpay modal → success page → order in dashboard. Wired to the existing `/api/checkout` flow. | Dev |
| **W3** | Customer dashboard | Order list + order detail (timeline of OrderEvent rows) + reports page (download via presigned URL) + profile/addresses CRUD. | Dev |
| **W4** | Email + WhatsApp | Booking confirmed · Kit dispatched · Out for delivery · Sample received at lab · Report ready · Refund processed. HTML email + WhatsApp HSM templates submitted for approval. | Dev + Ops |
| **W4** | Complementary domains | Register .com / .net / .co.in / kyglabs.in if not already. Cloudflare zone + 301 redirect to `kyg.in`. | D |
| **W5** | Pre-launch QA | End-to-end smoke test in staging: golden path · refund · counsellor review · partner report upload. Mobile breakpoint pass on iOS + Android. Lighthouse audit (perf ≥ 80, a11y ≥ 95). | Dev + Ops |
| **W5** | Razorpay submission | Submit application with NABL affiliation certificate. Wait 2–5 business days. | D + Legal |
| **W6** | Soft launch | Promote 10–20 friendly testers. Real ₹1 orders. Watch error rate, payment success, webhook delivery, courier AWB success rate. | Everyone |
| **W7** | Public launch | Switch Razorpay test → live keys. Marketing go-live (IG / Google / WhatsApp broadcast). On-call rotation for first 72h. | D + Marketing |

If Figma slips by N weeks, the **parallel ops track** still runs; only the UI weeks (W1–W3) shift.

---

## 4. Decisions still owed by management

These block the calendar in different ways. Get answers as early as possible.

| Decision | Why it blocks | Asked of |
|---|---|---|
| Final brand colour palette + typography in Figma | Tailwind theme tokens | Designer |
| Are complementary domain redirects 301 or actual content variants? | DNS work + content duplication | Marketing |
| Phone number on `/contact` - real ops line or call-centre number | Razorpay reviewer + customer trust | D + Ops |
| Medical/clinical lead on `/about` with council reg. number | Razorpay approval (materially helps) | D + Legal |
| Email/SMS provider final choice (SendGrid vs SES vs MSG91) | Sender domain verification timeline | D |
| WhatsApp provider (Gupshup vs Wati) | Template approval flow differs by provider | D |
| GA4 property linked to which Google account | Long-term ownership / handover risk | D |

---

## 5. Risks to the calendar

| Risk | Mitigation |
|---|---|
| Figma lands incomplete (missing edge states) | Designer to commit to component checklist at handoff (loading / empty / error / disabled). |
| Razorpay KYC rejected and resubmission takes a week | Keep Razorpay test mode functional. Don't put live launch on the same week as Razorpay approval. |
| Shiprocket KYC blocks AWB generation | Already supported - `SHIPROCKET_MOCK=true` lets the flow run end-to-end without it for staging demos. |
| WhatsApp template approvals reject | Have plain SMS templates as fallback; SMS gateway also wired. |
| First-week traffic exposes a perf regression | `pnpm tsx scripts/perf-baseline.ts` can be rerun any time; index migrations are pre-baked. |

---

## 6. How to update this file

Tick boxes inline. When a phase finishes, add the date in the Notes column. When a new dependency surfaces, add it to §4. When a risk materialises, move it to §3 as a work item with an owner.

Commit naming: `chore(calendar): tick W<n>.<n> <item>` so the website history is its own grep target.
