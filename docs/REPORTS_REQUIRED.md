# Admin reports catalog

The set of reports you should be able to pull from `/admin` to actually run the business. Grouped by category, prioritised, and tagged with the data source so engineering knows what's already available vs what needs schema additions.

**Priority:** 🔴 T1 = launch week · 🟡 T2 = month 1 · 🟢 T3 = month 2+

**Status legend:** ⬜ todo · 🔶 partial (data is there, no UI yet) · ✅ shipped

**Data source notation:** `Order`, `Payment` etc. = Prisma model. *(NEW FIELD)* = requires a schema migration before this report is buildable. *(NEW TABLE)* = requires a whole new model.

**Total scope:** 116 reports across 16 categories. Launch-week pack is 18; everything else can land in month 1+.

---

## 1. Revenue & sales

The "how much money are we making" reports. These run the daily standup.

| # | Report | Answers the question | Key metrics | Granularity | Data source | Priority | Status |
|---|---|---|---|---|---|---|---|
| 1.1 | **Daily revenue** | How much did we make today? | Gross revenue, net revenue (after refunds), order count, AOV | Day / week / month | `Payment.status = CAPTURED` minus `REFUNDED` | 🔴 | ⬜ |
| 1.2 | **Revenue by package** | Which packages drive revenue? | Revenue, units sold, % of total | Package | `Order` joined to `Package` | 🔴 | ⬜ |
| 1.3 | **Revenue by category** | Wellness vs Cancer vs Cardiac vs Reproductive vs Drug-sensitivity | Revenue, AOV per category | Category | `Order.package.category` | 🟡 | ⬜ |
| 1.4 | **Average order value (AOV)** | Are people buying premium or entry-level? | AOV trend over time | Day / week | `Order.total` | 🟡 | ⬜ |
| 1.5 | **Refund report** | How much did we refund? Why? | Refund value, refund rate %, reason breakdown | Day / month | `Payment.status IN (REFUNDED, PARTIALLY_REFUNDED)` | 🔴 | ⬜ |
| 1.6 | **Payment method mix** | UPI vs card vs net-banking vs EMI | Count + value per method | Day / month | `Payment.method` | 🟡 | ⬜ |
| 1.7 | **GST collected** | For monthly GST filing | Total GST collected by SAC code | Month | `Order.total` × GST rate | 🔴 | ⬜ |
| 1.8 | **Counselling revenue** | Separate from package revenue | Sessions booked, revenue, completion rate | Day / week | `Consultation` | 🟡 | ⬜ |
| 1.9 | **Report unlock revenue** *(NEW)* | À-la-carte and bundle unlocks from the LTV engine, separate from initial kit sales | Unlock count + revenue, top unlocked reports, attach rate | Week / month | *(NEW TABLE: `ReportUnlock` linking `User` × `ReportModule`)* | 🟡 | ⬜ |
| 1.10 | **Consultation revenue (by tier)** *(NEW)* | Std vs premium vs concierge consultation revenue, by counsellor | Sessions, revenue per tier, counsellor share | Week / month | `Consultation` + *(NEW FIELD: `Consultation.tier`)* | 🟡 | ⬜ |
| 1.11 | **Annual updates membership** *(NEW)* | The recurring-revenue line | Active members, MRR, churn, renewal rate, ARPU | Month | *(NEW TABLE: `Membership`)* | 🟡 | ⬜ |
| 1.12 | **Family bundle revenue** *(NEW)* | Couple / sibling / family / parent-add-on orders | Bundle revenue, units, attach rate per type | Week / month | *(NEW FIELD: `Order.bundleType`)* OR group via `Order.parentOrderId` | 🟡 | ⬜ |
| 1.13 | **B2B & corporate revenue** *(NEW)* | Revenue from corp wellness, IVF clinics, hospitals, insurers | Revenue by account, contract value, renewal date | Account | *(NEW TABLE: `B2BAccount` + `B2BContract`)* | 🟡 | ⬜ |
| 1.14 | **COGS & gross margin** *(NEW)* | The number that decides actual profitability | Per-order COGS (kit + courier + lab + PG fee), gross margin per test | Order / test | *(NEW FIELDS: `Package.unitCost`, `Order.cogs*`)* | 🔴 | ⬜ |

