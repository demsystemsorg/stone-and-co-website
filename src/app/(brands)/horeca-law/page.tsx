import type { Metadata } from "next";
import Link from "next/link";
import {
  Utensils,
  Wine,
  Building2,
  FileText,
  Users,
  Shield,
  Scale,
  Phone,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { PageHero } from "@/components/sections";
import { Section, Container, Button } from "@/components/ui";
import { CTABanner } from "@/components/common";

export const metadata: Metadata = {
  title: "HoReCa Law | Legal Services for Hospitality Industry",
  description:
    "Specialist legal services for Hotels, Restaurants, and Cafés. Employment law, licensing, property, and commercial disputes. Stone & Co. Solicitors London.",
  keywords: [
    "hospitality lawyer london",
    "restaurant legal advice",
    "hotel solicitor",
    "licensing lawyer",
    "hospitality employment law",
  ],
};

const services = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Employment Law",
    description:
      "Contracts, HR policies, unfair dismissal claims, tribunal representation, and workforce restructuring specific to hospitality.",
  },
  {
    icon: <Wine className="w-6 h-6" />,
    title: "Licensing & Compliance",
    description:
      "Alcohol licensing, premises licenses, late-night refreshment permits, and regulatory compliance.",
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Commercial Property",
    description:
      "Lease negotiations, rent reviews, dilapidations, and property disputes for hospitality premises.",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Commercial Contracts",
    description:
      "Supplier agreements, franchise contracts, partnership agreements, and commercial dispute resolution.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Health & Safety",
    description:
      "Food safety compliance, health and safety audits, and defending against HSE investigations.",
  },
  {
    icon: <Scale className="w-6 h-6" />,
    title: "Dispute Resolution",
    description:
      "Customer complaints, supplier disputes, partnership disagreements, and litigation support.",
  },
];

const clientTypes = [
  "Independent Restaurants",
  "Hotel Chains",
  "Boutique Hotels",
  "Cafés & Coffee Shops",
  "Bars & Pubs",
  "Catering Companies",
  "Food Delivery Platforms",
  "Hospitality Franchises",
];

export default function HoReCaLawPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-neutral-900 pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(184,134,11,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(184,134,11,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold-600/10 to-transparent" />

        <Container className="relative">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-600/20 rounded-full text-gold-400 text-sm font-medium mb-6">
              <Utensils className="w-4 h-4" />
              Hospitality Industry Specialists
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              HoReCa Law
            </h1>

            <p className="text-xl text-gold-400 font-medium mb-4">
              Legal Excellence for Hotels, Restaurants & Cafés
            </p>

            <p className="text-lg text-neutral-300 mb-8 leading-relaxed">
              The hospitality industry faces unique legal challenges—from complex
              employment issues to licensing requirements and property matters.
              Our dedicated HoReCa team understands your business and provides
              practical, commercial advice that protects your interests.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/contact">Get Industry Advice</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <a href="tel:020XXXXXXXX">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Us Now
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <Section variant="default" padding="lg">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Our HoReCa Services
          </h2>
          <p className="text-lg text-text-secondary">
            Comprehensive legal support tailored to the unique needs of the
            hospitality industry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-gold-300 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-text-secondary text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Industry Expertise */}
      <Section variant="alternate" padding="lg">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
                Industry Expertise
              </h2>
              <div className="prose prose-lg max-w-none text-text-secondary">
                <p>
                  The hospitality industry operates in a highly regulated
                  environment with unique employment patterns, licensing
                  requirements, and operational challenges. Our team has
                  extensive experience working with hospitality businesses of all
                  sizes.
                </p>
                <p>
                  We understand the seasonal nature of the industry, the
                  complexities of tipping policies and service charges, the
                  challenges of multi-site operations, and the importance of
                  protecting your reputation.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                We Work With
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {clientTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gold-600 flex-shrink-0" />
                    <span className="text-sm text-text-secondary">{type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Key Issues */}
      <Section variant="default" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-8 text-center">
            Common Industry Challenges We Handle
          </h2>

          <div className="space-y-4">
            {[
              {
                title: "Employment Tribunal Claims",
                description:
                  "Defending against unfair dismissal, discrimination, and wage claims. The hospitality sector sees high volumes of employment disputes—we provide robust representation.",
              },
              {
                title: "Licensing Applications & Reviews",
                description:
                  "New premises licenses, variations, and defending against reviews. We navigate the complex licensing regime to keep your business operating.",
              },
              {
                title: "Lease Negotiations",
                description:
                  "Securing favorable terms for restaurant and hotel premises. We understand the unique considerations for hospitality leases including rent reviews and break clauses.",
              },
              {
                title: "Staff Issues & HR Compliance",
                description:
                  "From zero-hours contracts to tronc schemes, we advise on the employment practices unique to hospitality and help you stay compliant.",
              },
            ].map((issue, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg border border-neutral-200 hover:border-gold-300 transition-all"
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {issue.title}
                </h3>
                <p className="text-text-secondary text-sm">{issue.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section variant="alternate" padding="lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-8">
            Why Choose HoReCa Law?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-4">
                <Utensils className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Industry Focused
              </h3>
              <p className="text-text-secondary text-sm">
                We speak your language and understand the unique pressures of
                running hospitality businesses.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-4">
                <Scale className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Commercial Approach
              </h3>
              <p className="text-text-secondary text-sm">
                Practical advice that considers your commercial objectives, not
                just the legal technicalities.
              </p>
            </div>

            <div>
              <div className="w-16 h-16 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Proactive Protection
              </h3>
              <p className="text-text-secondary text-sm">
                We help you prevent problems before they arise with robust
                contracts and compliance systems.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <CTABanner
        title="Running a Hospitality Business?"
        subtitle="Get specialist legal advice from a team that understands your industry."
      />
    </>
  );
}
