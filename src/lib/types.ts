export interface Project {
  id?: string;
  slug?: string;
  title: string;
  tag: string;
  year: string;
  role: string;
  wide: boolean;
  sortOrder?: number;
  live: string;
  repo: string;
  imageUrl?: string;
  seed: string;
  short: string;
  /** rich paragraphs — may contain inline <b> tags, injected as HTML like the original */
  brief: string[];
  stack: string[];
  challenges: string[];
  future: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  contactEmail: string;
  contactPhoneDisplay: string;
  contactPhoneHref: string;
  whatsappNumber: string;
  whatsappText: string;
  location: string;
  socialUrls: { github: string; linkedin: string; twitter: string; facebook: string };
  roles: string[];
  stats: { years: number; projects: number; clients: number; commits: number };
}

export interface PublicData {
  projects: Project[];
  settings: SiteSettings;
}
