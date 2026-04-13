import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/sections";
import { BreadcrumbSchema } from "@/components/seo";
import { RentCalculatorClient } from "./rent-calculator-client";

export const metadata: Metadata = {
  title: "Rent Calculator | Check if Your Rent is Fair",
  description:
    "Use our free rent calculator to compare your rent against official ONS data. Find out if your rent is fair, whether a proposed increase is reasonable, and what options you have.",
  keywords: [
    "rent calculator",
    "fair rent check",
    "ONS rent data",
    "rent increase challenge",
    "market rent comparison",
    "rent repayment order",
  ],
};

export default function RentCalculatorPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "Rent Calculator", href: "/tools/rent-calculator" },
        ]}
      />

      <PageHero
        title="Rent Calculator"
        subtitle="Check your rent against official market data from the ONS Private Rent Statistics. Find out if you are overpaying and understand your options."
        variant="dark"
        size="md"
      />

      <Suspense fallback={null}>
        <RentCalculatorClient />
      </Suspense>
    </>
  );
}
