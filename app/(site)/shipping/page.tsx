import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Shipping & Delivery',
  description:
    'How KnowYourGenes delivers your test — we courier a sample-collection kit to your address, you collect at home, we arrange a reverse pickup, and the report lands in your account.',
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage title="Shipping & Delivery" updated="14 May 2026">
      <p>
        KnowYourGenes is a doorstep DNA-testing service that operates by post. When you place an order, we courier a
        sample-collection kit to your address. You collect your sample at home using the kit and the instructions
        included. We then arrange a reverse pickup, the sample travels to our partner NABL-accredited lab, and your
        report is delivered digitally to your KYG account and email.
      </p>
      <p>
        This page is published in compliance with Rule 6 of the Consumer Protection (E-Commerce) Rules, 2020, which
        requires us to disclose service-delivery timelines and modes.
      </p>

      <h2>1. Service area</h2>
      <p>
        We ship kits across India to pincodes serviced by our courier partner. The serviceability of your pincode is
        checked at checkout — if your pincode is not currently serviceable, the order will not be permitted and your
        card will not be charged. You may join the waitlist for your pincode from the same screen and we will notify you
        when we expand.
      </p>
      <p>
        At-home phlebotomist collection (where a trained professional visits your address to draw a blood sample) is on
        our future roadmap; it is not currently offered. Today every test uses a self-collected saliva or buccal swab
        sample.
      </p>

      <h2>2. What happens after you book</h2>
      <h3>Step 1 — Order confirmation</h3>
      <p>
        Within 5 minutes of successful payment you receive an email and WhatsApp confirmation containing your order ID,
        the contents of your order, and the expected kit-delivery window.
      </p>
      <h3>Step 2 — Kit dispatch</h3>
      <p>
        We hand the kit to our courier partner within 1 to 2 business days of order confirmation. You receive a tracking
        link by email and WhatsApp as soon as the AWB is generated.
      </p>
      <h3>Step 3 — Kit delivery</h3>
      <p>
        The courier delivers the kit to the address you entered at checkout, typically within 3 to 7 business days of
        dispatch depending on your pincode. Your kit contains a sealed collection tube or swab, an identification
        sticker, written instructions, and a pre-paid return label for the reverse shipment.
      </p>
      <h3>Step 4 — Self-collection at home</h3>
      <p>
        You collect your sample at home by following the instructions in the kit. Most users complete this step in under
        5 minutes. The instructions are also available in your KYG account under &ldquo;My orders&rdquo; if you misplace
        the printed copy.
      </p>
      <h3>Step 5 — Kit registration</h3>
      <p>
        Before scheduling the reverse pickup, you register your kit in your KYG account by entering the unique kit code
        printed on the identification sticker. This links your sample to your account and re-confirms your{' '}
        <Link href="/consent">Genetic Testing Consent</Link>.
      </p>
      <h3>Step 6 — Reverse pickup</h3>
      <p>
        After registration, you schedule the reverse pickup from your dashboard. Our courier partner collects the sealed
        kit from your address, typically within 1 to 2 business days of the request. Sample tubes are stable at room
        temperature for the duration of transit.
      </p>
      <h3>Step 7 — Lab processing</h3>
      <p>
        The sample reaches the partner NABL-accredited lab, typically within 3 to 7 business days of pickup, depending
        on your pincode. The lab processes the sample, generates the variant call file, and produces your interpretive
        report under the supervision of a reporting pathologist or clinical geneticist.
      </p>
      <h3>Step 8 — Report delivery</h3>
      <p>
        Your report is delivered via a secure link over email and WhatsApp, and is also available under &ldquo;My
        Reports&rdquo; in your KYG account.
      </p>

      <h2>3. Turnaround time</h2>
      <p>
        The end-to-end turnaround time (&ldquo;TAT&rdquo;) is the sum of kit dispatch, kit delivery, your own collection
        time, reverse pickup, and lab processing. The figure shown on each package page is the
        <strong> lab TAT only</strong> (from the date your sample reaches the lab to the date your report is delivered).
        Realistic end-to-end ranges per category:
      </p>
      <ul>
        <li>Wellness panels: 14 to 21 business days end-to-end</li>
        <li>Drug sensitivity: 14 to 21 business days end-to-end</li>
        <li>Cardiac panels: 18 to 28 business days end-to-end</li>
        <li>Cancer risk panels: 21 to 32 business days end-to-end</li>
        <li>Reproductive panels: 21 to 32 business days end-to-end</li>
        <li>Comprehensive bundles: up to 35 business days end-to-end</li>
      </ul>
      <p>
        TAT is indicative, not a guarantee. The largest source of variability is your own collection and
        pickup-scheduling step — please complete it promptly to keep your order on schedule. Clinically necessary lab
        steps (re-extraction, repeat sequencing, expert review) may also extend it. We proactively notify you of any
        expected delay over WhatsApp and email.
      </p>

      <h2>4. Tracking your order</h2>
      <p>
        Every transition is reflected in real time in your KYG account under &ldquo;My orders&rdquo;: order placed, kit
        dispatched (with AWB), kit delivered, kit registered, pickup scheduled, sample in transit, sample at lab, report
        ready. You also receive an email and WhatsApp message at each major milestone.
      </p>

      <h2>5. Rescheduling and rerouting</h2>
      <p>
        You can update the delivery address for your kit at no charge until the kit has been handed to the courier (Step
        2). After dispatch, address changes must be coordinated with the courier; redirection may not always be
        possible. Write to <a href="mailto:care@kyg.in">care@kyg.in</a> with your order ID for help.
      </p>
      <p>
        You can reschedule the reverse pickup up to the moment the courier is dispatched, at no charge, from your
        dashboard.
      </p>

      <h2>6. Can I buy for someone else?</h2>
      <p>
        Yes — you may buy a kit for a parent, child, partner, or friend. At the point of booking, you add the
        patient&rsquo;s details. The kit is shipped to the address you entered. The kit registration step on the
        dashboard captures the patient&rsquo;s consent. Reports are sent to the email and mobile number provided for the
        patient, unless you explicitly elect to receive them at the payer&rsquo;s contact for a minor or dependent
        adult.
      </p>

      <h2>7. What you do not receive</h2>
      <p>
        We do NOT post a printed report by default. If you specifically request a printed, notarised copy of your report
        for clinical use, we can courier it to your address for an additional fee on actuals — write to{' '}
        <a href="mailto:care@kyg.in">care@kyg.in</a>.
      </p>
      <p>We do NOT sell or ship physical merchandise, supplements, food, or drug products through the Platform.</p>

      <h2>8. Failed delivery, failed sample, or lost shipment</h2>
      <p>
        If the courier is unable to deliver the kit because the address is unreachable or no one is available, the kit
        will be re-attempted (up to two additional attempts) and then returned to origin. You may then either provide a
        corrected address (we will re-ship, postage at our cost the first time) or cancel under our{' '}
        <Link href="/refunds">Refund Policy</Link>.
      </p>
      <p>
        If a reverse-leg shipment is lost in transit, or the sample arrives at the lab degraded or in insufficient
        quantity to be processed (this happens for approximately 1 in 200 samples for reasons outside our control), we
        will dispatch a free re-collection kit. If you prefer not to re-collect, we refund 100%.
      </p>

      <h2>9. External factors</h2>
      <p>
        Service may be delayed or paused without prior notice in case of force majeure events: civil disturbance,
        natural disaster, government-mandated lockdowns, courier strikes, lab outages, or any other event outside our
        reasonable control. We will communicate the expected resumption time and offer a no-fee reschedule or full
        refund.
      </p>

      <h2>10. Contact</h2>
      <p>
        BFG Market Consult Private Limited (operating the KnowYourGenes brand)
        <br />
        SU 18, Pitam Pura, Delhi 110034, India
        <br />
        CIN: U74999DL2010PTC207582
        <br />
        Email: <a href="mailto:care@kyg.in">care@kyg.in</a>
        <br />
        Phone: <a href="tel:+911140000000">+91 11 4000 0000</a> (Mon&ndash;Sat, 09:00&ndash;19:00 IST)
      </p>
    </LegalPage>
  );
}
