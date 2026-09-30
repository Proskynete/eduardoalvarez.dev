import { describe, expect, it } from "vitest";

import type { Talk } from "../../../src/settings/talks";
import { buildProfile, PROFILE_VERSION, type ProfileInput } from "../../../src/utils/profile";

const logo = { src: "/logo.webp", width: 10, height: 10, format: "webp" } as Talk["organizations"][number]["logo"];

const talk = (overrides: Partial<Talk>): Talk => ({
  title: "Charla",
  description: "Descripción",
  show: true,
  date: ["2024-01-01T10:00:00.000Z", "2024-01-01T12:00:00.000Z"],
  location: { name: "Santiago", url: "https://maps.example" },
  organizations: [{ name: "Tech School", logo, url: "https://techschool.example" }],
  ...overrides,
});

const baseInput = (overrides: Partial<ProfileInput> = {}): ProfileInput => ({
  siteUrl: "https://eduardoalvarez.dev/",
  talks: [],
  nowItems: [{ category: "Leyendo", label: "Libro" }],
  nowUpdatedAt: "2026-09-23",
  beliefs: ["Entender antes de construir."],
  lifePhilosophy: ["No permitas que las cosas tomen más tiempo del que tienen que tomar."],
  articles: [],
  now: new Date("2026-09-30T00:00:00.000Z"),
  ...overrides,
});

describe("buildProfile", () => {
  it("debe declarar la versión, la fecha de generación y la fuente sin barra final", () => {
    const profile = buildProfile(baseInput());

    expect(profile.version).toBe(PROFILE_VERSION);
    expect(profile.generatedAt).toBe("2026-09-30T00:00:00.000Z");
    expect(profile.source).toBe("https://eduardoalvarez.dev");
  });

  it("debe excluir las charlas ocultas y ordenar de la más reciente a la más antigua", () => {
    const profile = buildProfile(
      baseInput({
        talks: [
          talk({ title: "Antigua", date: ["2019-03-05T21:00:00.000Z"] }),
          talk({ title: "Oculta", show: false, date: ["2025-01-01T00:00:00.000Z"] }),
          talk({ title: "Reciente", date: ["2026-08-14T14:00:00.000Z"] }),
        ],
      }),
    );

    expect(profile.talks.map((t) => t.title)).toEqual(["Reciente", "Antigua"]);
    expect(profile.talks[1]?.end).toBeNull();
  });

  it("debe publicar sólo texto y enlaces de cada charla", () => {
    const [serialized] = buildProfile(
      baseInput({
        talks: [
          talk({
            options: {
              presentation: "https://slides.example",
              resources: [{ label: "Repo del taller", url: "https://github.example" }],
            },
          }),
        ],
      }),
    ).talks;

    expect(serialized).toEqual({
      title: "Charla",
      description: "Descripción",
      start: "2024-01-01T10:00:00.000Z",
      end: "2024-01-01T12:00:00.000Z",
      location: { name: "Santiago", url: "https://maps.example" },
      organizations: [{ name: "Tech School", url: "https://techschool.example" }],
      links: {
        presentation: "https://slides.example",
        repo: null,
        resources: [{ label: "Repo del taller", url: "https://github.example" }],
      },
    });
    expect(serialized).not.toHaveProperty("show");
    expect(serialized).not.toHaveProperty("image");
  });

  it("debe construir la URL de cada artículo y ordenarlos del más reciente al más antiguo", () => {
    const article = { excerpt: "", categories: [], tags: [] };
    const profile = buildProfile(
      baseInput({
        articles: [
          { ...article, title: "Viejo", slug: "viejo", date: "2020-04-26T00:00:00.000Z" },
          { ...article, title: "Nuevo", slug: "nuevo", date: "2026-09-29T00:00:00.000Z" },
        ],
      }),
    );

    expect(profile.articles.map((a) => a.url)).toEqual([
      "https://eduardoalvarez.dev/articles/nuevo",
      "https://eduardoalvarez.dev/articles/viejo",
    ]);
  });

  it("debe incluir el «ahora» con su fecha y las frases del about", () => {
    const profile = buildProfile(baseInput());

    expect(profile.now).toEqual({ updatedAt: "2026-09-23", items: [{ category: "Leyendo", label: "Libro" }] });
    expect(profile.quotes.beliefs).toEqual(["Entender antes de construir."]);
    expect(profile.quotes.lifePhilosophy).toHaveLength(1);
  });

  it("debe usar la fecha actual cuando no recibe una", () => {
    const profile = buildProfile(baseInput({ now: undefined }));

    expect(Number.isNaN(Date.parse(profile.generatedAt))).toBe(false);
  });
});
