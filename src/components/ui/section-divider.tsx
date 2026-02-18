"use client";

import * as React from "react";
import { Scale } from "lucide-react";
import { cn } from "@/lib/cn";

export type DividerVariant =
  | "gold"      // Elegant gold line with subtle glow
  | "subtle"    // Thin neutral line
  | "diamond"   // Line with diamond accent
  | "emblem"    // Line with centered scales emblem
  | "fade"      // Gradient fade (no visible line)
  | "glass";    // Glass morphism effect

export interface SectionDividerProps {
  /** Visual style of the divider */
  variant?: DividerVariant;
  /** Additional CSS classes */
  className?: string;
  /** Vertical spacing around divider */
  spacing?: "none" | "sm" | "md" | "lg";
}

const spacingStyles = {
  none: "",
  sm: "my-8",
  md: "my-12",
  lg: "my-16",
};

export function SectionDivider({
  variant = "subtle",
  className,
  spacing = "none",
}: SectionDividerProps) {
  const baseClasses = cn(spacingStyles[spacing], className);

  switch (variant) {
    case "gold":
      return <div className={cn("divider-gold", baseClasses)} aria-hidden="true" />;

    case "subtle":
      return <div className={cn("divider-subtle", baseClasses)} aria-hidden="true" />;

    case "diamond":
      return (
        <div className={cn("divider-diamond", baseClasses)} aria-hidden="true">
          <span />
        </div>
      );

    case "emblem":
      return (
        <div className={cn("hr-emblem", baseClasses)} aria-hidden="true">
          <div className="emblem">
            <Scale className="w-4 h-4" />
          </div>
        </div>
      );

    case "fade":
      return (
        <div
          className={cn("h-16 relative", baseClasses)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/30 to-transparent" />
        </div>
      );

    case "glass":
      return (
        <div
          className={cn("separator-glass h-8", baseClasses)}
          aria-hidden="true"
        />
      );

    default:
      return <div className={cn("divider-subtle", baseClasses)} aria-hidden="true" />;
  }
}
