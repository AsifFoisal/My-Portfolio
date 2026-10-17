"use server";

import { getSupabase, isDbConfigured } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";

export async function saveSettings(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  if (!isDbConfigured()) throw new Error("Supabase is not configured (.env.local).");

  const value = {
    contactEmail: String(formData.get("contactEmail") ?? "").trim(),
    contactPhoneDisplay: String(formData.get("contactPhoneDisplay") ?? "").trim(),
    contactPhoneHref: String(formData.get("contactPhoneHref") ?? "").trim(),
    whatsappNumber: String(formData.get("whatsappNumber") ?? "").trim(),
    whatsappText: String(formData.get("whatsappText") ?? "").trim(),
    location: String(formData.get("location") ?? "").trim(),
    socialUrls: {
      github: String(formData.get("github") ?? "").trim(),
      linkedin: String(formData.get("linkedin") ?? "").trim(),
      twitter: String(formData.get("twitter") ?? "").trim(),
      facebook: String(formData.get("facebook") ?? "").trim(),
    },
    roles: String(formData.get("roles") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    stats: {
      years: Number(formData.get("statYears") ?? 0) || 0,
      projects: Number(formData.get("statProjects") ?? 0) || 0,
      clients: Number(formData.get("statClients") ?? 0) || 0,
      commits: Number(formData.get("statCommits") ?? 0) || 0,
    },
    monitor: {
      rating: String(formData.get("monitorRating") ?? "").trim(),
      ratingLabel: String(formData.get("monitorRatingLabel") ?? "").trim() || "Freelance Rating",
      ping: String(formData.get("monitorPing") ?? "").trim(),
      rows: String(formData.get("monitorRows") ?? "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((l) => {
          const [label, ...rest] = l.split("|");
          return { label: (label || "").trim(), value: rest.join("|").trim() };
        })
        .filter((r) => r.label),
    },
    eduPanel: {
      status: String(formData.get("eduPanelStatus") ?? "").trim(),
    },
  };

  const { error } = await getSupabase()!
    .from("site_settings")
    .upsert({ key: "site", value, updated_at: new Date().toISOString() });
  if (error) throw new Error(error.message);

  return { ok: true };
}
