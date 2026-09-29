import { describe, expect, it } from "vitest";

import settings from "../../../src/settings";
import { PERSON_ID, personRef, personSameAs, personSchema } from "../../../src/utils/person-schema";

describe("personSchema", () => {
  it("has a stable @id that personRef points at", () => {
    expect(personSchema["@id"]).toBe(PERSON_ID);
    expect(personRef).toEqual({ "@id": PERSON_ID });
  });

  it("uses the brand name and keeps the full name as alternateName", () => {
    expect(personSchema.name).toBe(settings.title);
    expect(personSchema.alternateName).toBe(settings.author.name);
  });

  it("lists only shown public profiles, once each, and never the CV", () => {
    const sameAs = personSameAs();
    expect(new Set(sameAs).size).toBe(sameAs.length);
    expect(sameAs.some((url) => url.includes("youtube.com"))).toBe(false);
    expect(sameAs.some((url) => url.includes("resume."))).toBe(false);
    expect(sameAs.every((url) => url.startsWith("https://"))).toBe(true);
  });
});
