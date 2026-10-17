import type { SiteSettings } from "./types";

/** Site defaults used until something different is saved via /admin/settings. */
export const DEFAULT_SETTINGS: SiteSettings = {
  contactEmail: "hello@ayanrahman.dev",
  contactPhoneDisplay: "+880 1712-345 678",
  contactPhoneHref: "tel:+8801712345678",
  whatsappNumber: "8801712345678",
  whatsappText: "Hi! I found your portfolio.",
  location: "Khulna, Bangladesh · GMT+6",
  socialUrls: {
    github: "https://github.com/ayanrahman",
    linkedin: "https://linkedin.com/in/ayanrahman",
    twitter: "https://twitter.com/ayanrahman",
    facebook: "https://facebook.com/ayanrahman",
  },
  roles: ["Full Stack Web Developer", "MERN Stack Specialist", "API Architect", "Problem Solver", "UI Engineer"],
  stats: { years: 3, projects: 25, clients: 12, commits: 1200 },
};
