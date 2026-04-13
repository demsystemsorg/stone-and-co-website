import { NextRequest, NextResponse } from "next/server";

const FIREBASE_FUNCTIONS_URL =
  process.env.FIREBASE_FUNCTIONS_URL ||
  "https://europe-west2-stone-co-solicitor.cloudfunctions.net";

const USE_DEV_MOCK =
  process.env.NODE_ENV === "development" && !process.env.FIREBASE_FUNCTIONS_URL;

function generateSessionId() {
  return `rro-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (USE_DEV_MOCK) {
      console.log(
        "[DEV MOCK] generateRro:",
        JSON.stringify(body, null, 2)
      );
      await new Promise((r) => setTimeout(r, 2000));

      const monthlyRent =
        body.rentFrequency === "weekly" && body.rentAmount
          ? (body.rentAmount * 52) / 12
          : body.rentAmount || 0;
      const utilDeduction =
        body.utilitiesIncluded && body.utilitiesEstimate
          ? body.utilitiesEstimate
          : 0;
      const adjustedMonthly = monthlyRent - utilDeduction;

      const offenceDate = body.offenceDate || "";
      const isRra = offenceDate >= "2026-05-01";
      const maxYears = isRra ? 2 : 1;
      const maxClaim = Math.round(adjustedMonthly * maxYears * 12);

      const mandatory =
        body.landlordConvicted || body.civilPenalty || body.priorRro || false;

      const postcode = body.propertyPostcode || "E11 1AA";
      const prefix = postcode.replace(/\s/g, "").match(/^[A-Z]{1,2}/i)?.[0]?.toUpperCase() || "E";
      const londonPrefixes = ["E", "EC", "N", "NW", "SE", "SW", "W", "WC"];
      const tribunalEmail = londonPrefixes.includes(prefix)
        ? "RPSouthern@justice.gov.uk"
        : "RPNorthern@justice.gov.uk";

      return NextResponse.json({
        sessionId: generateSessionId(),
        calculation: {
          regime: isRra ? "rra_2025" : "hpa_2016",
          maxClaimYears: maxYears,
          claimPeriodMonths: maxYears * 12,
          totalRentPaid: Math.round(monthlyRent * maxYears * 12),
          utilityDeduction: utilDeduction * maxYears * 12,
          adjustedRent: adjustedMonthly,
          awardRangeLow: Math.round(maxClaim * 0.5),
          awardRangeHigh: maxClaim,
          mandatoryMaximum: mandatory,
          mandatoryMaximumReason: mandatory
            ? "The tribunal must order the maximum amount."
            : undefined,
          awardEstimated: true,
        },
        tribunal: {
          region: londonPrefixes.includes(prefix) ? "London" : "Northern",
          name: `First-tier Tribunal (Property Chamber) — ${londonPrefixes.includes(prefix) ? "London" : "Northern"}`,
          address: londonPrefixes.includes(prefix)
            ? "10 Alfred Place, London WC1E 7LR"
            : "1st Floor, Piccadilly Exchange, Manchester M1 4AH",
          email: tribunalEmail,
          phone: londonPrefixes.includes(prefix)
            ? "020 7446 7700"
            : "0161 237 9491",
        },
        emailDraft: {
          to: tribunalEmail,
          subject: `RRO Application — ${body.applicantName || "Applicant"} v ${body.respondentName || "Landlord"}`,
          body: `Dear Sir/Madam,\n\nPlease find enclosed my application for a Rent Repayment Order.\n\nApplicant: ${body.applicantName || ""}\nRespondent: ${body.respondentName || ""}\nProperty: ${body.propertyAddress || ""}\n\nI enclose the completed RRO1 form, supporting evidence, and the application fee.\n\nYours faithfully,\n${body.applicantName || ""}`,
          gmailComposeUrl: `https://mail.google.com/mail/?view=cm&to=${tribunalEmail}&su=${encodeURIComponent(`RRO Application — ${body.applicantName || ""}`)}`,
          mailtoUrl: `mailto:${tribunalEmail}?subject=${encodeURIComponent(`RRO Application — ${body.applicantName || ""}`)}`,
        },
        groundsArgument:
          "[Dev mock] The respondent has committed an offence under the Housing and Planning Act 2016. The applicant seeks a rent repayment order for the maximum period.",
        evidenceStrength: "moderate",
        missingEvidence: ["Council confirmation of licensing status"],
        formDownloadUrl: undefined,
        formSizeBytes: undefined,
      });
    }

    const response = await fetch(`${FIREBASE_FUNCTIONS_URL}/generateRro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: body }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "RRO generation failed" },
        { status: response.status }
      );
    }

    return NextResponse.json(data.result ?? data);
  } catch (error) {
    console.error("Generate RRO error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
