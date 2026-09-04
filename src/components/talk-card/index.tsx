import { TalkCard } from "@eduardoalvarez/arrecife";

export interface TalkResource {
  label: string;
  url: string;
}

export interface Props {
  title: string;
  event: string;
  date: string;
  dateTime: string;
  location: string;
  description?: string;
  resources?: TalkResource[];
}

/**
 * Composed in React rather than in the `.astro` file because `resources` is a
 * prop: markup written in an `.astro` reaches React as a template result and is
 * rejected. Nothing hydrates — Astro renders this to static HTML.
 *
 * 0.6.0 added the slot. Before it, a talk's slides and repo had nowhere to go,
 * so the whole card became a link to whichever one existed and the rest
 * disappeared. With resources present the library stops making the card a link,
 * which is the right call: several destinations cannot be one.
 */
export default function TalkCardWithResources({ title, event, date, dateTime, location, description, resources = [] }: Props) {
  const links =
    resources.length > 0 ? (
      <>
        {resources.map(({ label, url }) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-meta text-accent transition-standard hover:underline hover:underline-offset-4"
          >
            {label}&nbsp;↗
          </a>
        ))}
      </>
    ) : undefined;

  const content = {
    title,
    event,
    date,
    dateTime,
    location,
    description,
    className: "h-full",
  };

  return links ? <TalkCard {...content} resources={links} /> : <TalkCard {...content} />;
}
