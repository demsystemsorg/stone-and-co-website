"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Clock, Phone, CheckCircle, ArrowRight } from "lucide-react";
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

const problems = [
  {
    headline: "Being asked to leave?",
    description:
      "If your landlord has given you a notice — or is threatening to — you may have stronger rights than you think. The new law makes many eviction notices invalid.",
  },
  {
    headline: "Rent going up unfairly?",
    description:
      "Landlords now have to follow strict rules when increasing rent. If they haven't, you can challenge it.",
  },
  {
    headline: "Living with damp, mould or disrepair?",
    description:
      "Your landlord is legally required to fix serious problems quickly. If they won't, you may be entitled to compensation.",
  },
  {
    headline: "Been turned down because of benefits or children?",
    description:
      "Discrimination against tenants on benefits or with children is now illegal. We can help you take action.",
  },
];

const trustPoints = [
  "No obligation — just a conversation",
  "A solicitor will review your case personally",
  "We'll tell you honestly if you have a claim",
  "Legal aid may be available for your case",
];

export default function RentersRightsPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[80vh] flex items-center bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(199,164,87,0.08)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />

        <Container className="relative z-10">
          <div className="py-16 md:py-24 max-w-3xl">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-8"
            >
              <Shield className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-sm font-medium text-[var(--gold)]">
                New Law — Your Rights Have Changed
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="visible"
              className="font-serif font-medium text-[2.4rem] sm:text-[3.2rem] lg:text-[3.8rem] leading-[1.08] tracking-[-0.015em] text-white mb-6"
            >
              Having problems{" "}
              <span className="text-[var(--gold)]">with your landlord?</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="visible"
              className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-xl"
            >
              The Renters&apos; Rights Act 2025 gives tenants in England
              powerful new protections. Tell us what&apos;s happening — it
              takes 2 minutes — and a solicitor will call you back.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                href="/tenant-enquiry"
                className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-neutral-950 bg-[var(--gold)] border-[1.5px] border-[var(--gold)] px-8 py-4 rounded-md hover:bg-[#b8963e] hover:border-[#b8963e] transition-all duration-200 shadow-lg shadow-[var(--gold)]/20"
              >
                Check My Rights
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-white/70 bg-transparent border-[1.5px] border-white/20 px-8 py-4 rounded-md hover:border-white/50 hover:text-white transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                Call Us Now
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-6 text-sm text-white/40"
            >
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--gold)]" />
                Urgent cases: callback within 2 hours
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[var(--gold)]" />
                SRA regulated solicitors
              </span>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* PROBLEMS WE SOLVE */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-[var(--gold)] mb-3">
              We Can Help With
            </p>
            <h2 className="font-serif font-medium text-[1.8rem] md:text-[2.2rem] leading-[1.2] text-neutral-900">
              Sound familiar?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {problems.map((problem, i) => (
              <div
                key={i}
                className="p-6 rounded-lg border border-neutral-200 hover:border-[var(--gold)]/30 hover:shadow-sm transition-all"
              >
                <h3 className="font-serif font-medium text-lg text-neutral-900 mb-2">
                  {problem.headline}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/tenant-enquiry"
              className="inline-flex items-center gap-2 text-[0.85rem] font-semibold text-neutral-950 bg-[var(--gold)] border-[1.5px] border-[var(--gold)] px-8 py-3.5 rounded-md hover:bg-[#b8963e] hover:border-[#b8963e] transition-all duration-200"
            >
              Tell Us What&apos;s Happening
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <Container>
          <div className="text-center mb-12">
            <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-[var(--gold)] mb-3">
              Simple Process
            </p>
            <h2 className="font-serif font-medium text-[1.8rem] md:text-[2.2rem] leading-[1.2] text-neutral-900">
              Three steps. That&apos;s it.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Tell us what's happening",
                desc: "Fill out our short form. Plain English, no legal jargon. Takes about 2 minutes.",
              },
              {
                step: "2",
                title: "We'll call you back",
                desc: "A qualified solicitor will review your case and call you — usually the same day.",
              },
              {
                step: "3",
                title: "Know where you stand",
                desc: "We'll explain your rights clearly and tell you what we can do to help.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-serif font-semibold text-[var(--gold)]">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-medium text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* TRUST + FINAL CTA */}
      <section className="py-16 md:py-24 bg-neutral-950">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif font-medium text-[1.8rem] md:text-[2.2rem] leading-[1.2] text-white mb-6">
              Not sure if you have a case?
            </h2>
            <p className="text-white/50 leading-relaxed mb-8">
              That&apos;s completely fine. Most of our clients weren&apos;t sure either.
              Tell us what&apos;s happening and we&apos;ll give you an honest answer.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-md mx-auto mb-10">
              {trustPoints.map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" />
                  <span className="text-sm text-white/60">{point}</span>
                </div>
              ))}
            </div>

            <Link
              href="/tenant-enquiry"
              className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-neutral-950 bg-[var(--gold)] border-[1.5px] border-[var(--gold)] px-10 py-4 rounded-md hover:bg-[#b8963e] hover:border-[#b8963e] transition-all duration-200 shadow-lg shadow-[var(--gold)]/20"
            >
              Check My Rights — It&apos;s Free
              <ArrowRight className="w-5 h-5" />
            </Link>

            <p className="text-xs text-white/30 mt-4">
              Takes 2 minutes. Completely confidential. No obligation.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
