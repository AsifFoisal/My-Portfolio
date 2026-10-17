import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, passwordMatches } from "@/lib/auth";

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null);
  const password = form ? String(form.get("password") ?? "") : "";

  if (!passwordMatches(password)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", req.url), { status: 303 });
  }

  const res = NextResponse.redirect(new URL("/admin", req.url), { status: 303 });
  res.cookies.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
