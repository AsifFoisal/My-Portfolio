import { Suspense } from "react";
import { connection } from "next/server";
import { getAdminProjects } from "@/lib/site";
import DeleteButton from "./delete-button";
import SeederButton from "./seeder-button";

async function ProjectsTable() {
  await connection();
  const { configured, fromDb, error, projects } = await getAdminProjects();

  if (!configured) {
    return (
      <>
        <div className="admin-notice">
          Supabase is not configured — this list shows the bundled sample data and CRUD is
          disabled. Add <code>SUPABASE_URL</code> / <code>SUPABASE_SERVICE_ROLE_KEY</code> to{" "}
          <code>.env.local</code>, restart, then run <code>supabase/schema.sql</code>.
        </div>
        <SampleTable projects={projects} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="admin-notice">
          Database query failed: {error} — make sure you ran <code>supabase/schema.sql</code> in
          the Supabase SQL editor.
        </div>
        <SampleTable projects={projects} />
      </>
    );
  }

  return (
    <>
      {projects.length === 0 && (
        <div className="admin-notice">
          The projects table is empty.{" "}
          <SeederButton /> or add your first one below.
        </div>
      )}
      {projects.length > 0 && (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Tag</th>
                <th>Year</th>
                <th>Wide</th>
                <th style={{ width: 150 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p.id ?? p.title}>
                  <td>{String(i + 1).padStart(2, "0")}</td>
                  <td>
                    <strong>{p.title}</strong>
                    <div style={{ color: "var(--dim)", fontSize: 12 }}>{p.short}</div>
                  </td>
                  <td>{p.tag}</td>
                  <td>{p.year}</td>
                  <td>{p.wide ? "yes" : "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a className="admin-btn small" href={`/admin/projects/${p.id}`}>
                        Edit
                      </a>
                      <DeleteButton id={p.id!} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function SampleTable({ projects }: { projects: { title: string; tag: string; year: string; short: string; wide: boolean }[] }) {
  return (
    <div className="admin-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Tag</th>
            <th>Year</th>
            <th>Wide</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, i) => (
            <tr key={p.title}>
              <td>{String(i + 1).padStart(2, "0")}</td>
              <td>
                <strong>{p.title}</strong>
                <div style={{ color: "var(--dim)", fontSize: 12 }}>{p.short}</div>
              </td>
              <td>{p.tag}</td>
              <td>{p.year}</td>
              <td>{p.wide ? "yes" : "—"}</td>
              <td>
                <span className="admin-badge">sample</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <h1>Projects</h1>
      <p className="admin-sub">add, edit, reorder and delete portfolio projects</p>
      <div style={{ marginBottom: 20 }}>
        <a className="admin-btn primary" href="/admin/projects/new">
          + New project
        </a>
      </div>
      <Suspense fallback={<p className="admin-sub">loading…</p>}>
        <ProjectsTable />
      </Suspense>
    </>
  );
}
