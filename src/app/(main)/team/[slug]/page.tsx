import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, Globe, ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero } from "@/components/sections";
import { Section, Button, Container } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { TeamMemberCard, CTABanner } from "@/components/common";
import { teamMembers, getTeamMember } from "@/data/team";
import { PRACTICE_AREAS } from "@/lib/constants";

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
    return {
      title: "Team Member Not Found",
    };
  }

  return {
    title: `${member.name} - ${member.title}`,
    description: member.bio,
  };
}

export default async function TeamMemberPage({ params }: TeamMemberPageProps) {
  const { slug } = await params;
  const member = getTeamMember(slug);

  if (!member) {
    notFound();
  }

  // Get related practice areas
  const relatedPracticeAreas = PRACTICE_AREAS.filter((area) =>
    member.practiceAreas.includes(area.id)
  );

  // Get other team members for "Meet the rest of the team" section
  const otherMembers = teamMembers
    .filter((m) => m.id !== member.id)
    .sort((a, b) => a.order - b.order)
    .slice(0, 3);

  return (
    <>
      {/* Hero with gradient background */}
      <section className="relative bg-neutral-900 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(184,134,11,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(184,134,11,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <Container className="relative">
          {/* Back link */}
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Team</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 rounded-lg overflow-hidden">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent" />
            </div>

            {/* Info */}
            <div className="text-center lg:text-left">
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                {member.specializations.map((spec) => (
                  <Badge key={spec} variant="gold" size="md">
                    {spec}
                  </Badge>
                ))}
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-2">
                {member.name}
              </h1>

              <p className="text-xl text-gold-400 font-medium mb-4">
                {member.title}
              </p>

              <p className="text-neutral-400 mb-6">
                {member.qualifications.join(" | ")}
              </p>

              {/* Contact info */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-white hover:text-gold-400 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span>{member.email}</span>
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="inline-flex items-center gap-2 text-white hover:text-gold-400 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span>{member.phone}</span>
                  </a>
                )}
              </div>

              {/* Languages */}
              {member.languages && member.languages.length > 0 && (
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Globe className="w-5 h-5 text-neutral-500" />
                  <span className="text-neutral-400">
                    Languages: {member.languages.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Bio Section */}
      <Section variant="default" padding="lg">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
            About {member.name.split(" ")[0]}
          </h2>
          <div className="prose prose-lg max-w-none text-text-secondary">
            <p>{member.bio}</p>
          </div>
        </div>
      </Section>

      {/* Practice Areas */}
      {relatedPracticeAreas.length > 0 && (
        <Section variant="alternate" padding="lg">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-8 text-center">
              Areas of Practice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPracticeAreas.map((area) => (
                <Link
                  key={area.id}
                  href={`/practice-areas/${area.id}`}
                  className="group flex items-start gap-4 p-6 bg-white rounded-lg border border-neutral-200 hover:border-gold-300 hover:shadow-md transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gold-100 text-gold-600 flex items-center justify-center group-hover:bg-gold-200 transition-colors">
                    <span className="text-xl">{area.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1 group-hover:text-gold-700 transition-colors">
                      {area.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {area.shortDescription}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-gold-600 transition-colors flex-shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Other Team Members */}
      <Section variant="default" padding="lg">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Meet the Rest of Our Team
          </h2>
          <p className="text-text-secondary">
            Our solicitors work together to provide comprehensive legal support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {otherMembers.map((m) => (
            <TeamMemberCard
              key={m.id}
              name={m.name}
              title={m.title}
              image={m.image}
              specializations={m.specializations}
              href={`/team/${m.slug}`}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="secondary" asChild>
            <Link href="/team">View All Team Members</Link>
          </Button>
        </div>
      </Section>

      {/* CTA */}
      <CTABanner
        title={`Speak with ${member.name.split(" ")[0]}`}
        subtitle="Contact us today to discuss your legal matter and how we can help."
      />
    </>
  );
}
