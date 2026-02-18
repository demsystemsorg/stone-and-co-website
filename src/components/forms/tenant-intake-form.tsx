"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, AlertCircle, ChevronRight, ChevronLeft, Shield, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, type SelectOption } from "@/components/ui/select";
import {
  tenantIntakeSchema,
  type TenantIntakeValues,
  type TenantIntakeResponse,
  RRA_CLAIM_TYPES,
  RRA_CLAIM_LABELS,
  type RraClaimType,
} from "@/types/tenant-intake";

// ============================================
// OPTIONS — all in plain English
// ============================================

const claimOptions: SelectOption[] = RRA_CLAIM_TYPES.map((type) => ({
  value: type,
  label: RRA_CLAIM_LABELS[type],
}));

const urgencyOptions: SelectOption[] = [
  { value: "low", label: "No rush — I'd like some advice" },
  { value: "medium", label: "Fairly soon — within the next few weeks" },
  { value: "high", label: "Quite urgent — there's a deadline coming up" },
  { value: "urgent", label: "Very urgent — I need help right now" },
];

const contactOptions: SelectOption[] = [
  { value: "either", label: "Phone or email — either is fine" },
  { value: "phone", label: "Phone call" },
  { value: "email", label: "Email only" },
];

const officeOptions: SelectOption[] = [
  { value: "no-preference", label: "No preference" },
  { value: "city", label: "City of London" },
  { value: "leytonstone", label: "Leytonstone, East London" },
];

const tenancyTypeOptions: SelectOption[] = [
  { value: "ast", label: "I signed a tenancy agreement" },
  { value: "periodic", label: "My fixed term ended but I'm still here" },
  { value: "lodger", label: "I rent a room in someone's home" },
  { value: "other", label: "Something else" },
  { value: "unsure", label: "I'm not sure" },
];

const landlordTypeOptions: SelectOption[] = [
  { value: "private", label: "Private landlord" },
  { value: "council", label: "Council" },
  { value: "housing_association", label: "Housing association" },
  { value: "other", label: "Other / not sure" },
];

// ============================================
// STEPS
// ============================================

const STEPS = ["About You", "What's Happening?", "A Few More Details", "Send"];

// ============================================
// STEP INTRO COPY
// ============================================

const STEP_INTROS = [
  "We just need your name and a way to reach you. This is completely confidential.",
  "Tell us what's going on in your own words. There are no wrong answers.",
  "These extra details help us prepare before we call you. Skip anything you're not sure about.",
  "Check everything looks right, then hit send. We'll be in touch.",
];

// ============================================
// COMPONENT
// ============================================

