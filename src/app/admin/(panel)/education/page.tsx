import { Suspense } from "react";
import { connection } from "next/server";
import { getAdminEducation } from "@/lib/site";
import EducationEditor from "./education-editor";

async function Loader() {
  await connection();
  const { configured, error, items } = await getAdminEducation();
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
      <EducationEditor initial={items} />
    </>
  );
}

export const metadata = { title: "Education · Admin" };

export default function EducationPage() {
  return (
    <>
      <h1>Education</h1>
      <p className="admin-sub">the cards shown in the Education section of the site</p>
      <Suspense fallback={<p className="admin-sub">loading…</p>}>
        <Loader />
      </Suspense>
    </>
  );
}
