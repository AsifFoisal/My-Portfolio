"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { saveProject } from "./actions";
import { useToast } from "../../toast";
import type { Project } from "@/lib/types";

export default function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const toast = useToast();
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, startSaving] = useTransition();

  async function onFile(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Upload failed");
      setImageUrl(json.url);
      toast("Image uploaded", "ok");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "err");
    } finally {
      setUploading(false);
    }
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("imageUrl", imageUrl);
    if (initial?.id) fd.set("id", initial.id);

    startSaving(async () => {
      try {
        await saveProject(fd);
        toast(initial?.id ? "Project updated" : "Project added", "ok");
        router.push("/admin/projects");
      } catch (err) {
        toast(err instanceof Error ? err.message : "Save failed", "err");
      }
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="admin-row">
        <div className="admin-field">
          <label htmlFor="title">Title *</label>
          <input id="title" name="title" type="text" defaultValue={initial?.title} required />
        </div>
        <div className="admin-field">
          <label htmlFor="tag">Tag (E-COMMERCE, HEALTH-TECH…)</label>
          <input id="tag" name="tag" type="text" defaultValue={initial?.tag} />
        </div>
      </div>
      <div className="admin-row3">
        <div className="admin-field">
          <label htmlFor="year">Year</label>
          <input id="year" name="year" type="text" defaultValue={initial?.year} />
        </div>
        <div className="admin-field">
          <label htmlFor="role">Role</label>
          <input id="role" name="role" type="text" defaultValue={initial?.role} />
        </div>
        <div className="admin-field">
          <label htmlFor="sortOrder">Sort order</label>
          <input id="sortOrder" name="sortOrder" type="number" defaultValue={initial?.sortOrder ?? 0} />
        </div>
      </div>
      <div className="admin-row">
        <div className="admin-field">
          <label htmlFor="live">Live URL</label>
          <input id="live" name="live" type="url" defaultValue={initial?.live} placeholder="https://…" />
        </div>
        <div className="admin-field">
          <label htmlFor="repo">GitHub URL</label>
          <input id="repo" name="repo" type="url" defaultValue={initial?.repo} placeholder="https://github.com/…" />
        </div>
      </div>
      <div className="admin-field">
        <label htmlFor="short">Short description (shown on the card)</label>
        <input id="short" name="short" type="text" defaultValue={initial?.short} />
      </div>

      <div className="admin-field">
        <label>Cover image (Cloudinary)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onFile(f);
          }}
        />
        <input
          name="imageUrl"
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="…or paste an image URL"
          style={{ marginTop: 8 }}
        />
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="cover preview"
            className="admin-preview"
            width={480}
            height={270}
            style={{ height: "auto" }}
            unoptimized
          />
        )}
      </div>

      <div className="admin-row">
        <div className="admin-field">
          <label htmlFor="brief">Brief paragraphs (one per line; inline HTML like &lt;b&gt; allowed)</label>
          <textarea id="brief" name="brief" defaultValue={initial?.brief?.join("\n")} />
        </div>
        <div className="admin-field">
          <label htmlFor="stack">Tech stack (comma separated)</label>
          <textarea id="stack" name="stack" defaultValue={initial?.stack?.join(", ")} />
        </div>
      </div>
      <div className="admin-row">
        <div className="admin-field">
          <label htmlFor="challenges">Challenges (one per line)</label>
          <textarea id="challenges" name="challenges" defaultValue={initial?.challenges?.join("\n")} />
        </div>
        <div className="admin-field">
          <label htmlFor="future">Roadmap (one per line)</label>
          <textarea id="future" name="future" defaultValue={initial?.future?.join("\n")} />
        </div>
      </div>
      <div className="admin-field" style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input id="wide" name="wide" type="checkbox" defaultChecked={initial?.wide} />
        <label htmlFor="wide" style={{ margin: 0 }}>
          Wide card (spans 2 columns)
        </label>
      </div>

      <button className="admin-btn primary" type="submit" disabled={saving || uploading}>
        {saving ? "Saving…" : uploading ? "Uploading image…" : "Save project"}
      </button>
    </form>
  );
}
