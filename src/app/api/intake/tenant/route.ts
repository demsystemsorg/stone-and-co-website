import { NextRequest, NextResponse } from "next/server";

const FIREBASE_FUNCTIONS_URL =
  process.env.FIREBASE_FUNCTIONS_URL ||
  "https://europe-west2-stone-co-solicitor.cloudfunctions.net";

const USE_DEV_MOCK = process.env.NODE_ENV === "development" && !process.env.FIREBASE_FUNCTIONS_URL;

function generateRef() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "RRA-T-";
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

function mockTriageScore(body: Record<string, unknown>) {
  const urgencyMap: Record<string, number> = { urgent: 9, high: 7, medium: 5, low: 3 };
  const urgencyScore = urgencyMap[body.urgency as string] ?? 5;
  const strengthScore = Math.min(10, 4 + (body.summary ? Math.min(4, String(body.summary).length / 200) : 0));
  const action =
    urgencyScore >= 8 ? "immediate_call" : urgencyScore >= 6 ? "priority_review" : "standard_review";
  return {
    urgency: body.urgency as string,
    urgencyScore,
    strength: Math.round(strengthScore * 10) / 10,
    action,
    flags: [
      ...(body.hasChildren ? ["children_in_household"] : []),
      ...(body.issueType === "rra_s21_defence" ? ["s21_notice"] : []),
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Development mock — returns realistic response without hitting Cloud Functions
    if (USE_DEV_MOCK) {
      console.log("[DEV MOCK] Tenant intake payload:", JSON.stringify(body, null, 2));
      const ref = generateRef();
      const triage = mockTriageScore(body);
      return NextResponse.json({
        success: true,
        ref,
        enquiryId: `mock-${Date.now()}`,
        triage,
        duplicate: false,
        message: `Your enquiry has been submitted. Reference: ${ref}. We will contact you within ${triage.action === "immediate_call" ? "2 hours" : triage.action === "priority_review" ? "4 hours" : "2 working days"}.`,
      });
    }

    // Forward to Firebase Cloud Function (publicIntakeTenantV1)
    const response = await fetch(
      `${FIREBASE_FUNCTIONS_URL}/publicIntakeTenantV1`,
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

    // Cloud Functions callable returns { result: ... }
    return NextResponse.json(result.result || result);
  } catch (error) {
    console.error("Tenant intake API error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again or call us directly.",
      },
      { status: 500 }
    );
  }
}
