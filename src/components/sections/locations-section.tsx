"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { OFFICES } from "@/lib/constants";

export interface LocationsSectionProps {
  title?: string;
  subtitle?: string;
  variant?: "light" | "dark";
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

const offices = [OFFICES.city, OFFICES.leytonstone];

export function LocationsSection() {
  return (
    <section className="py-16 md:py-24 bg-bg">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-gold-deep">
            Locations
          </p>
          <h2 className="font-serif font-medium text-[2.1rem] md:text-[2.55rem] leading-[1.15] tracking-[-0.01em] text-ink mt-2">
            Our offices
          </h2>
          <span className="gold-rule gold-rule--center" />
          <p className="text-[1rem] text-muted leading-[1.65] max-w-[560px] mx-auto mt-4">
            Visit us at one of our two London locations.
          </p>
        </div>

        {/* Office cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[800px] mx-auto"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
        >
          {offices.map((office) => (
            <motion.div
              key={office.id}
              variants={item}
              className="bg-surface border border-line rounded-[10px] p-9 hover:border-gold-soft transition-colors duration-200"
            >
              <h3 className="font-serif font-semibold text-[1.2rem] text-ink mb-4">
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
                className="inline-flex items-center gap-1.5 mt-5 text-[0.82rem] font-semibold text-gold-deep hover:text-gold transition-colors"
              >
                Get directions
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
