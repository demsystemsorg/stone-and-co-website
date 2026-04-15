"use client";

import * as React from "react";
import Link from "next/link";
import { Shield, Award, Users, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CONTACT } from "@/lib/constants";
import { createTimeline, stagger, animate } from "animejs";
import { splitText } from "animejs/text";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease, duration } from "@/lib/anime/config";
import { useProximityGlow } from "@/lib/anime/useProximity";
import { HeroDisplayLogo, type HeroDisplayLogoHandle } from "./hero-display-logo";
import { HeroCarousel } from "./hero-carousel";

const trustItems = [
  { icon: Shield, label: "SRA #640836" },
  { icon: MapPin, label: "2 London Offices" },
  { icon: Award, label: "Free Initial Assessment" },
  { icon: Users, label: "Specialist Focus" },
];

function TrustItem({ icon: Icon, label }: { icon: typeof Shield; label: string }) {
  const itemRef = React.useRef<HTMLDivElement>(null);
  useProximityGlow(itemRef, { radius: 150, brightnessMax: 1.15 });

  return (
    <div ref={itemRef} className="flex items-center gap-2.5">
      <Icon className="w-[15px] h-[15px] text-gold" strokeWidth={1.5} />
      <span className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-dim">
        {label}
      </span>
    </div>
  );
}

