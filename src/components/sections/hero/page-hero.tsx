"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/layout/breadcrumbs";
import { fadeInUpVariants, staggerContainer, staggerItem } from "@/styles/animations";

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

  const sizeStyles = {
    sm: "py-12 md:py-16",
    md: "py-16 md:py-24",
    lg: "py-24 md:py-32",
  };

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

      {/* Gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-gold" />

      <Container className="relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <Breadcrumbs
            items={breadcrumbs}
            className="mb-6 [&_*]:text-neutral-400 [&_a:hover]:text-gold-400"
          />
        )}

        <motion.div
          className={cn(centered && "text-center max-w-3xl mx-auto")}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.h1
            variants={staggerItem}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight text-white"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              variants={staggerItem}
              className={cn(
                "mt-4 text-lg md:text-xl max-w-2xl text-neutral-300",
                centered && "mx-auto"
              )}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
