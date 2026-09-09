export interface NavItem {
  name: string;
  href: string;
  show: boolean;
  description?: string;
}

export const navItems: NavItem[] = [
  {
    name: "Artículos",
    href: "/articles",
    show: true,
    description: "Posts sobre ingeniería y liderazgo técnico",
  },
  {
    name: "Charlas",
    href: "/speaking",
    show: true,
    description: "Talks y workshops en conferencias",
  },
  {
    name: "Cursos",
    href: "https://cursos.eduardoalvarez.dev",
    show: true,
    description: "Cursos y formación técnica",
  },
  {
    name: "Sobre_mí",
    href: "/about",
    show: true,
    description: "Quién soy y qué hago",
  },
  {
    /**
     * `show` is the section's only switch, and it is on with the episodes in
     * `settings/podcasts.ts` still being fixtures: SoundHelix demo audio,
     * `spotify.com/episode/mock1` links and guests who do not exist. That is
     * deliberate — the section is navigable so it can be reviewed on the
     * preview — and it is the flag to flip back before this reaches main with
     * invented people on it.
     */
    name: "Podcast",
    href: "/podcasts",
    show: true,
    description: "Episodios y charlas en audio",
  },
];
