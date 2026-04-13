"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  ExternalLink,
  Loader2,
  Mail,
  Phone,
  RotateCcw,
  Shield,
  AlertTriangle,
  FileText,
  MapPin,
  PoundSterling,
  Info,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Section, Button } from "@/components/ui";
import type { RroFormData, RroRegime, RroResult } from "@/lib/rro/types";
import {
  REGIME_LABELS,
  APPLICATION_FEE,
  HEARING_FEE,
  getTribunalOffice,
} from "@/lib/rro/constants";

// ============================================
// HELPERS
// ============================================

function loadFormData(): RroFormData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("rro-checker-form");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function RegimeBadge({ regime }: { regime: RroRegime }) {
  const config = REGIME_LABELS[regime];
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-100 text-green-800 border-green-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border",
        colorMap[config.color] || colorMap.blue
      )}
    >
      <Shield className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

// ============================================
// MAIN RESULTS PAGE
// ============================================

export default function RroResultsPage() {
  const router = useRouter();
  const [formData, setFormData] = React.useState<RroFormData | null>(null);
  const [result, setResult] = React.useState<RroResult | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const data = loadFormData();
    if (!data || !data.offenceType) {
      router.replace("/tools/rro-checker");
      return;
    }
    setFormData(data);

    async function generateResult() {
      try {
        const res = await fetch("/api/tools/generate-rro", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(
            (err as { error?: string }).error || `Server error (${res.status})`
          );
        }

        const json = await res.json();
        setResult(json as RroResult);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Failed to generate results. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    generateResult();
  }, [router]);

  const handleStartNew = () => {
    sessionStorage.removeItem("rro-checker-form");
    sessionStorage.removeItem("rro-checker-regime");
    router.push("/tools/rro-checker");
  };

  // Loading state
  if (loading) {
    return (
      <Section variant="default" padding="lg">
        <div className="max-w-2xl mx-auto text-center py-20">
          <Loader2 className="w-12 h-12 text-gold-600 animate-spin mx-auto mb-6" />
          <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-3">
            Generating your application pack
          </h2>
          <p className="text-neutral-600">
            Calculating your claim, identifying the correct tribunal, and
            preparing your email draft...
          </p>
        </div>
      </Section>
    );
  }

  // Error state
  if (error || !result) {
    return (
      <Section variant="default" padding="lg">
        <div className="max-w-2xl mx-auto text-center py-20">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-6" />
          <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-3">
            Something went wrong
          </h2>
          <p className="text-neutral-600 mb-6">
            {error || "We could not generate your results. Please try again."}
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={handleStartNew}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Start over
            </Button>
            <Button onClick={() => window.location.reload()}>
              Try again
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  const { calculation, tribunal, emailDraft } = result;
  const isRra = calculation.regime === "rra_2025";

  return (
    <Section variant="default" padding="lg" topEffect="fade">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-2">
            Your RRO Assessment
          </h1>
          <p className="text-neutral-600">
            Based on the information you provided
          </p>
        </div>

        {/* Maximum potential claim */}
        <div className="p-8 bg-gold-50 rounded-xl border border-gold-200 text-center">
          <p className="text-sm text-gold-700 mb-2 uppercase tracking-wide font-medium">
            Maximum potential claim
          </p>
          <p className="text-5xl font-display font-bold text-gold-800 mb-3">
            &pound;{calculation.awardRangeHigh.toLocaleString()}
          </p>
          {calculation.awardEstimated && (
            <p className="text-sm text-gold-600 mb-3">
              Estimated range: &pound;
              {calculation.awardRangeLow.toLocaleString()} &ndash; &pound;
              {calculation.awardRangeHigh.toLocaleString()}
            </p>
          )}
          <RegimeBadge regime={calculation.regime} />
          {calculation.mandatoryMaximum && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg inline-block">
              <p className="text-sm text-green-800 font-medium">
                {calculation.mandatoryMaximumReason ||
                  "Mandatory maximum applies"}
              </p>
            </div>
          )}
          <div className="mt-4 text-sm text-neutral-600">
            <span>
              Claim period: {calculation.claimPeriodMonths} months &middot;
              Adjusted rent: &pound;
              {Math.round(calculation.adjustedRent).toLocaleString()}/month
            </span>
          </div>
        </div>

        {/* Tribunal office */}
        <div className="p-5 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display text-lg font-semibold text-neutral-900">
                Your Tribunal Office
              </h2>
              <p className="text-sm text-neutral-500">{tribunal.region} region</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-500 mb-1">Name</p>
              <p className="text-neutral-900 font-medium">{tribunal.name}</p>
            </div>
            <div>
              <p className="text-neutral-500 mb-1">Address</p>
              <p className="text-neutral-900">{tribunal.address}</p>
            </div>
            <div>
              <p className="text-neutral-500 mb-1">Email</p>
              <a
                href={`mailto:${tribunal.email}`}
                className="text-gold-600 hover:text-gold-700 font-medium"
              >
                {tribunal.email}
              </a>
            </div>
            <div>
              <p className="text-neutral-500 mb-1">Phone</p>
              <a
                href={`tel:${tribunal.phone.replace(/\s/g, "")}`}
                className="text-gold-600 hover:text-gold-700 font-medium"
              >
                {tribunal.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Email draft */}
        <div className="p-5 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-start gap-3 mb-4">
            <Mail className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-display text-lg font-semibold text-neutral-900">
                Draft Email to Tribunal
              </h2>
              <p className="text-sm text-neutral-500">
                Ready to send with your application
              </p>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg mb-4">
            <p className="text-xs text-neutral-500 mb-1">
              <strong>To:</strong> {emailDraft.to}
            </p>
            <p className="text-xs text-neutral-500 mb-3">
              <strong>Subject:</strong> {emailDraft.subject}
            </p>
            <pre className="text-sm text-neutral-800 whitespace-pre-wrap font-sans leading-relaxed">
              {emailDraft.body}
            </pre>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={emailDraft.gmailComposeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Gmail
            </a>
            <a
              href={emailDraft.mailtoUrl}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-neutral-300 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Open in email client
            </a>
          </div>
        </div>

        {/* Grounds argument */}
        {result.groundsArgument && (
          <div className="p-5 rounded-xl border border-neutral-200 bg-white">
            <div className="flex items-start gap-3 mb-3">
              <FileText className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
              <h2 className="font-display text-lg font-semibold text-neutral-900">
                Grounds for Application
              </h2>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">
              {result.groundsArgument}
            </p>
          </div>
        )}

        {/* Evidence strength */}
        {result.evidenceStrength && (
          <div className="p-5 rounded-xl border border-neutral-200 bg-white">
            <div className="flex items-start gap-3 mb-3">
              <Shield className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-lg font-semibold text-neutral-900">
                  Evidence Assessment
                </h2>
                <span
                  className={cn(
                    "inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    result.evidenceStrength === "strong" &&
                      "bg-green-100 text-green-800 border-green-200",
                    result.evidenceStrength === "moderate" &&
                      "bg-amber-100 text-amber-800 border-amber-200",
                    result.evidenceStrength === "needs_work" &&
                      "bg-red-100 text-red-800 border-red-200"
                  )}
                >
                  {result.evidenceStrength === "strong"
                    ? "Strong"
                    : result.evidenceStrength === "moderate"
                      ? "Moderate"
                      : "Needs work"}
                </span>
              </div>
            </div>
            {result.missingEvidence && result.missingEvidence.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-neutral-600 mb-2">
                  Consider gathering:
                </p>
                <ul className="space-y-1">
                  {result.missingEvidence.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-neutral-700 flex items-start gap-2"
                    >
                      <span className="text-amber-500 mt-1">&#8226;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* RRO1 form download */}
        {result.formDownloadUrl && (
          <div className="p-5 rounded-xl border border-neutral-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <Download className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-display text-lg font-semibold text-neutral-900">
                    RRO1 Application Form
                  </h2>
                  <p className="text-sm text-neutral-500">
                    {result.formSizeBytes
                      ? `${(result.formSizeBytes / 1024).toFixed(0)} KB`
                      : "PDF document"}
                  </p>
                </div>
              </div>
              <a
                href={result.formDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gold-600 text-white text-sm font-medium hover:bg-gold-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        )}

        {/* Submission checklist */}
        <div className="p-5 rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle2 className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
            <h2 className="font-display text-lg font-semibold text-neutral-900">
              Submission Checklist
            </h2>
          </div>

          <div className="space-y-2">
            {[
              "Signed RRO1 application form",
              "All supporting evidence (rent receipts, agreement, council letter)",
              `Application fee: \u00A3${APPLICATION_FEE}`,
              "Copy of this assessment for your records",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <div className="w-5 h-5 rounded border border-neutral-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-neutral-400">{i + 1}</span>
                </div>
                <span className="text-sm text-neutral-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA: Get legal help */}
        <div className="p-6 rounded-xl bg-neutral-950 text-white text-center">
          <h2 className="font-display text-2xl font-semibold mb-2">
            Want professional help with your claim?
          </h2>
          <p className="text-neutral-300 mb-6 max-w-lg mx-auto">
            Our specialist housing solicitors can handle your RRO application
            from start to finish, maximising your chances of a successful
            outcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="cta" size="lg" asChild>
              <Link href="/tenant-enquiry">
                Get Legal Help from Stone &amp; Co
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Start new */}
        <div className="text-center">
          <button
            type="button"
            onClick={handleStartNew}
            className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Start a new application
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-neutral-400 text-center leading-relaxed">
          This tool provides guidance only and does not constitute legal advice.
          The estimated claim is based on the information you provided and the
          maximum permissible under the applicable legislation. Actual awards are
          at the discretion of the tribunal. For advice on your specific
          situation, please contact Stone &amp; Co. Solicitors.
        </p>
      </div>
    </Section>
  );
}
