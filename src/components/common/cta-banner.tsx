"use client";

import * as React from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CONTACT } from "@/lib/constants";
import { createTimeline } from "animejs";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease, duration } from "@/lib/anime/config";

export interface CTABannerProps {
  title?: string;
  subtitle?: string;
  variant?: "gold" | "dark";
  showPhone?: boolean;
}

export function CTABanner({
  title = "Ready to pursue your claim?",
  variant = "dark",
}: CTABannerProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const ruleTopRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const ruleBottomRef = React.useRef<HTMLDivElement>(null);
  const buttonsRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = sectionRef.current;
    const ruleTop = ruleTopRef.current;
    const titleEl = titleRef.current;
    const ruleBottom = ruleBottomRef.current;
    const buttons = buttonsRef.current;
    if (!el || !ruleTop || !titleEl || !ruleBottom || !buttons) return;

    if (prefersReducedMotion()) return;

    // Set initial hidden states via raw DOM
    ruleTop.style.transform = "scaleX(0)";
    titleEl.style.opacity = "0";
    titleEl.style.transform = "translateY(16px)";
    ruleBottom.style.transform = "scaleX(0)";
    buttons.style.opacity = "0";
    buttons.style.transform = "translateY(10px)";

    let tl: ReturnType<typeof createTimeline> | null = null;

    const runAnimation = () => {
      tl?.revert();

      // Reset to hidden
      ruleTop.style.transform = "scaleX(0)";
      titleEl.style.opacity = "0";
      titleEl.style.transform = "translateY(16px)";
      ruleBottom.style.transform = "scaleX(0)";
      buttons.style.opacity = "0";
      buttons.style.transform = "translateY(10px)";

      tl = createTimeline({
        defaults: { ease: ease.primary },
      });

      // Gold rule draws from center
      tl.add(ruleTop, {
        scaleX: [0, 1],
        duration: 500,
        ease: ease.inkDraw,
      }, 0);

      // Title fades up
      tl.add(titleEl, {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 450,
      }, 200);

      // Bottom accent rule draws
      tl.add(ruleBottom, {
        scaleX: [0, 1],
        duration: 400,
        ease: ease.smooth,
      }, 400);

      // Buttons fade up
      tl.add(buttons, {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: duration.normal,
      }, 500);
    };

    const resetToHidden = () => {
      tl?.revert();
      tl = null;
      ruleTop.style.transform = "scaleX(0)";
      titleEl.style.opacity = "0";
      titleEl.style.transform = "translateY(16px)";
      ruleBottom.style.transform = "scaleX(0)";
      buttons.style.opacity = "0";
      buttons.style.transform = "translateY(10px)";
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runAnimation();
          } else {
            resetToHidden();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      tl?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink overflow-hidden"
    >
      {/* Top gold rule — the threshold moment */}
      <div className="flex justify-center pt-24 md:pt-36">
        <div
          ref={ruleTopRef}
          className="h-px w-32 md:w-48 bg-gold"
          style={{ transformOrigin: "center" }}
        />
      </div>

      <Container>
        <div className="text-center max-w-[700px] mx-auto py-16 md:py-20">
          <h2
            ref={titleRef}
            className="font-serif font-medium text-[2.2rem] md:text-[3rem] leading-[1.1] tracking-[-0.02em] text-white mb-3"
          >
            {title}
          </h2>

          {/* Short gold accent beneath title */}
          <div className="flex justify-center mb-12">
            <div
              ref={ruleBottomRef}
              className="h-px w-16 bg-gold/50"
              style={{ transformOrigin: "center" }}
            />
          </div>

          <div ref={buttonsRef} className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center text-[0.68rem] font-bold uppercase tracking-[0.2em] text-ink bg-gold px-10 py-5 hover:bg-gold-deep active:scale-[0.98] active:duration-100 transition-all duration-200"
            >
              Start Your Claim
            </Link>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-white/60 bg-transparent border border-white/15 px-10 py-5 hover:border-white/40 hover:text-white active:scale-[0.98] active:duration-100 transition-all duration-200"
            >
              <Phone className="w-3.5 h-3.5" />
              Call Us Now
            </a>
          </div>
        </div>
      </Container>

      {/* No bottom padding — flows directly into footer */}
      <div className="pb-4 md:pb-8" />
    </section>
  );
}
