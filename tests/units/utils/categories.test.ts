import { describe, expect, it } from "vitest";

import { CategoryMap, TagMap } from "../../../src/utils/categories";

describe("categories utils", () => {
  describe("CategoryMap", () => {
    it("debe contener todas las categorías permitidas", () => {
      const expectedCategories = [
        "engineering-leadership",
        "platform-engineering",
        "ai-native-engineering",
        "career-strategy",
        "engineering-culture",
        "developer-experience",
        "technical-decisions",
        "learning-in-tech",
      ];

      for (const category of expectedCategories) {
        expect(CategoryMap.has(category as never)).toBe(true);
      }
    });

    it("debe mapear correctamente cada categoría a su nombre legible", () => {
      expect(CategoryMap.get("engineering-leadership")).toBe("Engineering Leadership");
      expect(CategoryMap.get("platform-engineering")).toBe("Platform Engineering");
      expect(CategoryMap.get("ai-native-engineering")).toBe("AI Native Engineering");
      expect(CategoryMap.get("career-strategy")).toBe("Career Strategy");
      expect(CategoryMap.get("engineering-culture")).toBe("Engineering Culture");
      expect(CategoryMap.get("developer-experience")).toBe("Developer Experience");
      expect(CategoryMap.get("technical-decisions")).toBe("Technical Decisions");
      expect(CategoryMap.get("learning-in-tech")).toBe("Learning in Tech");
    });

    it("debe retornar undefined para una categoría desconocida", () => {
      expect(CategoryMap.get("unknown-category" as never)).toBeUndefined();
    });

    it("debe tener exactamente 8 categorías", () => {
      expect(CategoryMap.size).toBe(8);
    });

    it("todos los valores del mapa deben ser strings no vacíos", () => {
      for (const value of CategoryMap.values()) {
        expect(value).toBeTruthy();
        expect(typeof value).toBe("string");
      }
    });
  });

  describe("TagMap", () => {
    it("debe contener tags de arquitectura frontend", () => {
      expect(TagMap.get("microfrontends")).toBe("Microfrontends");
      expect(TagMap.get("design-systems")).toBe("Design Systems");
      expect(TagMap.get("single-spa")).toBe("Single SPA");
      expect(TagMap.get("frontend-architecture")).toBe("Frontend Architecture");
      expect(TagMap.get("frontend-platform")).toBe("Frontend Platform");
    });

    it("debe contener tags de liderazgo", () => {
      expect(TagMap.get("engineering-management")).toBe("Engineering Management");
      expect(TagMap.get("technical-leadership")).toBe("Technical Leadership");
      expect(TagMap.get("team-growth")).toBe("Team Growth");
      expect(TagMap.get("mentorship")).toBe("Mentorship");
      expect(TagMap.get("stakeholder-management")).toBe("Stakeholder Management");
    });

    it("debe contener tags de IA", () => {
      expect(TagMap.get("ai-assisted-development")).toBe("AI Assisted Development");
      expect(TagMap.get("llm")).toBe("LLM");
      expect(TagMap.get("prompt-engineering")).toBe("Prompt Engineering");
      expect(TagMap.get("ai-workflows")).toBe("AI Workflows");
      expect(TagMap.get("ai-integration")).toBe("AI Integration");
    });

    it("debe contener tags de carrera profesional", () => {
      expect(TagMap.get("career-growth")).toBe("Career Growth");
      expect(TagMap.get("tech-career")).toBe("Tech Career");
      expect(TagMap.get("career-transition")).toBe("Career Transition");
      expect(TagMap.get("impostor-syndrome")).toBe("Impostor Syndrome");
      expect(TagMap.get("burnout")).toBe("Burnout");
    });

    it("debe contener tags de decisiones técnicas", () => {
      expect(TagMap.get("trade-offs")).toBe("Trade-offs");
      expect(TagMap.get("tech-debt")).toBe("Tech Debt");
      expect(TagMap.get("maintainability")).toBe("Maintainability");
      expect(TagMap.get("risk-management")).toBe("Risk Management");
      expect(TagMap.get("prioritization")).toBe("Prioritization");
    });

    it("debe retornar undefined para un tag desconocido", () => {
      expect(TagMap.get("unknown-tag" as never)).toBeUndefined();
    });

    it("todos los valores del mapa deben ser strings no vacíos", () => {
      for (const value of TagMap.values()) {
        expect(value).toBeTruthy();
        expect(typeof value).toBe("string");
      }
    });

    it("debe tener más tags que categorías", () => {
      expect(TagMap.size).toBeGreaterThan(CategoryMap.size);
    });
  });
});
