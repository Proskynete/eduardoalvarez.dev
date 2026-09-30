import type { Article } from "../../interfaces";
import { beliefs, lifePhilosophy } from "../../settings/about";
import config from "../../settings/index.ts";
import { lastUpdated, nowItems } from "../../settings/now";
import { talks } from "../../settings/talks";
import { buildProfile } from "../../utils/profile";

/**
 * Public profile data for the rest of the ecosystem (terminal.eduardoalvarez.dev
 * reads it at build time). Prerendered: it only changes when the site deploys.
 */
export const prerender = true;

const articleFiles = import.meta.glob<{ frontmatter: Article }>("../articles/*.mdx", { eager: true });

export function GET() {
  const profile = buildProfile({
    siteUrl: config.url,
    talks,
    nowItems,
    nowUpdatedAt: lastUpdated,
    beliefs,
    lifePhilosophy,
    articles: Object.values(articleFiles).map(({ frontmatter }) => frontmatter),
  });

  return new Response(JSON.stringify(profile), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
