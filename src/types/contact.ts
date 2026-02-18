/**
 * Contact form type definitions
 */

import { z } from "zod";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  practiceArea?: string;
  officePreference?: "city" | "leytonstone" | "no-preference";
  message: string;
  hearAboutUs?: string;
  marketingConsent: boolean;
}

export const contactFormSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[\d\s+()-]*$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  practiceArea: z.string().optional(),
  officePreference: z.enum(["city", "leytonstone", "no-preference"]),
  message: z
    .string()
    .min(10, "Please provide more detail (at least 10 characters)")
    .max(2000, "Message must be less than 2000 characters"),
  hearAboutUs: z.string().optional(),
  marketingConsent: z.boolean(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export interface ContactFormState {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
}

export interface Office {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  phone: string;
  email: string;
  hours: {
    weekday: string;
    saturday?: string;
    sunday?: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  mapUrl: string;
}
