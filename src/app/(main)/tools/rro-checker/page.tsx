import type { Metadata } from "next";
import { PageHero } from "@/components/sections";
import { BreadcrumbSchema } from "@/components/seo";
import { RroCheckerClient } from "./rro-checker-client";

export const metadata: Metadata = {
  title: "RRO Checker | Free Rent Repayment Order Eligibility Tool",
  description:
    "Check your eligibility for a Rent Repayment Order (RRO) with our free tool. Covers Housing and Planning Act 2016 and Renters' Rights Act 2025 offences.",
  keywords: [
    "rent repayment order",
    "RRO checker",
    "RRO eligibility",
    "housing offence",
    "renters rights act 2025",
    "unlicensed HMO",
    "tenant claim",
  ],
};

export default function RroCheckerPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", href: "/" },
          { name: "Tools", href: "/tools" },
          { name: "RRO Checker", href: "/tools/rro-checker" },
        ]}
      />

      <PageHero
        title="Rent Repayment Order Checker"
        subtitle="Check your eligibility for a Rent Repayment Order — free, confidential, and takes under 10 minutes."
        variant="dark"
        size="md"
      />

      <RroCheckerClient />
    </>
  );
}