---

## 2. Orders & funnel

| # | Report | Answers | Key metrics | Data source | Priority | Status |
|---|---|---|---|---|---|---|
| 2.1 | **Orders by status** | How many orders are stuck where? | Count per status, % of total | `Order.status` | 🔴 | 🔶 |
| 2.2 | **Conversion funnel** | Where do we lose people? | Visitors → product views → cart adds → checkouts → payments | Server-side events + `Order` | 🔴 | ⬜ (needs analytics events) |
| 2.3 | **Cart abandonment** | Who almost bought? | Carts created with no Order, recovery rate | *(NEW: `AbandonedCart` table)* | 🟡 | ⬜ |
| 2.4 | **Stuck-order alert** | Which orders haven't progressed in N days? | Order ID, current status, days stuck, customer | `Order` + `OrderEvent.createdAt` | 🔴 | ⬜ |
| 2.5 | **Cancellation reasons** | Why are people cancelling? | Count per reason, % of cancellations | `Order.cancelReason` | 🟡 | ⬜ |
| 2.6 | **Order source / attribution** | Which channel drives orders? | Orders + revenue per source (instagram / google / direct / referral / whatsapp) | `Order.attrSource` (already shipped — see [lib/attribution.ts](../lib/attribution.ts)) | 🔴 | 🔶 |
| 2.7 | **First-order vs repeat** | New customers vs existing? | New customer count, repeat order rate | `Order` with `User.orders.length` | 🟡 | ⬜ |
| 2.8 | **Self vs add-on order split** *(NEW)* | Solo orders vs family / couple / parent add-ons | Self %, add-on %, conversion of solo → family | *(NEW FIELD: `Order.parentOrderId` or `Order.bundleType`)* | 🟡 | ⬜ |
| 2.9 | **Doctor referral tracking** *(NEW)* | Orders attributed to specific doctors / hospitals / IVF clinics | Referrer name, orders, revenue, share due | *(NEW TABLE: `Referrer` + `Order.referrerId`)* | 🟡 | ⬜ |

---

## 3. Customer demographics

| # | Report | Answers | Data source | Priority | Status |
|---|---|---|---|---|---|
| 3.1 | **Age group breakdown** | Who is our customer? | *(NEW FIELD: `User.dateOfBirth`)* | 🔴 | ⬜ |
| 3.2 | **Gender breakdown** | Gender skew per package category | *(NEW FIELD: `User.gender`)* | 🔴 | ⬜ |
| 3.3 | **Geographic distribution** | Where are orders coming from? | `Order.address.pincode` joined to `ServiceArea` | 🔴 | ⬜ |
| 3.4 | **Top pincodes** | Which pincodes are hot? | `Order.address.pincode` | 🔴 | ⬜ |
| 3.5 | **City expansion candidates** | Where do we have demand but no service? | *(NEW: `Waitlist` table OR analytics)* | 🟡 | ⬜ |
| 3.6 | **Customer LTV** | Lifetime value | `Order` joined on `User.createdAt` cohort | 🟡 | ⬜ |
| 3.7 | **Acquisition cohort retention** | Do January customers come back? | `User.createdAt` + `Order.createdAt` | 🟢 | ⬜ |
| 3.8 | **Customer segment health** *(NEW)* | Counts in each LTV segment (Curious Starter, Health-Aware Buyer, Family Anchor, Lapsed, Premium Seeker) + month-on-month movement between segments | *(Derived view over `User` + `Order` + classification rules)* | 🟡 | ⬜ |
| 3.9 | **Tier 1 vs Tier 2 city performance** *(NEW)* | Order volume, AOV, conversion, LTV split by city tier | `Order.address.city` + tier lookup table | 🟡 | ⬜ |

---

## 4. Operations — kit logistics SLAs

