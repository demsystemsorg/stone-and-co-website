import type { Metadata } from "next";
import { Shield, Users, Heart, Scale, Award, Handshake } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Section, Container, SectionDivider } from "@/components/ui";
import { CTABanner, TrustBadges } from "@/components/common";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "About Stone & Co. Solicitors — SRA regulated (No. 640836). Specialist solicitors for tenancy deposit claims, immigration, and rent repayment orders in London.",
};

const values = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Client-Focused",
    description:
      "Every client matters. We listen, understand your needs, and tailor our approach to achieve the best possible outcome for your specific situation.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Integrity",
    description:
      "We maintain the highest ethical standards in everything we do. Honesty and transparency are the foundation of our client relationships.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Excellence",
    description:
      "We strive for excellence in legal practice, continuously developing our expertise to provide the best possible service.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Accessibility",
    description:
      "Legal services should be accessible to everyone. We offer flexible appointments, clear pricing, and multilingual support.",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Community",
    description:
      "We're proud to serve the diverse communities of London, including dedicated services for Italian speakers through Consulenti Italiani.",
  },
  {
    icon: <Scale className="w-6 h-6" />,
    title: "Justice",
    description:
      "We believe everyone deserves fair representation and fight tirelessly to protect our clients' rights and interests.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="About Stone & Co."
        subtitle="A tradition of legal excellence serving London's diverse communities."
        variant="dark"
        size="md"
      />

      {/* Our Story */}
      <Section variant="default" padding="lg" topEffect="fade">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-6 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none text-neutral-700">
            <p>
              Stone & Co. Solicitors is an SRA-regulated firm (No. 640836)
              led by principal Davide Cupertino, with a focused mission:
              to provide specialist, high-quality legal representation
              for tenants and individuals across London.
            </p>
            <p>
              We operate from two offices — our City location in EC2Y and
              our Leytonstone branch in E11 — and concentrate on three
              core practice areas: tenancy deposit claims, immigration,
              and rent repayment orders. This specialist focus means every
              member of our team has deep expertise in the areas that
              matter most to our clients.
            </p>
            <p>
              With the Renters&apos; Rights Act 2025 commencing in May 2026,
              our team is at the forefront of the expanding tenant protections,
              advising both tenants pursuing claims and landlords seeking
              compliance. We combine clear communication, realistic advice,
              and determined advocacy to achieve the best possible outcome
              for every client.
            </p>
          </div>
        </div>
      </Section>

      {/* Trust Badges */}
      <Section variant="alternate" padding="md" topEffect="glow">
        <TrustBadges />
      </Section>

      <SectionDivider variant="gold" spacing="sm" />

      {/* Our Values */}
      <Section variant="default" padding="lg" topEffect="inset">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-4">
            Our Values
          </h2>
          <p className="text-lg text-neutral-600">
            These principles guide everything we do at Stone & Co. Solicitors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center">
                  {value.icon}
                </div>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <SectionDivider variant="subtle" spacing="sm" />

      {/* Accreditations */}
      <Section variant="alternate" padding="lg" topEffect="fade">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-4">
            Regulated & Accredited
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Stone & Co. Solicitors is regulated by the Solicitors Regulation
            Authority (SRA), ensuring we meet the highest professional standards.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-lg border border-neutral-200 shadow-sm">
              <Shield className="w-8 h-8 text-gold-500" />
              <div className="text-left">
                <p className="font-semibold text-neutral-900">SRA Regulated</p>
                <p className="text-sm text-neutral-600">Solicitors Regulation Authority</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <CTABanner
        title="Ready to Work with Us?"
        subtitle="Contact our team today to discuss how we can help with your legal matter."
      />
    </>
  );
}
