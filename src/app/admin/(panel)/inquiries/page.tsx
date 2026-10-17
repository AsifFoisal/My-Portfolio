import { Suspense } from "react";
import { connection } from "next/server";
import { getSupabase, isDbConfigured } from "@/lib/supabase";
import type { Inquiry } from "@/lib/types";
import InquiryRowActions from "./inquiry-row-actions";

async function loadInquiries(): Promise<Inquiry[] | null> {
  await connection();
  if (!isDbConfigured()) return null;
  const { data, error } = await getSupabase()!
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return null;
  return data as Inquiry[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

async function Inbox() {
  const inquiries = await loadInquiries();

  if (inquiries === null) {
    return (
      <div className="admin-notice">
        Supabase is not configured — inquiries can&apos;t be stored yet. See SETUP.md.
      </div>
    );
  }
  if (inquiries.length === 0) {
    return <div className="admin-notice">No inquiries yet — messages from your contact form will appear here.</div>;
  }

  return (
    <div className="admin-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: 90 }}>Status</th>
            <th style={{ width: 280 }}>From</th>
            <th>Message</th>
            <th style={{ width: 200 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inq) => (
            <tr key={inq.id}>
              <td>
                <span className={"admin-badge" + (inq.is_read ? "" : " unread")}>
                  {inq.is_read ? "read" : "NEW"}
                </span>
                <div style={{ color: "var(--dim)", fontSize: 11, marginTop: 6, fontFamily: "var(--mono)" }}>
                  {formatDate(inq.created_at)}
                </div>
              </td>
              <td>
                <strong>{inq.name}</strong>
                <div>
                  <a href={`mailto:${inq.email}`} style={{ color: "var(--acc)" }}>{inq.email}</a>
                </div>
                {inq.subject && <div style={{ color: "var(--dim)", fontSize: 12 }}>re: {inq.subject}</div>}
              </td>
              <td style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>{inq.message}</td>
              <td>
                <InquiryRowActions id={inq.id} isRead={inq.is_read} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InquiriesPage() {
  return (
    <>
      <h1>Inquiries</h1>
      <p className="admin-sub">messages from your contact form — stored here and emailed to you via Resend</p>
      <Suspense fallback={<p className="admin-sub">loading…</p>}>
        <Inbox />
      </Suspense>
    </>
  );
}