| # | Report | Answers | Data source | Priority | Status |
|---|---|---|---|---|---|
| 4.1 | **Dispatch SLA** | How fast do we ship after booking? | `OrderEvent` time deltas | 🔴 | ⬜ |
| 4.2 | **Kit delivery SLA** | How long does the kit take to reach customer? | `Shipment.leg=FORWARD` deltas | 🔴 | ⬜ |
| 4.3 | **Reverse pickup SLA** | How fast does courier collect the sample? | `Shipment.leg=REVERSE` | 🔴 | ⬜ |
| 4.4 | **Sample-to-lab SLA** | Reverse leg duration | `Shipment.leg=REVERSE` deltas | 🔴 | ⬜ |
| 4.5 | **Lab TAT** | How long is the lab taking? | `OrderEvent` deltas | 🔴 | ⬜ |
| 4.6 | **End-to-end TAT** | Booking → report-in-hand | `OrderEvent` deltas | 🔴 | ⬜ |
| 4.7 | **Shipment failure rate / RTO** | Failed deliveries, by courier, by reason | `Shipment.status IN (RTO, FAILED)` | 🟡 | ⬜ |
| 4.8 | **Courier comparison** | Which courier performs better? | `Shipment.courier` | 🟡 | ⬜ |
| 4.9 | **Kit inventory** | How many days of kits do we have? | *(NEW TABLE: `KitInventory`)* | 🔴 | ⬜ |
| 4.10 | **Reverse logistics live trace** *(NEW)* | Every sample in transit, lost-sample log, in-transit-too-long flags | `Shipment.leg=REVERSE` + alert thresholds | 🔴 | ⬜ |
| 4.11 | **Recollection rate (ops view)** *(NEW)* | Samples that had to be re-collected for any reason — should be < 3% | *(NEW FIELD: `Order.recollectionCount`, `Order.recollectionReason`)* — see also §14 | 🔴 | ⬜ |

---

## 5. Lab partner performance

| # | Report | Answers | Data source | Priority | Status |
|---|---|---|---|---|---|
| 5.1 | **Reports per partner** | Volume per lab | `Order.labPartnerId` | 🟡 | ⬜ |
| 5.2 | **Lab TAT by partner** | Which partner is fastest? | `Order` + `OrderEvent` | 🟡 | ⬜ |
| 5.3 | **Critical findings rate** | % reports flagging a critical variant | `Report.criticalFinding` | 🟢 | ⬜ |
| 5.4 | **Sample rejection rate** | How often does a sample fail QC? | *(NEW FIELD: `Order.sampleRejected` + reason)* | 🟡 | ⬜ |
| 5.5 | **Lab cost per report** *(NEW)* | Per-test cost paid to each partner — drives renegotiation once volumes hit slabs | *(NEW TABLE: `LabPartnerPricing` per package per partner)* | 🔴 | ⬜ |
| 5.6 | **Inter-lab result consistency** *(NEW)* | For tests run by multiple partners: sample-level result comparison — flags labs whose calls deviate from consensus. Critical for clinical trust. | `Report.markers` joined cross-partner | 🟢 | ⬜ |

---

## 6. Counselling

| # | Report | Answers | Data source | Priority | Status |
|---|---|---|---|---|---|
| 6.1 | **Counselling attach rate** | % of customers booking counselling | `Consultation` joined to `Order` history | 🟡 | ⬜ |
| 6.2 | **Counsellor utilisation** | Are counsellors busy? | `Consultation.status` | 🟡 | ⬜ |
| 6.3 | **No-show / cancellation rate** | Are people showing up? | `Consultation.status` | 🟡 | ⬜ |
| 6.4 | **Session language mix** | Which languages do we need? | `Consultation.language` | 🟢 | ⬜ |
| 6.5 | **CSAT & NPS per counsellor** *(NEW)* | Customer satisfaction + NPS after every consultation, per counsellor — decides who scales | *(NEW TABLE: `ConsultationFeedback` — rating, NPS, comments)* | 🟡 | ⬜ |
| 6.6 | **Consultation topic mix** *(NEW)* | Top topics raised in sessions (heart, diabetes, weight, fertility, drug-gene) — tells product what to build, content what to write | *(NEW FIELD: `Consultation.topics: Json`)* | 🟡 | ⬜ |
| 6.7 | **Counsellor specialisation performance** *(NEW)* | Per counsellor, conversion + CSAT split by specialisation — drives routing | `CounsellorProfile.specialty` + `ConsultationFeedback` | 🟢 | ⬜ |

