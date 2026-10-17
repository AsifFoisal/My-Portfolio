import type { EducationItem, ExperienceItem, SiteSettings, SkillSection } from "./types";

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
  eduPanel: {
    status: "curiosity: infinite",
  },
  monitor: {
    rating: "5.0★",
    ratingLabel: "Freelance Rating",
    rows: [
      { label: "clients_happy", value: "12+" },
      { label: "commits_per_year", value: "1.2k+" },
      { label: "uptime_freelance", value: "100%" },
      { label: "speed_gained", value: "+40%" },
      { label: "interns_mentored", value: "02" },
    ],
    ping: "asiffoisal.dev → 200 OK · open to work",
  },
};

export const DEFAULT_SKILL_SECTIONS: SkillSection[] = [
  {
    name: "Frontend", label: "UI / CLIENT", icon: "{ }",
    skills: [
      { icon: "🎨", name: "HTML & CSS", logo: "html5/html5-original", level: 95 },
      { icon: "⚛️", name: "React.js", logo: "react/react-original", level: 90 },
      { icon: "💨", name: "Tailwind CSS", logo: "tailwindcss/tailwindcss-original", level: 92 },
      { icon: "▲", name: "Next.js", logo: "nextjs/nextjs-original", level: 85 },
      { icon: "🧩", name: "TypeScript", logo: "typescript/typescript-original", level: 82 },
      { icon: "🗃️", name: "Redux / Zustand", logo: "redux/redux-original", level: 80 },
    ],
  },
  {
    name: "Backend", label: "API / SERVER", icon: "⚙",
    skills: [
      { icon: "🟩", name: "Node.js", logo: "nodejs/nodejs-original", level: 88 },
      { icon: "🚂", name: "Express.js", level: 90 },
      { icon: "🍃", name: "MongoDB / Mongoose", logo: "mongodb/mongodb-original", level: 85 },
      { icon: "🐘", name: "PostgreSQL", logo: "postgresql/postgresql-original", level: 75 },
      { icon: "🔌", name: "REST & GraphQL", logo: "graphql/graphql-plain", level: 80 },
      { icon: "🔐", name: "Auth / JWT / OAuth", level: 85 },
    ],
  },
  {
    name: "Tools & DevOps", label: "WORKFLOW", icon: "$",
    skills: [
      { icon: "🌿", name: "Git & GitHub", logo: "git/git-original", level: 90 },
      { icon: "▲", name: "Vercel / Netlify", logo: "vercel/vercel-original", level: 85 },
      { icon: "🎯", name: "Figma → Code", logo: "figma/figma-original", level: 78 },
      { icon: "🧪", name: "Postman / Testing", logo: "postman/postman-original", level: 80 },
      { icon: "🐳", name: "Docker", logo: "docker/docker-original", level: 70 },
      { icon: "🐧", name: "Linux / Bash", logo: "bash/bash-plain", level: 72 },
    ],
  },
];

export const DEFAULT_EDUCATION: EducationItem[] = [
  {
    period: "2021 — 2025",
    title: "B.Sc. in Computer Science & Engineering",
    institution: "Daffodil International University · Khulna",
    result: "CGPA: <b>3.72 / 4.00</b> · Vice-captain, DIU Computer & Coding Club",
    courses: ["Data Structures", "Algorithms", "DBMS", "Software Engineering", "Web Technologies", "Computer Networks"],
  },
  {
    period: "2018 — 2020",
    title: "HSC — Science",
    institution: "Govt. Science College · Khulna",
    result: "GPA: <b>5.00 / 5.00</b> · Physics, Chemistry, Higher Math",
    courses: [],
  },
  {
    period: "2018",
    title: "SSC — Science",
    institution: "Ideal School & College · Khulna",
    result: "GPA: <b>5.00 / 5.00</b> · First encounter with HTML, never recovered",
    courses: [],
  },
];

export const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    role: "Full Stack Developer",
    company: "TechNest Labs",
    period: "Jan 2024 — Present",
    bullets: [
      "Building and maintaining MERN-based client dashboards used by 5,000+ monthly users.",
      "Cut average page load time by 40% through code-splitting, lazy routes and image optimization.",
      "Designed a reusable component library adopted across 3 internal products; mentoring 2 interns.",
    ],
  },
  {
    role: "Web Developer Intern",
    company: "Craftden Studio",
    period: "Jun 2023 — Dec 2023",
    bullets: [
      "Shipped 6 client websites from Figma handoff to production, pixel-perfect and responsive.",
      "Integrated REST APIs, payment gateways (bKash / Stripe) and CMS back-ends.",
      "Introduced Git workflow & code reviews to a team of four, reducing merge conflicts to near zero.",
    ],
  },
  {
    role: "Freelance Web Developer",
    company: "Upwork · Fiverr",
    period: "2022 — Present",
    bullets: [
      "Delivered 15+ projects — landing pages, e-commerce stores, booking systems — with a 5.0★ average rating.",
      "Handled the full cycle: scoping calls, estimation, development, deployment and post-launch support.",
    ],
  },
];
