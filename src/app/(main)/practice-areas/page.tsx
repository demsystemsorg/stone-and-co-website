import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  Users,
  Home,
  Briefcase,
  Globe,
  Scale,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Section, SectionDivider } from "@/components/ui";
import { CTABanner } from "@/components/common";
import { practiceAreas } from "@/data/practice-areas";

export const metadata: Metadata = {
  title: "Practice Areas",
  description:
    "Expert legal services across Family Law, Immigration, Employment, Criminal Defense, Housing Disrepair, and more. Stone & Co. Solicitors - London's trusted legal partner.",
};

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Users,
  Home,
  Briefcase,
  Globe,
  Scale,
  AlertTriangle,
};

export default function PracticeAreasPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="Practice Areas"
        subtitle="Comprehensive legal services tailored to your needs. Our experienced team provides expert guidance across a wide range of legal matters."
        variant="dark"
        size="md"
      />

      {/* Practice Areas Grid */}
      <Section variant="default" padding="lg" topEffect="fade">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-4">
            How We Can Help
          </h2>
          <p className="text-lg text-neutral-400">
            Whatever your legal challenge, our team has the expertise and
            experience to guide you through. Click on any practice area below to
            learn more about our services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {practiceAreas.map((area) => {
            const IconComponent = iconMap[area.icon] || Scale;
            return (
              <Link
                key={area.id}
                href={`/practice-areas/${area.slug}`}
                className="group relative bg-white rounded-xl border border-neutral-200 shadow-sm p-6 hover:border-gold-400 hover:shadow-lg transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center mb-5 group-hover:bg-gold-200 transition-colors">
                  <IconComponent className="w-7 h-7" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-semibold text-neutral-900 mb-3 group-hover:text-gold-600 transition-colors">
                  {area.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                  {area.shortDescription}
                </p>

                {/* Services preview */}
                <ul className="space-y-2 mb-5">
                  {area.services.slice(0, 3).map((service, index) => (
                    <li
                      key={index}
                      className="text-sm text-neutral-500 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                      {service.title}
                    </li>
                  ))}
                  {area.services.length > 3 && (
                    <li className="text-sm text-gold-600 font-medium">
                      +{area.services.length - 3} more services
                    </li>
                  )}
                </ul>

                {/* Arrow link */}
                <div className="flex items-center text-sm font-medium text-gold-600 group-hover:text-gold-600">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* Hover gradient border effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gold-400/30 transition-colors pointer-events-none" />
              </Link>
            );
          })}
        </div>
      </Section>

      <SectionDivider variant="gold" spacing="md" />

      {/* Why Choose Us for Legal Matters */}
      <Section variant="alternate" padding="lg" topEffect="inset">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-8 text-center">
            Why Choose Stone & Co.?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-neutral-900 mb-2">
                  Experienced Team
                </h3>
                <p className="text-neutral-400 text-sm">
                  Our solicitors bring decades of combined experience across all
                  practice areas, ensuring expert guidance for your case.
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-neutral-900 mb-2">
                  Client-Focused Approach
                </h3>
                <p className="text-neutral-400 text-sm">
                  We take time to understand your unique situation and provide
                  tailored advice that addresses your specific needs.
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-neutral-900 mb-2">
                  Clear Communication
                </h3>
                <p className="text-neutral-400 text-sm">
                  No legal jargon. We explain everything in plain English and
                  keep you informed at every stage of your case.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-neutral-900 mb-2">
                  Transparent Pricing
                </h3>
                <p className="text-neutral-400 text-sm">
                  We provide clear cost estimates upfront and offer various
                  funding options including fixed fees where appropriate.
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-neutral-900 mb-2">
                  Accessible Offices
                </h3>
                <p className="text-neutral-400 text-sm">
                  With offices in the City and Leytonstone, we're conveniently
                  located to serve clients across London.
                </p>
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-neutral-900 mb-2">
                  Multilingual Support
                </h3>
                <p className="text-neutral-400 text-sm">
                  Our team includes solicitors fluent in Italian and Mandarin,
                  serving London's diverse communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <CTABanner
        title="Need Legal Advice?"
        subtitle="Contact us today for a confidential consultation about your legal matter."
      />
    </>
  );
}
