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
  sm: { bar: "w-[2px] h-4", name: "text-xs font-bold uppercase", tagline: false, gap: "gap-2" },
  md: { bar: "w-[2.5px] h-5", name: "text-[0.8rem] font-bold tracking-tight", tagline: false, gap: "gap-2.5" },
  lg: { bar: "w-[3px] h-10", name: "text-2xl font-bold tracking-tight", tagline: true, gap: "gap-3.5" },
};

const Logo = React.forwardRef<HTMLAnchorElement, LogoProps>(
  ({ className, variant = "full", size = "md", light = false, ...props }, ref) => {
    const s = sizeStyles[size];
    const barRef = React.useRef<HTMLDivElement>(null);
    const stoneRef = React.useRef<HTMLSpanElement>(null);
    const ampRef = React.useRef<HTMLSpanElement>(null);
    const coRef = React.useRef<HTMLSpanElement>(null);
    const dotRef = React.useRef<HTMLSpanElement>(null);
    const tlRef = React.useRef<ReturnType<typeof createTimeline> | null>(null);
    const wasScrolledRef = React.useRef(false);

    /** Set all elements to their hidden (pre-animation) states */
    const setHiddenStates = React.useCallback(() => {
      const bar = barRef.current;
      const stone = stoneRef.current;
      const amp = ampRef.current;
      const co = coRef.current;
      const dot = dotRef.current;
      if (!bar || !stone || !amp || !co || !dot) return;

      bar.style.opacity = "0";
      bar.style.transform = "scaleY(0)";
      stone.style.transform = "translateX(-105%)";
      amp.style.opacity = "0";
      amp.style.clipPath = "inset(100% 0 0 0)";
      co.style.transform = "translateX(-105%)";
      dot.style.opacity = "0";
      dot.style.transform = "scale(0)";
    }, []);

    /** Build and play the pillar mark animation timeline */
    const buildAndPlay = React.useCallback(() => {
      const bar = barRef.current;
      const stone = stoneRef.current;
      const amp = ampRef.current;
      const co = coRef.current;
      const dot = dotRef.current;
      if (!bar || !stone || !amp || !co || !dot) return;

      // Clean up previous timeline
      tlRef.current?.revert();

      // Set hidden states
      setHiddenStates();

      const tl = createTimeline({
        defaults: { ease: ease.primary },
      });

      // T=0 — Bar draws from top
      tl.add(bar, {
        opacity: [0, 1],
        scaleY: [0, 1],
        duration: 300,
        ease: ease.inkDraw,
      }, 0);

      // T=150 — "Stone" slides out
      tl.add(stone, {
        translateX: ["-105%", "0%"],
        duration: 250,
        ease: ease.authority,
      }, 150);

      // T=300 — "&" clip-path reveal
      tl.add(amp, {
        opacity: [0, 1],
        clipPath: ["inset(100% 0 0 0)", "inset(0% 0 0 0)"],
        duration: 250,
        ease: ease.primary,
      }, 300);

      // T=450 — "Co" slides out
      tl.add(co, {
        translateX: ["-105%", "0%"],
        duration: 200,
        ease: ease.authority,
      }, 450);

      // T=600 — "." stamps
      tl.add(dot, {
        opacity: [0, 1],
        scale: [0, 1],
        duration: 180,
        ease: ease.stamp,
      }, 600);

      tlRef.current = tl;
    }, [setHiddenStates]);

    // On-load animation
    React.useEffect(() => {
      if (prefersReducedMotion()) {
        // Show everything immediately
        [barRef, stoneRef, ampRef, coRef, dotRef].forEach((r) => {
          if (r.current) {
            r.current.style.opacity = "1";
            r.current.style.transform = "none";
            r.current.style.clipPath = "none";
          }
        });
        return;
      }

      buildAndPlay();

      return () => {
        tlRef.current?.revert();
      };
    }, [buildAndPlay]);

    // Scroll-to-top replay
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

    // Hover replay
    const handleMouseEnter = React.useCallback(() => {
      if (prefersReducedMotion()) return;
      buildAndPlay();
    }, [buildAndPlay]);

    return (
      <Link
        ref={ref}
        href="/"
        className={cn(
          "group inline-flex items-center",
          s.gap,
          className
        )}
        aria-label="Stone & Co. Solicitors - Home"
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {/* Gold pillar bar */}
        <div
          ref={barRef}
          className={cn(
            "flex-shrink-0",
            light ? "bg-gold-soft" : "bg-gold",
            s.bar
          )}
          style={{ opacity: 0, transformOrigin: "top" }}
        />

        {/* Wordmark with individual refs for pillar mark animation */}
        <div className="flex items-baseline">
          {/* "Stone" clip-reveal */}
          <div className="overflow-hidden">
            <span
              ref={stoneRef}
              className={cn(
                "inline-block font-sans leading-tight",
                light ? "text-white" : "text-ink",
                s.name
              )}
            >
              Stone
            </span>
          </div>

          {/* Spacer */}
          <span className="inline-block w-[0.2em]" />

          {/* "&" clip-path reveal */}
          <span
            ref={ampRef}
            className={cn(
              "inline-block leading-tight",
              light ? "text-gold-soft" : "text-gold",
              s.name
            )}
            style={{ opacity: 0 }}
          >
            &amp;
          </span>

          {/* Spacer */}
          <span className="inline-block w-[0.2em]" />

          {/* "Co" clip-reveal */}
          <div className="overflow-hidden">
            <span
              ref={coRef}
              className={cn(
                "inline-block font-sans leading-tight",
                light ? "text-white" : "text-ink",
                s.name
              )}
            >
              Co
            </span>
          </div>

          {/* "." stamp */}
          <span
            ref={dotRef}
            className={cn(
              "inline-block font-sans leading-tight origin-bottom",
              light ? "text-white" : "text-ink",
              s.name
            )}
            style={{ opacity: 0 }}
          >
            .
          </span>
        </div>

        {/* Tagline (only for size "lg") */}
        {s.tagline && (
          <span
            className={cn(
              "font-sans text-xs font-medium uppercase tracking-[0.4em] opacity-60 leading-tight",
              light ? "text-white/40" : "text-dim"
            )}
          >
            Solicitors
          </span>
        )}
      </Link>
    );
  }
);

Logo.displayName = "Logo";
export { Logo };
