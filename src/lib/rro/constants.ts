import type { RroOffenceType } from "./types";

// ============================================
// COMMENCEMENT DATES
// ============================================

export const RRA_COMMENCEMENT = "2026-05-01";
export const HPA_COMMENCEMENT = "2017-04-06";
export const BANNING_ORDER_COMMENCEMENT = "2018-04-06";

export const APPLICATION_FEE = 114;
export const HEARING_FEE = 227;

// ============================================
// OFFENCE DEFINITIONS
// ============================================

export interface OffenceOption {
  id: RroOffenceType;
  label: string;
  shortDescription: string;
  category:
    | "eviction_harassment"
    | "enforcement_notice"
    | "licensing"
    | "banning"
    | "tenancy_reform"
    | "database_ombudsman";
  categoryLabel: string;
  available: "always" | "rra_commencement";
  offenceType: "one_off" | "continuing";
}

export const OFFENCE_OPTIONS: OffenceOption[] = [
  // Eviction & Harassment
  {
    id: "violence_securing_entry",
    label: "Violence for Securing Entry",
    shortDescription:
      "Landlord used or threatened violence to get into your home",
    category: "eviction_harassment",
    categoryLabel: "Eviction & Harassment",
    available: "always",
    offenceType: "one_off",
  },
  {
    id: "unlawful_eviction",
    label: "Unlawful Eviction",
    shortDescription:
      "Landlord illegally kicked you out without a court order",
    category: "eviction_harassment",
    categoryLabel: "Eviction & Harassment",
    available: "always",
    offenceType: "one_off",
  },
  {
    id: "harassment_landlord",
    label: "Harassment by Landlord or Agent",
    shortDescription:
      "Landlord harassed you in ways they knew would make you want to leave",
    category: "eviction_harassment",
    categoryLabel: "Eviction & Harassment",
    available: "always",
    offenceType: "continuing",
  },

  // Enforcement Notices
  {
    id: "improvement_notice",
    label: "Ignored Improvement Notice",
    shortDescription:
      "Council told landlord to fix a hazard — they didn't",
    category: "enforcement_notice",
    categoryLabel: "Council Enforcement",
    available: "always",
    offenceType: "continuing",
  },
  {
    id: "prohibition_order",
    label: "Ignored Prohibition Order",
    shortDescription:
      "Council declared your home unfit — landlord kept collecting rent",
    category: "enforcement_notice",
    categoryLabel: "Council Enforcement",
    available: "always",
    offenceType: "continuing",
  },

  // Licensing
  {
    id: "unlicensed_hmo",
    label: "Unlicensed HMO",
    shortDescription:
      "Your shared house needs a licence but doesn't have one",
    category: "licensing",
    categoryLabel: "Licensing",
    available: "always",
    offenceType: "continuing",
  },
  {
    id: "unlicensed_house",
    label: "Unlicensed House (Selective Licensing)",
    shortDescription:
      "Your area requires all rentals to be licensed — yours isn't",
    category: "licensing",
    categoryLabel: "Licensing",
    available: "always",
    offenceType: "continuing",
  },

  // Banning Order
  {
    id: "banning_order_breach",
    label: "Breach of Banning Order",
    shortDescription:
      "Landlord banned from letting but still renting to you",
    category: "banning",
    categoryLabel: "Banning Order",
    available: "always",
    offenceType: "continuing",
  },

  // Tenancy Reform (RRA 2025)
  {
    id: "misused_possession_ground",
    label: "Misused Possession Ground",
    shortDescription:
      "Landlord used a false reason to evict you, and you left within 4 months",
    category: "tenancy_reform",
    categoryLabel: "Tenancy Reform (from May 2026)",
    available: "rra_commencement",
    offenceType: "one_off",
  },
  {
    id: "reletting_restriction",
    label: "Reletting/Marketing Restriction Breach",
    shortDescription:
      "Landlord re-let or marketed property within 12 months of evicting you",
    category: "tenancy_reform",
    categoryLabel: "Tenancy Reform (from May 2026)",
    available: "rra_commencement",
    offenceType: "one_off",
  },
  {
    id: "tenancy_reform_breach",
    label: "Tenancy Reform Continuing Breach",
    shortDescription:
      "Landlord fined for a tenancy reform breach and continues to do the same thing",
    category: "tenancy_reform",
    categoryLabel: "Tenancy Reform (from May 2026)",
    available: "rra_commencement",
    offenceType: "continuing",
  },
  {
    id: "repeat_tenancy_offender",
    label: "Repeat Tenancy Offender",
    shortDescription:
      "Landlord penalised for a tenancy offence and commits a different one within 5 years",
    category: "tenancy_reform",
    categoryLabel: "Tenancy Reform (from May 2026)",
    available: "rra_commencement",
    offenceType: "one_off",
  },

  // Database & Ombudsman (RRA 2025)
  {
    id: "redress_scheme_breach",
    label: "Redress Scheme Breach",
    shortDescription:
      "Landlord fined for not joining the Ombudsman — still hasn't joined",
    category: "database_ombudsman",
    categoryLabel: "Database & Ombudsman (from May 2026)",
    available: "rra_commencement",
    offenceType: "continuing",
  },
  {
    id: "prs_database_false_info",
    label: "PRS Database — False Information",
    shortDescription:
      "Landlord knowingly submitted false information to the national database",
    category: "database_ombudsman",
    categoryLabel: "Database & Ombudsman (from May 2026)",
    available: "rra_commencement",
    offenceType: "one_off",
  },
  {
    id: "prs_database_breach",
    label: "PRS Database — Continuing Breach",
    shortDescription:
      "Landlord fined for not registering on the database — still not registered",
    category: "database_ombudsman",
    categoryLabel: "Database & Ombudsman (from May 2026)",
    available: "rra_commencement",
    offenceType: "continuing",
  },
];

