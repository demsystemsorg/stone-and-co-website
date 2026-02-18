import * as React from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import { SITE_CONFIG, NAVIGATION, OFFICES, SRA_NUMBER } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/50" role="contentinfo">
      {/* Main Footer */}
      <div className="pt-16 pb-14 lg:pt-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {/* Brand column */}
            <div>
              <Logo variant="full" size="lg" light className="mb-5" />
              <p className="text-[0.85rem] leading-[1.7] text-white/40 max-w-[340px] mt-5">
                Experienced solicitors providing comprehensive legal services
                across London. Two convenient locations to serve you better.
              </p>
              <div className="flex items-center gap-2 mt-6 text-[0.78rem] text-white/35">
                <Scale className="w-4 h-4 text-gold" />
                <span>SRA Regulated — No. {SRA_NUMBER}</span>
              </div>
            </div>

            {/* Offices column */}
            <div>
              <h4 className="font-serif font-semibold text-base text-white mb-5">
                Offices
              </h4>
              <div className="mb-6">
                <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-gold mb-2">
                  City
                </p>
                <p className="text-[0.82rem] text-white/40 leading-[1.6]">
                  {OFFICES.city.address.street !== "TBC"
                    ? `${OFFICES.city.address.street}, `
                    : ""}
                  London {OFFICES.city.address.postcode}
                </p>
                <a
                  href={`tel:${OFFICES.city.phone.replace(/\s/g, "")}`}
                  className="text-[0.82rem] text-white/50 hover:text-gold transition-colors block mt-1"
                >
                  {OFFICES.city.phone}
                </a>
              </div>
              <div className="mb-6">
                <p className="text-[0.7rem] font-semibold tracking-[0.1em] uppercase text-gold mb-2">
                  Leytonstone
                </p>
                <p className="text-[0.82rem] text-white/40 leading-[1.6]">
                  {OFFICES.leytonstone.address.street !== "TBC"
                    ? `${OFFICES.leytonstone.address.street}, `
                    : ""}
                  London {OFFICES.leytonstone.address.postcode}
                </p>
                <a
                  href={`tel:${OFFICES.leytonstone.phone.replace(/\s/g, "")}`}
                  className="text-[0.82rem] text-white/50 hover:text-gold transition-colors block mt-1"
                >
                  {OFFICES.leytonstone.phone}
                </a>
              </div>
              <p className="text-[0.78rem] text-white/30">
                {OFFICES.city.hours.weekday}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* Sub Footer */}
      <div className="border-t border-white/[0.08]">
        <Container>
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[0.78rem] text-white/25 text-center md:text-left">
              &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <nav aria-label="Legal" className="flex flex-wrap items-center gap-6">
              {NAVIGATION.footer.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[0.78rem] text-white/30 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/complaints"
                className="text-[0.78rem] text-white/30 hover:text-gold transition-colors"
              >
                Complaints Procedure
              </Link>
            </nav>
          </div>
        </Container>
      </div>
    </footer>
  );
}
