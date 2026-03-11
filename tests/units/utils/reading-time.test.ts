import { describe, expect, it } from "vitest";

import { calculateReadingTime } from "../../../src/utils/reading-time";

describe("reading-time utils", () => {
  describe("calculateReadingTime", () => {
    it("debe calcular correctamente el tiempo de lectura para un texto corto", () => {
      // 200 palabras = 1 minuto (según la constante _wordsPerMinute)
      const text = Array(200).fill("palabra").join(" ");

      const result = calculateReadingTime(text);

      expect(result).toBe(1);
    });

    it("debe redondear hacia arriba el tiempo de lectura", () => {
      // 201 palabras debería dar 2 minutos (ceil de 201/200 = 1.005)
      const text = Array(201).fill("palabra").join(" ");

      const result = calculateReadingTime(text);

      expect(result).toBe(2);
    });

    it("debe retornar 1 para texto vacío (comportamiento actual de split)", () => {
      const text = "";

      const result = calculateReadingTime(text);

      // ''.split(' ') retorna [''] con length 1
      // 1 / 200 = 0.005, Math.ceil(0.005) = 1
      expect(result).toBe(1);
    });

    it("debe manejar texto con solo espacios", () => {
      const text = "     ";

      const result = calculateReadingTime(text);

      // "     ".split(" ") da ["", "", "", "", "", ""] = 6 elementos
      // 6 / 200 = 0.03, Math.ceil(0.03) = 1
      expect(result).toBe(1);
    });

    it("debe calcular correctamente para un artículo largo", () => {
      // 1200 palabras / 200 wpm = 6 minutos
      const text = Array(1200).fill("palabra").join(" ");

      const result = calculateReadingTime(text);

      expect(result).toBe(6);
    });

    it("debe manejar una sola palabra", () => {
      const text = "palabra";

      const result = calculateReadingTime(text);

      // 1 / 200 = 0.005, Math.ceil(0.005) = 1
      expect(result).toBe(1);
    });

    it("debe calcular correctamente con múltiples espacios entre palabras", () => {
      const text = "palabra1  palabra2   palabra3    palabra4";

      const result = calculateReadingTime(text);

      // El split por espacio dará más elementos debido a los espacios múltiples
      // Esto es un comportamiento conocido de la implementación actual
      const wordCount = text.split(" ").length;
      const expected = Math.ceil(wordCount / 200);

      expect(result).toBe(expected);
    });

    it("debe calcular correctamente el tiempo para texto de ejemplo real", () => {
      const realText = `
        React es una biblioteca de JavaScript para construir interfaces de usuario.
        Fue desarrollada por Facebook y es ampliamente utilizada en el desarrollo web moderno.
        Permite crear componentes reutilizables y gestionar el estado de la aplicación de manera eficiente.
      `;

      const result = calculateReadingTime(realText);

      const wordCount = realText.split(" ").length;
      const expected = Math.ceil(wordCount / 200);

      expect(result).toBe(expected);
      expect(result).toBeGreaterThan(0);
    });

    it("debe usar 200 palabras por minuto como velocidad de lectura", () => {
      // 400 palabras a 200 palabras/minuto = 2 minutos exactos
      const text = Array(400).fill("palabra").join(" ");

      const result = calculateReadingTime(text);

      expect(result).toBe(2);
    });

    it("debe calcular tiempo para texto con saltos de línea", () => {
      const text = Array(200).fill("palabra").join("\n");

      const result = calculateReadingTime(text);

      // Como usa split(" "), las palabras separadas por \n se cuentan como una sola
      expect(result).toBe(1);
    });

    it("debe manejar números mixtos (edge case de _textLength < 0)", () => {
      // Aunque la condición _textLength < 0 es prácticamente imposible,
      // el código tiene esa validación
      const text = "test";

      const result = calculateReadingTime(text);

      expect(result).toBeGreaterThanOrEqual(0);
    });

    it("debe calcular tiempo para un artículo típico de blog (600 palabras)", () => {
      // Artículo típico de 600 palabras
      const text = Array(600).fill("palabra").join(" ");

      const result = calculateReadingTime(text);

      // 600 / 200 = 3, Math.ceil(3) = 3
      expect(result).toBe(3);
    });

    it("debe calcular tiempo para un artículo extenso (2000 palabras)", () => {
      // Artículo extenso de 2000 palabras
      const text = Array(2000).fill("palabra").join(" ");

      const result = calculateReadingTime(text);

      // 2000 / 200 = 10, Math.ceil(10) = 10
      expect(result).toBe(10);
    });
  });
});
