"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { PracticeAreaCard } from "@/components/common/practice-area-card";
import { PRACTICE_AREAS } from "@/lib/constants";

export interface PracticeAreasGridProps {
  title?: string;
  subtitle?: string;
  showAll?: boolean;
  limit?: number;
  variant?: "default" | "alternate";
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function PracticeAreasGrid({
  limit,
}: PracticeAreasGridProps) {
  const areas = limit ? PRACTICE_AREAS.slice(0, limit) : PRACTICE_AREAS;

  return (
    <section id="practice-areas" className="py-16 md:py-24 bg-surface border-t border-line">
      <Container>
        {/* Header — editorial: eyebrow + serif title + gold rule */}
        <div className="mb-14">
          <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-gold-deep">
            Practice Areas
          </p>
          <h2 className="font-serif font-medium text-[2.1rem] md:text-[2.55rem] leading-[1.15] tracking-[-0.01em] text-ink mt-2">
            How we can help
          </h2>
          <span className="gold-rule" />
        </div>

        {/* Grid — bordered cells with 1px line gap */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line rounded-[10px] overflow-hidden"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
        >
          {areas.map((area) => (
            <motion.div key={area.id} variants={item} className="h-full">
              <PracticeAreaCard
                title={area.title}
                description={area.shortDescription}
                href={`/practice-areas/${area.id}`}
              />
            </motion.div>
          ))}

          {/* View all — span remaining cell */}
          <motion.div variants={item}>
            <Link
              href="/practice-areas"
              className="group flex items-center justify-center gap-2 p-8 md:p-9 bg-bg hover:bg-surface transition-colors duration-200 h-full"
            >
              <span className="font-serif font-semibold text-[1.3rem] text-ink">
                View all services
              </span>
              <ArrowRight
                className="w-[18px] h-[18px] text-gold-soft group-hover:text-gold group-hover:translate-x-[3px] transition-all duration-200"
                strokeWidth={1.5}
              />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
