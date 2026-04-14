"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CTABanner } from "@/components/common";
import { createTimeline, animate, stagger } from "animejs";
import { splitText } from "animejs/text";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";
import type { PracticeArea, Service } from "@/types/practice-area";
import type { TeamMember } from "@/types/team";
import { FAQAccordion } from "./faq-accordion";

interface PracticeAreaDetailProps {
  area: PracticeArea;
  teamMembers: TeamMember[];
  relatedAreas: PracticeArea[];
}

/* ── Eyebrow mapping per practice area ───────────────────── */

const AREA_EYEBROWS: Record<string, string> = {
  "tenancy-deposit-claims": "Housing Law",
  immigration: "Immigration Law",
  "rent-repayment-orders": "Tenant Rights",
};

/* ── Compact Page Header ─────────────────────────────────── */

function PageHeader({ area }: { area: PracticeArea }) {
  const eyebrowRef = React.useRef<HTMLDivElement>(null);
  const goldLineRef = React.useRef<HTMLDivElement>(null);
  const breadcrumbRef = React.useRef<HTMLDivElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const descriptionRef = React.useRef<HTMLParagraphElement>(null);
  const ctaRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) {
      [eyebrowRef, goldLineRef, breadcrumbRef, headlineRef, descriptionRef, ctaRef].forEach((r) => {
        if (r.current) {
          r.current.style.opacity = "1";
          r.current.style.transform = "none";
        }
      });
      return;
    }

    // Initial hidden states (raw DOM)
    breadcrumbRef.current!.style.opacity = "0";
    eyebrowRef.current!.style.opacity = "0";
    goldLineRef.current!.style.transform = "scaleX(0)";
    descriptionRef.current!.style.opacity = "0";
    ctaRef.current!.style.opacity = "0";

    // Split headline for character-level reveal
    const split = splitText(headlineRef.current!, {
      chars: { wrap: "clip" },
    });
    split.chars.forEach((c: HTMLElement) => {
      c.style.transform = "translateY(100%)";
    });

    const tl = createTimeline({
      defaults: { ease: ease.primary },
    });

    // T=0 — Breadcrumb fades in
    tl.add(breadcrumbRef.current!, {
      opacity: [0, 1],
      duration: 200,
    });

    // T=100 — Eyebrow fades in
    tl.add(eyebrowRef.current!, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 300,
    }, 100);

    // Gold rule draws
    tl.add(goldLineRef.current!, {
      scaleX: [0, 1],
      duration: 400,
      ease: ease.inkDraw,
    }, "-=200");

    // T=200 — Title chars reveal
    tl.add(split.chars, {
      translateY: ["100%", "0%"],
      duration: 400,
      ease: ease.authority,
      delay: stagger(20),
    }, 200);

    // T=350 — Description blur-to-focus
    tl.add(descriptionRef.current!, {
      opacity: [0, 1],
      translateY: [12, 0],
      filter: ["blur(4px)", "blur(0px)"],
      duration: 400,
    }, 350);

    // T=400 — CTA fades up
    tl.add(ctaRef.current!, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 300,
    }, 400);

    return () => {
      tl.revert();
      split.revert();
    };
  }, []);

  const eyebrowText = AREA_EYEBROWS[area.slug] ?? "Legal Services";

  return (
    <section className="relative bg-white pt-10 pb-10 md:pt-14 md:pb-14 overflow-hidden">
      <Container>
        {/* Breadcrumb */}
        <div ref={breadcrumbRef} className="mb-6">
          <Link
            href="/practice-areas"
            className="inline-flex items-center gap-2 text-dim hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[0.72rem] uppercase tracking-[0.1em] font-semibold">
              Practice Areas
            </span>
          </Link>
        </div>

        {/* Eyebrow with inline gold rule */}
        <div
          ref={eyebrowRef}
          className="flex items-center gap-4 mb-8"
          style={{ willChange: "transform" }}
        >
          <span className="text-gold-deep font-sans text-[0.68rem] uppercase tracking-[0.3em] font-extrabold">
            {eyebrowText}
          </span>
          <div
            ref={goldLineRef}
            className="h-px w-20 bg-gold"
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Title — moderate size, won't clip */}
        <h1
          ref={headlineRef}
          className="font-serif font-light text-ink max-w-[800px] mb-6"
          style={{
            fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            paddingTop: "0.15em",
          }}
        >
          {area.title}
        </h1>

        {/* Description — compact, no gold border */}
        <p
          ref={descriptionRef}
          className="text-[1.05rem] text-dim leading-[1.7] max-w-[600px] mb-8"
        >
          {area.fullDescription}
        </p>

        {/* Single CTA */}
        <Link
          ref={ctaRef}
          href="/contact"
          className="inline-flex items-center justify-center text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white bg-ink px-8 py-4 hover:bg-gold-deep hover:tracking-[0.22em] active:scale-[0.98] active:duration-100 transition-all duration-200"
        >
          Get Legal Advice
        </Link>
      </Container>
    </section>
  );
}

/* ── Service Card with Wipe Reveal ────────────────────────
   Matches the homepage "Areas of Expertise" pattern:
   - White card on cream background
   - Static gold top accent (3px)
   - Wipe overlay reveals card on scroll
   - Watermark number in bottom-right
   ──────────────────────────────────────────────────────── */

function ServiceCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const card = cardRef.current;
    const overlay = overlayRef.current;
    if (!card || !overlay) return;

    if (prefersReducedMotion()) {
      overlay.style.display = "none";
      return;
    }

    let hasAnimated = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            animate(overlay, {
              translateX: ["0%", "101%"],
              duration: 600,
              ease: ease.primary,
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      data-service-card
      className="relative overflow-hidden"
    >
      <div className="bg-white border-t-[3px] border-gold p-7 md:p-9 h-full relative hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(199,164,87,0.06)] transition-all duration-200">
        {/* Watermark number — bottom-right */}
        <span className="absolute -bottom-3 -right-1 font-serif text-[5rem] md:text-[6rem] text-gold/[0.06] font-light leading-none select-none pointer-events-none">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative z-10">
          <h3 className="font-serif font-medium text-[1.1rem] leading-[1.3] text-ink mb-2">
            {service.title}
          </h3>
          <p className="text-[0.88rem] text-dim leading-[1.7]">
            {service.description}
          </p>
        </div>
      </div>
      {/* Wipe overlay — slides right to reveal card */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-line-soft z-20 pointer-events-none"
      />
    </div>
  );
}

/* ── Services Section ────────────────────────────────────── */

function ServicesSection({ area }: { area: PracticeArea }) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headerRef = React.useRef<HTMLDivElement>(null);

  // Header entrance animation
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
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (headerRef.current) headerRef.current.style.opacity = "0";

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gold-bg border-t border-line">
      <Container>
        {/* Header */}
        <div ref={headerRef} className="mb-12">
          <p className="eyebrow mb-3">Our Services</p>
          <h2 className="font-serif font-medium text-[1.8rem] md:text-[2.2rem] leading-[1.1] tracking-[-0.02em] text-ink">
            How We Help
          </h2>
          <hr className="gold-rule mt-5" />
        </div>

        {/* Service cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {area.services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── FAQ Section ─────────────────────────────────────────── */

function FAQSection({ area }: { area: PracticeArea }) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (contentRef.current) {
              animate(contentRef.current, {
                opacity: [0, 1],
                translateY: [12, 0],
                duration: 500,
                ease: ease.primary,
              });
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (contentRef.current) contentRef.current.style.opacity = "0";

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white">
      <Container>
        <div ref={contentRef} className="max-w-[700px]">
          <div className="mb-10">
            <p className="eyebrow mb-3">Common Questions</p>
            <h2 className="font-serif font-medium text-[1.8rem] md:text-[2.2rem] leading-[1.1] tracking-[-0.02em] text-ink">
              <em>Frequently Asked</em>
            </h2>
            <hr className="gold-rule mt-5" />
          </div>

          <FAQAccordion faqs={area.faqs} />

          <p className="text-dim mt-8 text-[0.9rem]">
            Have more questions?{" "}
            <Link
              href="/contact"
              className="text-gold-deep hover:text-ink font-semibold transition-colors"
            >
              Contact us
            </Link>{" "}
            for personalised advice.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ── Team Section ────────────────────────────────────────── */

function TeamSection({
  members,
}: {
  members: TeamMember[];
}) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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
    if (cardsRef.current) {
      Array.from(cardsRef.current.children).forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
      });
    }

    return () => observer.disconnect();
  }, []);

  // Adaptive grid based on member count
  const gridClass =
    members.length === 1
      ? "max-w-sm mx-auto"
      : members.length === 2
        ? "grid grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto gap-8"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto gap-8";

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-line-soft">
      <Container>
        <div className="mb-12">
          <p className="eyebrow mb-3">Your Legal Team</p>
          <h2 className="font-serif font-medium text-[1.8rem] md:text-[2.2rem] leading-[1.1] tracking-[-0.02em] text-ink">
            <em>Specialist Solicitors</em>
          </h2>
          <hr className="gold-rule mt-5" />
        </div>

        <div ref={cardsRef} className={gridClass}>
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/team/${member.slug}`}
              className="group block border border-line hover:border-gold transition-colors duration-200"
            >
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-line-soft">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
              </div>

              {/* Content */}
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

/* ── Related Practice Areas ──────────────────────────────── */

function RelatedAreas({ areas }: { areas: PracticeArea[] }) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <Container>
        <div className="max-w-4xl">
          <p className="eyebrow mb-6">Related Practice Areas</p>
          <div className="flex flex-wrap gap-6">
            {areas.map((related) => (
              <Link
                key={related.id}
                href={`/practice-areas/${related.slug}`}
                className="group inline-flex items-center gap-3 text-ink hover:text-gold-deep transition-colors duration-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="font-serif font-medium text-[1.1rem]">
                  {related.title}
                </span>
                <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Main Component ──────────────────────────────────────── */

export function PracticeAreaDetail({
  area,
  teamMembers,
  relatedAreas,
}: PracticeAreaDetailProps) {
  return (
    <>
      <PageHeader area={area} />

      <ServicesSection area={area} />

      {area.faqs.length > 0 && <FAQSection area={area} />}

      {teamMembers.length > 0 && <TeamSection members={teamMembers} />}

      {relatedAreas.length > 0 && <RelatedAreas areas={relatedAreas} />}

      <CTABanner title={`Need Help with ${area.title}?`} />
    </>
  );
}
