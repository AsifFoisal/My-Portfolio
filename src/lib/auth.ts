import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "asif_admin";

function secret(): string {
  return process.env.ADMIN_PASSWORD ?? process.env.ADMIN_SESSION_SECRET ?? "";
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

/** Opaque session cookie value derived from the password. */
export function adminToken(): string {
  return createHmac("sha256", secret()).update("asif-admin-v1").digest("hex");
}

export function passwordMatches(submitted: string): boolean {
  const pw = process.env.ADMIN_PASSWORD ?? "";
  if (!pw) return false;
  const a = Buffer.from(submitted);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Call inside every admin page/route/action. */
export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const store = await cookies();
  const value = store.get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const expected = adminToken();
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
