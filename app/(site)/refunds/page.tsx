import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy',
  description:
    'KnowYourGenes refund and cancellation policy &mdash; when refunds are issued, when they are not, refund timelines, and how to request one.',
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund & Cancellation Policy" updated="12 May 2026">
      <p>
        This Refund &amp; Cancellation Policy applies to all bookings made on kyg.in or the KnowYourGenes app. It is
        published in compliance with Rule 5(3) of the Consumer Protection (E-Commerce) Rules, 2020. By making a payment
        on the Platform, you agree to this policy.
      </p>
      <p>
        We have written this policy plainly. The goal is that you should not have to read it twice to know where you
        stand.
      </p>

      <h2>1. Cancellation by you (before sample collection)</h2>
      <p>You may cancel a booking yourself from your order page at any time before the phlebotomist is dispatched.</p>
      <ul>
        <li>
          <strong>Cancelled at least 4 hours before the scheduled slot:</strong> Full refund (100%) to the original
          payment method.
        </li>
        <li>
          <strong>Cancelled between 1 and 4 hours before the slot:</strong> Refund of the booking amount less a flat
          &#8377;200 dispatch coordination fee, refunded to the original payment method.
        </li>
        <li>
          <strong>Cancelled less than 1 hour before the slot, OR no-show (you are unavailable at the address):</strong>{' '}
          Refund of 50% of the booking amount. The remaining 50% is retained as a phlebotomist visit cost.
        </li>
        <li>
          <strong>Cancellation after the sample has been collected and sent to the lab:</strong> Not eligible for
          refund. Lab processing has begun.
        </li>
      </ul>

      <h2>2. Cancellation by us</h2>
      <p>We will issue a full refund (100%) without any deduction if:</p>
      <ul>
        <li>We are unable to dispatch a phlebotomist to your pincode.</li>
        <li>The slot you booked becomes unavailable and you do not wish to reschedule.</li>
        <li>Our partner lab is unable to process the test type you selected.</li>
        <li>
          We discover at intake that you are below 18 with no parent/guardian present, or the photo ID does not match
          &mdash; and you choose not to proceed under a corrected booking.
        </li>
      </ul>
      <p>
        If we cancel at any point after sample collection (for example, lab error, sample contamination, sequencing
        failure), we will at your option either re-collect at no charge or refund 100% of the amount paid.
      </p>

      <h2>3. Sample integrity issues</h2>
      <p>
        Approximately 1 in 200 samples cannot be processed due to factors outside our control (insufficient DNA yield,
        contamination during transport, etc.). In these cases:
      </p>
      <ul>
        <li>We will contact you within 5 business days of the sample reaching the lab.</li>
        <li>We will offer a free re-collection at a slot of your choice.</li>
        <li>If you prefer not to re-collect, we will refund 100%.</li>
      </ul>

      <h2>4. Refund of reports</h2>
      <p>
        A genetic report cannot be &ldquo;returned&rdquo;. We do not refund a delivered report based solely on the
        customer&rsquo;s interpretation of the findings, dissatisfaction with the result, or a change of mind. Refunds
        against a delivered report are limited to:
      </p>
      <ul>
        <li>
          <strong>Deficiency in the report</strong> (incorrect biomarker reported, missing section, data corruption):
          full or partial refund at our discretion after review, plus re-issue of the corrected report at no charge.
        </li>
        <li>
          <strong>Late delivery</strong> beyond the stated turnaround time without our proactive communication: at your
          option, a 25% partial refund and the report when ready, or 100% refund and we abandon the order.
        </li>
        <li>
          <strong>Demonstrable laboratory error:</strong> 100% refund and free re-collection.
        </li>
      </ul>
      <p>
        Report-related refund claims must be raised within 7 calendar days of report delivery, by writing to{' '}
        <a href="mailto:care@kyg.in">care@kyg.in</a> with a description of the issue.
      </p>

      <h2>5. Refund timeline &amp; method</h2>
      <ul>
        <li>Refund processing is initiated within 3 business days of eligibility being confirmed.</li>
        <li>
          Refunds are issued to the original payment method used at checkout. UPI and net banking refunds typically
          reflect in 5&ndash;7 business days; card refunds may take up to 10 business days depending on the issuing
          bank.
        </li>
        <li>
          If the original method is not available (for example, the card has expired), we will request alternative bank
          details and refund via NEFT/UPI.
        </li>
        <li>We do not refund through cheque or cash.</li>
      </ul>

      <h2>6. Coupons &amp; discounts</h2>
      <ul>
        <li>
          Refunded amounts are net of any coupon, promotional discount, or store credit that was applied to the original
          payment.
        </li>
        <li>
          A used coupon is restored to your account only if the booking is fully cancelled by us before sample
          collection.
        </li>
        <li>
          Store credit issued by KYG (for example, as goodwill or referral reward) is non-refundable to a bank account.
        </li>
      </ul>

      <h2>7. Pre-test / post-test counselling</h2>
      <p>
        Counselling sessions are non-refundable once held. If you cancel a scheduled counselling session at least 12
        hours in advance, the session is rescheduled at no charge. A no-show or cancellation inside 12 hours forfeits
        the session fee.
      </p>

      <h2>8. How to request a refund</h2>
      <p>You can request a refund or cancellation in two ways:</p>
      <ul>
        <li>
          From your order page on kyg.in or the app, using the &ldquo;Cancel order&rdquo; or &ldquo;Report an
          issue&rdquo; button.
        </li>
        <li>
          By writing to <a href="mailto:care@kyg.in">care@kyg.in</a> with your order ID, registered mobile number, and a
          brief description of the reason.
        </li>
      </ul>
      <p>We will acknowledge your request within 1 business day and confirm the outcome within 5 business days.</p>

      <h2>9. Escalation</h2>
      <p>
        If you are not satisfied with how a refund request has been handled, write to{' '}
        <a href="mailto:grievance@kyg.in">grievance@kyg.in</a>. Our Grievance Officer will review and respond within 15
        days. You retain all your statutory rights under the Consumer Protection Act, 2019.
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
        <br />
        Grievance: <a href="mailto:grievance@kyg.in">grievance@kyg.in</a>
      </p>

      <p className="mt-10 text-sm text-muted-foreground">
        See also: <Link href="/shipping">Shipping &amp; Delivery</Link> &middot;{' '}
        <Link href="/terms">Terms of Service</Link>
      </p>
    </LegalPage>
  );
}
