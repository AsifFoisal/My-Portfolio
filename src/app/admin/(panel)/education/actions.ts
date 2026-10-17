"use server";

import { getSupabase, isDbConfigured } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import type { EducationItem } from "@/lib/types";

async function requireDb() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured (.env.local).");
  return supabase;
}

export async function saveEducation(items: EducationItem[]) {
  const supabase = await requireDb();

  const clean = (items ?? []).filter((e) => e && typeof e.title === "string" && e.title.trim());

  await supabase.from("education").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  if (clean.length === 0) return { ok: true };

  const rows = clean.map((e, i) => ({
    period: (e.period ?? "").trim(),
    title: e.title.trim(),
    institution: (e.institution ?? "").trim(),
    result: (e.result ?? "").trim(),
    courses: Array.isArray(e.courses) ? e.courses.filter((c) => typeof c === "string" && c.trim()) : [],
    sort_order: i,
  }));
  const { error } = await supabase.from("education").insert(rows);
  if (error) throw new Error(error.message);
  return { ok: true };
}
