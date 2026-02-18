import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { Section } from "@/components/ui";
import { LandlordIntakeForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Landlord Enquiry — RRA 2025 Compliance",
  description:
    "Prepare your portfolio for the Renters' Rights Act 2025. Stone & Co. Solicitors offer compliance audits, tenancy agreement overhauls, Section 21 transition advice, and more.",
};

export default function LandlordEnquiryPage() {
  return (
    <>
      <PageHero
        title="Landlord Enquiry"
        subtitle="Prepare your portfolio for the Renters' Rights Act 2025. Complete our assessment to receive a tailored compliance proposal."
        variant="dark"
        size="sm"
      />

      <Section variant="default" padding="lg" topEffect="fade">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-neutral-900 mb-2">
              RRA 2025 Compliance Assessment
            </h2>
            <p className="text-neutral-600">
              The Renters&apos; Rights Act commences on 1 May 2026, with a
              backstop of 31 July 2026 for existing tenancies. Our 7-step
              assessment helps us understand your portfolio and provide a
              tailored proposal covering compliance, tenancy agreements,
              and transition planning.
            </p>
          </div>

          <LandlordIntakeForm />

          <div className="mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm text-neutral-600">
              <span className="font-medium text-neutral-900">Prefer to speak to someone?</span>{" "}
              Call us on{" "}
              <a href="tel:02071180530" className="text-gold hover:text-gold-deep font-medium">
                020 7118 0530
              </a>{" "}
              during office hours (Mon–Fri, 9am–5:30pm).
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
