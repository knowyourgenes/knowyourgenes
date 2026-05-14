# What we need from management to complete the launch

This is the consolidated list of documents, decisions, credentials, and assets that have to come from someone other than engineering. Hand this to the founders / CS / ops / brand team and tick items off as they arrive.

**Owner column:** **F** = Founder / Director / Authorised Signatory · **CS** = Company Secretary / CA · **L** = Lawyer · **B** = Brand / Marketing · **O** = Operations / Customer Service · **M** = Medical / Clinical Advisor · **E** = Engineering (us)

**Priority:** 🔴 Launch-blocker · 🟡 Important · 🟢 Nice-to-have

**Status:** ⬜ todo · 🔶 partial · ✅ done

---

## 1. Company legal documents

These prove the entity exists and is what it says it is. Everything else hangs off these.

| # | Document | Format | Why | Owner | Priority | Status |
|---|---|---|---|---|---|---|
| 1.1 | Certificate of Incorporation (CoI) | Original PDF, MCA-issued | Razorpay, Shiprocket/Delhivery, opening current account, NABL lab tie-ups | CS | 🔴 | ✅ have CIN U74999DL2010PTC207582 |
| 1.2 | Memorandum of Association (MoA) — current copy | PDF | Confirms Objects clause covers **genetic testing / diagnostic / health services**. If not, file MGT-14 amendment. | CS + L | 🔴 | ⬜ |
| 1.3 | Articles of Association (AoA) | PDF | Sometimes asked by banks and Razorpay | CS | 🟡 | ⬜ |
| 1.4 | Board resolution authorising the bank account + payment-gateway signatories | PDF on company letterhead, signed | Razorpay onboarding for Pvt Ltd | CS | 🔴 | ⬜ |
| 1.5 | List of current directors with DINs | PDF | KYC verification | CS | 🟡 | ⬜ |
| 1.6 | Shareholding pattern | PDF | Razorpay may ask if shareholders > 1 | CS | 🟢 | ⬜ |
| 1.7 | Latest MCA Form INC-22 / INC-22A (active status confirmation) | PDF | Proves the company is in "Active" status on MCA | CS | 🟡 | ⬜ |

---

## 2. Tax registrations

| # | Document | Format | Why | Owner | Priority | Status |
|---|---|---|---|---|---|---|
| 2.1 | Company PAN card | Scan, both sides | Every integration | CS | 🔴 | ⬜ |
| 2.2 | TAN (Tax Deduction Account Number) | Scan | For TDS on counsellor / vendor payments | CS | 🟡 | ⬜ |
| 2.3 | **GST Registration Certificate (GSTIN)** | PDF | Razorpay, Shiprocket, customer invoicing | CS | 🔴 | ⬜ |
| 2.4 | Confirm GST SAC codes include **998120** (Medical & dental services) OR **999321** (Medical laboratory services) | Screenshot from GST portal | If not present, file GST amendment (REG-14) | CS | 🔴 | ⬜ |
| 2.5 | MSME / Udyam Registration Certificate | PDF | Helpful for Razorpay (early-stage marker), faster bank loan if needed | CS | 🟡 | ⬜ |
| 2.6 | Professional Tax registration (if any directors / employees on payroll in Delhi) | PDF | Required by Delhi Shops & Establishment | CS | 🟢 | ⬜ |
| 2.7 | Shops & Establishment Registration (Delhi NCT) | PDF | Required for any commercial establishment in Delhi | CS | 🟡 | ⬜ |

---

## 3. Healthcare / industry-specific compliance

This is where Razorpay's "Healthcare > Diagnostic Center" reviewer focuses hardest.

