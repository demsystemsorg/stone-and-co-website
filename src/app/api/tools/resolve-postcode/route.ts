import { NextRequest, NextResponse } from "next/server";

/**
 * Postcode resolution — uses postcodes.io directly (free public API).
 * No Cloud Function needed for this one.
 */
export async function POST(request: NextRequest) {
  try {
    const { postcode } = await request.json();

    if (!postcode || typeof postcode !== "string") {
      return NextResponse.json(
        { error: "Postcode is required" },
        { status: 400 }
      );
    }

    const normalized = postcode.replace(/\s+/g, "").toUpperCase();
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}`
    );
    const data = await res.json();

    if (data.status !== 200 || !data.result) {
      return NextResponse.json(
        { error: "Postcode not found" },
        { status: 404 }
      );
    }

    const result = data.result;

    if (result.country !== "England") {
      return NextResponse.json(
        { error: "This tool is for England only." },
        { status: 400 }
      );
    }

    const formatted =
      normalized.slice(0, -3) + " " + normalized.slice(-3);

    return NextResponse.json({
      display: formatted,
      gssCode: result.codes?.admin_district || "",
      laName: result.admin_district || "",
      region: result.region || "",
      lat: result.latitude,
      lng: result.longitude,
    });
  } catch (error) {
    console.error("Postcode resolution error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
