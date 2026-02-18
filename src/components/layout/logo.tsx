import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface LogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  variant?: "full" | "icon" | "text";
  size?: "sm" | "md" | "lg";
  light?: boolean;
}

const sizeStyles = {
  sm: { icon: "w-7 h-7 text-[0.55rem]", name: "text-base", tagline: "text-[0.5rem]" },
  md: { icon: "w-9 h-9 text-[0.6rem]", name: "text-lg", tagline: "text-[0.55rem]" },
  lg: { icon: "w-11 h-11 text-[0.7rem]", name: "text-xl", tagline: "text-[0.6rem]" },
};

const Logo = React.forwardRef<HTMLAnchorElement, LogoProps>(
  ({ className, variant = "full", size = "md", light = false, ...props }, ref) => {
    const s = sizeStyles[size];

    const LogoText = () => (
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-serif font-semibold tracking-tight",
            light ? "text-white" : "text-ink",
            s.name
          )}
        >
          Stone <span className="text-gold">&amp;</span> Co.
        </span>
        <span
          className={cn(
            "font-sans font-semibold tracking-[0.15em] uppercase",
            light ? "text-white/40" : "text-dim",
            s.tagline
          )}
        >
          Solicitors
        </span>
      </div>
    );

    return (
      <Link
        ref={ref}
        href="/"
        className={cn(
          "inline-flex items-center gap-2.5 transition-opacity hover:opacity-70",
          className
        )}
        aria-label="Stone & Co. Solicitors - Home"
        {...props}
      >
        <LogoText />
      </Link>
    );
  }
);

Logo.displayName = "Logo";
export { Logo };
