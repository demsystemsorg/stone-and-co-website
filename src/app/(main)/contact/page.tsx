import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { Section, SectionDivider } from "@/components/ui";
import { OfficeCard } from "@/components/common";
import { ContactForm } from "@/components/forms";
import { OFFICES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Stone & Co. Solicitors. Contact our City or Leytonstone office for expert legal advice.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <PageHero
        title="Contact Us"
        subtitle="Get in touch with our experienced team. We're here to help with your legal needs."
        variant="dark"
        size="sm"
      />

      {/* Contact Section */}
      <Section variant="default" padding="lg" topEffect="fade">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-neutral-900 mb-2">
              Send Us a Message
            </h2>
            <p className="text-neutral-600 mb-8">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
            <ContactForm />
          </div>

          {/* Office Information */}
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-neutral-900 mb-2">
              Our Offices
            </h2>
            <p className="text-neutral-600 mb-8">
              Visit us at one of our two convenient London locations.
            </p>
            <div className="space-y-6">
              <OfficeCard
                name={OFFICES.city.name}
                address={OFFICES.city.address}
                phone={OFFICES.city.phone}
                email={OFFICES.city.email}
                hours={OFFICES.city.hours.weekday}
                mapUrl={OFFICES.city.mapUrl}
              />
              <OfficeCard
                name={OFFICES.leytonstone.name}
                address={OFFICES.leytonstone.address}
                phone={OFFICES.leytonstone.phone}
                email={OFFICES.leytonstone.email}
                hours={OFFICES.leytonstone.hours.weekday}
                mapUrl={OFFICES.leytonstone.mapUrl}
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
