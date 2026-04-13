import * as React from "react";
import { Shield, Scale, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export interface TrustBadge {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const defaultBadges: TrustBadge[] = [
  {
    icon: <Shield className="w-6 h-6" />,
    label: "SRA Regulated",
    value: "#640836",
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    label: "London Offices",
    value: "2",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    label: "Initial Assessment",
    value: "Free",
  },
  {
    icon: <Scale className="w-6 h-6" />,
    label: "Practice Areas",
    value: "Specialist",
  },
];

export interface TrustBadgesProps {
  badges?: TrustBadge[];
  variant?: "light" | "dark" | "transparent";
  size?: "sm" | "md";
}

export function TrustBadges({
  badges = defaultBadges,
  variant = "light",
  size = "md",
}: TrustBadgesProps) {
  const isDark = variant === "dark";
  const isTransparent = variant === "transparent";

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-6 md:gap-10",
        size === "sm" ? "py-4" : "py-6"
      )}
    >
      {badges.map((badge, index) => (
        <div
          key={index}
          className={cn(
            "flex items-center gap-3",
            size === "sm" && "gap-2"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center rounded-full",
              size === "sm" ? "w-10 h-10" : "w-12 h-12",
              isDark
                ? "bg-gold-500/20 text-gold-400"
                : isTransparent
                ? "bg-white/20 text-white"
                : "bg-gold-100 text-gold-600"
            )}
          >
            {badge.icon}
          </div>
          <div>
            <p
              className={cn(
                "font-display font-semibold",
                size === "sm" ? "text-lg" : "text-xl",
                isDark || isTransparent ? "text-white" : "text-foreground"
              )}
            >
              {badge.value}
            </p>
            <p
              className={cn(
                "text-xs",
                isDark
                  ? "text-neutral-400"
                  : isTransparent
                  ? "text-white/70"
                  : "text-text-tertiary"
              )}
            >
              {badge.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
