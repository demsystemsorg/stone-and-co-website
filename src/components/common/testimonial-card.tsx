import * as React from "react";
import { Quote, Star } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "@/components/ui/badge";

export interface TestimonialCardProps {
  quote: string;
  author: string;
  location?: string;
  practiceArea?: string;
  rating?: number;
  variant?: "light" | "dark";
}

export function TestimonialCard({
  quote,
  author,
  location,
  practiceArea,
  rating = 5,
  variant = "light",
}: TestimonialCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "group flex flex-col h-full p-6 md:p-8 rounded-lg transition-all duration-[280ms] touch-feedback",
        isDark
          ? "bg-neutral-900 text-white hover:shadow-[inset_2px_0_0_var(--gold),0_2px_8px_rgba(199,164,87,0.08)]"
          : "bg-white border border-neutral-200 hover:shadow-[inset_2px_0_0_var(--gold),0_2px_8px_rgba(199,164,87,0.06)]"
      )}
    >
      {/* Quote icon */}
      <Quote
        className={cn(
          "w-10 h-10 mb-4 group-hover:scale-[1.08] transition-transform duration-200",
          isDark ? "text-gold-400" : "text-gold-500"
        )}
      />

      {/* Quote text */}
      <blockquote
        className={cn(
          "text-lg leading-relaxed flex-grow mb-6",
          isDark ? "text-neutral-200" : "text-neutral-700"
        )}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>

      {/* Rating */}
      {rating && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-4 h-4",
                i < rating
                  ? "text-gold-400 fill-gold-400"
                  : "text-neutral-700"
              )}
            />
          ))}
        </div>
      )}

      {/* Author info */}
      <div className="flex items-center justify-between">
        <div>
          <p
            className={cn(
              "font-medium",
              isDark ? "text-white" : "text-neutral-900"
            )}
          >
            {author}
          </p>
          {location && (
            <p
              className={cn(
                "text-sm",
                isDark ? "text-neutral-400" : "text-neutral-500"
              )}
            >
              {location}
            </p>
          )}
        </div>

        {practiceArea && (
          <Badge variant="gold" size="sm">
            {practiceArea}
          </Badge>
        )}
      </div>
    </div>
  );
}
