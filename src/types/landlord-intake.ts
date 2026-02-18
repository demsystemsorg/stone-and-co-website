import { z } from "zod";

// ============================================
// LANDLORD SERVICE TYPES
// ============================================

export const LANDLORD_SERVICE_TYPES = [
  "compliance_audit",
  "tenancy_agreement_review",
  "tenancy_agreement_drafting",
  "section21_advice",
  "section8_advice",
  "eviction_proceedings",
  "dispute_resolution",
  "rent_recovery",
  "hmo_licensing",
  "prs_database_registration",
  "epc_remediation_advice",
  "portfolio_compliance_retainer",
  "written_statement_of_terms",
] as const;

export type ServiceType = (typeof LANDLORD_SERVICE_TYPES)[number];

export const SERVICE_LABELS: Record<ServiceType, string> = {
  compliance_audit: "Portfolio Compliance Audit",
  tenancy_agreement_review: "Tenancy Agreement Review",
  tenancy_agreement_drafting: "Tenancy Agreement Overhaul",
  section21_advice: "Section 21 Transition Advice",
  section8_advice: "Section 8 Advice",
  eviction_proceedings: "Eviction Proceedings Support",
  dispute_resolution: "Dispute Resolution",
  rent_recovery: "Rent Recovery",
  hmo_licensing: "HMO Licensing",
  prs_database_registration: "PRS Database Registration",
  epc_remediation_advice: "EPC Remediation Advice",
  portfolio_compliance_retainer: "Portfolio Compliance Retainer",
  written_statement_of_terms: "Written Statement of Terms",
};

// ============================================
// VALIDATION SCHEMA
// ============================================

const ukPhoneRegex = /^(\+44|0)[\d\s\-()]{9,13}$/;

export const landlordIntakeSchema = z.object({
  // Step 1: About You
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(ukPhoneRegex, "Please enter a valid UK phone number"),
  preferredContact: z.enum(["phone", "email", "either"]),
  referralSource: z.enum([
    "nrla",
    "letting_agent",
    "google",
    "referral",
    "property118",
    "linkedin",
    "event",
    "other",
  ]),
  referralDetail: z.string().optional(),

  // Step 2: Your Business
  entityType: z.enum(["individual", "partnership", "limited_company", "overseas"]),
  companyName: z.string().optional(),
  companyNumber: z.string().optional(),
  countryOfResidence: z.string().min(1, "Country is required"),
  languagePreference: z.enum(["en", "it"]).default("en"),

  // Step 3: Your Portfolio
  propertyCount: z.enum(["1", "2-5", "6-10", "11-50", "50+"]),
  propertyTypes: z.array(z.string()).min(1, "Select at least one property type"),
  regions: z.array(z.string()).min(1, "Select at least one region"),
  usesLettingAgent: z.enum(["yes_all", "yes_some", "no"]),
  agentNames: z.array(z.string()).optional(),

  // Step 4: Current Situation
  activeASTs: z.coerce.number().min(0).default(0),
  periodicTenancies: z.enum(["yes", "no", "unsure"]),
  pendingS21Notices: z.boolean(),
  currentDisputes: z.boolean(),
  currentTribunal: z.boolean().optional(),
  lastAgreementUpdate: z.enum([
    "within_1_year",
    "1_3_years",
    "3_plus_years",
    "never",
    "dont_know",
  ]),
  gasSafetyCurrent: z.enum(["yes", "no", "unsure"]),
  electricalSafetyValid: z.enum(["yes", "no", "unsure"]),
  epcBelowE: z.enum(["yes", "no", "unsure"]),

  // Step 5: Services Needed
  servicesRequested: z
    .array(z.enum(LANDLORD_SERVICE_TYPES))
    .min(1, "Select at least one service"),

  // Step 6: Compliance Health Check
  compliance: z.object({
    tenancyAgreementsUpdated: z.boolean().nullable(),
    gasSafetyValid: z.boolean().nullable(),
    electricalSafetyValid: z.boolean().nullable(),
    epcAboveE: z.boolean().nullable(),
    noPendingS21: z.boolean().nullable(),
    registeredWithAssociation: z.boolean().nullable(),
    petPolicyInPlace: z.boolean().nullable(),
    antiDiscriminationCompliant: z.boolean().nullable(),
    readyForPrsDatabase: z.boolean().nullable(),
  }),

  // Step 7: Timeline & Budget
  urgencyLevel: z.enum(["asap", "within_1_month", "before_may", "no_rush"]),
  planningSale: z.boolean(),
  planningFamilyOccupation: z.boolean().optional(),
  budgetRange: z.enum([
    "under_500",
    "500_2000",
    "2000_5000",
    "5000_plus",
    "depends",
  ]),
  additionalComments: z.string().max(1000).optional(),

  // Consent
  gdprConsent: z.literal(true, {
    message: "You must accept the privacy policy",
  }),
  marketingConsent: z.boolean().optional(),

  // Security
  captchaToken: z.string().min(1, "Please complete the verification"),
});

export type LandlordIntakeValues = z.infer<typeof landlordIntakeSchema>;

// ============================================
// API RESPONSE
// ============================================

export interface LandlordIntakeResponse {
  success: boolean;
  ref?: string;
  enquiryId?: string;
  scoring?: {
    compliance: { total: number; riskLevel: string };
    lexis: {
      score: number;
      priority: string;
      revenueEstimate: number;
      brand: string;
    };
  };
  duplicate?: boolean;
  message: string;
}
