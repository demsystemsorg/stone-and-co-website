"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  /** Custom items (overrides auto-generation) */
  items?: BreadcrumbItem[];
  /** Show home icon */
  showHome?: boolean;
  /** Custom separator */
  separator?: React.ReactNode;
}

// Convert URL segment to readable label
function segmentToLabel(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  return segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const isLast = index === segments.length - 1;

    return {
      label: segmentToLabel(segment),
      href: isLast ? undefined : href,
    };
  });
}

export function Breadcrumbs({
  className,
  items,
  showHome = true,
  separator,
  ...props
}: BreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbs = items || generateBreadcrumbs(pathname);

  // Don't show breadcrumbs on homepage
  if (pathname === "/" && !items) {
    return null;
  }

  const defaultSeparator = (
    <ChevronRight className="w-4 h-4 text-neutral-400" aria-hidden="true" />
  );

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("py-4", className)}
      {...props}
    >
      <ol
        className="flex items-center flex-wrap gap-2 text-sm"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {/* Home */}
        {showHome && (
          <>
            <li
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <Link
                href="/"
                className="text-text-secondary hover:text-gold-600 transition-colors"
                itemProp="item"
              >
                <Home className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only" itemProp="name">
                  Home
                </span>
              </Link>
              <meta itemProp="position" content="1" />
            </li>
            {breadcrumbs.length > 0 && (
              <li aria-hidden="true">{separator || defaultSeparator}</li>
            )}
          </>
        )}

        {/* Breadcrumb items */}
        {breadcrumbs.map((item, index) => {
          const position = showHome ? index + 2 : index + 1;
          const isLast = index === breadcrumbs.length - 1;

          return (
            <React.Fragment key={item.label}>
              <li
                className="flex items-center"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-text-secondary hover:text-gold-600 transition-colors"
                    itemProp="item"
                  >
                    <span itemProp="name">{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className="text-foreground font-medium"
                    itemProp="name"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                )}
                <meta itemProp="position" content={String(position)} />
              </li>
              {!isLast && (
                <li aria-hidden="true">{separator || defaultSeparator}</li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
