import { NextResponse } from "next/server";
import { Resend } from "resend";

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const name = str(body.name, 120);
  const email = str(body.email, 200);
  const subject = str(body.subject, 200);
  const message = str(body.message, 5000);

  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please fill in a valid name, email and message." }, { status: 422 });
  }

  const dbConfigured = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  const mailConfigured = Boolean(process.env.RESEND_API_KEY);
  if (!dbConfigured && !mailConfigured) {
    // nothing wired up yet — the client falls back to the mailto flow
    return NextResponse.json({ error: "not-configured" }, { status: 501 });
  }

  let stored = false;
  let emailed = false;

  if (dbConfigured) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });
    const { error } = await supabase
      .from("inquiries")
      .insert({ name, email, subject, message });
    if (error) console.error("inquiry insert failed:", error.message);
    else stored = true;
  }

  if (mailConfigured) {
    try {
      const { Resend: ResendClient } = await import("resend");
      const resend = new ResendClient(process.env.RESEND_API_KEY!);
      const to = process.env.MAIL_TO || "hello@ayanrahman.dev";
      await resend.emails.send({
        from: process.env.MAIL_FROM || "Portfolio <onboarding@resend.dev>",
        to,
        subject: subject ? `Portfolio inquiry: ${subject}` : `Portfolio inquiry from ${name}`,
        html: `
          <h2>New portfolio inquiry</h2>
          <p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p>
          ${subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ""}
          <hr/>
          <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        `,
      });
      emailed = true;
    } catch (err) {
      console.error("resend send failed:", err);
    }
  }

  if (!stored && !emailed) {
    return NextResponse.json({ error: "Delivery failed, please email me directly." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, stored, emailed });
}
