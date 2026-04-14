import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { practiceAreas } from "@/data/practice-areas";
import { teamMembers } from "@/data/team";
import { PracticeAreaDetail } from "./practice-area-detail";

interface PracticeAreaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return practiceAreas.map((area) => ({
    slug: area.slug,
  }));
}

export async function generateMetadata({
  params,
}: PracticeAreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const area = practiceAreas.find((a) => a.slug === slug);

  if (!area) {
    return {
      title: "Practice Area Not Found",
    };
  }

  return {
    title: area.seo.title,
    description: area.seo.description,
    keywords: area.seo.keywords,
  };
}

export default async function PracticeAreaPage({
  params,
}: PracticeAreaPageProps) {
  const { slug } = await params;
  const area = practiceAreas.find((a) => a.slug === slug);

  if (!area) {
    notFound();
  }

  const areaTeamMembers = teamMembers.filter((member) =>
    area.teamMembers.includes(member.id)
  );

  const relatedAreas = practiceAreas.filter((a) =>
    area.relatedAreas.includes(a.id)
  );

  return (
    <PracticeAreaDetail
      area={area}
      teamMembers={areaTeamMembers}
      relatedAreas={relatedAreas}
    />
  );
}
