import { Suspense } from "react";
import { connection } from "next/server";
import { getAdminSkillSections } from "@/lib/site";
import SkillsEditor from "./skills-editor";

async function Loader() {
  await connection();
  const { configured, error, sections } = await getAdminSkillSections();
  return (
    <>
      {!configured && (
        <div className="admin-notice">
          Supabase is not configured — you can edit below but saving will fail until the keys
          are added to <code>.env.local</code> and <code>supabase/schema.sql</code> is run.
        </div>
      )}
      {configured && error && (
        <div className="admin-notice">
          Database query failed: {error} — make sure you ran{" "}
          <code>supabase/migration-2-skills-education-experience.sql</code> in the Supabase SQL editor.
        </div>
      )}
      <SkillsEditor initial={sections} />
    </>
  );
}

export const metadata = { title: "Skills · Admin" };

export default function SkillsPage() {
  return (
    <>
      <h1>Skills</h1>
      <p className="admin-sub">categories, skills and their meters — show up on the site immediately after saving</p>
      <Suspense fallback={<p className="admin-sub">loading…</p>}>
        <Loader />
      </Suspense>
    </>
  );
}
