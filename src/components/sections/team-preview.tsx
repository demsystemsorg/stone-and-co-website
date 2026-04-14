"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { animate, stagger } from "animejs";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";
import { featuredTeamMembers } from "@/data/team";

export function TeamPreview() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (headerRef.current) {
              animate(headerRef.current, {
                opacity: [0, 1],
                translateY: [12, 0],
                duration: 400,
                ease: ease.primary,
              });
            }
            if (cardsRef.current) {
              animate(cardsRef.current.children, {
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 450,
                ease: ease.primary,
                delay: stagger(100),
              });
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (headerRef.current) headerRef.current.style.opacity = "0";
    if (cardsRef.current) {
      Array.from(cardsRef.current.children).forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
      });
    }

    return () => observer.disconnect();
  }, []);

  const members = featuredTeamMembers.slice(0, 3);

  return (
    <section ref={sectionRef} className="py-24 md:py-36 bg-line-soft">
      <Container>
        {/* Header */}
        <div ref={headerRef} className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow mb-3">Our People</p>
            <h2 className="font-serif font-medium text-[2.2rem] md:text-[2.8rem] leading-[1.1] tracking-[-0.02em] text-ink">
              <em>The Team</em>
            </h2>
            <hr className="gold-rule mt-5" />
          </div>
          <Link
            href="/team"
            className="inline-flex items-center text-[0.72rem] font-bold uppercase tracking-[0.2em] text-gold-deep hover:tracking-[0.22em] transition-all duration-200 shrink-0"
          >
            View Full Team
            <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Link>
        </div>

        {/* Team grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/team/${member.slug}`}
              className="group block border border-line hover:border-gold transition-colors duration-200 bg-white"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-line-soft">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-serif font-medium text-[1.1rem] text-ink mb-1">
                  {member.name}
                </h3>
                <p className="text-[0.8rem] text-dim mb-3">{member.title}</p>
                <div className="flex flex-wrap gap-1.5">
                  {member.specializations.slice(0, 2).map((spec) => (
                    <span
                      key={spec}
                      className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-gold-deep bg-gold-bg px-2 py-0.5"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
