"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { TeamMemberCard } from "@/components/common/team-member-card";
import { featuredTeamMembers } from "@/data/team";

export interface TeamPreviewProps {
  title?: string;
  subtitle?: string;
}

export function TeamPreview({
  title = "Meet Our Team",
  subtitle = "Our experienced solicitors are dedicated to achieving the best outcomes for every client.",
}: TeamPreviewProps) {
  return (
    <Section variant="alternate" padding="lg" topEffect="fade">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl">{subtitle}</p>
        </div>
        <Button variant="secondary" asChild className="shrink-0">
          <Link href="/team">
            View Full Team
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {/* Team grid — no stagger animations, cards just present */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {featuredTeamMembers.slice(0, 3).map((member) => (
          <div key={member.id}>
            <TeamMemberCard
              name={member.name}
              title={member.title}
              image={member.image}
              specializations={member.specializations}
              href={`/team/${member.slug}`}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
