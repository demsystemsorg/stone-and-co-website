"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Mail, Phone, Globe } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CTABanner } from "@/components/common";
import { createTimeline, animate, stagger } from "animejs";
import { splitText } from "animejs/text";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";
import type { TeamMember } from "@/types/team";
import type { PracticeArea } from "@/types/practice-area";

interface TeamMemberDetailProps {
  member: TeamMember;
  relatedPracticeAreas: PracticeArea[];
  otherMembers: TeamMember[];
}

/* ── Profile Header ─────────────────────────────────────── */

function ProfileHeader({ member }: { member: TeamMember }) {
  const breadcrumbRef = React.useRef<HTMLDivElement>(null);
  const portraitRef = React.useRef<HTMLDivElement>(null);
  const portraitOverlayRef = React.useRef<HTMLDivElement>(null);
  const eyebrowRef = React.useRef<HTMLDivElement>(null);
  const goldLineRef = React.useRef<HTMLDivElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const titleRef = React.useRef<HTMLParagraphElement>(null);
  const qualsRef = React.useRef<HTMLParagraphElement>(null);
  const badgesRef = React.useRef<HTMLDivElement>(null);
  const contactRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const refs = [
      breadcrumbRef, eyebrowRef, goldLineRef, headlineRef,
      titleRef, qualsRef, badgesRef, contactRef,
    ];

    if (prefersReducedMotion()) {
      refs.forEach((r) => {
        if (r.current) {
          r.current.style.opacity = "1";
          r.current.style.transform = "none";
        }
      });
      if (portraitOverlayRef.current) {
        portraitOverlayRef.current.style.display = "none";
      }
      return;
    }

    // Initial hidden states
    breadcrumbRef.current!.style.opacity = "0";
    eyebrowRef.current!.style.opacity = "0";
    goldLineRef.current!.style.transform = "scaleX(0)";
    titleRef.current!.style.opacity = "0";
    qualsRef.current!.style.opacity = "0";
    badgesRef.current!.style.opacity = "0";
    contactRef.current!.style.opacity = "0";

    const split = splitText(headlineRef.current!, {
      chars: { wrap: "clip" },
    });
    split.chars.forEach((c: HTMLElement) => {
      c.style.transform = "translateY(100%)";
    });

    const tl = createTimeline({
      defaults: { ease: ease.primary },
    });

    // T=0 — Breadcrumb + portrait reveal in parallel
    tl.add(breadcrumbRef.current!, {
      opacity: [0, 1],
      duration: 200,
    });

    // Portrait vertical curtain reveal
    tl.add(portraitOverlayRef.current!, {
      translateY: ["0%", "-101%"],
      duration: 700,
      ease: ease.primary,
    }, 0);

    // T=150 — Eyebrow + gold rule
    tl.add(eyebrowRef.current!, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 300,
    }, 150);

    tl.add(goldLineRef.current!, {
      scaleX: [0, 1],
      duration: 400,
      ease: ease.inkDraw,
    }, "-=200");

    // T=250 — Name character reveal
    tl.add(split.chars, {
      translateY: ["100%", "0%"],
      duration: 500,
      ease: ease.authority,
      delay: stagger(20),
    }, 250);

    // T=400 — Title + qualifications
    tl.add(titleRef.current!, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 300,
    }, 400);

    tl.add(qualsRef.current!, {
      opacity: [0, 1],
      translateY: [6, 0],
      duration: 300,
    }, "-=150");

    // T=500 — Badges + contact stagger
    tl.add(badgesRef.current!, {
      opacity: [0, 1],
      translateY: [6, 0],
      duration: 300,
    }, 500);

    tl.add(contactRef.current!, {
      opacity: [0, 1],
      translateY: [6, 0],
      duration: 300,
    }, "-=150");

    return () => {
      tl.revert();
      split.revert();
    };
  }, []);

  return (
    <section className="bg-white pt-10 pb-12 md:pt-14 md:pb-16 overflow-hidden">
      <Container>
        {/* Breadcrumb */}
        <div ref={breadcrumbRef} className="mb-8">
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-dim hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="text-[0.72rem] uppercase tracking-[0.1em] font-semibold">
              Back to Team
            </span>
          </Link>
        </div>

        {/* 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          {/* Portrait */}
          <div ref={portraitRef} className="md:col-span-5 relative overflow-hidden">
            <div className="border-t-[3px] border-gold">
              <div className="relative aspect-[3/4] bg-line-soft">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            {/* Vertical curtain overlay */}
            <div
              ref={portraitOverlayRef}
              className="absolute inset-0 bg-white z-20 pointer-events-none"
            />
          </div>

          {/* Info */}
          <div className="md:col-span-7 md:pt-4">
            {/* Eyebrow — the member's role */}
            <div
              ref={eyebrowRef}
              className="flex items-center gap-4 mb-6"
              style={{ willChange: "transform" }}
            >
              <span className="text-gold-deep font-sans text-[0.68rem] uppercase tracking-[0.3em] font-extrabold">
                {member.title}
              </span>
              <div
                ref={goldLineRef}
                className="h-px w-20 bg-gold"
                style={{ transformOrigin: "left" }}
              />
            </div>

            {/* Name — the hero element */}
            <h1
              ref={headlineRef}
              className="font-serif font-light text-ink mb-4"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.02em",
                paddingTop: "0.15em",
              }}
            >
              {member.name}
            </h1>

            {/* Title */}
            <p ref={titleRef} className="text-[1.1rem] text-gold-deep font-medium mb-2">
              {member.title}
            </p>

            {/* Qualifications */}
            <p ref={qualsRef} className="text-[0.85rem] text-dim mb-5">
              {member.qualifications.join(" · ")}
            </p>

            {/* Specialization badges */}
            <div ref={badgesRef} className="flex flex-wrap gap-1.5 mb-6">
              {member.specializations.map((spec) => (
                <span
                  key={spec}
                  className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-gold-deep bg-gold-bg px-2.5 py-1"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Contact details */}
            <div ref={contactRef} className="space-y-3">
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-3 text-[0.9rem] text-ink hover:text-gold-deep transition-colors"
                >
                  <Mail className="w-4 h-4 text-dim" />
                  <span>{member.email}</span>
                </a>
              )}
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-3 text-[0.9rem] text-ink hover:text-gold-deep transition-colors"
                >
                  <Phone className="w-4 h-4 text-dim" />
                  <span>{member.phone}</span>
                </a>
              )}
              {member.languages && member.languages.length > 0 && (
                <div className="flex items-center gap-3 text-[0.9rem] text-dim">
                  <Globe className="w-4 h-4" />
                  <span>Languages: {member.languages.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Bio Section ────────────────────────────────────────── */

function BioSection({ member }: { member: TeamMember }) {
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
                filter: ["blur(4px)", "blur(0px)"],
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

  const firstName = member.name.split(" ")[0];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-gold-bg border-t border-line">
      <Container>
        <div className="max-w-[700px]">
          <div className="mb-8">
            <p className="eyebrow mb-3">About {firstName}</p>
            <hr className="gold-rule" />
          </div>

          <div ref={contentRef}>
            <p className="text-[1.05rem] text-dim leading-[1.7]">
              {member.bio}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── Practice Areas Section ─────────────────────────────── */

function PracticeAreasSection({ areas }: { areas: PracticeArea[] }) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const linksRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (linksRef.current) {
              animate(linksRef.current.children, {
                opacity: [0, 1],
                translateY: [10, 0],
                duration: 350,
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
    if (linksRef.current) {
      Array.from(linksRef.current.children).forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white">
      <Container>
        <div className="max-w-[700px]">
          <div className="mb-8">
            <p className="eyebrow mb-3">Areas of Expertise</p>
            <hr className="gold-rule" />
          </div>

          <div ref={linksRef} className="flex flex-col">
            {areas.map((area) => (
              <Link
                key={area.id}
                href={`/practice-areas/${area.slug}`}
                className="group flex items-center gap-3 py-4 border-b border-line last:border-b-0"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                <span className="font-serif font-medium text-[1.1rem] text-ink group-hover:text-gold-deep transition-colors flex-1">
                  {area.title}
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

/* ── Other Team Members Section ─────────────────────────── */

function OtherMembersSection({ members }: { members: TeamMember[] }) {
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

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-line-soft">
      <Container>
        <div className="mb-12">
          <p className="eyebrow mb-3">Our Team</p>
          <h2 className="font-serif font-medium text-[1.8rem] md:text-[2.2rem] leading-[1.1] tracking-[-0.02em] text-ink">
            <em>Meet the Team</em>
          </h2>
          <hr className="gold-rule mt-5" />
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto gap-8"
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

/* ── Main Component ──────────────────────────────────────── */

export function TeamMemberDetail({
  member,
  relatedPracticeAreas,
  otherMembers,
}: TeamMemberDetailProps) {
  const firstName = member.name.split(" ")[0];

  return (
    <>
      <ProfileHeader member={member} />

      <BioSection member={member} />

      {relatedPracticeAreas.length > 0 && (
        <PracticeAreasSection areas={relatedPracticeAreas} />
      )}

      {otherMembers.length > 0 && (
        <OtherMembersSection members={otherMembers} />
      )}

      <CTABanner title={`Speak with ${firstName}`} />
    </>
  );
}
