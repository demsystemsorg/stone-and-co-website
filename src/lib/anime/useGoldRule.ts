"use client";

import { useRef, useEffect } from "react";
import { animate, set } from "animejs";
import { prefersReducedMotion } from "./reduced-motion";
import { ease } from "./config";

/**
 * Observes a gold rule element and animates scaleX from 0 to 1 on scroll.
 * Resets and replays when scrolling back up and re-entering viewport.
 *
 * CSS handles the hidden state (transform: scaleX(0)) — no JS initialization
 * needed, which avoids hydration mismatches from inline styles.
 */
export function useGoldRule<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      set(el, { scaleX: 1 });
      return;
    }

    // CSS already sets transform: scaleX(0) — no JS init needed.

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animRef.current?.revert();
            animRef.current = animate(el, {
              scaleX: [0, 1],
              duration: 450,
              ease: ease.inkDraw,
            });
          } else {
            // Revert removes inline styles — CSS scaleX(0) takes over
            animRef.current?.revert();
            animRef.current = null;
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      animRef.current?.revert();
    };
  }, []);

  return ref;
}
