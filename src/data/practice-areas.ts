import type { PracticeArea } from "@/types/practice-area";

/**
 * Practice area detailed data — 3 real practice areas
 */
export const practiceAreas: PracticeArea[] = [
  {
    id: "tenancy-deposit-claims",
    slug: "tenancy-deposit-claims",
    title: "Tenancy Deposit Claims",
    shortDescription:
      "Deposit protection failures, prescribed information claims, and up to 3x deposit compensation.",
    fullDescription:
      "If your landlord failed to protect your tenancy deposit or provide the required prescribed information, you may be entitled to compensation of up to three times the deposit amount. Stone & Co. specialises in tenancy deposit claims — it is our primary area of expertise. We handle every type of deposit protection failure, from unprotected deposits to late protection and missing prescribed information, securing compensation efficiently and effectively.",
    icon: "Shield",
    services: [
      {
        title: "No Deposit Protection",
        description:
          "Claims where your landlord failed to place your deposit in a government-approved scheme within 30 days.",
      },
      {
        title: "Late Deposit Protection",
        description:
          "Claims where your deposit was protected but outside the statutory 30-day window.",
      },
      {
        title: "No Prescribed Information",
        description:
          "Claims where your landlord failed to provide the required prescribed information about the deposit scheme.",
      },
      {
        title: "Late Prescribed Information",
        description:
          "Claims where prescribed information was provided outside the statutory deadline.",
      },
      {
        title: "No Gas Safety Certificate",
        description:
          "Claims related to landlords failing to provide a valid gas safety certificate as required by law.",
      },
      {
        title: "No Energy Performance Certificate",
        description:
          "Claims where a valid EPC was not provided to the tenant before or at the start of the tenancy.",
      },
      {
        title: "Unlicensed HMO",
        description:
          "Rent repayment and compensation claims against landlords operating an unlicensed house in multiple occupation.",
      },
      {
        title: "Unlicensed Selective Licensing",
        description:
          "Claims where the property required selective licensing but the landlord failed to obtain one.",
      },
      {
        title: "Illegal Eviction",
        description:
          "Claims for compensation where a landlord unlawfully evicted you without following proper legal procedures.",
      },
      {
        title: "Harassment",
        description:
          "Claims against landlords who have engaged in harassment or interference with your right to quiet enjoyment.",
      },
    ],
    faqs: [
      {
        question: "How much compensation can I claim for an unprotected deposit?",
        answer:
          "The court can award between one and three times the deposit amount as compensation. The exact amount depends on the circumstances, including how long the deposit was unprotected, whether the landlord's failure was deliberate, and any previous history of non-compliance.",
      },
      {
        question: "Do I need to still be a tenant to make a claim?",
        answer:
          "No. You can make a tenancy deposit claim even after your tenancy has ended, provided you bring the claim within the relevant limitation period. We can advise on your specific circumstances during a free initial assessment.",
      },
      {
        question: "What is the time limit for making a deposit claim?",
        answer:
          "The limitation period is generally six years from the date the deposit should have been protected. However, the rules can be complex depending on whether your tenancy is ongoing or has ended. We recommend seeking advice as soon as possible to preserve your claim.",
      },
      {
        question: "What if my landlord returned my deposit — can I still claim?",
        answer:
          "Yes. The compensation for failing to protect a deposit is separate from the return of the deposit itself. Even if your deposit was returned in full, you may still be entitled to compensation of up to 3x the deposit amount.",
      },
    ],
    teamMembers: ["1", "3", "4"],
    relatedAreas: ["rent-repayment-orders"],
    seo: {
      title: "Tenancy Deposit Claim Solicitors London | Up to 3x Compensation",
      description:
        "Specialist tenancy deposit claim solicitors in London. Claims for unprotected deposits, late protection, and missing prescribed information. Free initial assessment.",
      keywords: [
        "tenancy deposit claim solicitor",
        "deposit protection claim",
        "unprotected deposit compensation",
        "prescribed information claim",
        "tenancy deposit solicitor london",
      ],
    },
  },
  {
    id: "immigration",
    slug: "immigration",
    title: "Immigration",
    shortDescription:
      "Visa applications, citizenship, settlement, appeals, and asylum cases.",
    fullDescription:
      "Navigating the UK immigration system can be complex and stressful. Our immigration team provides expert guidance on all visa categories, settlement applications, and appeals. We help individuals and families build their lives in the UK with clear advice and strong representation at every stage.",
    icon: "Globe",
    services: [
      {
        title: "Visa Applications",
        description:
          "Work visas, family visas, student visas, and visitor visas — prepared and submitted with precision.",
      },
      {
        title: "Settlement & ILR",
        description:
          "Applications for indefinite leave to remain and permanent residence in the UK.",
      },
      {
        title: "British Citizenship",
        description:
          "Naturalisation applications and guidance through the citizenship process.",
      },
      {
        title: "Appeals & Judicial Review",
        description:
          "Challenging visa refusals and Home Office decisions through the tribunal system.",
      },
      {
        title: "Asylum Claims",
        description:
          "Compassionate and thorough support for those seeking protection in the UK.",
      },
    ],
    faqs: [
      {
        question: "How long does a visa application take?",
        answer:
          "Processing times vary by visa type. Standard processing typically takes 8-12 weeks, though priority services are available for many categories. We can advise on the best approach for your timeline.",
      },
      {
        question: "Can I work in the UK while my visa is being processed?",
        answer:
          "This depends on your current immigration status. If you have existing leave that allows work, you can generally continue until a decision is made. We can clarify your specific situation during a consultation.",
      },
      {
        question: "What happens if my visa application is refused?",
        answer:
          "You may have the right to appeal or request an administrative review depending on the visa type and grounds of refusal. We handle appeals at all tribunal levels and can assess whether judicial review is appropriate.",
      },
    ],
    teamMembers: ["1", "2"],
    relatedAreas: ["tenancy-deposit-claims"],
    seo: {
      title: "Immigration Solicitors London | Visa & Citizenship Applications",
      description:
        "Experienced immigration solicitors in London. Visa applications, settlement, citizenship, appeals, and asylum cases. Clear guidance through every stage.",
      keywords: [
        "immigration solicitor london",
        "visa lawyer",
        "citizenship application",
        "immigration appeal",
        "settlement solicitor",
      ],
    },
  },
  {
    id: "rent-repayment-orders",
    slug: "rent-repayment-orders",
    title: "Rent Repayment Orders",
    shortDescription:
      "Claims against landlords for unlicensed properties and housing offences under RRA 2025.",
    fullDescription:
      "A Rent Repayment Order (RRO) allows tenants to reclaim up to 12 months' rent from landlords who have committed certain housing offences. Under the Renters' Rights Act 2025 — commencing 1 May 2026 with a backstop of 31 July 2026 — the scope of RROs is expanding significantly. Stone & Co. helps tenants identify qualifying offences, build strong applications, and recover the rent they are owed through the First-tier Tribunal.",
    icon: "Home",
    services: [
      {
        title: "Unlicensed HMO Claims",
        description:
          "RRO claims where the landlord operates a house in multiple occupation without the required licence.",
      },
      {
        title: "Selective Licensing Failures",
        description:
          "Claims where the property falls within a selective licensing area and the landlord has no licence.",
      },
      {
        title: "Illegal Eviction RROs",
        description:
          "Rent repayment claims arising from unlawful eviction by the landlord.",
      },
      {
        title: "Breach of Improvement Notice",
        description:
          "Claims where the landlord has failed to comply with a local authority improvement notice.",
      },
      {
        title: "RRA 2025 Expanded Offences",
        description:
          "New claim types available under the Renters' Rights Act 2025, including expanded grounds and enhanced tenant protections.",
      },
    ],
    faqs: [
      {
        question: "What is a Rent Repayment Order?",
        answer:
          "A Rent Repayment Order is a decision by the First-tier Tribunal requiring a landlord to repay rent to a tenant. It applies when the landlord has committed certain housing offences, such as operating an unlicensed HMO or illegally evicting a tenant. You can claim up to 12 months' rent.",
      },
      {
        question: "What offences qualify for an RRO?",
        answer:
          "Qualifying offences include operating an unlicensed HMO, failing to obtain selective licensing, illegal eviction, breach of an improvement notice, and breach of a banning order. The Renters' Rights Act 2025 will expand the list of qualifying offences further.",
      },
      {
        question: "How much rent can I recover?",
        answer:
          "The tribunal can order repayment of up to 12 months' rent. The exact amount depends on the severity of the offence, the landlord's conduct, and whether the landlord has a previous history of housing offences.",
      },
      {
        question: "What is the Renters' Rights Act 2025?",
        answer:
          "The Renters' Rights Act 2025 is major new legislation that strengthens tenant protections. It commences on 1 May 2026 with a backstop date of 31 July 2026. Among other changes, it expands the grounds for Rent Repayment Orders and introduces new landlord obligations.",
      },
    ],
    teamMembers: ["1"],
    relatedAreas: ["tenancy-deposit-claims"],
    seo: {
      title: "Rent Repayment Order Solicitors London | RRO Claims",
      description:
        "Specialist RRO solicitors in London. Claim up to 12 months' rent from landlords committing housing offences. Expert guidance on Renters' Rights Act 2025.",
      keywords: [
        "rent repayment order solicitor",
        "RRO claim london",
        "rent repayment order",
        "renters rights act 2025",
        "unlicensed hmo claim",
      ],
    },
  },
];

export function getPracticeArea(slug: string): PracticeArea | undefined {
  return practiceAreas.find((pa) => pa.slug === slug);
}

export function getRelatedPracticeAreas(id: string): PracticeArea[] {
  const area = practiceAreas.find((pa) => pa.id === id);
  if (!area) return [];
  return practiceAreas.filter((pa) => area.relatedAreas.includes(pa.id));
}
