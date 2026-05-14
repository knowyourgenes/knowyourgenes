# Launch checklist

Step-by-step from current state to live, organised by phase. Today is 14 May 2026 — original launch date.

**The model change to KIT_BY_POST has timeline implications. The realistic posture is now soft launch — accept a small first cohort, ship kits manually via Delhivery dashboard or Shiprocket while the API integration lands, and full-launch within ~14 days.**

Check items off as you go. Owner column: **D** = Diwakar (founder/eng), **O** = Operations/Ops team, **L** = Legal/CS, **U** = us-here (this AI agent — code/doc changes you can ask for in chat).

Status legend: ⬜ todo · 🔶 in progress · ✅ done · ⛔ blocked

---

## Phase 0 — Decisions that block everything else

| #   | Item                                                                                                                    | Owner | Status |
| --- | ----------------------------------------------------------------------------------------------------------------------- | ----- | ------ |
| 0.1 | **Pick courier.** Shiprocket (1–2 day signup, multi-courier) vs direct Delhivery (2–3 week onboarding). See README §Hosting. | D     | ⬜     |
| 0.2 | **Confirm legal entity activity.** MoA Main Objects clause covers genetic testing / diagnostic services. CS to confirm or file MGT-14. | D + L | ⬜     |
| 0.3 | **Confirm GST SAC codes** include 998120 (medical & dental) or 999321 (medical lab services). Amend if not.             | D + L | ⬜     |
| 0.4 | **Decide soft-launch volume.** First cohort size (e.g. 50 orders) — drives whether manual fulfilment is viable.         | D     | ⬜     |

---

## Phase 1 — Content changes for the model pivot

The legal pages, homepage hero, footer tagline, and `/about` still describe the phlebotomist-first model. Customers and Razorpay will see the mismatch. None of these are code-risky.