| # | Document | Format | Why | Owner | Priority | Status |
|---|---|---|---|---|---|---|
| 3.1 | Signed **partner-lab agreement** with at least one NABL-accredited lab | PDF, both parties' signatures + company seals | This is the "Affiliation Certificate" Razorpay asks for. Without it, healthcare onboarding is rejected. | F + L | 🔴 | ⬜ |
| 3.2 | NABL accreditation certificate of the partner lab | PDF from the partner lab | Proves they're accredited; attach with agreement | F | 🔴 | ⬜ |
| 3.3 | Clinical Establishment Registration (Delhi) — for the partner lab OR for KYG's own sample-handling facility if applicable | PDF | Required under Delhi's Clinical Establishments rules | F + L | 🟡 | ⬜ |
| 3.4 | PCPNDT compliance affidavit | One-page affidavit on stamp paper, signed by director | Confirms KYG does not perform pre-natal sex determination. Strongly recommended even though we don't do it. | F + L | 🟡 | ⬜ |
| 3.5 | Biomedical Waste Authorisation — for the partner lab | PDF from partner lab | Lab is the one disposing samples; we attach it for completeness | F | 🟢 | ⬜ |
| 3.6 | Drug License (Form 20-B/21-B) | N/A — we don't sell drugs | If asked: explain we don't sell drugs, only diagnostic kits | — | 🟢 | — |
| 3.7 | Cover letter explaining the operating model | 1-page PDF on letterhead | Says: "KYG sells a sample-collection kit, partner lab processes, we deliver report. NABL lab partner = [Name]. Agreement attached." | F | 🔴 | ⬜ |

---

## 4. Director / authorised-signatory personal KYC

For the founder(s) who will be the authorised signatory on bank account, Razorpay, Shiprocket, etc.

| # | Document | Format | Why | Owner | Priority | Status |
|---|---|---|---|---|---|---|
| 4.1 | PAN card of authorised signatory | Scan, both sides | All integrations | F | 🔴 | ⬜ |
| 4.2 | Aadhaar — front and back | Scan | All integrations | F | 🔴 | ⬜ |
| 4.3 | Passport-size photo (recent) | JPG, plain background | Razorpay, banking | F | 🟡 | ⬜ |
| 4.4 | Personal address proof (utility bill / driving licence / passport) — if Aadhaar address differs | Scan | Banking, some courier KYC | F | 🟡 | ⬜ |
| 4.5 | Director Identification Number (DIN) | From MCA, share number only | Razorpay | F | 🟡 | ⬜ |
| 4.6 | DSC (Digital Signature Certificate) | .pfx file or token | For signing MCA filings, GST amendments | CS | 🟢 | ⬜ |

---

## 5. Banking

| # | Document | Format | Why | Owner | Priority | Status |
|---|---|---|---|---|---|---|
| 5.1 | Current account in **company name** (BFG Market Consult Pvt Ltd) | Bank welcome letter or recent statement | Razorpay payout, refunds, vendor payments. Personal savings account is auto-rejected. | F | 🔴 | ⬜ |
| 5.2 | Cancelled cheque from that account | Scan | Razorpay verifies account holder name matches company | F | 🔴 | ⬜ |
| 5.3 | Bank statement (last 3 months) | PDF | Razorpay may ask; banking required for higher transaction limits | F | 🟡 | ⬜ |
| 5.4 | IFSC code and account number of the company bank account | Plain text | Goes into Razorpay onboarding + our env config (refund payout) | F | 🔴 | ⬜ |
| 5.5 | UPI handle on the company account (if any) | e.g. kyg@hdfcbank | For UPI-based refund speed-up | F | 🟢 | ⬜ |

---

## 6. Razorpay-specific bundle

This is what gets uploaded to the Razorpay dashboard during onboarding. Cross-references items above.

| # | Item | From section | Status |
|---|---|---|---|
| 6.1 | Company PAN | 2.1 | ⬜ |
| 6.2 | GST Certificate | 2.3 | ⬜ |
| 6.3 | Certificate of Incorporation | 1.1 | ✅ |
| 6.4 | Cancelled cheque (current account) | 5.2 | ⬜ |
| 6.5 | Affiliation Certificate (partner-lab agreement + NABL cert + cover note) | 3.1 + 3.2 + 3.7 | ⬜ |
| 6.6 | Director PAN + Aadhaar | 4.1 + 4.2 | ⬜ |
| 6.7 | MSME / Udyam Certificate | 2.5 | ⬜ |
| 6.8 | Board resolution authorising payments | 1.4 | ⬜ |

See [resource/guidelines_razorpay.txt](../resource/guidelines_razorpay.txt) and [resource/guidelines_affiliate.txt](../resource/guidelines_affiliate.txt) for the full guidance.

---

## 7. Courier — Shiprocket OR Delhivery

Decision required first: which courier? (Recommended: Shiprocket for speed, switch to direct Delhivery in 1–2 months when volume justifies.)

### 7A. Shiprocket signup bundle

