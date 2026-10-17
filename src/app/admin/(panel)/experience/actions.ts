"use server";

import { getSupabase, isDbConfigured } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import type { ExperienceItem } from "@/lib/types";

async function requireDb() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured (.env.local).");
  return supabase;
}

export async function saveExperience(items: ExperienceItem[]) {
  const supabase = await requireDb();

  const clean = (items ?? []).filter((x) => x && typeof x.role === "string" && x.role.trim());

  await supabase.from("experience").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  if (clean.length === 0) return { ok: true };

  const rows = clean.map((x, i) => ({
    role: x.role.trim(),
    company: (x.company ?? "").trim(),
    period: (x.period ?? "").trim(),
    bullets: Array.isArray(x.bullets)
      ? x.bullets.filter((b) => typeof b === "string" && b.trim())
      : [],
    sort_order: i,
  }));
  const { error } = await supabase.from("experience").insert(rows);
  if (error) throw new Error(error.message);
  return { ok: true };
}
