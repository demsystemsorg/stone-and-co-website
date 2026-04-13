import type { TeamMember } from "@/types/team";

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    slug: "ethshaam-hussain",
    name: "Ethshaam Hussain",
    title: "Head Solicitor",
    qualifications: ["Solicitor"], // TODO: confirm qualifications
    image: "/images/team/placeholder-1.jpg", // TODO: real headshot
    bio: "Ethshaam leads Stone & Co. Legal from the firm's Leytonstone office, overseeing the delivery of the firm's tenancy deposit, immigration, and rent repayment practices. He brings strategic direction to the team while maintaining a hands-on approach to client matters, ensuring that the standard of work across every case reflects the firm's commitment to thorough, effective representation. Under his leadership, the Leytonstone office has become a trusted resource for tenants and individuals across East London and beyond.",
    specializations: ["Tenancy Deposit Claims", "Immigration", "Rent Repayment Orders"],
    practiceAreas: ["tenancy-deposit-claims", "immigration", "rent-repayment-orders"],
    email: "ethshaam.hussain@stonelegal.co.uk",
    languages: ["English"],
    featured: true,
    order: 1,
  },
  {
    id: "2",
    slug: "imaan-khan",
    name: "Imaan Khan",
    title: "Immigration Specialist",
    qualifications: ["Solicitor"], // TODO: confirm qualifications
    image: "/images/team/placeholder-2.jpg", // TODO: real headshot
    bio: "Imaan is the firm's dedicated immigration specialist, bringing a meticulous and thorough approach to every application and case she handles. She is known for her ability to understand the full complexity of a client's circumstances and translate that into precise, well-prepared submissions. Imaan maintains an up-to-date knowledge of the constantly evolving immigration landscape — from legislative changes and Home Office policy updates to recent case law and tribunal precedents — ensuring her advice reflects the current legal position at all times.",
    specializations: ["Immigration"],
    practiceAreas: ["immigration"],
    email: "imaan.khan@stonelegal.co.uk",
    languages: ["English"],
    featured: true,
    order: 2,
  },
  {
    id: "3",
    slug: "haroon-attan",
    name: "Haroon Attan",
    title: "Tenancy Deposit Solicitor",
    qualifications: ["Solicitor"], // TODO: confirm qualifications
    image: "/images/team/placeholder-3.jpg", // TODO: real headshot
    bio: "Haroon is a tenancy deposit lawyer with a particular talent for resolving negotiations quickly and effectively. He has an instinctive ability to get up to speed on a case rapidly — absorbing the facts, identifying the strongest angles, and processing complex information to build a clear path to the best possible outcome. Clients benefit from his direct, efficient approach: Haroon focuses on results, minimising unnecessary delay while ensuring that no detail is overlooked in pursuit of the compensation his clients are entitled to.",
    specializations: ["Tenancy Deposit Claims"],
    practiceAreas: ["tenancy-deposit-claims"],
    email: "haroon.attan@stonelegal.co.uk",
    languages: ["English"],
    featured: true,
    order: 3,
  },
  {
    id: "4",
    slug: "mustafa-pandor",
    name: "Mustafa Pandor",
    title: "Tenancy Deposit Solicitor",
    qualifications: ["Solicitor"], // TODO: confirm qualifications
    image: "/images/team/placeholder-4.jpg", // TODO: real headshot
    bio: "Mustafa is a tenancy deposit solicitor with an exceptionally keen eye for detail. He excels at processing cases efficiently at every stage of the tenancy deposit legal pipeline — from initial assessment and evidence gathering through to negotiation and, where necessary, litigation. His ability to absorb, organise, and act on large volumes of case information allows him to move clients through the process as quickly as possible without sacrificing the precision that complex deposit claims demand.",
    specializations: ["Tenancy Deposit Claims"],
    practiceAreas: ["tenancy-deposit-claims"],
    email: "mustafa.pandor@stonelegal.co.uk",
    languages: ["English"],
    featured: true,
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
