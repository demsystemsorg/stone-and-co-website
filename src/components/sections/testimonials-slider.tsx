"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Section } from "@/components/ui/section";
import { TestimonialCard } from "@/components/common/testimonial-card";
import { featuredTestimonials } from "@/data/testimonials";

export interface TestimonialsSliderProps {
  title?: string;
  subtitle?: string;
}

export function TestimonialsSlider({
  title = "What Our Clients Say",
  subtitle = "We are proud of our track record and the relationships we build with our clients.",
}: TestimonialsSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const testimonials = featuredTestimonials;
  const itemsPerView = 3;
  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const next = () => {
    if (currentIndex < maxIndex) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Auto-advance
  React.useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < maxIndex) {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setDirection(-1);
        setCurrentIndex(0);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, maxIndex]);

  return (
    <Section variant="default" padding="lg" topEffect="inset">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-4">
          {title}
        </h2>
        <p className="text-lg text-neutral-600">{subtitle}</p>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Cards container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-6"
            animate={{ x: `calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * 24}px)` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0"
              >
                <TestimonialCard
                  quote={testimonial.quote}
                  author={testimonial.author}
                  location={testimonial.location}
                  practiceArea={testimonial.practiceArea}
                  rating={testimonial.rating}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className={cn(
              "p-2 rounded-full border transition-colors",
              currentIndex === 0
                ? "border-neutral-300 text-neutral-400 cursor-not-allowed"
                : "border-neutral-400 text-neutral-600 hover:border-gold-500 hover:text-gold-600"
            )}
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > currentIndex ? 1 : -1);
                  setCurrentIndex(i);
                }}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i === currentIndex ? "bg-gold-600" : "bg-neutral-300"
                )}
                aria-label={`Go to testimonial group ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={currentIndex === maxIndex}
            className={cn(
              "p-2 rounded-full border transition-colors",
              currentIndex === maxIndex
                ? "border-neutral-300 text-neutral-400 cursor-not-allowed"
                : "border-neutral-400 text-neutral-600 hover:border-gold-500 hover:text-gold-600"
            )}
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Section>
  );
}
