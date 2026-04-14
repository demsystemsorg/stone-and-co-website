"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PRACTICE_AREAS } from "@/lib/constants";
import { createTimeline, set } from "animejs";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";

export interface PracticeAreasGridProps {
  title?: string;
  subtitle?: string;
  showAll?: boolean;
  limit?: number;
  variant?: "default" | "alternate";
}

const watermarkNumbers = ["01", "02", "03"];

export function PracticeAreasGrid({
  limit,
}: PracticeAreasGridProps) {
  const areas = limit ? PRACTICE_AREAS.slice(0, limit) : PRACTICE_AREAS;
  const heroArea = areas[0];
  const sideAreas = areas.slice(1);

  const sectionRef = React.useRef<HTMLElement>(null);
  const heroOverlayRef = React.useRef<HTMLDivElement>(null);
  const sideOverlayRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const overlays = [
      heroOverlayRef.current,
      ...sideOverlayRefs.current.filter(Boolean),
    ].filter(Boolean) as HTMLDivElement[];

    if (prefersReducedMotion()) {
      overlays.forEach((o) => { o.style.display = "none"; });
      return;
    }

    // Set initial state: overlays cover cards
    overlays.forEach((o) => set(o, { translateX: "0%" }));

    let tl: ReturnType<typeof createTimeline> | null = null;

    const runAnimation = () => {
      tl?.revert();
      overlays.forEach((o) => set(o, { translateX: "0%" }));

      tl = createTimeline({
        defaults: { ease: ease.primary },
      });

      // Hero card wipe first
      if (heroOverlayRef.current) {
        tl.add(heroOverlayRef.current, {
          translateX: ["0%", "100%"],
          duration: 700,
        });
      }

      // Side cards wipe in sequence
      const validSideOverlays = sideOverlayRefs.current.filter(Boolean) as HTMLDivElement[];
      validSideOverlays.forEach((overlay, i) => {
        tl!.add(overlay, {
          translateX: ["0%", "100%"],
          duration: 600,
        }, i === 0 ? "-=500" : "-=450");
      });
    };

    const resetToHidden = () => {
      tl?.revert();
      tl = null;
      overlays.forEach((o) => set(o, { translateX: "0%" }));
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
    <section ref={sectionRef} id="practice-areas" className="section-rise py-24 md:py-36 bg-gold-bg border-t border-line">
      <Container>
        {/* Header */}
        <div className="mb-16">
          <p className="eyebrow mb-3">Our Expertise</p>
          <h2 className="font-serif font-medium text-[2.4rem] md:text-[3rem] leading-[1.1] tracking-[-0.02em] text-ink">
            Areas of Expertise
          </h2>
          <hr className="gold-rule" />
        </div>

        {/* Asymmetric grid: 7/5 split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Hero card — spans 7 cols */}
          {heroArea && (
            <div className="lg:col-span-7 relative overflow-hidden">
              <Link
                href={`/practice-areas/${heroArea.id}`}
                className="group relative block bg-white border-t-[4px] border-gold p-10 md:p-14 overflow-hidden h-full hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(199,164,87,0.06)] transition-all duration-200 touch-feedback"
              >
                {/* Watermark */}
                <span className="watermark-number absolute -bottom-6 -right-4 group-hover:opacity-[0.10] transition-opacity duration-200">
                  {watermarkNumbers[0]}
                </span>
                <div className="relative z-10">
                  <h3 className="font-serif font-medium text-[1.8rem] md:text-[2.2rem] leading-[1.15] text-ink mb-4">
                    {heroArea.title}
                  </h3>
                  <p className="text-[1.05rem] text-muted leading-[1.7] max-w-[480px] mb-8">
                    {heroArea.shortDescription}
                  </p>
                  <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-gold-deep group-hover:text-gold transition-colors duration-200">
                    Legal Insight
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={1.5} />
                  </span>
                </div>
              </Link>
              {/* Gold wipe overlay */}
              <div
                ref={heroOverlayRef}
                className="absolute inset-0 bg-gold-bg z-20 pointer-events-none"
              />
            </div>
          )}

          {/* Side cards — span 5 cols, stacked */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {sideAreas.map((area, idx) => (
              <div key={area.id} className="flex-1 relative overflow-hidden">
                <Link
                  href={`/practice-areas/${area.id}`}
                  className="group relative block bg-white border-l-[4px] border-gold p-8 md:p-10 overflow-hidden h-full hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(199,164,87,0.06)] transition-all duration-200 touch-feedback"
                >
                  {/* Watermark */}
                  <span className="watermark-number absolute -bottom-4 -right-2 text-[8rem] group-hover:opacity-[0.10] transition-opacity duration-200">
                    {watermarkNumbers[idx + 1]}
                  </span>
                  <div className="relative z-10">
                    <h3 className="font-serif font-medium text-[1.4rem] md:text-[1.6rem] leading-[1.2] text-ink mb-3">
                      {area.title}
                    </h3>
                    <p className="text-[0.95rem] text-dim leading-[1.6] mb-6">
                      {area.shortDescription}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-gold-deep group-hover:text-gold transition-colors duration-200">
                      Legal Insight
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
                {/* Gold wipe overlay */}
                <div
                  ref={(el) => { sideOverlayRefs.current[idx] = el; }}
                  className="absolute inset-0 bg-gold-bg z-20 pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* View all services */}
        <div className="mt-10 pt-10 border-t border-line">
          <Link
            href="/practice-areas"
            className="group inline-flex items-center gap-3"
          >
            <span className="font-serif font-medium text-[1.2rem] text-ink">
              View all services
            </span>
            <ArrowRight
              className="w-5 h-5 text-gold group-hover:translate-x-1 transition-transform duration-200"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