| # | Document | Format | Owner | Priority | Status |
|---|---|---|---|---|---|
| 7A.1 | Company PAN | scan | F | 🔴 | ⬜ |
| 7A.2 | GST Certificate | scan | F | 🔴 | ⬜ |
| 7A.3 | Cancelled cheque | scan | F | 🔴 | ⬜ |
| 7A.4 | Director Aadhaar + PAN | scan | F | 🔴 | ⬜ |
| 7A.5 | Pickup-location address proof (rent agreement or utility bill of warehouse/office) | PDF | F | 🔴 | ⬜ |
| 7A.6 | Pickup contact person — name + phone | text | O | 🔴 | ⬜ |
| 7A.7 | Estimated monthly shipment volume | text (rough range) | F | 🟡 | ⬜ |
| 7A.8 | Bank account details for COD settlements (not used by us but they ask) | text | F | 🟡 | ⬜ |

### 7B. Delhivery direct signup bundle

| # | Document | Format | Owner | Priority | Status |
|---|---|---|---|---|---|
| 7B.1 | Everything from 7A.1–7A.8 | — | F | 🔴 | ⬜ |
| 7B.2 | Monthly volume *commitment* (negotiable) | text | F | 🟡 | ⬜ |
| 7B.3 | Pickup-location *name* — exact string, becomes `Lab.pickupLocationName` in DB | text | O | 🔴 | ⬜ |
| 7B.4 | KAM (Key Account Manager) contact details once assigned | text | F | 🟡 | ⬜ |
| 7B.5 | Signed rate-card agreement | PDF | F | 🟡 | ⬜ |

---

## 8. Operational facility — kit dispatch origin

This is the address kits ship *from* and samples come *back* to. Becomes a `Lab` row in the DB.

| # | Item | Format | Why | Owner | Priority | Status |
|---|---|---|---|---|---|---|
| 8.1 | Physical address for kit dispatch / sample receipt | text | Becomes `Lab.addressLine`, `city`, `pincode` | O | 🔴 | ⬜ |
| 8.2 | Phone number reachable at that address (Mon–Sat) | text | Courier needs it for pickup coordination | O | 🔴 | ⬜ |
| 8.3 | Contact email for that facility | text | Goes on courier paperwork | O | 🔴 | ⬜ |
| 8.4 | Pickup window / working hours | text | Courier pickup scheduling | O | 🔴 | ⬜ |
| 8.5 | Kit packaging design — finalised | physical sample + PDF specs | Lets us order inventory | B + O | 🔴 | ⬜ |
| 8.6 | Initial kit inventory count and reorder threshold | text | Ops planning | O | 🟡 | ⬜ |

---

## 9. Partner lab + counsellor onboarding

| # | Item | Format | Owner | Priority | Status |
|---|---|---|---|---|---|
| 9.1 | NABL partner lab — legal name, registered address, contact | text | F | 🔴 | ⬜ |
| 9.2 | Partner lab MoU / service agreement, with TAT commitments and rate card per panel | PDF | F + L | 🔴 | ⬜ |
| 9.3 | Partner lab login contact (will become a `LabPartner` user in the system) | name + email + phone | F | 🟡 | ⬜ |
| 9.4 | Sample-handling SOP from the partner lab | PDF | helps QA | M | 🟡 | ⬜ |
| 9.5 | Genetic counsellor(s) — name, credentials (MSc Genetics / MD / Genetic Counselling cert), photo, languages, bio, session price | text + JPG | L + B | 🟡 | ⬜ |
| 9.6 | Counsellor empanelment agreement (rate, cancellation policy, IP terms) | PDF | F + L | 🟡 | ⬜ |
| 9.7 | Medical / clinical advisory board members — names, qualifications, MCI / state council registration numbers, photos, bios | text + JPG | F + M | 🟡 | ⬜ |

---

## 10. Brand and content assets

Everything that goes on the website that engineering can't generate.

