import { describe, expect, it } from "vitest";

import { clearString } from "../../../src/utils/strings";

describe("strings utils", () => {
  describe("clearString", () => {
    it("debe convertir a minúsculas", () => {
      // Spaces are converted to hyphens before lowercasing
      expect(clearString("HOLA MUNDO")).toBe("hola-mundo");
    });

    it("debe reemplazar espacios con guiones", () => {
      expect(clearString("hola mundo")).toBe("hola-mundo");
    });

    it("debe eliminar acentos y diacríticos", () => {
      expect(clearString("áéíóú")).toBe("aeiou");
      expect(clearString("ñ")).toBe("n");
      expect(clearString("Código")).toBe("codigo");
    });

    it("debe eliminar dos puntos", () => {
      expect(clearString("hola:mundo")).toBe("holamundo");
    });

    it("debe eliminar puntos", () => {
      expect(clearString("hola.mundo")).toBe("holamundo");
    });

    it("debe eliminar guiones bajos (no convertir a guión)", () => {
      // Underscores are removed by /[:._ ]/ pattern, not converted to hyphens
      expect(clearString("hola_mundo")).toBe("holamundo");
    });

    it("debe manejar cadena vacía", () => {
      expect(clearString("")).toBe("");
    });

    it("debe manejar cadena ya limpia", () => {
      expect(clearString("hola-mundo")).toBe("hola-mundo");
    });

    it("debe manejar combinación de transformaciones", () => {
      expect(clearString("Introducción a Node.js")).toBe("introduccion-a-nodejs");
    });

    it("debe manejar una sola palabra con acento", () => {
      expect(clearString("Índice")).toBe("indice");
    });

    it("debe manejar múltiples espacios consecutivos", () => {
      // replaceAll(/ /g, '-') convierte cada espacio individualmente
      expect(clearString("a  b")).toBe("a--b");
    });

    it("debe manejar texto con números", () => {
      expect(clearString("React 19")).toBe("react-19");
    });
  });
});
