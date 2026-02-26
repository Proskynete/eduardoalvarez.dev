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
      {
        name: "Python",
        description: "For scripting, data pipelines, and AI/ML tooling.",
        url: "https://www.python.org/",
      },
      {
        name: "Go",
        description: "When I need performance and simplicity in platform tooling.",
        url: "https://go.dev/",
      },
    ],
  },
  {
    name: "Frameworks & Runtimes",
    items: [
      {
        name: "Astro",
        description: "My go-to for content sites. Fast by default, islands architecture.",
        url: "https://astro.build/",
        featured: true,
      },
      {
        name: "Next.js",
        description: "For product apps that need SSR, routing, and React ecosystem.",
        url: "https://nextjs.org/",
      },
      {
        name: "Node.js",
        description: "Backend APIs and tooling — especially with Hono or Fastify.",
        url: "https://nodejs.org/",
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
        name: "GitHub Actions",
        description: "CI/CD workflows — simple, composable, and version-controlled.",
        url: "https://github.com/features/actions",
      },
      {
        name: "Cloudflare",
        description: "DNS, WAF, edge workers, and DDoS protection.",
        url: "https://cloudflare.com/",
      },
    ],
  },
  {
    name: "AI Tools",
    items: [
      {
        name: "Claude",
        description: "Primary AI assistant for coding, writing, and thinking through hard problems.",
        url: "https://claude.ai/",
        featured: true,
      },
      {
        name: "Claude Code",
        description: "Agentic coding sessions directly in the terminal.",
        url: "https://claude.ai/code",
        featured: true,
      },
      {
        name: "Cursor",
        description: "AI-first editor for pair programming sessions.",
        url: "https://cursor.sh/",
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
        name: "LG 27UK850-W",
        description: "27-inch 4K monitor. Great color accuracy, USB-C hub.",
        url: "https://www.lg.com/",
      },
    ],
  },
  {
    name: "Apps & Productivity",
    items: [
      {
        name: "Neovim",
        description: "Editor for everything that doesn't need an AI co-pilot.",
        url: "https://neovim.io/",
        featured: true,
      },
      {
        name: "Warp",
        description: "Modern terminal with AI built in. Replaced iTerm2.",
        url: "https://www.warp.dev/",
      },
      {
        name: "Linear",
        description: "Project management. Fast, opinionated, no Jira ceremony.",
        url: "https://linear.app/",
      },
      {
        name: "Obsidian",
        description: "Personal knowledge management. Linked thinking, local-first.",
        url: "https://obsidian.md/",
      },
      {
        name: "Figma",
        description: "Design and wireframing. Collaborative and browser-based.",
        url: "https://figma.com/",
      },
    ],
  },
];
