// ============================================
// CALCULATOR INPUT TYPES
// ============================================

export type PropertyType = "flat" | "terraced" | "semi" | "detached";
export type FurnishedStatus = "furnished" | "part_furnished" | "unfurnished";
export type Condition = "excellent" | "good" | "fair" | "poor" | "very_poor";
export type EpcRating = "A" | "B" | "C" | "D" | "E" | "F" | "G";
export type Confidence = "high" | "medium" | "low";

export type Verdict =
  | "well_below_market"
  | "below_market"
  | "in_line"
  | "slightly_above"
  | "above_market"
  | "significantly_above";

// ============================================
// FORM DATA (wizard state)
// ============================================

export interface CalculatorFormData {
  // Step 1: Postcode
  postcode: string;
  gssCode: string;
  laName: string;
  region: string;

  // Step 2: Property
  propertyType: PropertyType;
  bedrooms: number;
  furnished: FurnishedStatus;

  // Step 3: Rent
  currentRentPcm: number;
  proposedRentPcm: number;

  // Step 4: Condition & EPC
  condition: Condition;
  epcRating: EpcRating | null;
}

// ============================================
// CALCULATOR RESULT (returned by Cloud Function)
// ============================================

export interface CalculatorResult {
  sessionId: string;

  estimatedMarketRent: {
    median: number;
    lowerBound: number;
    upperBound: number;
    confidence: Confidence;
  };

  comparison: {
    proposedRent: number;
    marketMedian: number;
    differencePct: number;
    isAboveMarket: boolean;
    annualOverpayment: number | null;
    verdict: Verdict;
  };

  adjustments: {
    conditionFactor: number;
    furnishedFactor: number;
    epcFactor: number;
    totalFactor: number;
  };

  areaData: {
    localAuthority: string;
    gssCode: string;
    region: string;
    medianRentPcm: number;
    lowerQuartile: number;
    upperQuartile: number;
    annualChangePct: number;
    dataPeriod: string;
  };

  lhaReference: {
    brma: string;
    lhaRate: number;
    isNearLha: boolean;
  };

  epcData: {
    rating: string | null;
    score: number | null;
    available: boolean;
  } | null;

  headline: string;
  dataSources: string[];
  computedAt: string;
}

// ============================================
// LEAD CAPTURE
// ============================================

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  landlordName: string;
  s13NoticeDate: string;
  increaseEffectiveDate: string;
  tenancyStartDate: string;
  dataProcessingConsent: boolean;
  marketingConsent: boolean;
}

// ============================================
// POSTCODE LOOKUP
// ============================================

export interface PostcodeLookupResult {
  display: string;
  gssCode: string;
  laName: string;
  region: string;
  lat: number;
  lng: number;
}
