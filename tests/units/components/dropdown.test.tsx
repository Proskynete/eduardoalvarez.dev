import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Dropdown } from "../../../src/components/dropdown/index";

// Mock del icono para no depender de SVGs en el entorno de test
vi.mock("../../../src/assets/icons", () => ({
  Icon: {
    Menu: ({ width }: { width: number }) => <svg data-testid="menu-icon" aria-hidden="true" width={width} />,
  },
}));

const linkOptions = [
  [
    { name: "Ver GitHub", url: "https://github.com", type: "link" as const, title: "ver-github" },
    { name: "Descargar CV", url: "/cv.pdf", type: "download" as const, title: "descargar-cv" },
  ],
];

const titleOptions = [
  [
    { name: "Sección", type: "title" as const, title: "seccion" },
    { name: "Enlace", url: "/about", type: "link" as const, title: "enlace" },
  ],
];

describe("Dropdown", () => {
  describe("estado inicial", () => {
    it("no muestra el menú desplegable al inicio", () => {
      render(<Dropdown options={linkOptions} />);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("renderiza el botón de toggle", () => {
      render(<Dropdown options={linkOptions} />);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("abrir y cerrar", () => {
    it("muestra el menú al hacer clic en el botón", () => {
      render(<Dropdown options={linkOptions} />);
      fireEvent.click(screen.getByRole("button"));
      expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("cierra el menú al hacer clic en el botón nuevamente", () => {
      render(<Dropdown options={linkOptions} />);
      const button = screen.getByRole("button");

      fireEvent.click(button);
      expect(screen.getByRole("list")).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });

    it("cierra el menú al presionar Escape (con foco en el componente)", () => {
      render(<Dropdown options={linkOptions} />);
      const button = screen.getByRole("button");

      // Abrir
      fireEvent.click(button);
      expect(screen.getByRole("list")).toBeInTheDocument();

      // Activar listeners de teclado via focus en el contenedor
      const container = button.parentElement!;
      fireEvent.focus(container);

      // Disparar Escape en documento
      fireEvent.keyDown(document, { key: "Escape" });

      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  describe("renderizado de opciones", () => {
    it("muestra los items de tipo link con el texto correcto", () => {
      render(<Dropdown options={linkOptions} />);
      fireEvent.click(screen.getByRole("button"));

      expect(screen.getByText("Ver GitHub")).toBeInTheDocument();
      expect(screen.getByText("Descargar CV")).toBeInTheDocument();
    });

    it("los items de tipo 'link' tienen target='_blank'", () => {
      render(<Dropdown options={linkOptions} />);
      fireEvent.click(screen.getByRole("button"));

      const link = screen.getByText("Ver GitHub").closest("a");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("los items de tipo 'download' tienen el atributo download", () => {
      render(<Dropdown options={linkOptions} />);
      fireEvent.click(screen.getByRole("button"));

      const downloadLink = screen.getByText("Descargar CV").closest("a");
      expect(downloadLink).toHaveAttribute("download");
    });

    it("los items de tipo 'title' no son links y no tienen href", () => {
      render(<Dropdown options={titleOptions} />);
      fireEvent.click(screen.getByRole("button"));

      const titleItem = screen.getByText("Sección");
      expect(titleItem.closest("a")).toBeNull();
    });
  });
});
