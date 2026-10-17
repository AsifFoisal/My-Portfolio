import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { cloudinaryConfigured, uploadImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!cloudinaryConfigured()) {
    return NextResponse.json({ error: "Cloudinary is not configured. Fill in the keys in .env.local." }, { status: 501 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be < 8 MB" }, { status: 413 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 415 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, file.name || "upload");
    return NextResponse.json({ ok: true, url: result.url, publicId: result.publicId });
  } catch (err) {
    console.error("cloudinary upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
