"use client";

import Image from "next/image";
import { useEffect } from "react";
import type { CSSProperties, ReactNode } from "react";
import { PROJECTS, type Project } from "@/data/projects";
import TargetCursor from "./TargetCursor";
import {
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCE,
  DEFAULT_SETTINGS,
  DEFAULT_SKILL_SECTIONS,
} from "@/lib/defaults";
import type {
  EducationItem,
  ExperienceItem,
  SiteSettings,
  SkillSection,
} from "@/lib/types";

/* inline style helpers */
const sd = (delay: string) => ({ "--d": delay }) as CSSProperties;
const px = (styles: Record<string, string>) => styles as CSSProperties;

/* ---------- ticker ---------- */
const TICKER_ITEMS = [
  "React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL", "TypeScript",
  "Tailwind CSS", "Docker", "REST APIs", "Figma",
];

/* ---------- loader boot lines ---------- */
const BOOT_LINES: ReactNode[] = [
  <><span className="p">$</span> npm run portfolio</>,
  <><b>✓</b> fetching fonts &amp; assets…</>,
  <><b>✓</b> hydrating components…</>,
  <><b>✓</b> parallax engines online</>,
  <><b>✓</b> ready — welcome <span className="p">✦</span></>,
];

/* ---------- chars for the scramble effect ---------- */
const CHARS = "!<>-_\\/[]{}—=+*^?#01";

const SOCIAL_ICONS: { label: string; d: string }[] = [
  {
    label: "GitHub",
    d: "M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.14v3.17c0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z",
  },
  {
    label: "LinkedIn",
    d: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.31-.02-3-1.83-3-1.83 0-2.11 1.43-2.11 2.9V21H9z",
  },
  {
    label: "Twitter",
    d: "M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.4L6.47 22H3.35l7.24-8.28L2.8 2h6.4l4.42 5.84L18.9 2zm-1.1 18.1h1.73L7.06 3.8H5.2l12.6 16.3z",
  },
  {
    label: "Facebook",
    d: "M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.93.26-1.56 1.6-1.56h1.7V4.3c-.3-.04-1.3-.13-2.46-.13-2.44 0-4.1 1.49-4.1 4.22v3.4H7.5V15h2.74v7h3.26z",
  },
];

/* education side panel — generated from the education data */
function escHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function buildEduCode(items: EducationItem[], eduPanel: SiteSettings["eduPanel"]): string {
  const lines: string[] = [];
  lines.push(`<span class="ck">const</span> <span class="cn">education</span> <span class="cm">=</span> [`);
  items.forEach((e) => {
    lines.push(`  {`);
    if (e.period) lines.push(`    years: <span class="cs">"${escHtml(e.period)}"</span>,`);
    if (e.institution) lines.push(`    school: <span class="cs">"${escHtml(e.institution)}"</span>,`);
    if (e.title) lines.push(`    degree: <span class="cs">"${escHtml(e.title)}"</span>,`);
    if (e.result) lines.push(`    result: <span class="cs">"${escHtml(e.result)}"</span>,`);
    lines.push(`  },`);
  });
  lines.push(`];`);
  if (eduPanel.status) lines.push(`<span class="ck">const</span> <span class="cn">status</span> <span class="cm">=</span> <span class="cs">"${escHtml(eduPanel.status)}"</span>;`);
  lines.push(`<span class="cm">// compiled with ☕ + ⌨, never minified</span><span class="caret"></span>`);
  return lines.join("\n");
}

/* experience side panel — equalizer bar heights (px) */
const EQ_BARS = [34, 48, 26, 56, 32, 60, 38, 44, 28, 52, 36, 58, 30, 46, 40];

