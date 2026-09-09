import { describe, expect, it } from "vitest";

import type { PodcastEpisode } from "../../../src/settings/podcasts";
import {
  formatDuration,
  formatGuests,
  groupByYear,
  initials,
  totalDuration,
  withHeadingAnchors,
} from "../../../src/utils/podcasts";

type Guest = PodcastEpisode["guests"][number];

const guest = (name: string): Guest => ({ name, role: "Engineer" });

const episode = (overrides: Partial<PodcastEpisode> = {}): PodcastEpisode =>
  ({
    episode: 1,
    slug: "episodio",
    title: "Un episodio",
    description: "Descripción",
    content: "",
    date: "2024-12-15T10:00:00.000Z",
    duration: 60,
    audioUrl: "https://example.com/audio.mp3",
    show: true,
    guests: [],
    topics: [],
    platforms: [],
    ...overrides,
  }) as PodcastEpisode;

describe("podcasts utils", () => {
  describe("formatDuration", () => {
    it("usa horas y minutos cuando pasa de la hora", () => {
      expect(formatDuration(78)).toBe("1h 18min");
    });

    it("omite las horas cuando no llega a una", () => {
      expect(formatDuration(45)).toBe("45 min");
    });

    it("mantiene los minutos en cero cuando la duración es exacta", () => {
      expect(formatDuration(120)).toBe("2h 0min");
    });

    it("no rompe con cero", () => {
      expect(formatDuration(0)).toBe("0 min");
    });
  });

  describe("formatGuests", () => {
    it("devuelve cadena vacía sin invitados, para poder descartar el segmento", () => {
      expect(formatGuests([])).toBe("");
    });

    it("nombra al invitado único", () => {
      expect(formatGuests([guest("María González")])).toBe("con María González");
    });

    it("enumera dos invitados", () => {
      expect(formatGuests([guest("Carlos Mendoza"), guest("Ana Rodríguez")])).toBe("con Carlos Mendoza y Ana Rodríguez");
    });

    it("resume a partir de tres", () => {
      expect(formatGuests([guest("Ana"), guest("Beto"), guest("Cleo")])).toBe("con Ana y 2 más");
    });

    it("sigue resumiendo con muchos", () => {
      expect(formatGuests([guest("Ana"), guest("Beto"), guest("Cleo"), guest("Dan")])).toBe("con Ana y 3 más");
    });
  });

  describe("totalDuration", () => {
    it("suma los minutos de todos los episodios", () => {
      const episodes = [78, 92, 65, 85, 45].map((duration) => episode({ duration }));
      expect(totalDuration(episodes)).toBe(365);
    });

    it("devuelve cero sin episodios", () => {
      expect(totalDuration([])).toBe(0);
    });
  });

  describe("groupByYear", () => {
    it("ordena los años del más reciente al más antiguo", () => {
      const groups = groupByYear([
        episode({ slug: "viejo", date: "2023-01-10T10:00:00.000Z" }),
        episode({ slug: "nuevo", date: "2025-03-01T10:00:00.000Z" }),
        episode({ slug: "medio", date: "2024-06-01T10:00:00.000Z" }),
      ]);

      expect(groups.map((group) => group.year)).toEqual([2025, 2024, 2023]);
    });

    it("ordena los episodios dentro del año por fecha descendente", () => {
      const groups = groupByYear([
        episode({ slug: "agosto", date: "2024-08-01T10:00:00.000Z" }),
        episode({ slug: "diciembre", date: "2024-12-15T10:00:00.000Z" }),
        episode({ slug: "octubre", date: "2024-10-05T10:00:00.000Z" }),
      ]);

      expect(groups).toHaveLength(1);
      expect(groups[0].episodes.map((item) => item.slug)).toEqual(["diciembre", "octubre", "agosto"]);
    });

    it("no pierde ningún episodio al agrupar", () => {
      const episodes = [
        episode({ slug: "a", date: "2024-01-01T10:00:00.000Z" }),
        episode({ slug: "b", date: "2025-01-01T10:00:00.000Z" }),
        episode({ slug: "c", date: "2025-06-01T10:00:00.000Z" }),
      ];

      const total = groupByYear(episodes).flatMap((group) => group.episodes);

      expect(total).toHaveLength(3);
    });

    it("devuelve lista vacía sin episodios", () => {
      expect(groupByYear([])).toEqual([]);
    });
  });

  describe("initials", () => {
    it("toma la inicial de nombre y apellido", () => {
      expect(initials("Ana Rodríguez")).toBe("AR");
    });

    it("se queda en dos aunque haya más nombres", () => {
      expect(initials("María del Carmen González")).toBe("MD");
    });

    it("aguanta un solo nombre", () => {
      expect(initials("Cher")).toBe("C");
    });

    it("no rompe con espacios de más", () => {
      expect(initials("  Carlos   Mendoza ")).toBe("CM");
    });
  });

  describe("withHeadingAnchors", () => {
    it("pone ancla en cada h2 y devuelve la lista", () => {
      const { html, headings } = withHeadingAnchors("<h2>Introducción</h2><p>x</p><h2>Temas discutidos</h2>");

      expect(headings).toEqual([
        { id: "introduccion", label: "Introducción" },
        { id: "temas-discutidos", label: "Temas discutidos" },
      ]);
      expect(html).toContain('<h2 id="introduccion">Introducción</h2>');
      expect(html).toContain('<h2 id="temas-discutidos">Temas discutidos</h2>');
    });

    it("los id de la lista y los del html son los mismos", () => {
      const { html, headings } = withHeadingAnchors("<h2>Consejos prácticos</h2>");
      for (const heading of headings) expect(html).toContain(`id="${heading.id}"`);
    });

    it("respeta un id que ya venía puesto", () => {
      const { html } = withHeadingAnchors('<h2 id="propio">Título</h2>');
      expect(html).toBe('<h2 id="propio">Título</h2>');
    });

    it("ignora los h3 y el resto del contenido", () => {
      const { headings } = withHeadingAnchors("<h3>Sub</h3><p>texto</p>");
      expect(headings).toEqual([]);
    });

    it("limpia el marcado de dentro del encabezado", () => {
      const { headings } = withHeadingAnchors("<h2><em>Libros</em> recomendados</h2>");
      expect(headings[0].label).toBe("Libros recomendados");
    });
  });
});