export function HomeHero() {
  const eyebrowRef = React.useRef<HTMLDivElement>(null);
  const goldLineRef = React.useRef<HTMLDivElement>(null);
  const headlineRef = React.useRef<HTMLHeadingElement>(null);
  const subheadlineRef = React.useRef<HTMLDivElement>(null);
  const goldBorderRef = React.useRef<HTMLDivElement>(null);
  const cta1Ref = React.useRef<HTMLAnchorElement>(null);
  const cta2Ref = React.useRef<HTMLAnchorElement>(null);
  const trustStripRef = React.useRef<HTMLDivElement>(null);
  const trustItemsRef = React.useRef<HTMLDivElement>(null);
  const displayLogoRef = React.useRef<HTMLDivElement>(null);
  const displayLogoHandle = React.useRef<HeroDisplayLogoHandle>(null);

  React.useEffect(() => {
    if (prefersReducedMotion()) {
      // Show everything instantly via raw DOM (no anime.js set())
      const showRefs = [
        eyebrowRef, goldLineRef, headlineRef, subheadlineRef,
        goldBorderRef, cta1Ref, cta2Ref, trustStripRef,
      ];
      showRefs.forEach((r) => {
        if (r.current) {
          r.current.style.opacity = "1";
          r.current.style.transform = "none";
        }
      });
      if (trustItemsRef.current) {
        Array.from(trustItemsRef.current.children).forEach((el) => {
          (el as HTMLElement).style.opacity = "1";
          (el as HTMLElement).style.transform = "none";
        });
      }
      return;
    }

    // Initial states set via raw DOM to avoid anime.js set() state-tracking conflicts
    eyebrowRef.current!.style.opacity = "0";
    goldLineRef.current!.style.transform = "scaleX(0)";
    subheadlineRef.current!.style.opacity = "0";
    goldBorderRef.current!.style.transform = "scaleY(0)";
    cta1Ref.current!.style.opacity = "0";
    cta2Ref.current!.style.opacity = "0";
    trustStripRef.current!.style.opacity = "0";
    if (trustItemsRef.current) {
      Array.from(trustItemsRef.current.children).forEach((el) => {
        (el as HTMLElement).style.opacity = "0";
        (el as HTMLElement).style.transform = "scale(0.85)";
      });
    }

    // Split headline text for character-level reveal
    const split = splitText(headlineRef.current!, {
      chars: { wrap: "clip" },
    });

    // Set initial state for split chars via raw DOM
    split.chars.forEach((c: HTMLElement) => { c.style.transform = "translateY(100%)"; });

    // Build the orchestrated timeline
    const tl = createTimeline({
      defaults: { ease: ease.primary },
    });

    // T=0ms — Eyebrow fades in
    tl.add(eyebrowRef.current!, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 300,
    });

    // T=100ms — Gold rule draws with ink-draw overshoot
    tl.add(goldLineRef.current!, {
      scaleX: [0, 1],
      duration: 450,
      ease: ease.inkDraw,
    }, "-=200");

    // Separate period chars for gavel-tap treatment
    const periods = split.chars.filter(
      (c: HTMLElement) => c.textContent?.trim() === "."
    );
    // T=200ms — Headline chars reveal with authority landing
    tl.add(split.chars, {
      translateY: ["100%", "0%"],
      duration: 500,
      ease: ease.authority,
      delay: stagger(25),
    }, "-=200");

    // Period chars get gavel-tap: elastic scaleY micro-bounce after landing
    if (periods.length > 0) {
      tl.add(periods, {
        scaleY: [0.92, 1.0],
        duration: 400,
        ease: ease.punctuate,
        delay: stagger(80),
      }, "-=200");
    }

    // T=850ms — Subheadline paragraph with clarity blur-to-focus
    tl.add(subheadlineRef.current!, {
      opacity: [0, 1],
      translateY: [16, 0],
      filter: ["blur(6px)", "blur(0px)"],
      duration: 500,
    }, "-=150");

    // T=850ms — Gold left border draws (parallel with subheadline)
    tl.add(goldBorderRef.current!, {
      scaleY: [0, 1],
      duration: 400,
    }, "<");

    // T=1000ms — CTA button 1
    tl.add(cta1Ref.current!, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: duration.normal,
    }, "-=200");

    // T=1080ms — CTA button 2
    tl.add(cta2Ref.current!, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: duration.normal,
    }, "-=270");

    // T=1250ms — Trust strip container
    tl.add(trustStripRef.current!, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 300,
    }, "-=200");

    // T=1300ms — Trust items radiate from center
    if (trustItemsRef.current) {
      tl.add(trustItemsRef.current.children, {
        scale: [0.85, 1],
        opacity: [0, 1],
        duration: 250,
        delay: stagger(60, { from: "center" }),
      }, "-=200");
    }

    // ── Display logo animation (delegated to variant component) ──
    const handle = displayLogoHandle.current;
    if (handle) {
      handle.registerOnTimeline(tl);
    }

    return () => {
      tl.revert();
      split.revert();
    };
  }, []);

  // Parallax + scroll-to-top replay for display logo
  React.useEffect(() => {
    if (prefersReducedMotion()) return;
    const isMobile = window.matchMedia("(hover: none)").matches;
    let wasScrolled = false;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const maxScroll = window.innerHeight;
          const progress = Math.min(scrollY / maxScroll, 1);

          if (trustStripRef.current) {
            trustStripRef.current.style.transform = `translateY(${progress * (isMobile ? -8 : -15)}px)`;
          }
          if (eyebrowRef.current) {
            eyebrowRef.current.style.transform = `translateY(${progress * (isMobile ? 4 : 8)}px)`;
          }
          if (displayLogoRef.current) {
            displayLogoRef.current.style.transform = `translateY(${progress * -8}px)`;
          }

          // Replay display logo animation when scrolling back to top
          if (wasScrolled && scrollY === 0) {
            displayLogoHandle.current?.replay();
          }
          wasScrolled = scrollY > 20;

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">

      {/* Background image carousel — extremely subtle */}
      <HeroCarousel />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 md:gap-8 lg:gap-12 pt-16 pb-24 md:pt-24 md:pb-36">
          {/* Left column — hero content */}
          <div className="md:col-span-8">
            {/* Eyebrow with inline gold rule */}
            <div ref={eyebrowRef} className="flex items-center gap-4 mb-14" style={{ willChange: "transform" }}>
              <span className="text-gold-deep font-sans text-[0.68rem] uppercase tracking-[0.3em] font-extrabold">
                SRA Regulated Solicitors
              </span>
              <div
                ref={goldLineRef}
                className="h-px w-24 bg-gold"
                style={{ transformOrigin: "left" }}
              />
            </div>

            {/* Massive serif headline — each line has a draw-through underline on hover */}
            <h1
              ref={headlineRef}
              className="text-huge text-ink max-w-[900px] mb-10 -ml-0.5"
            >
              <span className="group/line relative inline-block cursor-default">
                Your claim.
                <span className="pointer-events-none absolute left-0 bottom-[0.08em] h-[2px] w-full bg-ink origin-right scale-x-0 transition-transform duration-300 ease-out group-hover/line:origin-left group-hover/line:scale-x-100" />
              </span>
              <br />
              <span className="group/gold cursor-default">
                <span className="relative inline-block text-gold italic">
                  Our
                  <span className="pointer-events-none absolute left-0 bottom-[0.08em] h-[2px] w-full bg-gold origin-right scale-x-0 transition-transform duration-300 ease-out group-hover/gold:origin-left group-hover/gold:scale-x-100" />
                </span>
                <br />
                <span className="relative inline-block text-gold">
                  priority.
                  <span className="pointer-events-none absolute left-0 bottom-[0.08em] h-[2px] w-full bg-gold origin-right scale-x-0 transition-transform duration-300 ease-out group-hover/gold:origin-left group-hover/gold:scale-x-100" />
                </span>
              </span>
            </h1>

            {/* Subheadline with gold left border — bounce + line re-draw on hover */}
            <div className="max-w-[500px] relative">
              <div
                ref={goldBorderRef}
                className="absolute left-0 top-0 bottom-12 w-[3px] bg-gold"
                style={{ transformOrigin: "top" }}
              />

              <div
                ref={subheadlineRef}
                className="cursor-default"
                onMouseEnter={() => {
                  if (prefersReducedMotion()) return;
                  const sub = subheadlineRef.current;
                  const border = goldBorderRef.current;
                  if (!sub || !border) return;

                  // Subtle bounce on paragraph
                  animate(sub, {
                    translateY: [-3, 0],
                    duration: 600,
                    ease: "outElastic(1, 0.8)",
                  });

                  // Gold border re-draws from top
                  border.style.transform = "scaleY(0)";
                  animate(border, {
                    scaleY: [0, 1],
                    duration: 450,
                    ease: ease.inkDraw,
                  });
                }}
              >
                <p className="text-[1.2rem] text-ink leading-relaxed mb-12 pl-8">
                  London solicitors specialising in tenancy deposit claims,
                  immigration, and rent repayment orders. Two offices,
                  one standard of precision.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pl-8">
                <Link
                  ref={cta1Ref}
                  href="/contact"
                  className="inline-flex items-center justify-center text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white bg-ink px-10 py-5 hover:bg-gold-deep hover:tracking-[0.22em] active:scale-[0.98] active:duration-100 transition-all duration-200"
                >
                  Make an Enquiry
                </Link>
                <a
                  ref={cta2Ref}
                  href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center justify-center text-[0.68rem] font-bold uppercase tracking-[0.2em] text-ink bg-white border border-ink px-10 py-5 hover:bg-ink hover:text-white active:scale-[0.98] active:duration-100 transition-all duration-200"
                >
                  Call Office
                </a>
              </div>
            </div>
          </div>

          {/* Right column — seal hidden */}
        </div>
      </Container>

      {/* Trust strip — pinned to bottom */}
      <div
        ref={trustStripRef}
        className="absolute bottom-0 left-0 w-full border-t border-ink/10 bg-white/80 backdrop-blur-sm z-10"
        style={{ willChange: "transform" }}
      >
        <Container>
          <div ref={trustItemsRef} className="py-6 flex items-center justify-between">
            {trustItems.map(({ icon, label }) => (
              <TrustItem key={label} icon={icon} label={label} />
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
