import { Suspense } from "react";
import { connection } from "next/server";
import { getAdminExperience } from "@/lib/site";
import ExperienceEditor from "./experience-editor";

async function Loader() {
  await connection();
  const { configured, error, items } = await getAdminExperience();
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
      <ExperienceEditor initial={items} />
    </>
  );
}

export const metadata = { title: "Experience · Admin" };

export default function ExperiencePage() {
  return (
    <>
      <h1>Experience</h1>
      <p className="admin-sub">positions in the Experience timeline of the site</p>
      <Suspense fallback={<p className="admin-sub">loading…</p>}>
        <Loader />
      </Suspense>
    </>
  );
}
