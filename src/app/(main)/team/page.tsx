import type { Metadata } from "next";
import { teamMembers } from "@/data/team";
import { TeamContent } from "./team-content";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Meet the solicitors at Stone & Co. Our team specialises in tenancy deposit claims, immigration, and rent repayment orders across London.",
};

export default function TeamPage() {
  const sortedMembers = [...teamMembers].sort((a, b) => a.order - b.order);
  return <TeamContent teamMembers={sortedMembers} />;
}
