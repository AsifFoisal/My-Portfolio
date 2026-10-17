"use server";

import { getSupabase, isDbConfigured } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/lib/types";

async function requireDb(): Promise<NonNullable<ReturnType<typeof getSupabase>>> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured (.env.local).");
  return supabase;
}

function toRows(fd: FormData, id?: string): Project {
  const lines = (key: string) =>
    String(fd.get(key) ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  return {
    id,
    title: String(fd.get("title") ?? "").trim(),
    tag: String(fd.get("tag") ?? "").trim() || "PROJECT",
    year: String(fd.get("year") ?? "").trim(),
    role: String(fd.get("role") ?? "").trim(),
    wide: fd.get("wide") === "on",
    sortOrder: Number(fd.get("sortOrder") ?? 0) || 0,
    live: String(fd.get("live") ?? "").trim(),
    repo: String(fd.get("repo") ?? "").trim(),
    imageUrl: String(fd.get("imageUrl") ?? "").trim(),
    seed: String(fd.get("seed") ?? "").trim() || "project",
    short: String(fd.get("short") ?? "").trim(),
    brief: lines("brief"),
    stack: String(fd.get("stack") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    challenges: lines("challenges"),
    future: lines("future"),
  };
}

export async function saveProject(formData: FormData) {
  const supabase = await requireDb();
  const id = (formData.get("id") as string) || undefined;
  const project = toRows(formData, id);
  if (!project.title) throw new Error("Title is required");

  const row = {
    title: project.title,
    tag: project.tag,
    year: project.year,
    role: project.role,
    wide: project.wide,
    sort_order: project.sortOrder,
    live_url: project.live,
    repo_url: project.repo,
    image_url: project.imageUrl,
    seed: project.seed,
    short: project.short,
    brief: project.brief,
    stack: project.stack,
    challenges: project.challenges,
    future: project.future,
  };

  const { error } = id
    ? await supabase.from("projects").update(row).eq("id", id)
    : await supabase.from("projects").insert(row);
  if (error) throw new Error(error.message);

  return { ok: true };
}

export async function deleteProject(id: string) {
  const supabase = await requireDb();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

/** Copies the bundled sample projects into the database. */
export async function seedProjects() {
  const supabase = await requireDb();
  const rows = PROJECTS.map((p: Project, i) => ({
    title: p.title,
    tag: p.tag,
    year: p.year,
    role: p.role,
    wide: p.wide,
    sort_order: i,
    live_url: p.live,
    repo_url: p.repo,
    image_url: "",
    seed: p.seed,
    short: p.short,
    brief: p.brief,
    stack: p.stack,
    challenges: p.challenges,
    future: p.future,
  }));
  const { error } = await supabase.from("projects").insert(rows);
  if (error) throw new Error(error.message);
  return { ok: true };
}
