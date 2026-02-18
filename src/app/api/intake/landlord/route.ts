import { NextRequest, NextResponse } from "next/server";

const FIREBASE_FUNCTIONS_URL =
  process.env.FIREBASE_FUNCTIONS_URL ||
  "https://europe-west2-stone-co-solicitor.cloudfunctions.net";

const USE_DEV_MOCK = process.env.NODE_ENV === "development" && !process.env.FIREBASE_FUNCTIONS_URL;

function generateRef() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "RRA-L-";
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

function mockScoring(body: Record<string, unknown>) {
  const compliance = body.compliance as Record<string, boolean | null> | undefined;
  let complianceTotal = 0;
  if (compliance) {
    const weights: Record<string, number> = {
      tenancyAgreementsUpdated: 20, gasSafetyValid: 15, electricalSafetyValid: 12,
      epcAboveE: 10, noPendingS21: 15, registeredWithAssociation: 5,
      petPolicyInPlace: 8, antiDiscriminationCompliant: 10, readyForPrsDatabase: 5,
    };
    for (const [key, weight] of Object.entries(weights)) {
      if (compliance[key] === true) complianceTotal += weight;
    }
  }
  const riskLevel = complianceTotal >= 70 ? "green" : complianceTotal >= 40 ? "amber" : "red";
  const services = (body.servicesRequested as string[]) || [];
  const revenueEstimate = services.length * 750;
  const urgencyMap: Record<string, number> = { asap: 90, within_1_month: 60, before_may: 40, no_rush: 20 };
  const urgencyNorm = urgencyMap[body.urgencyLevel as string] ?? 40;
  const riskNorm = 100 - complianceTotal;
  const lexisScore = Math.round(revenueEstimate * 0.004 + urgencyNorm * 0.4 + riskNorm * 0.2);
  const priority = lexisScore >= 70 ? "P1" : lexisScore >= 50 ? "P2" : lexisScore >= 30 ? "P3" : "P4";

  return {
    compliance: { total: complianceTotal, riskLevel },
    lexis: { score: lexisScore, priority, revenueEstimate, brand: "stone-co" },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Development mock
    if (USE_DEV_MOCK) {
      console.log("[DEV MOCK] Landlord intake payload:", JSON.stringify(body, null, 2));
      const ref = generateRef();
      const scoring = mockScoring(body);
      return NextResponse.json({
        success: true,
        ref,
        enquiryId: `mock-${Date.now()}`,
        scoring,
        duplicate: false,
        message: `Your enquiry has been submitted. Reference: ${ref}. A member of our team will be in touch to discuss your compliance needs.`,
      });
    }

    // Forward to Firebase Cloud Function (publicIntakeLandlordV1)
    const response = await fetch(
      `${FIREBASE_FUNCTIONS_URL}/publicIntakeLandlordV1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key":
            request.headers.get("x-idempotency-key") || "",
        },
        body: JSON.stringify({ data: body }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      const errorMessage =
        result?.error?.message || "Failed to submit enquiry";
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: response.status }
      );
    }

    return NextResponse.json(result.result || result);
  } catch (error) {
    console.error("Landlord intake API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again or call us directly.",
      },
      { status: 500 }
    );
  }
}
