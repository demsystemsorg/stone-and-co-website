"use client";

import * as React from "react";
import { prefersReducedMotion } from "./reduced-motion";

// ─── Singleton mousemove listener ───────────────────────────────────
// One listener on document, shared across all subscribers.
// RAF loop pauses after 100ms of no movement.

type Subscriber = (x: number, y: number) => void;

let subscribers: Set<Subscriber> | null = null;
let cursorX = -9999;
let cursorY = -9999;
let idleTimer: ReturnType<typeof setTimeout> | null = null;
let rafId: number | null = null;
let isRunning = false;

function tick() {
  subscribers?.forEach((fn) => fn(cursorX, cursorY));
  if (isRunning) {
    rafId = requestAnimationFrame(tick);
  }
}

function onMouseMove(e: MouseEvent) {
  cursorX = e.clientX;
  cursorY = e.clientY;

  if (!isRunning) {
    isRunning = true;
    rafId = requestAnimationFrame(tick);
  }

  // Reset idle timer
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    isRunning = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }, 100);
}

function subscribe(fn: Subscriber) {
  if (!subscribers) {
    subscribers = new Set();
    document.addEventListener("mousemove", onMouseMove, { passive: true });
  }
  subscribers.add(fn);
  return () => {
    subscribers?.delete(fn);
    if (subscribers?.size === 0) {
      document.removeEventListener("mousemove", onMouseMove);
      if (idleTimer) clearTimeout(idleTimer);
      if (rafId) cancelAnimationFrame(rafId);
      subscribers = null;
      isRunning = false;
    }
  };
}

// ─── Hook: proximity glow ───────────────────────────────────────────

export interface UseProximityGlowOptions {
  radius?: number;
  glowColor?: string;
  glowSize?: number;
  brightnessMax?: number;
}

/**
 * Applies a proximity glow effect to an element — gold glow intensifies
 * as cursor approaches within `radius` px.
 *
 * Desktop only. No-op on touch devices and reduced motion.
 */
export function useProximityGlow(
  ref: React.RefObject<HTMLElement | null>,
  options: UseProximityGlowOptions = {}
) {
  const {
    radius = 150,
    glowColor = "rgba(199,164,87,0.12)",
    glowSize = 8,
    brightnessMax = 1.15,
  } = options;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    // Skip on touch devices
    if (window.matchMedia("(hover: none)").matches) return;

    let currentIntensity = 0;

    const unsubscribe = subscribe((cx, cy) => {
      const rect = el.getBoundingClientRect();
      const elCx = rect.left + rect.width / 2;
      const elCy = rect.top + rect.height / 2;
      const dist = Math.sqrt((cx - elCx) ** 2 + (cy - elCy) ** 2);

      const targetIntensity = dist < radius ? 1 - dist / radius : 0;
      // Lerp for smooth tracking
      currentIntensity += (targetIntensity - currentIntensity) * 0.12;

      if (currentIntensity < 0.01) {
        el.style.boxShadow = "";
        el.style.filter = "";
        return;
      }

      const opacity = currentIntensity;
      const color = glowColor.replace(/[\d.]+\)$/, `${(parseFloat(glowColor.match(/[\d.]+\)$/)?.[0] || "0.12") * opacity).toFixed(3)})`);
      el.style.boxShadow = `0 0 ${glowSize}px ${color}`;
      el.style.filter = `brightness(${1 + (brightnessMax - 1) * opacity})`;
    });

    return () => {
      unsubscribe();
      if (el) {
        el.style.boxShadow = "";
        el.style.filter = "";
      }
    };
  }, [ref, radius, glowColor, glowSize, brightnessMax]);
}

// ─── Hook: magnetic pull ────────────────────────────────────────────

export interface UseMagneticOptions {
  radius?: number;
  maxDisplacement?: number;
  springBack?: number; // ms for spring-back transition
}

/**
 * Applies a subtle magnetic pull to an element — translates up to
 * `maxDisplacement` px toward the cursor when within `radius` px.
 *
 * Desktop only. No-op on touch devices and reduced motion.
 */
export function useMagnetic(
  ref: React.RefObject<HTMLElement | null>,
  options: UseMagneticOptions = {}
) {
  const {
    radius = 50,
    maxDisplacement = 2,
    springBack = 280,
  } = options;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(hover: none)").matches) return;

    let isInRange = false;

    const unsubscribe = subscribe((cx, cy) => {
      const rect = el.getBoundingClientRect();
      const elCx = rect.left + rect.width / 2;
      const elCy = rect.top + rect.height / 2;
      const dist = Math.sqrt((cx - elCx) ** 2 + (cy - elCy) ** 2);

      if (dist < radius) {
        if (!isInRange) {
          el.style.transition = "transform 100ms ease-out";
          isInRange = true;
        }
        const factor = (1 - dist / radius) * maxDisplacement;
        const dx = ((cx - elCx) / dist) * factor;
        const dy = ((cy - elCy) / dist) * factor;
        el.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
      } else if (isInRange) {
        // Spring back
        el.style.transition = `transform ${springBack}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
        el.style.transform = "translate(0, 0)";
        isInRange = false;
      }
    });

    return () => {
      unsubscribe();
      if (el) {
        el.style.transition = "";
        el.style.transform = "";
      }
    };
  }, [ref, radius, maxDisplacement, springBack]);
}
