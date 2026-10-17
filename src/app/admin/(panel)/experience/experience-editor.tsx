"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveExperience } from "./actions";
import { useToast } from "../../toast";
import type { ExperienceItem } from "@/lib/types";

export default function ExperienceEditor({ initial }: { initial: ExperienceItem[] }) {
  const router = useRouter();
  const toast = useToast();
  const [items, setItems] = useState<ExperienceItem[]>(initial);
  const [pending, startPending] = useTransition();

  function setItem(i: number, patch: Partial<ExperienceItem>) {
    setItems((s) => s.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }
  function addItem() {
    setItems((s) => [...s, { role: "New role", company: "", period: "", bullets: [] }]);
  }

  function onSave() {
    startPending(async () => {
      try {
        await saveExperience(items);
        toast("Experience saved — live on the site", "ok");
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
          + Add experience
        </button>
        <button className="admin-btn primary" type="button" onClick={onSave} disabled={pending}>
          {pending ? "Saving…" : "Save experience"}
        </button>
      </div>

      {items.map((it, i) => (
        <div className="admin-card" key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <strong style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--dim)" }}>
              POSITION {String(i + 1).padStart(2, "0")}
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
              <label>Role / title</label>
              <input type="text" value={it.role} onChange={(e) => setItem(i, { role: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Company</label>
              <input type="text" value={it.company} onChange={(e) => setItem(i, { company: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Period</label>
              <input type="text" value={it.period} onChange={(e) => setItem(i, { period: e.target.value })} />
            </div>
          </div>
          <div className="admin-field" style={{ marginBottom: 0 }}>
            <label>Bullet points (one per line — shown in the timeline)</label>
            <textarea
              value={(it.bullets ?? []).join("\n")}
              onChange={(e) => setItem(i, { bullets: e.target.value.split("\n").map((b) => b.trim()).filter(Boolean) })}
            />
          </div>
        </div>
      ))}
    </>
  );
}
