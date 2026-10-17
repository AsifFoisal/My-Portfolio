import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isAdmin } from "@/lib/auth";
import { ToastProvider } from "../toast";
import "../admin.css";

const NAV = [
  { href: "/admin", label: "◫ Dashboard" },
  { href: "/admin/projects", label: "▤ Projects" },
  { href: "/admin/inquiries", label: "✉ Inquiries" },
  { href: "/admin/settings", label: "⚙ Settings" },
];

async function Gate({ children }: { children: React.ReactNode }) {
  // cookies() is per-request data — defer this boundary past prerendering
  await connection();
  const authed = await isAdmin();
  if (!authed) redirect("/admin/login");
  return <>{children}</>;
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
        <Gate>
          <div className="admin-shell">
            <div className="admin-side">
              <div className="admin-logo">
                &lt;asif<span className="ac">/</span>foisal&gt;
              </div>
              {NAV.map((n) => (
                <a key={n.href} href={n.href}>
                  {n.label}
                </a>
              ))}
              <div className="spacer" />
              <a href="/" target="_blank" rel="noopener">
                ↗ View site
              </a>
              <form action="/api/admin/logout" method="post">
                <button className="admin-btn small" type="submit">
                  Sign out
                </button>
              </form>
            </div>
            <main className="admin-main">{children}</main>
          </div>
        </Gate>
      </Suspense>
    </ToastProvider>
  );
}
