/**
 * Site-wide constants for Stone & Co. Solicitors
 */

export const SITE_CONFIG = {
  name: "Stone & Co. Solicitors",
  shortName: "Stone & Co.",
  description:
    "Experienced solicitors in London offering Family Law, Immigration, Employment Law, Criminal Defense and more. Offices in the City (EC2Y) and Leytonstone (E11).",
  url: "https://stonelegal.co.uk",
  locale: "en_GB",
  twitterHandle: "@stonelegal",
} as const;

export const CONTACT = {
  email: "info@stonelegal.co.uk",
  phone: "020 XXXX XXXX", // To be filled
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
    phone: "020 XXXX XXXX", // To be filled
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
    mapUrl: "https://maps.google.com/?q=EC2Y", // To be updated
  },
  leytonstone: {
    id: "leytonstone",
    name: "Leytonstone Office",
    address: {
      street: "TBC", // To be filled
      city: "London",
      postcode: "E11",
      country: "United Kingdom",
    },
    phone: "020 XXXX XXXX", // To be filled
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
    id: "family-law",
    title: "Family Law",
    shortDescription: "Divorce, separation, and family disputes handled with sensitivity and expertise.",
    icon: "Heart",
  },
  {
    id: "children-law",
    title: "Children Law",
    shortDescription: "Child arrangements, custody matters, and care proceedings.",
    icon: "Users",
  },
  {
    id: "landlord-tenant",
    title: "Landlord & Tenant",
    shortDescription: "Property disputes, evictions, and tenancy agreements.",
    icon: "Home",
  },
  {
    id: "employment-law",
    title: "Employment Law",
    shortDescription: "Workplace disputes, unfair dismissal, and discrimination claims.",
    icon: "Briefcase",
  },
  {
    id: "immigration",
    title: "Immigration",
    shortDescription: "Visa applications, citizenship, appeals, and asylum cases.",
    icon: "Globe",
  },
  {
    id: "criminal-law",
    title: "Criminal Law",
    shortDescription: "Criminal defense across all courts with experienced advocates.",
    icon: "Scale",
  },
  {
    id: "housing-disrepair",
    title: "Housing Disrepair",
    shortDescription: "Claims for damp, mould, and property disrepair compensation.",
    icon: "AlertTriangle",
  },
] as const;

export const SUB_BRANDS = {
  consulentiItaliani: {
    id: "consulenti-italiani",
    name: "Consulenti Italiani",
    description: "Legal services for the Italian community in London.",
    href: "/consulenti-italiani",
  },
  horecaLaw: {
    id: "horeca-law",
    name: "HoReCa Law",
    description: "Specialist legal services for the hospitality industry.",
    href: "/horeca-law",
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
      ],
    },
    { label: "Resources", href: "/resources" },
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
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/team" },
      { label: "Resources", href: "/resources" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Accessibility", href: "/accessibility" },
    ],
    subBrands: [
      { label: "Consulenti Italiani", href: "/consulenti-italiani" },
      { label: "HoReCa Law", href: "/horeca-law" },
    ],
  },
} as const;

export const SOCIAL_LINKS = [
  // To be filled if applicable
] as const;

export const SRA_NUMBER = "XXXXXX"; // To be filled

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
