/**
 * Site-wide constants for Stone & Co. Solicitors
 */

export const SITE_CONFIG = {
  name: "Stone & Co. Solicitors",
  shortName: "Stone & Co.",
  description:
    "London solicitors specialising in Tenancy Deposit Claims, Immigration, and Rent Repayment Orders. SRA regulated. Offices in the City (EC2Y) and Leytonstone (E11).",
  url: "https://stonelegal.co.uk",
  locale: "en_GB",
  twitterHandle: "@stonelegal",
} as const;

export const CONTACT = {
  email: "info@stonelegal.co.uk",
  phone: "020 7118 0530",
} as const;

export const OFFICES = {
  city: {
    id: "city",
    name: "City Office",
    address: {
      street: "TBC", // To be filled
      city: "London",
      postcode: "EC2Y",
      country: "United Kingdom",
    },
    phone: "020 7118 0530",
    email: "city@stonelegal.co.uk",
    hours: {
      weekday: "9:00 AM - 5:30 PM",
      saturday: "By appointment",
      sunday: "Closed",
    },
    coordinates: {
      lat: 51.5194,
      lng: -0.0895,
    },
    mapUrl: "https://maps.google.com/?q=EC2Y",
  },
  leytonstone: {
    id: "leytonstone",
    name: "Leytonstone Office",
    address: {
      street: "TBC",
      city: "London",
      postcode: "E11",
      country: "United Kingdom",
    },
    phone: "020 7118 0530",
    email: "leytonstone@stonelegal.co.uk",
    hours: {
      weekday: "9:00 AM - 5:30 PM",
      saturday: "By appointment",
      sunday: "Closed",
    },
    coordinates: {
      lat: 51.5683,
      lng: 0.0115,
    },
    mapUrl: "https://maps.google.com/?q=E11", // To be updated
  },
} as const;

export const PRACTICE_AREAS = [
  {
    id: "tenancy-deposit-claims",
    title: "Tenancy Deposit Claims",
    shortDescription: "Deposit protection failures, prescribed information claims, and up to 3x deposit compensation.",
    icon: "Shield",
  },
  {
    id: "immigration",
    title: "Immigration",
    shortDescription: "Visa applications, citizenship, settlement, appeals, and asylum cases.",
    icon: "Globe",
  },
  {
    id: "rent-repayment-orders",
    title: "Rent Repayment Orders",
    shortDescription: "Claims against landlords for unlicensed properties and housing offences under RRA 2025.",
    icon: "Home",
  },
] as const;

export const SUB_BRANDS = {
  consulentiItaliani: {
    id: "consulenti-italiani",
    name: "Consulenti Italiani",
    description: "Legal services for the Italian community in London.",
    href: "/consulenti-italiani",
  },
} as const;

export const NAVIGATION = {
  main: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    {
      label: "Practice Areas",
      href: "/practice-areas",
      children: [
        ...PRACTICE_AREAS.map((area) => ({
          label: area.title,
          href: `/practice-areas/${area.id}`,
          description: area.shortDescription,
        })),
        {
          label: "Help With Your Landlord",
          href: "/renters-rights",
          description: "New rights for tenants under the Renters' Rights Act 2025.",
        },
        {
          label: "Landlord Compliance",
          href: "/landlord-enquiry",
          description: "Portfolio compliance audit and transition planning.",
        },
        {
          label: "Rent Calculator",
          href: "/tools/rent-calculator",
          description: "Check if your rent is fair using official ONS data.",
        },
        {
          label: "RRO Checker",
          href: "/tools/rro-checker",
          description: "Check your eligibility for a Rent Repayment Order.",
        },
      ],
    },
    { label: "Contact", href: "/contact" },
  ],
  footer: {
    practiceAreas: [
      ...PRACTICE_AREAS.map((area) => ({
        label: area.title,
        href: `/practice-areas/${area.id}`,
      })),
      { label: "Help With Your Landlord", href: "/renters-rights" },
      { label: "Landlord Compliance", href: "/landlord-enquiry" },
      { label: "Rent Calculator", href: "/tools/rent-calculator" },
      { label: "RRO Checker", href: "/tools/rro-checker" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Accessibility", href: "/accessibility" },
    ],
    subBrands: [
      { label: "Consulenti Italiani", href: "/consulenti-italiani" },
    ],
  },
} as const;

export const SOCIAL_LINKS = [
  // To be filled if applicable
] as const;

export const SRA_NUMBER = "640836";

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
