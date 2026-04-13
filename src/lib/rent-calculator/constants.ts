import type {
  Condition,
  FurnishedStatus,
  EpcRating,
  PropertyType,
  Verdict,
} from "./types";

// ============================================
// ADJUSTMENT FACTORS (tribunal-informed)
// ============================================

export const CONDITION_FACTORS: Record<Condition, number> = {
  excellent: 1.05,
  good: 1.0,
  fair: 0.97,
  poor: 0.9,
  very_poor: 0.85,
};

export const CONDITION_LABELS: Record<Condition, string> = {
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
  very_poor: "Very Poor",
};

export const CONDITION_DESCRIPTIONS: Record<Condition, string> = {
  excellent: "Recently renovated, high-quality fittings throughout",
  good: "Well-maintained, everything in working order",
  fair: "Acceptable but showing wear, minor issues",
  poor: "Significant issues — damp, old boiler, poor windows",
  very_poor: "Major problems — structural issues, health hazards",
};

export const FURNISHED_FACTORS: Record<FurnishedStatus, number> = {
  furnished: 1.08,
  part_furnished: 1.03,
  unfurnished: 1.0,
};

export const FURNISHED_LABELS: Record<FurnishedStatus, string> = {
  furnished: "Furnished",
  part_furnished: "Part-furnished",
  unfurnished: "Unfurnished",
};

export const EPC_FACTORS: Record<EpcRating, number> = {
  A: 1.03,
  B: 1.03,
  C: 1.0,
  D: 0.98,
  E: 0.95,
  F: 0.9,
  G: 0.9,
};

// ============================================
// PROPERTY TYPES
// ============================================

export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "flat", label: "Flat / Apartment" },
  { value: "terraced", label: "Terraced" },
  { value: "semi", label: "Semi-detached" },
  { value: "detached", label: "Detached" },
];

// ============================================
// VERDICT THRESHOLDS & LABELS
// ============================================

export const VERDICT_CONFIG: Record<
  Verdict,
  { label: string; color: string; bgColor: string }
> = {
  well_below_market: {
    label: "Well below market rate",
    color: "text-green-700",
    bgColor: "bg-green-50",
  },
  below_market: {
    label: "Below market rate",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  in_line: {
    label: "In line with market rate",
    color: "text-neutral-700",
    bgColor: "bg-neutral-100",
  },
  slightly_above: {
    label: "Slightly above market rate",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
  },
  above_market: {
    label: "Above market rate",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  significantly_above: {
    label: "Significantly above market rate",
    color: "text-red-700",
    bgColor: "bg-red-50",
  },
};

// ============================================
// POSTCODE VALIDATION
// ============================================

export const POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;
export const ENGLAND_PREFIXES = /^(?!BT|JE|GY|IM)/i;

export function normalizePostcode(raw: string): string {
  const clean = raw.replace(/\s+/g, "").toUpperCase();
  if (clean.length < 5) return clean;
  return `${clean.slice(0, -3)} ${clean.slice(-3)}`;
}
