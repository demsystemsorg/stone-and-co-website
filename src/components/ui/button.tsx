"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "cta";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  asChild?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary: [
    "text-surface bg-ink border-[1.5px] border-ink",
    "hover:bg-gold-deep hover:border-gold-deep hover:shadow-gold",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  secondary: [
    "text-ink bg-transparent border-[1.5px] border-gold",
    "hover:bg-gold hover:text-surface",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  ghost: [
    "text-muted bg-transparent border-none",
    "hover:bg-ink/[0.04] hover:text-ink",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
  cta: [
    "text-ink bg-gold border-[1.5px] border-gold",
    "hover:bg-gold-deep hover:border-gold-deep hover:shadow-gold",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" "),
};

const sizeStyles = {
  sm: "h-9 px-4 text-[0.78rem] gap-1.5 rounded-md",
  md: "h-11 px-6 text-[0.85rem] gap-2 rounded-md",
  lg: "h-[52px] px-8 text-[0.85rem] gap-2.5 rounded-md",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      asChild = false,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const buttonClasses = cn(
      "inline-flex items-center justify-center font-semibold tracking-[0.01em] transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
      variantStyles[variant],
      sizeStyles[size],
      fullWidth && "w-full",
      className
    );

    if (asChild) {
      return (
        <Slot ref={ref} className={buttonClasses} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button ref={ref} className={buttonClasses} disabled={isDisabled} {...props}>
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
