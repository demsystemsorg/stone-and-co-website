import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Container>
        <div className="flex flex-col items-center justify-center">
          {/* Animated Logo/Spinner */}
          <div className="relative w-16 h-16 mb-6">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-neutral-200" />
            {/* Spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-gold-500 animate-spin" />
          </div>

          {/* Loading text */}
          <p className="text-text-secondary text-sm animate-pulse">
            Loading...
          </p>
        </div>
      </Container>
    </div>
  );
}
