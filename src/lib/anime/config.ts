// Centralized motion tokens for anime.js v4 animations
// All easing names use v4 syntax (no 'ease' prefix)

export const ease = {
  primary: "outCubic",
  smooth: "outQuad",
  text: "outExpo",
  decorative: "outBack",
  linear: "linear",
  // Semiotic easings
  authority: "outBack(1.02)",
  punctuate: "outElastic(1, 0.6)",
  snap: "outElastic(1, 0.7)",
  stamp: "outBack(1.5)",
  inkDraw: "outBack(1.8)",
  resistance: "outElastic(1, 0.6)",
  // Hover easings
  hover: "outCubic",
  hoverSettle: "outElastic(1, 0.8)",
} as const;

export const duration = {
  micro: 150,
  fast: 250,
  normal: 350,
  slow: 500,
  text: 600,
  hero: 800,
  // Hover durations (asymmetric: quick in, considered out)
  hover: 200,
  hoverOut: 280,
} as const;

export const staggerDelay = {
  char: 25,
  tight: 40,
  normal: 60,
  wide: 100,
  section: 150,
} as const;
