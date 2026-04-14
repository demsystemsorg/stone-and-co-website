"use client";

import { useRef, useEffect, useState } from "react";
import { animate, set } from "animejs";
import { prefersReducedMotion } from "./reduced-motion";
import { ease } from "./config";

interface CounterOptions {
  /** Target number to count to */
  value: number;
  /** String to append after the number */
  suffix?: string;
  /** String to prepend before the number */
  prefix?: string;
  /** Duration in ms. Default: 1500 */
  duration?: number;
  /** Easing. Default: "outCubic" */
  easing?: string;
}

/**
 * Animated number counter using anime.js.
 * Animates a JS object { value: 0 } -> { value: target } and returns display string.
 * Triggered by IntersectionObserver. Replays on re-entry.
 */
export function useCounter(options: CounterOptions) {
  const ref = useRef<HTMLElement>(null);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);
  const snapRef = useRef<ReturnType<typeof animate> | null>(null);
  const [display, setDisplay] = useState(
    `${options.prefix ?? ""}0${options.suffix ?? ""}`
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setDisplay(
        `${options.prefix ?? ""}${options.value}${options.suffix ?? ""}`
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Reset and replay
            animRef.current?.revert();
            const obj = { value: 0 };
            setDisplay(`${options.prefix ?? ""}0${options.suffix ?? ""}`);

            animRef.current = animate(obj, {
              value: [0, options.value],
              duration: options.duration ?? 1500,
              ease: options.easing ?? ease.primary,
              onUpdate: () => {
                setDisplay(
                  `${options.prefix ?? ""}${Math.floor(obj.value)}${options.suffix ?? ""}`
                );
              },
              onComplete: () => {
                setDisplay(
                  `${options.prefix ?? ""}${options.value}${options.suffix ?? ""}`
                );
                // Earned force: elastic compression snap on landing
                if (ref.current) {
                  snapRef.current?.revert();
                  snapRef.current = animate(ref.current, {
                    scaleX: [0.93, 1.0],
                    scaleY: [1.05, 1.0],
                    duration: 400,
                    ease: ease.snap,
                  });
                }
              },
            });
          } else {
            // Reset to 0 when leaving viewport
            animRef.current?.revert();
            animRef.current = null;
            snapRef.current?.revert();
            snapRef.current = null;
            if (ref.current) set(ref.current, { scaleX: 1, scaleY: 1 });
            setDisplay(`${options.prefix ?? ""}0${options.suffix ?? ""}`);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      animRef.current?.revert();
      snapRef.current?.revert();
    };
  }, [options.value, options.suffix, options.prefix, options.duration, options.easing]);

  return { ref, display };
}
