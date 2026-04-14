"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";

/**
 * Thin gold line at the top of the viewport that grows with scroll progress.
 * Uses pure CSS transform driven by RAF — no anime.js needed for continuous tracking.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const bar = barRef.current;
    if (!bar) return;

    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) {
        bar.style.opacity = "0";
        return;
      }

      const progress = Math.min(scrollTop / docHeight, 1);

      // Fade in after 100px scroll
      const opacity = scrollTop < 100 ? scrollTop / 100 : 1;
      // Fade out near bottom (last 50px)
      const bottomFade = docHeight - scrollTop < 50
        ? (docHeight - scrollTop) / 50
        : 1;

      bar.style.transform = `scaleX(${progress})`;
      bar.style.opacity = `${Math.min(opacity, bottomFade)}`;

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    // Check if page has enough scroll depth (>200vh)
    const checkDepth = () => {
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      if (docHeight < viewportHeight * 2) {
        bar.style.display = "none";
      } else {
        bar.style.display = "block";
      }
    };

    checkDepth();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", checkDepth, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", checkDepth);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 w-full h-[2px] bg-gold z-[60] pointer-events-none"
      style={{
        transform: "scaleX(0)",
        transformOrigin: "left",
        willChange: "transform",
        opacity: 0,
      }}
      aria-hidden="true"
    />
  );
}
