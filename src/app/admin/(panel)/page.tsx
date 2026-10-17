import { Suspense } from "react";
import { connection } from "next/server";
import { getSupabase, isDbConfigured } from "@/lib/supabase";
import { adminConfigured } from "@/lib/auth";
import { cloudinaryConfigured } from "@/lib/cloudinary";

type Count = { unread: number; total: number };
type Cfg = { supabase: boolean; cloudinary: boolean; resend: boolean; adminPassword: boolean; counts?: Count; projects?: number };

async function loadDashboard(): Promise<Cfg & { counts?: Count; projects?: number }> {
  await connection();
  const cfg: Cfg & { counts?: Count; projects?: number } = {
    supabase: isDbConfigured(),
    cloudinary: cloudinaryConfigured(),
    resend: Boolean(process.env.RESEND_API_KEY),
    adminPassword: adminConfigured(),
  };
  const supabase = getSupabase();
  if (supabase) {
    const [inq, unread, proj] = await Promise.all([
      supabase.from("inquiries").select("id", { count: "exact" }).limit(0),
      supabase.from("inquiries").select("id", { count: "exact" }).eq("is_read", false).limit(0),
      supabase.from("projects").select("id", { count: "exact" }).limit(0),
    ]);
    cfg.counts = {
      unread: unread.count ?? 0,
      total: inq.count ?? 0,
    };
    cfg.projects = proj.count ?? 0;
  }
  return cfg;
}

function ConfigPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={ok ? "ok" : "missing"}>
      {ok ? "●" : "○"} {label}
    </span>
  );
}

async function Dashboard() {
  const cfg = await loadDashboard();
  return (
    <>
      <h1>Dashboard</h1>
      <p className="admin-sub">manage your portfolio, project inbox and site content</p>

      <div className="admin-config">
        <ConfigPill ok={cfg.adminPassword} label="ADMIN_PASSWORD" />
        <ConfigPill ok={cfg.supabase} label="SUPABASE" />
        <ConfigPill ok={cfg.cloudinary} label="CLOUDINARY" />
        <ConfigPill ok={cfg.resend} label="RESEND" />
      </div>
      {!cfg.supabase && (
        <div className="admin-notice">
          Supabase is not configured yet — fill <code>SUPABASE_URL</code> and{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> in <code>.env.local</code>, restart the
          server, then run <code>supabase/schema.sql</code> in the Supabase SQL editor.
          Until then, admin actions are read-only.
        </div>
      )}

      <div className="admin-stats">
        <div className="admin-stat">
          <div className="num">{cfg.counts ? cfg.counts.unread : "—"}</div>
          <div className="lbl">Unread inquiries</div>
        </div>
        <div className="admin-stat">
          <div className="num">{cfg.counts ? cfg.counts.total : "—"}</div>
          <div className="lbl">Total inquiries</div>
        </div>
        <div className="admin-stat">
          <div className="num">{cfg.projects ?? "—"}</div>
          <div className="lbl">Projects in DB</div>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ margin: "0 0 12px" }}>Quick actions</h3>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <a className="admin-btn primary" href="/admin/projects/new">
            + New project
          </a>
          <a className="admin-btn" href="/admin/inquiries">
            Open inbox
          </a>
          <a className="admin-btn" href="/admin/settings">
            Site settings
          </a>
        </div>
      </div>
    </>
  );
}

export default function AdminHome() {
  return (
    <Suspense fallback={<p className="admin-sub">loading…</p>}>
      <Dashboard />
    </Suspense>
  );
}
