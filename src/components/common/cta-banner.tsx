import * as React from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { CONTACT } from "@/lib/constants";

export interface CTABannerProps {
  title?: string;
  subtitle?: string;
  variant?: "gold" | "dark";
  showPhone?: boolean;
}

export function CTABanner({
  title = "Ready to discuss your case?",
  subtitle = "Our experienced team is here to help. Contact us today for a confidential consultation — we'll respond within one working day.",
}: CTABannerProps) {
  return (
    <section className="relative py-16 md:py-20 bg-ink overflow-hidden">
      {/* Top gold hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-soft to-transparent" />

      <Container>
        <div className="text-center max-w-[600px] mx-auto">
          <p className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase text-gold-soft mb-4">
            Get Started
          </p>
          <h2 className="font-serif font-medium text-[2rem] md:text-[2.4rem] leading-[1.2] text-white mb-4">
            {title}
          </h2>
          <p className="text-[0.95rem] text-white/[0.55] leading-[1.7] mb-9">
            {subtitle}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center text-[0.85rem] font-semibold text-ink bg-gold border-[1.5px] border-gold px-8 py-3.5 rounded-md hover:bg-gold-deep hover:border-gold-deep hover:shadow-gold transition-all duration-200"
            >
              Make an Enquiry
            </Link>
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center justify-center gap-2 text-[0.85rem] font-semibold text-white/70 bg-transparent border-[1.5px] border-white/20 px-8 py-3.5 rounded-md hover:border-white/50 hover:text-white transition-all duration-200"
            >
              <Phone className="w-4 h-4" />
              Call us now
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
