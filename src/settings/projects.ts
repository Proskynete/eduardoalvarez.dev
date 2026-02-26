export type ProjectStatus = "active" | "maintained" | "archived";

export interface Project {
  title: string;
  link?: string;
  githubLink?: string;
  description: string;
  techStack: string[];
  status: ProjectStatus;
}

export const projects: Project[] = [
  {
    title: "Color Contrast Checker",
    link: "https://c3.eduardoalvarez.dev",
    githubLink: "https://github.com/Proskynete/color-contrast-checker",
    description: "Calculate the contrast ratio of text and background colors. WCAG-compliant accessibility tool.",
    techStack: ["React", "TypeScript", "Tailwind CSS", "Next.js", "Vercel"],
    status: "active",
  },
  {
    title: "Vertical Timeline Component React",
    githubLink: "https://github.com/Proskynete/vertical-timeline-component-react",
    description: "A simple component to generate a responsive vertical timeline.",
    techStack: ["React", "TypeScript", "Styled Components", "Jest"],
    status: "maintained",
  },
  {
    title: "Pretty Rating React",
    githubLink: "https://github.com/Proskynete/pretty-rating-react",
    description: "A small library that transforms your rating into icons for the web.",
    techStack: ["React", "TypeScript", "Styled Components", "Jest"],
    status: "maintained",
  },
  {
    title: "Node API Skeleton",
    githubLink: "https://github.com/Proskynete/node-api-skeleton",
    description: "Starter project for a Node API with TypeScript, testing, and CI/CD setup.",
    techStack: ["Express", "TypeScript", "Jest", "SuperTest", "Swagger", "Docker", "GitHub Actions"],
    status: "archived",
  },
];
