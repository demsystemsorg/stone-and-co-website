import type { Testimonial } from "@/types/testimonial";

/**
 * Client testimonials
 * Removed — will be populated with real Google/Trustpilot reviews when available
 */
export const testimonials: Testimonial[] = [];

export const featuredTestimonials = testimonials.filter((t) => t.featured);
