"use client";

/**
 * Check if the user prefers reduced motion.
 * Safe for SSR — returns false on the server.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
