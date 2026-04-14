"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { createTimeline, stagger, set } from "animejs";
import { splitText } from "animejs/text";
import type { TextSplitter } from "animejs/text";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease, duration } from "@/lib/anime/config";

const features = [
  {
    numeral: "I",
    title: "Both Sides of the Tenancy",
    description:
      "We represent tenants pursuing deposit claims and rent repayment orders — and advise landlords on compliance, licensing, and RRA readiness. That dual perspective makes us sharper on both.",
  },
  {
    numeral: "II",
    title: "Dedicated Immigration Department",
    description:
      "A standalone immigration team with country-specific case knowledge, Home Office policy tracking, and tribunal advocacy from initial application through appeal.",
  },
  {
    numeral: "III",
    title: "Rent Repayment & RRA 2025",
    description:
      "Deep specialism in rent repayment orders — covering all 16 offence types under the Housing and Planning Act 2016 and the Renters' Rights Act 2025, from eligibility assessment through to tribunal.",
  },
  {
    numeral: "IV",
    title: "City & East London",
    description:
      "Offices in the City of London and Leytonstone. Evening appointments available.",
  },
];

export function WhyChooseUs() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const goldBorderRef = React.useRef<HTMLDivElement>(null);
  const numeralRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
  const featureRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      if (goldBorderRef.current) set(goldBorderRef.current, { scaleY: 1 });
      return;
    }

    // Set initial hidden states
    if (goldBorderRef.current) set(goldBorderRef.current, { scaleY: 0 });
    const validNumerals = numeralRefs.current.filter(Boolean) as HTMLSpanElement[];
    const validFeatures = featureRefs.current.filter(Boolean) as HTMLDivElement[];
    set(validNumerals, { scale: 1.3, opacity: 0 });
    set(validFeatures, { opacity: 0, translateX: 6 });

    // Split heading for word-level blur reveal
    let split: TextSplitter | null = null;
    if (headingRef.current) {
      split = splitText(headingRef.current, { words: true });
      set(split.words, { opacity: 0, filter: "blur(4px)" });
    }

    let tl: ReturnType<typeof createTimeline> | null = null;

    const runAnimation = () => {
      tl?.revert();

      // Re-set states before replay
      if (split) set(split.words, { opacity: 0, filter: "blur(4px)" });
      if (goldBorderRef.current) set(goldBorderRef.current, { scaleY: 0 });
      set(validNumerals, { scale: 1.3, opacity: 0 });
      set(validFeatures, { opacity: 0, translateX: 6 });

      tl = createTimeline({
        defaults: { ease: ease.primary },
      });

      // T=0ms — Heading words resolve from blur
      if (split && split.words.length > 0) {
        tl.add(split.words, {
          opacity: [0, 1],
          filter: ["blur(4px)", "blur(0px)"],
          duration: 400,
          delay: stagger(60),
        });
      }

      // T=200ms — Gold border draws
      if (goldBorderRef.current) {
        tl.add(goldBorderRef.current, {
          scaleY: [0, 1],
          duration: duration.slow,
        }, "-=200");
      }

      // T=300ms+ — Numerals stamp in with overshoot, features inscribe
      validNumerals.forEach((numeral, i) => {
        const offset = i === 0 ? "-=200" : "-=250";
        tl!.add(numeral, {
          scale: [1.3, 1.0],
          opacity: [0, 1],
          duration: 350,
          ease: ease.stamp,
        }, offset);

        if (validFeatures[i]) {
          tl!.add(validFeatures[i]!, {
            opacity: [0, 1],
            translateX: [6, 0],
            duration: 300,
          }, "-=280");
        }
      });
    };

    const resetToHidden = () => {
      tl?.revert();
      tl = null;
      if (split) set(split.words, { opacity: 0, filter: "blur(4px)" });
      if (goldBorderRef.current) set(goldBorderRef.current, { scaleY: 0 });
      set(validNumerals, { scale: 1.3, opacity: 0 });
      set(validFeatures, { opacity: 0, translateX: 6 });
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
      split?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="section-rise py-24 md:py-36 bg-surface border-t border-line">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left — text content */}
          <div className="relative lg:pr-16">
            {/* Animated gold border */}
            <div
              ref={goldBorderRef}
              className="hidden lg:block absolute right-0 top-0 bottom-0 w-[4px] bg-gold"
              style={{ transformOrigin: "top" }}
            />

            <div>
              <p className="eyebrow mb-3">The Firm</p>
              <h2
                ref={headingRef}
                className="font-serif font-medium text-[2.4rem] md:text-[3rem] leading-[1.1] tracking-[-0.02em] text-ink mb-8"
              >
                Specialists first. Solicitors always.
              </h2>
            </div>

            <p className="text-[1.125rem] text-muted leading-[1.7] mb-12">
              Three areas of law — tenancy deposit claims, immigration,
              and rent repayment orders — with the depth of a specialist
              firm and the focus to pursue every case to its fullest.
            </p>

            {/* Feature items with roman numerals */}
            <div className="space-y-8">
              {features.slice(0, 2).map((feature, i) => (
                <div key={i} className="group flex gap-6 cursor-default">
                  <span
                    ref={(el) => { numeralRefs.current[i] = el; }}
                    className="font-serif text-[2rem] font-semibold text-gold leading-none flex-shrink-0 w-10 group-hover:scale-[1.06] transition-transform duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]"
                  >
                    {feature.numeral}
                  </span>
                  <div ref={(el) => { featureRefs.current[i] = el; }}>
                    <h3 className="font-serif font-medium text-[1.2rem] text-ink mb-1.5 hover-underline-gold inline-block pb-0.5">
                      {feature.title}
                    </h3>
                    <p className="text-[0.88rem] text-dim leading-[1.65] group-hover:text-muted transition-colors duration-200">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — additional features */}
          <div className="flex flex-col justify-center">
            <div className="space-y-8">
              {features.slice(2).map((feature, i) => (
                <div key={i} className="group flex gap-6 cursor-default">
                  <span
                    ref={(el) => { numeralRefs.current[i + 2] = el; }}
                    className="font-serif text-[2rem] font-semibold text-gold leading-none flex-shrink-0 w-10 group-hover:scale-[1.06] transition-transform duration-200 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]"
                  >
                    {feature.numeral}
                  </span>
                  <div ref={(el) => { featureRefs.current[i + 2] = el; }}>
                    <h3 className="font-serif font-medium text-[1.2rem] text-ink mb-1.5 hover-underline-gold inline-block pb-0.5">
                      {feature.title}
                    </h3>
                    <p className="text-[0.88rem] text-dim leading-[1.65] group-hover:text-muted transition-colors duration-200">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