// ============================================
// REGIME LABELS
// ============================================

export const REGIME_LABELS: Record<
  string,
  { label: string; description: string; color: string }
> = {
  hpa_2016: {
    label: "Housing and Planning Act 2016",
    description: "Up to 1 year of rent",
    color: "blue",
  },
  rra_2025: {
    label: "Renters' Rights Act 2025",
    description: "Up to 2 years of rent",
    color: "green",
  },
  transitional: {
    label: "Transitional Case",
    description: "Split calculation applies",
    color: "amber",
  },
};

// ============================================
// STEP LABELS
// ============================================

export const STEP_LABELS = [
  "Offence",
  "Property",
  "Rent",
  "Your Details",
  "Landlord",
  "Evidence",
  "Review",
];

export const TOTAL_STEPS = 7;

// ============================================
// HARASSMENT ACTS
// ============================================

export const HARASSMENT_ACTS = [
  { id: "threatening_messages", label: "Threatening messages or emails" },
  {
    id: "utility_disconnection",
    label: "Cutting off gas, electricity, or water",
  },
  {
    id: "unauthorised_entry",
    label: "Entering your home without permission",
  },
  {
    id: "viewings_without_consent",
    label: "Arranging viewings without your consent",
  },
  { id: "lock_changes", label: "Changing locks or restricting access" },
  {
    id: "excessive_rent_demands",
    label: "Demanding excessive upfront rent",
  },
  { id: "noise_disturbance", label: "Deliberate noise or disturbance" },
  {
    id: "removal_of_belongings",
    label: "Removing or interfering with your belongings",
  },
  { id: "other", label: "Other harassment" },
];

// ============================================
// POSSESSION GROUNDS (s.16J cross-reference)
// ============================================

export const POSSESSION_GROUNDS = [
  {
    value: "1",
    label: "Ground 1 — Landlord or family needs to live in property",
  },
  { value: "1A", label: "Ground 1A — Selling the property" },
  {
    value: "2",
    label: "Ground 2 — Mortgage lender needs possession",
  },
  { value: "5", label: "Ground 5 — Minister of religion" },
  { value: "6", label: "Ground 6 — Redevelopment" },
  { value: "6A", label: "Ground 6A — Planning enforcement" },
  { value: "7", label: "Ground 7 — Death of periodic tenant" },
  { value: "8", label: "Ground 8 — Serious rent arrears (2 months+)" },
  { value: "10", label: "Ground 10 — Some rent arrears" },
  { value: "11", label: "Ground 11 — Persistent delay in paying rent" },
  {
    value: "12",
    label: "Ground 12 — Breach of tenancy obligation",
  },
  { value: "13", label: "Ground 13 — Waste or neglect" },
  { value: "14", label: "Ground 14 — Nuisance or annoyance" },
  { value: "14A", label: "Ground 14A — Domestic violence" },
  {
    value: "17",
    label: "Ground 17 — Grant induced by false statement",
  },
  { value: "other", label: "Other / not sure" },
];

