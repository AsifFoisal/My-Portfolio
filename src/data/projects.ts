import type { Project } from "@/lib/types";

export type { Project };

export const PROJECTS: Project[] = [
  {
    slug: 'shopstack', title: 'ShopStack', tag: 'E-COMMERCE', year: '2024', role: 'Full Stack Developer', wide: true,
    live: 'https://shopstack-live.vercel.app', repo: 'https://github.com/ayanrahman/shopstack-client',
    seed: 'shopstack-ecommerce-storefront',
    short: 'A full-featured multi-vendor e-commerce platform with Stripe payments, an admin analytics dashboard and real-time order tracking.',
    brief: [
      'ShopStack is a production-grade e-commerce platform where multiple vendors can list products, manage inventory and track sales from a dedicated dashboard, while customers enjoy a fast, app-like shopping experience.',
      'I owned the entire stack — from designing the MongoDB schema and Express REST API to building the React storefront with <b>Redux Toolkit</b>, optimistic cart updates, and a Stripe checkout flow with webhook-driven order fulfilment.'
    ],
    stack: ['React', 'Redux Toolkit', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Tailwind'],
    challenges: [
      'Stripe webhooks occasionally fired before the order document existed — solved with an idempotency-key queue that retries gracefully.',
      'Keeping the cart perfectly in sync across tabs and sessions required optimistic UI updates plus a reconciliation pass on login.',
      'Product pages with 60+ images tanked LCP; fixed with responsive srcsets, lazy loading and a lightweight CDN cache layer.'
    ],
    future: [
      'A vendor analytics dashboard with revenue charts, top-SKU insights and exportable reports.',
      'Personalized product recommendations powered by purchase history.',
      'Convert the storefront to a PWA with offline catalog browsing.'
    ]
  },
  {
    slug: 'taskforge', title: 'TaskForge', tag: 'REAL-TIME SAAS', year: '2024', role: 'Full Stack Developer', wide: false,
    live: 'https://taskforge-app.vercel.app', repo: 'https://github.com/ayanrahman/taskforge-client',
    seed: 'taskforge-kanban-collaboration',
    short: 'A real-time collaborative kanban board with drag-and-drop, team workspaces and Socket.io live presence.',
    brief: [
      'TaskForge lets distributed teams plan sprints on a shared kanban board where every drag, edit and comment appears instantly for all collaborators.',
      'Built with <b>Next.js and Prisma on PostgreSQL</b>, it uses Socket.io rooms per board, dnd-kit for accessible drag-and-drop, and optimistic mutations that roll back cleanly on conflict.'
    ],
    stack: ['Next.js', 'Socket.io', 'PostgreSQL', 'Prisma', 'dnd-kit', 'Tailwind'],
    challenges: [
      'Two users dragging the same card caused state fights — resolved with server-authoritative ordering and last-write-wins vector timestamps.',
      'Drag performance dropped with 100+ cards; moved rendering to virtualized columns and memoized card components.',
      'Securing boards per workspace meant designing row-level access checks that stayed fast at scale.'
    ],
    future: [
      'Offline mode with background sync via service workers.',
      'A Gantt-style timeline view for sprint planning.',
      'Slack and Discord notifications for card assignments and due dates.'
    ]
  },
  {
    slug: 'medibook', title: 'MediBook', tag: 'HEALTH-TECH', year: '2023', role: 'Full Stack Developer', wide: false,
    live: 'https://medibook-app.vercel.app', repo: 'https://github.com/ayanrahman/medibook-client',
    seed: 'medibook-doctor-appointment',
    short: 'A doctor appointment platform with timezone-aware scheduling, SMS confirmations and bKash/Stripe payments.',
    brief: [
      'MediBook connects patients with doctors: browse specialties, check live availability, book a chamber or video slot, and pay with bKash or Stripe — all in under two minutes.',
      'The tricky core was the <b>scheduling engine</b>: timezone-aware slots, doctor-defined availability rules, and atomic booking that prevents double-booking even under concurrent requests.'
    ],
    stack: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'bKash API', 'Twilio'],
    challenges: [
      'Timezone-aware slots for patients abroad meant storing everything in UTC and hydrating local times on the client.',
      'Race conditions on the last available slot were eliminated with atomic MongoDB transactions and versioned slot documents.',
      'SMS delivery failures required a retry queue plus a fallback email confirmation path.'
    ],
    future: [
      'In-app video consultations with WebRTC.',
      'A patient portal for prescriptions, history and follow-up reminders.',
      'Bengali + English localization across the whole platform.'
    ]
  },
  {
    slug: 'inkdrop', title: 'InkDrop', tag: 'CMS / BLOG', year: '2023', role: 'Full Stack Developer', wide: false,
    live: 'https://inkdrop-blog.vercel.app', repo: 'https://github.com/ayanrahman/inkdrop-client',
    seed: 'inkdrop-developer-blog-cms',
    short: 'A blazing-fast developer blog engine with MDX, a custom admin panel, Cloudinary media and full SEO tooling.',
    brief: [
      'InkDrop is the blogging platform I built for myself — and then open-sourced. Authors write in <b>MDX</b>, manage posts from a custom admin panel, and readers get a 100/100 Lighthouse experience.',
      'Next.js handles SSG/ISR for instant pages, Cloudinary optimizes every image on upload, and a hand-rolled sitemap + Open Graph pipeline keeps every post search-friendly.'
    ],
    stack: ['Next.js', 'MDX', 'MongoDB', 'Cloudinary', 'Tailwind', 'Vercel'],
    challenges: [
      'Wiring MDX v2 with custom remark plugins for code copy-buttons took serious build-pipeline surgery.',
      'Keeping admin auth secure while allowing draft previews meant signed, expiring preview URLs.',
      'SEO required structured data, canonical URLs and OG-image generation — all automated per post.'
    ],
    future: [
      'Threaded comments with Markdown support.',
      'An email newsletter pipeline with subscriber management.',
      'Series & collections for multi-part tutorials.'
    ]
  }
];
