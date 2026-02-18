"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, type SelectOption } from "@/components/ui/select";
import {
  landlordIntakeSchema,
  type LandlordIntakeValues,
  type LandlordIntakeResponse,
  LANDLORD_SERVICE_TYPES,
  SERVICE_LABELS,
  type ServiceType,
} from "@/types/landlord-intake";

// ============================================
// OPTIONS
// ============================================

const contactOptions: SelectOption[] = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "either", label: "Either" },
];

const referralOptions: SelectOption[] = [
  { value: "nrla", label: "NRLA" },
  { value: "letting_agent", label: "Letting Agent" },
  { value: "google", label: "Google Search" },
  { value: "referral", label: "Referral" },
  { value: "property118", label: "Property118" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "event", label: "Event / Seminar" },
  { value: "other", label: "Other" },
];

const entityOptions: SelectOption[] = [
  { value: "individual", label: "Individual" },
  { value: "partnership", label: "Partnership" },
  { value: "limited_company", label: "Limited Company" },
  { value: "overseas", label: "Overseas Landlord" },
];

const propertyCountOptions: SelectOption[] = [
  { value: "1", label: "1 property" },
  { value: "2-5", label: "2–5 properties" },
  { value: "6-10", label: "6–10 properties" },
  { value: "11-50", label: "11–50 properties" },
  { value: "50+", label: "50+ properties" },
];

const agentUsageOptions: SelectOption[] = [
  { value: "yes_all", label: "Yes — for all properties" },
  { value: "yes_some", label: "Yes — for some properties" },
  { value: "no", label: "No — I self-manage" },
];

const periodicOptions: SelectOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

const lastUpdateOptions: SelectOption[] = [
  { value: "within_1_year", label: "Within the last year" },
  { value: "1_3_years", label: "1–3 years ago" },
  { value: "3_plus_years", label: "More than 3 years ago" },
  { value: "never", label: "Never updated" },
  { value: "dont_know", label: "Not sure" },
];

const yesNoUnsureOptions: SelectOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "unsure", label: "Not sure" },
];

const urgencyOptions: SelectOption[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "within_1_month", label: "Within the next month" },
  { value: "before_may", label: "Before May 2026 (RRA commencement)" },
  { value: "no_rush", label: "No rush — planning ahead" },
];

const budgetOptions: SelectOption[] = [
  { value: "under_500", label: "Under £500" },
  { value: "500_2000", label: "£500 – £2,000" },
  { value: "2000_5000", label: "£2,000 – £5,000" },
  { value: "5000_plus", label: "£5,000+" },
  { value: "depends", label: "Depends on scope" },
];

const propertyTypeChoices = [
  "Flat / Apartment",
  "Terraced House",
  "Semi-Detached",
  "Detached House",
  "HMO",
  "Commercial (Mixed Use)",
  "Student Let",
];

const regionChoices = [
  "London — Central",
  "London — East",
  "London — North",
  "London — South",
  "London — West",
  "South East",
  "South West",
  "Midlands",
  "North West",
  "North East",
  "Yorkshire",
  "Wales",
  "Scotland",
  "Other",
];

// ============================================
// STEP DEFINITIONS
// ============================================

const STEPS = [
  "About You",
  "Your Business",
  "Your Portfolio",
  "Current Situation",
  "Services Needed",
  "Compliance Check",
  "Timeline & Submit",
];

// ============================================
// COMPONENT
// ============================================

