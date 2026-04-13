"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertTriangle,
  Clock,
  Shield,
  Info,
  Search,
  Loader2,
  FileText,
  User,
  Home,
  PoundSterling,
  Scale,
  Send,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Section, Container, Button } from "@/components/ui";
import type { RroFormData, RroRegime, RroOffenceType } from "@/lib/rro/types";
import {
  OFFENCE_OPTIONS,
  STEP_LABELS,
  TOTAL_STEPS,
  REGIME_LABELS,
  HARASSMENT_ACTS,
  POSSESSION_GROUNDS,
  RRA_COMMENCEMENT,
  HPA_COMMENCEMENT,
  APPLICATION_FEE,
  HEARING_FEE,
  addYearsUTC,
  daysBetweenUTC,
  getEarliestQualifyingDate,
} from "@/lib/rro/constants";

// ============================================
// SESSION STORAGE HELPERS
// ============================================

const STORAGE_KEY = "rro-checker-form";

function loadFormData(): RroFormData {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveFormData(data: RroFormData) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage full or unavailable
  }
}

// ============================================
// REGIME DETERMINATION
// ============================================

function determineRegime(
  offenceType: RroOffenceType | undefined,
  offenceDate: string | undefined,
  offenceEndDate: string | undefined,
  offenceOngoing: boolean | undefined
): RroRegime | null {
  if (!offenceType || !offenceDate) return null;

  const offence = OFFENCE_OPTIONS.find((o) => o.id === offenceType);
  if (!offence) return null;

  // RRA-only offences are always rra_2025
  if (offence.available === "rra_commencement") return "rra_2025";

  const effectiveEnd = offenceOngoing
    ? new Date().toISOString().slice(0, 10)
    : offenceEndDate || offenceDate;

  // If the offence entirely predates RRA commencement → HPA
  if (effectiveEnd < RRA_COMMENCEMENT) return "hpa_2016";

  // If the offence starts on or after RRA commencement → RRA
  if (offenceDate >= RRA_COMMENCEMENT) return "rra_2025";

  // Spans both → transitional
  return "transitional";
}

// ============================================
// STEP INDICATOR
// ============================================

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="mb-8">
      {/* Mobile: text only */}
      <div className="flex items-center justify-between mb-3 sm:hidden">
        <span className="text-sm font-medium text-neutral-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-neutral-500">
          {STEP_LABELS[currentStep - 1]}
        </span>
      </div>

      {/* Desktop: step circles */}
      <div className="hidden sm:flex items-center justify-between mb-3">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                  isCompleted && "bg-gold-600 text-white",
                  isActive && "bg-gold-600 text-white ring-2 ring-gold-300",
                  !isCompleted &&
                    !isActive &&
                    "bg-neutral-200 text-neutral-500"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-xs mt-1.5 text-center",
                  isActive ? "text-gold-700 font-medium" : "text-neutral-500"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gold-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ============================================
// REGIME BADGE
// ============================================

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
// TEMPORAL FORK
// ============================================

