import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old practice area slugs → new destinations
      {
        source: "/practice-areas/family-law",
        destination: "/practice-areas",
        permanent: true,
      },
      {
        source: "/practice-areas/children-law",
        destination: "/practice-areas",
        permanent: true,
      },
      {
        source: "/practice-areas/landlord-tenant",
        destination: "/practice-areas/tenancy-deposit-claims",
        permanent: true,
      },
      {
        source: "/practice-areas/employment-law",
        destination: "/practice-areas",
        permanent: true,
      },
      {
        source: "/practice-areas/criminal-law",
        destination: "/practice-areas",
        permanent: true,
      },
      {
        source: "/practice-areas/housing-disrepair",
        destination: "/practice-areas/tenancy-deposit-claims",
        permanent: true,
      },
      // Old team member slugs
      {
        source: "/team/sarah-stone",
        destination: "/team",
        permanent: true,
      },
      {
        source: "/team/james-mitchell",
        destination: "/team",
        permanent: true,
      },
      {
        source: "/team/maria-rossi",
        destination: "/team",
        permanent: true,
      },
      {
        source: "/team/david-chen",
        destination: "/team",
        permanent: true,
      },
      // Deleted pages
      {
        source: "/resources",
        destination: "/renters-rights",
        permanent: true,
      },
      {
        source: "/horeca-law",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
