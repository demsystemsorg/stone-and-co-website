import { createTimeline } from "animejs";

export type Timeline = ReturnType<typeof createTimeline>;

export interface HeroDisplayLogoHandle {
  /** Register this variant's animation entries onto the hero timeline. */
  registerOnTimeline: (tl: Timeline) => void;
  /** Get the wrapper element for parallax control by the parent. */
  getWrapper: () => HTMLDivElement | null;
  /** Replay the standalone animation (for hover / scroll-to-top). */
  replay: () => void;
}
