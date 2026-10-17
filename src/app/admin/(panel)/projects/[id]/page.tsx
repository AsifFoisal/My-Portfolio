import { Suspense } from "react";
import { connection } from "next/server";
import { getSupabase, isDbConfigured } from "@/lib/supabase";
import ProjectForm from "../project-form";
import type { Project } from "@/lib/types";

export const metadata = { title: "Edit project · Admin" };

function rowToProject(row: {
  id: string;
  title: string;
  tag: string;
  year: string | null;
  role: string | null;
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
}): Project {
  return {
    id: row.id,
    title: row.title,
    tag: row.tag,
    year: row.year ?? "",
    role: row.role ?? "",
    wide: Boolean(row.wide),
    sortOrder: row.sort_order ?? 0,
    live: row.live_url ?? "",
    repo: row.repo_url ?? "",
    imageUrl: row.image_url ?? "",
    seed: row.seed ?? "",
    short: row.short ?? "",
    brief: row.brief ?? [],
    stack: row.stack ?? [],
    challenges: row.challenges ?? [],
    future: row.future ?? [],
  };
}

async function EditForm({ id }: { id: string }) {
  await connection();
  if (!isDbConfigured()) {
    return <div className="admin-notice">Supabase is not configured — see SETUP.md.</div>;
  }
  const { data, error } = await getSupabase()!.from("projects").select("*").eq("id", id).maybeSingle();
  if (error || !data) {
    return <div className="admin-notice">Project not found.</div>;
  }
  return <ProjectForm initial={rowToProject(data as Parameters<typeof rowToProject>[0])} />;
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <>
      <h1>Edit project</h1>
      <p className="admin-sub">changes appear on the site immediately</p>
      <div className="admin-card">
        <Suspense fallback={<p className="admin-sub">loading…</p>}>
          <EditForm id={id} />
        </Suspense>
      </div>
    </>
  );
}
