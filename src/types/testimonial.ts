/**
 * Testimonial type definitions
 */

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  location?: string;
  practiceArea?: string;
  rating?: number;
  featured?: boolean;
  date?: string;
}
