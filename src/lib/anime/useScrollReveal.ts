"use client";

import { useRef, useEffect } from "react";
import { animate, set } from "animejs";
import type { AnimationParams } from "animejs";
import { prefersReducedMotion } from "./reduced-motion";
import { ease, duration } from "./config";

interface ScrollRevealOptions {
  /** Animation params applied when element enters viewport */
  params?: AnimationParams;
  /** IntersectionObserver threshold (0-1). Default: 0.15 */
  threshold?: number;
  /** IntersectionObserver rootMargin. Default: "0px 0px -80px 0px" */
  rootMargin?: string;
  /** If true, animation only fires once. Default: false (replays on re-entry) */
  once?: boolean;
}

const defaults: AnimationParams = {
  opacity: [0, 1],
  translateY: [20, 0],
  duration: duration.normal,
  ease: ease.primary,
};

/**
 * Fires an anime.js animation when the element scrolls into view.
 * Resets and replays when the element leaves and re-enters the viewport.
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const params = options.params ?? defaults;

    if (prefersReducedMotion()) {
      set(el, { opacity: 1, translateY: 0, scaleX: 1, scaleY: 1 });
      return;
    }

    // Set initial hidden state
    set(el, { opacity: 0 });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play animation
            animRef.current?.revert();
            animRef.current = animate(el, params);
            if (options.once) {
              observer.unobserve(el);
            }
          } else if (!options.once) {
            // Reset to hidden state when leaving viewport
            animRef.current?.revert();
            animRef.current = null;
            set(el, { opacity: 0 });
          }
        });
      },
      {
        threshold: options.threshold ?? 0.15,
        rootMargin: options.rootMargin ?? "0px 0px -80px 0px",
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      animRef.current?.revert();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
