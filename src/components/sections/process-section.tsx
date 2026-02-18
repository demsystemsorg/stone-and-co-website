"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";

const steps = [
  {
    number: "01",
    title: "Tell us your matter",
    description:
      "A brief enquiry form. No jargon, just plain questions about what you need help with.",
  },
  {
    number: "02",
    title: "We match your solicitor",
    description:
      "Your enquiry goes directly to the specialist best placed to handle your case.",
  },
  {
    number: "03",
    title: "Consultation within 24 hours",
    description:
      "You'll hear from us within one working day with a clear next step and transparent fees.",
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export function ProcessSection() {
  return (
    <section className="py-16 md:py-24 bg-bg">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-gold-deep">
            How We Work
          </p>
          <h2 className="font-serif font-medium text-[2.1rem] md:text-[2.55rem] leading-[1.15] tracking-[-0.01em] text-ink mt-2">
            Three steps to resolution
          </h2>
          <span className="gold-rule gold-rule--center" />
          <p className="text-[1rem] text-muted leading-[1.65] max-w-[560px] mx-auto mt-4">
            Tell us what you need — we&apos;ll route it instantly to the right person.
          </p>
        </div>

        {/* Steps */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10 max-w-[920px] mx-auto"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={i}
              variants={item}
              className="text-center relative"
            >
              <span className="font-serif font-normal text-[3.2rem] leading-none text-gold-soft block mb-5">
                {step.number}
              </span>
              <h3 className="font-serif font-semibold text-[1.25rem] text-ink mb-2.5">
                {step.title}
              </h3>
              <p className="text-[0.88rem] text-dim leading-[1.65] max-w-[280px] mx-auto">
                {step.description}
              </p>

              {/* Connector line — desktop only */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 -right-5 w-10 h-px bg-line" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
