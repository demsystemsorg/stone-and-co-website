/**
 * Practice area type definitions
 */

export interface PracticeArea {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  services: Service[];
  faqs: FAQ[];
  teamMembers: string[]; // Team member IDs
  relatedAreas: string[]; // Practice area IDs
  seo: PracticeAreaSEO;
}

export interface Service {
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface PracticeAreaSEO {
  title: string;
  description: string;
  keywords: string[];
}

export interface PracticeAreaPreview {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
}