---

## 7. Marketing & promotions

| # | Report | Answers | Data source | Priority | Status |
|---|---|---|---|---|---|
| 7.1 | **Coupon performance** | Which codes worked? | `Coupon.usageCount` + `Order.couponCode` | 🔴 | ⬜ |
| 7.2 | **Coupon abuse alert** | Is any code being used too aggressively? | `Order.couponCode` group by | 🟡 | ⬜ |
| 7.3 | **Campaign / UTM performance** | Which campaign gave best ROAS? | `Order.campaignId` + `Order.attrCampaign` (already shipped — see [admin/campaigns](../app/admin/campaigns/page.tsx)) | 🔴 | 🔶 |
| 7.4 | **Source / channel** | Where do orders come from? | `Order.attrSource` + `Order.attrMedium` (already shipped) | 🔴 | 🔶 |
| 7.5 | **B2B leads pipeline** | Where are corporate-wellness leads? | `PartnerLead` *(needs `status` field)* | 🟢 | ⬜ |
| 7.6 | **LTV-to-CAC ratio** *(NEW)* | Per-channel: 12-month projected LTV ÷ acquisition cost. The single most important profitability ratio. | `Order.attrSource` joined to *(NEW TABLE: `AdSpend` — per-channel spend tracking)* | 🔴 | ⬜ |
| 7.7 | **Referral program** *(NEW)* | Active referrers, codes sent, conversions, wallet credit issued/redeemed | *(NEW TABLE: `Referral`)* | 🟡 | ⬜ |
| 7.8 | **Influencer / doctor campaign tracking** *(NEW)* | Per-partner: codes issued, redemptions, revenue, ROAS — decide who to renew | `Campaign` joined to `Order` (already shipped); add `Campaign.partnerType` field | 🟡 | ⬜ |
| 7.9 | **Content performance** *(NEW)* | Blog / video / social ranked by acquisition + engagement — identifies the small set of pieces doing most of the work | Server-side event capture per content URL + `Order.attrLandingPath` | 🟡 | ⬜ |

---

## 8. Communications & support

| # | Report | Answers | Data source | Priority | Status |
|---|---|---|---|---|---|
| 8.1 | **Notification delivery** | Are our messages landing? | `Notification.status` | 🔴 | ⬜ |
| 8.2 | **Failed notifications drill-down** | Which templates / numbers are failing? | `Notification.status = FAILED` | 🔴 | ⬜ |
| 8.3 | **WhatsApp read rate** | Are people opening our messages? | `Notification.status = READ` | 🟡 | ⬜ |
| 8.4 | **Contact form inbox** | Customer-service queue | `ContactMessage.resolved = false` | 🔴 | 🔶 |
| 8.5 | **Topic mix** | What are customers asking about? | `ContactMessage.topic` | 🟡 | ⬜ |
| 8.6 | **First-response time** | How fast does CS reply? | *(NEW: `ContactMessage.respondedAt`)* | 🟡 | ⬜ |
| 8.7 | **WhatsApp cost report** *(NEW)* | Per-message cost across template categories (utility / marketing / authentication). India WhatsApp pricing changed in 2025 — can become a top-5 cost line if untracked. | *(NEW FIELD: `Notification.providerCostPaise`)* | 🔴 | ⬜ |
| 8.8 | **Unsubscribe & opt-out trend** *(NEW)* | Unsubscribe rate by channel and message type — spike signals fatigue before retention numbers catch up | *(NEW TABLE: `OptOutEvent`)* | 🟡 | ⬜ |

---

## 9. Agent / phlebotomist (Phase 2)

Only relevant when AT_HOME_PHLEBOTOMIST is live. All 🟢 since Phase 2.

