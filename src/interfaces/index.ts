export interface Section {
  title: string;
  anchor: string;
}

export type CategoryAllowed =
  | "engineering-leadership"
  | "platform-engineering"
  | "ai-native-engineering"
  | "career-strategy"
  | "engineering-culture"
  | "developer-experience"
  | "technical-decisions"
  | "learning-in-tech";

export type TagsAllowed =
  | "microfrontends"
  | "design-systems"
  | "single-spa"
  | "frontend-architecture"
  | "platform-thinking"
  | "technical-standards"
  | "governance"
  | "scalability"
  | "modular-architecture"
  | "monorepo"
  | "frontend-platform"
  | "system-design"
  | "event-driven-architecture"
  | "documentation"
  | "open-spec"
  | "ai-assisted-development"
  | "llm"
  | "codex"
  | "openai"
  | "cloud-ai"
  | "opencode"
  | "automation"
  | "prompt-engineering"
  | "ai-workflows"
  | "developer-productivity"
  | "ai-integration"
  | "ai-culture"
  | "engineering-management"
  | "technical-leadership"
  | "team-growth"
  | "mentorship"
  | "trust-building"
  | "decision-making"
  | "stakeholder-management"
  | "feedback-culture"
  | "psychological-safety"
  | "ownership"
  | "accountability"
  | "organizational-maturity"
  | "career-growth"
  | "tech-career"
  | "promotion"
  | "tl-to-em"
  | "career-transition"
  | "professional-identity"
  | "impostor-syndrome"
  | "burnout"
  | "tech-fatigue"
  | "continuous-learning"
  | "skill-development"
  | "technical-decisions"
  | "trade-offs"
  | "business-alignment"
  | "long-term-thinking"
  | "risk-management"
  | "prioritization"
  | "strategy"
  | "focus"
  | "complexity"
  | "tech-debt"
  | "developer-experience"
  | "tooling"
  | "ci-cd"
  | "documentation-culture"
  | "engineering-velocity"
  | "code-quality"
  | "maintainability"
  | "onboarding"
  | "knowledge-sharing";

export interface Article {
  title: string;
  slug: string;
  excerpt: string;
  seo_description: string;
  seo_image: string;
  date: string;
  categories: CategoryAllowed[];
  tags: TagsAllowed[];
  sections: Section[];
  keywords: string[];
  audio_narration?: string;
}

export type HeadingDepth = 1 | 2 | 3 | 4 | 5 | 6;

export interface Heading {
  depth: HeadingDepth;
  slug: string;
  text: string;
}

export interface ArticleLayout {
  file: string;
  url: string;
  content: Article;
  frontmatter: Article;
  heading: Heading[];
}
