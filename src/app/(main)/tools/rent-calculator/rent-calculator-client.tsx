"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Home,
  PoundSterling,
  ClipboardCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Loader2,
  AlertCircle,
  Pencil,
  RotateCcw,
  Info,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/cn";
import type {
  CalculatorFormData,
  CalculatorResult,
  PostcodeLookupResult,
  PropertyType,
  FurnishedStatus,
  Condition,
  EpcRating,
} from "@/lib/rent-calculator/types";
import {
  CONDITION_FACTORS,
  CONDITION_LABELS,
  CONDITION_DESCRIPTIONS,
  FURNISHED_FACTORS,
  FURNISHED_LABELS,
  EPC_FACTORS,
  PROPERTY_TYPES,
  VERDICT_CONFIG,
  POSTCODE_REGEX,
  ENGLAND_PREFIXES,
  normalizePostcode,
} from "@/lib/rent-calculator/constants";

// ============================================
// CURRENCY FORMATTER
// ============================================

const GBP = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

// ============================================
// SESSION STORAGE KEY
// ============================================

const STORAGE_KEY = "rent-calc-form";

function saveFormToSession(data: Partial<CalculatorFormData>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

function loadFormFromSession(): Partial<CalculatorFormData> | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function clearFormSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

// ============================================
// DEFAULT FORM DATA
// ============================================

const DEFAULT_FORM: CalculatorFormData = {
  postcode: "",
  gssCode: "",
  laName: "",
  region: "",
  propertyType: "flat",
  bedrooms: 1,
  furnished: "unfurnished",
  currentRentPcm: 0,
  proposedRentPcm: 0,
  condition: "good",
  epcRating: null,
};

// ============================================
// STEP CONFIG
// ============================================

const STEPS = [
  { id: 1, label: "Location", icon: MapPin },
  { id: 2, label: "Property", icon: Home },
  { id: 3, label: "Rent", icon: PoundSterling },
  { id: 4, label: "Condition", icon: ClipboardCheck },
  { id: 5, label: "Review", icon: CheckCircle2 },
] as const;

// ============================================
// STEP INDICATOR
// ============================================

function StepIndicator({
  currentStep,
  onStepClick,
}: {
  currentStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <nav aria-label="Calculator progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {STEPS.map((step, idx) => {
          const isComplete = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <li
              key={step.id}
              className="flex items-center flex-1 last:flex-none"
            >
              <button
                type="button"
                onClick={() => {
                  if (isComplete) onStepClick(step.id);
                }}
                disabled={!isComplete}
                className={cn(
                  "flex flex-col items-center gap-1.5 group transition-colors",
                  isComplete && "cursor-pointer",
                  !isComplete && !isCurrent && "cursor-default"
                )}
              >
                <span
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    isComplete &&
                      "bg-green-100 text-green-700 group-hover:bg-green-200",
                    isCurrent && "bg-gold-100 text-gold-700 ring-2 ring-gold-300",
                    !isComplete &&
                      !isCurrent &&
                      "bg-neutral-100 text-neutral-400"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    isCurrent && "text-neutral-900",
                    isComplete && "text-green-700",
                    !isComplete && !isCurrent && "text-neutral-400"
                  )}
                >
                  {step.label}
                </span>
              </button>

              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 rounded-full transition-colors",
                    currentStep > step.id ? "bg-green-300" : "bg-neutral-200"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ============================================
// STEP 1: POSTCODE INPUT
// ============================================

function PostcodeInput({
  formData,
  onChange,
}: {
  formData: CalculatorFormData;
  onChange: (update: Partial<CalculatorFormData>) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [rawInput, setRawInput] = React.useState(formData.postcode);
  const [isLooking, setIsLooking] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const lookupPostcode = React.useCallback(
    async (pc: string) => {
      const normalized = normalizePostcode(pc);

      if (!POSTCODE_REGEX.test(normalized)) {
        setError("Please enter a valid UK postcode");
        onChange({ postcode: "", gssCode: "", laName: "", region: "" });
        return;
      }

      if (!ENGLAND_PREFIXES.test(normalized)) {
        setError(
          "This calculator covers England only. Northern Ireland, Jersey, Guernsey, and Isle of Man postcodes are not supported."
        );
        onChange({ postcode: "", gssCode: "", laName: "", region: "" });
        return;
      }

      setError(null);
      setIsLooking(true);

      try {
        const clean = pc.replace(/\s+/g, "").toUpperCase();
        const res = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`
        );
        const data = await res.json();

        if (data.status !== 200 || !data.result) {
          setError("Postcode not found. Please check and try again.");
          onChange({ postcode: normalized, gssCode: "", laName: "", region: "" });
          return;
        }

        if (data.result.country !== "England") {
          setError("This calculator is for properties in England only.");
          onChange({ postcode: normalized, gssCode: "", laName: "", region: "" });
          return;
        }

        onChange({
          postcode: normalized,
          gssCode: data.result.codes?.admin_district || "",
          laName: data.result.admin_district || "",
          region: data.result.region || "",
        });
        setError(null);
      } catch {
        setError("Unable to look up postcode. Please try again.");
        onChange({ postcode: normalized, gssCode: "", laName: "", region: "" });
      } finally {
        setIsLooking(false);
      }
    },
    [onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setRawInput(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const clean = val.replace(/\s+/g, "");
    if (clean.length >= 5) {
      debounceRef.current = setTimeout(() => lookupPostcode(val), 300);
    } else {
      setError(null);
      onChange({ postcode: "", gssCode: "", laName: "", region: "" });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-2xl font-semibold text-neutral-900">
        Where is the property?
      </h2>
      <p className="text-neutral-600">
        Enter the full postcode so we can look up local market data from the ONS.
      </p>

      <div className="relative max-w-sm">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={rawInput}
          onChange={handleChange}
          placeholder="e.g. E11 1NR"
          autoComplete="postal-code"
          className={cn(
            "w-full pl-10 pr-10 py-3 rounded-lg border text-base font-mono tracking-wide",
            "focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400",
            error
              ? "border-red-300 bg-red-50"
              : formData.laName
              ? "border-green-300 bg-green-50"
              : "border-neutral-300 bg-white"
          )}
        />
        {isLooking && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 animate-spin" />
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {formData.laName && !error && (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4" />
          {formData.laName}, {formData.region}
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP 2: PROPERTY SELECTOR
// ============================================

function PropertySelector({
  formData,
  onChange,
}: {
  formData: CalculatorFormData;
  onChange: (update: Partial<CalculatorFormData>) => void;
}) {
  const propertyIcons: Record<PropertyType, string> = {
    flat: "🏢",
    terraced: "🏠",
    semi: "🏡",
    detached: "🏘️",
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-neutral-900">
        Tell us about the property
      </h2>

      {/* Property type cards */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Property type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PROPERTY_TYPES.map((pt) => (
            <button
              key={pt.value}
              type="button"
              onClick={() => onChange({ propertyType: pt.value })}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all text-center",
                formData.propertyType === pt.value
                  ? "border-gold-400 bg-gold-50 shadow-sm"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              )}
            >
              <span className="text-2xl">{propertyIcons[pt.value]}</span>
              <span className="text-sm font-medium text-neutral-800">
                {pt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <label
          htmlFor="bedrooms"
          className="block text-sm font-medium text-neutral-700 mb-2"
        >
          Number of bedrooms
        </label>
        <div className="flex items-center gap-3 max-w-xs">
          <button
            type="button"
            onClick={() =>
              onChange({ bedrooms: Math.max(0, formData.bedrooms - 1) })
            }
            className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            -
          </button>
          <input
            id="bedrooms"
            type="number"
            min={0}
            max={10}
            value={formData.bedrooms}
            onChange={(e) =>
              onChange({
                bedrooms: Math.max(0, Math.min(10, parseInt(e.target.value) || 0)),
              })
            }
            className="w-16 text-center py-2 rounded-lg border border-neutral-300 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-gold-300"
          />
          <button
            type="button"
            onClick={() =>
              onChange({ bedrooms: Math.min(10, formData.bedrooms + 1) })
            }
            className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            +
          </button>
          <span className="text-sm text-neutral-500 ml-1">
            {formData.bedrooms === 0 ? "Studio" : `bedroom${formData.bedrooms > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>

      {/* Furnished status */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Furnished status
        </label>
        <div className="flex flex-wrap gap-2">
          {(
            Object.entries(FURNISHED_LABELS) as [FurnishedStatus, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ furnished: value })}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                formData.furnished === value
                  ? "border-gold-400 bg-gold-50 text-gold-800"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// STEP 3: RENT INPUT
// ============================================

function RentInput({
  formData,
  onChange,
}: {
  formData: CalculatorFormData;
  onChange: (update: Partial<CalculatorFormData>) => void;
}) {
  const diff =
    formData.proposedRentPcm > 0 && formData.currentRentPcm > 0
      ? formData.proposedRentPcm - formData.currentRentPcm
      : null;

  const diffPct =
    diff !== null && formData.currentRentPcm > 0
      ? (diff / formData.currentRentPcm) * 100
      : null;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-neutral-900">
        Rent details
      </h2>
      <p className="text-neutral-600">
        Enter what you currently pay and what your landlord wants to charge.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Current rent */}
        <div>
          <label
            htmlFor="currentRent"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            What you currently pay
          </label>
          <p className="text-xs text-neutral-500 mb-2">
            Monthly rent (PCM)
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
              &pound;
            </span>
            <input
              id="currentRent"
              type="number"
              min={0}
              step={50}
              value={formData.currentRentPcm || ""}
              onChange={(e) =>
                onChange({
                  currentRentPcm: Math.max(0, parseInt(e.target.value) || 0),
                })
              }
              placeholder="1,200"
              className="w-full pl-8 pr-4 py-3 rounded-lg border border-neutral-300 text-lg focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400"
            />
          </div>
        </div>

        {/* Proposed rent */}
        <div>
          <label
            htmlFor="proposedRent"
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            What your landlord wants to charge
          </label>
          <p className="text-xs text-neutral-500 mb-2">
            Proposed monthly rent (PCM)
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">
              &pound;
            </span>
            <input
              id="proposedRent"
              type="number"
              min={0}
              step={50}
              value={formData.proposedRentPcm || ""}
              onChange={(e) =>
                onChange({
                  proposedRentPcm: Math.max(0, parseInt(e.target.value) || 0),
                })
              }
              placeholder="1,500"
              className="w-full pl-8 pr-4 py-3 rounded-lg border border-neutral-300 text-lg focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-400"
            />
          </div>
        </div>
      </div>

      {/* Live difference */}
      {diff !== null && diffPct !== null && (
        <div
          className={cn(
            "flex items-center gap-3 p-4 rounded-lg border",
            diff > 0
              ? "bg-red-50 border-red-200"
              : diff < 0
              ? "bg-green-50 border-green-200"
              : "bg-neutral-50 border-neutral-200"
          )}
        >
          {diff > 0 ? (
            <TrendingUp className="w-5 h-5 text-red-600 flex-shrink-0" />
          ) : diff < 0 ? (
            <TrendingDown className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <BarChart3 className="w-5 h-5 text-neutral-500 flex-shrink-0" />
          )}
          <div>
            <p
              className={cn(
                "text-sm font-medium",
                diff > 0
                  ? "text-red-700"
                  : diff < 0
                  ? "text-green-700"
                  : "text-neutral-700"
              )}
            >
              {diff > 0 ? "+" : ""}
              {GBP.format(diff)} per month ({diff > 0 ? "+" : ""}
              {diffPct.toFixed(1)}%)
            </p>
            {diff > 0 && (
              <p className="text-xs text-red-600 mt-0.5">
                That is {GBP.format(diff * 12)} more per year
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// STEP 4: CONDITION SELECTOR
// ============================================

function ConditionSelector({
  formData,
  onChange,
}: {
  formData: CalculatorFormData;
  onChange: (update: Partial<CalculatorFormData>) => void;
}) {
  const conditionEntries = Object.entries(CONDITION_LABELS) as [
    Condition,
    string,
  ][];
  const epcRatings: EpcRating[] = ["A", "B", "C", "D", "E", "F", "G"];

  // Preview of total adjustment factor
  const condFactor = CONDITION_FACTORS[formData.condition];
  const epcFactor = formData.epcRating ? EPC_FACTORS[formData.epcRating] : 1.0;
  const furnFactor = FURNISHED_FACTORS[formData.furnished];
  const totalFactor = condFactor * epcFactor * furnFactor;
  const adjustmentPct = ((totalFactor - 1) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-neutral-900">
        Property condition
      </h2>
      <p className="text-neutral-600">
        The condition and energy efficiency of the property affect how it
        compares to the market.
      </p>

      {/* Condition options */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Overall condition
        </label>
        <div className="space-y-2">
          {conditionEntries.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ condition: value })}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all",
                formData.condition === value
                  ? "border-gold-400 bg-gold-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300"
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-neutral-900">{label}</span>
                  <p className="text-sm text-neutral-500 mt-0.5">
                    {CONDITION_DESCRIPTIONS[value]}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs font-mono px-2 py-0.5 rounded",
                    CONDITION_FACTORS[value] > 1
                      ? "bg-green-100 text-green-700"
                      : CONDITION_FACTORS[value] < 1
                      ? "bg-red-100 text-red-700"
                      : "bg-neutral-100 text-neutral-600"
                  )}
                >
                  {CONDITION_FACTORS[value] > 1 ? "+" : ""}
                  {((CONDITION_FACTORS[value] - 1) * 100).toFixed(0)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* EPC rating */}
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          EPC rating
        </label>
        <p className="text-xs text-neutral-500 mb-3">
          Optional. Select if you know the Energy Performance Certificate rating.
        </p>
        <div className="flex flex-wrap gap-2">
          {epcRatings.map((rating) => {
            const ratingColors: Record<EpcRating, string> = {
              A: "bg-green-600",
              B: "bg-green-500",
              C: "bg-lime-500",
              D: "bg-yellow-400",
              E: "bg-orange-400",
              F: "bg-orange-600",
              G: "bg-red-600",
            };
            const isSelected = formData.epcRating === rating;

            return (
              <button
                key={rating}
                type="button"
                onClick={() =>
                  onChange({
                    epcRating: isSelected ? null : rating,
                  })
                }
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold transition-all border-2",
                  isSelected
                    ? cn(ratingColors[rating], "text-white border-neutral-800 ring-2 ring-neutral-800")
                    : "bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300"
                )}
              >
                {rating}
              </button>
            );
          })}
        </div>
      </div>

      {/* Adjustment preview */}
      <div className="flex items-center gap-3 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
        <Info className="w-5 h-5 text-neutral-400 flex-shrink-0" />
        <div className="text-sm text-neutral-600">
          <span className="font-medium text-neutral-800">
            Total adjustment:{" "}
            <span
              className={cn(
                "font-mono",
                totalFactor > 1
                  ? "text-green-700"
                  : totalFactor < 1
                  ? "text-red-700"
                  : "text-neutral-700"
              )}
            >
              {Number(adjustmentPct) > 0 ? "+" : ""}
              {adjustmentPct}%
            </span>
          </span>
          <span className="ml-1">
            applied to the market median based on condition
            {formData.epcRating ? ", EPC" : ""}, and furnishing.
          </span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// STEP 5: REVIEW CARD
// ============================================

function ReviewCard({
  formData,
  onEdit,
  onCalculate,
  isCalculating,
  calcError,
}: {
  formData: CalculatorFormData;
  onEdit: (step: number) => void;
  onCalculate: () => void;
  isCalculating: boolean;
  calcError: string | null;
}) {
  const sections = [
    {
      step: 1,
      title: "Location",
      items: [
        { label: "Postcode", value: formData.postcode },
        { label: "Local authority", value: formData.laName },
        { label: "Region", value: formData.region },
      ],
    },
    {
      step: 2,
      title: "Property",
      items: [
        {
          label: "Type",
          value:
            PROPERTY_TYPES.find((p) => p.value === formData.propertyType)
              ?.label ?? formData.propertyType,
        },
        {
          label: "Bedrooms",
          value:
            formData.bedrooms === 0
              ? "Studio"
              : String(formData.bedrooms),
        },
        { label: "Furnished", value: FURNISHED_LABELS[formData.furnished] },
      ],
    },
    {
      step: 3,
      title: "Rent",
      items: [
        {
          label: "Current rent",
          value: formData.currentRentPcm
            ? GBP.format(formData.currentRentPcm) + " /month"
            : "Not specified",
        },
        {
          label: "Proposed rent",
          value: formData.proposedRentPcm
            ? GBP.format(formData.proposedRentPcm) + " /month"
            : "Not specified",
        },
      ],
    },
    {
      step: 4,
      title: "Condition",
      items: [
        { label: "Condition", value: CONDITION_LABELS[formData.condition] },
        {
          label: "EPC rating",
          value: formData.epcRating ?? "Not specified",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-neutral-900">
        Review your details
      </h2>
      <p className="text-neutral-600">
        Check everything looks correct, then calculate to see how your rent
        compares.
      </p>

      <div className="space-y-4">
        {sections.map((section) => (
          <div
            key={section.step}
            className="p-4 rounded-lg border border-neutral-200 bg-white"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-800 uppercase tracking-wide">
                {section.title}
              </h3>
              <button
                type="button"
                onClick={() => onEdit(section.step)}
                className="inline-flex items-center gap-1 text-xs font-medium text-gold-600 hover:text-gold-700 transition-colors"
              >
                <Pencil className="w-3 h-3" />
                Edit
              </button>
            </div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              {section.items.map((item) => (
                <div key={item.label} className="flex justify-between sm:block py-1">
                  <dt className="text-xs text-neutral-500">{item.label}</dt>
                  <dd className="text-sm font-medium text-neutral-900">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {calcError && (
        <div className="flex items-start gap-2 p-4 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">
              Calculation failed
            </p>
            <p className="text-sm text-red-600 mt-0.5">{calcError}</p>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onCalculate}
        disabled={isCalculating}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-4 rounded-lg text-base font-semibold transition-all",
          "bg-neutral-900 text-white hover:bg-gold-700 hover:shadow-lg",
          "disabled:opacity-60 disabled:cursor-not-allowed"
        )}
      >
        {isCalculating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Calculating...
          </>
        ) : (
          <>
            Calculate
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}

// ============================================
// RESULTS DISPLAY
// ============================================

function ResultsDisplay({
  result,
  onReset,
}: {
  result: CalculatorResult;
  onReset: () => void;
}) {
  const verdictCfg = VERDICT_CONFIG[result.comparison.verdict];

  // Market range bar calculations
  const rangeMin = result.areaData.lowerQuartile;
  const rangeMax = result.areaData.upperQuartile;
  const rangeSpan = rangeMax - rangeMin;
  // Add some padding to the visual range
  const vizMin = Math.max(0, rangeMin - rangeSpan * 0.3);
  const vizMax = rangeMax + rangeSpan * 0.3;
  const vizSpan = vizMax - vizMin;

  const medianPos =
    vizSpan > 0
      ? ((result.areaData.medianRentPcm - vizMin) / vizSpan) * 100
      : 50;
  const proposedPos =
    vizSpan > 0
      ? Math.min(
          100,
          Math.max(0, ((result.comparison.proposedRent - vizMin) / vizSpan) * 100)
        )
      : 50;
  const lqPos =
    vizSpan > 0 ? ((rangeMin - vizMin) / vizSpan) * 100 : 25;
  const uqPos =
    vizSpan > 0 ? ((rangeMax - vizMin) / vizSpan) * 100 : 75;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Verdict banner */}
      <div
        className={cn(
          "p-6 rounded-xl border-2",
          verdictCfg.bgColor,
          verdictCfg.color === "text-green-700" || verdictCfg.color === "text-green-600"
            ? "border-green-200"
            : verdictCfg.color === "text-amber-700"
            ? "border-amber-200"
            : verdictCfg.color === "text-red-600" || verdictCfg.color === "text-red-700"
            ? "border-red-200"
            : "border-neutral-200"
        )}
      >
        <p className={cn("text-lg font-semibold", verdictCfg.color)}>
          {verdictCfg.label}
        </p>
        <p className="text-neutral-700 mt-2">{result.headline}</p>
      </div>

      {/* Key numbers grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-lg bg-white border border-neutral-200 text-center">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            Proposed Rent
          </p>
          <p className="text-2xl font-display font-semibold text-neutral-900">
            {GBP.format(result.comparison.proposedRent)}
          </p>
          <p className="text-xs text-neutral-400 mt-0.5">per month</p>
        </div>
        <div className="p-5 rounded-lg bg-white border border-neutral-200 text-center">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            Market Median
          </p>
          <p className="text-2xl font-display font-semibold text-neutral-900">
            {GBP.format(result.comparison.marketMedian)}
          </p>
          <p className="text-xs text-neutral-400 mt-0.5">
            {result.areaData.localAuthority}
          </p>
        </div>
        <div className="p-5 rounded-lg bg-white border border-neutral-200 text-center">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
            Difference
          </p>
          <p
            className={cn(
              "text-2xl font-display font-semibold",
              result.comparison.differencePct > 5
                ? "text-red-600"
                : result.comparison.differencePct < -5
                ? "text-green-600"
                : "text-neutral-900"
            )}
          >
            {result.comparison.differencePct > 0 ? "+" : ""}
            {result.comparison.differencePct.toFixed(1)}%
          </p>
          {result.comparison.annualOverpayment !== null &&
            result.comparison.annualOverpayment > 0 && (
              <p className="text-xs text-red-500 mt-0.5">
                {GBP.format(result.comparison.annualOverpayment)} /year
                overpayment
              </p>
            )}
        </div>
      </div>

      {/* Market range visualization */}
      <div className="p-5 rounded-lg bg-white border border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-800 mb-4">
          Market Range — {result.areaData.localAuthority}
        </h3>

        <div className="relative h-12 mb-8">
          {/* Track background */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 rounded-full bg-neutral-100" />

          {/* Interquartile range */}
          <div
            className="absolute top-1/2 -translate-y-1/2 h-3 rounded-full bg-neutral-300"
            style={{
              left: `${lqPos}%`,
              width: `${uqPos - lqPos}%`,
            }}
          />

          {/* Median marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-6 bg-neutral-700 rounded-full"
            style={{ left: `${medianPos}%` }}
          />
          <div
            className="absolute text-[10px] font-medium text-neutral-600 whitespace-nowrap"
            style={{
              left: `${medianPos}%`,
              transform: "translateX(-50%)",
              top: "-4px",
            }}
          >
            Median
          </div>

          {/* Proposed marker */}
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-md",
              result.comparison.isAboveMarket ? "bg-red-500" : "bg-green-500"
            )}
            style={{
              left: `${proposedPos}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className={cn(
              "absolute text-[10px] font-semibold whitespace-nowrap",
              result.comparison.isAboveMarket
                ? "text-red-600"
                : "text-green-600"
            )}
            style={{
              left: `${proposedPos}%`,
              transform: "translateX(-50%)",
              bottom: "-4px",
            }}
          >
            Proposed
          </div>
        </div>

        <div className="flex justify-between text-xs text-neutral-500">
          <span>Lower quartile: {GBP.format(rangeMin)}</span>
          <span>Upper quartile: {GBP.format(rangeMax)}</span>
        </div>
      </div>

      {/* Adjustments breakdown */}
      <div className="p-5 rounded-lg bg-white border border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-800 mb-3">
          Adjustments Applied
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-neutral-500 border-b border-neutral-100">
              <th className="text-left py-2 font-medium">Factor</th>
              <th className="text-right py-2 font-medium">Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            <tr>
              <td className="py-2 text-neutral-700">Condition</td>
              <td className="py-2 text-right font-mono text-neutral-900">
                {((result.adjustments.conditionFactor - 1) * 100).toFixed(0)}%
              </td>
            </tr>
            <tr>
              <td className="py-2 text-neutral-700">Furnished</td>
              <td className="py-2 text-right font-mono text-neutral-900">
                {result.adjustments.furnishedFactor > 1 ? "+" : ""}
                {((result.adjustments.furnishedFactor - 1) * 100).toFixed(0)}%
              </td>
            </tr>
            <tr>
              <td className="py-2 text-neutral-700">EPC rating</td>
              <td className="py-2 text-right font-mono text-neutral-900">
                {result.adjustments.epcFactor !== 1
                  ? `${result.adjustments.epcFactor > 1 ? "+" : ""}${((result.adjustments.epcFactor - 1) * 100).toFixed(0)}%`
                  : "None"}
              </td>
            </tr>
            <tr className="font-medium">
              <td className="py-2 text-neutral-900">Total</td>
              <td className="py-2 text-right font-mono text-neutral-900">
                {result.adjustments.totalFactor > 1 ? "+" : ""}
                {((result.adjustments.totalFactor - 1) * 100).toFixed(1)}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Area data */}
      <div className="p-5 rounded-lg bg-white border border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-800 mb-3">
          Area Data — {result.areaData.localAuthority}
        </h3>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div>
            <dt className="text-neutral-500">Region</dt>
            <dd className="font-medium text-neutral-900">
              {result.areaData.region}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Annual change</dt>
            <dd className="font-medium text-neutral-900">
              {result.areaData.annualChangePct > 0 ? "+" : ""}
              {result.areaData.annualChangePct}%
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Data period</dt>
            <dd className="font-medium text-neutral-900">
              {result.areaData.dataPeriod}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-500">Confidence</dt>
            <dd className="font-medium text-neutral-900 capitalize">
              {result.estimatedMarketRent.confidence}
            </dd>
          </div>
        </dl>
      </div>

      {/* LHA reference */}
      {result.lhaReference && (
        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
          <p className="text-sm text-neutral-600">
            <span className="font-medium text-neutral-800">LHA reference:</span>{" "}
            {result.lhaReference.brma} BRMA — LHA rate{" "}
            {GBP.format(result.lhaReference.lhaRate)} /month
            {result.lhaReference.isNearLha && (
              <span className="ml-2 text-amber-600 font-medium">
                (near LHA cap)
              </span>
            )}
          </p>
        </div>
      )}

      {/* Methodology */}
      <div className="p-5 rounded-lg bg-neutral-50 border border-neutral-200">
        <h3 className="text-sm font-semibold text-neutral-800 mb-2">
          Methodology
        </h3>
        <p className="text-sm text-neutral-600 mb-3">
          This calculation compares the proposed rent against the ONS Private
          Rent Statistics (PIPR) median for the local authority, adjusted for
          property condition, EPC rating, and furnishing status. Adjustment
          factors are informed by First-tier Tribunal (Property Chamber)
          determinations.
        </p>
        <div className="flex flex-wrap gap-2">
          {result.dataSources.map((source) => (
            <span
              key={source}
              className="inline-flex items-center px-2 py-0.5 bg-white border border-neutral-200 rounded text-xs text-neutral-600"
            >
              {source}
            </span>
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/tenant-enquiry"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-neutral-900 text-white font-semibold hover:bg-gold-700 transition-colors"
        >
          Need help challenging your increase?
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/renters-rights"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-neutral-200 text-neutral-700 font-semibold hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
        >
          Learn about your rights
        </Link>
      </div>

      {/* Start over */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Start over
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-neutral-400 text-center px-4">
        This calculator provides an indicative comparison only and does not
        constitute legal advice. Median rents are updated quarterly by the ONS.
        For advice on your specific situation, please contact our team.
      </p>
    </motion.div>
  );
}

// ============================================
// MAIN CLIENT COMPONENT
// ============================================

export function RentCalculatorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepParam = searchParams.get("step");
  const currentStep = stepParam ? Math.min(5, Math.max(1, parseInt(stepParam) || 1)) : 1;

  const [formData, setFormData] = React.useState<CalculatorFormData>(DEFAULT_FORM);
  const [result, setResult] = React.useState<CalculatorResult | null>(null);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [calcError, setCalcError] = React.useState<string | null>(null);
  const [hydrated, setHydrated] = React.useState(false);

  // Load from session on mount
  React.useEffect(() => {
    const saved = loadFormFromSession();
    if (saved) {
      setFormData((prev) => ({ ...prev, ...saved }));
    }
    setHydrated(true);
  }, []);

  // Save to session on change
  React.useEffect(() => {
    if (hydrated) {
      saveFormToSession(formData);
    }
  }, [formData, hydrated]);

  const setStep = React.useCallback(
    (step: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", String(step));
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const updateForm = React.useCallback(
    (update: Partial<CalculatorFormData>) => {
      setFormData((prev) => ({ ...prev, ...update }));
    },
    []
  );

  // Step validation
  const canProceed = React.useCallback(
    (step: number): boolean => {
      switch (step) {
        case 1:
          return Boolean(formData.postcode && formData.laName && formData.gssCode);
        case 2:
          return Boolean(formData.propertyType);
        case 3:
          return formData.proposedRentPcm > 0;
        case 4:
          return Boolean(formData.condition);
        case 5:
          return true;
        default:
          return false;
      }
    },
    [formData]
  );

  const handleNext = React.useCallback(() => {
    if (currentStep < 5 && canProceed(currentStep)) {
      setStep(currentStep + 1);
    }
  }, [currentStep, canProceed, setStep]);

  const handleBack = React.useCallback(() => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  }, [currentStep, setStep]);

  const handleCalculate = React.useCallback(async () => {
    setIsCalculating(true);
    setCalcError(null);

    try {
      const res = await fetch("/api/tools/calculate-rent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Calculation failed" }));
        throw new Error(err.error || "Calculation failed");
      }

      const data: CalculatorResult = await res.json();
      setResult(data);
    } catch (err) {
      setCalcError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsCalculating(false);
    }
  }, [formData]);

  const handleReset = React.useCallback(() => {
    setFormData(DEFAULT_FORM);
    setResult(null);
    setCalcError(null);
    clearFormSession();
    setStep(1);
  }, [setStep]);

  // Don't render until hydrated to avoid mismatch
  if (!hydrated) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="h-96 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
          </div>
        </div>
      </section>
    );
  }

  // Results view
  if (result) {
    return (
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4">
          <ResultsDisplay result={result} onReset={handleReset} />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <StepIndicator currentStep={currentStep} onStepClick={setStep} />

        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {currentStep === 1 && (
                <PostcodeInput formData={formData} onChange={updateForm} />
              )}
              {currentStep === 2 && (
                <PropertySelector formData={formData} onChange={updateForm} />
              )}
              {currentStep === 3 && (
                <RentInput formData={formData} onChange={updateForm} />
              )}
              {currentStep === 4 && (
                <ConditionSelector formData={formData} onChange={updateForm} />
              )}
              {currentStep === 5 && (
                <ReviewCard
                  formData={formData}
                  onEdit={setStep}
                  onCalculate={handleCalculate}
                  isCalculating={isCalculating}
                  calcError={calcError}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                currentStep === 1
                  ? "text-neutral-300 cursor-not-allowed"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="text-xs text-neutral-400">
              Step {currentStep} of 5
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed(currentStep)}
              className={cn(
                "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
                canProceed(currentStep)
                  ? "bg-neutral-900 text-white hover:bg-gold-700"
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              )}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
