// ============================================
// RRO CHECKER — TYPE DEFINITIONS
// ============================================

export type RroOffenceType =
  | "violence_securing_entry"
  | "unlawful_eviction"
  | "harassment_with_intent"
  | "harassment_landlord"
  | "improvement_notice"
  | "prohibition_order"
  | "unlicensed_hmo"
  | "unlicensed_house"
  | "banning_order_breach"
  | "misused_possession_ground"
  | "reletting_restriction"
  | "tenancy_reform_breach"
  | "repeat_tenancy_offender"
  | "redress_scheme_breach"
  | "prs_database_false_info"
  | "prs_database_breach";

export type RroRegime = "hpa_2016" | "rra_2025" | "transitional";

// ============================================
// WIZARD FORM DATA
// ============================================

export interface RroFormData {
  // Step 1: Offence
  offenceType?: RroOffenceType;
  offenceDate?: string;
  offenceEndDate?: string;
  offenceOngoing?: boolean;
  landlordConvicted?: boolean;
  convictionDate?: string;
  civilPenalty?: boolean;
  civilPenaltyDate?: string;
  priorRro?: boolean;

  // Step 1b: Offence-specific
  hmoOccupants?: number;
  hmoHouseholds?: number;
  licensingScheme?: "mandatory_hmo" | "additional_hmo" | "selective";
  licensingSchemeName?: string;
  possessionGroundUsed?: string;
  landlordRegistered?: boolean;
  harassmentActs?: string[];
  evictionMethod?: string;

  // Step 2: Property
  propertyAddress?: string;
  propertyPostcode?: string;
  laName?: string;
  propertyDescription?: string;
  isHmo?: boolean;

  // Step 3: Rent
  rentAmount?: number;
  rentFrequency?: "weekly" | "monthly";
  utilitiesIncluded?: boolean;
  utilitiesEstimate?: number;

  // Step 4: Applicant
  applicantName?: string;
  applicantAddress?: string;
  applicantPostcode?: string;
  applicantPhoneDay?: string;
  applicantPhoneEvening?: string;
  applicantPhoneMobile?: string;
  applicantEmail?: string;

  // Step 5: Respondent (landlord)
  respondentName?: string;
  respondentAddress?: string;
  respondentEmail?: string;
  respondentPhone?: string;
  superiorLandlordName?: string;
  superiorLandlordAddress?: string;

  // Step 6: Evidence
  hasRentReceipts?: boolean;
  hasTenancyAgreement?: boolean;
  hasCouncilConfirmation?: boolean;
  hasPoliceReport?: boolean;
  evidenceNotes?: string;
  noWrittenAgreement?: boolean;
  agreementStartDate?: string;
  agreementRentAmount?: string;
  agreementPaymentFrequency?: string;

  // Step 7: Tribunal preferences
  paperDetermination?: boolean;
  unavailableDates?: string;
  venueRequirements?: string;
  priorApplications?: string;
  otherAffectedParties?: string;
}

// ============================================
// CALCULATED RESULT
// ============================================

export interface RroCalculation {
  regime: RroRegime;
  maxClaimYears: 1 | 2;
  claimPeriodMonths: number;
  totalRentPaid: number;
  utilityDeduction: number;
  adjustedRent: number;
  awardRangeLow: number;
  awardRangeHigh: number;
  estimatedAwardLow?: number;
  estimatedAwardHigh?: number;
  mandatoryMaximum: boolean;
  mandatoryMaximumReason?: string;
  awardEstimated: boolean;
}

export interface TribunalOffice {
  region: string;
  name: string;
  address: string;
  email: string;
  phone: string;
}

export interface RroResult {
  sessionId: string;
  calculation: RroCalculation;
  tribunal: TribunalOffice;
  emailDraft: {
    to: string;
    subject: string;
    body: string;
    gmailComposeUrl: string;
    mailtoUrl: string;
  };
  groundsArgument: string;
  evidenceStrength?: "strong" | "moderate" | "needs_work";
  missingEvidence?: string[];
  formDownloadUrl?: string;
  formSizeBytes?: number;
}
