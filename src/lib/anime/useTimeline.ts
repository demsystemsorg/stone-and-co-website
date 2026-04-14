"use client";

import { useRef, useEffect, useCallback } from "react";
import { createTimeline, set } from "animejs";
import type { TimelineParams, Timeline } from "animejs";
import { prefersReducedMotion } from "./reduced-motion";

/**
 * Wraps createTimeline() with React lifecycle.
 * Returns a build function that creates and returns the timeline for chaining .add() calls.
 * Timeline is automatically reverted on unmount.
 */
export function useTimeline(defaults?: TimelineParams["defaults"]) {
  const timelineRef = useRef<Timeline | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
    return () => {
      timelineRef.current?.revert();
    };
  }, []);

  const build = useCallback(
    (params?: TimelineParams) => {
      // Clean up previous timeline
      timelineRef.current?.revert();

      if (reduced.current) {
        return null;
      }

      const merged: TimelineParams = {
        ...params,
        defaults: { ...defaults, ...params?.defaults },
      };
      const tl = createTimeline(merged);
      timelineRef.current = tl;
      return tl;
    },
    [defaults]
  );

  return { build, isReduced: () => reduced.current, set };
}
