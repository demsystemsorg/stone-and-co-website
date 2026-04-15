"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { createTimeline } from "animejs";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";

export interface LogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  variant?: "full" | "icon" | "text";
  size?: "sm" | "md" | "lg";
  light?: boolean;
}

const sizeStyles = {
  sm: {
    name: "text-[0.85rem] font-semibold tracking-[-0.01em]",
    tagline: "text-[0.42rem] tracking-[0.25em]",
  },
  md: {
    name: "text-[1.05rem] font-semibold tracking-[-0.01em]",
    tagline: "text-[0.48rem] tracking-[0.25em]",
  },
  lg: {
    name: "text-[1.6rem] font-semibold tracking-[-0.01em]",
    tagline: "text-[0.6rem] tracking-[0.3em]",
  },
};

const Logo = React.forwardRef<HTMLAnchorElement, LogoProps>(
  ({ className, variant = "full", size = "md", light = false, ...props }, ref) => {
    const s = sizeStyles[size];
    const stoneRef = React.useRef<HTMLSpanElement>(null);
    const ampRef = React.useRef<HTMLSpanElement>(null);
    const coRef = React.useRef<HTMLSpanElement>(null);
    const dotRef = React.useRef<HTMLSpanElement>(null);
    const taglineRef = React.useRef<HTMLSpanElement>(null);
    const tlRef = React.useRef<ReturnType<typeof createTimeline> | null>(null);
    const wasScrolledRef = React.useRef(false);

    const setHiddenStates = React.useCallback(() => {
      const stone = stoneRef.current;
      const amp = ampRef.current;
      const co = coRef.current;
      const dot = dotRef.current;
      const tagline = taglineRef.current;
      if (!stone || !amp || !co || !dot) return;

      stone.style.transform = "translateX(-105%)";
      amp.style.opacity = "0";
      amp.style.clipPath = "inset(100% 0 0 0)";
      co.style.transform = "translateX(-105%)";
      dot.style.opacity = "0";
      dot.style.transform = "scale(0)";
      if (tagline) {
        tagline.style.opacity = "0";
        tagline.style.transform = "translateY(-4px)";
      }
    }, []);

    const buildAndPlay = React.useCallback(() => {
      const stone = stoneRef.current;
      const amp = ampRef.current;
      const co = coRef.current;
      const dot = dotRef.current;
      const tagline = taglineRef.current;
      if (!stone || !amp || !co || !dot) return;

      tlRef.current?.revert();
      setHiddenStates();

      const tl = createTimeline({
        defaults: { ease: ease.primary },
      });

      // T=0 — "Stone" slides out
      tl.add(stone, {
        translateX: ["-105%", "0%"],
        duration: 280,
        ease: ease.authority,
      }, 0);

      // T=150 — "&" clip-path reveal
      tl.add(amp, {
        opacity: [0, 1],
        clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
        duration: 250,
        ease: ease.primary,
      }, 150);

      // T=300 — "Co" slides out
      tl.add(co, {
        translateX: ["-105%", "0%"],
        duration: 220,
        ease: ease.authority,
      }, 300);

      // T=450 — "." stamps
      tl.add(dot, {
        opacity: [0, 1],
        scale: [0, 1],
        duration: 180,
        ease: ease.stamp,
      }, 450);

      // T=500 — "SOLICITORS" fades in
      if (tagline) {
        tl.add(tagline, {
          opacity: [0, 1],
          translateY: ["-4px", "0px"],
          duration: 250,
        }, 500);
      }

      tlRef.current = tl;
    }, [setHiddenStates]);

    React.useEffect(() => {
      if (prefersReducedMotion()) {
        [stoneRef, ampRef, coRef, dotRef, taglineRef].forEach((r) => {
          if (r.current) {
            r.current.style.opacity = "1";
            r.current.style.transform = "none";
            r.current.style.clipPath = "none";
          }
        });
        return;
      }

      buildAndPlay();
      return () => { tlRef.current?.revert(); };
    }, [buildAndPlay]);

    React.useEffect(() => {
      if (prefersReducedMotion()) return;

      const onScroll = () => {
        const atTop = window.scrollY === 0;
        if (wasScrolledRef.current && atTop) {
          buildAndPlay();
        }
        wasScrolledRef.current = window.scrollY > 20;
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }, [buildAndPlay]);

    const handleMouseEnter = React.useCallback(() => {
      if (prefersReducedMotion()) return;
      buildAndPlay();
    }, [buildAndPlay]);

    return (
      <Link
        ref={ref}
        href="/"
        className={cn("group inline-flex flex-col", className)}
        aria-label="Stone & Co. Solicitors - Home"
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {/* Wordmark — serif with gold ampersand */}
        <div className="flex items-baseline leading-none">
          {/* "Stone" */}
          <div className="overflow-hidden">
            <span
              ref={stoneRef}
              className={cn(
                "inline-block font-serif leading-tight",
                light ? "text-white" : "text-ink",
                s.name
              )}
            >
              Stone
            </span>
          </div>

          <span className="inline-block w-[0.22em]" />

          {/* "&" */}
          <span
            ref={ampRef}
            className={cn(
              "inline-block font-serif leading-tight",
              light ? "text-gold-soft" : "text-gold",
              s.name
            )}
            style={{ opacity: 0 }}
          >
            &amp;
          </span>

          <span className="inline-block w-[0.22em]" />

          {/* "Co" */}
          <div className="overflow-hidden">
            <span
              ref={coRef}
              className={cn(
                "inline-block font-serif leading-tight",
                light ? "text-white" : "text-ink",
                s.name
              )}
            >
              Co
            </span>
          </div>

          {/* "." */}
          <span
            ref={dotRef}
            className={cn(
              "inline-block font-serif leading-tight origin-bottom",
              light ? "text-white" : "text-ink",
              s.name
            )}
            style={{ opacity: 0 }}
          >
            .
          </span>
        </div>

        {/* "SOLICITORS" tagline */}
        <span
          ref={taglineRef}
          className={cn(
            "font-sans uppercase font-medium mt-0.5",
            light ? "text-white/50" : "text-dim/70",
            s.tagline
          )}
          style={{ opacity: 0 }}
        >
          Solicitors
        </span>
      </Link>
    );
  }
);

Logo.displayName = "Logo";
export { Logo };
