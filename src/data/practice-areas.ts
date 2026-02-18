import type { PracticeArea } from "@/types/practice-area";

/**
 * Practice area detailed data
 */
export const practiceAreas: PracticeArea[] = [
  {
    id: "family-law",
    slug: "family-law",
    title: "Family Law",
    shortDescription:
      "Divorce, separation, and family disputes handled with sensitivity and expertise.",
    fullDescription:
      "Our family law team understands that family matters are deeply personal and emotionally challenging. We provide compassionate yet robust legal support for all aspects of family law, from divorce proceedings to child arrangements. Our approach prioritizes resolution through negotiation where possible, while being prepared to advocate strongly in court when necessary.",
    icon: "Heart",
    services: [
      {
        title: "Divorce & Separation",
        description:
          "Expert guidance through divorce proceedings, including petition filing and decree absolute.",
      },
      {
        title: "Financial Settlements",
        description:
          "Negotiating fair division of assets, pensions, and ongoing financial arrangements.",
      },
      {
        title: "Pre-nuptial Agreements",
        description:
          "Drafting comprehensive agreements to protect your assets before marriage.",
      },
      {
        title: "Cohabitation Agreements",
        description:
          "Legal protection for unmarried couples living together.",
      },
      {
        title: "Domestic Abuse",
        description:
          "Urgent applications for protective orders and ongoing support.",
      },
    ],
    faqs: [
      {
        question: "How long does a divorce take?",
        answer:
          "A straightforward divorce typically takes 4-6 months from petition to decree absolute. However, if there are disputes over finances or children, it can take longer. We work to resolve matters as efficiently as possible.",
      },
      {
        question: "Do I need to go to court for a divorce?",
        answer:
          "Not necessarily. Many divorces are resolved through negotiation and mediation. Court appearances are usually only required when agreements cannot be reached between parties.",
      },
      {
        question: "How are assets divided in a divorce?",
        answer:
          "The court aims for a fair division based on factors including the length of marriage, contributions to the marriage, future needs, and the welfare of any children. We help negotiate settlements that protect your interests.",
      },
    ],
    teamMembers: ["1", "3"],
    relatedAreas: ["children-law"],
    seo: {
      title: "Family Law Solicitors London | Divorce & Separation",
      description:
        "Expert family law solicitors in London. Divorce, financial settlements, child arrangements, pre-nuptial agreements. Compassionate, professional service.",
      keywords: [
        "family solicitor london",
        "divorce lawyer",
        "family law",
        "separation solicitor",
      ],
    },
  },
  {
    id: "children-law",
    slug: "children-law",
    title: "Children Law",
    shortDescription:
      "Child arrangements, custody matters, and care proceedings.",
    fullDescription:
      "When children are involved in family disputes, their welfare is paramount. Our children law specialists handle matters with the sensitivity they deserve, always keeping the child's best interests at the forefront. We represent parents, grandparents, and other family members in custody and access disputes.",
    icon: "Users",
    services: [
      {
        title: "Child Arrangements Orders",
        description:
          "Determining where children live and how they spend time with each parent.",
      },
      {
        title: "Contact Disputes",
        description:
          "Resolving disagreements about visitation and maintaining relationships.",
      },
      {
        title: "Care Proceedings",
        description:
          "Representing parents when local authorities are involved.",
      },
      {
        title: "Adoption",
        description: "Legal support throughout the adoption process.",
      },
      {
        title: "Grandparents' Rights",
        description:
          "Helping grandparents maintain contact with grandchildren.",
      },
    ],
    faqs: [
      {
        question: "What is a Child Arrangements Order?",
        answer:
          "A Child Arrangements Order is a court order that sets out where a child will live and who they will spend time with. It replaces the old terms 'custody' and 'access'.",
      },
      {
        question: "Do fathers have equal rights?",
        answer:
          "Yes, mothers and fathers have equal legal rights regarding their children. The court's primary consideration is the welfare of the child, not the gender of the parent.",
      },
    ],
    teamMembers: ["1", "3"],
    relatedAreas: ["family-law"],
    seo: {
      title: "Children Law Solicitors London | Child Custody & Arrangements",
      description:
        "Experienced children law solicitors helping with child arrangements, custody disputes, and care proceedings. Child-focused approach.",
      keywords: [
        "children law solicitor",
        "child custody lawyer",
        "child arrangements",
      ],
    },
  },
  {
    id: "landlord-tenant",
    slug: "landlord-tenant",
    title: "Landlord & Tenant",
    shortDescription:
      "Property disputes, evictions, and tenancy agreements.",
    fullDescription:
      "Whether you're a landlord dealing with problematic tenants or a tenant facing unfair treatment, our property law team provides clear, practical advice. We handle all aspects of residential and commercial tenancy disputes with efficiency and expertise.",
    icon: "Home",
    services: [
      {
        title: "Eviction Proceedings",
        description:
          "Section 21 and Section 8 notices, possession claims, and enforcement.",
      },
      {
        title: "Rent Arrears",
        description: "Recovering unpaid rent through negotiation or court action.",
      },
      {
        title: "Tenancy Disputes",
        description:
          "Resolving disagreements over deposits, repairs, and obligations.",
      },
      {
        title: "Lease Reviews",
        description:
          "Reviewing and negotiating commercial and residential lease terms.",
      },
      {
        title: "Deposit Disputes",
        description:
          "Protecting and recovering tenancy deposits through proper channels.",
      },
    ],
    faqs: [
      {
        question: "How long does an eviction take?",
        answer:
          "The timeline depends on the grounds for eviction and whether the tenant contests it. A Section 21 'no-fault' eviction typically takes 2-4 months if uncontested. Disputed cases can take longer.",
      },
      {
        question: "Can a landlord evict without a reason?",
        answer:
          "Currently, landlords can use Section 21 notices for 'no-fault' evictions with proper notice. However, there are strict requirements that must be followed, and the law is changing. We can advise on your specific situation.",
      },
    ],
    teamMembers: ["4"],
    relatedAreas: ["housing-disrepair"],
    seo: {
      title: "Landlord & Tenant Solicitors London | Property Disputes",
      description:
        "Expert landlord and tenant solicitors handling evictions, rent disputes, and tenancy issues. Practical advice for property matters.",
      keywords: [
        "landlord solicitor",
        "tenant lawyer",
        "eviction solicitor",
        "property dispute",
      ],
    },
  },
  {
    id: "employment-law",
    slug: "employment-law",
    title: "Employment Law",
    shortDescription:
      "Workplace disputes, unfair dismissal, and discrimination claims.",
    fullDescription:
      "Employment disputes can affect your livelihood and wellbeing. Our employment law team represents both employees and employers, giving us comprehensive insight into workplace matters. We handle everything from settlement negotiations to tribunal representation.",
    icon: "Briefcase",
    services: [
      {
        title: "Unfair Dismissal",
        description:
          "Challenging wrongful termination and securing compensation.",
      },
      {
        title: "Discrimination Claims",
        description:
          "Fighting workplace discrimination based on protected characteristics.",
      },
      {
        title: "Settlement Agreements",
        description:
          "Negotiating exit packages and reviewing settlement terms.",
      },
      {
        title: "Employment Contracts",
        description:
          "Drafting and reviewing contracts, policies, and handbooks.",
      },
      {
        title: "Tribunal Representation",
        description:
          "Strong advocacy at employment tribunals for claimants and respondents.",
      },
    ],
    faqs: [
      {
        question: "How long do I have to bring an employment tribunal claim?",
        answer:
          "Most employment tribunal claims must be started within 3 months less one day from the date of the act complained of (e.g., dismissal date). Early Conciliation through ACAS is usually required first, which can extend this slightly.",
      },
      {
        question: "What compensation can I receive for unfair dismissal?",
        answer:
          "Compensation typically includes a basic award (based on age, service, and weekly pay) and a compensatory award for financial losses. The current cap on compensatory awards is £105,707 or 52 weeks' pay, whichever is lower.",
      },
    ],
    teamMembers: ["2"],
    relatedAreas: ["criminal-law"],
    seo: {
      title: "Employment Law Solicitors London | Unfair Dismissal & Discrimination",
      description:
        "Employment law experts handling unfair dismissal, discrimination, and workplace disputes. Tribunal representation available.",
      keywords: [
        "employment solicitor london",
        "unfair dismissal lawyer",
        "employment tribunal",
      ],
    },
  },
  {
    id: "immigration",
    slug: "immigration",
    title: "Immigration",
    shortDescription:
      "Visa applications, citizenship, appeals, and asylum cases.",
    fullDescription:
      "Navigating the UK immigration system can be complex and stressful. Our immigration team provides expert guidance on all visa categories, settlement applications, and appeals. We take pride in helping individuals and families build their lives in the UK.",
    icon: "Globe",
    services: [
      {
        title: "Visa Applications",
        description:
          "Work visas, family visas, student visas, and visitor visas.",
      },
      {
        title: "Settlement & ILR",
        description:
          "Applications for indefinite leave to remain and permanent residence.",
      },
      {
        title: "British Citizenship",
        description:
          "Naturalisation applications and citizenship ceremonies.",
      },
      {
        title: "Appeals & Judicial Review",
        description:
          "Challenging visa refusals and Home Office decisions.",
      },
      {
        title: "Asylum Claims",
        description:
          "Compassionate support for those seeking protection in the UK.",
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
          "This depends on your current immigration status. If you have existing leave that allows work, you can generally continue until a decision is made. We can clarify your specific situation.",
      },
    ],
    teamMembers: ["1", "3"],
    relatedAreas: ["family-law"],
    seo: {
      title: "Immigration Solicitors London | Visa & Citizenship",
      description:
        "Experienced immigration solicitors helping with visas, settlement, citizenship, and appeals. Multilingual service available.",
      keywords: [
        "immigration solicitor london",
        "visa lawyer",
        "citizenship application",
      ],
    },
  },
  {
    id: "criminal-law",
    slug: "criminal-law",
    title: "Criminal Law",
    shortDescription:
      "Criminal defense across all courts with experienced advocates.",
    fullDescription:
      "If you're facing criminal charges, having experienced legal representation is crucial. Our criminal law team provides robust defense services from police station attendance through to Crown Court trials. We protect your rights and fight for the best possible outcome.",
    icon: "Scale",
    services: [
      {
        title: "Police Station Attendance",
        description:
          "24/7 representation during police interviews and custody.",
      },
      {
        title: "Magistrates' Court",
        description:
          "Defense for summary offences and either-way matters.",
      },
      {
        title: "Crown Court",
        description:
          "Serious criminal defense with experienced advocates.",
      },
      {
        title: "Motoring Offences",
        description:
          "Drink driving, speeding, and driving disqualification.",
      },
      {
        title: "Appeals",
        description:
          "Challenging convictions and sentences in higher courts.",
      },
    ],
    faqs: [
      {
        question: "What should I do if I'm arrested?",
        answer:
          "Remain calm and polite, but exercise your right to legal representation before answering questions. You can request a solicitor at no cost, and we offer 24/7 police station attendance.",
      },
      {
        question: "Will I go to prison?",
        answer:
          "The likelihood of a custodial sentence depends on many factors including the offence, your history, and mitigating circumstances. We work to achieve the best possible outcome in every case.",
      },
    ],
    teamMembers: ["2"],
    relatedAreas: ["employment-law"],
    seo: {
      title: "Criminal Law Solicitors London | Criminal Defence",
      description:
        "Experienced criminal defence solicitors. 24/7 police station attendance, magistrates and Crown Court representation.",
      keywords: [
        "criminal solicitor london",
        "criminal defence lawyer",
        "police station solicitor",
      ],
    },
  },
  {
    id: "housing-disrepair",
    slug: "housing-disrepair",
    title: "Housing Disrepair",
    shortDescription:
      "Claims for damp, mould, and property disrepair compensation.",
    fullDescription:
      "Living in a property with disrepair can seriously affect your health and wellbeing. Our housing disrepair specialists help tenants claim compensation from negligent landlords and housing associations. We handle cases on a no-win, no-fee basis where possible.",
    icon: "AlertTriangle",
    services: [
      {
        title: "Damp & Mould Claims",
        description:
          "Compensation for health issues and property damage from damp.",
      },
      {
        title: "Structural Defects",
        description:
          "Claims for failing roofs, walls, windows, and foundations.",
      },
      {
        title: "Heating & Plumbing",
        description:
          "Pursuing landlords who fail to maintain essential systems.",
      },
      {
        title: "Pest Infestations",
        description:
          "Claims for properties affected by vermin due to disrepair.",
      },
      {
        title: "Council Housing",
        description:
          "Specialist experience with local authority housing claims.",
      },
    ],
    faqs: [
      {
        question: "How much compensation can I claim?",
        answer:
          "Compensation depends on the severity of disrepair, how long it has persisted, and its impact on your health and enjoyment of the property. Awards typically range from £1,000 to £10,000+, with higher amounts for serious health impacts.",
      },
      {
        question: "Do I have to pay upfront?",
        answer:
          "We handle many housing disrepair cases on a no-win, no-fee basis, meaning you don't pay legal fees if we don't win. We'll explain all options during your free consultation.",
      },
    ],
    teamMembers: ["4"],
    relatedAreas: ["landlord-tenant"],
    seo: {
      title: "Housing Disrepair Solicitors London | Damp & Mould Claims",
      description:
        "No-win, no-fee housing disrepair claims. Compensation for damp, mould, and property defects. Free consultation.",
      keywords: [
        "housing disrepair solicitor",
        "damp claim",
        "mould compensation",
        "disrepair claim",
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
