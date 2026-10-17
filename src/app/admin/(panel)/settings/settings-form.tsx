"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSettings } from "./actions";
import { useToast } from "../../toast";
import type { SiteSettings } from "@/lib/types";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startPending] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    startPending(async () => {
      try {
        await saveSettings(fd);
        toast("Settings saved — live on the site", "ok");
        router.refresh();
      } catch (err) {
        toast(err instanceof Error ? err.message : "Save failed", "err");
      }
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="admin-card">
        <h3 style={{ margin: "0 0 16px" }}>Contact & location</h3>
        <div className="admin-row">
          <div className="admin-field">
            <label htmlFor="contactEmail">Contact email</label>
            <input id="contactEmail" name="contactEmail" type="email" defaultValue={initial.contactEmail} />
          </div>
          <div className="admin-field">
            <label htmlFor="location">Location label</label>
            <input id="location" name="location" type="text" defaultValue={initial.location} />
          </div>
        </div>
        <div className="admin-row3">
          <div className="admin-field">
            <label htmlFor="contactPhoneDisplay">Phone (display)</label>
            <input id="contactPhoneDisplay" name="contactPhoneDisplay" type="text" defaultValue={initial.contactPhoneDisplay} />
          </div>
          <div className="admin-field">
            <label htmlFor="contactPhoneHref">Phone (href)</label>
            <input id="contactPhoneHref" name="contactPhoneHref" type="text" defaultValue={initial.contactPhoneHref} />
          </div>
          <div className="admin-field">
            <label htmlFor="whatsappNumber">WhatsApp number</label>
            <input id="whatsappNumber" name="whatsappNumber" type="text" defaultValue={initial.whatsappNumber} />
          </div>
        </div>
        <div className="admin-field">
          <label htmlFor="whatsappText">WhatsApp pre-filled message</label>
          <input id="whatsappText" name="whatsappText" type="text" defaultValue={initial.whatsappText} />
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ margin: "0 0 16px" }}>Social links</h3>
        <div className="admin-row">
          <div className="admin-field">
            <label htmlFor="github">GitHub</label>
            <input id="github" name="github" type="url" defaultValue={initial.socialUrls.github} />
          </div>
          <div className="admin-field">
            <label htmlFor="linkedin">LinkedIn</label>
            <input id="linkedin" name="linkedin" type="url" defaultValue={initial.socialUrls.linkedin} />
          </div>
        </div>
        <div className="admin-row">
          <div className="admin-field">
            <label htmlFor="twitter">Twitter / X</label>
            <input id="twitter" name="twitter" type="url" defaultValue={initial.socialUrls.twitter} />
          </div>
          <div className="admin-field">
            <label htmlFor="facebook">Facebook</label>
            <input id="facebook" name="facebook" type="url" defaultValue={initial.socialUrls.facebook} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ margin: "0 0 16px" }}>Hero</h3>
        <div className="admin-field">
          <label htmlFor="roles">Rotating roles (one per line)</label>
          <textarea id="roles" name="roles" defaultValue={initial.roles.join("\n")} />
        </div>
        <div className="admin-row3">
          <div className="admin-field">
            <label htmlFor="statYears">Stat · years coding</label>
            <input id="statYears" name="statYears" type="number" defaultValue={initial.stats.years} />
          </div>
          <div className="admin-field">
            <label htmlFor="statProjects">Stat · projects built</label>
            <input id="statProjects" name="statProjects" type="number" defaultValue={initial.stats.projects} />
          </div>
          <div className="admin-field">
            <label htmlFor="statClients">Stat · happy clients</label>
            <input id="statClients" name="statClients" type="number" defaultValue={initial.stats.clients} />
          </div>
        </div>
        <div className="admin-field">
          <label htmlFor="statCommits">Stat · commits / year</label>
          <input id="statCommits" name="statCommits" type="number" defaultValue={initial.stats.commits} />
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ margin: "0 0 16px" }}>Career monitor (Experience side panel)</h3>
        <div className="admin-row">
          <div className="admin-field">
            <label htmlFor="monitorRating">Big rating badge</label>
            <input id="monitorRating" name="monitorRating" type="text" defaultValue={initial.monitor.rating} />
          </div>
          <div className="admin-field">
            <label htmlFor="monitorRatingLabel">Rating label</label>
            <input id="monitorRatingLabel" name="monitorRatingLabel" type="text" defaultValue={initial.monitor.ratingLabel} />
          </div>
        </div>
        <div className="admin-field">
          <label htmlFor="monitorRows">Stat rows (one per line — format: label | value)</label>
          <textarea
            id="monitorRows"
            name="monitorRows"
            defaultValue={initial.monitor.rows.map((r) => `${r.label} | ${r.value}`).join("\n")}
          />
        </div>
        <div className="admin-field" style={{ marginBottom: 0 }}>
          <label htmlFor="monitorPing">Ping line (bottom of the panel)</label>
          <input id="monitorPing" name="monitorPing" type="text" defaultValue={initial.monitor.ping} />
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ margin: "0 0 16px" }}>Education code panel (terminal side text)</h3>
        <div className="admin-field" style={{ marginBottom: 0 }}>
          <label htmlFor="eduPanelStatus">Status line</label>
          <input id="eduPanelStatus" name="eduPanelStatus" type="text" defaultValue={initial.eduPanel.status} />
        </div>
        <p className="admin-sub" style={{ margin: 0 }}>
          Shown as the last lines of the generated <code>education.ts</code> panel.
        </p>
      </div>

      <button className="admin-btn primary" type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