| # | Item | Format | Owner | Priority | Status |
|---|---|---|---|---|---|
| 10.1 | Final logo files | SVG + PNG (transparent, light + dark variants) | B | 🔴 | ⬜ |
| 10.2 | Favicon | 32×32, 192×192, 512×512 PNG + ico | B | 🔴 | ⬜ |
| 10.3 | Open Graph / social-share images | 1200×630 PNG, one per major route | B | 🟡 | ⬜ |
| 10.4 | Brand colours, fonts | hex codes + font names | B | 🔴 | partial — already in Tailwind config |
| 10.5 | Homepage hero copy (final), tagline, CTAs | text | B | 🔴 | ⬜ |
| 10.6 | "Why KYG" differentiator copy | text | B | 🟡 | ⬜ |
| 10.7 | Founder / team photos and bios for `/about` | JPG + text | B + F | 🟡 | ⬜ |
| 10.8 | Sample report PDF (anonymised) — for the package detail "Sample Report Preview" | PDF | M + B | 🟡 | ⬜ |
| 10.9 | Customer testimonials (with consent to publish) | text + photo | B | 🟢 | ⬜ |
| 10.10 | Trust-signal logos: NABL, ISO 15189, CAP (if any) | PNG/SVG | B | 🟡 | ⬜ |
| 10.11 | Press / media coverage list | text | B | 🟢 | ⬜ |
| 10.12 | Initial 4–6 blog posts (for Sanity) — genetic literacy 101, how to read a report, etc. | Word/Google Doc | B | 🟡 | ⬜ |

---

## 11. Pricing and business-rule decisions

Engineering cannot guess these. Each one is a number / policy that goes into the DB or config.

| # | Decision | Owner | Priority | Status |
|---|---|---|---|---|
| 11.1 | Final price per package (in rupees, inclusive of GST or plus GST?) | F | 🔴 | partial — seed has placeholder prices |
| 11.2 | Kit shipping fee per package (`Package.kitShippingFee`) | F | 🔴 | ⬜ |
| 11.3 | TAT commitment per package (min and max days) | F + M | 🔴 | partial — seed has placeholder TAT |
| 11.4 | Refund window (hours / days), refund cuts (50% inside X hours, etc.) — already drafted but needs sign-off | F + L | 🔴 | drafted in [/refunds](../app/(site)/refunds/page.tsx), needs review |
| 11.5 | Counselling session price | F | 🟡 | ⬜ |
| 11.6 | First 50 customers — discount code, what it gives | F + B | 🟡 | ⬜ |
| 11.7 | Pincode opt-in list for launch (which pincodes accept orders) | O | 🔴 | ⬜ |
| 11.8 | Coupon strategy — first-order discount, referral discount, etc. | F + B | 🟡 | ⬜ |

---

## 12. Operational contact details (go into the site footer + legal pages)

The placeholder phone `+91 11 4000 0000` everywhere needs to be replaced.

| # | Item | Format | Owner | Priority | Status |
|---|---|---|---|---|---|
| 12.1 | Customer care phone number — live, answered during stated hours | E.164 format | O | 🔴 | ⬜ |
| 12.2 | Customer care email (e.g. `care@kyg.in`) — must be working | text + Google Workspace / Zoho mailbox set up | O | 🔴 | partial — used in legal pages |
| 12.3 | Partnerships email (e.g. `partners@kyg.in`) | text | O | 🟡 | partial |
| 12.4 | Press email (e.g. `press@kyg.in`) | text | O | 🟢 | partial |
| 12.5 | Grievance Officer — name + designation | text | F | 🔴 | ⬜ |
| 12.6 | Grievance Officer email (e.g. `grievance@kyg.in`) | text | F | 🔴 | partial |
| 12.7 | Working hours (e.g. Mon–Sat 09:00–19:00 IST) — confirm | text | O | 🟡 | partial |
| 12.8 | WhatsApp Business number (Razorpay reviewers also check this) | text | O | 🟡 | ⬜ |

---

## 13. Communication providers

| # | Item | Format | Owner | Priority | Status |
|---|---|---|---|---|---|
| 13.1 | WhatsApp Business API account — Gupshup OR Wati signup, KYC, GST | account credentials | F | 🔴 | ⬜ |
| 13.2 | WhatsApp HSM templates submitted for approval (Booking confirmed, Kit dispatched, Sample picked up, Report ready, OTP) | template text | O + E | 🔴 | ⬜ |
| 13.3 | WhatsApp display name approval (Facebook Business Verification) | account verification | F | 🟡 | ⬜ |
| 13.4 | Sender domain `kyg.in` verified in SendGrid / SES (SPF, DKIM, DMARC) | DNS records | E | 🔴 | ⬜ |
| 13.5 | Decide which email provider — SendGrid or AWS SES | text | F | 🔴 | ⬜ |
| 13.6 | SMS sender ID approval — TRAI DLT registration for transactional templates | TRAI registration | F | 🟡 | ⬜ |

---

## 14. Domain and hosting

