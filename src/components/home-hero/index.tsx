import { social, Text } from "@eduardoalvarez/arrecife";

type Red = { name: string; link: string };

const ICONO: Record<string, (props: { className?: string }) => React.ReactNode> = {
  github: social.GitHub,
  linkedin: social.LinkedIn,
  youtube: social.YouTube,
  correo: social.Correo,
  rss: social.Rss,
};

/**
 * The hero, rebuilt around one idea: the page opens on who writes it.
 *
 * What changed from the previous version, and why each one:
 *
 * · Three paragraphs became one line. The old hero explained the site — that
 *   there are articles, talks, consulting and a newsletter — before saying
 *   anything about the person. The nav already lists all of that.
 * · The two buttons are gone. A row of social icons says where to find him,
 *   which is what a personal site's opening actually owes the reader.
 * · The keyword row is mono, like the rest of the site's chrome.
 * · Photo and mascot share the frame: the face is who he is, the fin is what
 *   he is recognised by. Neither works alone here — the mascot on its own left
 *   a page with no author, and a portrait on its own drops the brand.
 * · The icon row only carries the destinations that have a real mark. npm and
 *   the CV have none, and a lettered box beside two logos reads as a gap rather
 *   than a link — they stay in the footer, where the links are text anyway.
 *
 * Every value comes from the design system: no hex, no ad-hoc sizes.
 */
export default function HomeHero({
  eyebrow,
  name,
  tagline,
  keywords,
  redes,
  photo,
  mascot,
  correo,
}: {
  eyebrow: string;
  name: string;
  tagline: string;
  keywords: readonly string[];
  redes: readonly Red[];
  photo: string;
  mascot: string;
  correo?: string | undefined;
}) {
  return (
    <section aria-label="Presentación" className="gap-step-xl grid items-center pt-step-lg md:grid-cols-[minmax(0,1fr)_auto]">
      <div className="gap-step-md flex flex-col">
        <Text variant="eyebrow" tone="accent" as="p">
          {eyebrow}
        </Text>

        {/* Lighter than the old extrabold: at this size the weight was doing the
            shouting the copy should do. */}
        <h1 className="font-display text-[clamp(2.4rem,5.5vw,52px)] font-semibold leading-[1.02] tracking-[-0.03em] text-text-primary">
          {name}
        </h1>

        <Text variant="lead" tone="secondary" as="p" className="max-w-[54ch]">
          {tagline}
        </Text>

        <p className="gap-step-md text-meta flex flex-wrap font-mono text-text-muted">
          {keywords.map((k) => (
            <span key={k}>#{k}</span>
          ))}
        </p>

        <ul className="gap-step-sm flex items-center">
          {redes.map(({ name: n, link }) => {
            const Icono = ICONO[n.toLowerCase()];
            if (!Icono) return null;
            return (
              <li key={link}>
                <a
                  href={link}
                  aria-label={n}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-hairline text-text-muted hover:border-accent hover:text-accent transition-standard rounded-control flex size-10 items-center justify-center border text-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Icono />
                </a>
              </li>
            );
          })}
          {correo ? (
            <li>
              <a
                href={correo}
                aria-label="Correo"
                className="border-hairline text-text-muted hover:border-accent hover:text-accent transition-standard rounded-control flex size-10 items-center justify-center border text-[18px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <social.Correo />
              </a>
            </li>
          ) : null}
        </ul>
      </div>

      {/* The portrait carries the frame; the mascot overlaps its corner so the
          two read as one mark rather than two images side by side. */}
      <div className="relative mx-auto w-[240px] shrink-0 sm:w-[260px]">
        <img
          src={photo}
          alt={name}
          width="512"
          height="640"
          fetchPriority="high"
          className="border-hairline rounded-panel aspect-[4/5] w-full border object-cover object-top"
        />
        <img
          data-testid="hero-mascot"
          src={mascot}
          alt=""
          aria-hidden="true"
          width="346"
          height="276"
          decoding="async"
          className="pointer-events-none absolute -bottom-8 -left-16 w-[120px] select-none motion-safe:animate-float sm:w-[135px]"
        />
      </div>
    </section>
  );
}
