"use server";

import { getSupabase, isDbConfigured } from "@/lib/supabase";
import { isAdmin } from "@/lib/auth";

async function requireDb() {
  if (!(await isAdmin())) throw new Error("Unauthorized");
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured (.env.local).");
  return supabase;
}

export async function setInquiryRead(id: string, isRead: boolean) {
  const supabase = await requireDb();
  const { error } = await supabase.from("inquiries").update({ is_read: isRead }).eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function deleteInquiry(id: string) {
  const supabase = await requireDb();
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}