function TemporalFork({
  offenceType,
  offenceDate,
  offenceOngoing,
  offenceEndDate,
  regime,
}: {
  offenceType: RroOffenceType;
  offenceDate: string;
  offenceOngoing?: boolean;
  offenceEndDate?: string;
  regime: RroRegime;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const effectiveEnd = offenceOngoing
    ? today
    : offenceEndDate || offenceDate;

  // Limitation deadline (1 year from end of offence)
  const limitationDate = addYearsUTC(effectiveEnd, 1);
  const daysToDeadline = daysBetweenUTC(today, limitationDate);

  // Is the offence too old?
  const earliestQualifying = getEarliestQualifyingDate(offenceType);
  const isBlocked = offenceDate < earliestQualifying;

  // Wait-or-file opportunity: if filing after 1 May 2026 doubles the claim window
  const canWaitForRra =
    regime === "hpa_2016" &&
    today < RRA_COMMENCEMENT &&
    limitationDate >= RRA_COMMENCEMENT;

  return (
    <div className="space-y-3 mt-4">
      {/* Blocked */}
      {isBlocked && (
        <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">
              Offence predates qualifying date
            </p>
            <p className="text-sm text-red-700 mt-1">
              This offence type requires a date on or after{" "}
              {new Date(earliestQualifying + "T00:00:00Z").toLocaleDateString(
                "en-GB",
                { day: "numeric", month: "long", year: "numeric" }
              )}
              . An application is unlikely to succeed.
            </p>
          </div>
        </div>
      )}

      {/* Limitation countdown */}
      {!isBlocked && (
        <div
          className={cn(
            "flex gap-3 p-4 rounded-lg border",
            daysToDeadline <= 30
              ? "bg-red-50 border-red-200"
              : daysToDeadline <= 90
                ? "bg-amber-50 border-amber-200"
                : "bg-green-50 border-green-200"
          )}
        >
          <Clock
            className={cn(
              "w-5 h-5 flex-shrink-0 mt-0.5",
              daysToDeadline <= 30
                ? "text-red-600"
                : daysToDeadline <= 90
                  ? "text-amber-600"
                  : "text-green-600"
            )}
          />
          <div>
            <p
              className={cn(
                "text-sm font-semibold",
                daysToDeadline <= 30
                  ? "text-red-800"
                  : daysToDeadline <= 90
                    ? "text-amber-800"
                    : "text-green-800"
              )}
            >
              {daysToDeadline <= 0
                ? "Limitation period has passed"
                : `${daysToDeadline} days until limitation deadline`}
            </p>
            <p
              className={cn(
                "text-sm mt-1",
                daysToDeadline <= 30
                  ? "text-red-700"
                  : daysToDeadline <= 90
                    ? "text-amber-700"
                    : "text-green-700"
              )}
            >
              Application must be filed by{" "}
              {new Date(limitationDate + "T00:00:00Z").toLocaleDateString(
                "en-GB",
                { day: "numeric", month: "long", year: "numeric" }
              )}
            </p>
          </div>
        </div>
      )}

      {/* Wait-or-file opportunity */}
      {canWaitForRra && !isBlocked && (
        <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">
              Strategic opportunity
            </p>
            <p className="text-sm text-blue-700 mt-1">
              If you wait to file after 1 May 2026, the Renters&apos; Rights Act
              doubles the maximum claim period from 12 to 24 months. Your
              limitation deadline allows this.
            </p>
          </div>
        </div>
      )}

      {/* Transitional notice */}
      {regime === "transitional" && !isBlocked && (
        <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Transitional case
            </p>
            <p className="text-sm text-amber-700 mt-1">
              This offence spans the transition to the Renters&apos; Rights Act.
              A split calculation may apply &mdash; 12 months for the HPA period
              and 24 months for the RRA period.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP 1: OFFENCE SELECTOR
// ============================================

function OffenceSelector({
  data,
  onChange,
}: {
  data: RroFormData;
  onChange: (updates: Partial<RroFormData>) => void;
}) {
  const [expanded, setExpanded] = React.useState<RroOffenceType | null>(
    data.offenceType || null
  );

  const today = new Date().toISOString().slice(0, 10);
  const rraCommenced = today >= RRA_COMMENCEMENT;

  // Group offences by category
  const categories = React.useMemo(() => {
    const map = new Map<
      string,
      { label: string; offences: typeof OFFENCE_OPTIONS }
    >();
    for (const o of OFFENCE_OPTIONS) {
      if (!map.has(o.category)) {
        map.set(o.category, { label: o.categoryLabel, offences: [] });
      }
      map.get(o.category)!.offences.push(o);
    }
    return Array.from(map.entries());
  }, []);

  const regime = determineRegime(
    data.offenceType,
    data.offenceDate,
    data.offenceEndDate,
    data.offenceOngoing
  );

  const isBlocked = React.useMemo(() => {
    if (!data.offenceType || !data.offenceDate) return false;
    const earliest = getEarliestQualifyingDate(data.offenceType);
    return data.offenceDate < earliest;
  }, [data.offenceType, data.offenceDate]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-2">
          What did your landlord do?
        </h2>
        <p className="text-neutral-600">
          Select the offence that best describes your situation.
        </p>
      </div>

      {/* Offence categories */}
      <div className="space-y-6">
        {categories.map(([catId, cat]) => {
          const hasRraOnly = cat.offences.some(
            (o) => o.available === "rra_commencement"
          );
          return (
            <div key={catId}>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide">
                  {cat.label}
                </h3>
                {hasRraOnly && !rraCommenced && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                    From May 2026
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {cat.offences.map((offence) => {
                  const isDisabled =
                    offence.available === "rra_commencement" && !rraCommenced;
                  const isSelected = data.offenceType === offence.id;

                  return (
                    <button
                      key={offence.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => {
                        if (isSelected) {
                          setExpanded(null);
                          onChange({ offenceType: undefined });
                        } else {
                          setExpanded(offence.id);
                          onChange({
                            offenceType: offence.id,
                            // Reset offence-specific fields
                            harassmentActs: undefined,
                            hmoOccupants: undefined,
                            hmoHouseholds: undefined,
                            possessionGroundUsed: undefined,
                            landlordRegistered: undefined,
                          });
                        }
                      }}
                      className={cn(
                        "w-full text-left p-4 rounded-lg border transition-all",
                        isDisabled &&
                          "opacity-50 cursor-not-allowed bg-neutral-50",
                        isSelected &&
                          "border-gold-500 bg-gold-50 ring-1 ring-gold-500",
                        !isSelected &&
                          !isDisabled &&
                          "border-neutral-200 hover:border-neutral-300 bg-white"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-neutral-900">
                            {offence.label}
                          </p>
                          <p className="text-sm text-neutral-600 mt-0.5">
                            {offence.shortDescription}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" />
                        )}
                        {isDisabled && (
                          <span className="text-xs px-2 py-0.5 rounded bg-neutral-200 text-neutral-500 flex-shrink-0">
                            Not yet in force
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail view when offence selected */}
      {data.offenceType && expanded === data.offenceType && (
        <div className="p-5 bg-neutral-50 rounded-lg border border-neutral-200 space-y-5">
          <h3 className="font-display text-lg font-semibold text-neutral-900">
            Offence Details
          </h3>

          {/* Offence date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">
                When did the offence start?{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={data.offenceDate || ""}
                max={today}
                onChange={(e) => onChange({ offenceDate: e.target.value })}
                className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
              />
            </div>

            {/* Ongoing toggle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">
                Is the offence ongoing?
              </label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={data.offenceOngoing || false}
                    onChange={(e) =>
                      onChange({
                        offenceOngoing: e.target.checked,
                        offenceEndDate: e.target.checked
                          ? undefined
                          : data.offenceEndDate,
                      })
                    }
                    className="w-4 h-4 rounded border-neutral-300 text-gold-600 focus:ring-gold-600"
                  />
                  <span className="text-sm text-neutral-700">
                    Yes, still happening
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* End date (if not ongoing) */}
          {!data.offenceOngoing && (
            <div className="flex flex-col gap-1.5 max-w-xs">
              <label className="text-sm font-medium text-neutral-700">
                When did the offence end?
              </label>
              <input
                type="date"
                value={data.offenceEndDate || ""}
                min={data.offenceDate || undefined}
                max={today}
                onChange={(e) => onChange({ offenceEndDate: e.target.value })}
                className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
              />
            </div>
          )}

          {/* Enforcement history */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral-700">
              Enforcement history
            </h4>
            <p className="text-xs text-neutral-500">
              If any of these apply, the tribunal must order the maximum amount.
            </p>

            <div className="space-y-2">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 bg-white cursor-pointer hover:border-neutral-300">
                <input
                  type="checkbox"
                  checked={data.landlordConvicted || false}
                  onChange={(e) =>
                    onChange({ landlordConvicted: e.target.checked })
                  }
                  className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-gold-600 focus:ring-gold-600"
                />
                <div>
                  <span className="text-sm font-medium text-neutral-900">
                    Landlord has been convicted of this offence
                  </span>
                  {data.landlordConvicted && (
                    <div className="mt-2">
                      <input
                        type="date"
                        value={data.convictionDate || ""}
                        max={today}
                        onChange={(e) =>
                          onChange({ convictionDate: e.target.value })
                        }
                        placeholder="Conviction date"
                        className="h-9 w-48 rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
                      />
                    </div>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 bg-white cursor-pointer hover:border-neutral-300">
                <input
                  type="checkbox"
                  checked={data.civilPenalty || false}
                  onChange={(e) =>
                    onChange({ civilPenalty: e.target.checked })
                  }
                  className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-gold-600 focus:ring-gold-600"
                />
                <div>
                  <span className="text-sm font-medium text-neutral-900">
                    Landlord has received a civil penalty for this offence
                  </span>
                  {data.civilPenalty && (
                    <div className="mt-2">
                      <input
                        type="date"
                        value={data.civilPenaltyDate || ""}
                        max={today}
                        onChange={(e) =>
                          onChange({ civilPenaltyDate: e.target.value })
                        }
                        placeholder="Civil penalty date"
                        className="h-9 w-48 rounded-md border border-neutral-300 bg-white px-3 py-1 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
                      />
                    </div>
                  )}
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-neutral-200 bg-white cursor-pointer hover:border-neutral-300">
                <input
                  type="checkbox"
                  checked={data.priorRro || false}
                  onChange={(e) => onChange({ priorRro: e.target.checked })}
                  className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-gold-600 focus:ring-gold-600"
                />
                <span className="text-sm font-medium text-neutral-900">
                  There is a prior RRO against this landlord
                </span>
              </label>
            </div>

            {(data.landlordConvicted ||
              data.civilPenalty ||
              data.priorRro) && (
              <div className="flex gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  <strong>Mandatory maximum applies.</strong> The tribunal must
                  order the maximum amount of rent to be repaid.
                </p>
              </div>
            )}
          </div>

          {/* Offence-specific: Harassment acts */}
          {(data.offenceType === "harassment_landlord" ||
            data.offenceType === "harassment_with_intent") && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-neutral-700">
                What did the landlord do? (select all that apply)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {HARASSMENT_ACTS.map((act) => (
                  <label
                    key={act.id}
                    className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-neutral-100"
                  >
                    <input
                      type="checkbox"
                      checked={data.harassmentActs?.includes(act.id) || false}
                      onChange={(e) => {
                        const current = data.harassmentActs || [];
                        onChange({
                          harassmentActs: e.target.checked
                            ? [...current, act.id]
                            : current.filter((a) => a !== act.id),
                        });
                      }}
                      className="w-4 h-4 rounded border-neutral-300 text-gold-600 focus:ring-gold-600"
                    />
                    <span className="text-sm text-neutral-700">
                      {act.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Offence-specific: HMO occupants */}
          {(data.offenceType === "unlicensed_hmo" ||
            data.offenceType === "unlicensed_house") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  Number of occupants
                </label>
                <input
                  type="number"
                  min={1}
                  value={data.hmoOccupants || ""}
                  onChange={(e) =>
                    onChange({
                      hmoOccupants: e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined,
                    })
                  }
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  Number of households
                </label>
                <input
                  type="number"
                  min={1}
                  value={data.hmoHouseholds || ""}
                  onChange={(e) =>
                    onChange({
                      hmoHouseholds: e.target.value
                        ? parseInt(e.target.value, 10)
                        : undefined,
                    })
                  }
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
                />
              </div>
            </div>
          )}

          {/* Offence-specific: Possession ground */}
          {data.offenceType === "misused_possession_ground" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">
                Which possession ground was used?
              </label>
              <select
                value={data.possessionGroundUsed || ""}
                onChange={(e) =>
                  onChange({ possessionGroundUsed: e.target.value })
                }
                className="h-11 w-full appearance-none rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600 cursor-pointer"
              >
                <option value="" disabled>
                  Select a ground
                </option>
                {POSSESSION_GROUNDS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Offence-specific: PRS database registration */}
          {(data.offenceType === "prs_database_false_info" ||
            data.offenceType === "prs_database_breach") && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">
                Is the landlord registered on the PRS database?
              </label>
              <div className="flex gap-4 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="landlordRegistered"
                    checked={data.landlordRegistered === true}
                    onChange={() => onChange({ landlordRegistered: true })}
                    className="w-4 h-4 border-neutral-300 text-gold-600 focus:ring-gold-600"
                  />
                  <span className="text-sm text-neutral-700">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="landlordRegistered"
                    checked={data.landlordRegistered === false}
                    onChange={() => onChange({ landlordRegistered: false })}
                    className="w-4 h-4 border-neutral-300 text-gold-600 focus:ring-gold-600"
                  />
                  <span className="text-sm text-neutral-700">No</span>
                </label>
              </div>
            </div>
          )}

          {/* Regime badge + temporal fork */}
          {data.offenceDate && regime && (
            <div className="pt-3 border-t border-neutral-200">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-medium text-neutral-700">
                  Applicable regime:
                </span>
                <RegimeBadge regime={regime} />
              </div>
              <TemporalFork
                offenceType={data.offenceType}
                offenceDate={data.offenceDate}
                offenceOngoing={data.offenceOngoing}
                offenceEndDate={data.offenceEndDate}
                regime={regime}
              />
            </div>
          )}

          {/* Eligibility warning */}
          {isBlocked && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                Based on the dates provided, you may not be eligible for an RRO.
                You can still complete the checker for reference, but we
                recommend speaking to a solicitor.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP 2: PROPERTY INPUT
// ============================================

function PropertyInput({
  data,
  onChange,
}: {
  data: RroFormData;
  onChange: (updates: Partial<RroFormData>) => void;
}) {
  const [postcodeLoading, setPostcodeLoading] = React.useState(false);
  const [postcodeError, setPostcodeError] = React.useState<string | null>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const lookupPostcode = React.useCallback(
    async (postcode: string) => {
      const cleaned = postcode.replace(/\s/g, "").toUpperCase();
      if (cleaned.length < 5) return;

      setPostcodeLoading(true);
      setPostcodeError(null);

      try {
        const res = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(cleaned)}`
        );
        const json = await res.json();

        if (json.status === 200 && json.result) {
          const { country, admin_district } = json.result;
          if (country !== "England") {
            setPostcodeError(
              "RROs only apply to properties in England. This postcode is in " +
                country +
                "."
            );
            onChange({ laName: undefined });
          } else {
            setPostcodeError(null);
            onChange({ laName: admin_district || undefined });
          }
        } else {
          setPostcodeError("Postcode not found. Please check and try again.");
          onChange({ laName: undefined });
        }
      } catch {
        setPostcodeError("Could not verify postcode. Please try again.");
        onChange({ laName: undefined });
      } finally {
        setPostcodeLoading(false);
      }
    },
    [onChange]
  );

  const handlePostcodeChange = (value: string) => {
    onChange({ propertyPostcode: value });
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => lookupPostcode(value), 300);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-2">
          Property Details
        </h2>
        <p className="text-neutral-600">
          Tell us about the property where you were renting.
        </p>
      </div>

      {/* Postcode */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Postcode <span className="text-red-500">*</span>
        </label>
        <div className="relative max-w-xs">
          <input
            type="text"
            value={data.propertyPostcode || ""}
            onChange={(e) => handlePostcodeChange(e.target.value)}
            placeholder="e.g. E11 1AA"
            className={cn(
              "h-11 w-full rounded-md border bg-white px-4 py-2 pr-10 text-base text-neutral-900 uppercase",
              "focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600",
              postcodeError
                ? "border-red-400"
                : "border-neutral-300 hover:border-neutral-400"
            )}
          />
          {postcodeLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 animate-spin" />
          )}
          {!postcodeLoading && data.laName && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          )}
        </div>
        {postcodeError && (
          <p className="text-xs text-red-600">{postcodeError}</p>
        )}
        {data.laName && !postcodeError && (
          <p className="text-xs text-green-600">
            Local authority: {data.laName}
          </p>
        )}
      </div>

      {/* Full address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Full address <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.propertyAddress || ""}
          onChange={(e) => onChange({ propertyAddress: e.target.value })}
          placeholder="Enter the full property address"
          rows={3}
          className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 resize-y focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
        />
      </div>

      {/* Property description */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Property description{" "}
          <span className="text-neutral-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={data.propertyDescription || ""}
          onChange={(e) => onChange({ propertyDescription: e.target.value })}
          placeholder="e.g. 2-bedroom flat on the first floor, shared entrance"
          rows={2}
          className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 resize-y focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
        />
      </div>
    </div>
  );
}

// ============================================
// STEP 3: RENT HISTORY
// ============================================

function RentHistory({
  data,
  onChange,
  regime,
}: {
  data: RroFormData;
  onChange: (updates: Partial<RroFormData>) => void;
  regime: RroRegime | null;
}) {
  const monthlyRent = React.useMemo(() => {
    if (!data.rentAmount) return 0;
    return data.rentFrequency === "weekly"
      ? (data.rentAmount * 52) / 12
      : data.rentAmount;
  }, [data.rentAmount, data.rentFrequency]);

  const utilityDeduction = data.utilitiesIncluded
    ? data.utilitiesEstimate || 0
    : 0;
  const adjustedMonthly = Math.max(0, monthlyRent - utilityDeduction);
  const maxMonths = regime === "rra_2025" ? 24 : 12;
  const totalMaxClaim = Math.round(adjustedMonthly * maxMonths);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-2">
          Rent Details
        </h2>
        <p className="text-neutral-600">
          How much rent were you paying?
        </p>
      </div>

      {/* Rent amount + frequency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Rent amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
              &pound;
            </span>
            <input
              type="number"
              min={0}
              step={0.01}
              value={data.rentAmount || ""}
              onChange={(e) =>
                onChange({
                  rentAmount: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
              placeholder="0.00"
              className="h-11 w-full rounded-md border border-neutral-300 bg-white pl-8 pr-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Payment frequency
          </label>
          <div className="flex rounded-md border border-neutral-300 overflow-hidden h-11">
            <button
              type="button"
              onClick={() => onChange({ rentFrequency: "monthly" })}
              className={cn(
                "flex-1 text-sm font-medium transition-colors",
                (data.rentFrequency || "monthly") === "monthly"
                  ? "bg-gold-600 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-50"
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => onChange({ rentFrequency: "weekly" })}
              className={cn(
                "flex-1 text-sm font-medium transition-colors border-l border-neutral-300",
                data.rentFrequency === "weekly"
                  ? "bg-gold-600 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-50"
              )}
            >
              Weekly
            </button>
          </div>
        </div>
      </div>

      {/* Utilities */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.utilitiesIncluded || false}
            onChange={(e) =>
              onChange({
                utilitiesIncluded: e.target.checked,
                utilitiesEstimate: e.target.checked
                  ? data.utilitiesEstimate
                  : undefined,
              })
            }
            className="w-4 h-4 rounded border-neutral-300 text-gold-600 focus:ring-gold-600"
          />
          <span className="text-sm text-neutral-700">
            Rent includes utilities (gas, electric, water)
          </span>
        </label>

        {data.utilitiesIncluded && (
          <div className="flex flex-col gap-1.5 max-w-xs ml-6">
            <label className="text-sm font-medium text-neutral-700">
              Estimated monthly utility cost
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                &pound;
              </span>
              <input
                type="number"
                min={0}
                step={0.01}
                value={data.utilitiesEstimate || ""}
                onChange={(e) =>
                  onChange({
                    utilitiesEstimate: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                placeholder="0.00"
                className="h-11 w-full rounded-md border border-neutral-300 bg-white pl-8 pr-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
              />
            </div>
            <p className="text-xs text-neutral-500">
              The tribunal deducts a fair proportion for utilities from the rent.
            </p>
          </div>
        )}
      </div>

      {/* Live calculation preview */}
      {data.rentAmount && data.rentAmount > 0 && (
        <div className="p-5 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="text-sm font-semibold text-neutral-700 mb-4">
            Claim calculation preview
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-xs text-neutral-500 mb-1">Monthly rent</p>
              <p className="text-lg font-semibold text-neutral-900">
                &pound;{Math.round(monthlyRent).toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-xs text-neutral-500 mb-1">
                Utility deduction
              </p>
              <p className="text-lg font-semibold text-neutral-900">
                &minus;&pound;{Math.round(utilityDeduction).toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg">
              <p className="text-xs text-neutral-500 mb-1">Max months</p>
              <p className="text-lg font-semibold text-neutral-900">
                {maxMonths}
              </p>
            </div>
            <div className="text-center p-3 bg-gold-50 rounded-lg border border-gold-200">
              <p className="text-xs text-gold-700 mb-1">Max claim</p>
              <p className="text-lg font-bold text-gold-800">
                &pound;{totalMaxClaim.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP 4: APPLICANT DETAILS
// ============================================

function ApplicantDetails({
  data,
  onChange,
}: {
  data: RroFormData;
  onChange: (updates: Partial<RroFormData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-2">
          Your Details
        </h2>
        <p className="text-neutral-600">
          Tell us about yourself as the applicant.
        </p>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Full name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.applicantName || ""}
          onChange={(e) => onChange({ applicantName: e.target.value })}
          placeholder="Your full name"
          className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
        />
      </div>

      {/* Address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Current address <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.applicantAddress || ""}
          onChange={(e) => onChange({ applicantAddress: e.target.value })}
          placeholder="Your current address (may differ from the property)"
          rows={3}
          className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 resize-y focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
        />
      </div>

      {/* Phone numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Phone (day)
          </label>
          <input
            type="tel"
            value={data.applicantPhoneDay || ""}
            onChange={(e) => onChange({ applicantPhoneDay: e.target.value })}
            placeholder="Day phone"
            className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Phone (evening)
          </label>
          <input
            type="tel"
            value={data.applicantPhoneEvening || ""}
            onChange={(e) =>
              onChange({ applicantPhoneEvening: e.target.value })
            }
            placeholder="Evening phone"
            className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Mobile
          </label>
          <input
            type="tel"
            value={data.applicantPhoneMobile || ""}
            onChange={(e) =>
              onChange({ applicantPhoneMobile: e.target.value })
            }
            placeholder="Mobile number"
            className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">Email</label>
        <input
          type="email"
          value={data.applicantEmail || ""}
          onChange={(e) => onChange({ applicantEmail: e.target.value })}
          placeholder="your@email.com"
          className="h-11 w-full max-w-md rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
        />
      </div>
    </div>
  );
}

// ============================================
// STEP 5: RESPONDENT DETAILS
// ============================================

function RespondentDetails({
  data,
  onChange,
  regime,
}: {
  data: RroFormData;
  onChange: (updates: Partial<RroFormData>) => void;
  regime: RroRegime | null;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-2">
          Landlord Details
        </h2>
        <p className="text-neutral-600">
          Provide details of the landlord (the respondent).
        </p>
      </div>

      {/* Landlord name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Landlord name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={data.respondentName || ""}
          onChange={(e) => onChange({ respondentName: e.target.value })}
          placeholder="Full name or company name"
          className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
        />
      </div>

      {/* Landlord address */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Landlord address
        </label>
        <textarea
          value={data.respondentAddress || ""}
          onChange={(e) => onChange({ respondentAddress: e.target.value })}
          placeholder="Landlord's address"
          rows={3}
          className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 resize-y focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
        />
      </div>

      {/* Landlord email + phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Landlord email
          </label>
          <input
            type="email"
            value={data.respondentEmail || ""}
            onChange={(e) => onChange({ respondentEmail: e.target.value })}
            placeholder="landlord@email.com"
            className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-neutral-700">
            Landlord phone
          </label>
          <input
            type="tel"
            value={data.respondentPhone || ""}
            onChange={(e) => onChange({ respondentPhone: e.target.value })}
            placeholder="Phone number"
            className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
          />
        </div>
      </div>

      {/* Superior landlord (RRA 2025 only) */}
      {regime === "rra_2025" && (
        <div className="p-5 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
          <div className="flex gap-2 items-start">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-800">
                Superior landlord (rent-to-rent)
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Under the Renters&apos; Rights Act, if your immediate landlord
                is a tenant themselves (rent-to-rent), you may also claim against
                the superior landlord.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Superior landlord name
            </label>
            <input
              type="text"
              value={data.superiorLandlordName || ""}
              onChange={(e) =>
                onChange({ superiorLandlordName: e.target.value })
              }
              placeholder="Name of the superior landlord (if known)"
              className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700">
              Superior landlord address
            </label>
            <textarea
              value={data.superiorLandlordAddress || ""}
              onChange={(e) =>
                onChange({ superiorLandlordAddress: e.target.value })
              }
              placeholder="Address (if known)"
              rows={2}
              className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 resize-y focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP 6: EVIDENCE CHECKLIST
// ============================================

interface EvidenceItem {
  key: keyof RroFormData;
  label: string;
  description: string;
  isKey: boolean;
}

const EVIDENCE_ITEMS: EvidenceItem[] = [
  {
    key: "hasRentReceipts",
    label: "Rent payment receipts or bank statements",
    description: "Bank statements showing regular rent payments to the landlord",
    isKey: true,
  },
  {
    key: "hasTenancyAgreement",
    label: "Tenancy agreement",
    description: "Written tenancy agreement or AST",
    isKey: true,
  },
  {
    key: "hasCouncilConfirmation",
    label: "Council confirmation of offence",
    description:
      "Letter or email from the council confirming the offence (e.g. licensing status)",
    isKey: true,
  },
  {
    key: "hasPoliceReport",
    label: "Police report or crime reference",
    description: "Police report if relevant (e.g. for harassment or illegal eviction)",
    isKey: false,
  },
];

function EvidenceChecklist({
  data,
  onChange,
}: {
  data: RroFormData;
  onChange: (updates: Partial<RroFormData>) => void;
}) {
  const checkedCount = EVIDENCE_ITEMS.filter(
    (item) => data[item.key] as boolean
  ).length;
  const keyCheckedCount = EVIDENCE_ITEMS.filter(
    (item) => item.isKey && (data[item.key] as boolean)
  ).length;
  const totalKey = EVIDENCE_ITEMS.filter((item) => item.isKey).length;

  const strength: "strong" | "moderate" | "needs_work" =
    keyCheckedCount === totalKey
      ? "strong"
      : keyCheckedCount >= 1
        ? "moderate"
        : "needs_work";

  const strengthConfig = {
    strong: {
      label: "Strong",
      color: "text-green-700 bg-green-100 border-green-200",
    },
    moderate: {
      label: "Moderate",
      color: "text-amber-700 bg-amber-100 border-amber-200",
    },
    needs_work: {
      label: "Needs work",
      color: "text-red-700 bg-red-100 border-red-200",
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-2">
          Evidence
        </h2>
        <p className="text-neutral-600">
          What evidence do you have to support your application?
        </p>
      </div>

      {/* Strength indicator */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-neutral-600">Evidence strength:</span>
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
            strengthConfig[strength].color
          )}
        >
          {strengthConfig[strength].label}
        </span>
        <span className="text-xs text-neutral-500">
          ({checkedCount}/{EVIDENCE_ITEMS.length} items)
        </span>
      </div>

      {/* Evidence items */}
      <div className="space-y-2">
        {EVIDENCE_ITEMS.map((item) => (
          <label
            key={item.key}
            className="flex items-start gap-3 p-4 rounded-lg border border-neutral-200 bg-white cursor-pointer hover:border-neutral-300 transition-colors"
          >
            <input
              type="checkbox"
              checked={(data[item.key] as boolean) || false}
              onChange={(e) =>
                onChange({ [item.key]: e.target.checked })
              }
              className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-gold-600 focus:ring-gold-600"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-900">
                  {item.label}
                </span>
                {item.isKey && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gold-100 text-gold-700 font-medium">
                    Key evidence
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {item.description}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* No written agreement fallback */}
      {!data.hasTenancyAgreement && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
          <div className="flex gap-2 items-start">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              <strong>No written agreement?</strong> You can still apply. Please
              provide the details below.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={data.noWrittenAgreement || false}
              onChange={(e) =>
                onChange({ noWrittenAgreement: e.target.checked })
              }
              className="w-4 h-4 rounded border-neutral-300 text-gold-600 focus:ring-gold-600"
            />
            <span className="text-sm text-neutral-700">
              I do not have a written tenancy agreement
            </span>
          </label>

          {data.noWrittenAgreement && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ml-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  Start date
                </label>
                <input
                  type="date"
                  value={data.agreementStartDate || ""}
                  onChange={(e) =>
                    onChange({ agreementStartDate: e.target.value })
                  }
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  Rent amount
                </label>
                <input
                  type="text"
                  value={data.agreementRentAmount || ""}
                  onChange={(e) =>
                    onChange({ agreementRentAmount: e.target.value })
                  }
                  placeholder="e.g. 1200"
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700">
                  Frequency
                </label>
                <input
                  type="text"
                  value={data.agreementPaymentFrequency || ""}
                  onChange={(e) =>
                    onChange({ agreementPaymentFrequency: e.target.value })
                  }
                  placeholder="e.g. Monthly"
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-base text-neutral-900 focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Additional notes */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-neutral-700">
          Additional notes{" "}
          <span className="text-neutral-400 font-normal">(optional)</span>
        </label>
        <textarea
          value={data.evidenceNotes || ""}
          onChange={(e) => onChange({ evidenceNotes: e.target.value })}
          placeholder="Any other evidence or relevant information..."
          rows={3}
          className="w-full rounded-md border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 resize-y focus:outline-none focus:ring-2 focus:ring-gold-600 focus:border-gold-600"
        />
      </div>
    </div>
  );
}

// ============================================
// STEP 7: REVIEW & SUBMIT
// ============================================

function ReviewSubmit({
  data,
  regime,
  onEdit,
  onSubmit,
  submitting,
}: {
  data: RroFormData;
  regime: RroRegime | null;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const [agreed, setAgreed] = React.useState(false);

  const offence = OFFENCE_OPTIONS.find((o) => o.id === data.offenceType);

  const monthlyRent = React.useMemo(() => {
    if (!data.rentAmount) return 0;
    return data.rentFrequency === "weekly"
      ? (data.rentAmount * 52) / 12
      : data.rentAmount;
  }, [data.rentAmount, data.rentFrequency]);

  const utilityDeduction = data.utilitiesIncluded
    ? data.utilitiesEstimate || 0
    : 0;
  const adjustedMonthly = Math.max(0, monthlyRent - utilityDeduction);
  const maxMonths = regime === "rra_2025" ? 24 : 12;
  const totalMaxClaim = Math.round(adjustedMonthly * maxMonths);

  const isMandatory =
    data.landlordConvicted || data.civilPenalty || data.priorRro;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-2">
          Review Your Application
        </h2>
        <p className="text-neutral-600">
          Please check everything is correct before submitting.
        </p>
      </div>

      {/* Estimated claim */}
      <div className="p-5 bg-gold-50 rounded-lg border border-gold-200 text-center">
        <p className="text-sm text-gold-700 mb-1">
          Maximum potential claim
        </p>
        <p className="text-4xl font-display font-bold text-gold-800">
          &pound;{totalMaxClaim.toLocaleString()}
        </p>
        {regime && (
          <div className="mt-3">
            <RegimeBadge regime={regime} />
          </div>
        )}
        {isMandatory && (
          <p className="text-sm text-green-700 mt-2 font-medium">
            Mandatory maximum applies
          </p>
        )}
      </div>

      {/* Summary sections */}
      <div className="space-y-4">
        {/* Offence */}
        <SummaryCard
          title="Offence"
          icon={<Scale className="w-4 h-4" />}
          onEdit={() => onEdit(1)}
        >
          <SummaryRow label="Type" value={offence?.label || "Not selected"} />
          <SummaryRow
            label="Date"
            value={
              data.offenceDate
                ? new Date(
                    data.offenceDate + "T00:00:00Z"
                  ).toLocaleDateString("en-GB")
                : "Not set"
            }
          />
          <SummaryRow
            label="Status"
            value={data.offenceOngoing ? "Ongoing" : "Ended"}
          />
          {data.landlordConvicted && (
            <SummaryRow label="Convicted" value="Yes" />
          )}
          {data.civilPenalty && (
            <SummaryRow label="Civil penalty" value="Yes" />
          )}
          {data.priorRro && <SummaryRow label="Prior RRO" value="Yes" />}
        </SummaryCard>

        {/* Property */}
        <SummaryCard
          title="Property"
          icon={<Home className="w-4 h-4" />}
          onEdit={() => onEdit(2)}
        >
          <SummaryRow
            label="Address"
            value={data.propertyAddress || "Not provided"}
          />
          <SummaryRow
            label="Postcode"
            value={data.propertyPostcode || "Not provided"}
          />
          {data.laName && (
            <SummaryRow label="Local authority" value={data.laName} />
          )}
        </SummaryCard>

        {/* Rent */}
        <SummaryCard
          title="Rent"
          icon={<PoundSterling className="w-4 h-4" />}
          onEdit={() => onEdit(3)}
        >
          <SummaryRow
            label="Amount"
            value={
              data.rentAmount
                ? `\u00A3${data.rentAmount} ${data.rentFrequency || "monthly"}`
                : "Not provided"
            }
          />
          <SummaryRow
            label="Monthly equivalent"
            value={`\u00A3${Math.round(monthlyRent).toLocaleString()}`}
          />
          {data.utilitiesIncluded && (
            <SummaryRow
              label="Utility deduction"
              value={`\u00A3${Math.round(utilityDeduction).toLocaleString()}/month`}
            />
          )}
          <SummaryRow
            label="Adjusted monthly"
            value={`\u00A3${Math.round(adjustedMonthly).toLocaleString()}`}
          />
        </SummaryCard>

        {/* Applicant */}
        <SummaryCard
          title="Your Details"
          icon={<User className="w-4 h-4" />}
          onEdit={() => onEdit(4)}
        >
          <SummaryRow
            label="Name"
            value={data.applicantName || "Not provided"}
          />
          <SummaryRow
            label="Address"
            value={data.applicantAddress || "Not provided"}
          />
          {data.applicantEmail && (
            <SummaryRow label="Email" value={data.applicantEmail} />
          )}
        </SummaryCard>

        {/* Respondent */}
        <SummaryCard
          title="Landlord"
          icon={<User className="w-4 h-4" />}
          onEdit={() => onEdit(5)}
        >
          <SummaryRow
            label="Name"
            value={data.respondentName || "Not provided"}
          />
          {data.respondentAddress && (
            <SummaryRow label="Address" value={data.respondentAddress} />
          )}
          {data.superiorLandlordName && (
            <SummaryRow
              label="Superior landlord"
              value={data.superiorLandlordName}
            />
          )}
        </SummaryCard>

        {/* Evidence */}
        <SummaryCard
          title="Evidence"
          icon={<FileText className="w-4 h-4" />}
          onEdit={() => onEdit(6)}
        >
          {EVIDENCE_ITEMS.map((item) => (
            <SummaryRow
              key={item.key}
              label={item.label}
              value={
                (data[item.key] as boolean) ? (
                  <span className="text-green-700">Yes</span>
                ) : (
                  <span className="text-neutral-400">No</span>
                )
              }
            />
          ))}
        </SummaryCard>
      </div>

      {/* Fees reminder */}
      <div className="flex gap-3 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
        <Info className="w-5 h-5 text-neutral-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-neutral-900">
            Tribunal fees
          </p>
          <p className="text-sm text-neutral-600 mt-1">
            Application fee: &pound;{APPLICATION_FEE} &middot; Hearing fee:
            &pound;{HEARING_FEE} &middot; Total: &pound;
            {APPLICATION_FEE + HEARING_FEE}
          </p>
        </div>
      </div>

      {/* Statement of truth */}
      <div className="p-4 bg-white border border-neutral-200 rounded-lg">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-gold-600 focus:ring-gold-600"
          />
          <span className="text-sm text-neutral-700">
            I confirm that the information I have provided is true to the best
            of my knowledge and belief. I understand that this tool provides
            guidance only and does not constitute legal advice or a formal
            application to the tribunal.
          </span>
        </label>
      </div>

      {/* Submit */}
      <Button
        onClick={onSubmit}
        disabled={!agreed || submitting}
        loading={submitting}
        size="lg"
        className="w-full"
      >
        {submitting ? "Generating your results..." : "Generate Application Pack"}
        {!submitting && <Send className="w-4 h-4 ml-2" />}
      </Button>
    </div>
  );
}

// ============================================
// SUMMARY HELPERS
// ============================================

function SummaryCard({
  title,
  icon,
  onEdit,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-lg border border-neutral-200 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-neutral-500">{icon}</span>
          <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-gold-600 hover:text-gold-700 transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-start gap-4 text-sm">
      <span className="text-neutral-500 flex-shrink-0">{label}</span>
      <span className="text-neutral-900 text-right">{value}</span>
    </div>
  );
}

// ============================================
// MAIN WIZARD ORCHESTRATOR
// ============================================

export function RroCheckerClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = React.useState<RroFormData>({});
  const [currentStep, setCurrentStep] = React.useState(1);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load persisted data on mount
  React.useEffect(() => {
    const saved = loadFormData();
    setFormData(saved);
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const s = parseInt(stepParam, 10);
      if (s >= 1 && s <= TOTAL_STEPS) setCurrentStep(s);
    }
  }, [searchParams]);

  // Persist on change
  React.useEffect(() => {
    saveFormData(formData);
  }, [formData]);

  const updateData = React.useCallback((updates: Partial<RroFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const regime = determineRegime(
    formData.offenceType,
    formData.offenceDate,
    formData.offenceEndDate,
    formData.offenceOngoing
  );

  const isBlocked = React.useMemo(() => {
    if (!formData.offenceType || !formData.offenceDate) return false;
    const earliest = getEarliestQualifyingDate(formData.offenceType);
    return formData.offenceDate < earliest;
  }, [formData.offenceType, formData.offenceDate]);

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canAdvance = React.useMemo(() => {
    switch (currentStep) {
      case 1:
        return !!formData.offenceType && !!formData.offenceDate;
      case 2:
        return !!formData.propertyPostcode && !!formData.propertyAddress;
      case 3:
        return !!formData.rentAmount && formData.rentAmount > 0;
      case 4:
        return !!formData.applicantName && !!formData.applicantAddress;
      case 5:
        return !!formData.respondentName;
      case 6:
        return true; // evidence is optional
      case 7:
        return true;
      default:
        return false;
    }
  }, [currentStep, formData]);

  const handleNext = () => {
    if (!canAdvance) {
      setError("Please fill in the required fields before continuing.");
      return;
    }
    setError(null);
    if (currentStep < TOTAL_STEPS) {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      // Save form data so results page can read it
      saveFormData(formData);
      sessionStorage.setItem("rro-checker-regime", regime || "hpa_2016");
      router.push("/tools/rro-checker/results");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <Section variant="default" padding="lg" topEffect="fade">
      <div className="max-w-3xl mx-auto">
        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        {/* Blocked warning banner */}
        {isBlocked && currentStep > 1 && (
          <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">
              Based on the offence date, you may not be eligible. You can still
              complete the form for reference.
            </p>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Step content */}
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <OffenceSelector data={formData} onChange={updateData} />
          )}
          {currentStep === 2 && (
            <PropertyInput data={formData} onChange={updateData} />
          )}
          {currentStep === 3 && (
            <RentHistory
              data={formData}
              onChange={updateData}
              regime={regime}
            />
          )}
          {currentStep === 4 && (
            <ApplicantDetails data={formData} onChange={updateData} />
          )}
          {currentStep === 5 && (
            <RespondentDetails
              data={formData}
              onChange={updateData}
              regime={regime}
            />
          )}
          {currentStep === 6 && (
            <EvidenceChecklist data={formData} onChange={updateData} />
          )}
          {currentStep === 7 && (
            <ReviewSubmit
              data={formData}
              regime={regime}
              onEdit={goToStep}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>

        {/* Navigation */}
        {currentStep < 7 && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-neutral-200">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button onClick={handleNext} disabled={!canAdvance}>
              Continue
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Back button on step 7 (submit button is inline) */}
        {currentStep === 7 && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleBack}
              className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 inline mr-1" />
              Back to evidence
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
