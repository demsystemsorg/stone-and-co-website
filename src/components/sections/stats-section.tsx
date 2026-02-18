"use client";

import * as React from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/cn";
import { Section } from "@/components/ui/section";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

const stats: Stat[] = [
  { value: 20, suffix: "+", label: "Years Experience" },
  { value: 5000, suffix: "+", label: "Clients Helped" },
  { value: 98, suffix: "%", label: "Success Rate" },
  { value: 2, suffix: "", label: "London Offices" },
];

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quad
        const easeOut = 1 - (1 - progress) * (1 - progress);
        setDisplayValue(Math.floor(easeOut * value));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  const formattedValue = value >= 1000
    ? displayValue.toLocaleString()
    : displayValue;

  return (
    <span ref={ref} className="tabular-nums">
      {formattedValue}{suffix}
    </span>
  );
}

export interface StatsSectionProps {
  variant?: "light" | "dark";
}

export function StatsSection({ variant = "dark" }: StatsSectionProps) {
  const isDark = variant === "dark";

  return (
    <Section
      variant={isDark ? "dark" : "default"}
      padding="lg"
      topEffect="glow"
      className={cn(!isDark && "border-y border-neutral-200")}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <p
              className={cn(
                "font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-2",
                isDark ? "text-gold-600" : "text-gold-600"
              )}
            >
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </p>
            <p
              className={cn(
                "text-sm md:text-base font-medium",
                isDark ? "text-neutral-600" : "text-text-secondary"
              )}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
