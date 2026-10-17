"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveEducation } from "./actions";
import { useToast } from "../../toast";
import type { EducationItem } from "@/lib/types";

export default function EducationEditor({ initial }: { initial: EducationItem[] }) {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState<EducationItem[]>(initial);
  const [pending, startPending] = useTransition();

  function setItem(i: number, patch: Partial<EducationItem>) {
    setItems((s) => s.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function addItem() {
    setItems((s) => [...s, { period: "", title: "New education entry", institution: "", result: "", courses: [] }]);
  }

  function onSave() {
    startPending(async () => {
      try {
        await saveEducation(items);
        toast("Education saved — live on the site", "ok");
        router.refresh();
      } catch (err) {
        toast(err instanceof Error ? err.message : "Save failed", "err");
      }
    });
  }

  return (
    <>
      <div className="admin-config">
        <button className="admin-btn" type="button" onClick={addItem}>
          + Add education
        </button>
        <button className="admin-btn primary" type="button" onClick={onSave} disabled={pending}>
          {pending ? "Saving…" : "Save education"}
        </button>
      </div>

      {items.map((it, i) => (
        <div className="admin-card" key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <strong style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--dim)" }}>
              ENTRY {String(i + 1).padStart(2, "0")}
            </strong>
            <button
              className="admin-btn small danger"
              type="button"
              onClick={() => setItems((s) => s.filter((_, idx) => idx !== i))}
            >
              ✕ Remove
            </button>
          </div>
          <div className="admin-row">
            <div className="admin-field">
              <label>Period (e.g. 2021 — 2025)</label>
              <input type="text" value={it.period} onChange={(e) => setItem(i, { period: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Title * (degree / program)</label>
              <input type="text" value={it.title} onChange={(e) => setItem(i, { title: e.target.value })} required />
            </div>
          </div>
          <div className="admin-field">
            <label>Institution</label>
            <input type="text" value={it.institution} onChange={(e) => setItem(i, { institution: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Result line (inline HTML like &lt;b&gt;3.72 / 4.00&lt;/b&gt; allowed)</label>
            <input type="text" value={it.result} onChange={(e) => setItem(i, { result: e.target.value })} />
          </div>
          <div className="admin-field" style={{ marginBottom: 0 }}>
            <label>Courses (comma separated — shown as pills)</label>
            <input
              type="text"
              value={(it.courses ?? []).join(", ")}
              onChange={(e) => setItem(i, { courses: e.target.value.split(",").map((c) => c.trim()).filter(Boolean) })}
            />
          </div>
        </div>
      ))}
    </>
  );
}