| # | Report | Status |
|---|---|---|
| 9.1 | Collections per agent per day | ⬜ |
| 9.2 | On-time rate per agent | ⬜ |
| 9.3 | Zone coverage | ⬜ |
| 9.4 | Agent rating distribution | ⬜ |

---

## 10. Compliance, security & audit

| # | Report | Why | Data source | Priority | Status |
|---|---|---|---|---|---|
| 10.1 | **DPDP requests log** | Data access / deletion requests + TAT | *(NEW TABLE: `DataSubjectRequest`)* | 🟡 | ⬜ |
| 10.2 | **Consent capture rate** | What % of orders have a signed consent attached? | `Order.consentFormUrl IS NOT NULL` | 🔴 | ⬜ |
| 10.3 | **Reports delivered without counsellor review** | If your policy requires QC | `Report.reviewedById IS NULL` | 🟡 | ⬜ |
| 10.4 | **Refund TAT compliance** | Within Consumer Protection Rules window? | `Payment.capturedAt` → `Payment.status=REFUNDED` delta | 🟡 | ⬜ |
| 10.5 | **Admin actions audit** | Who did what in /admin? | `OrderEvent.actorId` + future `AdminActionLog` | 🟡 | ⬜ |
| 10.6 | **Inactive admin accounts** | Stale logins are a risk | `User.role IN (...)` + `Session.expires` | 🟡 | ⬜ |
| 10.7 | **Data retention compliance** | Customers past retention window | `User.deletedAt` + report age | 🟢 | ⬜ |
| 10.8 | **Genetic counselling mandate compliance** *(NEW)* | Indian regulatory guidance increasingly requires pre-/post-test counselling for predictive genetic tests | `Order` × `Consultation` join, counselling offered vs completed | 🟡 | ⬜ |
| 10.9 | **Re-consent for research use** *(NEW)* | Higher regulatory bar if KYG uses anonymised data for research. Tracks who consented for what use case, when. | *(NEW TABLE: `ResearchConsent`)* | 🟢 | ⬜ |
| 10.10 | **Data breach incident log** *(NEW)* | DPDP Act requires breach reporting within 72 hours | *(NEW TABLE: `SecurityIncident` — timestamp, scope, remediation, authority notification)* | 🔴 | ⬜ |

---

## 11. Executive / KPI dashboard

A single page that aggregates the top numbers — for the founder's morning glance.

```
This Week     Δ vs last week
─────────     ──────────────
Orders                42       +12%
Revenue            ₹3.6L       +9%
AOV               ₹8,600       -3%
Refund rate        2.4%        flat
Stuck orders          3         +1 ⚠️
NPS                  47        +5

Funnel (this week)
  Site visits         1,240
  Cart adds             140  → 11.3%
  Checkouts              68  →  4.4%  (-2.1 pp vs last week)
  Paid                   42  →  3.4%

Pipeline
  Orders BOOKED         12
  KIT_DISPATCHED         8
  KIT_DELIVERED          7
  IN_TRANSIT             5
  AT_LAB                14
  REPORT_READY this week 6

Comms health
  WhatsApp delivery    98.1%
  Email delivery       96.4%   ⚠️ check SPF/DKIM
  Failed (last 24h)       4
```

| Item | Priority | Status |
|---|---|---|
| 11.1 Single-page exec dashboard with above tiles | 🔴 | 🔶 (partial — `app/admin/dashboard/page.tsx` already exists) |
| 11.2 Slack / WhatsApp daily digest at 09:00 IST | 🟡 | ⬜ |
| 11.3 Anomaly alerts (revenue drop > 30%, stuck orders > 5, refund spike) | 🟡 | ⬜ |
| 11.4 **Board pack (monthly)** *(NEW)* — auto-generated investor/board report: revenue, growth, gross margin, customer adds, LTV, CAC, runway, top risks | 🟡 | ⬜ |
| 11.5 **Cohort profitability report** *(NEW)* — each monthly acquisition cohort tracked for *actual* contribution margin over time (rev − COGS − CAC). Tells you which acquisition months were worth it. | 🟡 | ⬜ |

---

## 12. Product & engagement *(NEW CATEGORY)*

