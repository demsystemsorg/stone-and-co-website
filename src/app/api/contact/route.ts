import { NextRequest, NextResponse } from "next/server";

/**
 * Contact form API route — scaffold only.
 *
 * Follows the same pattern as /api/intake/tenant and /api/intake/landlord:
 * - Validates payload server-side
 * - Forwards to Firebase Cloud Function `publicContactV1`
 * - Returns structured response
 *
 * NOT WIRED UP YET — the contact form still uses its simulated submission.
 * Wire this up once the `publicContactV1` Cloud Function is deployed.
 */

const FIREBASE_FUNCTIONS_URL =
  process.env.FIREBASE_FUNCTIONS_URL ||
  "https://europe-west2-stone-co-solicitor.cloudfunctions.net";

const USE_DEV_MOCK =
  process.env.NODE_ENV === "development" && !process.env.FIREBASE_FUNCTIONS_URL;

function generateRef() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "CNT-";
  for (let i = 0; i < 6; i++)
    ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Development mock
    if (USE_DEV_MOCK) {
      console.log(
        "[DEV MOCK] Contact form payload:",
        JSON.stringify(body, null, 2)
      );
      await new Promise((r) => setTimeout(r, 800));
      return NextResponse.json({
        success: true,
        referenceNumber: generateRef(),
        message:
          "Thank you for your message. We will get back to you within 24 hours.",
      });
    }

    // Forward to Firebase Cloud Function
    const idempotencyKey = request.headers.get("x-idempotency-key") || generateRef();

    const response = await fetch(
      `${FIREBASE_FUNCTIONS_URL}/publicContactV1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-idempotency-key": idempotencyKey,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.error || "Failed to submit contact form",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
