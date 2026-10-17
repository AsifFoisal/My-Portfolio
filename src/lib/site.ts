import { PROJECTS } from "@/data/projects";
import { getSupabase, isDbConfigured } from "@/lib/supabase";
import {
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCE,
  DEFAULT_SETTINGS,
  DEFAULT_SKILL_SECTIONS,
} from "@/lib/defaults";
import type {
  EducationItem,
  ExperienceItem,
  Project,
  PublicData,
  SiteSettings,
  SkillSection,
} from "@/lib/types";

export { DEFAULT_SETTINGS, isDbConfigured };

const SETTINGS_KEY = "site";

type SkillCategoryRow = {
  id: string;
  name: string;
  label: string | null;
  icon: string | null;
  sort_order: number | null;
};
type SkillRow = {
  id: string;
  category_id: string;
  icon: string | null;
  logo: string | null;
  name: string;
  level: number | null;
  sort_order: number | null;
};
type EducationRow = {
  id: string;
  period: string | null;
  title: string;
  institution: string | null;
  result: string | null;
  courses: string[] | null;
  sort_order: number | null;
};
type ExperienceRow = {
  id: string;
  role: string;
  company: string | null;
  period: string | null;
  bullets: string[] | null;
  sort_order: number | null;
};

type ProjectsRow = {
  id: string;
  title: string;
  tag: string;
  year: string;
  role: string;
  wide: boolean | null;
  sort_order: number | null;
  live_url: string | null;
  repo_url: string | null;
  image_url: string | null;
  seed: string | null;
  short: string | null;
  brief: string[] | null;
  stack: string[] | null;
  challenges: string[] | null;
  future: string[] | null;
};

function rowToProject(row: ProjectsRow): Project {
  const slug = row.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return {
    id: row.id,
    slug: slug || "project",
    title: row.title,
    tag: row.tag,
    year: row.year ?? "",
    role: row.role ?? "",
    wide: Boolean(row.wide),
    sortOrder: row.sort_order ?? 0,
    live: row.live_url ?? "",
    repo: row.repo_url ?? "",
    imageUrl: row.image_url ?? "",
    seed: row.seed ?? (slug || "project"),
    short: row.short ?? "",
    brief: row.brief ?? [],
    stack: row.stack ?? [],
    challenges: row.challenges ?? [],
    future: row.future ?? [],
  };
}

function projectsFallback(): Project[] {
  // the design-project defaults have no sortOrder — preserve document order
  return PROJECTS.map((p, i) => ({ ...p, sortOrder: i }));
}

function mergeSettings(stored: Partial<SiteSettings> | null | undefined): SiteSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...(stored ?? {}),
    socialUrls: { ...DEFAULT_SETTINGS.socialUrls, ...(stored?.socialUrls ?? {}) },
    stats: { ...DEFAULT_SETTINGS.stats, ...(stored?.stats ?? {}) },
    eduPanel: { ...DEFAULT_SETTINGS.eduPanel, ...(stored?.eduPanel ?? {}) },
    monitor: {
      ...DEFAULT_SETTINGS.monitor,
      ...(stored?.monitor ?? {}),
      rows:
        stored?.monitor?.rows && stored.monitor.rows.length
          ? stored.monitor.rows
          : DEFAULT_SETTINGS.monitor.rows,
    },
    roles: stored?.roles?.length ? stored.roles : DEFAULT_SETTINGS.roles,
  };
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isDbConfigured()) return DEFAULT_SETTINGS;
  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return mergeSettings(data.value as Partial<SiteSettings>);
}

export async function getProjects(): Promise<Project[]> {
  if (!isDbConfigured()) return projectsFallback();
  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return projectsFallback();
  // empty database passes through: the admin seeder is the way to fill it
  return data.map(rowToProject);
}

/** Admin variant: reports configuration/query state so the panel can guide the user. */
export async function getAdminProjects(): Promise<{
  configured: boolean;
  fromDb: boolean;
  error?: string;
  projects: Project[];
}> {
  if (!isDbConfigured()) return { configured: false, fromDb: false, projects: projectsFallback() };
  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) {
    return { configured: true, fromDb: false, projects: projectsFallback(), error: error.message };
  }
  return { configured: true, fromDb: true, projects: (data as ProjectsRow[]).map(rowToProject) };
}

/** What the home page renders with. */
export async function getPublicData(): Promise<PublicData> {
  const [projects, settings, skillSections, education, experience] = await Promise.all([
    getProjects(),
    getSettings(),
    getSkillSections(),
    getEducation(),
    getExperience(),
  ]);
  return { projects, settings, skillSections, education, experience };
}

/* ---------- SKILLS ---------- */

