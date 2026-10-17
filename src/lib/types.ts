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

export interface MonitorRow {
  label: string;
  value: string;
}

export interface MonitorConfig {
  rating: string;
  ratingLabel: string;
  rows: MonitorRow[];
  ping: string;
}

export interface EduPanelConfig {
  status: string;
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
  monitor: MonitorConfig;
  eduPanel: EduPanelConfig;
}

export interface PublicData {
  projects: Project[];
  settings: SiteSettings;
  skillSections: SkillSection[];
  education: EducationItem[];
  experience: ExperienceItem[];
}

export interface SkillItem {
  id?: string;
  /** emoji fallback shown when no brand logo is set */
  icon?: string;
  /** Simple Icons slug (https://simpleicons.org) — renders the original brand logo */
  logo?: string;
  name: string;
  level: number;
}

export interface SkillSection {
  id?: string;
  name: string;
  label: string;
  icon?: string;
  skills: SkillItem[];
}

export interface EducationItem {
  id?: string;
  period: string;
  title: string;
  institution: string;
  /** may contain inline <b> tags, rendered into the card like the original */
  result: string;
  courses: string[];
  sortOrder?: number;
}

export interface ExperienceItem {
  id?: string;
  role: string;
  company: string;
  period: string;
  bullets: string[];
  sortOrder?: number;
}
