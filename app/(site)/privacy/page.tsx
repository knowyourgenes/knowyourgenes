import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How KnowYourGenes (operated by BFG Market Consult Private Limited) collects, uses, stores and protects your personal and genetic data.',
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="12 May 2026">
      <p>
        &ldquo;KnowYourGenes&rdquo; (also &ldquo;KYG&rdquo;) is a brand operated by BFG Market Consult Private Limited
        (CIN U74999DL2010PTC207582, registered office SU 18, Pitam Pura, Delhi 110034). References in this policy to
        &ldquo;KnowYourGenes&rdquo;, &ldquo;KYG&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; mean
        BFG Market Consult Private Limited operating under the KnowYourGenes brand.
      </p>
      <p>
        We operate the website <strong>kyg.in</strong> and the related mobile/web application (together, the
        &ldquo;Platform&rdquo;), through which we offer at-home sample collection and genetic testing services across
        Delhi NCR.
      </p>
      <p>
        This Privacy Policy explains what personal information, sensitive personal information and genetic data we
        collect, how we use it, who we share it with, how long we keep it, and the rights you have over it. It is
        published in compliance with the Digital Personal Data Protection Act, 2023 (&ldquo;DPDP Act&rdquo;), the
        Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information)
        Rules, 2011 (&ldquo;SPDI Rules&rdquo;), and the Consumer Protection (E-Commerce) Rules, 2020.
      </p>

      <h2>1. Scope</h2>
      <p>This policy applies to everyone who:</p>
      <ul>
        <li>visits kyg.in or any KYG sub-domain,</li>
        <li>creates a KYG account,</li>
        <li>books a test or has a sample collected by a KYG phlebotomist,</li>
        <li>receives or accesses a KYG report, or</li>
        <li>interacts with KYG support, marketing or counselling channels.</li>
      </ul>
      <p>
        By using the Platform or booking a service, you confirm that you have read and understood this policy. If you
        are booking on behalf of another individual, you confirm you are authorised to share their information with us
        and to receive communications about them.
      </p>

      <h2>2. What we collect</h2>
      <p>
        We collect only what is necessary for the services you have asked for, fraud prevention, statutory compliance,
        and improving the Platform.
      </p>
      <h3>A. Identifiers and contact details</h3>
      <p>Full name, date of birth, sex assigned at birth, gender, email, mobile number, postal address with pincode.</p>
      <h3>B. Account and transaction data</h3>
      <p>
        Login credentials (passwords are hashed; we never see them in plaintext), order history, cart contents, coupon
        use, billing details, payment status. Card and bank details are handled by Razorpay and never stored on KYG
        servers.
      </p>
      <h3>C. Health and lifestyle questionnaire data (&ldquo;Health Information&rdquo;)</h3>
      <p>
        Self-reported medical history, family history, current medications, allergies, dietary habits, lifestyle
        factors, and any context you choose to share with a counsellor.
      </p>
      <h3>D. Genetic data (&ldquo;Genetic Data&rdquo;)</h3>
      <p>
        The biological sample (saliva / blood) collected by our phlebotomist, the DNA sequence variants generated from
        it, and the downstream interpretive output. Genetic Data is &ldquo;sensitive personal information&rdquo; under
        the SPDI Rules and is treated as such.
      </p>
      <h3>E. Device and usage data</h3>
      <p>
        IP address, browser, device, operating system, referrer, pages visited, session timing, and crash logs.
        Collected via first-party analytics (and Google Analytics 4 if you have not opted out) for product analytics and
        security.
      </p>
      <h3>F. Location data</h3>
      <p>
        The pincode and full address required to dispatch a phlebotomist. We do not track real-time location of users.
        Our phlebotomist&rsquo;s location is tracked only during an active collection appointment, for safety and
        dispatch.
      </p>
      <h3>G. Communications</h3>
      <p>
        Records of your interactions with our care team, WhatsApp messages, emails, and consultation notes from genetic
        counsellors.
      </p>

      <h2>3. How we use your information</h2>
      <p>We use the information collected to:</p>
      <ul>
        <li>
          Fulfil the test you have booked &mdash; schedule the phlebotomist, process the sample at our partner
          NABL-accredited lab, and deliver your report.
        </li>
        <li>Provide pre-test and post-test genetic counselling, where chosen.</li>
        <li>Process payments, issue invoices, and process refunds.</li>
        <li>
          Send transactional updates (booking confirmation, agent en-route, sample collected, report ready) over
          WhatsApp, SMS, email, or push notification.
        </li>
        <li>
          Send marketing communications, only where you have given explicit, separate consent, and only between 09:00
          and 21:00 IST. You can withdraw consent at any time from your account preferences or by replying STOP to a
          message.
        </li>
        <li>Investigate suspected misuse, fraud, or violation of our Terms of Service.</li>
        <li>Comply with legal obligations and regulatory requests.</li>
        <li>Improve the Platform, in aggregated and de-identified form.</li>
      </ul>
      <p>
        We do <strong>NOT</strong> use your Genetic Data, Health Information, or contact details for any of the
        following:
      </p>
      <ul>
        <li>To set or influence the price of any product or service offered to you;</li>
        <li>To market insurance, lending, or financial products to you;</li>
        <li>To train any third-party AI/ML model;</li>
        <li>To sell to any data broker or marketing list, anonymised or otherwise.</li>
      </ul>

      <h2>4. Legal basis (DPDP Act)</h2>
      <p>We process your personal data under one of the following bases:</p>
      <ul>
        <li>your consent, recorded explicitly at the point of collection;</li>
        <li>the performance of the contract you have entered into by booking a test;</li>
        <li>compliance with a legal obligation we are subject to;</li>
        <li>
          protection of your vital interests (in the rare case of a clinically significant finding requiring follow-up).
        </li>
      </ul>
      <p>
        Wherever consent is the basis, you may withdraw it through your account or by writing to{' '}
        <a href="mailto:grievance@kyg.in">grievance@kyg.in</a>. Withdrawal does not affect processing already lawfully
        carried out.
      </p>

      <h2>5. How we handle samples and genetic data</h2>
      <h3>A. Sample handling</h3>
      <p>
        Once collected, your sample is labelled with a unique de-identified accession number. Your name and address are
        stripped from the physical sample before it reaches the lab. Only the KYG operations team and the lab&rsquo;s
        reporting pathologist can re-link the accession number to your identity.
      </p>
      <h3>B. Storage</h3>
      <p>
        Samples are stored at our partner NABL-accredited lab for a maximum of 60 days from receipt, after which the
        residual sample is destroyed under the lab&rsquo;s biomedical waste protocol, unless you have separately
        consented to a longer hold for re-analysis.
      </p>
      <h3>C. Genetic Data storage</h3>
      <p>
        Raw sequencing data and the variant call file (&ldquo;VCF&rdquo;) are stored on KYG-controlled servers hosted in
        India, encrypted at rest (AES-256) and in transit (TLS 1.2+). Access is restricted to authorised KYG personnel
        on a need-to-know basis and is audit-logged.
      </p>
      <h3>D. Retention</h3>
      <p>
        By default, your Genetic Data and report are retained for as long as you maintain an account with us, so you can
        re-access your report at any time. You may at any time:
      </p>
      <ul>
        <li>download your report and have your Genetic Data deleted;</li>
        <li>
          close your account, on which we delete your Genetic Data and Health Information within 60 days and retain only
          the statutory minimum (invoice records, audit logs) required by Indian tax and consumer protection laws.
        </li>
      </ul>
      <h3>E. No research use without separate consent</h3>
      <p>
        We will not use your Genetic Data for research, publication, or aggregated dataset products unless you give a
        separate, explicit, opt-in consent through the Research Participation form. Research consent is independent of
        using our service and can be withdrawn at any time.
      </p>

      <h2>6. Sharing</h2>
      <p>We share your information only with:</p>
      <ul>
        <li>
          The NABL-accredited partner lab that processes your sample (de-identified by accession number; the lab does
          not get your name/address).
        </li>
        <li>The genetic counsellor or clinician you have chosen to consult, if any.</li>
        <li>Razorpay, our payment gateway, for processing payments.</li>
        <li>
          Shipping / logistics partners only to the extent of name, phone and delivery address required to dispatch a
          kit, return a physical report, or pick up materials. The vast majority of our flow uses an in-house
          phlebotomist; no logistics partner sees Genetic Data.
        </li>
        <li>
          Communication providers (WhatsApp Business API provider, SMS gateway, email provider) for transactional and
          consented marketing messages.
        </li>
        <li>Hosting and infrastructure providers (cloud and CDN) under standard data-processing agreements.</li>
        <li>
          Law enforcement, regulators, and courts, only where we are legally compelled, and only to the minimum extent
          required.
        </li>
      </ul>
      <p>
        In the event KYG is acquired by, merged with, or sells assets to another entity, your information may be
        transferred as part of that transaction. We will notify you in advance and you will retain the right to delete
        your data before the transfer takes effect.
      </p>
      <p>
        We do NOT sell your information. We do not share your Genetic Data or Health Information with insurers,
        employers, lenders, or advertisers.
      </p>

      <h2>7. International transfers</h2>
      <p>
        Your data is stored and processed in India. If we ever need to transfer it outside India (for example, to a
        cloud region outside India), we will do so only to countries not restricted by the Central Government under
        section 16 of the DPDP Act, and under appropriate contractual safeguards.
      </p>

      <h2>8. Security</h2>
      <p>
        We follow the &ldquo;reasonable security practices&rdquo; standard prescribed by the SPDI Rules. Concretely:
      </p>
      <ul>
        <li>TLS 1.2+ on all public endpoints;</li>
        <li>AES-256 at-rest encryption for Genetic Data and report files;</li>
        <li>Role-based access control with audit logging for staff;</li>
        <li>Two-factor authentication on internal admin systems;</li>
        <li>Annual third-party security review;</li>
        <li>
          Documented breach-response plan with notification to affected users and the Data Protection Board within the
          statutory window.
        </li>
      </ul>
      <p>
        No system is perfectly secure. If we become aware of a personal data breach affecting you, we will notify you
        and the Data Protection Board as required by the DPDP Act.
      </p>

      <h2>9. Your rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you;</li>
        <li>Correct inaccurate or outdated information;</li>
        <li>Have your Genetic Data and Health Information deleted (we retain only what statute requires);</li>
        <li>Withdraw any consent you have given, at any time;</li>
        <li>Nominate another person to exercise these rights in the event of your death or incapacity;</li>
        <li>File a grievance with our Grievance Officer (details below);</li>
        <li>Escalate to the Data Protection Board of India if your grievance is not resolved.</li>
      </ul>
      <p>
        To exercise any of these rights, write to <a href="mailto:privacy@kyg.in">privacy@kyg.in</a>. We will respond
        within 30 days.
      </p>

      <h2>10. Cookies</h2>
      <p>
        We use first-party cookies for session management and remembering preferences, and Google Analytics 4 for
        traffic analytics. Tracking cookies (advertising / retargeting pixels) are loaded only after you accept them via
        the cookie banner. You can withdraw cookie consent at any time from the footer &ldquo;Cookie Preferences&rdquo;
        link.
      </p>

      <h2>11. Children</h2>
      <p>
        Our services are not intended for individuals under the age of 18. A genetic test may be ordered for a minor
        only by their parent or legal guardian, who provides consent on the minor&rsquo;s behalf in accordance with the
        DPDP Act.
      </p>

      <h2>12. Third-party links</h2>
      <p>
        Our Platform may link to third-party sites (e.g., blog citations, research papers). This Privacy Policy does not
        apply to those sites. We encourage you to read their policies.
      </p>

      <h2>13. Changes to this policy</h2>
      <p>
        We will update this policy as our services and the law evolve. The &ldquo;Last updated&rdquo; date at the top
        reflects the latest version. Material changes (for example, a new category of data or new sharing relationship)
        will be notified in advance by email or in-app banner at least 14 days before they take effect.
      </p>

      <h2>14. Grievance Officer & Contact</h2>
      <p>
        Grievance Officer: <em>[to be appointed before launch]</em>
        <br />
        BFG Market Consult Private Limited (operating the KnowYourGenes brand)
        <br />
        SU 18, Pitam Pura, Delhi 110034, India
        <br />
        CIN: U74999DL2010PTC207582
        <br />
        Email: <a href="mailto:grievance@kyg.in">grievance@kyg.in</a>
        <br />
        Phone: <a href="tel:+911140000000">+91 11 4000 0000</a> (Mon&ndash;Sat, 09:00&ndash;19:00 IST)
      </p>
      <p>
        For privacy-specific questions, you may also write to <a href="mailto:privacy@kyg.in">privacy@kyg.in</a>.
      </p>

      <p className="mt-10 text-sm text-muted-foreground">
        See also: <Link href="/terms">Terms of Service</Link> &middot; <Link href="/refunds">Refund Policy</Link>{' '}
        &middot; <Link href="/consent">Genetic Testing Consent</Link>
      </p>
    </LegalPage>
  );
}
