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
    bar: "w-[2px]",
    name: "text-[0.85rem] font-semibold tracking-[-0.01em]",
    tagline: "text-[0.42rem] tracking-[0.25em]",
    gap: "gap-2",
  },
  md: {
    bar: "w-[2.5px]",
    name: "text-[1.05rem] font-semibold tracking-[-0.01em]",
    tagline: "text-[0.48rem] tracking-[0.25em]",
    gap: "gap-2.5",
  },
  lg: {
    bar: "w-[3px]",
    name: "text-[1.6rem] font-semibold tracking-[-0.01em]",
    tagline: "text-[0.6rem] tracking-[0.3em]",
    gap: "gap-3.5",
  },
};

const Logo = React.forwardRef<HTMLAnchorElement, LogoProps>(
  ({ className, variant = "full", size = "md", light = false, ...props }, ref) => {
    const s = sizeStyles[size];
    const barRef = React.useRef<HTMLDivElement>(null);
    const stoneRef = React.useRef<HTMLSpanElement>(null);
    const ampRef = React.useRef<HTMLSpanElement>(null);
    const coRef = React.useRef<HTMLSpanElement>(null);
    const dotRef = React.useRef<HTMLSpanElement>(null);
    const taglineRef = React.useRef<HTMLSpanElement>(null);
    const tlRef = React.useRef<ReturnType<typeof createTimeline> | null>(null);
    const wasScrolledRef = React.useRef(false);

    const setHiddenStates = React.useCallback(() => {
      const bar = barRef.current;
      const stone = stoneRef.current;
      const amp = ampRef.current;
      const co = coRef.current;
      const dot = dotRef.current;
      const tagline = taglineRef.current;
      if (!bar || !stone || !amp || !co || !dot) return;

      bar.style.opacity = "0";
      bar.style.transform = "scaleY(0)";
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
      const bar = barRef.current;
      const stone = stoneRef.current;
      const amp = ampRef.current;
      const co = coRef.current;
      const dot = dotRef.current;
      const tagline = taglineRef.current;
      if (!bar || !stone || !amp || !co || !dot) return;

      tlRef.current?.revert();
      setHiddenStates();

      const tl = createTimeline({
        defaults: { ease: ease.primary },
      });

      // T=0 — Gold bar draws from top
      tl.add(bar, {
        opacity: [0, 1],
        scaleY: [0, 1],
        duration: 300,
        ease: ease.inkDraw,
      }, 0);

      // T=150 — "Stone" slides out from bar
      tl.add(stone, {
        translateX: ["-105%", "0%"],
        duration: 280,
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
        duration: 220,
        ease: ease.authority,
      }, 450);

      // T=600 — "." stamps
      tl.add(dot, {
        opacity: [0, 1],
        scale: [0, 1],
        duration: 180,
        ease: ease.stamp,
      }, 600);

      // T=650 — "SOLICITORS" fades in
      if (tagline) {
        tl.add(tagline, {
          opacity: [0, 1],
          translateY: ["-4px", "0px"],
          duration: 250,
        }, 650);
      }

      tlRef.current = tl;
    }, [setHiddenStates]);

    React.useEffect(() => {
      if (prefersReducedMotion()) {
        [barRef, stoneRef, ampRef, coRef, dotRef, taglineRef].forEach((r) => {
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
        className={cn("group inline-flex items-stretch", s.gap, className)}
        aria-label="Stone & Co. Solicitors - Home"
        onMouseEnter={handleMouseEnter}
        {...props}
      >
        {/* Gold pillar bar */}
        <div
          ref={barRef}
          className={cn(
            "flex-shrink-0 self-stretch",
            light ? "bg-gold-soft" : "bg-gold",
            s.bar
          )}
          style={{ opacity: 0, transformOrigin: "top" }}
        />

        {/* Stacked wordmark + tagline */}
        <div className="flex flex-col justify-center">
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
        </div>
      </Link>
    );
  }
);

Logo.displayName = "Logo";
export { Logo };
