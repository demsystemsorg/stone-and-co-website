"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { scrollRevealVariants } from "@/styles/animations";
import { Container } from "./container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Visual style variant */
  variant?: "default" | "alternate" | "dark" | "pattern" | "elevated";
  /** Vertical padding size */
  padding?: "none" | "sm" | "md" | "lg";
  /** Include container wrapper */
  container?: boolean;
  /** Container size if using container */
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  /** Enable scroll reveal animation */
  animate?: boolean;
  /** Visual separation effect at top */
  topEffect?: "none" | "fade" | "glow" | "inset";
  /** Visual separation effect at bottom */
  bottomEffect?: "none" | "fade" | "glow";
}

const variantStyles = {
  default: "bg-background",
  alternate: "bg-background-secondary",
  dark: "bg-background-dark",
  pattern: "bg-background pattern-scales",
  elevated: "bg-background-tertiary",
};

const paddingStyles = {
  none: "py-0",
  sm: "py-12 md:py-16",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-28",
};

const topEffectStyles = {
  none: "",
  fade: "section-fade-top",
  glow: "border-glow-top",
  inset: "section-inset",
};

const bottomEffectStyles = {
  none: "",
  fade: "section-fade-bottom",
  glow: "border-glow-bottom",
};

const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      variant = "default",
      padding = "lg",
      container = true,
      containerSize = "xl",
      animate = false,
      topEffect = "none",
      bottomEffect = "none",
      children,
      id,
      ...props
    },
    ref
  ) => {
    const content = container ? (
      <Container size={containerSize}>{children}</Container>
    ) : (
      children
    );

    const baseStyles = cn(
      "relative",
      variantStyles[variant],
      paddingStyles[padding],
      topEffectStyles[topEffect],
      bottomEffectStyles[bottomEffect],
      className
    );

    if (animate) {
      return (
        <motion.section
          ref={ref}
          id={id}
          className={baseStyles}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
          variants={scrollRevealVariants}
        >
          {content}
        </motion.section>
      );
    }

    return (
      <section ref={ref} id={id} className={baseStyles} {...props}>
        {content}
      </section>
    );
  }
);

Section.displayName = "Section";

export { Section };