| #   | Item                                                                                                            | File                                                            | Owner | Status |
| --- | --------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----- | ------ |
| 1.1 | Rewrite `/shipping` page to describe kit-by-post flow (kit dispatch, customer self-collects, reverse pickup, TAT) | [app/(site)/shipping/page.tsx](../app/(site)/shipping/page.tsx) | U     | ⬜     |
| 1.2 | Rewrite `/refunds` cancellation windows around kit dispatch milestones, not phleb slots                          | [app/(site)/refunds/page.tsx](../app/(site)/refunds/page.tsx)   | U     | ⬜     |
| 1.3 | Update `/consent` to describe online consent at checkout + re-confirm at kit registration                        | [app/(site)/consent/page.tsx](../app/(site)/consent/page.tsx)   | U     | ⬜     |
| 1.4 | Update `/terms` §2 What we provide, §5 Sample collection to reflect kit model                                   | [app/(site)/terms/page.tsx](../app/(site)/terms/page.tsx)       | U     | ⬜     |
| 1.5 | Update `/privacy` §5 to describe accession number applied to kit/tube rather than phleb-time stripping           | [app/(site)/privacy/page.tsx](../app/(site)/privacy/page.tsx)   | U     | ⬜     |
| 1.6 | Update homepage hero "A trained phlebotomist visits your home" → "Order a kit. We deliver. You sample. We test." | [app/(site)/page.tsx](../app/(site)/page.tsx)                   | U     | ⬜     |
| 1.7 | Update footer tagline "At-home collection across Delhi NCR" → "Doorstep kit, NABL labs, plain-language reports"  | [components/site/SiteFooter.tsx:67](../components/site/SiteFooter.tsx#L67) | U     | ⬜     |
| 1.8 | Update `/about` Hero + How We Do It sections (Delhi NCR claim → India-wide kit, etc.)                            | resource/legal_about_us.txt + page when /about is built          | U     | ⬜     |
| 1.9 | Update resource/legal_*.txt source-of-truth drafts to match the live page rewrites                               | [resource/legal_*.txt](../resource/)                            | U     | ⬜     |

---

## Phase 2 — Schema and seed alignment

Lower priority than content because the existing schema already supports KIT_BY_POST, but flipping defaults prevents future packages being created on the wrong path.

| #   | Item                                                                                                                                   | Owner | Status |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------ |
| 2.1 | Flip `Package.fulfillmentType` default from `AT_HOME_PHLEBOTOMIST` to `KIT_BY_POST` in [prisma/schema.prisma:338](../prisma/schema.prisma#L338) | U     | ⬜     |
| 2.2 | Flip `Order.fulfillmentMode` default similarly at [prisma/schema.prisma:381](../prisma/schema.prisma#L381)                            | U     | ⬜     |
| 2.3 | Generate migration: `pnpm db:migrate dev --name flip-fulfillment-default-to-kit`                                                      | D     | ⬜     |
| 2.4 | Update seed packages so every active package has `fulfillmentType = KIT_BY_POST` and a non-zero `kitShippingFee`                       | U     | ⬜     |
| 2.5 | Re-seed dev/staging DB: `pnpm db:reset`                                                                                                | D     | ⬜     |
| 2.6 | **Apply Campaign + Attribution migration** — schema changes are committed; run `pnpm prisma migrate dev --name add_campaign_and_attribution` once DB is online. Adds `Campaign` table and `Order.campaignId`, `Order.attrSource`, `Order.attrMedium`, `Order.attrCampaign`, `Order.attrTerm`, `Order.attrContent`, `Order.attrReferrer`, `Order.attrLandingPath`, `Order.attrFirstSeenAt`, `Order.attrPayload`. | D | ⬜ |

---

## Phase 3 — Courier integration

Two tracks depending on Phase 0.1 decision.

### Track A — Shiprocket (recommended for soft launch)

| #     | Item                                                                                                                | Owner | Status |
| ----- | ------------------------------------------------------------------------------------------------------------------- | ----- | ------ |
| 3.A.1 | Create account at [app.shiprocket.in](https://app.shiprocket.in) — KYC with PAN, GST, cancelled cheque               | D     | ⬜     |
| 3.A.2 | Register the lab/warehouse pickup address in Shiprocket dashboard                                                   | D + O | ⬜     |
| 3.A.3 | Get API token from Shiprocket → Settings → API                                                                      | D     | ⬜     |
| 3.A.4 | Add `ShipmentCourier.SHIPROCKET` enum value to [prisma/schema.prisma](../prisma/schema.prisma)                       | U     | ⬜     |
| 3.A.5 | Build `lib/shiprocket.ts` mirroring the [lib/delhivery.ts](../lib/delhivery.ts) interface (createForward, createReverse, refresh, cancel) | U     | ⬜     |
| 3.A.6 | Add Shiprocket webhook handler `app/api/webhooks/shiprocket/route.ts`                                                | U     | ⬜     |
| 3.A.7 | Update `lib/shipments.ts` to route to the correct courier based on `Shipment.courier`                                | U     | ⬜     |
| 3.A.8 | Set env vars: `SHIPROCKET_EMAIL`, `SHIPROCKET_PASSWORD` (their auth is unusual — they issue a JWT in exchange)       | D     | ⬜     |
| 3.A.9 | End-to-end test: create order → forward shipment → mark delivered (manually in dashboard) → reverse → mark delivered | D + O | ⬜     |

### Track B — Direct Delhivery (better unit economics, ~2–3 weeks)

| #     | Item                                                                                              | Owner | Status |
| ----- | ------------------------------------------------------------------------------------------------- | ----- | ------ |
| 3.B.1 | Apply at [delhivery.com](https://www.delhivery.com/) → "Become a seller"                          | D     | ⬜     |
| 3.B.2 | KAM-assigned KYC (PAN, GST, cancelled cheque, ID proof, monthly volume estimate)                  | D     | ⬜     |
| 3.B.3 | Negotiate rate card — forward and reverse separately. Get in writing.                              | D     | ⬜     |
| 3.B.4 | Register pickup location in Delhivery dashboard. Name must match `Lab.pickupLocationName` exactly. | D + O | ⬜     |
| 3.B.5 | Get API token from Delhivery dashboard → Settings → API                                            | D     | ⬜     |
| 3.B.6 | Email KAM webhook URL `https://kyg.in/api/webhooks/delhivery` + shared secret                      | D     | ⬜     |
| 3.B.7 | Set env: `DELHIVERY_TOKEN`, `DELHIVERY_WEBHOOK_SECRET`, `DELHIVERY_MOCK=false`                     | D     | ⬜     |
| 3.B.8 | End-to-end test on staging base URL (`staging-express.delhivery.com`)                              | D + O | ⬜     |
| 3.B.9 | Production cutover — switch `DELHIVERY_BASE_URL` to `track.delhivery.com`                          | D     | ⬜     |

---

## Phase 4 — Payments

| #   | Item                                                                                                              | Owner | Status |
| --- | ----------------------------------------------------------------------------------------------------------------- | ----- | ------ |
| 4.1 | Submit Razorpay application — Healthcare > Diagnostic Center. See [resource/guidelines_razorpay.txt](../resource/guidelines_razorpay.txt) | D + L | ⬜     |
| 4.2 | Upload Affiliation Certificate per [resource/guidelines_affiliate.txt](../resource/guidelines_affiliate.txt) (NABL accreditation or partner-lab agreement + cover note) | D + L | ⬜     |
| 4.3 | Razorpay approval (2–5 business days). Fix any rejections.                                                        | D     | ⬜     |
| 4.4 | Add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET` to env                                    | D     | ⬜     |
| 4.5 | Confirm checkout flow works on staging — create order → pay with test card → verify signature → captured           | D     | ⬜     |
| 4.6 | Register Razorpay webhook `https://kyg.in/api/webhooks/razorpay` in their dashboard                                | D     | ⬜     |
| 4.7 | Test refund flow end-to-end from `/admin/orders/[id]`                                                              | D + O | ⬜     |

---

## Phase 5 — Infrastructure and operational setup

| #   | Item                                                                                                              | Owner | Status |
| --- | ----------------------------------------------------------------------------------------------------------------- | ----- | ------ |
| 5.1 | Provision Postgres — replace the failed Aiven instance. Options: new Aiven, Neon, Supabase, or self-host on VPS.   | D     | ⛔     |
| 5.2 | Rotate all credentials exposed in chat: Aiven DB password, Google OAuth secret, Mappls API key                     | D     | ⬜     |
| 5.3 | Create R2 bucket `kyg-reports` (private). Generate API token. Add to env.                                          | D     | ⬜     |
| 5.4 | Set up SendGrid (or SES). Verify sender domain `kyg.in`. Add to env.                                               | D     | ⬜     |
| 5.5 | Set up WhatsApp Business via Gupshup/Wati. Get HSM templates approved (Booking confirmed, Kit dispatched, etc.).    | D + O | ⬜     |
| 5.6 | Mappls: confirm API key works on prod server IP (whitelist if needed).                                             | D     | ⬜     |
| 5.7 | Provision VPS — sized per [resource/vps-rationale.txt](../resource/vps-rationale.txt). Install Node, pnpm, Postgres if self-hosting, nginx/caddy reverse-proxy. | D     | ⬜     |
| 5.8 | DNS — point `kyg.in` and `www.kyg.in` to the VPS via Cloudflare proxy.                                             | D     | ⬜     |
| 5.9 | Set up Cloudflare WAF rules — at minimum block `/api/admin/*` and `/admin/*` from non-Indian IPs in launch week.    | D     | ⬜     |

---

## Phase 6 — Razorpay-readiness QA

The reviewer will visit the live site. These need to pass.

| #   | Item                                                                                                              | Owner | Status |
| --- | ----------------------------------------------------------------------------------------------------------------- | ----- | ------ |
| 6.1 | All five legal pages live and accessible from the footer (no 404s, no Lorem Ipsum, no "coming soon")               | D     | ✅ (built, content needs Phase 1 rewrite) |
| 6.2 | Footer carries entity disclosure "KnowYourGenes is a brand operated by BFG Market Consult Pvt. Ltd."               | D     | ✅     |
| 6.3 | `/contact` page has working email, working phone, full registered address. (Phone is current placeholder.)         | D     | 🔶     |
| 6.4 | `/about` page names the medical/clinical lead with their council registration number (materially helps approval)   | D     | ⬜     |
| 6.5 | Homepage clearly describes what is being sold, at what price, with a working checkout flow                          | D     | ⬜     |
| 6.6 | No prohibited claims anywhere: "guaranteed cure", "miracle", celebrity-without-credential endorsement, etc.         | D + L | ⬜     |
| 6.7 | Site loads without JS errors on Chrome / Safari / Android Chrome                                                    | D     | ⬜     |
| 6.8 | `/track/[orderId]` works for a logged-out user (Razorpay reviewer may not sign up)                                  | D     | ⬜     |

---

## Phase 7 — Pre-launch QA

End-to-end smoke test on staging *and* prod after each cutover. Use real test cards (Razorpay test mode) and real (cheap) Shiprocket/Delhivery shipments.

| #   | Item                                                                                                              | Owner | Status |
| --- | ----------------------------------------------------------------------------------------------------------------- | ----- | ------ |
| 7.1 | **Golden path:** guest → browse package → add to cart → sign up → checkout → pay → see order in dashboard          | D     | ⬜     |
| 7.2 | Admin → assign forward shipment → AWB created → status moves to `KIT_DISPATCHED`                                    | D + O | ⬜     |
| 7.3 | Mock webhook (or real delivery) → status moves to `KIT_DELIVERED`. Notification fires.                              | D + O | ⬜     |
| 7.4 | Admin → create reverse shipment → status moves to `SAMPLE_PICKED_UP`                                                | D + O | ⬜     |
| 7.5 | Reverse delivery → status moves to `AT_LAB`                                                                         | D + O | ⬜     |
| 7.6 | Admin uploads sample report PDF → file lands in R2 → Report row created → status `REPORT_READY` → email + WhatsApp fire | D + O | ⬜     |
| 7.7 | User opens report from dashboard → presigned R2 URL works → PDF downloads                                            | D     | ⬜     |
| 7.8 | Refund flow: admin marks order as cancelled before dispatch → refund processed → status `REFUNDED`                  | D + O | ⬜     |
| 7.9 | Counselling booking: user books slot → pays → consultation row exists → counsellor sees it in their dashboard       | D + O | ⬜     |
| 7.10 | Cross-browser smoke: Chrome desktop, Safari iOS, Chrome Android                                                   | D     | ⬜     |

---

## Phase 8 — Launch day

| #   | Item                                                                                                              | Owner | Status |
| --- | ----------------------------------------------------------------------------------------------------------------- | ----- | ------ |
| 8.1 | Production deploy. DNS cutover. Smoke test the golden path on prod with a real ₹1 test order.                      | D     | ⬜     |
| 8.2 | Switch Razorpay from test to live keys. Confirm `RAZORPAY_WEBHOOK_SECRET` is the live one.                          | D     | ⬜     |
| 8.3 | Marketing go-live — Instagram, Google search, WhatsApp broadcast list.                                              | M     | ⬜     |
| 8.4 | Be on-call. Monitor payment success rate, webhook delivery, email/WhatsApp delivery, error rate.                   | D     | ⬜     |
| 8.5 | Post-launch retro at EOD — what went well, what to fix tomorrow.                                                    | D     | ⬜     |

---

## Phase 9 — First-week monitoring

| #   | Item                                                                                                              | Owner | Status |
| --- | ----------------------------------------------------------------------------------------------------------------- | ----- | ------ |
| 9.1 | Daily check: order count, payment success rate, refund rate, drop-off in checkout funnel.                          | D + O | ⬜     |
| 9.2 | Reconcile Razorpay payouts against `Payment.status = CAPTURED` rows.                                                | D + O | ⬜     |
| 9.3 | Reconcile courier AWBs against `Shipment.awb`. Investigate any orders stuck in `KIT_DISPATCHED` > 4 days.           | D + O | ⬜     |
| 9.4 | Review any `Notification` rows with `status = FAILED`. Fix template approval or provider config.                    | D     | ⬜     |
| 9.5 | Backup verification: ensure Postgres backups are running and a restore test succeeds.                                | D     | ⬜     |

---

## Phase 10 — Post-launch P1 work

Things that should land in week 2–4.

| #    | Item                                                                                            | Owner |
| ---- | ----------------------------------------------------------------------------------------------- | ----- |
| 10.1 | If Track A (Shiprocket) was picked, start Track B (direct Delhivery) onboarding for better unit economics. | D     |
| 10.2 | Sentry or equivalent error monitoring on the Next.js process.                                   | D     |
| 10.3 | Uptime monitoring for the public pages, `/api/webhooks/*`, and the studio.                       | D     |
| 10.4 | Set up a staging environment if not already (separate VPS, separate DB, separate Razorpay keys). | D     |
| 10.5 | Schedule a security review — at minimum: rotate all credentials, audit admin user list, confirm R2 bucket isn't public. | D + L |
| 10.6 | Onboard the first NABL partner lab — create their `LabPartner` row, hand them the `/admin` login, walk them through report upload. | D + O |
| 10.7 | Onboard the first counsellor — create their `CounsellorProfile`, set them visible on `/counsellor`. | D + O |

---

## Tracking

Update this file in place. Keep PRs minimal — when you tick something, commit with `chore(launch): tick N.N <item>` so the launch history is its own grep target.

When you hit a blocker, change the status to ⛔ and write the reason in a Notes column. Future-you will thank present-you.
