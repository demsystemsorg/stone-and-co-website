import Link from "next/link";
import { Home, ArrowLeft, Phone, Search } from "lucide-react";
import { Container, Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-neutral-50">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Number */}
          <div className="relative mb-8">
            <span className="text-[12rem] md:text-[16rem] font-display font-bold text-neutral-100 leading-none select-none">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-20 h-20 md:w-28 md:h-28 text-gold-500/50" />
            </div>
          </div>

          {/* Message */}
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. Let us
            help you find what you need.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild>
              <Link href="/">
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>

          {/* Helpful Links */}
          <div className="border-t border-neutral-200 pt-8">
            <p className="text-sm text-text-tertiary mb-4">
              Looking for one of these?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/practice-areas"
                className="text-sm text-gold-600 hover:text-gold-700 hover:underline"
              >
                Practice Areas
              </Link>
              <Link
                href="/team"
                className="text-sm text-gold-600 hover:text-gold-700 hover:underline"
              >
                Our Team
              </Link>
              <Link
                href="/about"
                className="text-sm text-gold-600 hover:text-gold-700 hover:underline"
              >
                About Us
              </Link>
              <Link
                href="/consulenti-italiani"
                className="text-sm text-gold-600 hover:text-gold-700 hover:underline"
              >
                Consulenti Italiani
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
