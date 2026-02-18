"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Container, Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50">
      <Container>
        <div className="max-w-xl mx-auto text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-10 h-10" />
          </div>

          {/* Message */}
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Something Went Wrong
          </h1>
          <p className="text-lg text-text-secondary mb-8">
            We apologize for the inconvenience. An unexpected error has occurred.
            Please try again or contact us if the problem persists.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={reset}>
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Link>
            </Button>
          </div>

          {/* Error ID for support */}
          {error.digest && (
            <p className="text-xs text-text-tertiary mt-8">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
