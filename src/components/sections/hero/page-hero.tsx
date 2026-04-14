"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { createTimeline, stagger, set } from "animejs";
import { splitText } from "animejs/text";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";

export interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  variant?: "default" | "dark";
  size?: "sm" | "md" | "lg";
  centered?: boolean;
}

export function PageHero({
  title,
  subtitle,
  breadcrumbs,
  variant = "default",
  size = "md",
  centered = false,
}: PageHeroProps) {
  const isDark = variant === "dark";
  const breadcrumbsRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const subtitleRef = React.useRef<HTMLParagraphElement>(null);
  const goldLineRef = React.useRef<HTMLDivElement>(null);

  const sizeStyles = {
    sm: "py-12 md:py-16",
    md: "py-16 md:py-24",
    lg: "py-24 md:py-32",
  };

  React.useEffect(() => {
    if (prefersReducedMotion()) {
      if (breadcrumbsRef.current) set(breadcrumbsRef.current, { opacity: 1 });
      if (subtitleRef.current) set(subtitleRef.current, { opacity: 1, translateY: 0 });
      if (goldLineRef.current) set(goldLineRef.current, { scaleX: 1 });
      return;
    }

    // Set initial hidden states
    if (breadcrumbsRef.current) set(breadcrumbsRef.current, { opacity: 0 });
    if (subtitleRef.current) set(subtitleRef.current, { opacity: 0, translateY: 12 });
    if (goldLineRef.current) set(goldLineRef.current, { scaleX: 0 });

    // Split title text for character-level clip reveal
    const split = titleRef.current
      ? splitText(titleRef.current, { chars: { wrap: "clip" } })
      : null;

    if (split) {
      set(split.chars, { translateY: "100%" });
    }

    const tl = createTimeline({
      defaults: { ease: ease.primary },
    });

    // T=0ms — Breadcrumbs fade
    if (breadcrumbsRef.current) {
      tl.add(breadcrumbsRef.current, {
        opacity: [0, 1],
        duration: 200,
      });
    }

    // T=100ms — Title chars reveal (faster stagger than home hero — 20ms)
    if (split) {
      tl.add(split.chars, {
        translateY: ["100%", "0%"],
        duration: 450,
        ease: "outBack(1.02)",
        delay: stagger(18),
      }, "-=100");
    }

    // T=400ms — Subtitle
    if (subtitleRef.current) {
      tl.add(subtitleRef.current, {
        opacity: [0, 1],
        translateY: [12, 0],
        duration: 300,
      }, "-=150");
    }

    // T=500ms — Gold accent line
    if (goldLineRef.current) {
      tl.add(goldLineRef.current, {
        scaleX: [0, 1],
        duration: 450,
        ease: "outBack(1.8)",
      }, "-=200");
    }

    return () => {
      tl.revert();
      split?.revert();
    };
  }, []);

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        sizeStyles[size],
        isDark ? "bg-neutral-950" : "bg-background-secondary"
      )}
    >
      {/* Background pattern */}
      <div
        className={cn(
          "absolute inset-0",
          isDark ? "pattern-legal opacity-[0.03]" : "pattern-legal opacity-[0.02]"
        )}
      />

      {/* Subtle gold gradient accent at top */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-gold-600/5 to-transparent" />

      {/* Gold accent line — animated */}
      <div
        ref={goldLineRef}
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-gold"
        style={{ transformOrigin: "left" }}
      />

      <Container className="relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <div ref={breadcrumbsRef}>
            <Breadcrumbs
              items={breadcrumbs}
              className="mb-6 [&_*]:text-neutral-400 [&_a:hover]:text-gold-400"
            />
          </div>
        )}

        <div className={cn(centered && "text-center max-w-3xl mx-auto")}>
          {/* Title */}
          <h1
            ref={titleRef}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-white"
          >
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p
              ref={subtitleRef}
              className={cn(
                "mt-4 text-lg md:text-xl max-w-2xl text-neutral-300",
                centered && "mx-auto"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
