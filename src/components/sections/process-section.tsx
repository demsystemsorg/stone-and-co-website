"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { createTimeline } from "animejs";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";

const steps = [
  {
    number: "01",
    title: "Consultation",
    description:
      "A detailed review of your situation to identify the strongest legal leverage points.",
  },
  {
    number: "02",
    title: "Formal Notice",
    description:
      "Issuing a commanding Letter Before Action that signals our intent to proceed.",
  },
  {
    number: "03",
    title: "Resolution",
    description:
      "Securing your compensation through aggressive negotiation or decisive court action.",
  },
];

export function ProcessSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const underlineRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const connectorRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    if (prefersReducedMotion()) return;

    const validCards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const validUnderlines = underlineRefs.current.filter(Boolean) as HTMLDivElement[];
    const validConnectors = connectorRefs.current.filter(Boolean) as HTMLDivElement[];

    // Set initial states (raw DOM to avoid hydration mismatch)
    const setHidden = () => {
      validCards.forEach((el) => {
        el.style.opacity = "0.3";
        el.style.transform = "translateX(-8px)";
      });
      validUnderlines.forEach((el) => {
        el.style.transform = "scaleX(0)";
      });
      validConnectors.forEach((el) => {
        el.style.transform = "scaleX(0)";
      });
    };
    setHidden();

    let tl: ReturnType<typeof createTimeline> | null = null;

    const runAnimation = () => {
      tl?.revert();
      setHidden();

      tl = createTimeline({
        defaults: { ease: ease.primary },
      });

      validCards.forEach((card, i) => {
        // Card illuminates
        tl!.add(card, {
          opacity: [0.3, 1],
          translateX: [-8, 0],
          duration: 400,
        }, i === 0 ? 0 : "+=0");

        // Title underline draws
        if (validUnderlines[i]) {
          tl!.add(validUnderlines[i]!, {
            scaleX: [0, 1],
            duration: 300,
          }, "-=300");
        }

        // Connector to next card (energy transfer)
        if (i < validCards.length - 1 && validConnectors[i]) {
          tl!.add(validConnectors[i]!, {
            scaleX: [0, 1],
            duration: 200,
            ease: ease.linear,
          }, "-=100");
        }
      });
    };

    const resetToHidden = () => {
      tl?.revert();
      tl = null;
      setHidden();
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
    <section ref={sectionRef} className="section-rise py-24 md:py-36 bg-line-soft">
      <Container>
        {/* Header — centered italic serif */}
        <div className="text-center mb-16">
          <p className="eyebrow mb-3">How We Work</p>
          <h2 className="font-serif text-[2.4rem] md:text-[3rem] leading-[1.1] tracking-[-0.02em] text-ink">
            <em>The Path to Justice</em>
          </h2>
          <hr className="gold-rule gold-rule--center" />
        </div>

        {/* Cards with momentum connectors */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_32px_1fr_32px_1fr] gap-6 md:gap-0">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div
                ref={(el) => { cardRefs.current[i] = el; }}
                className="group relative bg-white/50 backdrop-blur-sm border border-line p-10 md:p-12 overflow-hidden hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(199,164,87,0.06)] transition-all duration-200 touch-feedback"
              >
                {/* Giant watermark number */}
                <span className="watermark-number absolute -bottom-8 -right-4 group-hover:opacity-[0.10] transition-opacity duration-200">
                  {step.number}
                </span>

                <div className="relative z-10">
                  <h3 className="font-serif font-medium text-[1.5rem] md:text-[1.75rem] leading-[1.2] text-ink pb-4 mb-4">
                    {step.title}
                  </h3>
                  {/* Animated gold underline */}
                  <div
                    ref={(el) => { underlineRefs.current[i] = el; }}
                    className="h-[2px] bg-gold mb-4 -mt-4"
                    style={{ transformOrigin: "left" }}
                  />
                  <p className="text-[1rem] text-muted leading-[1.7]">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Gold connector between cards — desktop only */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center">
                  <div
                    ref={(el) => { connectorRefs.current[i] = el; }}
                    className="h-[1.5px] w-full bg-gold"
                    style={{ transformOrigin: "left" }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
}
