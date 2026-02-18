"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Award, Users, MapPin, MessageSquare } from "lucide-react";
import { Container } from "@/components/ui/container";

const reasons = [
  {
    icon: Award,
    title: "Decades of experience",
    description:
      "Over 20 years of combined expertise across all practice areas, delivering legal advice you can trust.",
  },
  {
    icon: Users,
    title: "Client-focused approach",
    description:
      "Your needs come first. Clear communication and personalised service throughout your legal matter.",
  },
  {
    icon: MapPin,
    title: "Two convenient locations",
    description:
      "Offices in the City and Leytonstone. Accessible wherever you are in London, with evening appointments available.",
  },
  {
    icon: MessageSquare,
    title: "Multilingual services",
    description:
      "Our team speaks Italian, Mandarin, and more — ensuring clear communication for London's diverse communities.",
  },
];

export interface WhyChooseUsProps {
  title?: string;
  subtitle?: string;
}

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-surface border-t border-b border-line">
      <Container>
        {/* Header */}
        <div className="mb-14">
          <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-gold-deep">
            Why Stone &amp; Co.
          </p>
          <h2 className="font-serif font-medium text-[2.1rem] md:text-[2.55rem] leading-[1.15] tracking-[-0.01em] text-ink mt-2">
            Built on integrity, driven by results
          </h2>
          <span className="gold-rule" />
        </div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-x-16 md:gap-y-12"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
        >
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div key={i} variants={item} className="flex gap-5">
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg border border-line bg-bg text-gold">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-[1.15rem] text-ink mb-1.5">
                    {reason.title}
                  </h3>
                  <p className="text-[0.88rem] text-dim leading-[1.65]">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
