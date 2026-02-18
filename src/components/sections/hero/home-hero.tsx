"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Award, Users, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CONTACT } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const trustItems = [
  { icon: Shield, label: "SRA Regulated" },
  { icon: Award, label: "20+ Years Experience" },
  { icon: Users, label: "5,000+ Clients" },
  { icon: MapPin, label: "2 London Offices" },
];

export function HomeHero() {
  return (
    <section className="relative min-h-[88vh] flex items-center bg-bg overflow-hidden">
      {/* Subtle warm radial */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_80%_40%,rgba(199,164,87,0.04)_0%,transparent_70%)] pointer-events-none" />

      <Container className="relative z-10">
        <div className="py-16 md:py-24">
          {/* Eyebrow */}
          <motion.p
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
            className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-gold-deep mb-6"
          >
            SRA Regulated Solicitors
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="font-serif font-medium text-[2.8rem] sm:text-[3.6rem] lg:text-[4rem] leading-[1.08] tracking-[-0.015em] text-ink max-w-[680px] mb-6"
          >
            Legal counsel for{" "}
            <span className="text-gold">every stage</span> of life
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="visible"
            className="text-[1.05rem] text-muted leading-[1.7] max-w-[520px] mb-10"
          >
            Trusted solicitors serving London with expertise in family law,
            immigration, employment disputes, and more. Two convenient
            locations, one commitment to excellence.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-4 mb-14"
          >
            <Link
              href="/contact"
              className="inline-flex items-center justify-center text-[0.85rem] font-semibold tracking-[0.01em] text-surface bg-ink border-[1.5px] border-ink px-8 py-3.5 rounded-md hover:bg-gold-deep hover:border-gold-deep hover:shadow-gold transition-all duration-200"
            >
              Make an Enquiry
            </Link>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center text-[0.85rem] font-semibold text-ink bg-transparent border-[1.5px] border-gold px-8 py-3.5 rounded-md hover:bg-gold hover:text-surface transition-all duration-200"
            >
              Call Office
            </a>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-8 pt-8 border-t border-line"
          >
            {trustItems.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon className="w-[18px] h-[18px] text-gold" strokeWidth={1.5} />
                <span className="text-[0.78rem] font-medium text-dim tracking-[0.01em]">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
