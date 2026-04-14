"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CTABanner } from "@/components/common";
import { createTimeline, animate, stagger } from "animejs";
import { splitText } from "animejs/text";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";
import type { TeamMember } from "@/types/team";

/* ── Listing Hero ────────────────────────────────────────── */

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

    tl.add(eyebrowRef.current!, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 300,
    });

    tl.add(goldLineRef.current!, {
      scaleX: [0, 1],
      duration: 450,
      ease: ease.inkDraw,
    }, "-=200");

    tl.add(split.chars, {
      translateY: ["100%", "0%"],
      duration: 500,
      ease: ease.authority,
      delay: stagger(25),
    }, "-=200");

    tl.add(subtitleRef.current!, {
      opacity: [0, 1],
      translateY: [16, 0],
      filter: ["blur(6px)", "blur(0px)"],
      duration: 500,
    }, "-=150");

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
    <section className="relative bg-white pt-10 pb-10 md:pt-14 md:pb-14 overflow-hidden">
      <Container>
        <div ref={eyebrowRef} className="flex items-center gap-4 mb-14" style={{ willChange: "transform" }}>
          <span className="text-gold-deep font-sans text-[0.68rem] uppercase tracking-[0.3em] font-extrabold">
            Our People
          </span>
          <div
            ref={goldLineRef}
            className="h-px w-24 bg-gold"
            style={{ transformOrigin: "left" }}
          />
        </div>

        <h1
          ref={headlineRef}
          className="font-serif font-light text-ink max-w-[900px] mb-10 -ml-0.5"
          style={{
            fontSize: "clamp(3rem, 7vw, 4.5rem)",
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            paddingTop: "0.1em",
          }}
        >
          The Team
        </h1>

        <div className="max-w-[520px] relative">
          <div
            ref={goldBorderRef}
            className="absolute left-0 top-0 bottom-0 w-[3px] bg-gold"
            style={{ transformOrigin: "top" }}
          />
          <div ref={subtitleRef}>
            <p className="text-[1.15rem] text-ink leading-relaxed pl-8">
              Four specialist solicitors across three areas of law —
              every client works directly with their solicitor.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Team Card with Vertical Curtain Reveal ──────────────
   Portrait overlay slides UP — like unveiling a gallery portrait.
   Distinct from the horizontal wipe used on service cards.
   ────────────────────────────────────────────────────── */

function TeamCard({
  member,
  sectionBg = "bg-white",
}: {
  member: TeamMember;
  sectionBg?: string;
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
              translateY: ["0%", "-101%"],
              duration: 650,
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
    <div ref={cardRef} className="relative overflow-hidden">
      <Link href={`/team/${member.slug}`} className="group block bg-white h-full">
        {/* Portrait */}
        <div className="relative aspect-[3/4] overflow-hidden bg-line-soft">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
          />
        </div>

        {/* Info with gold left border */}
        <div className="border-l-[3px] border-gold ml-6 mr-6 mb-6 mt-5 pl-5">
          <h2 className="font-serif font-medium text-[1.15rem] leading-[1.3] text-ink mb-1">
            {member.name}
          </h2>
          <p className="text-[0.85rem] text-gold-deep font-medium mb-3">
            {member.title}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {member.specializations.slice(0, 2).map((spec) => (
              <span
                key={spec}
                className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-gold-deep bg-gold-bg px-2 py-0.5"
              >
                {spec}
              </span>
            ))}
          </div>
          <span className="inline-flex items-center text-[0.72rem] font-bold uppercase tracking-[0.2em] text-gold-deep group-hover:tracking-[0.22em] transition-all duration-200">
            View Profile
            <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </Link>

      {/* Vertical curtain overlay — slides UP to reveal */}
      <div
        ref={overlayRef}
        className={`absolute inset-0 ${sectionBg} z-20 pointer-events-none`}
      />
    </div>
  );
}

/* ── Team Grid ───────────────────────────────────────────── */

function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <section className="py-8 md:py-16 bg-white">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          {members.map((member) => (
            <TeamCard key={member.id} member={member} sectionBg="bg-white" />
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── Our Approach Section ────────────────────────────────── */

function OurApproachSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (contentRef.current) {
              animate(contentRef.current.children, {
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
    if (contentRef.current) {
      Array.from(contentRef.current.children).forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 md:py-36 bg-gold-bg border-t border-line">
      <Container>
        <div ref={contentRef} className="max-w-[700px] mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Our Approach</p>
            <h2 className="font-serif font-medium text-[2.2rem] md:text-[2.8rem] leading-[1.1] tracking-[-0.02em] text-ink">
              <em>How We Work</em>
            </h2>
            <hr className="gold-rule gold-rule--center mt-6" />
          </div>

          <div className="space-y-6">
            <p className="text-[1.05rem] text-dim leading-[1.7]">
              At Stone & Co. Solicitors, we believe that everyone deserves
              access to quality legal representation. Our team takes the time to
              understand your unique circumstances and provide clear,
              straightforward advice.
            </p>
            <p className="text-[1.05rem] text-dim leading-[1.7]">
              We pride ourselves on being approachable and responsive. When you
              work with us, you&apos;ll have direct access to your solicitor and
              regular updates on your case. We don&apos;t hide behind legal jargon — we
              explain things in plain English and keep you informed every step
              of the way.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Main Component ──────────────────────────────────────── */

export function TeamContent({ teamMembers }: { teamMembers: TeamMember[] }) {
  return (
    <>
      <ListingHero />
      <TeamGrid members={teamMembers} />
      <OurApproachSection />
      <CTABanner title="Work with Our Team" />
    </>
  );
}
