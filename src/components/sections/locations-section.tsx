import * as React from "react";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { OFFICES } from "@/lib/constants";

export interface LocationsSectionProps {
  title?: string;
  subtitle?: string;
  variant?: "light" | "dark";
}

const offices = [OFFICES.city, OFFICES.leytonstone];

export function LocationsSection() {
  return (
    <section className="section-rise py-24 md:py-36 bg-bg">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif font-medium text-[2.4rem] md:text-[3rem] leading-[1.1] tracking-[-0.02em] text-ink">
            Our Offices
          </h2>
          <p className="text-[1.125rem] text-muted leading-[1.65] max-w-[560px] mx-auto mt-4">
            Visit us at one of our two London locations.
          </p>
        </div>

        {/* Office cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[800px] mx-auto">
          {offices.map((office) => (
            <div
              key={office.id}
              className="group bg-surface border border-line p-9 hover:border-gold-soft hover:shadow-[0_2px_12px_rgba(199,164,87,0.06)] transition-all duration-200 touch-feedback"
            >
              <h3 className="font-serif font-medium text-[1.2rem] text-ink mb-4 hover-underline-gold inline-block pb-0.5">
                {office.name}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-[0.85rem] text-dim leading-[1.5]">
                  <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>London {office.address.postcode}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[0.85rem] text-dim">
                  <Phone className="w-4 h-4 text-gold flex-shrink-0" strokeWidth={1.5} />
                  <a
                    href={`tel:${office.phone.replace(/\s/g, "")}`}
                    className="hover:text-ink transition-colors"
                  >
                    {office.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-[0.85rem] text-dim">
                  <Clock className="w-4 h-4 text-gold flex-shrink-0" strokeWidth={1.5} />
                  <span>{office.hours.weekday}</span>
                </div>
              </div>

              <a
                href={office.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-gold-deep hover:text-gold transition-colors"
              >
                Get directions
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