How customers actually use the platform once they're in. Most healthcare brands skip this and lose retention.

| # | Report | Why | Data source | Priority | Status |
|---|---|---|---|---|---|
| 12.1 | **DAU / WAU / MAU** | Distinguishes "we have customers" from "we have engaged customers" | *(NEW: server-side session event log)* | 🟡 | ⬜ |
| 12.2 | **Report read rate** | % of unlocked reports that customer actually opened. A report bought but never read is a refund risk + lost upsell. | *(NEW FIELD: `Report.firstViewedAt`, `Report.viewCount`)* | 🟡 | ⬜ |
| 12.3 | **Time on report page** | Identifies reports that are too dense, too thin, or unclear | *(NEW: page-event analytics per report)* | 🟢 | ⬜ |
| 12.4 | **Feature usage funnel** | Per feature (dashboard, report library, family vault, consultation booking, document upload): adoption, drop-off, repeat usage | *(NEW: client-side event capture)* | 🟡 | ⬜ |
| 12.5 | **Internal search-term report** | What customers search for inside the platform — tells product what's missing or hard to find | *(NEW: server-side search-query log)* | 🟢 | ⬜ |
| 12.6 | **Mobile app vs web usage** | Where engagement happens — decides where to invest engineering hours | User-agent classification on session events | 🟢 | ⬜ |

---

## 13. Clinical & quality outcomes *(NEW CATEGORY)*

The credibility layer. Without these, the brand cannot claim "preventive healthcare" in any regulatory or PR setting.

| # | Report | Why | Data source | Priority | Status |
|---|---|---|---|---|---|
| 13.1 | **Clinically actionable findings rate** | % of reports that surfaced a finding the customer + clinician can act on. The true measure of whether the product delivers on its promise. | `Report.markers` filtered by `result IN (HIGH, MODERATE)` + recommended action present | 🟡 | ⬜ |
| 13.2 | **Critical finding follow-through** | Of customers with a critical finding: how many got a counsellor call, physician referral, or follow-up testing. Quality + duty-of-care safeguard. | `Report.criticalFinding=true` joined to `Consultation` and *(NEW: `FollowUpAction`)* | 🔴 | ⬜ |
| 13.3 | **False positive / false negative tracking** | Where confirmatory testing suggests the original report was wrong. Quietly the most important quality report in the entire business. | *(NEW TABLE: `ReportConfirmation` — links a Report to subsequent confirmatory test result + concordance)* | 🟡 | ⬜ |
| 13.4 | **Adverse event log** | Any customer harm or near-miss attributable to a report finding. Mandatory for any clinical-adjacent business + draft Indian genetic-testing regs. | *(NEW TABLE: `AdverseEvent` — date, severity, root-cause, remediation)* | 🔴 | ⬜ |
| 13.5 | **Report revision history** | Reports re-issued after the initial release (better science, corrected variant call, expanded panel) — customer-facing audit log | *(NEW: `Report.parentReportId` + `Report.revisionNote`)* | 🟢 | ⬜ |

---

## 14. Returns, sample issues & customer recovery *(NEW CATEGORY)*

In a sample-driven business, failure modes are different from generic D2C. Each one needs its own visibility.

| # | Report | Why | Data source | Priority | Status |
|---|---|---|---|---|---|
| 14.1 | **Failed sample report** | Samples that could not be processed (insufficient quantity, contamination, degradation, transit damage). Reason code, partner involved, customer impact. | *(NEW FIELDS: `Order.sampleRejected`, `Order.sampleRejectionReason`)* | 🔴 | ⬜ |
| 14.2 | **Recollection rate** | % of customers asked to give a second sample. Should be < 3%. Sharper than any single quality metric. | *(NEW FIELD: `Order.recollectionCount`)* — also in §4.11 | 🔴 | ⬜ |
| 14.3 | **Customer recovery funnel** | For every failure point: retention rate after recovery, downstream LTV, what the customer did next. Tells you whether ops issues actually cost the business or are forgiven. | `OrderEvent` + `Order.userId` cohort by failure mode | 🟡 | ⬜ |
| 14.4 | **Win-back campaign performance** | Lapsed customers re-activated through win-back: conversion + incremental revenue | `Campaign` (existing) + last-order-date cohort | 🟢 | ⬜ |

