/**
 * Team member type definitions
 */

export interface TeamMember {
  id: string;
  slug: string;
  name: string;
  title: string;
  qualifications: string[];
  image: string;
  bio: string;
  specializations: string[];
  practiceAreas: string[];
  email?: string;
  phone?: string;
  languages?: string[];
  featured?: boolean;
  order: number;
}

export interface TeamMemberPreview {
  id: string;
  slug: string;
  name: string;
  title: string;
  image: string;
  specializations: string[];
}
