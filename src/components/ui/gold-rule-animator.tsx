"use client";

import { useEffect } from "react";
import { animate, set } from "animejs";
import { prefersReducedMotion } from "@/lib/anime/reduced-motion";
import { ease } from "@/lib/anime/config";

/**
 * Global observer that finds all .gold-rule and .gold-rule--center elements
 * and animates their scaleX from 0→1 when they scroll into view.
 * Resets and replays when scrolling back up.
 * Mount once in the root layout.
 *
 * CSS handles the hidden state (transform: scaleX(0)) — no JS initialization
 * needed, which avoids hydration mismatches from inline styles.
 */
export function GoldRuleAnimator() {
  useEffect(() => {
    const rules = document.querySelectorAll(".gold-rule, .gold-rule--center");
    if (!rules.length) return;

    if (prefersReducedMotion()) {
      set(rules, { scaleX: 1 });
      return;
    }

    // CSS already sets transform: scaleX(0) — no JS init needed.

    const animations = new Map<Element, ReturnType<typeof animate>>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animations.get(entry.target)?.revert();
            const anim = animate(entry.target, {
              scaleX: [0, 1],
              duration: 450,
              ease: ease.inkDraw,
            });
            animations.set(entry.target, anim);
          } else {
            // Revert removes inline styles — CSS scaleX(0) takes over
            animations.get(entry.target)?.revert();
            animations.delete(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );

    rules.forEach((rule) => observer.observe(rule));

    return () => {
      observer.disconnect();
      animations.forEach((a) => a.revert());
    };
  }, []);

  return null;
}
