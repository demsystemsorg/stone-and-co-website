"use client";

import { useRef, useEffect, useCallback } from "react";
import { animate, set } from "animejs";
import type { AnimationParams, TargetsParam } from "animejs";
import { prefersReducedMotion } from "./reduced-motion";

/**
 * Core animation hook — wraps animate() with React lifecycle, cleanup, and a11y.
 * Returns a ref to attach to the target element and a play function.
 */
export function useAnime<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      animationRef.current?.revert();
    };
  }, []);

  const play = useCallback(
    (params: AnimationParams, targets?: TargetsParam) => {
      const target = targets ?? ref.current;
      if (!target) return null;

      if (prefersReducedMotion()) {
        // Show final state instantly
        const finalState: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(params)) {
          if (
            key === "duration" ||
            key === "delay" ||
            key === "ease" ||
            key === "onComplete" ||
            key === "onUpdate" ||
            key === "onBegin" ||
            key === "onRender" ||
            key.startsWith("loop") ||
            key.startsWith("auto")
          )
            continue;
          finalState[key] = Array.isArray(val) ? val[val.length - 1] : val;
        }
        set(target, finalState as AnimationParams);
        return null;
      }

      animationRef.current?.revert();
      const anim = animate(target, params);
      animationRef.current = anim;
      return anim;
    },
    []
  );

  return { ref, play };
}
