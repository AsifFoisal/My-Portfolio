"use server";

import { getSupabase, isDbConfigured } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";
import type { SkillSection } from "@/lib/types";

async function requireDb() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured (.env.local).");
  return supabase;
}

/**
 * Replaces the whole skill tree with what the editor sent.
 * Simpler than diffing rows; the panel holds everything at once anyway.
 */
export async function saveSkillSections(sections: SkillSection[]) {
  const supabase = await requireDb();

  const clean = (await Promise.resolve(sections ?? [])).filter(
    (s) => s && typeof s.name === "string" && s.name.trim(),
  );

  await supabase.from("skills").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase
    .from("skill_categories")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (clean.length === 0) return { ok: true };

  const catRows = clean.map((s, i) => ({
    name: s.name.trim(),
    label: (s.label ?? "").trim(),
    icon: (s.icon ?? "").trim(),
    sort_order: i,
  }));
  const { data: inserted, error } = await supabase
    .from("skill_categories")
    .insert(catRows)
    .select("id");
  if (error || !inserted) throw new Error(error?.message ?? "Category insert failed");

  const skillRows = clean.flatMap((s, ci) =>
    (s.skills ?? [])
      .filter((sk) => sk && typeof sk.name === "string" && sk.name.trim())
      .map((sk, si) => ({
        category_id: inserted[ci].id,
        icon: (sk.icon ?? "").trim(),
        logo: (sk.logo ?? "").trim(),
        name: sk.name.trim(),
        sort_order: si,
      })),
  );
  if (skillRows.length) {
    const { error: err2 } = await supabase.from("skills").insert(skillRows);
    if (err2) throw new Error(err2.message);
  }

  return { ok: true };
}