export function TenantIntakeForm() {
  const [step, setStep] = React.useState(0);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");
  const [responseData, setResponseData] = React.useState<TenantIntakeResponse | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<TenantIntakeValues>({
    resolver: zodResolver(tenantIntakeSchema),
    defaultValues: {
      preferredContact: "either",
      officePreference: "no-preference",
      urgency: "medium",
      gdprConsent: undefined as unknown as true,
      privacyPolicyVersion: "2026-02-01",
      captchaToken: "dev-bypass",
    },
  });

  const issueType = watch("issueType") as RraClaimType | undefined;
  const isSubmitting = status === "submitting";

  const validateStep = async (): Promise<boolean> => {
    switch (step) {
      case 0:
        return trigger(["fullName", "phone", "postcode", "preferredContact"]);
      case 1:
        return trigger(["issueType", "summary", "urgency"]);
      case 2:
        return true;
      case 3:
        return trigger(["gdprConsent"]);
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

  const onSubmit = async (data: TenantIntakeValues) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/intake/tenant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result: TenantIntakeResponse = await res.json();
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
  // SUCCESS
  // ============================================

  if (status === "success" && responseData) {
    const callbackText =
      responseData.triage?.action === "immediate_call"
        ? "A solicitor will call you within 2 hours."
        : responseData.triage?.action === "priority_review"
          ? "A solicitor will call you within 4 hours during business hours."
          : "We'll be in touch within 2 working days.";

    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-green-50 rounded-lg text-center border border-green-200">
        <CheckCircle className="w-14 h-14 text-green-600 mb-5" />
        <h3 className="font-serif text-2xl font-semibold text-neutral-900 mb-2">
          We&apos;ve got your details
        </h3>
        <p className="text-neutral-600 mb-6 max-w-md">
          Your reference number is <span className="font-bold text-[var(--gold)]">{responseData.ref}</span>.
          Keep this safe in case you need to call us.
        </p>

        <div className="bg-white rounded-lg border border-neutral-200 p-5 mb-6 text-left max-w-sm w-full">
          <h4 className="font-medium text-neutral-900 mb-3 text-sm">What happens next?</h4>
          <div className="flex items-start gap-3 mb-3">
            <Clock className="w-5 h-5 text-[var(--gold)] mt-0.5 shrink-0" />
            <p className="text-sm text-neutral-700">{callbackText}</p>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-[var(--gold)] mt-0.5 shrink-0" />
            <p className="text-sm text-neutral-700">
              Everything you&apos;ve told us is confidential and protected by solicitor-client privilege.
            </p>
          </div>
        </div>

        <p className="text-sm text-neutral-500">
          Need to speak to someone now? Call{" "}
          <a href="tel:02071180530" className="text-[var(--gold)] font-medium hover:underline">
            020 7118 0530
          </a>
        </p>
      </div>
    );
  }

  // ============================================
  // STEP INDICATOR
  // ============================================

  const StepIndicator = () => (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="flex items-center gap-1 mb-3">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i <= step ? "bg-[var(--gold)]" : "bg-neutral-200"
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-900">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
        <p className="text-xs text-neutral-400">
          {step === 0 ? "~2 min" : step === STEPS.length - 1 ? "Almost done" : ""}
        </p>
      </div>
    </div>
  );

  // ============================================
  // CATEGORY-SPECIFIC FIELDS (plain English)
  // ============================================

  const CategoryFields = () => {
    if (!issueType) return null;

    switch (issueType) {
      case "rra_s21_defence":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-900">About the notice you received</h4>
            <p className="text-sm text-neutral-500">If you have the notice to hand, these dates help us check whether it&apos;s valid.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="When was the notice given to you?" type="date" {...register("s21NoticeServedDate")} hint="Check the date on the letter" />
              <Input label="When does it say you have to leave by?" type="date" {...register("s21NoticeExpiryDate")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Is there a court date? (if any)" type="date" {...register("s21CourtDate")} />
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="s21Proceedings" {...register("s21ProceedingsIssued")} className="h-4 w-4 rounded border-neutral-300" />
                <label htmlFor="s21Proceedings" className="text-sm text-neutral-700">Court papers have been filed</label>
              </div>
            </div>
            <fieldset>
              <legend className="text-sm font-medium text-neutral-700 mb-2">Which of these did your landlord give you when you moved in?</legend>
              <p className="text-xs text-neutral-400 mb-2">Tick any that apply — don&apos;t worry if you&apos;re not sure</p>
              <div className="grid grid-cols-2 gap-2">
                {["deposit_cert", "gas_cert", "epc", "how_to_rent"].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input type="checkbox" value={item} {...register("s21PrescribedInfo")} className="h-4 w-4 rounded border-neutral-300" />
                    {item === "deposit_cert" ? "Deposit protection certificate" : item === "gas_cert" ? "Gas safety certificate" : item === "epc" ? "Energy performance certificate" : "How to Rent booklet"}
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        );

      case "rra_unlawful_eviction":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-900">Tell us what happened</h4>
            <Select label="What did your landlord do?" options={[
              { value: "lockout", label: "Changed the locks while I was out" },
              { value: "harassment", label: "Made life unbearable so I'd leave" },
              { value: "threats", label: "Threatened me" },
              { value: "belongings_removed", label: "Removed or threw away my belongings" },
              { value: "other", label: "Something else" },
            ]} {...register("evictionType")} />
            <Input label="When did this happen?" type="date" {...register("evictionDate")} />
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input type="checkbox" {...register("currentlyInProperty")} className="h-4 w-4 rounded border-neutral-300" />
                I&apos;m still in the property
              </label>
              <label className="flex items-center gap-2 text-sm text-neutral-700">
                <input type="checkbox" {...register("policeContacted")} className="h-4 w-4 rounded border-neutral-300" />
                I&apos;ve called the police
              </label>
            </div>
          </div>
        );

      case "rra_rent_increase":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-900">About the rent increase</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="What do you currently pay? (£)" type="number" step="0.01" {...register("currentRent")} />
              <Input label="What are they asking for? (£)" type="number" step="0.01" {...register("proposedRent")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="How often do you pay?" options={[
                { value: "monthly", label: "Monthly" },
                { value: "weekly", label: "Weekly" },
              ]} {...register("rentFrequency")} />
              <Input label="When did they tell you about the increase?" type="date" {...register("section13NoticeDate")} hint="The date on any letter or notice" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="When did your tenancy start?" type="date" {...register("tenancyStartDate")} />
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" id="initialRent" {...register("isInitialRent")} className="h-4 w-4 rounded border-neutral-300" />
                <label htmlFor="initialRent" className="text-sm text-neutral-700">This is my first rent increase here</label>
              </div>
            </div>
          </div>
        );

      case "rra_housing_disrepair":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-900">What&apos;s wrong with your home?</h4>
            <fieldset>
              <legend className="text-sm font-medium text-neutral-700 mb-2">Tick everything that applies</legend>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "damp", label: "Damp" },
                  { value: "mould", label: "Mould" },
                  { value: "heating", label: "Heating not working" },
                  { value: "plumbing", label: "Plumbing or leaks" },
                  { value: "electrical", label: "Electrical problems" },
                  { value: "structural", label: "Cracks or structural issues" },
                  { value: "pest", label: "Pests (mice, insects, etc.)" },
                  { value: "other", label: "Something else" },
                ].map((d) => (
                  <label key={d.value} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input type="checkbox" value={d.value} {...register("defectTypes")} className="h-4 w-4 rounded border-neutral-300" />
                    {d.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="When did you first tell your landlord?" type="date" {...register("defectFirstReportedDate")} />
              <div className="flex items-center gap-3 pt-6">
                <input type="checkbox" {...register("reportedToLandlord")} className="h-4 w-4 rounded border-neutral-300" />
                <label className="text-sm text-neutral-700">I&apos;ve reported it in writing</label>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="healthImpact" {...register("healthImpact")} className="h-4 w-4 rounded border-neutral-300" />
              <label htmlFor="healthImpact" className="text-sm text-neutral-700">This has affected my health or my family&apos;s health</label>
            </div>
            {watch("healthImpact") && (
              <Textarea label="How has it affected your health?" {...register("healthDetails")} placeholder="For example: breathing problems, allergies, stress, children getting ill..." rows={3} />
            )}
          </div>
        );

      case "rra_discrimination":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-900">What happened?</h4>
            <fieldset>
              <legend className="text-sm font-medium text-neutral-700 mb-2">I was treated unfairly because of...</legend>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: "benefits", label: "I receive benefits" },
                  { value: "children", label: "I have children" },
                  { value: "race", label: "My race or ethnicity" },
                  { value: "disability", label: "A disability" },
                  { value: "religion", label: "My religion" },
                  { value: "other", label: "Another reason" },
                ].map((t) => (
                  <label key={t.value} className="flex items-center gap-2 text-sm text-neutral-700">
                    <input type="checkbox" value={t.value} {...register("discriminationType")} className="h-4 w-4 rounded border-neutral-300" />
                    {t.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <Input label="When did this happen?" type="date" {...register("discriminationDate")} />
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" {...register("discriminationEvidence")} className="h-4 w-4 rounded border-neutral-300" />
              I have written evidence (emails, text messages, screenshots)
            </label>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800 mb-2">
                To help with your claim, we need your permission to handle some sensitive personal information.
                This is kept strictly confidential.
              </p>
              <label className="flex items-center gap-2 text-sm font-medium text-amber-900">
                <input type="checkbox" {...register("sensitiveDataConsent")} className="h-4 w-4 rounded border-amber-300" />
                I give my permission
              </label>
              {errors.sensitiveDataConsent && (
                <p className="text-xs text-error mt-1">{errors.sensitiveDataConsent.message}</p>
              )}
            </div>
          </div>
        );

      case "rra_pet_refusal":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-900">About your pet request</h4>
            <Input label="What kind of pet?" {...register("petType")} placeholder="e.g. Dog, Cat, Rabbit" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="When did you ask your landlord?" type="date" {...register("petRequestDate")} />
              <Select label="What did they say?" options={[
                { value: "refused", label: "They said no" },
                { value: "no_response", label: "They didn't reply" },
                { value: "conditions", label: "They said yes, but with conditions" },
                { value: "approved", label: "They said yes" },
              ]} {...register("petLandlordResponse")} />
            </div>
          </div>
        );

      case "rra_deposit_advance":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-900">What happened with your deposit or payments?</h4>
            <Select label="What's the problem?" options={[
              { value: "unprotected", label: "My deposit isn't in a protection scheme" },
              { value: "excess_advance", label: "I was asked to pay more than 1 month upfront" },
              { value: "not_returned", label: "I've moved out but my deposit hasn't been returned" },
              { value: "unfair_deductions", label: "They took money from my deposit unfairly" },
            ]} {...register("depositIssueType")} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="How much did you pay? (£)" type="number" step="0.01" {...register("depositAmountPaid")} />
              <Input label="What's your monthly rent? (£)" type="number" step="0.01" {...register("monthlyRent")} />
            </div>
          </div>
        );

      case "rra_rental_bidding":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-900">About the rent bidding</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="What was the advertised rent? (£)" type="number" step="0.01" {...register("advertisedRent")} />
              <Input label="What were you asked to pay? (£)" type="number" step="0.01" {...register("askedRent")} />
            </div>
            <Select label="Who asked you to pay more?" options={[
              { value: "landlord", label: "The landlord" },
              { value: "agent", label: "The letting agent" },
              { value: "other", label: "Someone else" },
            ]} {...register("biddingByWhom")} />
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" {...register("biddingEvidence")} className="h-4 w-4 rounded border-neutral-300" />
              I have proof (emails, messages, or a screenshot of the listing)
            </label>
          </div>
        );

      case "rra_written_terms":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-900">About your tenancy agreement</h4>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" {...register("writtenTermsReceived")} className="h-4 w-4 rounded border-neutral-300" />
              I have some kind of written agreement (even if I think it&apos;s incomplete)
            </label>
          </div>
        );

      case "rra_general_advisory":
        return (
          <div className="space-y-4">
            <h4 className="font-medium text-neutral-900">What would you like advice about?</h4>
            <Input label="Briefly, what's on your mind?" {...register("advisoryTopic")} placeholder="e.g. I want to know my rights before signing a new lease" />
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <fieldset disabled={isSubmitting} className="space-y-6">
      <StepIndicator />

      {/* Step intro */}
      <p className="text-sm text-neutral-500 -mt-2">{STEP_INTROS[step]}</p>

      {status === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg text-red-700 border border-red-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* STEP 0: About You */}
      {step === 0 && (
        <div className="space-y-4">
          <Input label="Your name" {...register("fullName")} error={errors.fullName?.message} placeholder="Full name" required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Phone number" type="tel" {...register("phone")} error={errors.phone?.message} placeholder="07..." required hint="So we can call you back" />
            <Input label="Email" type="email" {...register("email")} error={errors.email?.message} hint="Optional — but useful for sending documents" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Your postcode" {...register("postcode")} error={errors.postcode?.message} placeholder="e.g. E11 1AA" required hint="The property you're having issues with" />
            <Select label="Best way to reach you?" options={contactOptions} {...register("preferredContact")} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="safeVoicemail" {...register("safeVoicemail")} className="h-4 w-4 rounded border-neutral-300" />
            <label htmlFor="safeVoicemail" className="text-sm text-neutral-700">It&apos;s safe to leave a voicemail at this number</label>
          </div>
        </div>
      )}

      {/* STEP 1: What's Happening? */}
      {step === 1 && (
        <div className="space-y-4">
          <Select label="Which of these best describes your situation?" options={claimOptions} {...register("issueType")} error={errors.issueType?.message} required />
          <Textarea
            label="Tell us what's going on"
            {...register("summary")}
            error={errors.summary?.message}
            placeholder="In your own words, what's happened? Include any dates or details you can remember. Don't worry about getting the legal terms right — just tell us your story."
            rows={5}
            showCharCount
            maxLength={2000}
            required
          />
          <Select label="How soon do you need help?" options={urgencyOptions} {...register("urgency")} error={errors.urgency?.message} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="What type of tenancy do you have?" options={tenancyTypeOptions} {...register("tenancyType")} hint="Pick the closest match — it's fine if you're not sure" />
            <Select label="Who is your landlord?" options={landlordTypeOptions} {...register("landlordType")} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="hasChildren" {...register("hasChildren")} className="h-4 w-4 rounded border-neutral-300" />
            <label htmlFor="hasChildren" className="text-sm text-neutral-700">There are children living in the property</label>
          </div>
        </div>
      )}

      {/* STEP 2: A Few More Details */}
      {step === 2 && (
        <div className="space-y-4">
          <CategoryFields />
          {!issueType && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-800">Please go back to step 2 and tell us what your issue is about.</p>
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Send */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-200">
            <h4 className="font-medium text-neutral-900 mb-3">Here&apos;s what you&apos;ve told us</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Name:</dt>
                <dd className="text-neutral-900 font-medium">{watch("fullName")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Phone:</dt>
                <dd className="text-neutral-900">{watch("phone")}</dd>
              </div>
              {watch("email") && (
                <div className="flex justify-between">
                  <dt className="text-neutral-500">Email:</dt>
                  <dd className="text-neutral-900">{watch("email")}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-neutral-500">Postcode:</dt>
                <dd className="text-neutral-900">{watch("postcode")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Issue:</dt>
                <dd className="text-neutral-900">{issueType ? RRA_CLAIM_LABELS[issueType] : "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Urgency:</dt>
                <dd className="text-neutral-900 capitalize">{watch("urgency")}</dd>
              </div>
            </dl>
            {watch("summary") && (
              <div className="mt-3 pt-3 border-t border-neutral-200">
                <dt className="text-neutral-500 text-sm mb-1">Your description:</dt>
                <dd className="text-neutral-900 text-sm line-clamp-3">{watch("summary")}</dd>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input type="checkbox" {...register("gdprConsent")} className="mt-1 h-4 w-4 rounded border-neutral-300" />
              <span className="text-sm text-neutral-700">
                I&apos;m happy for Stone & Co. Solicitors to use my information to help with my enquiry.
                Read our{" "}
                <a href="/privacy-policy" className="underline text-[var(--gold)] hover:text-[#b8963e]" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>. <span className="text-error">*</span>
              </span>
            </label>
            {errors.gdprConsent && (
              <p className="text-xs text-error ml-7">{errors.gdprConsent.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Your information is encrypted and protected by solicitor-client confidentiality.</span>
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
            Continue <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button type="submit" variant="cta" loading={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send My Enquiry"}
          </Button>
        )}
      </div>
      </fieldset>
    </form>
  );
}
