import type { Testimonial } from "@/types/testimonial";

/**
 * Client testimonials
 * Note: These are placeholder testimonials - to be replaced with actual client reviews
 */
export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Stone & Co. handled my divorce with compassion and professionalism. Sarah made a difficult time much easier to navigate, and I felt supported throughout the entire process.",
    author: "Rebecca M.",
    location: "Walthamstow",
    practiceArea: "Family Law",
    rating: 5,
    featured: true,
  },
  {
    id: "2",
    quote:
      "James was incredibly thorough in preparing my employment tribunal case. His attention to detail and strategic approach led to a successful outcome. I cannot recommend him highly enough.",
    author: "Michael T.",
    location: "Stratford",
    practiceArea: "Employment",
    rating: 5,
    featured: true,
  },
  {
    id: "3",
    quote:
      "Maria helped my family with our visa applications and made the entire process stress-free. Her Italian language skills were invaluable, and she explained everything clearly.",
    author: "Giuseppe L.",
    location: "Clerkenwell",
    practiceArea: "Immigration",
    rating: 5,
    featured: true,
  },
  {
    id: "4",
    quote:
      "After months of dealing with a damp problem in my flat, David took on my housing disrepair case and secured compensation far beyond what I expected. Truly excellent service.",
    author: "Amanda K.",
    location: "Leytonstone",
    practiceArea: "Housing",
    rating: 5,
    featured: true,
  },
  {
    id: "5",
    quote:
      "Professional, responsive, and genuinely caring. The team at Stone & Co. treated me like family and fought hard for my case. I would recommend them to anyone.",
    author: "Daniel S.",
    location: "Bow",
    practiceArea: "Criminal Law",
    rating: 5,
    featured: false,
  },
  {
    id: "6",
    quote:
      "The service from Consulenti Italiani was exceptional. Having a solicitor who understood both the legal system and Italian culture made all the difference for our family.",
    author: "Francesca P.",
    location: "Islington",
    practiceArea: "Immigration",
    rating: 5,
    featured: false,
  },
];

export const featuredTestimonials = testimonials.filter((t) => t.featured);
