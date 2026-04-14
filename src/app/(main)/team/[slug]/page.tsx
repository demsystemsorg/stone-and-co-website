import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { teamMembers, getTeamMember } from "@/data/team";
import { practiceAreas } from "@/data/practice-areas";
import { TeamMemberDetail } from "./team-member-detail";

interface TeamMemberPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return teamMembers.map((member) => ({
    slug: member.slug,
  }));
}

export async function generateMetadata({
  params,
}: TeamMemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMember(slug);

  if (!member) {
    return { title: "Team Member Not Found" };
  }

  return {
    title: `${member.name} — ${member.title}`,
    description: member.bio,
  };
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const { slug } = await params;
  const member = getTeamMember(slug);

  if (!member) {
    notFound();
  }

  const relatedPracticeAreas = practiceAreas.filter((area) =>
    member.practiceAreas.includes(area.id)
  );

  const otherMembers = teamMembers
    .filter((m) => m.id !== member.id)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  return (
    <TeamMemberDetail
      member={member}
      relatedPracticeAreas={relatedPracticeAreas}
      otherMembers={otherMembers}
    />
  );
}
