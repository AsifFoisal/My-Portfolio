import { PROJECTS } from "@/data/projects";
import { getSupabase, isDbConfigured } from "@/lib/supabase";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import type { Project, PublicData, SiteSettings } from "@/lib/types";

export { DEFAULT_SETTINGS, isDbConfigured };

const SETTINGS_KEY = "site";

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
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);
  return { projects, settings };
}
