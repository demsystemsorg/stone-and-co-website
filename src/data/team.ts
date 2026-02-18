import type { TeamMember } from "@/types/team";

/**
 * Team member data
 * Note: Images and some details are placeholders - to be updated with actual content
 */
export const teamMembers: TeamMember[] = [
  {
    id: "1",
    slug: "sarah-stone",
    name: "Sarah Stone",
    title: "Managing Partner",
    qualifications: ["LLB (Hons)", "Solicitor"],
    image: "/images/team/placeholder-1.jpg",
    bio: "Sarah founded Stone & Co. Solicitors with a vision to provide accessible, high-quality legal services to the London community. With over 20 years of experience in family law and immigration, she leads our team with dedication and expertise.",
    specializations: ["Family Law", "Immigration"],
    practiceAreas: ["family-law", "immigration"],
    email: "sarah@stonelegal.co.uk",
    languages: ["English", "Italian"],
    featured: true,
    order: 1,
  },
  {
    id: "2",
    slug: "james-mitchell",
    name: "James Mitchell",
    title: "Senior Solicitor",
    qualifications: ["LLB (Hons)", "LLM", "Solicitor"],
    image: "/images/team/placeholder-2.jpg",
    bio: "James specializes in employment law and criminal defense, bringing a meticulous approach to every case. His experience spans both employer and employee representation, giving him unique insight into workplace disputes.",
    specializations: ["Employment Law", "Criminal Law"],
    practiceAreas: ["employment-law", "criminal-law"],
    email: "james@stonelegal.co.uk",
    languages: ["English"],
    featured: true,
    order: 2,
  },
  {
    id: "3",
    slug: "maria-rossi",
    name: "Maria Rossi",
    title: "Associate Solicitor",
    qualifications: ["LLB (Hons)", "Solicitor"],
    image: "/images/team/placeholder-3.jpg",
    bio: "Maria is fluent in Italian and leads our Consulenti Italiani service, providing dedicated support to the Italian community in London. She specializes in immigration and family matters.",
    specializations: ["Immigration", "Family Law"],
    practiceAreas: ["immigration", "family-law"],
    email: "maria@stonelegal.co.uk",
    languages: ["English", "Italian"],
    featured: true,
    order: 3,
  },
  {
    id: "4",
    slug: "david-chen",
    name: "David Chen",
    title: "Solicitor",
    qualifications: ["LLB (Hons)", "Solicitor"],
    image: "/images/team/placeholder-4.jpg",
    bio: "David specializes in housing disrepair claims and landlord-tenant disputes. His passion for housing justice drives him to achieve the best outcomes for clients facing property issues.",
    specializations: ["Housing Disrepair", "Landlord & Tenant"],
    practiceAreas: ["housing-disrepair", "landlord-tenant"],
    email: "david@stonelegal.co.uk",
    languages: ["English", "Mandarin"],
    featured: false,
    order: 4,
  },
];

export const featuredTeamMembers = teamMembers.filter((m) => m.featured);

export function getTeamMember(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug);
}

export function getTeamMembersByPracticeArea(practiceAreaId: string): TeamMember[] {
  return teamMembers.filter((m) => m.practiceAreas.includes(practiceAreaId));
}
