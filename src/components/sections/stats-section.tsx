"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { useCounter } from "@/lib/anime/useCounter";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";

interface Stat {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
}

const stats: Stat[] = [
  { value: 3, suffix: "x", label: "Statutory Deposit Penalty" },
  { value: 20, suffix: "+", label: "Years Combined Experience" },
  { value: 98, suffix: "%", label: "Success Rate" },
  { value: 2, suffix: "", label: "London Offices" },
];

function AnimatedStat({ stat }: { stat: Stat }) {
  const { ref, display } = useCounter({
    value: stat.value,
    suffix: stat.suffix,
    prefix: stat.prefix,
    duration: 1500,
  });

  return (
    <div className="text-center py-4 px-6">
      <p className="stat-value">
        <span ref={ref} className="tabular-nums">
          {display}
        </span>
      </p>
      <p className="stat-label">{stat.label}</p>
    </div>
  );
}

export function StatsSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const sweepRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = sectionRef.current;
    const sweep = sweepRef.current;
    if (!el || !sweep || prefersReducedMotion()) return;

    let isIntersecting = false;
    let ticking = false;

    const updateSweep = () => {
      if (!isIntersecting) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress: 0 when bottom edge enters viewport → 1 when fully visible
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      sweep.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateSweep);
        ticking = true;
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            window.addEventListener("scroll", onScroll, { passive: true });
            onScroll(); // trigger initial position
          } else {
            window.removeEventListener("scroll", onScroll);
            sweep.style.transform = "scaleX(0)";
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="stats-bar relative">
      {/* Gold sweep line — scroll-linked */}
      <div
        ref={sweepRef}
        className="absolute top-0 left-0 w-full h-px bg-gold/30"
        style={{ transformOrigin: "left", transform: "scaleX(0)" }}
      />
      <Container>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={
                index < stats.length - 1
                  ? "lg:border-r lg:border-white/10"
                  : ""
              }
            >
              <AnimatedStat stat={stat} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
