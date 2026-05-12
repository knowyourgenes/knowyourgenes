import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage } from '@/components/site/LegalPage';

export const metadata: Metadata = {
  title: 'Genetic Testing Consent',
  description:
    'The informed consent you give KnowYourGenes before we collect and analyse your DNA &mdash; what you are agreeing to, what you understand, and what we will not do.',
};

export default function ConsentPage() {
  return (
    <LegalPage title="Genetic Testing Consent" updated="12 May 2026">
      <p>
        This document is the informed consent you give KnowYourGenes (&ldquo;KYG&rdquo;, operated by BFG Market Consult
        Private Limited) before we collect and analyse your DNA. You must read and accept this consent before the
        phlebotomist draws your sample. A signed digital copy is retained in your account.
      </p>
      <p>
        If you are booking for a minor or a dependent adult unable to consent themselves, the parent, legal guardian, or
        attorney-in-fact provides this consent on their behalf.
      </p>

      <h2>1. What you are consenting to</h2>
      <p>By signing this consent you confirm that:</p>
      <ul>
        <li>You are providing a biological sample (saliva and/or blood) voluntarily and free of coercion.</li>
        <li>
          You authorise KnowYourGenes and its partner NABL-accredited laboratory to extract DNA from this sample,
          sequence it, and analyse it against the panel(s) of genes corresponding to the package you have purchased.
        </li>
        <li>
          You authorise KnowYourGenes to generate a written report from this analysis and deliver it to you over the
          email, WhatsApp, and account login you have provided.
        </li>
        <li>
          You authorise the de-identified storage of your sample at the partner lab for up to 60 days, and the storage
          of your raw genetic data (&ldquo;VCF&rdquo;) on KYG-controlled servers in India for as long as you maintain
          your account, unless you ask for it to be deleted.
        </li>
      </ul>

      <h2>2. What you understand</h2>
      <p>You confirm that you have read and understood the following:</p>
      <ul>
        <li>The genetic test is for informational and investigational purposes only. It is not a medical diagnosis.</li>
        <li>
          The report should be interpreted by a qualified healthcare professional. KnowYourGenes does not practise
          medicine.
        </li>
        <li>
          Genetic findings are probabilistic. They indicate predisposition, not certainty. The absence of a risk variant
          does not mean you are protected from the relevant condition.
        </li>
        <li>
          A report may reveal information that is unexpected, distressing, or that has implications for biological
          relatives (especially in cancer-risk and reproductive panels). You acknowledge this possibility and choose to
          proceed.
        </li>
        <li>
          Genetic information may have implications for life insurance or other matters in jurisdictions outside India.
          You have considered this before consenting.
        </li>
        <li>
          You have the option of pre-test and post-test counselling with a qualified genetic counsellor. For cancer-risk
          and reproductive panels, KYG strongly recommends both.
        </li>
      </ul>

      <h2>3. What KnowYourGenes will not do</h2>
      <p>KnowYourGenes will not:</p>
      <ul>
        <li>
          Perform pre-natal sex determination of a foetus. This is prohibited under the PCPNDT Act, 1994 and KYG will
          not process any request that breaches this law.
        </li>
        <li>Sell or share your genetic data with insurers, lenders, or advertisers.</li>
        <li>Use your genetic data to train any third-party AI / ML model.</li>
        <li>Use your genetic data for research without your separate, opt-in consent (see clause 5).</li>
        <li>
          Disclose your report to any third party (including a spouse, parent of an adult, or employer) without your
          explicit written authorisation, except where compelled by a court order or applicable law.
        </li>
      </ul>

      <h2>4. Risks and limitations</h2>
      <p>You acknowledge that:</p>
      <ul>
        <li>
          A small fraction of samples (around 1 in 200) fail at the extraction or sequencing step and require
          re-collection.
        </li>
        <li>
          The genes analysed are limited to the panel of your purchased package. The test does not screen for all known
          genetic conditions.
        </li>
        <li>
          Variants of uncertain significance (&ldquo;VUS&rdquo;) may be reported. A VUS means the evidence is currently
          inconclusive and may be reclassified in the future as more research accumulates.
        </li>
        <li>
          Variants associated with serious adult-onset conditions (some cancer-risk and cardiac variants) carry
          implications for biological relatives. KYG cannot contact your relatives on your behalf.
        </li>
        <li>
          The report is based on the scientific evidence current at the time of issue. Future re-analysis is available
          on request, subject to fees in force at that time.
        </li>
      </ul>

      <h2>5. Optional &mdash; research participation (separate opt-in)</h2>
      <p>
        You may, separately and entirely at your option, consent to your de-identified genetic data and self-reported
        phenotype information being included in research datasets that KYG or its academic partners may use to improve
        genetic interpretation for Indian populations.
      </p>
      <p>
        Research consent is independent of the test purchase. You can withdraw research consent at any time from your
        account, and your data will be removed from any future dataset; data already included in a closed dataset cannot
        retroactively be removed but will remain de-identified.
      </p>

      <h2>6. Withdrawal of consent</h2>
      <p>
        You may withdraw consent for the storage of your genetic data, or for any specific use of it, at any time, by
        writing to <a href="mailto:privacy@kyg.in">privacy@kyg.in</a> or from &ldquo;Privacy&rdquo; in your account
        settings.
      </p>
      <ul>
        <li>
          <strong>Withdrawal of storage consent:</strong> your raw genetic data and report are deleted within 60 days.
          Statutory minimums (invoice records, audit logs) are retained.
        </li>
        <li>
          <strong>Withdrawal of consent during processing:</strong> if your sample is already at the lab, processing
          will be halted where technically possible. Fees for work already performed may not be refundable; see{' '}
          <Link href="/refunds">Refund Policy</Link>.
        </li>
        <li>Withdrawal does not affect lawful processing already completed before withdrawal.</li>
      </ul>

      <h2>7. Confirmation</h2>
      <p>
        By signing this consent (digitally at the time of sample collection, or by ticking &ldquo;I have read and accept
        the Genetic Testing Consent&rdquo; at booking), you confirm:
      </p>
      <ul>
        <li>I have read and understood this consent.</li>
        <li>I have had the opportunity to ask questions and they have been answered to my satisfaction.</li>
        <li>I am freely consenting to the test and to the use of my sample and data as described above.</li>
        <li>
          I am the patient, or I am the parent / legal guardian / authorised representative of the patient and entitled
          to provide consent on their behalf.
        </li>
      </ul>

      <h2>8. Contact</h2>
      <p>
        BFG Market Consult Private Limited (operating the KnowYourGenes brand)
        <br />
        SU 18, Pitam Pura, Delhi 110034, India
        <br />
        CIN: U74999DL2010PTC207582
        <br />
        Email: <a href="mailto:privacy@kyg.in">privacy@kyg.in</a> / <a href="mailto:care@kyg.in">care@kyg.in</a>
        <br />
        Phone: <a href="tel:+911140000000">+91 11 4000 0000</a> (Mon&ndash;Sat, 09:00&ndash;19:00 IST)
      </p>
    </LegalPage>
  );
}