| # | Item | Format | Owner | Priority | Status |
|---|---|---|---|---|---|
| 14.1 | Confirm domain ownership of `kyg.in` — in BFG Market Consult name, not personal | screenshot of registrar | F | 🔴 | ⬜ |
| 14.2 | Domain registrar login credentials (or share access) | account access | F | 🔴 | ⬜ |
| 14.3 | Cloudflare account — domain added, DNS managed | account access | F | 🔴 | ⬜ |
| 14.4 | VPS provider chosen (Hetzner / DigitalOcean / Linode / AWS Lightsail) | account access | F | 🔴 | ⬜ |
| 14.5 | Google Workspace / Zoho Mail for `@kyg.in` mailboxes | account access | F | 🔴 | ⬜ |

---

## 15. Third-party platform accounts (engineering will use them)

| # | Account | Why | Owner | Priority | Status |
|---|---|---|---|---|---|
| 15.1 | Razorpay merchant account (live mode) | payments | F | 🔴 | ⬜ |
| 15.2 | Cloudflare account (R2 bucket access) | report storage | F | 🔴 | ⬜ |
| 15.3 | Mappls account + production API key | geocoding | F | 🔴 | partial — dev key present |
| 15.4 | Google Cloud project — OAuth client for production redirect URI `https://kyg.in/api/auth/callback/google` | OAuth | F | 🔴 | partial — dev key present |
| 15.5 | Sanity project — production dataset, project ID | blog CMS | F | 🟡 | ⬜ |
| 15.6 | Google Search Console + Google Analytics 4 | SEO / analytics | F + B | 🟡 | ⬜ |
| 15.7 | Meta Business Manager — Instagram + Facebook Pages | marketing | B | 🟡 | ⬜ |
| 15.8 | Meta retargeting pixel ID | marketing | B | 🟡 | ⬜ |
| 15.9 | Sentry (or equivalent) | error monitoring | E | 🟡 | ⬜ |

---

## 16. Insurance and risk (optional but recommended)

| # | Item | Why | Owner | Priority | Status |
|---|---|---|---|---|---|
| 16.1 | Professional indemnity insurance | Covers misdiagnosis / report-error claims | F + L | 🟢 | ⬜ |
| 16.2 | Cyber-liability insurance | Covers data breach / DPDP penalties | F + L | 🟢 | ⬜ |
| 16.3 | Public liability insurance | Covers any in-person injury (Phase 2 phlebotomist model) | F + L | 🟢 | ⬜ |

---

## 17. Internal — for engineering reference

Things engineering needs to know but isn't a "document" per se.

| # | Item | Owner | Status |
|---|---|---|---|
| 17.1 | Confirm whether AUTH_SECRET in `.env` was ever used in production — if yes, rotate it before launch | F + E | ⬜ |
| 17.2 | Confirm what data exists in the lost Aiven DB — was there any production data we need to recover? | F | ⛔ |
| 17.3 | Should the report PDF carry the customer's full name and report number on every page footer? (compliance preference) | F + L | ⬜ |
| 17.4 | Should sample IDs be visible to the customer in their dashboard, or only the order number? | F | ⬜ |
| 17.5 | Decide on report retention period beyond customer account closure (DPDP requires statutory minimum only — current draft says 60 days post-closure) | F + L | ⬜ |

---

## Summary — what's red-line blocking launch

If you only collect 12 things, collect these:

1. ✅ Already done — CIN, registered address
2. ⬜ Company PAN (#2.1)
3. ⬜ GSTIN with correct SAC code (#2.3 + #2.4)
4. ⬜ MoA confirms diagnostic activity, or amendment filed (#1.2)
5. ⬜ Current bank account in company name + cancelled cheque (#5.1 + #5.2)
6. ⬜ Director PAN + Aadhaar (#4.1 + #4.2)
7. ⬜ Signed NABL partner-lab agreement (#3.1)
8. ⬜ Live customer-care phone + email + grievance officer (#12.1 + #12.2 + #12.5)
9. ⬜ Pricing locked per package (#11.1 + #11.2 + #11.3)
10. ⬜ Kit dispatch facility — address + contact + working hours (#8.1–8.4)
11. ⬜ Shiprocket or Delhivery account active with API token (#7A or #7B)
12. ⬜ Final logo + favicon + brand colours (#10.1–10.4)

Everything else can land in week 2 without delaying the soft launch.
