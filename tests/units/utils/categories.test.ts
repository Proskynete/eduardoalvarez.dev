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
      expect(CategoryMap.get("engineering-leadership")).toBe("Liderazgo de Ingeniería");
      expect(CategoryMap.get("platform-engineering")).toBe("Platform Engineering");
      expect(CategoryMap.get("ai-native-engineering")).toBe("Ingeniería AI-Native");
      expect(CategoryMap.get("career-strategy")).toBe("Estrategia de Carrera");
      expect(CategoryMap.get("engineering-culture")).toBe("Cultura de Ingeniería");
      expect(CategoryMap.get("developer-experience")).toBe("Developer Experience");
      expect(CategoryMap.get("technical-decisions")).toBe("Decisiones Técnicas");
      expect(CategoryMap.get("learning-in-tech")).toBe("Aprendizaje en Tecnología");
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
      expect(TagMap.get("frontend-architecture")).toBe("Arquitectura Frontend");
      expect(TagMap.get("frontend-platform")).toBe("Plataforma Frontend");
    });

    it("debe contener tags de liderazgo", () => {
      expect(TagMap.get("engineering-management")).toBe("Gestión de Ingeniería");
      expect(TagMap.get("technical-leadership")).toBe("Liderazgo Técnico");
      expect(TagMap.get("team-growth")).toBe("Crecimiento del Equipo");
      expect(TagMap.get("mentorship")).toBe("Mentoría");
      expect(TagMap.get("stakeholder-management")).toBe("Gestión de Stakeholders");
    });

    it("debe contener tags de IA", () => {
      expect(TagMap.get("ai-assisted-development")).toBe("Desarrollo Asistido por IA");
      expect(TagMap.get("llm")).toBe("LLM");
      expect(TagMap.get("prompt-engineering")).toBe("Prompt Engineering");
      expect(TagMap.get("ai-workflows")).toBe("Flujos de Trabajo con IA");
      expect(TagMap.get("ai-integration")).toBe("Integración de IA");
    });

    it("debe contener tags de carrera profesional", () => {
      expect(TagMap.get("career-growth")).toBe("Crecimiento Profesional");
      expect(TagMap.get("tech-career")).toBe("Carrera en Tecnología");
      expect(TagMap.get("career-transition")).toBe("Transición de Carrera");
      expect(TagMap.get("impostor-syndrome")).toBe("Síndrome del Impostor");
      expect(TagMap.get("burnout")).toBe("Burnout");
    });

    it("debe contener tags de decisiones técnicas", () => {
      expect(TagMap.get("trade-offs")).toBe("Trade-offs");
      expect(TagMap.get("tech-debt")).toBe("Deuda Técnica");
      expect(TagMap.get("maintainability")).toBe("Mantenibilidad");
      expect(TagMap.get("risk-management")).toBe("Gestión de Riesgos");
      expect(TagMap.get("prioritization")).toBe("Priorización");
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
