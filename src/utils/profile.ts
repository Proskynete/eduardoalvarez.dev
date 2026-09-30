import type { Article } from "../interfaces";
import type { NowItem } from "../settings/now";
import type { Talk } from "../settings/talks";

/**
 * Bump when a consumer would break: a field renamed, removed or retyped.
 * Adding a field is not a bump.
 */
export const PROFILE_VERSION = 1;

export interface ProfileTalk {
  title: string;
  description: string;
  start: string;
  end: string | null;
  location: { name: string; url: string };
  organizations: { name: string; url: string }[];
  links: {
    presentation: string | null;
    repo: string | null;
    resources: { label: string; url: string }[];
  };
}

export interface ProfileArticle {
  title: string;
  slug: string;
  url: string;
  date: string;
  excerpt: string;
  categories: string[];
  tags: string[];
}

export interface Profile {
  version: typeof PROFILE_VERSION;
  generatedAt: string;
  source: string;
  talks: ProfileTalk[];
  now: { updatedAt: string; items: NowItem[] };
  quotes: { beliefs: string[]; lifePhilosophy: string[] };
  articles: ProfileArticle[];
}

export interface ProfileInput {
  siteUrl: string;
  talks: Talk[];
  nowItems: NowItem[];
  nowUpdatedAt: string;
  beliefs: string[];
  lifePhilosophy: string[];
  articles: Pick<Article, "title" | "slug" | "date" | "excerpt" | "categories" | "tags">[];
  now?: Date;
}

const newestFirst = (a: string, b: string) => new Date(b).getTime() - new Date(a).getTime();

/**
 * Builds the public profile served at `/api/profile.json`.
 *
 * It only carries text and links: talk images are build assets with hashed
 * URLs, and `show` is an editorial flag, so a hidden talk is dropped instead of
 * being published with the flag for the consumer to honour.
 */
export function buildProfile(input: ProfileInput): Profile {
  const siteUrl = input.siteUrl.replace(/\/$/, "");

  const talks: ProfileTalk[] = input.talks
    .filter((talk) => talk.show)
    .map((talk) => ({
      title: talk.title,
      description: talk.description,
      start: talk.date[0] ?? "",
      end: talk.date[1] ?? null,
      location: { name: talk.location.name, url: talk.location.url },
      organizations: talk.organizations.map(({ name, url }) => ({ name, url })),
      links: {
        presentation: talk.options?.presentation ?? null,
        repo: talk.options?.repo ?? null,
        resources: talk.options?.resources ?? [],
      },
    }))
    .sort((a, b) => newestFirst(a.start, b.start));

  const articles: ProfileArticle[] = input.articles
    .map((article) => ({
      title: article.title,
      slug: article.slug,
      url: `${siteUrl}/articles/${article.slug}`,
      date: article.date,
      excerpt: article.excerpt,
      categories: [...article.categories],
      tags: [...article.tags],
    }))
    .sort((a, b) => newestFirst(a.date, b.date));

  return {
    version: PROFILE_VERSION,
    generatedAt: (input.now ?? new Date()).toISOString(),
    source: siteUrl,
    talks,
    now: { updatedAt: input.nowUpdatedAt, items: input.nowItems },
    quotes: { beliefs: input.beliefs, lifePhilosophy: input.lifePhilosophy },
    articles,
  };
}
