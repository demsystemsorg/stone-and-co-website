"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/cn";
import { NAVIGATION, CONTACT } from "@/lib/constants";
import { Container } from "@/components/ui/container";
import { Logo } from "./logo";
import { useMagnetic } from "@/lib/anime/useProximity";

export interface HeaderProps {
  transparent?: boolean;
}

export function Header({ transparent = false }: HeaderProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const ctaRef = React.useRef<HTMLAnchorElement>(null);
  useMagnetic(ctaRef, { radius: 50, maxDisplacement: 2 });

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        "bg-bg/[0.92] backdrop-blur-xl",
        isScrolled
          ? "border-b border-gold-soft shadow-[0_1px_24px_rgba(20,20,18,0.04)]"
          : "border-b border-transparent"
      )}
    >
      <Container>
        <nav
          className="flex items-center justify-between h-[56px]"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {NAVIGATION.main.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const hasChildren = "children" in item && item.children;

              if (hasChildren) {
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className={cn(
                        "group/nav flex items-center gap-1 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-colors relative",
                        isActive
                          ? "text-ink"
                          : "text-muted hover:text-ink"
                      )}
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "w-3.5 h-3.5 transition-transform",
                          openDropdown === item.label && "rotate-180"
                        )}
                      />
                      <span className={cn(
                        "absolute bottom-1 left-4 right-4 h-px bg-gold",
                        !isActive && "origin-left scale-x-0 transition-transform duration-200 group-hover/nav:scale-x-100"
                      )} />
                    </button>

                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 pt-2 w-72"
                        >
                          <div className="bg-surface shadow-md border border-line py-2 overflow-hidden">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={cn(
                                  "block pl-3.5 pr-4 py-3 border-l-2 border-transparent hover:border-gold hover:bg-bg transition-all duration-150",
                                  pathname === child.href && "bg-gold-bg border-gold"
                                )}
                              >
                                <span className="block text-sm font-medium text-ink">
                                  {child.label}
                                </span>
                                <span className="block text-xs text-dim mt-0.5">
                                  {child.description}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.12em] transition-colors relative",
                    isActive
                      ? "text-ink"
                      : "text-muted hover:text-ink"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "absolute bottom-1 left-4 right-4 h-px bg-gold",
                    !isActive && "origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100"
                  )} />
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-[0.82rem] font-medium text-muted hover:text-ink transition-colors"
            >
              <Phone className="w-[15px] h-[15px] stroke-gold" />
              <span className="hidden xl:inline">{CONTACT.phone}</span>
            </a>
            <Link
              ref={ctaRef}
              href="/contact"
              className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-ink px-6 py-2.5 border border-gold hover:bg-gold hover:text-surface hover:scale-[1.01] active:scale-[0.98] active:duration-100 transition-all duration-200 hover:shadow-gold"
            >
              Make an Enquiry
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-ink hover:bg-ink/[0.05] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-bg border-t border-line overflow-hidden"
          >
            <Container>
              <div className="py-4 space-y-1">
                {NAVIGATION.main.map((item) => {
                  const isActive = pathname === item.href;
                  const hasChildren = "children" in item && item.children;

                  if (hasChildren) {
                    return (
                      <div key={item.label} className="space-y-1">
                        <Link
                          href={item.href}
                          className={cn(
                            "block px-0 py-3 text-base font-medium transition-colors border-b border-line-soft active:border-gold",
                            isActive ? "text-gold-deep" : "text-ink"
                          )}
                        >
                          {item.label}
                        </Link>
                        <div className="pl-4 space-y-0">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "block py-2 text-sm transition-colors",
                                pathname === child.href
                                  ? "text-gold-deep"
                                  : "text-dim hover:text-ink"
                              )}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "block px-0 py-3 text-base font-medium transition-colors border-b border-line-soft active:border-gold",
                        isActive ? "text-gold-deep" : "text-ink"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                {/* Mobile CTA */}
                <div className="pt-6 space-y-4">
                  <a
                    href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-2 text-base font-medium text-ink"
                  >
                    <Phone className="w-5 h-5 text-gold" />
                    {CONTACT.phone}
                  </a>
                  <Link
                    href="/contact"
                    className="block w-full text-center text-[0.72rem] font-bold uppercase tracking-[0.15em] text-ink px-6 py-3.5 border border-gold hover:bg-gold hover:text-surface transition-all"
                  >
                    Make an Enquiry
                  </Link>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
