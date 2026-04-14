import type { Metadata } from "next";
import { practiceAreas } from "@/data/practice-areas";
import { PracticeAreasContent } from "./practice-areas-content";

export const metadata: Metadata = {
  title: "Practice Areas",
  description:
    "Specialist legal services for tenancy deposit claims, immigration, and rent repayment orders. Stone & Co. Solicitors — London.",
};

export default function PracticeAreasPage() {
  return <PracticeAreasContent practiceAreas={practiceAreas} />;
}