export function LandlordIntakeForm() {
  const [step, setStep] = React.useState(0);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");
  const [responseData, setResponseData] = React.useState<LandlordIntakeResponse | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<LandlordIntakeValues>({
    resolver: zodResolver(landlordIntakeSchema),
    defaultValues: {
      preferredContact: "either",
      languagePreference: "en",
      countryOfResidence: "United Kingdom",
      propertyCount: "1",
      propertyTypes: [],
      regions: [],
      usesLettingAgent: "no",
      activeASTs: 0,
      periodicTenancies: "unsure",
      pendingS21Notices: false,
      currentDisputes: false,
      gasSafetyCurrent: "unsure",
      electricalSafetyValid: "unsure",
      epcBelowE: "unsure",
      lastAgreementUpdate: "dont_know",
      servicesRequested: [],
      compliance: {
        tenancyAgreementsUpdated: null,
        gasSafetyValid: null,
        electricalSafetyValid: null,
        epcAboveE: null,
        noPendingS21: null,
        registeredWithAssociation: null,
        petPolicyInPlace: null,
        antiDiscriminationCompliant: null,
        readyForPrsDatabase: null,
      },
      urgencyLevel: "before_may",
      planningSale: false,
      budgetRange: "depends",
      gdprConsent: undefined as unknown as true,
      captchaToken: "dev-bypass", // Replace with Turnstile widget
    },
  });

  const entityType = watch("entityType");

  // Step validation before advancing
  const validateStep = async (): Promise<boolean> => {
    switch (step) {
      case 0:
        return trigger(["fullName", "email", "phone", "preferredContact", "referralSource"]);
      case 1:
        return trigger(["entityType", "countryOfResidence"]);
      case 2:
        return trigger(["propertyCount", "propertyTypes", "regions", "usesLettingAgent"]);
      case 3:
        return trigger([
          "activeASTs",
          "periodicTenancies",
          "pendingS21Notices",
          "currentDisputes",
          "lastAgreementUpdate",
          "gasSafetyCurrent",
          "electricalSafetyValid",
          "epcBelowE",
        ]);
      case 4:
        return trigger(["servicesRequested"]);
      case 5:
        return true; // Compliance check is all nullable
      case 6:
        return trigger(["urgencyLevel", "budgetRange", "gdprConsent"]);
      default:
        return true;
    }
  };

  const nextStep = async () => {
    const valid = await validateStep();
    if (valid && step < STEPS.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const onSubmit = async (data: LandlordIntakeValues) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/intake/landlord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: LandlordIntakeResponse = await res.json();
      if (result.success) {
        setStatus("success");
        setResponseData(result);
        setMessage(result.message);
      } else {
        setStatus("error");
        setMessage(result.message || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again or call us directly.");
    }
  };

  // ============================================
  // SUCCESS STATE
  // ============================================

  if (status === "success" && responseData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-green-50 rounded-lg text-center border border-green-200">
        <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
        <h3 className="font-serif text-2xl font-semibold text-ink mb-2">
          Enquiry Submitted
        </h3>
        <p className="text-dim mb-2">Your reference number is:</p>
        <p className="text-2xl font-bold text-gold mb-4">{responseData.ref}</p>
        <p className="text-dim mb-6 max-w-md">{message}</p>
        {responseData.scoring && (
          <div className="bg-white rounded-md border border-neutral-200 p-4 mb-6 text-left max-w-sm w-full">
            <p className="text-sm text-dim mb-1">
              <span className="font-medium">Compliance Risk:</span>{" "}
              <span
                className={cn(
                  "capitalize font-medium",
                  responseData.scoring.compliance.riskLevel === "red"
                    ? "text-red-600"
                    : responseData.scoring.compliance.riskLevel === "amber"
                      ? "text-amber-600"
                      : "text-green-600"
                )}
              >
                {responseData.scoring.compliance.riskLevel}
              </span>
            </p>
            <p className="text-sm text-dim">
              <span className="font-medium">Priority:</span>{" "}
              {responseData.scoring.lexis.priority}
            </p>
          </div>
        )}
        <p className="text-sm text-dim">
          A member of our team will be in touch shortly to discuss your requirements.
        </p>
      </div>
    );
  }

  // ============================================
  // STEP INDICATOR
  // ============================================

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-8 overflow-x-auto">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center shrink-0">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
              i < step
                ? "bg-gold text-white"
                : i === step
                  ? "bg-gold/20 text-gold border-2 border-gold"
                  : "bg-neutral-100 text-dim"
            )}
          >
            {i + 1}
          </div>
          <span
            className={cn(
              "ml-1 text-xs hidden lg:inline",
              i === step ? "text-ink font-medium" : "text-dim"
            )}
          >
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "w-4 sm:w-8 h-px mx-1",
                i < step ? "bg-gold" : "bg-neutral-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  // ============================================
  // CHECKBOX GROUP HELPERS
  // ============================================

  const watchedPropertyTypes = watch("propertyTypes") || [];
  const watchedRegions = watch("regions") || [];
  const watchedServices = watch("servicesRequested") || [];

  const toggleArrayValue = (
    field: "propertyTypes" | "regions" | "servicesRequested",
    value: string,
    current: string[]
  ) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, next as never, { shouldValidate: true });
  };

  // ============================================
  // COMPLIANCE HEALTH CHECK HELPER
  // ============================================

  const complianceQuestions: { key: keyof LandlordIntakeValues["compliance"]; label: string }[] = [
    { key: "tenancyAgreementsUpdated", label: "All tenancy agreements updated within the last 12 months" },
    { key: "gasSafetyValid", label: "Gas safety certificates are current for all properties" },
    { key: "electricalSafetyValid", label: "Electrical safety inspections are up to date" },
    { key: "epcAboveE", label: "All properties have an EPC rating of E or above" },
    { key: "noPendingS21", label: "No pending Section 21 notices that need transitioning" },
    { key: "registeredWithAssociation", label: "Registered with a landlord association (e.g. NRLA)" },
    { key: "petPolicyInPlace", label: "A pet policy is in place for all tenancies" },
    { key: "antiDiscriminationCompliant", label: "Letting practices comply with anti-discrimination requirements" },
    { key: "readyForPrsDatabase", label: "Ready for PRS Database registration when it launches" },
  ];

  // ============================================
  // RENDER
  // ============================================

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={isSubmitting} className="space-y-6">
      <StepIndicator />

      {status === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg text-red-700 border border-red-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* STEP 0: About You */}
      {step === 0 && (
        <div className="space-y-4">
          <Input label="Full Name" {...register("fullName")} error={errors.fullName?.message} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Email Address" type="email" {...register("email")} error={errors.email?.message} required />
            <Input label="Phone Number" type="tel" {...register("phone")} error={errors.phone?.message} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Preferred Contact Method" options={contactOptions} {...register("preferredContact")} />
            <Select label="How did you hear about us?" options={referralOptions} {...register("referralSource")} error={errors.referralSource?.message} required />
          </div>
          {watch("referralSource") === "other" && (
            <Input label="Please specify" {...register("referralDetail")} />
          )}
        </div>
      )}

      {/* STEP 1: Your Business */}
      {step === 1 && (
        <div className="space-y-4">
          <Select label="Entity Type" options={entityOptions} {...register("entityType")} error={errors.entityType?.message} required />
          {(entityType === "limited_company" || entityType === "partnership") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Company / Partnership Name" {...register("companyName")} />
              {entityType === "limited_company" && (
                <Input label="Companies House Number" {...register("companyNumber")} />
              )}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Country of Residence" {...register("countryOfResidence")} error={errors.countryOfResidence?.message} required />
            <Select
              label="Language Preference"
              options={[
                { value: "en", label: "English" },
                { value: "it", label: "Italian" },
              ]}
              {...register("languagePreference")}
            />
          </div>
        </div>
      )}

      {/* STEP 2: Your Portfolio */}
      {step === 2 && (
        <div className="space-y-4">
          <Select label="Number of Properties" options={propertyCountOptions} {...register("propertyCount")} error={errors.propertyCount?.message} required />

          <fieldset>
            <legend className="text-sm font-medium text-neutral-700 mb-2">
              Property Types <span className="text-error">*</span>
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {propertyTypeChoices.map((pt) => (
                <label key={pt} className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={watchedPropertyTypes.includes(pt)}
                    onChange={() => toggleArrayValue("propertyTypes", pt, watchedPropertyTypes)}
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                  {pt}
                </label>
              ))}
            </div>
            {errors.propertyTypes && (
              <p className="text-xs text-error mt-1">{errors.propertyTypes.message}</p>
            )}
          </fieldset>

          <fieldset>
            <legend className="text-sm font-medium text-neutral-700 mb-2">
              Regions <span className="text-error">*</span>
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {regionChoices.map((region) => (
                <label key={region} className="flex items-center gap-2 text-sm text-neutral-700">
                  <input
                    type="checkbox"
                    checked={watchedRegions.includes(region)}
                    onChange={() => toggleArrayValue("regions", region, watchedRegions)}
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                  {region}
                </label>
              ))}
            </div>
            {errors.regions && (
              <p className="text-xs text-error mt-1">{errors.regions.message}</p>
            )}
          </fieldset>

          <Select label="Do you use a letting agent?" options={agentUsageOptions} {...register("usesLettingAgent")} />
        </div>
      )}

      {/* STEP 3: Current Situation */}
      {step === 3 && (
        <div className="space-y-4">
          <Input
            label="Number of Active ASTs"
            type="number"
            {...register("activeASTs")}
            error={errors.activeASTs?.message}
            hint="Assured Shorthold Tenancies currently in force"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Any periodic tenancies?" options={periodicOptions} {...register("periodicTenancies")} />
            <Select label="Last tenancy agreement update" options={lastUpdateOptions} {...register("lastAgreementUpdate")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select label="Gas safety current?" options={yesNoUnsureOptions} {...register("gasSafetyCurrent")} />
            <Select label="Electrical safety valid?" options={yesNoUnsureOptions} {...register("electricalSafetyValid")} />
            <Select label="Any EPC below E?" options={yesNoUnsureOptions} {...register("epcBelowE")} />
          </div>
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 text-sm text-neutral-700">
              <input type="checkbox" {...register("pendingS21Notices")} className="h-4 w-4 rounded border-neutral-300" />
              I have pending Section 21 notices
            </label>
            <label className="flex items-center gap-3 text-sm text-neutral-700">
              <input type="checkbox" {...register("currentDisputes")} className="h-4 w-4 rounded border-neutral-300" />
              I have current disputes with tenant(s)
            </label>
            <label className="flex items-center gap-3 text-sm text-neutral-700">
              <input type="checkbox" {...register("currentTribunal")} className="h-4 w-4 rounded border-neutral-300" />
              I have a current tribunal case
            </label>
          </div>
        </div>
      )}

      {/* STEP 4: Services Needed */}
      {step === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-dim">
            Select all the services you are interested in. We will tailor a proposal based on your portfolio.
          </p>
          <fieldset>
            <legend className="text-sm font-medium text-neutral-700 mb-3">
              Services <span className="text-error">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LANDLORD_SERVICE_TYPES.map((svc) => (
                <label
                  key={svc}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-md border text-sm transition-colors cursor-pointer",
                    watchedServices.includes(svc)
                      ? "border-gold bg-gold/5 text-ink"
                      : "border-neutral-200 text-neutral-700 hover:border-neutral-300"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={watchedServices.includes(svc)}
                    onChange={() => toggleArrayValue("servicesRequested", svc, watchedServices)}
                    className="h-4 w-4 rounded border-neutral-300"
                  />
                  {SERVICE_LABELS[svc as ServiceType]}
                </label>
              ))}
            </div>
            {errors.servicesRequested && (
              <p className="text-xs text-error mt-2">{errors.servicesRequested.message}</p>
            )}
          </fieldset>
        </div>
      )}

      {/* STEP 5: Compliance Health Check */}
      {step === 5 && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
            <p className="text-sm text-amber-800">
              This quick health check helps us assess your compliance readiness for the Renters&apos; Rights Act 2025.
              Answer honestly — there are no wrong answers, and this helps us prioritise.
            </p>
          </div>
          <div className="space-y-4">
            {complianceQuestions.map(({ key, label }) => (
              <div key={key} className="flex items-start gap-4 p-3 rounded-md border border-neutral-200">
                <p className="text-sm text-neutral-700 flex-1 pt-1">{label}</p>
                <div className="flex gap-2 shrink-0">
                  {([
                    { value: true, label: "Yes" },
                    { value: false, label: "No" },
                    { value: null, label: "?" },
                  ] as const).map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() =>
                        setValue(`compliance.${key}`, opt.value, { shouldValidate: true })
                      }
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded-md border transition-colors",
                        watch(`compliance.${key}`) === opt.value
                          ? opt.value === true
                            ? "bg-green-100 border-green-300 text-green-800"
                            : opt.value === false
                              ? "bg-red-100 border-red-300 text-red-800"
                              : "bg-neutral-200 border-neutral-300 text-neutral-700"
                          : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 6: Timeline & Submit */}
      {step === 6 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="How urgently do you need help?" options={urgencyOptions} {...register("urgencyLevel")} error={errors.urgencyLevel?.message} required />
            <Select label="Budget Range" options={budgetOptions} {...register("budgetRange")} error={errors.budgetRange?.message} required />
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-neutral-700">
              <input type="checkbox" {...register("planningSale")} className="h-4 w-4 rounded border-neutral-300" />
              I am planning to sell one or more properties
            </label>
            <label className="flex items-center gap-3 text-sm text-neutral-700">
              <input type="checkbox" {...register("planningFamilyOccupation")} className="h-4 w-4 rounded border-neutral-300" />
              I am planning to move family into a property
            </label>
          </div>
          <Textarea
            label="Additional Comments"
            {...register("additionalComments")}
            placeholder="Anything else you'd like us to know..."
            rows={4}
            showCharCount
            maxLength={1000}
          />

          {/* Review Summary */}
          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h4 className="font-medium text-ink mb-3">Review your submission</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-dim">Name:</dt>
                <dd className="text-ink font-medium">{watch("fullName")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dim">Entity:</dt>
                <dd className="text-ink capitalize">{watch("entityType")?.replace("_", " ")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dim">Properties:</dt>
                <dd className="text-ink">{watch("propertyCount")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dim">Services:</dt>
                <dd className="text-ink text-right max-w-[60%]">
                  {watchedServices.length > 0
                    ? watchedServices.map((s) => SERVICE_LABELS[s as ServiceType]).join(", ")
                    : "—"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dim">Urgency:</dt>
                <dd className="text-ink capitalize">{watch("urgencyLevel")?.replace("_", " ")}</dd>
              </div>
            </dl>
          </div>

          {/* Consent */}
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input type="checkbox" {...register("gdprConsent")} className="mt-1 h-4 w-4 rounded border-neutral-300" />
              <span className="text-sm text-neutral-700">
                I have read and accept the{" "}
                <a href="/privacy-policy" className="underline text-gold hover:text-gold-deep" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
                . I understand my information will be processed in accordance with UK GDPR for the purpose of providing legal services. <span className="text-error">*</span>
              </span>
            </label>
            {errors.gdprConsent && (
              <p className="text-xs text-error ml-7">{errors.gdprConsent.message}</p>
            )}
            <label className="flex items-start gap-3">
              <input type="checkbox" {...register("marketingConsent")} className="mt-1 h-4 w-4 rounded border-neutral-300" />
              <span className="text-sm text-neutral-700">
                I agree to receive occasional updates about Stone & Co. compliance services and regulatory changes.
              </span>
            </label>
          </div>
        </div>
      )}

      {/* NAVIGATION */}
      <div className="flex justify-between pt-4 border-t border-neutral-200">
        {step > 0 ? (
          <Button type="button" variant="secondary" onClick={prevStep}>
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        ) : (
          <div />
        )}

        {step < STEPS.length - 1 ? (
          <Button type="button" onClick={nextStep}>
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button type="submit" variant="cta" loading={status === "submitting"}>
            {status === "submitting" ? "Submitting..." : "Submit Enquiry"}
          </Button>
        )}
      </div>
      </fieldset>
    </form>
  );
}
