import { NextRequest, NextResponse } from "next/server";

const FIREBASE_FUNCTIONS_URL =
  process.env.FIREBASE_FUNCTIONS_URL ||
  "https://europe-west2-stone-co-solicitor.cloudfunctions.net";

const USE_DEV_MOCK =
  process.env.NODE_ENV === "development" && !process.env.FIREBASE_FUNCTIONS_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (USE_DEV_MOCK) {
      console.log("[DEV MOCK] calculateRent:", JSON.stringify(body, null, 2));
      await new Promise((r) => setTimeout(r, 1200));

      // Mock calculation using adjustment factors
      const conditionFactors: Record<string, number> = {
        excellent: 1.05, good: 1.0, fair: 0.97, poor: 0.9, very_poor: 0.85,
      };
      const furnishedFactors: Record<string, number> = {
        furnished: 1.08, part_furnished: 1.03, unfurnished: 1.0,
      };
      const epcFactors: Record<string, number> = {
        A: 1.03, B: 1.03, C: 1.0, D: 0.98, E: 0.95, F: 0.9, G: 0.9,
      };

      const baseMedian = 1450; // London-ish fallback
      const condFactor = conditionFactors[body.condition] ?? 1.0;
      const furnFactor = furnishedFactors[body.furnished] ?? 1.0;
      const epcFactor = body.epcRating ? (epcFactors[body.epcRating] ?? 1.0) : 1.0;
      const totalFactor = condFactor * furnFactor * epcFactor;
      const adjustedMedian = Math.round(baseMedian * totalFactor);
      const proposed = body.proposedRentPcm ?? 0;
      const diffPct = adjustedMedian > 0 ? ((proposed - adjustedMedian) / adjustedMedian) * 100 : 0;

      let verdict = "in_line";
      if (diffPct > 30) verdict = "significantly_above";
      else if (diffPct > 15) verdict = "above_market";
      else if (diffPct > 5) verdict = "slightly_above";
      else if (diffPct < -15) verdict = "well_below_market";
      else if (diffPct < -5) verdict = "below_market";

      return NextResponse.json({
        sessionId: `mock-${Date.now()}`,
        estimatedMarketRent: {
          median: adjustedMedian,
          lowerBound: Math.round(adjustedMedian * 0.8),
          upperBound: Math.round(adjustedMedian * 1.25),
          confidence: "medium",
        },
        comparison: {
          proposedRent: proposed,
          marketMedian: adjustedMedian,
          differencePct: Math.round(diffPct * 10) / 10,
          isAboveMarket: diffPct > 5,
          annualOverpayment: diffPct > 5 ? Math.round((proposed - adjustedMedian) * 12) : null,
          verdict,
        },
        adjustments: {
          conditionFactor: condFactor,
          furnishedFactor: furnFactor,
          epcFactor,
          totalFactor,
        },
        areaData: {
          localAuthority: body.laName ?? "Mock LA",
          gssCode: body.gssCode ?? "",
          region: body.region ?? "London",
          medianRentPcm: adjustedMedian,
          lowerQuartile: Math.round(adjustedMedian * 0.8),
          upperQuartile: Math.round(adjustedMedian * 1.25),
          annualChangePct: 5.2,
          dataPeriod: "October 2025 — March 2026",
        },
        lhaReference: { brma: "Inner East London", lhaRate: 1349, isNearLha: false },
        epcData: body.epcRating ? { rating: body.epcRating, score: null, available: true } : null,
        headline: `Your proposed rent is ${Math.abs(Math.round(diffPct))}% ${diffPct > 0 ? "above" : "below"} the estimated market rate for ${body.laName ?? "your area"}.`,
        dataSources: ["ONS PIPR (dev mock)", "VOA Council Tax"],
        computedAt: new Date().toISOString(),
      });
    }

    const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/calculateRent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: body }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Calculation failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data.result ?? data);
  } catch (error) {
    console.error("Calculate rent error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
