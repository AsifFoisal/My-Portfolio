import { Suspense } from "react";
import { adminConfigured } from "@/lib/auth";
import "../admin.css";

export const metadata = { title: "Admin · Login" };

async function LoginForm({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const configured = adminConfigured();
  return (
    <>
      <div className="admin-card" style={{ width: "min(420px, 92vw)" }}>
        <h1 style={{ fontFamily: "var(--disp)", margin: "0 0 4px" }}>
          <span className="admin-logo">
            &lt;asif<span className="ac">/</span>foisal&gt;
          </span>{" "}
          Admin
        </h1>
        <p className="admin-sub">Enter the admin password to continue.</p>
        {!configured && (
          <div className="admin-notice">
            ADMIN_PASSWORD is not set. Add it to <code>.env.local</code> and restart
            the server first.
          </div>
        )}
        {error && <div className="admin-notice">Wrong password — try again.</div>}
        <form action="/api/admin/login" method="post">
          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required autoFocus />
          </div>
          <button className="admin-btn primary" type="submit" disabled={!configured}>
            Sign in
          </button>
        </form>
      </div>
    </>
  );
}

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="admin-login">
      <Suspense fallback={<div className="admin-card" style={{ width: "min(420px, 92vw)" }} />}>
        <LoginForm searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
