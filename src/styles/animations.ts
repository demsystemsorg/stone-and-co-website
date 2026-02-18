/**
 * Framer Motion animation variants for Stone & Co. Solicitors v2
 * "Calm confidence" — 160-220ms, ease-out, no parallax
 */

export const timing = {
  fast: 0.15,
  normal: 0.2,
  slow: 0.3,
  page: 0.5,
};

export const easing = {
  out: [0.25, 0.1, 0.25, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
};

// Page transitions
export const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: timing.page, ease: easing.smooth },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: timing.slow, ease: easing.out },
  },
};

// Scroll reveal
export const scrollRevealVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: timing.page, ease: easing.smooth },
  },
};

// Fade in variants
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: timing.slow, ease: easing.out },
  },
};

// Fade in up
export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: timing.slow, ease: easing.smooth },
  },
};

// Stagger container
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

// Stagger item
export const staggerItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: timing.slow, ease: easing.smooth },
  },
};

// Button — subtle scale only
export const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.01, transition: { duration: timing.fast, ease: easing.out } },
  tap: { scale: 0.99, transition: { duration: 0.1 } },
};

// Card hover — minimal lift
export const cardHoverVariants = {
  rest: { y: 0, transition: { duration: timing.normal, ease: easing.smooth } },
  hover: { y: -2, transition: { duration: timing.normal, ease: easing.smooth } },
};

// Mobile menu variants
export const mobileMenuVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: timing.normal, ease: easing.smooth },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: { duration: timing.normal, ease: easing.smooth },
  },
};

// Dropdown menu variants
export const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    transition: { duration: timing.fast },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: timing.fast, ease: easing.smooth },
  },
};

// Hero text (staggered entrance)
export const heroTextVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: timing.page,
      ease: easing.smooth,
    },
  }),
};

// Accordion
export const accordionVariants = {
  collapsed: { height: 0, opacity: 0, transition: { duration: timing.slow, ease: easing.smooth } },
  expanded: { height: "auto", opacity: 1, transition: { duration: timing.slow, ease: easing.smooth } },
};

// Icon rotation
export const iconRotateVariants = {
  collapsed: { rotate: 0 },
  expanded: { rotate: 180, transition: { duration: timing.normal, ease: easing.smooth } },
};

// Slide in from left
export const slideInLeft = {
  hidden: { x: -50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: timing.slow, ease: easing.smooth },
  },
};

// Slide in from right
export const slideInRight = {
  hidden: { x: 50, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: timing.slow, ease: easing.smooth },
  },
};

// Number counter animation (for stats)
export const counterVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: timing.page, ease: easing.smooth },
  },
};

// Testimonial card variants (for carousel)
export const testimonialVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: timing.slow, ease: easing.smooth },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: { duration: timing.slow, ease: easing.smooth },
  }),
};

// Nav underline
export const navUnderlineVariants = {
  rest: { width: 0 },
  hover: {
    width: "100%",
    transition: { duration: timing.normal, ease: easing.smooth },
  },
};

// Image reveal
export const imageRevealVariants = {
  hidden: {
    clipPath: "inset(0 100% 0 0)",
    opacity: 0,
  },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    opacity: 1,
    transition: { duration: 0.6, ease: easing.smooth },
  },
};

// Shimmer effect for loading
export const shimmerVariants = {
  initial: { backgroundPosition: "-200% 0" },
  animate: {
    backgroundPosition: "200% 0",
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear",
    },
  },
};
