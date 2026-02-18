import { z } from "zod";

// ============================================
// RRA CLAIM TYPES
// ============================================

export const RRA_CLAIM_TYPES = [
  "rra_s21_defence",
  "rra_unlawful_eviction",
  "rra_rent_increase",
  "rra_housing_disrepair",
  "rra_discrimination",
  "rra_pet_refusal",
  "rra_deposit_advance",
  "rra_rental_bidding",
  "rra_written_terms",
  "rra_general_advisory",
] as const;

export type RraClaimType = (typeof RRA_CLAIM_TYPES)[number];

export const RRA_CLAIM_LABELS: Record<RraClaimType, string> = {
  rra_s21_defence: "My landlord wants me to leave",
  rra_unlawful_eviction: "I've been locked out or forced out",
  rra_rent_increase: "My rent is going up",
  rra_housing_disrepair: "My home needs repairs (damp, mould, etc.)",
  rra_discrimination: "I've been treated unfairly",
  rra_pet_refusal: "My landlord won't allow my pet",
  rra_deposit_advance: "Problems with my deposit or upfront payments",
  rra_rental_bidding: "I was asked to pay more than the advertised rent",
  rra_written_terms: "I don't have a proper tenancy agreement",
  rra_general_advisory: "Something else / I'm not sure",
};

// ============================================
// VALIDATION SCHEMA
// ============================================

const ukPhoneRegex = /^(\+44|0)[\d\s\-()]{9,13}$/;

export const tenantIntakeSchema = z
  .object({
    // Contact
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must be under 100 characters"),
    phone: z
      .string()
      .regex(ukPhoneRegex, "Please enter a valid UK phone number"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .optional()
      .or(z.literal("")),
    postcode: z
      .string()
      .min(5, "Please enter a valid postcode")
      .max(8, "Please enter a valid postcode"),
    preferredContact: z.enum(["phone", "email", "either"]),
    safeVoicemail: z.boolean().optional(),
    officePreference: z
      .enum(["city", "leytonstone", "no-preference"])
      .optional(),

    // Claim
    issueType: z.enum(RRA_CLAIM_TYPES, {
      error: "Please select an issue type",
    }),
    summary: z
      .string()
      .min(30, "Please describe your issue in at least 30 characters")
      .max(2000, "Description must be under 2000 characters"),
    urgency: z.enum(["low", "medium", "high", "urgent"]),

    // S21-specific
    s21NoticeServedDate: z.string().optional(),
    s21NoticeExpiryDate: z.string().optional(),
    s21ProceedingsIssued: z.boolean().optional(),
    s21CourtDate: z.string().optional(),
    s21PrescribedInfo: z.array(z.string()).optional(),

    // Eviction-specific
    evictionType: z.string().optional(),
    evictionDate: z.string().optional(),
    currentlyInProperty: z.boolean().optional(),
    policeContacted: z.boolean().optional(),

    // Rent increase-specific
    section13NoticeDate: z.string().optional(),
    currentRent: z.coerce.number().positive().optional(),
    proposedRent: z.coerce.number().positive().optional(),
    rentFrequency: z.enum(["weekly", "monthly"]).optional(),
    tenancyStartDate: z.string().optional(),
    isInitialRent: z.boolean().optional(),

    // Disrepair-specific
    defectTypes: z.array(z.string()).optional(),
    defectFirstReportedDate: z.string().optional(),
    reportedToLandlord: z.boolean().optional(),
    healthImpact: z.boolean().optional(),
    healthDetails: z.string().max(500).optional(),

    // Discrimination-specific
    discriminationType: z.array(z.string()).optional(),
    discriminationDate: z.string().optional(),
    discriminationEvidence: z.boolean().optional(),
    discriminationEvidenceDescription: z.string().max(500).optional(),

    // Pet-specific
    petType: z.string().optional(),
    petRequestDate: z.string().optional(),
    petResponseDate: z.string().optional(),
    petLandlordResponse: z.string().optional(),

    // Deposit-specific
    depositIssueType: z.string().optional(),
    depositAmountPaid: z.coerce.number().positive().optional(),
    monthlyRent: z.coerce.number().positive().optional(),
    advanceMonthsRequested: z.coerce.number().positive().optional(),

    // Bidding-specific
    advertisedRent: z.coerce.number().positive().optional(),
    askedRent: z.coerce.number().positive().optional(),
    biddingByWhom: z.string().optional(),
    biddingEvidence: z.boolean().optional(),

    // Written terms-specific
    writtenTermsReceived: z.boolean().optional(),
    writtenTermsReceivedDate: z.string().optional(),

    // Advisory-specific
    advisoryTopic: z.string().optional(),

    // Tenancy context
    tenancyType: z.string().optional(),
    landlordType: z.string().optional(),
    hasChildren: z.boolean().optional(),
    childrenAges: z.string().optional(),

    // Consent
    gdprConsent: z.literal(true, {
      message: "You must accept the privacy policy",
    }),
    sensitiveDataConsent: z.boolean().optional(),
    privacyPolicyVersion: z.string(),

    // Security
    captchaToken: z.string().min(1, "Please complete the verification"),
  })
  .refine(
    (data) => {
      if (data.issueType === "rra_discrimination" && !data.sensitiveDataConsent) {
        return false;
      }
      return true;
    },
    {
      message: "Consent for processing sensitive data is required for discrimination claims",
      path: ["sensitiveDataConsent"],
    }
  );

export type TenantIntakeValues = z.infer<typeof tenantIntakeSchema>;

// ============================================
// API RESPONSE
// ============================================

export interface TenantIntakeResponse {
  success: boolean;
  ref?: string;
  enquiryId?: string;
  triage?: {
    urgency: string;
    urgencyScore: number;
    strength: number;
    action: string;
    flags: string[];
  };
  duplicate?: boolean;
  message: string;
}