export default function Portfolio({
  projects = PROJECTS,
  settings = DEFAULT_SETTINGS,
  skillSections = DEFAULT_SKILL_SECTIONS,
  education = DEFAULT_EDUCATION,
  experience = DEFAULT_EXPERIENCE,
}: {
  projects?: Project[];
  settings?: SiteSettings;
  skillSections?: SkillSection[];
  education?: EducationItem[];
  experience?: ExperienceItem[];
}) {
  const roles = settings.roles.length ? settings.roles : DEFAULT_SETTINGS.roles;
  const slugOf = (p: Project) =>
    p.slug ?? (p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "project");
  const socialLinks = [
    { label: "GitHub", href: settings.socialUrls.github },
    { label: "LinkedIn", href: settings.socialUrls.linkedin },
    { label: "Twitter", href: settings.socialUrls.twitter },
    { label: "Facebook", href: settings.socialUrls.facebook },
  ];

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(pointer: fine)").matches;
    const ac = new AbortController();
    const timeouts = new Set<number>();
    const track = (id: number) => { timeouts.add(id); return id; };
    const observers: IntersectionObserver[] = [];
    const rafs: number[] = [];
    const $ = (id: string) => document.getElementById(id);

    /* ---------- TOAST ---------- */
    const toast = $("toast");
    let toastT = 0;
    function showToast(html: string) {
      if (!toast) return;
      toast.innerHTML = html;
      toast.classList.add("show");
      window.clearTimeout(toastT);
      toastT = window.setTimeout(() => toast.classList.remove("show"), 2600);
    }

    /* ---------- LOADER : terminal boot sequence ---------- */
    const loader = $("loader"), ldrLines = $("ldrLines"), ldrFill = $("ldrFill"),
      ldrPct = $("ldrPct"), ldrStatus = $("ldrStatus");
    if (loader) { loader.classList.remove("done"); loader.style.display = ""; }
    let loaderDone = false, heroKickoff: (() => void) | null = null;
    function setPct(v: number) {
      const s = Math.round(v) + "%";
      if (ldrPct) ldrPct.textContent = s;
      if (ldrFill) ldrFill.style.width = s;
    }
    function finishLoader() {
      if (loaderDone || !loader) return;
      loaderDone = true;
      setPct(100);
      if (ldrStatus) ldrStatus.textContent = "done in 1.42s ✦";
      track(window.setTimeout(() => {
        loader.classList.add("done");
        heroKickoff?.();
        track(window.setTimeout(() => { loader.style.display = "none"; }, 1100));
      }, reduced ? 0 : 350));
    }
    const lineEls = ldrLines ? (Array.from(ldrLines.children) as HTMLElement[]) : [];
    let rafSweep = 0;
    if (reduced) {
      lineEls.forEach((d) => d.classList.add("show"));
      finishLoader();
    } else {
      lineEls.forEach((el, i) => track(window.setTimeout(() => el.classList.add("show"), 180 + i * 270)));
      const t0 = performance.now(), dur = 1550;
      const sweep = (t: number) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        setPct(eased * 100);
        if (ldrStatus) ldrStatus.textContent = p < .35 ? "installing…" : p < .7 ? "compiling…" : "polishing pixels…";
        if (p < 1) rafSweep = requestAnimationFrame(sweep);
      };
      rafSweep = requestAnimationFrame(sweep);
      rafs.push(rafSweep);
      let windowLoaded = false;
      window.addEventListener("load", () => { windowLoaded = true; }, { signal: ac.signal });
      track(window.setTimeout(() => { if (windowLoaded) finishLoader(); }, dur + 250));
      track(window.setTimeout(finishLoader, 3400));
    }

    /* ---------- NAVBAR ---------- */
    const navbar = $("navbar"), progress = $("progress"),
      burger = $("burger"), mnav = $("mnav"),
      toTop = $("toTop");
    const onScroll = () => {
      const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
      navbar?.classList.toggle("scrolled", y > 40);
      if (progress) progress.style.width = (h ? (y / h) * 100 : 0) + "%";
      toTop?.classList.toggle("show", y > 600);
    };
    addEventListener("scroll", onScroll, { passive: true, signal: ac.signal });
    onScroll();
    toTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }), { signal: ac.signal });

    burger?.addEventListener("click", () => {
      if (!mnav || !burger) return;
      const open = mnav.classList.toggle("open");
      burger.classList.toggle("open", open);
      navbar?.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
      mnav.setAttribute("aria-hidden", String(!open));
      document.documentElement.classList.toggle("lock", open);
    }, { signal: ac.signal });
    mnav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => burger?.click(), { signal: ac.signal }));

    /* tap on the backdrop (not a link) closes the menu */
    mnav?.addEventListener("click", (e) => {
      if (!(e.target as Element).closest("a")) burger?.click();
    }, { signal: ac.signal });

    /* opening the menu only makes sense on mobile — close it if the viewport grows past the breakpoint,
       otherwise the overlay would cover the page with no burger left to dismiss it */
    const onResize = () => {
      if (innerWidth > 1024 && mnav?.classList.contains("open")) burger?.click();
    };
    addEventListener("resize", onResize, { signal: ac.signal });

    /* scrollspy */
    const spyLinks = [...document.querySelectorAll<HTMLAnchorElement>(".nav-links a")];
    const spyMap: Record<string, Element> = {};
    spyLinks.forEach((a) => { spyMap[a.getAttribute("href")!.slice(1)] = a; });
    const spyIO = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          spyLinks.forEach((l) => l.classList.remove("active"));
          const link = spyMap[e.target.id];
          if (link) link.classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll<HTMLElement>("main section[id]").forEach((s) => spyIO.observe(s));
    observers.push(spyIO);

    /* ---------- SCRAMBLE ROLE (starts after loader) ---------- */
    const roleEl = $("roleText");
    const scrambleTimers = new WeakMap<HTMLElement, number>();
    function scrambleTo(el: HTMLElement, text: string) {
      if (reduced) { el.textContent = text; return; }
      const from = el.textContent ?? "", len = Math.max(from.length, text.length);
      const q = Array.from({ length: len }, (_, i) => ({
        from: from[i] || "", to: text[i] || "",
        s: Math.floor(Math.random() * 12), e: 10 + Math.floor(Math.random() * 14),
      }));
      let f = 0;
      const prev = scrambleTimers.get(el);
      if (prev) window.clearInterval(prev);
      const si = window.setInterval(() => {
        let out = "", done = 0;
        q.forEach((c) => {
          if (f >= c.e) { done++; out += c.to; }
          else if (f >= c.s) { out += CHARS[Math.random() * CHARS.length | 0]; }
          else out += c.from;
        });
        el.textContent = out;
        if (done === q.length) window.clearInterval(si);
        f++;
      }, 30);
      scrambleTimers.set(el, si);
    }
    let roleIdx = 0, roleTimer = 0;
    heroKickoff = function () {
      document.querySelectorAll<HTMLElement>("#home .rv, #home .hero-name").forEach((el) => el.classList.add("in"));
      if (!roleEl) return;
      scrambleTo(roleEl, roles[0]);
      if (!reduced) roleTimer = window.setInterval(() => {
        roleIdx = (roleIdx + 1) % roles.length;
        scrambleTo(roleEl, roles[roleIdx]);
      }, 3600);
    };
    if (reduced) heroKickoff();

    /* ---------- REVEAL (non-hero) ---------- */
    const rvIO = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); rvIO.unobserve(e.target); }
    }), { threshold: .14 });
    document.querySelectorAll<HTMLElement>(".rv, .sec-head").forEach((el) => {
      if (!el.closest("#home")) rvIO.observe(el);
    });
    observers.push(rvIO);

    /* after admin saves, router.refresh()/hot reloads swap in fresh nodes —
       re-arm reveal observers whenever they appear */
    const mo = new MutationObserver((muts) => {
      muts.forEach((m) => {
        if (m.type === "attributes") {
          const el = m.target as HTMLElement;
          if (el.classList.contains("rv") && !el.classList.contains("in")) rvIO.observe(el);
          return;
        }
        m.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.classList.contains("rv") && !n.classList.contains("in")) rvIO.observe(n);
          n.querySelectorAll<HTMLElement>(".rv:not(.in)").forEach((el) => rvIO.observe(el));
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });

    /* ---------- COUNTERS ---------- */
    const cIO = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      cIO.unobserve(e.target);
      const el = e.target as HTMLElement, target = +(el.dataset.count ?? 0), dur = 1400, t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min((t - t0) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: .5 });
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => cIO.observe(el));
    observers.push(cIO);

    /* ---------- PARALLAX ---------- */
    const paraEls = [...document.querySelectorAll<HTMLElement>("[data-para]")];
    let rafPara = 0;
    if (!reduced && paraEls.length) {
      let ticking = false;
      const para = () => {
        const vh = innerHeight;
        paraEls.forEach((el) => {
          const r = el.getBoundingClientRect();
          const off = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.para!);
          el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
        });
        ticking = false;
      };
      addEventListener("scroll", () => {
        if (!ticking) { rafPara = requestAnimationFrame(para); ticking = true; }
      }, { passive: true, signal: ac.signal });
      para();
    }

    /* hero mouse float on badges */
    let rafFloat = 0;
    if (finePointer && !reduced) {
      const hero = $("home"), badges = [...document.querySelectorAll<HTMLElement>(".f-badge")];
      let tx = 0, ty = 0, cx = 0, cy = 0;
      hero?.addEventListener("mousemove", (e) => {
        const r = hero.getBoundingClientRect();
        tx = (e.clientX - r.left) / r.width - .5;
        ty = (e.clientY - r.top) / r.height - .5;
      }, { signal: ac.signal });
      const floatLoop = () => {
        cx += (tx - cx) * .06; cy += (ty - cy) * .06;
        badges.forEach((b) => {
          const f = parseFloat(b.dataset.float || "10");
          b.style.translate = `${(-cx * f).toFixed(1)}px ${(-cy * f).toFixed(1)}px`;
        });
        rafFloat = requestAnimationFrame(floatLoop);
      };
      rafFloat = requestAnimationFrame(floatLoop);
      rafs.push(rafFloat);
    }

    /* ---------- MAGNETIC ---------- */
    if (finePointer && !reduced) {
      document.querySelectorAll<HTMLElement>(".magnetic").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
          const r = btn.getBoundingClientRect();
          btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
        }, { signal: ac.signal });
        btn.addEventListener("mouseleave", () => { btn.style.transform = ""; }, { signal: ac.signal });
      });
    }

    /* ---------- TILT ---------- */
    if (finePointer && !reduced) {
      document.querySelectorAll<HTMLElement>(".pcard").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
          card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-4px)`;
        }, { signal: ac.signal });
        card.addEventListener("mouseleave", () => { card.style.transform = ""; }, { signal: ac.signal });
      });
    }

    /* ---------- PROJECT DETAIL VIEW ---------- */
    const pview = $("pview"), pvContent = $("pvContent"), grid = $("projectGrid");
    let currentSlug: string | null = null;

    function renderProject(p: Project) {
      if (!pvContent) return;
      const idx = projects.findIndex((x) => x.slug === p.slug);
      const next = projects[(idx + 1) % projects.length];
      pvContent.innerHTML = `
        <button class="pv-back" id="pvBack">← Back to projects</button>
        <div class="pv-eyebrow">CASE STUDY / 0${idx + 1} — ${p.tag}</div>
        <h2 id="pvTitle">${p.title}</h2>
        <div class="pv-metag">
          <span>YEAR → <b>${p.year}</b></span>
          <span>ROLE → <b>${p.role}</b></span>
          <span>STATUS → <b>LIVE</b></span>
        </div>
        <div class="pv-heroimg"><img src="${p.imageUrl || `https://picsum.photos/seed/${p.seed}/1400/760`}" alt="${p.title} hero"></div>
        <div class="pv-cols">
          <div>
            <p class="pv-h4">The brief</p>
            ${p.brief.map((t) => `<p>${t}</p>`).join("")}
          </div>
          <aside class="pv-side">
            <p class="pv-h4">Tech stack</p>
            <div class="pc-stack">${p.stack.map((s) => `<i>${s}</i>`).join("")}</div>
            <p class="pv-h4" style="margin-top:8px">Links</p>
            <div class="pv-links">
              <a class="btn btn-primary" href="${p.live}" target="_blank" rel="noopener">Live Project ↗</a>
              <a class="btn btn-ghost" href="${p.repo}" target="_blank" rel="noopener">GitHub (client)</a>
            </div>
          </aside>
        </div>
        <div class="pv-block">
          <p class="pv-h4">Challenges faced</p>
          <ul class="pv-list">${p.challenges.map((c, i) => `<li><span class="n">0${i + 1}</span><span>${c}</span></li>`).join("")}</ul>
        </div>
        <div class="pv-block">
          <p class="pv-h4">What's next — improvements &amp; roadmap</p>
          <ul class="pv-list fut">${p.future.map((c, i) => `<li><span class="n">0${i + 1}</span><span>${c}</span></li>`).join("")}</ul>
        </div>
        <div class="pv-next">
          <div><span class="mono">Next project</span><h4>${next.title} — ${next.tag.toLowerCase()}</h4></div>
          <button class="btn btn-amb" data-next="${next.slug}">View next →</button>
        </div>`;
      pvContent.querySelector("#pvBack")?.addEventListener("click", closeProject);
      pvContent.querySelector<HTMLElement>("[data-next]")?.addEventListener("click", (e) => {
        openProject((e.currentTarget as HTMLElement).dataset.next!, true);
      });
    }
    function openProject(slug: string, pushHash: boolean) {
      const p = projects.find((x) => x.slug === slug);
      if (!p || !pview || (currentSlug === slug && pview.classList.contains("open"))) return;
      currentSlug = slug;
      renderProject(p);
      pview.classList.add("open");
      pview.setAttribute("aria-hidden", "false");
      document.documentElement.classList.add("lock");
      pview.scrollTop = 0;
      if (pushHash && location.hash !== "#/project/" + slug) history.pushState(null, "", "#/project/" + slug);
      pvContent?.querySelector<HTMLElement>("#pvBack")?.focus({ preventScroll: true });
    }
    function closeProject() {
      if (!pview || !pview.classList.contains("open")) return;
      currentSlug = null;
      pview.classList.remove("open");
      pview.setAttribute("aria-hidden", "true");
      document.documentElement.classList.remove("lock");
      if (location.hash.startsWith("#/project/")) history.pushState(null, "", "#projects");
    }
    grid?.addEventListener("click", (e) => {
      const t = e.target as Element;
      const btn = t.closest(".view-btn");
      if (btn) openProject(btn.getAttribute("data-slug")!, true);
      const media = t.closest(".pc-media");
      if (media) {
        const slug = media.closest(".pcard")?.querySelector(".view-btn")?.getAttribute("data-slug");
        if (slug) openProject(slug, true);
      }
    }, { signal: ac.signal });
    addEventListener("hashchange", () => {
      const m = location.hash.match(/^#\/project\/(.+)$/);
      if (m) { const p = projects.find((x) => x.slug === m[1]); if (p) openProject(slugOf(p), false); }
      else closeProject();
    }, { signal: ac.signal });
    addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeProject(); if (mnav?.classList.contains("open")) burger?.click(); }
    }, { signal: ac.signal });
    (function () {
      const m = location.hash.match(/^#\/project\/(.+)$/);
      if (m) { const p = projects.find((x) => x.slug === m[1]); if (p) openProject(slugOf(p), false); }
    })();

    /* ---------- RESUME ---------- */
    document.querySelectorAll<HTMLElement>(".resume-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (btn.dataset.ready !== "true") {
          e.preventDefault();
          showToast("<b>✦</b> Résumé dropping soon — this button is wired &amp; ready!");
        }
      }, { signal: ac.signal });
    });

    /* ---------- COPY ---------- */
    document.querySelectorAll<HTMLElement>("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(btn.dataset.copy!); showToast("<b>✓</b> Copied to clipboard"); }
        catch { showToast("<b>!</b> Copy failed — select manually"); }
        const old = btn.textContent;
        btn.textContent = "COPIED ✓";
        track(window.setTimeout(() => { btn.textContent = old ?? "COPY"; }, 1600));
      }, { signal: ac.signal });
    });

    /* ---------- FORM : store in Supabase + notify via Resend; mailto as fallback ---------- */
    const form = $("contactForm") as HTMLFormElement | null;
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.currentTarget as HTMLFormElement;
      const val = (n: string) => (f.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement).value;

      const name = val("name").trim(), email = val("email").trim(),
        subject = val("subject").trim(), message = val("message").trim();
      if (!name || !email || !message) return;

      const finishMailto = () => {
        const encSubject = encodeURIComponent(subject || "Portfolio inquiry from " + name);
        const encBody = encodeURIComponent(`Hi,\n\n${message}\n\n— ${name} (${email})`);
        showToast("<b>✓</b> Opening your mail client…");
        track(window.setTimeout(() => {
          location.href = `mailto:${settings.contactEmail}?subject=${encSubject}&body=${encBody}`;
        }, 700));
      };

      showToast("<b>…</b> Sending your message…");
      fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })
        .then(async (res) => {
          if (res.ok) {
            showToast("<b>✓</b> Message sent — I'll get back to you soon!");
            form.reset();
            return;
          }
          const json = await res.json().catch(() => ({}));
          if (json?.error === "not-configured") finishMailto();
          else showToast("<b>!</b> " + (json?.error ?? "Something went wrong — email me directly."));
        })
        .catch(finishMailto);
    }, { signal: ac.signal });

    /* ---------- MISC ---------- */
    const yearEl = $("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    return () => {
      ac.abort();
      rafs.forEach((id) => cancelAnimationFrame(id));
      cancelAnimationFrame(rafFloat);
      cancelAnimationFrame(rafPara);
      cancelAnimationFrame(rafSweep);
      observers.forEach((o) => o.disconnect());
      timeouts.forEach((id) => window.clearTimeout(id));
      window.clearInterval(roleTimer);
      navbar?.classList.remove("menu-open");
      document.documentElement.classList.remove("lock");
    };
  }, []);

  return (
    <>
      {/* LOADER : terminal boot sequence */}
      <div id="loader" aria-hidden="true">
        <div className="ldr">
          <div className="ldr-head">
            <span className="dot r" /><span className="dot y" /><span className="dot g" />
            <span className="ldr-title">asif@dev : ~/portfolio — zsh</span>
          </div>
          <div className="ldr-body">
            <div id="ldrLines">
              {BOOT_LINES.map((line, i) => (
                <span key={i} className="lline">{line}</span>
              ))}
            </div>
            <div className="ldr-bar"><i id="ldrFill" /></div>
            <div className="ldr-meta">
              <span id="ldrStatus">initializing…</span>
              <span id="ldrPct">0%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="noise" aria-hidden="true" />
      <TargetCursor
        targetSelector="a, button, .pcard"
        spinDuration={2}
        hoverDuration={0.2}
        size={36}
        cornerSize={12}
        thickness={3}
        padding={6}
        dotSize={4}
        cursorColor="#4df0a5"
        cursorColorOnTarget="#ffb454"
        blendMode="normal"
        parallaxOn
        matchRadius
        showLabel
        clickEffect
        hideDefaultCursor
      />

      {/* ============ NAVBAR ============ */}
      <header id="navbar">
        <div className="nav-in">
          <a href="#home" className="logo magnetic" aria-label="Home">
            <span className="lt">&lt;</span>asif<span className="ac">/</span>foisal<span className="lt">&gt;</span>
          </a>
          <nav aria-label="Main">
            <ul className="nav-links">
              <li><a href="#home" className="active">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#education">Education</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
          <div className="nav-right">
            {/* Resume: set data-ready="true" + add your PDF at resume/Asif_Resume.pdf */}
            <a
              href="resume/Asif_Resume.pdf" download
              className="btn btn-primary nav-resume resume-btn magnetic"
              data-ready="false"
              style={px({ padding: "11px 18px", fontSize: "12px" })}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" /></svg>
              Résumé
            </a>
            <button className="burger" id="burger" aria-label="Toggle menu" aria-expanded={false}>
              <span /><span /><span />
            </button>
          </div>
          <div id="progress" />
        </div>
      </header>

      {/* MOBILE MENU */}
      <div id="mnav" aria-hidden="true">
        <nav><ul>
          <li><a href="#home"><i>01</i> Home</a></li>
          <li><a href="#about"><i>02</i> About</a></li>
          <li><a href="#skills"><i>03</i> Skills</a></li>
          <li><a href="#education"><i>04</i> Education</a></li>
          <li><a href="#experience"><i>05</i> Experience</a></li>
          <li><a href="#projects"><i>06</i> Projects</a></li>
          <li><a href="#contact"><i>07</i> Contact</a></li>
        </ul></nav>
        <div className="mnav-foot">
          <span className="mono">{settings.contactEmail}</span>
          <a className="chip" href={settings.socialUrls.github} target="_blank" rel="noopener">GitHub</a>
          <a className="chip" href={settings.socialUrls.linkedin} target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>

      <main>
        {/* ============ HERO ============ */}
        <section id="home">
          <div className="hero-grid-bg" data-para="-0.06" aria-hidden="true" />
          <div className="hero-glow g1" aria-hidden="true" />
          <div className="hero-glow g2" aria-hidden="true" />
          <span className="glyph" style={px({ top: "16%", left: "6%" })} data-para="0.14" aria-hidden="true">{"{ }"}</span>
          <span className="glyph" style={px({ top: "26%", right: "8%" })} data-para="0.22" aria-hidden="true">{"</>"}</span>
          <span className="glyph" style={px({ bottom: "30%", left: "12%" })} data-para="0.3" aria-hidden="true">{"=>"}</span>
          <span className="glyph" style={px({ bottom: "18%", right: "16%" })} data-para="0.18" aria-hidden="true">{"//"}</span>
          <span className="glyph" style={px({ top: "52%", left: "46%" })} data-para="0.26" aria-hidden="true">*</span>

          <div className="container hero-wrap">
            <div>
              <span className="avail rv"><i />OPEN TO NEW OPPORTUNITIES</span>
              <div className="term-line rv" style={sd(".08s")}>
                <span className="ps1">asif@dev</span>:<span className="ps2">~</span>$ whoami <span className="caret" />
              </div>
              <h1 className="hero-name">
                <span className="mask"><span className="mline" style={sd(".15s")}>G.M Asif</span></span>
                <span className="mask"><span className="mline outl" style={sd(".28s")}>Foisal.</span></span>
              </h1>
              <p className="hero-role rv" id="roleText" style={sd(".4s")}>Full Stack Web Developer</p>
              <p className="hero-desc rv" style={sd(".5s")}>
                I design and build <b>fast, scalable web applications</b> — from pixel-perfect interfaces to rock-solid APIs. Crafting products with the <b>MERN stack</b> from Khulna, Bangladesh.
              </p>
              <div className="hero-cta rv" style={sd(".6s")}>
                <a href="resume/Ayan_Rahman_Resume.pdf" download className="btn btn-primary resume-btn magnetic" data-ready="false">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" /></svg>
                  Download Résumé
                </a>
                <a href="#projects" className="btn btn-ghost magnetic">
                  View Projects
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M7 17L17 7M7 7h10v10" /></svg>
                </a>
              </div>
              <div className="hero-social rv" style={sd(".7s")}>
                {socialLinks.map((s) => {
                  const icon = SOCIAL_ICONS.find((i) => i.label === s.label);
                  return (
                    <a key={s.label} className="chip" href={s.href} target="_blank" rel="noopener" aria-label={s.label}>
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d={icon?.d ?? ""} /></svg>
                      {s.label}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="portrait-zone">
              <div className="ring" aria-hidden="true" />
              <div className="ring2" aria-hidden="true" />
              <figure className="portrait" data-para="0.05">
                <span className="corner c1" aria-hidden="true" />
                <span className="corner c2" aria-hidden="true" />
                <span className="corner c3" aria-hidden="true" />
                <span className="corner c4" aria-hidden="true" />
                <div className="p-frame">
                  <Image
                    src="/hero-portrait.png"
                    alt="G.M Asif Foisal — Full Stack Web Developer"
                    id="heroPhoto"
                    width={1086}
                    height={1448}
                    sizes="(max-width: 900px) 80vw, 450px"
                    style={{ height: "auto" }}
                    preload
                  />
                  <span className="scan" />
                </div>
                <span className="f-badge fb1" data-float="14"><b>$</b> npm run dev</span>
                <span className="f-badge fb2" data-float="-10">{"{ api : "}<b>online</b>{" }"}</span>
                <span className="f-badge fb3" data-float="8">200 <b>OK</b> ✦ 42ms</span>
              </figure>
            </div>
          </div>

          <div className="scroll-hint" aria-hidden="true">SCROLL</div>

          <div className="container">
            <div className="stats rv">
              <div className="stat"><div className="num"><span data-count={settings.stats.years}>0</span><em>+</em></div><div className="lbl">Years Coding</div></div>
              <div className="stat"><div className="num"><span data-count={settings.stats.projects}>0</span><em>+</em></div><div className="lbl">Projects Built</div></div>
              <div className="stat"><div className="num"><span data-count={settings.stats.clients}>0</span><em>+</em></div><div className="lbl">Happy Clients</div></div>
              <div className="stat"><div className="num"><span data-count={settings.stats.commits}>0</span><em>+</em></div><div className="lbl">Commits / Year</div></div>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker" aria-hidden="true">
          <div className="ticker-track" id="tickerTrack">
            {[0, 1].map((copy) =>
              TICKER_ITEMS.map((item, i) => (
                <span key={`${copy}-${i}`}>{item}</span>
              ))
            )}
          </div>
        </div>

        {/* ============ ABOUT ============ */}
        <section id="about">
          <div className="container">
            <div className="sec-head rv">
              <span className="sec-index">01 /</span>
              <h2 className="sec-title">About Me</h2>
              <span className="sec-line" />
            </div>
            <div className="about-grid">
              <div className="about-sticky rv">
                <figure className="about-photo">
                  <Image
                    src="/about-photo.png"
                    alt="G.M Asif Foisal — Full Stack Web Developer"
                    width={768}
                    height={1024}
                    sizes="(max-width: 900px) 88vw, 480px"
                    style={{ height: "auto" }}
                    data-para="0.04"
                  />
                  <figcaption>~/khulna · GMT+6 · probably debugging</figcaption>
                </figure>
                <div className="facts">
                  <div><span>name</span><b>G.M Asif Foisal</b></div>
                  <div><span>role</span><b>Full Stack Developer</b></div>
                  <div><span>stack</span><b>MERN + TypeScript</b></div>
                  <div><span>location</span><b>Khulna, Bangladesh</b></div>
                  <div><span>status</span><b className="gr">● open to work</b></div>
                </div>
              </div>
              <div className="about-body">
                <h3 className="rv">From <em>Class 8 curiosity</em> to full-stack developer — and just getting started.</h3>
                <p className="rv" style={sd(".05s")}>
                  My journey started long before I wrote my first line of C — back in <b>Class 8, when I discovered HTML and CSS</b> through a friend who was surprisingly good at building websites. I didn&apos;t know much about web development back then, but something about turning lines of code into something visual and interactive fascinated me. From that point on, I kept exploring.
                </p>
                <p className="rv" style={sd(".1s")}>
                  Fast-forward to <b>2023</b>, when I was preparing for university admission. Since I was going to study CSE, I decided to get a head start by learning C programming before my first semester even began. I started with small projects — a calculator, a temperature converter, a currency converter — little things that helped me understand how code could solve actual problems. Once university started, I explored C++, Java (which, let&apos;s just say, was a journey of its own), and Python.
                </p>
                <p className="rv" style={sd(".15s")}>
                  But web development never really left my mind.
                </p>
                <p className="rv" style={sd(".2s")}>
                  I started experimenting with JavaScript and the DOM, building things like rock-paper-scissors games, calculators, and sometimes just coding random things without even knowing exactly what I was trying to build. I was learning by doing, breaking things, fixing them, and occasionally wondering why something worked in the first place. Then came Tailwind CSS, and I started challenging myself in a new way: <b>pick a website, study its first page, and recreate it as closely as possible using whatever I knew at the time.</b> Those challenges pushed me to think beyond writing code and start paying attention to layouts, details, and the overall user experience.
                </p>
                <p className="rv" style={sd(".25s")}>
                  One thing led to another. I explored React, experimented with Firebase and MongoDB, and gradually moved from building small frontend experiments to creating complete web applications. During my second year at university, we started working on projects, and I decided to take things further by building my first full-stack website with React.
                </p>
                <p className="rv" style={sd(".3s")}>
                  It was also around the time agentic AI started gaining popularity, so AI coding tools naturally became part of my workflow. I still built plenty of things by hand, but I began learning how to work alongside AI — using it to speed things up, explore unfamiliar concepts, and tackle problems that would have taken me much longer to solve alone. Along the way, I discovered Next.js, UI libraries, and new frameworks that kept expanding what I thought I could build.
                </p>
                <p className="rv" style={sd(".35s")}>
                  University projects turned into opportunities to experiment with real-world ideas, and eventually, <b>a friend helped me land my first client</b>. Then came the second, the third, and more opportunities to turn what I had been learning into actual websites for actual people and businesses.
                </p>
                <p className="rv" style={sd(".4s")}>
                  And that&apos;s how I got here — from a Class 8 student curious about HTML and CSS, to a CSE student building full-stack applications and working with real clients as a developer.
                </p>
                <p className="rv" style={sd(".45s")}>
                  I&apos;m still learning, still experimenting, and still occasionally writing code just to see what happens. The tools have changed, the projects have grown, and AI has become part of the process, but the curiosity that started it all is still there.
                </p>
                <p className="rv" style={sd(".5s")}>
                  <b>I&apos;m here to build things that work, look good, solve real problems, and keep pushing me to become a better developer.</b> And honestly, I feel like I&apos;m just getting started.
                </p>

                <p className="code-comment rv">Beyond the Developer</p>
                <div className="hobby-grid">
                  <div className="hobby rv" style={sd("0s")}><span className="ic">🎮</span><b>Gamer</b><span>90+ PC games completed and still pressing start</span></div>
                </div>

                <p className="code-comment rv">currently</p>
                <div className="now-list rv">
                  <span className="chip">📚 Learning AI/ML & Automations</span>
                  <span className="chip">🧪 Experimenting with Ai Models</span>
                  <span className="chip">🧠 Deep-diving advanced TypeScript</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ SKILLS ============ */}
        <section id="skills">
          <div className="container">
            <div className="sec-head rv">
              <span className="sec-index">02 /</span>
              <h2 className="sec-title">Skills &amp; Toolbox</h2>
              <span className="sec-line" />
            </div>
            <p className="sec-sub rv">Technologies I reach for daily — measured honestly, sharpened constantly.</p>

            <div className="skill-cats" id="skillCats">
              {skillSections.map((cat, ci) => (
                <div
                  className="skill-cat rv"
                  data-icon={cat.icon}
                  key={cat.id ?? cat.name}
                  style={sd(`${(ci * 0.1).toFixed(1)}s`)}
                >
                  <div className="cat-head"><h3>{cat.name}</h3><span className="mono">{cat.label}</span></div>
                  {cat.skills.map((s) => (
                    <span className="skill-pill" key={s.id ?? s.name}>
                      {s.logo ? (
                        <>
                          <Image
                            className="skill-logo"
                            src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${s.logo}.svg`}
                            alt=""
                            width={128}
                            height={128}
                            unoptimized
                            onError={(ev) => {
                              const img = ev.currentTarget;
                              img.style.display = "none";
                              const fb = img.nextElementSibling as HTMLElement | null;
                              if (fb) fb.style.display = "inline-flex";
                            }}
                          />
                          <span className="skill-logo-fallback hide">{s.icon || "✦"}</span>
                        </>
                      ) : (
                        <span className="skill-logo-fallback">{s.icon || "✦"}</span>
                      )}
                      <b>{s.name}</b>
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <div className="skill-foot rv">
              <span className="mono">also fluent in →</span>
              <span className="chip">Firebase</span><span className="chip">Stripe</span><span className="chip">Framer Motion</span><span className="chip">Vite</span>
            </div>
          </div>
        </section>

        {/* ============ EDUCATION ============ */}
        <section id="education">
          <div className="container">
            <div className="sec-head rv">
              <span className="sec-index">03 /</span>
              <h2 className="sec-title">Education</h2>
              <span className="sec-line" />
            </div>
            <div className="edu-grid">
              <div className="edu-list">
                {education.map((e, i) => (
                  <div className="edu-card rv" key={e.id ?? e.title} style={sd(`${(i * 0.1).toFixed(1)}s`)}>
                    <div className="edu-year">{e.period}</div>
                    <div>
                      <h3>{e.title}</h3>
                      <div className="inst">{e.institution}</div>
                      <div className="res" dangerouslySetInnerHTML={{ __html: e.result }} />
                      {e.courses.length > 0 && (
                        <div className="courses">{e.courses.map((c) => <i key={c}>{c}</i>)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <aside className="edu-panel rv" style={sd(".2s")}>
                <div className="edu-panel-head">
                  <span className="dot r" /><span className="dot y" /><span className="dot g" />
                  <span className="edu-panel-title">education.ts — asif@dev</span>
                </div>
                <pre className="edu-code"><code dangerouslySetInnerHTML={{ __html: buildEduCode(education, settings.eduPanel) }} /></pre>
              </aside>
            </div>
          </div>
        </section>

        {/* ============ EXPERIENCE ============ */}
        <section id="experience">
          <div className="container">
            <div className="sec-head rv">
              <span className="sec-index">04 /</span>
              <h2 className="sec-title">Experience</h2>
              <span className="sec-line" />
            </div>
            <div className="xp-grid">
              <div className="xp">
                {experience.map((x, i) => (
                  <div className="xp-item rv" key={x.id ?? x.role} style={sd(`${(i * 0.1).toFixed(1)}s`)}>
                    <div className="xp-meta"><h3>{x.role}</h3><span className="co">@ {x.company}</span><span className="yr">{x.period}</span></div>
                    <ul>
                      {x.bullets.map((b, bi) => <li key={bi}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
              <aside className="xp-panel rv" style={sd(".2s")}>
                <div className="edu-panel-head">
                  <span className="dot r" /><span className="dot y" /><span className="dot g" />
                  <span className="edu-panel-title">career-monitor — live</span>
                </div>
                <div className="xp-body">
                  <div className="xp-big">
                    <div><div className="num"><span data-count={settings.stats.projects}>0</span><em>+</em></div><div className="lbl">Projects Shipped</div></div>
                    <div><div className="num">{settings.monitor.rating}</div><div className="lbl">{settings.monitor.ratingLabel}</div></div>
                  </div>
                  {settings.monitor.rows.map((r) => (
                    <div className="xp-row" key={r.label}>
                      <span>❯ {r.label}</span><span className="lead" /><span className="val">{r.value}</span>
                    </div>
                  ))}
                  <div className="xp-eq" aria-hidden="true">
                    {EQ_BARS.map((h, i) => (
                      <span
                        key={i}
                        style={px({ height: h + "px", animationDelay: (i * 0.13).toFixed(2) + "s", animationDuration: (0.9 + (i % 4) * 0.25).toFixed(2) + "s" })}
                      />
                    ))}
                  </div>
                  <div className="xp-eq-cap">keyboard_traffic — live feed</div>
                  <div className="xp-ping"><i />{settings.monitor.ping}</div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ============ PROJECTS ============ */}
        <section id="projects">
          <div className="container">
            <div className="sec-head rv">
              <span className="sec-index">05 /</span>
              <h2 className="sec-title">Selected Projects</h2>
              <span className="sec-line" />
              <span className="mono" style={px({ color: "var(--dim)", fontSize: "13px" })}>( 04 )</span>
            </div>
            <div className="p-grid" id="projectGrid">
              {projects.map((p, i) => (
                <article key={p.id ?? p.slug} className={"pcard rv" + (p.wide ? " pcard--wide" : "")} data-cursor-label="Open" style={sd(`${(i * 0.08).toFixed(2)}s`)}>
                  <div className="pc-media">
                    <span className="pc-tag">{p.tag}</span>
                    <Image
                      src={p.imageUrl || `https://picsum.photos/seed/${p.seed}/1200/720`}
                      alt={`${p.title} screenshot`}
                      width={1200}
                      height={720}
                      sizes="(max-width: 700px) 92vw, (max-width: 1200px) 46vw, 620px"
                    />
                    <span className="pc-arrow">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}><path d="M7 17 17 7M7 7h10v10" /></svg>
                    </span>
                  </div>
                  <div className="pc-body">
                    <h3><span className="mono">0{i + 1}</span> {p.title}</h3>
                    <p>{p.short}</p>
                    <div className="pc-stack">
                      {p.stack.slice(0, 4).map((s) => <i key={s}>{s}</i>)}
                      <i>+{p.stack.length - 4}</i>
                    </div>
                    <div className="pc-foot">
                      <div className="pc-links">
                        <a className="chip" href={p.live} target="_blank" rel="noopener">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M14 3h7v7M21 3l-9 9M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" /></svg>
                          Live
                        </a>
                        <a className="chip" href={p.repo} target="_blank" rel="noopener">
                          <svg viewBox="0 0 24 24" fill="currentColor" style={px({ width: "15px", height: "15px" })}><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.66.41.36.78 1.06.78 2.14v3.17c0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>
                          Code
                        </a>
                      </div>
                      <button className="view-btn" data-slug={p.slug}>View Details <span>→</span></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CONTACT ============ */}
        <section id="contact">
          <div className="container">
            <div className="sec-head rv">
              <span className="sec-index">06 /</span>
              <h2 className="sec-title">Get In Touch</h2>
              <span className="sec-line" />
            </div>
            <div className="contact-grid">
              <div>
                <h3 className="c-lead rv">Have an idea, a role, or just a bug you can&apos;t explain? <em>Let&apos;s talk.</em></h3>
                <p className="c-sub rv" style={sd(".05s")}>
                  My inbox is always open — whether it&apos;s a project inquiry, a collaboration, or a question about a tutorial. I usually reply within 24 hours.
                </p>
                <div className="c-row rv" style={sd(".1s")}>
                  <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="m3 6 9 7 9-7" /></svg></span>
                  <div><span className="lbl">Email</span><a className="val" href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a></div>
                  <button className="copy-btn" data-copy={settings.contactEmail}>COPY</button>
                </div>
                <div className="c-row rv" style={sd(".16s")}>
                  <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.45c.9.34 1.84.57 2.8.7A2 2 0 0 1 22 16.9z" /></svg></span>
                  <div><span className="lbl">Phone</span><a className="val" href={settings.contactPhoneHref}>{settings.contactPhoneDisplay}</a></div>
                  <button className="copy-btn" data-copy={settings.contactPhoneDisplay}>COPY</button>
                </div>
                <div className="c-row rv" style={sd(".22s")}>
                  <span className="ic"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.2 1.1-1.7 1.2-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.6-4.1-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.6c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .7-.2 1.2z" /></svg></span>
                  <div><span className="lbl">WhatsApp</span><a className="val" href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(settings.whatsappText)}`} target="_blank" rel="noopener">Chat on WhatsApp →</a></div>
                </div>
                <div className="c-row rv" style={sd(".28s")}>
                  <span className="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M12 21s-7-5.3-7-11a7 7 0 1 1 14 0c0 5.7-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></svg></span>
                  <div><span className="lbl">Location</span><span className="val">{settings.location}</span></div>
                </div>
              </div>

              <form className="c-form rv" id="contactForm" style={sd(".15s")}>
                <div className="f-row">
                  <div className="f-group"><label htmlFor="fName">Your Name <i>*</i></label><input id="fName" name="name" type="text" placeholder="Ada Lovelace" required /></div>
                  <div className="f-group"><label htmlFor="fMail">Your Email <i>*</i></label><input id="fMail" name="email" type="email" placeholder="ada@example.com" required /></div>
                </div>
                <div className="f-group"><label htmlFor="fSub">Subject</label><input id="fSub" name="subject" type="text" placeholder="Let's build something together" /></div>
                <div className="f-group"><label htmlFor="fMsg">Message <i>*</i></label><textarea id="fMsg" name="message" rows={5} placeholder="Tell me about your project…" required /></div>
                <button type="submit" className="btn btn-primary magnetic">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* ============ FOOTER ============ */}
      <footer>
        <div className="container">
          <div className="foot-big" aria-hidden="true">Asif • Foisal</div>
          <div className="foot-grid">
            <div className="foot-col">
              <h5>Sitemap</h5>
              <a href="#about">About</a><a href="#skills">Skills</a><a href="#education">Education</a><a href="#experience">Experience</a>
            </div>
            <div className="foot-col">
              <h5>Work</h5>
              <a href="#projects">Projects</a><a href="#" className="resume-btn" data-ready="false">Résumé</a><a href="#contact">Contact</a>
            </div>
            <div className="foot-col">
              <h5>Social</h5>
              <a href={settings.socialUrls.github} target="_blank" rel="noopener">GitHub</a>
              <a href={settings.socialUrls.linkedin} target="_blank" rel="noopener">LinkedIn</a>
              <a href={settings.socialUrls.twitter} target="_blank" rel="noopener">Twitter / X</a>
              <a href={settings.socialUrls.facebook} target="_blank" rel="noopener">Facebook</a>
            </div>
            <div className="foot-col">
              <h5>Contact</h5>
              <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
              <a href={settings.contactPhoneHref}>{settings.contactPhoneDisplay}</a>
              <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noopener">WhatsApp</a>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© <span id="year" /> G.M Asif Foisal. All rights reserved.</span>
            <span>Designed &amp; built with <span className="acc">☕ + ⌨</span> in Khulna</span>
          </div>
        </div>
      </footer>

      <button id="toTop" aria-label="Back to top">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 19V5m0 0-6 6m6-6 6 6" /></svg>
      </button>

      {/* PROJECT DETAIL VIEW */}
      <div id="pview" aria-hidden="true">
        <div className="pv-in" id="pvContent" />
      </div>

      <div id="toast" role="status" />
    </>
  );
}
