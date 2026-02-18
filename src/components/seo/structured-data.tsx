import { SITE_CONFIG, OFFICES, PRACTICE_AREAS } from "@/lib/constants";

interface LawFirmSchemaProps {
  type?: "Organization" | "LocalBusiness";
}

export function LawFirmSchema({ type = "LocalBusiness" }: LawFirmSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": type === "LocalBusiness" ? "LegalService" : "LegalService",
    "@id": SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.shortName,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: OFFICES.city.phone,
    email: OFFICES.city.email,
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: "London",
      "@id": "https://www.wikidata.org/wiki/Q84",
    },
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 51.5074,
        longitude: -0.1278,
      },
      geoRadius: "30000",
    },
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: OFFICES.city.address.street,
        addressLocality: OFFICES.city.address.city,
        postalCode: OFFICES.city.address.postcode,
        addressCountry: "GB",
      },
      {
        "@type": "PostalAddress",
        streetAddress: OFFICES.leytonstone.address.street,
        addressLocality: OFFICES.leytonstone.address.city,
        postalCode: OFFICES.leytonstone.address.postcode,
        addressCountry: "GB",
      },
    ],
    geo: {
      "@type": "GeoCoordinates",
      latitude: OFFICES.city.coordinates.lat,
      longitude: OFFICES.city.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:30",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Legal Services",
      itemListElement: PRACTICE_AREAS.map((area, index) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: area.title,
          description: area.shortDescription,
        },
        position: index + 1,
      })),
    },
    sameAs: [
      // Social media URLs to be added
    ],
    knowsAbout: PRACTICE_AREAS.map((area) => area.title),
    knowsLanguage: ["en", "it", "zh"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    href: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQSchemaProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface PersonSchemaProps {
  name: string;
  jobTitle: string;
  description: string;
  image?: string;
  email?: string;
  worksFor?: string;
}

export function PersonSchema({
  name,
  jobTitle,
  description,
  image,
  email,
  worksFor = SITE_CONFIG.name,
}: PersonSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    description,
    image: image ? `${SITE_CONFIG.url}${image}` : undefined,
    email,
    worksFor: {
      "@type": "LegalService",
      name: worksFor,
      url: SITE_CONFIG.url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  provider?: string;
}

export function ServiceSchema({
  name,
  description,
  provider = SITE_CONFIG.name,
}: ServiceSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Legal Service",
    name,
    description,
    provider: {
      "@type": "LegalService",
      name: provider,
      url: SITE_CONFIG.url,
    },
    areaServed: {
      "@type": "City",
      name: "London",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
