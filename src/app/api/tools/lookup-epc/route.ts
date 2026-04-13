import { NextRequest, NextResponse } from "next/server";

const FIREBASE_FUNCTIONS_URL =
  process.env.FIREBASE_FUNCTIONS_URL ||
  "https://europe-west2-stone-co-solicitor.cloudfunctions.net";

const USE_DEV_MOCK =
  process.env.NODE_ENV === "development" && !process.env.FIREBASE_FUNCTIONS_URL;

export async function POST(request: NextRequest) {
  try {
    const { postcode } = await request.json();

    if (!postcode) {
      return NextResponse.json(
        { error: "Postcode is required" },
        { status: 400 }
      );
    }

    if (USE_DEV_MOCK) {
      console.log("[DEV MOCK] lookupEpc:", postcode);
      await new Promise((r) => setTimeout(r, 500));
      return NextResponse.json({
        results: [
          {
            address: "Mock Property, " + postcode,
            epcRating: "C",
            epcScore: 72,
            inspectionDate: "2024-06-15",
            propertyType: "Flat",
            builtForm: "Mid-Terrace",
            floorArea: "55",
          },
        ],
        total: 1,
      });
    }

    const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/lookupEpc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: { postcode } }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "EPC lookup failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data.result ?? data);
  } catch (error) {
    console.error("EPC lookup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
