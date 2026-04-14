"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CTABanner } from "@/components/common";
import { createTimeline, animate, stagger } from "animejs";
import { splitText } from "animejs/text";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";
import type { PracticeArea } from "@/types/practice-area";

/* ── Hero Section ─────────────────────────────────────────── */

function ListingHero() {
  const eyebrowRef = React.useRef<HTMLDivElement>(null);
  const goldLineRef = React.useRef<HTMLDivElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLDivElement>(null);
  const goldBorderRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) {
      [eyebrowRef, goldLineRef, headlineRef, subtitleRef, goldBorderRef].forEach((r) => {
        if (r.current) {
          r.current.style.opacity = "1";
          r.current.style.transform = "none";
        }
      });
      return;
    }

    // Initial hidden states (raw DOM)
    eyebrowRef.current!.style.opacity = "0";
    goldLineRef.current!.style.transform = "scaleX(0)";
    subtitleRef.current!.style.opacity = "0";
    goldBorderRef.current!.style.transform = "scaleY(0)";

    const split = splitText(headlineRef.current!, {
      chars: { wrap: "clip" },
    });
    split.chars.forEach((c: HTMLElement) => {
      c.style.transform = "translateY(100%)";
    });

    const tl = createTimeline({
      defaults: { ease: ease.primary },
    });

    // Eyebrow fades in
    tl.add(eyebrowRef.current!, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 300,
    });

    // Gold rule draws
    tl.add(goldLineRef.current!, {
      scaleX: [0, 1],
      duration: 450,
      ease: ease.inkDraw,
    }, "-=200");

    // Title chars reveal
    tl.add(split.chars, {
      translateY: ["100%", "0%"],
      duration: 500,
      ease: ease.authority,
      delay: stagger(25),
    }, "-=200");

    // Subtitle fades with blur-to-focus
    tl.add(subtitleRef.current!, {
      opacity: [0, 1],
      translateY: [16, 0],
      filter: ["blur(6px)", "blur(0px)"],
      duration: 500,
    }, "-=150");

    // Gold left border draws
    tl.add(goldBorderRef.current!, {
      scaleY: [0, 1],
      duration: 400,
    }, "<");

    return () => {
      tl.revert();
      split.revert();
    };
  }, []);

  return (
    <section className="relative bg-white pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      <Container>
        {/* Eyebrow with inline gold rule */}
        <div ref={eyebrowRef} className="flex items-center gap-4 mb-14" style={{ willChange: "transform" }}>
          <span className="text-gold-deep font-sans text-[0.68rem] uppercase tracking-[0.3em] font-extrabold">
            Our Expertise
          </span>
          <div
            ref={goldLineRef}
            className="h-px w-24 bg-gold"
            style={{ transformOrigin: "left" }}
          />
        </div>

        {/* Title */}
        <h1
          ref={headlineRef}
          className="font-serif font-light text-ink max-w-[900px] mb-10 -ml-0.5"
          style={{ fontSize: "clamp(3rem, 7vw, 4.5rem)", lineHeight: 1.12, letterSpacing: "-0.03em" }}
        >
          Practice Areas
        </h1>

        {/* Subtitle with gold left border */}
        <div className="max-w-[500px] relative">
          <div
            ref={goldBorderRef}
            className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold"
            style={{ transformOrigin: "top" }}
          />
          <div ref={subtitleRef}>
            <p className="text-[1.15rem] text-ink leading-relaxed pl-8">
              We focus on three areas of law so every client benefits from
              deep specialist expertise.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Practice Area Block ──────────────────────────────────── */

function PracticeAreaBlock({ area, index }: { area: PracticeArea; index: number }) {
  const blockRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            animate(el, {
              opacity: [0, 1],
              translateY: [24, 0],
              duration: 500,
              ease: ease.primary,
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    if (blockRef.current) {
      blockRef.current.style.opacity = "0";
      observer.observe(blockRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={blockRef}>
      <Link
        href={`/practice-areas/${area.slug}`}
        className="group block py-12 md:py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-12">
          {/* Left: Number + Title */}
          <div className="md:col-span-5 mb-4 md:mb-0">
            <span className="font-serif text-[3.5rem] md:text-[4.5rem] text-gold/20 font-light leading-none select-none block mb-2">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="font-serif font-medium text-[1.8rem] md:text-[2.2rem] leading-[1.15] tracking-[-0.02em] text-ink group-hover:text-gold-deep transition-colors duration-200">
              {area.title}
            </h2>
          </div>

          {/* Right: Description + Services */}
          <div className="md:col-span-7">
            <p className="text-[1.05rem] text-dim leading-[1.7] mb-6">
              {area.shortDescription}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
              {area.services.slice(0, 4).map((service, i) => (
                <span key={i} className="text-[0.75rem] text-dim/70">
                  {service.title}
                  {i < Math.min(area.services.length, 4) - 1 && <span className="ml-4 text-gold/40">|</span>}
                </span>
              ))}
              {area.services.length > 4 && (
                <span className="text-[0.75rem] text-gold-deep font-semibold">
                  +{area.services.length - 4} more
                </span>
              )}
            </div>
            <span className="inline-flex items-center text-[0.72rem] font-bold uppercase tracking-[0.2em] text-gold-deep group-hover:tracking-[0.22em] transition-all duration-200">
              Learn more
              <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
      {/* Gold rule divider */}
      <hr className="gold-rule" style={{ width: "100%" }} />
    </div>
  );
}

/* ── Why Choose Us ────────────────────────────────────────── */

const reasons = [
  {
    numeral: "I",
    title: "Specialist Expertise",
    description: "Three practice areas, deep concentrated knowledge. Every case benefits from focused expertise.",
  },
  {
    numeral: "II",
    title: "Client-Focused Approach",
    description: "We understand your unique situation and provide tailored advice for your specific needs.",
  },
  {
    numeral: "III",
    title: "Clear Communication",
    description: "No legal jargon. Plain English at every stage. You always know where your case stands.",
  },
  {
    numeral: "IV",
    title: "Transparent Pricing",
    description: "Clear cost estimates upfront with various funding options including fixed fees.",
  },
  {
    numeral: "V",
    title: "Accessible Offices",
    description: "City of London and Leytonstone. Conveniently located to serve clients across London.",
  },
  {
    numeral: "VI",
    title: "RRA 2025 Ready",
    description: "At the forefront of the Renters' Rights Act 2025, advising on expanded tenant protections.",
  },
];

function WhyChooseSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const itemsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (itemsRef.current) {
              animate(itemsRef.current.children, {
                opacity: [0, 1],
                translateY: [16, 0],
                duration: 400,
                ease: ease.primary,
                delay: stagger(80),
              });
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    if (itemsRef.current) {
      Array.from(itemsRef.current.children).forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="section-rise py-24 md:py-36 bg-line-soft">
      <Container>
        <div className="max-w-[700px] mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">Why Stone & Co.</p>
            <h2 className="font-serif font-medium text-[2.2rem] md:text-[2.8rem] leading-[1.1] tracking-[-0.02em] text-ink">
              <em>Our Standards</em>
            </h2>
            <hr className="gold-rule gold-rule--center mt-6" />
          </div>

          {/* Reasons list */}
          <div ref={itemsRef} className="space-y-0">
            {reasons.map((reason, i) => (
              <div key={i} className="py-8 border-b border-line last:border-b-0">
                <div className="flex gap-6 items-start">
                  <span className="font-serif text-[1.3rem] text-gold/50 font-light leading-none pt-1 select-none w-10 flex-shrink-0">
                    {reason.numeral}
                  </span>
                  <div>
                    <h3 className="font-serif font-medium text-[1.15rem] leading-[1.3] text-ink mb-1.5">
                      {reason.title}
                    </h3>
                    <p className="text-[0.9rem] text-dim leading-[1.7]">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Main Component ───────────────────────────────────────── */

export function PracticeAreasContent({ practiceAreas }: { practiceAreas: PracticeArea[] }) {
  return (
    <>
      <ListingHero />

      {/* Practice Area Blocks */}
      <section className="py-8 md:py-16 bg-white">
        <Container>
          {practiceAreas.map((area, i) => (
            <PracticeAreaBlock key={area.id} area={area} index={i} />
          ))}
        </Container>
      </section>

      <WhyChooseSection />

      <CTABanner title="Need Legal Advice?" />
    </>
  );
}