---

## 15. Privacy, security & trust *(NEW CATEGORY)*

Genetic data is the most sensitive personal data Indian law recognises. These reports are not optional.

| # | Report | Why | Data source | Priority | Status |
|---|---|---|---|---|---|
| 15.1 | **Privacy settings adoption** | % of customers who have actively configured privacy preferences (data sharing, family vault access, research participation) | *(NEW TABLE: `UserPrivacyPreference`)* | 🟡 | ⬜ |
| 15.2 | **2FA adoption** | MFA enabled per customer. Sensitive accounts without it are an audit risk. | *(NEW FIELD: `User.twoFactorMethod`)* | 🟡 | ⬜ |
| 15.3 | **Login anomaly alerts** | Unusual access patterns (new device, new geography, multiple failed attempts). Auto-lock + notify. | *(NEW TABLE: `LoginEvent` with device + geo)* | 🔴 | ⬜ |
| 15.4 | **Third-party data sharing audit** | Every data flow to a third party (labs, payment gateways, marketing, analytics) with purpose + consent basis + contract reference | *(NEW TABLE: `DataProcessingActivity` — DPDP-required register)* | 🟡 | ⬜ |
| 15.5 | **Customer data export log** | DPDP-mandated. Every time a customer downloads their own data: who packaged it, what was exported | *(NEW TABLE: `DataExportRequest`)* | 🟡 | ⬜ |

---

## 16. Doctor & partner portal *(NEW CATEGORY)*

If KYG runs B2B (doctor referrals, IVF clinics, hospitals, corporates), the partner side needs its own reporting layer. Promote to 🔴 if B2B is live at launch.

| # | Report | Why | Data source | Priority | Status |
|---|---|---|---|---|---|
| 16.1 | **Partner account dashboard** | Per partner: orders referred, revenue generated, share due, payout history. Single screen a partner logs in to. | *(NEW TABLE: `B2BAccount`)* | 🟡 | ⬜ |
| 16.2 | **Doctor prescription pattern** | Which tests a doctor recommends most, conversion rate, AOV — identifies top referrers for ambassador programs | *(NEW TABLE: `Referrer` + `Order.referrerId`)* | 🟢 | ⬜ |
| 16.3 | **Corporate wellness utilisation** | Per corp account: employees enrolled, tests redeemed, consultation attended — for HR business reviews + renewal pitches | *(NEW TABLE: `B2BContract` + `B2BEmployee`)* | 🟡 | ⬜ |
| 16.4 | **Partner payout reconciliation** | Revenue share calculated → invoiced → paid. Pending payouts, disputed amounts. | *(NEW TABLE: `PartnerPayout`)* | 🟡 | ⬜ |

---

## Schema changes implied by this full catalog

If you want every report above, the migration footprint is substantial. Group these into themed migrations so they ship in waves rather than one mega-PR.

### Wave A — Demographics + attribution (4 fields, 2 tables)

| # | Where | New field / table |
|---|---|---|
| A.1 | `User` | `dateOfBirth DateTime?`, `gender Gender?` |
| A.2 | `Order` | `source`, `utmSource`, `utmMedium`, `utmCampaign`, `utmTerm`, `utmContent` — ✅ **shipped** as `attr*` columns |
| A.3 | New table | `AbandonedCart` |
| A.4 | New table | `DataSubjectRequest` |

### Wave B — Operations + clinical visibility

