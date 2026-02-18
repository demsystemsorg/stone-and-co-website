import type { Metadata } from "next";
import Link from "next/link";
import { FileText, BookOpen, Scale, HelpCircle, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Section, SectionDivider } from "@/components/ui";
import { CTABanner } from "@/components/common";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Legal guides, FAQs, and helpful resources from Stone & Co. Solicitors. Learn about your rights and legal processes.",
};

const resourceCategories = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Legal Guides",
    description:
      "Comprehensive guides explaining legal processes, your rights, and what to expect when working with a solicitor.",
    items: [
      { title: "Guide to Divorce Proceedings", href: "/practice-areas/family-law" },
      { title: "Understanding Immigration Visas", href: "/practice-areas/immigration" },
      { title: "Employment Tribunal Process", href: "/practice-areas/employment-law" },
    ],
  },
  {
    icon: <HelpCircle className="w-6 h-6" />,
    title: "FAQs by Practice Area",
    description:
      "Find answers to commonly asked questions about different areas of law we handle.",
    items: [
      { title: "Family Law FAQs", href: "/practice-areas/family-law" },
      { title: "Criminal Law FAQs", href: "/practice-areas/criminal-law" },
      { title: "Housing Disrepair FAQs", href: "/practice-areas/housing-disrepair" },
    ],
  },
  {
    icon: <Scale className="w-6 h-6" />,
    title: "Know Your Rights",
    description:
      "Information about your legal rights in various situations, from workplace issues to housing disputes.",
    items: [
      { title: "Tenant Rights", href: "/practice-areas/landlord-tenant" },
      { title: "Employee Rights", href: "/practice-areas/employment-law" },
      { title: "Rights During Arrest", href: "/practice-areas/criminal-law" },
    ],
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Legal Glossary",
    description:
      "Plain English explanations of legal terms and jargon you might encounter.",
    items: [
      { title: "Family Law Terms", href: "/practice-areas/family-law" },
      { title: "Immigration Terms", href: "/practice-areas/immigration" },
      { title: "Property Law Terms", href: "/practice-areas/landlord-tenant" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="Resources"
        subtitle="Helpful guides, FAQs, and information to help you understand your legal rights and options."
        variant="dark"
        size="sm"
      />

      {/* Resources Grid */}
      <Section variant="default" padding="lg" topEffect="fade">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-4">
            Legal Information & Guides
          </h2>
          <p className="text-lg text-neutral-600">
            We believe in empowering our clients with knowledge. Browse our
            resources to learn more about legal processes and your rights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {resourceCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 hover:border-gold-400 hover:shadow-lg transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center flex-shrink-0">
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-neutral-900">
                    {category.title}
                  </h3>
                  <p className="text-sm text-neutral-600 mt-1">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Links */}
              <ul className="space-y-2 mt-4 pt-4 border-t border-neutral-200">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between py-2 text-sm text-neutral-600 hover:text-gold-600 transition-colors"
                    >
                      <span>{item.title}</span>
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <SectionDivider variant="gold" spacing="md" />

      {/* Disclaimer */}
      <Section variant="alternate" padding="md" topEffect="inset">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-display text-lg font-semibold text-neutral-900 mb-3">
            Important Notice
          </h3>
          <p className="text-sm text-neutral-600">
            The information provided on this page is for general guidance only
            and does not constitute legal advice. Every case is unique, and the
            law can change. For advice specific to your situation, please{" "}
            <Link
              href="/contact"
              className="text-gold-500 hover:text-gold-600 font-medium"
            >
              contact us
            </Link>{" "}
            to arrange a consultation.
          </p>
        </div>
      </Section>

      {/* CTA */}
      <CTABanner
        title="Need Specific Legal Advice?"
        subtitle="Our team is here to help with your individual circumstances."
      />
    </>
  );
}
