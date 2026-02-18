import * as React from "react";
import { MapPin, Phone, Mail, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";

export interface OfficeCardProps {
  name: string;
  address: {
    street: string;
    city: string;
    postcode: string;
  };
  phone: string;
  email: string;
  hours: string;
  mapUrl: string;
  variant?: "light" | "dark";
}

export function OfficeCard({
  name,
  address,
  phone,
  email,
  hours,
  mapUrl,
  variant = "light",
}: OfficeCardProps) {
  const isDark = variant === "dark";

  return (
    <div
      className={cn(
        "p-6 rounded-lg",
        isDark ? "bg-neutral-800" : "bg-white border border-neutral-200"
      )}
    >
      {/* Office name */}
      <h3
        className={cn(
          "font-display text-xl font-semibold mb-4",
          isDark ? "text-gold-400" : "text-gold-600"
        )}
      >
        {name}
      </h3>

      {/* Details */}
      <div className="space-y-3 mb-6">
        {/* Address */}
        <div className="flex items-start gap-3">
          <MapPin
            className={cn(
              "w-5 h-5 mt-0.5 shrink-0",
              isDark ? "text-neutral-400" : "text-text-tertiary"
            )}
          />
          <address
            className={cn(
              "not-italic text-sm",
              isDark ? "text-neutral-300" : "text-text-secondary"
            )}
          >
            {address.street}
            <br />
            {address.city}, {address.postcode}
          </address>
        </div>

        {/* Phone */}
        <div className="flex items-center gap-3">
          <Phone
            className={cn(
              "w-5 h-5 shrink-0",
              isDark ? "text-neutral-400" : "text-text-tertiary"
            )}
          />
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className={cn(
              "text-sm hover:text-gold-500 transition-colors",
              isDark ? "text-neutral-300" : "text-text-secondary"
            )}
          >
            {phone}
          </a>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail
            className={cn(
              "w-5 h-5 shrink-0",
              isDark ? "text-neutral-400" : "text-text-tertiary"
            )}
          />
          <a
            href={`mailto:${email}`}
            className={cn(
              "text-sm hover:text-gold-500 transition-colors",
              isDark ? "text-neutral-300" : "text-text-secondary"
            )}
          >
            {email}
          </a>
        </div>

        {/* Hours */}
        <div className="flex items-center gap-3">
          <Clock
            className={cn(
              "w-5 h-5 shrink-0",
              isDark ? "text-neutral-400" : "text-text-tertiary"
            )}
          />
          <span
            className={cn(
              "text-sm",
              isDark ? "text-neutral-300" : "text-text-secondary"
            )}
          >
            {hours}
          </span>
        </div>
      </div>

      {/* Map link */}
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        asChild
      >
        <a href={mapUrl} target="_blank" rel="noopener noreferrer">
          <span>Get Directions</span>
          <ExternalLink className="w-4 h-4 ml-2" />
        </a>
      </Button>
    </div>
  );
}
