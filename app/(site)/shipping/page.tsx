import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Shipping & Delivery',
  description:
    'How KnowYourGenes delivers its service &mdash; at-home phlebotomist collection across Delhi NCR, turnaround time per panel, and digital report delivery.',
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage title="Shipping & Delivery" updated="12 May 2026">
      <p>
        KnowYourGenes is a doorstep genetic testing service. We do not ship a &ldquo;kit&rdquo; to your home for you to
        collect and post back. A trained KYG phlebotomist visits your address, collects the sample, transports it to our
        partner NABL-accredited lab, and we deliver your report digitally. This page describes how that end-to-end
        service works and the timelines you should expect.
      </p>
      <p>
        This page is also published in compliance with Rule 6 of the Consumer Protection (E-Commerce) Rules, 2020, which
        requires us to disclose service-delivery timelines and modes.
      </p>

      <h2>1. Service area</h2>
      <p>At launch, KnowYourGenes serves the following region:</p>
      <ul>
        <li>
          Delhi National Capital Region (Delhi NCR) &mdash; Delhi, Gurugram, Noida, Greater Noida, Ghaziabad, Faridabad.
        </li>
      </ul>
      <p>
        The exact list of serviceable pincodes is enforced at checkout. If your pincode is not serviceable, the order
        will not be permitted and your card will not be charged. You may join the waitlist for your pincode from the
        same screen and we will notify you when we expand.
      </p>

      <h2>2. What happens after you book</h2>
      <h3>Step 1 &mdash; Confirmation</h3>
      <p>
        Within 5 minutes of successful payment you receive a booking confirmation over email and WhatsApp, with your
        order ID, selected time slot and the agent assignment status.
      </p>
      <h3>Step 2 &mdash; Agent assignment</h3>
      <p>
        By the morning of your collection slot (or at least 2 hours before, whichever is later), a trained phlebotomist
        is assigned to your booking. You receive their name, photo, and contact number over WhatsApp.
      </p>
      <h3>Step 3 &mdash; Visit</h3>
      <p>
        The phlebotomist arrives at your address within the selected slot window. You will be asked to verify identity
        (photo ID), sign a digital consent form, and confirm any pre-collection instructions (e.g., fasting status) you
        were given.
      </p>
      <h3>Step 4 &mdash; Sample collection</h3>
      <p>
        Collection takes 10 to 20 minutes depending on sample type (saliva swab or venous blood). The phlebotomist
        follows standard biosafety protocols.
      </p>
      <h3>Step 5 &mdash; Lab transit</h3>
      <p>
        The sample is labelled with a de-identified accession number, placed in a temperature-controlled transport
        container, and delivered to the partner NABL lab the same day or by the following morning.
      </p>
      <h3>Step 6 &mdash; Lab processing</h3>
      <p>
        The lab processes the sample, generates the variant call file, and interprets it under the supervision of a
        reporting pathologist / clinical geneticist.
      </p>
      <h3>Step 7 &mdash; Report delivery</h3>
      <p>
        Your report is delivered via a secure link over email and WhatsApp, and is also available under &ldquo;My
        Reports&rdquo; in your KYG account.
      </p>

      <h2>3. Turnaround time</h2>
      <p>
        The turnaround time (&ldquo;TAT&rdquo;) shown on each package page is the period from sample receipt at the lab
        to report delivery. Typical ranges by category:
      </p>
      <ul>
        <li>Wellness panels: 10 to 14 business days</li>
        <li>Drug sensitivity: 10 to 14 business days</li>
        <li>Cardiac panels: 12 to 18 business days</li>
        <li>Cancer risk panels: 14 to 21 business days</li>
        <li>Reproductive panels: 14 to 21 business days</li>
        <li>Comprehensive bundles: up to 28 business days</li>
      </ul>
      <p>
        TAT is indicative, not a guarantee. Clinically necessary steps (re-extraction, repeat sequencing, expert review)
        may extend it. We proactively notify you of any expected delay over WhatsApp and email.
      </p>

      <h2>4. Rescheduling</h2>
      <p>You can reschedule a confirmed booking at no charge:</p>
      <ul>
        <li>Up to 4 hours before the slot &mdash; self-service from your order page.</li>
        <li>
          Inside 4 hours &mdash; by writing to <a href="mailto:care@kyg.in">care@kyg.in</a> or replying to your booking
          WhatsApp. We will accommodate where possible; no fee.
        </li>
      </ul>
      <p>
        If a phlebotomist arrives and you are unavailable, this counts as a no-show and the cancellation rules in our{' '}
        <Link href="/refunds">Refund Policy</Link> apply.
      </p>

      <h2>5. Can I buy for someone else?</h2>
      <p>
        Yes &mdash; you may book and pay for a parent, child, partner, or friend. At the point of booking, you will be
        asked to add the patient&rsquo;s details. The phlebotomist will verify the patient&rsquo;s ID, not the
        payer&rsquo;s, on arrival. Reports are sent to the email and mobile number provided for the patient, unless you
        explicitly elect to receive them at the payer&rsquo;s contact for a minor or dependent adult.
      </p>

      <h2>6. What you do not receive by courier</h2>
      <p>
        We do NOT mail you a self-collection kit. We do NOT post a printed report by default. If you specifically
        request a printed, notarised copy of your report for clinical use, we can courier it to a Delhi NCR address for
        an additional fee on actuals &mdash; write to <a href="mailto:care@kyg.in">care@kyg.in</a>.
      </p>
      <p>We do NOT sell or ship physical merchandise, supplements, or any food / drug product through the Platform.</p>

      <h2>7. Failed collection</h2>
      <p>If we cannot collect your sample on the scheduled date because:</p>
      <ul>
        <li>the address is unreachable or you are not present, OR</li>
        <li>the photo ID does not match the patient on the booking, OR</li>
        <li>you are unwell in a manner that makes collection unsafe,</li>
      </ul>
      <p>
        the visit is treated as a no-show under our <Link href="/refunds">Refund Policy</Link>. We will offer to
        reschedule within 7 days.
      </p>

      <h2>8. External factors</h2>
      <p>
        Service may be delayed or paused without prior notice in case of force majeure events: civil disturbance,
        natural disaster, government-mandated lockdowns, lab outages, or any other event outside our reasonable control.
        We will communicate the expected resumption time and offer a no-fee reschedule or full refund.
      </p>

      <h2>9. Contact</h2>
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
