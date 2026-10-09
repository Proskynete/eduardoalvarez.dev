import { describe, expect, it } from "vitest";

import { parseTalks } from "../../../src/utils/talks";

const minimal = {
  title: "Charla",
  description: "Descripción",
  show: true,
  date: ["2024-01-01T10:00:00.000Z"],
  location: { name: "Santiago", url: "https://maps.example.com" },
  organizations: [],
};

describe("parseTalks", () => {
  it("debe cargar una charla mínima con el slug del archivo y modalidad presencial", () => {
    const [talk] = parseTalks({ "../data/talks/mi-charla.json": minimal });

    expect(talk.slug).toBe("mi-charla");
    expect(talk.attendance).toBe("in-person");
    expect(talk.options).toBeUndefined();
  });

  it("debe ordenar de la más reciente a la más antigua sin importar el nombre del archivo", () => {
    const talks = parseTalks({
      "../data/talks/a-antigua.json": { ...minimal, date: ["2019-03-05T21:00:00.000Z"] },
      "../data/talks/z-reciente.json": { ...minimal, date: ["2026-08-14T14:00:00.000Z"] },
    });

    expect(talks.map((t) => t.slug)).toEqual(["z-reciente", "a-antigua"]);
  });

  it("debe fallar nombrando el archivo y el campo cuando falta uno obligatorio", () => {
    const { title: _title, ...withoutTitle } = minimal;

    expect(() => parseTalks({ "../data/talks/x.json": withoutTitle })).toThrow(/x\.json: title/);
  });

  it("debe fallar cuando el nombre del archivo no es un slug", () => {
    expect(() => parseTalks({ "../data/talks/Mi Charla.json": minimal })).toThrow(/Mi Charla\.json/);
  });

  it("debe rechazar imágenes que no son rutas públicas", () => {
    expect(() => parseTalks({ "../data/talks/x.json": { ...minimal, image: "images/a.webp" } })).toThrow(/image/);
  });

  it("debe aceptar charlas online e híbridas", () => {
    const talks = parseTalks({
      "../data/talks/online.json": { ...minimal, attendance: "online" },
      "../data/talks/hibrida.json": { ...minimal, attendance: "hybrid" },
    });

    expect(talks.map((t) => t.attendance).sort()).toEqual(["hybrid", "online"]);
  });
});