| # | Where | New field / table |
|---|---|---|
| B.1 | `Order` | `sampleRejected Boolean @default(false)`, `sampleRejectionReason String?`, `recollectionCount Int @default(0)`, `cogsKitPaise Int?`, `cogsCourierPaise Int?`, `cogsLabPaise Int?`, `cogsGatewayPaise Int?` |
| B.2 | `Package` | `unitCostPaise Int @default(0)` |
| B.3 | `Report` | `firstViewedAt DateTime?`, `viewCount Int @default(0)`, `parentReportId String?`, `revisionNote String?` |
| B.4 | `ContactMessage` | `respondedAt DateTime?`, `respondedById String?` |
| B.5 | New table | `KitInventory` (per kit SKU: on-hand, threshold, supplier) |
| B.6 | New table | `LabPartnerPricing` (partner × package × ratecard) |
| B.7 | New table | `AdverseEvent` |
| B.8 | New table | `ReportConfirmation` (links Report → confirmatory test) |
| B.9 | New table | `FollowUpAction` (counsellor / clinician follow-up post-critical-finding) |

### Wave C — LTV + recurring + family + B2B

| # | Where | New field / table |
|---|---|---|
| C.1 | New table | `Membership` (recurring annual updates) |
| C.2 | New table | `ReportUnlock` (à-la-carte unlocks) |
| C.3 | `Order` | `parentOrderId String?`, `bundleType String?` (couple / family / parent-add-on) |
| C.4 | `Consultation` | `tier String`, `topics Json` |
| C.5 | New table | `ConsultationFeedback` (CSAT + NPS) |
| C.6 | New table | `Referrer` (doctors / influencers / hospitals) |
| C.7 | New table | `B2BAccount`, `B2BContract`, `B2BEmployee` |
| C.8 | New table | `PartnerPayout` |
| C.9 | New table | `Referral` (customer referral program) |
| C.10 | New table | `AdSpend` (per-channel marketing spend for LTV-to-CAC) |

### Wave D — Privacy, security, comms

| # | Where | New field / table |
|---|---|---|
| D.1 | `User` | `twoFactorMethod String?` |
| D.2 | `Notification` | `providerCostPaise Int?` |
| D.3 | New table | `LoginEvent` (device, geo, success/failure) |
| D.4 | New table | `UserPrivacyPreference` |
| D.5 | New table | `DataProcessingActivity` (DPDP register) |
| D.6 | New table | `DataExportRequest` |
| D.7 | New table | `SecurityIncident` (breach log, 72h notification clock) |
| D.8 | New table | `OptOutEvent` |
| D.9 | New table | `ResearchConsent` |

### Wave E — Engagement instrumentation

Mostly server-side event-log infrastructure rather than schema. Pattern: a single `AppEvent` table with `userId`, `kind`, `path`, `payload Json`, `createdAt`. From there you can derive DAU/WAU/MAU, feature funnels, search terms, mobile vs web.

| # | Where | New field / table |
|---|---|---|
| E.1 | New table | `AppEvent` (universal session-event log) |

Total: **5 new fields on existing models + ~24 new tables** if you want every report. Realistic launch ask is Wave A + the few B items needed for ops (kit inventory, sample rejection, COGS).

---

## What to build first — 18-item launch-week pack

Promoted from the original 15 to include the most important new items.

1. Daily revenue (1.1)
2. **COGS & gross margin (1.14)** — without this you don't know if you're profitable
3. Refund report (1.5)
4. GST collected (1.7)
5. Orders by status (2.1)
6. Stuck-order alert (2.4)
7. Order source / UTM (2.6 + 7.3 + 7.4) — *partly shipped, see [admin/campaigns](../app/admin/campaigns/page.tsx)*
8. Geographic distribution + top pincodes (3.3 + 3.4)
9. Age + gender (3.1 + 3.2) — *needs Wave A schema*
10. End-to-end TAT (4.6)
11. **Kit inventory (4.9)** — out-of-stock is a launch-killer
12. **Reverse logistics trace (4.10)** — kit-by-post critical
13. **Lab cost per report (5.5)** — for renegotiation
14. **LTV-to-CAC (7.6)** — the profitability ratio
15. Coupon performance (7.1)
16. **WhatsApp cost report (8.7)** — quiet line that can blow up
17. Notification delivery (8.1) + failed drill-down (8.2)
18. Consent capture rate (10.2) + **data breach log (10.10)** + **adverse event log (13.4)** — regulatory baseline

That's ~3 weeks of admin-UI work for one engineer if Waves A and B schema land first. Everything else can come in month 2–3.
