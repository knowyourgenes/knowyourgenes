================================================================
LEGAL PAGES — README
For: KnowYourGenes (kyg.in) Razorpay onboarding + general compliance
Last updated: 2026-05-12
================================================================

OPERATING ENTITY (CONFIRMED)
----------------------------
KnowYourGenes is a brand operated by:

  Legal Entity   : BFG Market Consult Private Limited
  CIN            : U74999DL2010PTC207582
  RoC            : Registrar of Companies, NCT of Delhi & Haryana
  Date of Inc.   : 20 August 2010
  Registered     : SU 18, Pitam Pura, Delhi 110034, India
    Office
  GSTIN          : [GSTIN — fill in before publishing]

IMPORTANT — ACTIVITY / OBJECTS CLAUSE
The CIN class code "U74999" is "Other business activities NEC" —
a generic consulting/services classification, NOT a healthcare /
diagnostic class. Before submitting to Razorpay and before launch:

  1. Confirm with your CS that the Memorandum of Association's
     Main Objects (or Other Objects) clause covers genetic
     testing / diagnostic / health-related services. If it does
     not, file Form MGT-14 to amend the MoA — this can take
     several weeks.
  2. Confirm that GST registration includes the relevant SAC
     code(s) — typically SAC 998120 (Medical and dental services)
     or 999321 (Medical laboratory services). If not, add them
     via GST amendment.
  3. Be ready to provide a one-page covering note to Razorpay
     explaining that BFG Market Consult Pvt Ltd is the operating
     entity and KnowYourGenes is the consumer brand for its
     diagnostic-services line. Attach your partner-lab agreement
     so the reviewer sees the NABL-accredited fulfilment chain.

If activity coverage in MoA / GST is unclear, the safest path is to
incorporate a separate Pvt Ltd entity specifically for the
diagnostic line. Discuss with your CS / CA before deciding.


REMAINING PLACEHOLDERS TO FILL
------------------------------
Across the eight legal files, these placeholders remain:

  [GSTIN]                  -> appears in contact_us, about_us
  [GRIEVANCE OFFICER NAME] -> privacy_policy section 14, contact_us
                              (any founder/COO is fine for launch)

Phone number — the footer currently shows +91 11 4000 0000 as a
placeholder. Replace with your live care number before launch
(features.txt dev-calendar item #13 tracks this).


================================================================

WHAT'S IN THIS BUNDLE
---------------------
  legal_privacy_policy.txt    -> /privacy
  legal_terms_of_service.txt  -> /terms
  legal_refund_policy.txt     -> /refunds
  legal_shipping_policy.txt   -> /shipping  (Razorpay calls this
                                 "Shipping & Delivery", required even
                                 though we send a phlebotomist, not a
                                 courier — Razorpay does NOT accept a
                                 footer link that 404s here)
  legal_contact_us.txt        -> /contact   (content for the page —
                                 the contact FORM is a separate spec
                                 item from features.txt)
  legal_about_us.txt          -> /about
  legal_consent.txt           -> /consent   (genetic testing consent —
                                 the existing footer link expects this)

These are now mostly populated with the confirmed entity details
above. Footer + contact + about all explicitly state that
"KnowYourGenes is a brand operated by BFG Market Consult Private
Limited" — keep that disclosure on every legal page so the
brand/entity relationship is unambiguous to Razorpay and to
consumers under the Consumer Protection (E-Commerce) Rules, 2020.

Note on your existing report Legal Disclaimer: replace every
reference to "Digitally Next" in the report template with
"Know Your Genes" (signed as "BFG Market Consult Private Limited,
operating the Know Your Genes brand") so the language on reports
matches the language on the website, Razorpay merchant record,
GST registration and bank account. Mismatched signatures across
legal documents and reports is a common rejection trigger.


SOURCES / BENCHMARKS USED
-------------------------
  - Your existing Legal Disclaimer (verbatim language preserved
    where appropriate, especially in the medical / liability
    sections of Terms and Consent).
  - Xcode Life / xcode.in — refund policy (50% / 14-day refund
    window), data localization, raw-data deletion right.
  - Mapmygenome — de-identified sample handling, LIMS storage,
    research-consent model.
  - Indian statutes referenced: DPDP Act, 2023 (privacy basis);
    Drugs and Magic Remedies (Objectionable Advertisements) Act,
    1954 (medical-claim limits); PCPNDT Act, 1994 (no
    sex-determination — KYG doesn't do this, but the policy says
    so explicitly); Clinical Establishments Act, 2010;
    Consumer Protection (E-Commerce) Rules, 2020 (mandatory
    grievance officer + return/refund disclosure).


DIFFERENCES FROM XCODE / MAPMYGENOME (DELIBERATE)
-------------------------------------------------
  - Service area: ours is Delhi NCR only at launch (D2C
    at-home phlebotomist collection — not a mail-in kit).
    This shapes the Shipping Policy completely — kit shipping
    sections from competitors do not apply.
  - Refund policy is more user-friendly than Xcode's 50% / 14-day
    rule, because we control the entire chain (collection through
    report) and can verify deficient service ourselves.
  - Privacy section on genetic data is stricter than competitors:
    DPDP Act, 2023 is in force at launch, and we explicitly call
    out "no sale / no insurance-marketing use" of genetic data —
    this is also a Razorpay credibility signal.
  - Cancer / reproductive panels mean stronger medical disclaimers
    than a pure wellness-focused competitor needs. Your existing
    Legal Disclaimer language is carried into Terms + Consent
    largely intact.


REVIEW BEFORE PUBLISHING
------------------------
Have a lawyer practising in Delhi review these for one thing
specifically: any state-level Clinical Establishments Act variation
applicable to Delhi NCR and any addendum needed under PCPNDT for
reproductive-category panels (the act is most often triggered by
prenatal sex determination, which we don't do, but reviewer
should confirm).

================================================================
