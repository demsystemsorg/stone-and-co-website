import type { Metadata } from "next";
import { Shield, Clock, Phone } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Section } from "@/components/ui";
import { TenantIntakeForm } from "@/components/forms";

export const metadata: Metadata = {
  title: "Get Help With Your Landlord — Stone & Co. Solicitors",
  description:
    "Having problems with your landlord? Tell us what's happening and a solicitor will call you back. Free initial assessment. The Renters' Rights Act 2025 gives you new protections.",
};

export default function TenantEnquiryPage() {
  return (
    <>
      <PageHero
        title="Tell us what's happening"
        subtitle="Fill out this short form and a qualified solicitor will call you back — usually the same day."
        variant="dark"
        size="sm"
      />

      <Section variant="default" padding="lg" topEffect="fade">
        <div className="max-w-3xl mx-auto">
          {/* Trust strip */}
          <div className="flex flex-wrap items-center gap-6 mb-8 pb-6 border-b border-neutral-200">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock className="w-4 h-4 text-[var(--gold)]" />
              <span>Takes about 2 minutes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Shield className="w-4 h-4 text-[var(--gold)]" />
              <span>100% confidential</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Phone className="w-4 h-4 text-[var(--gold)]" />
              <span>No obligation</span>
            </div>
          </div>

          <TenantIntakeForm />

          <div className="mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-sm text-neutral-600">
              <span className="font-medium text-neutral-900">Prefer to talk to someone?</span>{" "}
              Call us on{" "}
              <a href="tel:02071180530" className="text-[var(--gold)] hover:underline font-medium">
                020 7118 0530
              </a>{" "}
              (Mon–Fri, 9am–5:30pm). If it&apos;s outside office hours, fill out the form and
              we&apos;ll call you first thing.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
