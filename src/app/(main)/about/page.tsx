import type { Metadata } from "next";
import { Shield, Users, Heart, Scale, Award, Handshake } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Section, Container, SectionDivider } from "@/components/ui";
import { CTABanner, TrustBadges } from "@/components/common";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Stone & Co. Solicitors - our history, values, and commitment to providing exceptional legal services in London.",
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
              Stone & Co. Solicitors was founded with a clear mission: to provide
              high-quality, accessible legal services to individuals and families
              across London. From our origins as a small family law practice, we
              have grown into a full-service firm while maintaining the personal
              touch that sets us apart.
            </p>
            <p>
              Today, we operate from two locations—our City office and our
              Leytonstone branch—serving clients from all walks of life. Our team
              of dedicated solicitors brings expertise across family law,
              immigration, employment disputes, criminal defense, and housing
              matters.
            </p>
            <p>
              What makes us different is our approach. We understand that legal
              matters can be stressful and overwhelming. That's why we prioritize
              clear communication, realistic advice, and compassionate support
              throughout your legal journey. Whether you're facing a family
              dispute, an immigration challenge, or a workplace issue, we're here
              to guide you every step of the way.
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