export async function getSkillSections(): Promise<SkillSection[]> {
  if (!isDbConfigured()) return DEFAULT_SKILL_SECTIONS;
  const supabase = getSupabase()!;
  const [cats, skills] = await Promise.all([
    supabase.from("skill_categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("skills").select("*").order("sort_order", { ascending: true }),
  ]);
  // missing tables (migration not run) → keep the site rendering with defaults
  if (cats.error || !cats.data || skills.error || !skills.data) return DEFAULT_SKILL_SECTIONS;
  return (cats.data as SkillCategoryRow[])
    .map((c) => ({
      id: c.id,
      name: c.name,
      label: c.label ?? "",
      icon: c.icon ?? "",
      skills: (skills.data as SkillRow[])
        .filter((s) => s.category_id === c.id)
        .map((s) => ({ id: s.id, icon: s.icon ?? "", logo: s.logo ?? "", name: s.name, level: s.level ?? 0 })),
    }))
    .filter((sec) => sec.skills.length > 0);
}

export async function getAdminSkillSections(): Promise<{
  configured: boolean;
  fromDb: boolean;
  error?: string;
  sections: SkillSection[];
}> {
  if (!isDbConfigured()) return { configured: false, fromDb: false, sections: DEFAULT_SKILL_SECTIONS };
  const supabase = getSupabase()!;
  const [cats, skills] = await Promise.all([
    supabase.from("skill_categories").select("*").order("sort_order", { ascending: true }),
    supabase.from("skills").select("*").order("sort_order", { ascending: true }),
  ]);
  if (cats.error || skills.error || !cats.data) {
    return {
      configured: true,
      fromDb: false,
      sections: DEFAULT_SKILL_SECTIONS,
      error: cats.error?.message ?? skills.error?.message ?? "Query failed",
    };
  }
  const sections = (cats.data as SkillCategoryRow[]).map((c) => ({
    id: c.id,
    name: c.name,
    label: c.label ?? "",
    icon: c.icon ?? "",
    skills: (skills.data as SkillRow[])
      .filter((s) => s.category_id === c.id)
      .map((s) => ({ id: s.id, icon: s.icon ?? "", logo: s.logo ?? "", name: s.name, level: s.level ?? 0 })),
  }));
  return { configured: true, fromDb: true, sections };
}

/* ---------- EDUCATION ---------- */

export async function getEducation(): Promise<EducationItem[]> {
  if (!isDbConfigured()) return DEFAULT_EDUCATION;
  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return DEFAULT_EDUCATION;
  return (data as EducationRow[]).map((row) => ({
    id: row.id,
    period: row.period ?? "",
    title: row.title,
    institution: row.institution ?? "",
    result: row.result ?? "",
    courses: row.courses ?? [],
  }));
}

export async function getAdminEducation(): Promise<{
  configured: boolean;
  fromDb: boolean;
  error?: string;
  items: EducationItem[];
}> {
  if (!isDbConfigured()) return { configured: false, fromDb: false, items: DEFAULT_EDUCATION };
  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from("education")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) {
    return {
      configured: true,
      fromDb: false,
      items: DEFAULT_EDUCATION,
      error: error?.message ?? "Query failed",
    };
  }
  return {
    configured: true,
    fromDb: true,
    items: (data as EducationRow[]).map((row) => ({
      id: row.id,
      period: row.period ?? "",
      title: row.title,
      institution: row.institution ?? "",
      result: row.result ?? "",
      courses: row.courses ?? [],
    })),
  };
}

/* ---------- EXPERIENCE ---------- */

export async function getExperience(): Promise<ExperienceItem[]> {
  if (!isDbConfigured()) return DEFAULT_EXPERIENCE;
  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return DEFAULT_EXPERIENCE;
  return (data as ExperienceRow[]).map((row) => ({
    id: row.id,
    role: row.role,
    company: row.company ?? "",
    period: row.period ?? "",
    bullets: row.bullets ?? [],
  }));
}

export async function getAdminExperience(): Promise<{
  configured: boolean;
  fromDb: boolean;
  error?: string;
  items: ExperienceItem[];
}> {
  if (!isDbConfigured()) return { configured: false, fromDb: false, items: DEFAULT_EXPERIENCE };
  const supabase = getSupabase()!;
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) {
    return {
      configured: true,
      fromDb: false,
      items: DEFAULT_EXPERIENCE,
      error: error?.message ?? "Query failed",
    };
  }
  return {
    configured: true,
    fromDb: true,
    items: (data as ExperienceRow[]).map((row) => ({
      id: row.id,
      role: row.role,
      company: row.company ?? "",
      period: row.period ?? "",
      bullets: row.bullets ?? [],
    })),
  };
}
