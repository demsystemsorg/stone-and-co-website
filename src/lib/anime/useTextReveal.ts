"use client";

import { useRef, useEffect } from "react";
import { animate, stagger, set } from "animejs";
import { splitText } from "animejs/text";
import type { TextSplitter } from "animejs/text";
import { prefersReducedMotion } from "./reduced-motion";
import { ease, duration, staggerDelay } from "./config";

interface TextRevealOptions {
  /** Split mode: "chars" for character-level, "words" for word-level. Default: "chars" */
  mode?: "chars" | "words";
  /** Trigger: "mount" fires immediately, "scroll" fires on IntersectionObserver. Default: "mount" */
  trigger?: "mount" | "scroll";
  /** Stagger delay in ms between each unit. Default: 25 (chars) or 40 (words) */
  staggerMs?: number;
  /** Animation duration per unit. Default: 600 */
  durationMs?: number;
  /** Easing. Default: "outExpo" */
  easing?: string;
  /** IntersectionObserver threshold. Default: 0.15 */
  threshold?: number;
}

/**
 * Wraps splitText() from animejs/text with React lifecycle.
 * Splits text into chars or words and animates them with clip reveal.
 * Scroll-triggered animations replay on re-entry.
 * Cleanup: split.revert() on unmount to restore original DOM.
 */
export function useTextReveal<T extends HTMLElement = HTMLElement>(
  options: TextRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const splitRef = useRef<TextSplitter | null>(null);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      return;
    }

    const mode = options.mode ?? "chars";
    const trigger = options.trigger ?? "mount";
    const staggerMs =
      options.staggerMs ??
      (mode === "chars" ? staggerDelay.char : staggerDelay.tight);
    const dur = options.durationMs ?? duration.text;
    const easing = options.easing ?? ease.text;

    // Split the text
    const split = splitText(el, {
      chars: mode === "chars" ? { wrap: "clip" } : false,
      words: mode === "words" ? true : false,
    });
    splitRef.current = split;

    const targets = mode === "chars" ? split.chars : split.words;

    if (!targets || targets.length === 0) return;

    const resetToHidden = () => {
      animRef.current?.revert();
      animRef.current = null;
      if (mode === "chars") {
        set(targets, { translateY: "100%" });
      } else {
        set(targets, { opacity: 0, translateY: 10 });
      }
    };

    const runAnimation = () => {
      animRef.current?.revert();
      if (mode === "chars") {
        animRef.current = animate(targets, {
          translateY: ["100%", "0%"],
          duration: dur,
          ease: easing,
          delay: stagger(staggerMs),
        });
      } else {
        animRef.current = animate(targets, {
          opacity: [0, 1],
          translateY: [10, 0],
          duration: dur,
          ease: easing,
          delay: stagger(staggerMs),
        });
      }
    };

    // Set initial hidden state
    resetToHidden();

    if (trigger === "mount") {
      runAnimation();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runAnimation();
            } else {
              // Reset when leaving viewport for replay on re-entry
              resetToHidden();
            }
          });
        },
        {
          threshold: options.threshold ?? 0.15,
          rootMargin: "0px 0px -80px 0px",
        }
      );
      observer.observe(el);

      return () => {
        observer.disconnect();
        animRef.current?.revert();
        splitRef.current?.revert();
      };
    }

    return () => {
      animRef.current?.revert();
      splitRef.current?.revert();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return ref;
}
