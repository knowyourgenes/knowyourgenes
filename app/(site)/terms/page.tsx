import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms governing your use of KnowYourGenes (operated by BFG Market Consult Private Limited) &mdash; genetic testing, at-home sample collection, and counselling services.',
};

export default function TermsOfServicePage() {
  return (
    <LegalPage title="Terms of Service" updated="12 May 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the website kyg.in, the
        KnowYourGenes mobile/web application, and the genetic testing and counselling services offered under the
        KnowYourGenes brand (collectively, the &ldquo;Services&rdquo;). The Services are operated by{' '}
        <strong>BFG Market Consult Private Limited</strong>, a company incorporated under the Companies Act, 2013,
        bearing CIN U74999DL2010PTC207582, having its registered office at SU 18, Pitam Pura, Delhi 110034, India
        (&ldquo;KnowYourGenes&rdquo;, &ldquo;KYG&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;).
        &ldquo;KnowYourGenes&rdquo; is the consumer-facing brand under which BFG Market Consult Private Limited operates
        the Services.
      </p>
      <p>
        By creating an account, booking a test, accessing a report, or otherwise using the Services, you agree to be
        bound by these Terms. If you do not agree, do not use the Services.
      </p>

      <h2>1. Eligibility</h2>
      <p>You may use the Services only if:</p>
      <ul>
        <li>you are at least 18 years old and competent to enter into a binding contract under Indian law; or</li>
        <li>you are the parent or legal guardian of a minor and are booking on the minor&rsquo;s behalf; or</li>
        <li>you are an authorised attorney-in-fact for an adult unable to provide consent themselves.</li>
      </ul>
      <p>
        You must be located in the Republic of India to use the Services. We ship kits to pincodes serviced by our
        courier partners; see <Link href="/shipping">Shipping &amp; Delivery</Link> for the live serviceability check.
      </p>

      <h2>2. What we provide</h2>
      <p>The Services consist of:</p>
      <ul>
        <li>
          A sample-collection kit (saliva or buccal swab) couriered to your address, with a pre-paid return label for
          the reverse shipment;
        </li>
        <li>Laboratory processing of the sample at an NABL-accredited partner lab;</li>
        <li>A genetic report containing variant-level findings and wellness or condition-relevant interpretation;</li>
        <li>Optional pre-test and post-test genetic counselling.</li>
      </ul>
      <p>
        At-home phlebotomist collection (where a trained professional draws a blood sample at your address) is on our
        future roadmap; it is not currently offered.
      </p>
      <p>The Services do NOT include:</p>
      <ul>
        <li>A medical diagnosis;</li>
        <li>A treatment recommendation;</li>
        <li>A prediction of any specific future disease or health outcome.</li>
      </ul>
      <p>
        The genetic report is an informational and investigational tool to support, not replace, the judgement of a
        qualified healthcare professional.
      </p>

      <h2>3. Medical disclaimer</h2>
      <p>This section reproduces and incorporates the KnowYourGenes Legal Disclaimer that appears on every report.</p>
      <p>
        The Services and any report generated through them are based on a unique DNA analysis conducted from your
        provided sample, focused on a selected panel of genes associated with general health and wellness traits. We
        provide genetic testing services strictly for informational and investigational purposes only. The insights and
        suggestions presented in any report are not intended to replace professional medical advice, diagnosis, or
        treatment.
      </p>
      <p>
        Reports are designed to be interpreted exclusively by qualified and licensed professionals, including but not
        limited to medical practitioners, clinical geneticists, registered dietitians, certified nutritionists, wellness
        consultants, and other licensed healthcare professionals. KnowYourGenes does not practice medicine, and a report
        does not constitute a medical or diagnostic document, nor should it be used as the sole basis for any clinical
        decisions.
      </p>
      <p>
        Although genetic information is unique to each individual, its interpretation is inherently probabilistic and
        must be considered alongside clinical context and other health assessments. The insights presented herein are
        not predictive of any specific future disease or health outcome. Any health-related decisions, treatment
        changes, or lifestyle modifications based on a report must be undertaken only after consultation with an
        appropriately qualified healthcare professional. In cases of existing medical conditions or ongoing treatment,
        further testing from accredited medical laboratories or hospitals is strongly advised before acting on any
        information in a report.
      </p>
      <p>
        While KnowYourGenes provides general wellness-oriented recommendations, these do not account for your complete
        medical history, existing conditions, allergies, medications, or ongoing treatments, even if such information
        has been shared with us.
      </p>
      <p>
        KnowYourGenes does not perform pre-natal sex determination, and the Services may not be used for any purpose
        prohibited under the Pre-Conception and Pre-Natal Diagnostic Techniques (Prohibition of Sex Selection) Act, 1994
        (&ldquo;PCPNDT Act&rdquo;). Genetic counselling relating to reproductive panels is offered strictly in
        accordance with the PCPNDT Act and applicable medical ethics guidelines.
      </p>

      <h2>4. Account, booking and payment</h2>
      <h3>A. Account</h3>
      <p>
        You must register an account with accurate name, mobile number and email. You are responsible for keeping your
        login secure. Notify us immediately at <a href="mailto:care@kyg.in">care@kyg.in</a> if you suspect unauthorised
        access.
      </p>
      <h3>B. Booking</h3>
      <p>
        Bookings are confirmed only after successful payment and pincode serviceability check. We may decline or
        reschedule a booking if the address falls outside our current service area, if the requested slot is
        unavailable, or if we are otherwise unable to fulfil the order.
      </p>
      <h3>C. Payments</h3>
      <p>
        Payments are processed by Razorpay or another PCI-DSS compliant payment processor. Invoices include GST as
        applicable. You authorise us to charge the payment instrument used at checkout for the amount displayed at
        confirmation.
      </p>
      <h3>D. Pricing</h3>
      <p>
        Prices on the Platform include GST unless stated otherwise. We may change prices at any time, but a confirmed
        booking is honoured at the price you paid.
      </p>

      <h2>5. Sample collection</h2>
      <p>By placing an order, you agree to:</p>
      <ul>
        <li>Provide an accurate delivery address at which the kit can be received;</li>
        <li>
          Collect your sample at home, following the instructions enclosed in the kit. Most collections take under 5
          minutes.
        </li>
        <li>
          Register the kit in your KYG account using the unique kit code on the identification sticker, and re-confirm
          your Genetic Testing Consent at that point;
        </li>
        <li>Schedule the reverse pickup promptly so the sample is not delayed in transit;</li>
        <li>
          Not adulterate, mishandle, or substitute the sample. Sample integrity is your responsibility from delivery to
          reverse pickup.
        </li>
      </ul>
      <p>
        If the kit cannot be delivered, the sample cannot be collected, or the sample arrives at the lab in a state that
        cannot be processed, the order is handled under our <Link href="/refunds">Refund Policy</Link> &mdash; typically
        by dispatching a free re-collection kit.
      </p>

      <h2>6. Reports</h2>
      <p>
        Reports are typically delivered within the turnaround time stated on the package page, from the date of sample
        receipt at the lab. Turnaround time is indicative; clinically necessary delays (for example, a sample needing
        re-collection) may extend it.
      </p>
      <p>
        Reports are delivered to you over the Platform and a secure email link. You may share a report with a healthcare
        professional of your choice. KnowYourGenes does not deliver reports to third parties on your behalf without
        separate written consent.
      </p>

      <h2>7. Intellectual property</h2>
      <p>
        All content on the Platform &mdash; text, images, logos, software, report templates, scientific commentary, and
        the KnowYourGenes name and marks &mdash; is owned by BFG Market Consult Private Limited or licensed to us, and
        is protected by Indian and international intellectual property law.
      </p>
      <p>
        You retain ownership of your biological sample and the raw genetic data derived from it. You grant us a
        non-exclusive licence to use this data solely to deliver the Services to you. Any other use (for example,
        research aggregation) requires your separate, opt-in consent.
      </p>
      <p>You may not:</p>
      <ul>
        <li>reverse engineer or scrape the Platform;</li>
        <li>reproduce the report template or interpretive content for redistribution;</li>
        <li>use the KnowYourGenes name or marks without written permission.</li>
      </ul>

      <h2>8. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          submit a sample that is not yours, unless you are the parent or legal guardian or have written authorisation;
        </li>
        <li>impersonate another person;</li>
        <li>
          misuse the Services for unlawful purposes including pre-natal sex determination, paternity disputes, or any
          purpose prohibited under Indian law;
        </li>
        <li>introduce malware or attempt to compromise the Platform;</li>
        <li>use the Services to make defamatory statements about KnowYourGenes or any third party.</li>
      </ul>
      <p>We may suspend or terminate access for any breach.</p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by applicable law, BFG Market Consult Private Limited, its affiliates, officers,
        employees, agents and representatives shall not be liable for any claims, demands, losses, liabilities, damages
        or expenses (whether direct, indirect, incidental, consequential, special, punitive, or exemplary) arising out
        of or related to the use of, misuse of, reliance upon, or inability to use any information, recommendation, or
        service provided through the Platform or any report.
      </p>
      <p>
        This limitation applies regardless of the legal theory under which liability is asserted, including contract,
        tort (including negligence), strict liability, or otherwise, and includes but is not limited to loss of data,
        income, profit, business opportunity, or personal injury.
      </p>
      <p>Nothing in this clause excludes liability for:</p>
      <ul>
        <li>death or personal injury caused by our proven negligence;</li>
        <li>fraud or fraudulent misrepresentation;</li>
        <li>
          any liability that cannot be excluded under Indian law, including under the Consumer Protection Act, 2019.
        </li>
      </ul>
      <p>
        To the extent our liability is not validly excluded, our aggregate liability to you under or in connection with
        these Terms is limited to the amount actually paid by you to KnowYourGenes for the specific Service that gave
        rise to the claim.
      </p>

      <h2>10. Indemnity</h2>
      <p>
        You will indemnify and hold BFG Market Consult Private Limited and its representatives harmless from any claim
        or demand, including reasonable legal fees, arising from your breach of these Terms, your violation of
        applicable law, your misuse of the Services, or your submission of another person&rsquo;s sample without
        authorisation.
      </p>

      <h2>11. Third-party services</h2>
      <p>
        The Platform integrates third-party services (payment, messaging, analytics, hosting). Your use of those is also
        governed by their respective terms. KnowYourGenes is not responsible for outages or failures of third-party
        services beyond our reasonable control.
      </p>

      <h2>12. Consumer rights</h2>
      <p>
        Nothing in these Terms limits any statutory right you have as a consumer under the Consumer Protection Act, 2019
        or any other applicable law. If anything in these Terms conflicts with such a right, the statutory right
        prevails.
      </p>

      <h2>13. Termination</h2>
      <p>
        You may close your account at any time from your profile. KnowYourGenes may terminate or suspend access for
        breach of these Terms, for legal or regulatory reasons, or if we discontinue the Services with reasonable prior
        notice. On termination, the rights and obligations that by their nature should survive (medical disclaimer, IP,
        liability, indemnity, governing law) continue to apply.
      </p>

      <h2>14. Changes</h2>
      <p>
        We may modify these Terms. Material changes will be notified by email and a banner in the Platform at least 14
        days before they take effect. Continued use after that date constitutes acceptance.
      </p>

      <h2>15. Governing law &amp; dispute resolution</h2>
      <p>
        These Terms are governed by the laws of India. The parties shall first attempt to resolve any dispute through
        good-faith negotiation, escalated if necessary to mediation. Failing that, disputes shall be referred to
        arbitration under the Arbitration and Conciliation Act, 1996, conducted by a sole arbitrator at New Delhi, in
        English. Subject to arbitration, the courts at New Delhi shall have exclusive jurisdiction.
      </p>

      <h2>16. Contact</h2>
      <p>
        BFG Market Consult Private Limited (operating the KnowYourGenes brand)
        <br />
        CIN: U74999DL2010PTC207582
        <br />
        SU 18, Pitam Pura, Delhi 110034, India
        <br />
        Email: <a href="mailto:care@kyg.in">care@kyg.in</a>
        <br />
        Phone: <a href="tel:+911140000000">+91 11 4000 0000</a> (Mon&ndash;Sat, 09:00&ndash;19:00 IST)
        <br />
        Grievance Officer (DPDP Act): <a href="mailto:grievance@kyg.in">grievance@kyg.in</a>
      </p>
    </LegalPage>
  );
}
