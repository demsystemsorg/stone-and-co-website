import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { Section, SectionDivider } from "@/components/ui";
import { TeamMemberCard } from "@/components/common";
import { CTABanner } from "@/components/common";
import { teamMembers } from "@/data/team";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the solicitors at Stone & Co. Our team specialises in tenancy deposit claims, immigration, and rent repayment orders across London.",
};

export default function TeamPage() {
  const sortedMembers = [...teamMembers].sort((a, b) => a.order - b.order);

  return (
    <>
      {/* Hero */}
      <PageHero
        title="Our Team"
        subtitle="Meet the dedicated solicitors who bring expertise, compassion, and commitment to every case."
        variant="dark"
        size="md"
      />

      {/* Team Grid */}
      <Section variant="default" padding="lg" topEffect="fade">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-4">
            Expert Legal Professionals
          </h2>
          <p className="text-lg text-neutral-600">
            Our team combines deep legal expertise with a genuine commitment to
            achieving the best outcomes for our clients. Every member of our
            team shares our core values of integrity, accessibility, and
            excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {sortedMembers.map((member) => (
            <TeamMemberCard
              key={member.id}
              name={member.name}
              title={member.title}
              image={member.image}
              specializations={member.specializations}
              href={`/team/${member.slug}`}
            />
          ))}
        </div>
      </Section>

      <SectionDivider variant="gold" spacing="md" />

      {/* Values Section */}
      <Section variant="alternate" padding="lg" topEffect="inset">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-6">
            Our Approach
          </h2>
          <div className="prose prose-lg max-w-none text-neutral-600">
            <p>
              At Stone & Co. Solicitors, we believe that everyone deserves
              access to quality legal representation. Our team takes the time to
              understand your unique circumstances and provide clear,
              straightforward advice.
            </p>
            <p>
              We pride ourselves on being approachable and responsive. When you
              work with us, you'll have direct access to your solicitor and
              regular updates on your case. We don't hide behind legal jargon—we
              explain things in plain English and keep you informed every step
              of the way.
            </p>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <CTABanner
        title="Work with Our Team"
        subtitle="Contact us today to discuss your legal matter with one of our experienced solicitors."
      />
    </>
  );
}
