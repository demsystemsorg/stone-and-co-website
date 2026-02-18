"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, type SelectOption } from "@/components/ui/select";
import { contactFormSchema, type ContactFormValues } from "@/types/contact";
import { PRACTICE_AREAS } from "@/lib/constants";

const practiceAreaOptions: SelectOption[] = [
  { value: "general", label: "General Enquiry" },
  ...PRACTICE_AREAS.map((area) => ({
    value: area.id,
    label: area.title,
  })),
];

const officeOptions: SelectOption[] = [
  { value: "no-preference", label: "No Preference" },
  { value: "city", label: "City Office (EC2Y)" },
  { value: "leytonstone", label: "Leytonstone Office (E11)" },
];

const hearAboutUsOptions: SelectOption[] = [
  { value: "google", label: "Google Search" },
  { value: "referral", label: "Referral from Friend/Family" },
  { value: "social", label: "Social Media" },
  { value: "other", label: "Other" },
];

export function ContactForm() {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(contactFormSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      practiceArea: "",
      officePreference: "no-preference",
      message: "",
      hearAboutUs: "",
      marketingConsent: false,
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("submitting");

    try {
      // In production, this would call a server action
      // For now, simulate a successful submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Form submitted:", data);
      setStatus("success");
      setMessage("Thank you for your message. We will get back to you within 24 hours.");
      reset();
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again or call us directly.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 bg-green-500/20 rounded-lg text-center border border-green-500/30">
        <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
        <h3 className="font-display text-xl font-semibold text-white mb-2">
          Message Sent Successfully
        </h3>
        <p className="text-neutral-400 mb-6">{message}</p>
        <Button
          variant="secondary"
          onClick={() => {
            setStatus("idle");
            setMessage("");
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        {...register("hearAboutUs")}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Error message */}
      {status === "error" && (
        <div className="flex items-center gap-3 p-4 bg-red-500/20 rounded-lg text-red-400 border border-red-500/30">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Name fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          {...register("firstName")}
          error={errors.firstName?.message}
          required
        />
        <Input
          label="Last Name"
          {...register("lastName")}
          error={errors.lastName?.message}
          required
        />
      </div>

      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          required
        />
        <Input
          label="Phone Number"
          type="tel"
          {...register("phone")}
          error={errors.phone?.message}
          hint="Optional"
        />
      </div>

      {/* Selection fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Practice Area"
          options={practiceAreaOptions}
          {...register("practiceArea")}
        />
        <Select
          label="Preferred Office"
          options={officeOptions}
          {...register("officePreference")}
        />
      </div>

      {/* Message */}
      <Textarea
        label="Your Message"
        {...register("message")}
        error={errors.message?.message}
        placeholder="Please describe your legal matter and how we can help..."
        rows={5}
        required
      />

      {/* Marketing consent */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="marketingConsent"
          {...register("marketingConsent")}
          className="mt-1 h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-gold-600 focus:ring-gold-500 focus:ring-offset-neutral-900"
        />
        <label htmlFor="marketingConsent" className="text-sm text-neutral-400">
          I agree to receive occasional updates about Stone & Co. Solicitors' services.
          You can unsubscribe at any time.
        </label>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        loading={status === "submitting"}
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>

      {/* Privacy note */}
      <p className="text-xs text-neutral-500">
        By submitting this form, you agree to our{" "}
        <a href="/privacy-policy" className="underline hover:text-gold-400">
          Privacy Policy
        </a>
        . Your information will be handled in accordance with GDPR.
      </p>
    </form>
  );
}
