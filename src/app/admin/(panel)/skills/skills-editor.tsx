"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSkillSections } from "./actions";
import { useToast } from "../../toast";
import type { SkillSection } from "@/lib/types";

export default function SkillsEditor({ initial }: { initial: SkillSection[] }) {
  const router = useRouter();
  const toast = useToast();
  const [sections, setSections] = useState<SkillSection[]>(initial);
  const [pending, startPending] = useTransition();

  function setSection(i: number, patch: Partial<SkillSection>) {
    setSections((s) => s.map((sec, idx) => (idx === i ? { ...sec, ...patch } : sec)));
  }
  function setSkill(i: number, si: number, patch: Partial<SkillSection["skills"][number]>) {
    setSections((s) =>
      s.map((sec, idx) =>
        idx === i
          ? { ...sec, skills: sec.skills.map((sk, sidx) => (sidx === si ? { ...sk, ...patch } : sk)) }
          : sec,
      ),
    );
  }
  function addSkill(i: number) {
    setSections((s) => s.map((sec, idx) => (idx === i ? { ...sec, skills: [...sec.skills, { icon: "", name: "New skill", level: 80 }] } : sec)));
  }
  function removeSkill(i: number, si: number) {
    setSections((s) => s.map((sec, idx) => (idx === i ? { ...sec, skills: sec.skills.filter((_, sidx) => sidx !== si) } : sec)));
  }
  function addCategory() {
    setSections((s) => [...s, { name: "New category", label: "TAG", icon: "◆", skills: [] }]);
  }

  function onSave() {
    startPending(async () => {
      try {
        await saveSkillSections(sections);
        toast("Skills saved — live on the site", "ok");
        router.refresh();
      } catch (err) {
        toast(err instanceof Error ? err.message : "Save failed", "err");
      }
    });
  }

  return (
    <>
      <div className="admin-config">
        <button className="admin-btn" type="button" onClick={addCategory}>
          + Add category
        </button>
        <button
          className="admin-btn primary"
          type="button"
          onClick={onSave}
          disabled={pending}
        >
          {pending ? "Saving…" : "Save skills"}
        </button>
      </div>

      {sections.map((sec, i) => (
        <div className="admin-card" key={i}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 14 }}>
            <div className="admin-field" style={{ flex: 1, margin: 0 }}>
              <label>Category name</label>
              <input className="admin-input" type="text" value={sec.name} onChange={(e) => setSection(i, { name: e.target.value })} />
            </div>
            <div className="admin-field" style={{ width: 160, margin: 0 }}>
              <label>Card label (mono)</label>
              <input className="admin-input" type="text" value={sec.label} onChange={(e) => setSection(i, { label: e.target.value })} />
            </div>
            <div className="admin-field" style={{ width: 90, margin: 0 }}>
              <label>Icon</label>
              <input className="admin-input center" type="text" value={sec.icon} onChange={(e) => setSection(i, { icon: e.target.value })} />
            </div>
            <button
              className="admin-btn small danger"
              type="button"
              style={{ marginBottom: 2 }}
              onClick={() => setSections((s) => s.filter((_, idx) => idx !== i))}
            >
              ✕
            </button>
          </div>

          {sec.skills.map((sk, si) => (
            <div key={si} style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr 44px", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <input
                className="admin-input center"
                type="text"
                value={sk.icon}
                onChange={(e) => setSkill(i, si, { icon: e.target.value })}
                aria-label="Skill icon"
                placeholder="🙂"
              />
              <input
                className="admin-input"
                type="text"
                value={sk.name}
                onChange={(e) => setSkill(i, si, { name: e.target.value })}
                aria-label="Skill name"
                placeholder="Skill name"
              />
              <input
                className="admin-input"
                type="text"
                value={sk.logo}
                onChange={(e) => setSkill(i, si, { logo: e.target.value })}
                aria-label="Logo slug"
                placeholder="devicon path (e.g. react/react-original)"
              />
              <button
                className="admin-btn small danger"
                type="button"
                onClick={() => removeSkill(i, si)}
                aria-label="Remove skill"
              >
                ✕
              </button>
            </div>
          ))}
          <button className="admin-btn small" type="button" onClick={() => addSkill(i)}>
            + Add skill
          </button>
        </div>
      ))}
    </>
  );
}
