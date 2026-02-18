import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  Users,
  Home,
  Briefcase,
  Globe,
  Scale,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Phone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Section, Container, Button } from "@/components/ui";
import { TeamMemberCard, CTABanner } from "@/components/common";
import { practiceAreas } from "@/data/practice-areas";
import { teamMembers } from "@/data/team";
import { FAQAccordion } from "./faq-accordion";

interface PracticeAreaPageProps {
  params: Promise<{ slug: string }>;
}

const iconMap: Record<string, LucideIcon> = {
  Heart,
  Users,
  Home,
  Briefcase,
  Globe,
  Scale,
  AlertTriangle,
};

export async function generateStaticParams() {
  return practiceAreas.map((area) => ({
    slug: area.slug,
  }));
}

export async function generateMetadata({
  params,
}: PracticeAreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = practiceAreas.find((a) => a.slug === slug);

  if (!area) {
    return {
      title: "Practice Area Not Found",
    };
  }

  return {
    title: area.seo.title,
    description: area.seo.description,
    keywords: area.seo.keywords,
  };
}

export default async function PracticeAreaPage({
  params,
}: PracticeAreaPageProps) {
  const { slug } = await params;
  const area = practiceAreas.find((a) => a.slug === slug);

  if (!area) {
    notFound();
  }

  const IconComponent = iconMap[area.icon] || Scale;

  // Get team members for this practice area
  const areaTeamMembers = teamMembers.filter((member) =>
    area.teamMembers.includes(member.id)
  );

  // Get related practice areas
  const relatedAreas = practiceAreas.filter((a) =>
    area.relatedAreas.includes(a.id)
  );

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-neutral-900 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(184,134,11,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(184,134,11,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Gold accent gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-600/10 to-transparent" />

        <Container className="relative">
          {/* Breadcrumb */}
          <Link
            href="/practice-areas"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Practice Areas</span>
          </Link>

          <div className="max-w-3xl">
            {/* Icon */}
            <div className="w-16 h-16 rounded-xl bg-gold-600/20 text-gold-400 flex items-center justify-center mb-6">
              <IconComponent className="w-8 h-8" />
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {area.title}
            </h1>

            <p className="text-xl text-neutral-300 mb-8 leading-relaxed">
              {area.fullDescription}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="cta" size="lg" asChild>
                <Link href="/contact">Get Legal Advice</Link>
              </Button>
              <a
                href="tel:020XXXXXXXX"
                className="inline-flex items-center justify-center font-semibold text-[0.85rem] h-[52px] px-8 rounded-md border-[1.5px] border-gold-soft text-white hover:bg-gold hover:text-ink transition-all duration-200"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <Section variant="default" padding="lg">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 text-center">
            Our {area.title} Services
          </h2>
          <p className="text-lg text-text-secondary text-center mb-12 max-w-2xl mx-auto">
            We provide comprehensive support across all aspects of{" "}
            {area.title.toLowerCase()}.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {area.services.map((service, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 bg-white rounded-lg border border-neutral-200 hover:border-gold-300 hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center">
                    <Check className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ Section */}
      {area.faqs.length > 0 && (
        <Section variant="alternate" padding="lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4 text-center">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-text-secondary text-center mb-10">
              Common questions about {area.title.toLowerCase()} matters.
            </p>

            <FAQAccordion faqs={area.faqs} />

            <p className="text-center text-text-secondary mt-6">
              Have more questions?{" "}
              <Link
                href="/contact"
                className="text-gold-600 hover:text-gold-700 font-medium"
              >
                Contact us
              </Link>{" "}
              for personalized advice.
            </p>
          </div>
        </Section>
      )}

      {/* Team Members */}
      {areaTeamMembers.length > 0 && (
        <Section variant="default" padding="lg">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              Our {area.title} Team
            </h2>
            <p className="text-lg text-text-secondary">
              Meet the experienced solicitors who specialize in{" "}
              {area.title.toLowerCase()}.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {areaTeamMembers.map((member) => (
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
      )}

      {/* Related Practice Areas */}
      {relatedAreas.length > 0 && (
        <Section variant="alternate" padding="md">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
              Related Practice Areas
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {relatedAreas.map((related) => {
                const RelatedIcon = iconMap[related.icon] || Scale;
                return (
                  <Link
                    key={related.id}
                    href={`/practice-areas/${related.slug}`}
                    className="group flex items-center gap-3 px-5 py-3 bg-white rounded-lg border border-neutral-200 hover:border-gold-300 hover:shadow-md transition-all"
                  >
                    <RelatedIcon className="w-5 h-5 text-gold-600" />
                    <span className="font-medium text-foreground group-hover:text-gold-700 transition-colors">
                      {related.title}
                    </span>
                    <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-gold-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* CTA */}
      <CTABanner
        title={`Need Help with ${area.title}?`}
        subtitle="Contact our experienced team today for a confidential consultation."
      />
    </>
  );
}
