export interface StackItem {
  name: string;
  description: string;
  url: string;
  featured?: boolean;
}

export interface StackCategory {
  name: string;
  items: StackItem[];
}

export const stack: StackCategory[] = [
  {
    name: "Languages",
    items: [
      {
        name: "TypeScript",
        description: "Primary language for everything. Strict mode always on.",
        url: "https://www.typescriptlang.org/",
        featured: true,
      },
    ],
  },
  {
    name: "Frameworks & Runtimes",
    items: [
      {
        name: "Astro",
        description: "Go-to for content sites. Fast by default, islands architecture.",
        url: "https://astro.build/",
        featured: true,
      },
      {
        name: "React",
        description: "UI library for building interactive interfaces.",
        url: "https://react.dev/",
        featured: true,
      },
      {
        name: "Next.js",
        description: "For product apps that need SSR, routing, and the React ecosystem.",
        url: "https://nextjs.org/",
        featured: true,
      },
      {
        name: "NestJS",
        description: "Structured Node.js framework for scalable server-side applications.",
        url: "https://nestjs.com/",
        featured: true,
      },
      {
        name: "Node.js",
        description: "Backend APIs and tooling.",
        url: "https://nodejs.org/",
        featured: true,
      },
      {
        name: "Express",
        description: "Minimal web framework for Node.js APIs.",
        url: "https://expressjs.com/",
      },
    ],
  },
  {
    name: "Infrastructure",
    items: [
      {
        name: "Vercel",
        description: "Edge deployments with zero config. Where this site lives.",
        url: "https://vercel.com/",
        featured: true,
      },
      {
        name: "Edge Functions",
        description: "Serverless functions at the edge for ultra-low latency.",
        url: "https://vercel.com/docs/functions/edge-functions",
        featured: true,
      },
      {
        name: "Supabase",
        description: "Open-source Firebase alternative — Postgres, auth, and storage.",
        url: "https://supabase.com/",
        featured: true,
      },
      {
        name: "GitHub Actions",
        description: "CI/CD workflows — simple, composable, and version-controlled.",
        url: "https://github.com/features/actions",
        featured: true,
      },
      {
        name: "GitLab",
        description: "Source control and CI/CD for client and enterprise projects.",
        url: "https://gitlab.com/",
      },
      {
        name: "AWS",
        description: "Amazon Web Services for infrastructure and cloud services.",
        url: "https://aws.amazon.com/",
        featured: true,
      },
      {
        name: "Cloudflare",
        description: "DNS, WAF, edge workers, and DDoS protection.",
        url: "https://cloudflare.com/",
      },
      {
        name: "GCP",
        description: "Google Cloud for compute, storage, and data services.",
        url: "https://cloud.google.com/",
      },
      {
        name: "Cloudinary",
        description: "Image and video management with on-the-fly transformations.",
        url: "https://cloudinary.com/",
        featured: true,
      },
      {
        name: "Algolia",
        description: "Full-text search with powerful filtering and instant results.",
        url: "https://www.algolia.com/",
        featured: true,
      },
      {
        name: "Resend",
        description: "Modern email API for developers.",
        url: "https://resend.com/",
        featured: true,
      },
      {
        name: "Mailchimp",
        description: "Email marketing and newsletter management.",
        url: "https://mailchimp.com/",
      },
      {
        name: "Make",
        description: "Visual automation platform for connecting apps and workflows.",
        url: "https://www.make.com/",
      },
    ],
  },
  {
    name: "AI Tools",
    items: [
      {
        name: "Claude Code",
        description: "Agentic coding sessions directly in the terminal.",
        url: "https://claude.ai/code",
        featured: true,
      },
      {
        name: "OpenAI",
        description: "GPT models and APIs for AI-powered features.",
        url: "https://openai.com/",
        featured: true,
      },
    ],
  },
  {
    name: "Hardware",
    items: [
      {
        name: "MacBook Pro M3 Pro",
        description: "14-inch. Fast enough for everything I throw at it.",
        url: "https://www.apple.com/macbook-pro/",
        featured: true,
      },
      {
        name: "Mac Mini M1 2020",
        description: "Home server and secondary workstation. Silent, efficient, always on.",
        url: "https://www.apple.com/mac-mini/",
        featured: true,
      },
    ],
  },
  {
    name: "Apps & Productivity",
    items: [
      {
        name: "Antigravity",
        description: "AI-powered code editor, fork of Windsurf. Main editor for daily work.",
        url: "https://antigravity.dev/",
        featured: true,
      },
      {
        name: "Warp",
        description: "Modern terminal with AI built in.",
        url: "https://www.warp.dev/",
        featured: true,
      },
      {
        name: "Figma",
        description: "Design and wireframing. Collaborative and browser-based.",
        url: "https://figma.com/",
        featured: true,
      },
      {
        name: "Miro",
        description: "Visual collaboration board for brainstorming and planning.",
        url: "https://miro.com/",
        featured: true,
      },
      {
        name: "Notion",
        description: "All-in-one workspace for notes, docs, and project management.",
        url: "https://notion.so/",
        featured: true,
      },
      {
        name: "Slack",
        description: "Team messaging and async communication.",
        url: "https://slack.com/",
        featured: true,
      },
      {
        name: "Microsoft Teams",
        description: "Team communication and video meetings.",
        url: "https://teams.microsoft.com/",
        featured: true,
      },
      {
        name: "DBeaver",
        description: "Universal database manager for SQL and NoSQL databases.",
        url: "https://dbeaver.io/",
      },
      {
        name: "Canva",
        description: "Quick design and visual content creation.",
        url: "https://canva.com/",
      },
    ],
  },
];