export const PRS_UNRESTRICTED_GROUNDS = ["7A", "14"];

// ============================================
// DATE HELPERS (UTC-safe)
// ============================================

export function addYearsUTC(dateStr: string, years: number): string {
  const d = new Date(dateStr + "T00:00:00Z");
  d.setUTCFullYear(d.getUTCFullYear() + years);
  return d.toISOString().slice(0, 10);
}

export function daysBetweenUTC(from: string, to: string): number {
  const f = new Date(from + "T00:00:00Z");
  const t = new Date(to + "T00:00:00Z");
  return Math.round((t.getTime() - f.getTime()) / (1000 * 60 * 60 * 24));
}

// ============================================
// OFFENCE-SPECIFIC QUALIFYING DATES
// ============================================

export function getEarliestQualifyingDate(offenceType: string): string {
  switch (offenceType) {
    case "banning_order_breach":
      return BANNING_ORDER_COMMENCEMENT;
    case "misused_possession_ground":
    case "reletting_restriction":
    case "tenancy_reform_breach":
    case "repeat_tenancy_offender":
    case "redress_scheme_breach":
    case "prs_database_false_info":
    case "prs_database_breach":
      return RRA_COMMENCEMENT;
    default:
      return HPA_COMMENCEMENT;
  }
}

// ============================================
// TRIBUNAL OFFICE ROUTING
// ============================================

interface TribunalRegion {
  name: string;
  email: string;
  phone: string;
  address: string;
  prefixes: string[];
}

const TRIBUNAL_REGIONS: TribunalRegion[] = [
  {
    name: "London",
    email: "RPSouthern@justice.gov.uk",
    phone: "020 7446 7700",
    address:
      "10 Alfred Place, London WC1E 7LR",
    prefixes: [
      "E",
      "EC",
      "N",
      "NW",
      "SE",
      "SW",
      "W",
      "WC",
      "BR",
      "CR",
      "DA",
      "EN",
      "HA",
      "IG",
      "KT",
      "RM",
      "SM",
      "TW",
      "UB",
    ],
  },
  {
    name: "Northern",
    email: "RPNorthern@justice.gov.uk",
    phone: "0161 237 9491",
    address:
      "1st Floor, Piccadilly Exchange, 2 Piccadilly Plaza, Manchester M1 4AH",
    prefixes: [
      "BB",
      "BD",
      "BL",
      "CA",
      "DH",
      "DL",
      "DN",
      "FY",
      "HD",
      "HG",
      "HU",
      "HX",
      "L",
      "LA",
      "LS",
      "M",
      "NE",
      "OL",
      "PR",
      "S",
      "SK",
      "SR",
      "TS",
      "WA",
      "WF",
      "WN",
      "YO",
    ],
  },
  {
    name: "Midland",
    email: "RPMidland@justice.gov.uk",
    phone: "0121 609 9040",
    address:
      "Centre City Tower, 5-7 Hill Street, Birmingham B5 4UU",
    prefixes: [
      "B",
      "CV",
      "DE",
      "DY",
      "LE",
      "NG",
      "NN",
      "PE",
      "ST",
      "SY",
      "TF",
      "WR",
      "WS",
      "WV",
    ],
  },
  {
    name: "Eastern",
    email: "RPEastern@justice.gov.uk",
    phone: "01223 841 524",
    address:
      "Cambridge County Court, 197 East Road, Cambridge CB1 1BA",
    prefixes: [
      "AL",
      "CB",
      "CM",
      "CO",
      "HP",
      "IP",
      "LU",
      "MK",
      "NR",
      "OX",
      "SG",
      "SS",
      "WD",
    ],
  },
];

export function getTribunalOffice(postcode: string) {
  const prefix = postcode
    .toUpperCase()
    .replace(/\s/g, "")
    .match(/^[A-Z]{1,2}/)?.[0];

  if (prefix) {
    for (const region of TRIBUNAL_REGIONS) {
      if (region.prefixes.includes(prefix)) {
        return {
          region: region.name,
          name: `First-tier Tribunal (Property Chamber) — ${region.name}`,
          address: region.address,
          email: region.email,
          phone: region.phone,
        };
      }
    }
  }

  // Default to Southern for unmatched postcodes
  return {
    region: "Southern",
    name: "First-tier Tribunal (Property Chamber) — Southern",
    address: "10 Alfred Place, London WC1E 7LR",
    email: "RPSouthern@justice.gov.uk",
    phone: "020 7446 7700",
  };
}
