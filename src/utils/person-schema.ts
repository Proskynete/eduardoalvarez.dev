import settings from "../settings";

/**
 * One Person for every JSON-LD block on the site.
 *
 * The home page and /about used to describe two different people (different
 * `sameAs`, one with `knowsAbout`, neither with an `@id`), so search engines
 * had nothing tying them together or to the articles and talks. Every block
 * now either embeds this node or points at it through `personRef`.
 */
export const PERSON_ID = `${settings.url}/#person`;

/** Public profiles only: what is shown on the site, never the CV or a dead channel. */
export function personSameAs(): string[] {
  const profiles = [
    ...settings.social_network.filter((s) => s.show && s.name !== "Curriculum").map((s) => s.link),
    ...settings.contacts.filter((c) => c.show && c.href.startsWith("http")).map((c) => c.href),
  ];
  return [...new Set(profiles)];
}

export const personSchema = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: settings.title,
  alternateName: settings.author.name,
  description:
    "Technical Lead · Spec-Driven Development. Enseño a construir software con IA sin dejar de entender lo que hacemos.",
  url: settings.url,
  image: `${settings.url}/images/eduardo-alvarez.webp`,
  email: settings.email,
  jobTitle: "Technical Lead",
  hasOccupation: { "@type": "Role", roleName: "Technical Lead" },
  knowsAbout: [
    "Spec-Driven Development",
    "AI-assisted Software Development",
    "Frontend Development",
    "Software Architecture",
    "Technical Education",
  ],
  sameAs: personSameAs(),
};

export const personRef = { "@id": PERSON_ID };
