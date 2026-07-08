import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'MedeqX platform terms and conditions for buyers and sellers of medical equipment in Saudi Arabia and the GCC.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-[#0D1B3E] mb-3 pb-2 border-b border-slate-100">{title}</h2>
      <div className="text-sm text-slate-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <main className="bg-[#F8FAFF] min-h-screen pt-20">
      <section className="max-w-3xl mx-auto px-6 py-14">
        <div className="mb-10">
          <p className="text-[11px] font-bold tracking-widest text-[#0057FF] uppercase mb-2">Legal</p>
          <h1 className="text-4xl font-extrabold text-[#0D1B3E] mb-3">Terms &amp; Conditions</h1>
          <p className="text-slate-500 text-sm">Last updated: May 2026 · Governing law: Kingdom of Saudi Arabia</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <Section title="1. Platform Overview">
            <p>
              MedeqX (&quot;we&quot;, &quot;us&quot;, &quot;the platform&quot;) is an online B2B classified marketplace
              for the exchange of pre-owned, refurbished, and new medical equipment within Saudi Arabia and the GCC region.
              MedeqX acts solely as an intermediary connecting sellers and buyers. We are not a party to any transaction,
              and we do not purchase, sell, or take possession of any equipment listed on the platform.
            </p>
          </Section>

          <Section title="2. Eligibility">
            <p>By using MedeqX, you confirm that you are:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>A registered hospital, clinic, medical facility, supplier, or authorized distributor operating legally in Saudi Arabia or the GCC.</li>
              <li>Authorized to buy or sell the equipment you are dealing in.</li>
              <li>At least 18 years of age and legally capable of entering into binding agreements.</li>
            </ul>
          </Section>

          <Section title="3. Listing Standards">
            <p>All sellers must ensure that:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>All equipment information is accurate, complete, and not misleading.</li>
              <li>Photos uploaded represent the actual equipment being offered.</li>
              <li>The equipment condition is correctly classified (New, Refurbished, Used, or For Parts / Defective).</li>
              <li>The seller owns or is legally authorized to sell the listed equipment.</li>
              <li>Listings are marked as &quot;Sold&quot; immediately upon completion of a sale.</li>
              <li>Duplicate or fraudulent listings are prohibited.</li>
            </ul>
            <p className="mt-2">MedeqX reserves the right to review, reject, edit, or remove any listing that does not meet our standards, at our sole discretion.</p>
          </Section>

          <Section title="4. Prohibited Equipment">
            <p>The following may not be listed on MedeqX:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Counterfeit or illegally obtained medical devices.</li>
              <li>Equipment that has been recalled by the manufacturer or relevant regulatory authority.</li>
              <li>Radioactive or hazardous materials without proper certification and regulatory approvals.</li>
              <li>Single-use devices being offered for re-use in violation of applicable standards.</li>
              <li>Any item whose sale is prohibited under Saudi Arabian or GCC law.</li>
            </ul>
          </Section>

          <Section title="5. Commission & Fees">
            <p>
              MedeqX charges a commission of <strong>4% of the confirmed sale value</strong>, with a
              minimum commission of <strong>SAR 500</strong> per transaction. The commission is collected
              only after a successful, confirmed sale — not upon listing or inquiry.
            </p>
            <p className="mt-2">
              Listing on MedeqX is free of charge. No listing fees or subscription fees apply.
              MedeqX will invoice the seller upon notification of a completed sale. Failure to report
              completed sales or withhold commission payments may result in account suspension.
            </p>
          </Section>

          <Section title="6. Seller Obligations">
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide accurate and complete equipment information at the time of listing.</li>
              <li>Respond to buyer inquiries forwarded by MedeqX within a reasonable time.</li>
              <li>Update or remove listings that are no longer available.</li>
              <li>Mark listings as &quot;Sold&quot; immediately upon completing a transaction.</li>
              <li>Pay the applicable commission fee after each confirmed sale.</li>
              <li>Comply with all applicable Saudi and GCC laws regarding the sale of medical equipment.</li>
            </ul>
          </Section>

          <Section title="7. Buyer Obligations">
            <ul className="list-disc pl-5 space-y-1">
              <li>Conduct due diligence before purchasing any equipment, including physical inspection.</li>
              <li>Verify that the equipment meets the applicable regulatory and safety requirements for your jurisdiction.</li>
              <li>Communicate directly and in good faith with the seller once contact is established.</li>
              <li>MedeqX does not guarantee the condition, authenticity, or fitness for purpose of any listed equipment.</li>
            </ul>
          </Section>

          <Section title="8. Privacy & Confidentiality">
            <p>
              MedeqX keeps all contact information (email addresses, phone numbers, hospital names) strictly private.
              Seller details are only shared with a buyer after a confirmed inquiry match. Buyer details are forwarded
              to the seller solely for the purpose of facilitating the transaction. We do not sell or share personal
              data with third parties for commercial purposes.
            </p>
          </Section>

          <Section title="9. Extra Services">
            <p>
              Where sellers offer additional services such as dismantling, packaging, transportation, installation,
              operator training, or service contracts, these are provided directly between the seller and buyer.
              MedeqX is not a party to any such service arrangements and assumes no liability for their delivery or quality.
            </p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>
              MedeqX is a marketplace platform only. To the maximum extent permitted by law, MedeqX shall not
              be liable for any direct, indirect, incidental, or consequential damages arising from:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Inaccurate or misleading information provided by any user.</li>
              <li>Equipment condition, performance, or safety after purchase.</li>
              <li>Failure of any transaction between a buyer and seller.</li>
              <li>Any legal, regulatory, or customs issues arising from equipment transfers.</li>
            </ul>
          </Section>

          <Section title="11. Account Suspension & Termination">
            <p>
              MedeqX reserves the right to suspend or terminate any account, remove any listing, and/or block
              access to the platform, with or without notice, for violations of these Terms, fraudulent behavior,
              non-payment of commissions, or any conduct harmful to the platform or its users.
            </p>
          </Section>

          <Section title="12. Changes to Terms">
            <p>
              MedeqX may update these Terms & Conditions at any time. Continued use of the platform after
              changes are posted constitutes acceptance of the updated terms. Material changes will be notified
              via email where contact details are available.
            </p>
          </Section>

          <Section title="13. Governing Law & Dispute Resolution">
            <p>
              These Terms are governed by the laws of the Kingdom of Saudi Arabia. Any disputes arising from
              the use of MedeqX shall be subject to the exclusive jurisdiction of the competent courts of
              Saudi Arabia. Parties are encouraged to resolve disputes amicably through direct negotiation
              or mediation before resorting to legal proceedings.
            </p>
          </Section>

          <Section title="14. Contact">
            <p>
              For any questions regarding these Terms & Conditions, please contact us at{' '}
              <a href="mailto:info@medeqx.com" className="text-[#0057FF] hover:underline font-medium">
                info@medeqx.com
              </a>.
            </p>
          </Section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-[#0057FF] hover:underline">← Back to Marketplace</Link>
        </div>
      </section>
    </main>
  );
}
