import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import AudioPlayer from "../../../src/components/audio-player/index";

// Mock HTMLMediaElement methods (jsdom no los implementa)
const mockPlay = vi.fn().mockResolvedValue(undefined);
const mockPause = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(HTMLMediaElement.prototype, "play", {
    configurable: true,
    value: mockPlay,
  });
  Object.defineProperty(HTMLMediaElement.prototype, "pause", {
    configurable: true,
    value: mockPause,
  });
});

describe("AudioPlayer", () => {
  describe("renderizado inicial", () => {
    it("renderiza sin errores", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      expect(screen.getByRole("slider", { name: /progreso/i })).toBeInTheDocument();
    });

    it("muestra el título cuando se provee", () => {
      render(<AudioPlayer src="/audio/test.mp3" title="Episodio 1" />);
      expect(screen.getByText("Episodio 1")).toBeInTheDocument();
    });

    it("no muestra el párrafo de título cuando no se provee", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      // El elemento <p> con el título no debe existir
      expect(screen.queryByText(/episodio/i)).not.toBeInTheDocument();
    });

    it("el botón de play tiene aria-label 'Reproducir' en estado inicial", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      expect(screen.getByRole("button", { name: "Reproducir" })).toBeInTheDocument();
    });

    it("muestra '0:00' para el tiempo actual y la duración al inicio", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      const timeDisplays = screen.getAllByText("0:00");
      expect(timeDisplays).toHaveLength(2);
    });

    it("la barra de progreso tiene aria-valuenow=0 al inicio", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      const slider = screen.getByRole("slider", { name: /progreso/i });
      expect(slider).toHaveAttribute("aria-valuenow", "0");
    });

    it("el botón de velocidad muestra '1x' al inicio", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      expect(screen.getByRole("button", { name: /velocidad/i })).toHaveTextContent("1x");
    });

    it("el botón de silencio tiene aria-label 'Silenciar' al inicio", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      expect(screen.getByRole("button", { name: "Silenciar" })).toBeInTheDocument();
    });

    it("el input de volumen tiene aria-label 'Volumen'", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      // El input de volumen está oculto en mobile, pero existe en DOM
      expect(screen.getByRole("slider", { name: "Volumen" })).toBeInTheDocument();
    });

    it("el botón de retroceso tiene aria-label correcto", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      expect(screen.getByRole("button", { name: "Retroceder 15 segundos" })).toBeInTheDocument();
    });

    it("el botón de avance tiene aria-label correcto", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      expect(screen.getByRole("button", { name: "Adelantar 15 segundos" })).toBeInTheDocument();
    });
  });

  describe("evento de error en el audio", () => {
    it("el botón pasa a mostrar 'Reintentar' cuando el audio falla", () => {
      const { container } = render(<AudioPlayer src="/audio/invalid.mp3" />);
      const audioEl = container.querySelector("audio")!;

      fireEvent(audioEl, new Event("error"));

      expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
    });
  });

  describe("evento loadedmetadata", () => {
    it("actualiza la duración al recibir loadedmetadata", () => {
      const { container } = render(<AudioPlayer src="/audio/test.mp3" />);
      const audioEl = container.querySelector("audio")!;

      Object.defineProperty(audioEl, "duration", { configurable: true, value: 125 }); // 2:05
      fireEvent(audioEl, new Event("loadedmetadata"));

      expect(screen.getByText("2:05")).toBeInTheDocument();
    });
  });

  describe("evento timeupdate", () => {
    it("actualiza el tiempo actual al recibir timeupdate", () => {
      const { container } = render(<AudioPlayer src="/audio/test.mp3" />);
      const audioEl = container.querySelector("audio")!;

      Object.defineProperty(audioEl, "currentTime", { configurable: true, value: 65 }); // 1:05
      fireEvent(audioEl, new Event("timeupdate"));

      expect(screen.getByText("1:05")).toBeInTheDocument();
    });
  });

  describe("velocidad de reproducción", () => {
    it("cicla la velocidad al hacer clic: 1 → 1.25 → 1.5 → 1.75 → 2 → 1", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      const rateButton = screen.getByRole("button", { name: /velocidad/i });

      expect(rateButton).toHaveTextContent("1x");

      fireEvent.click(rateButton);
      expect(rateButton).toHaveTextContent("1.25x");

      fireEvent.click(rateButton);
      expect(rateButton).toHaveTextContent("1.5x");

      fireEvent.click(rateButton);
      expect(rateButton).toHaveTextContent("1.75x");

      fireEvent.click(rateButton);
      expect(rateButton).toHaveTextContent("2x");

      fireEvent.click(rateButton);
      expect(rateButton).toHaveTextContent("1x"); // vuelve al inicio
    });
  });

  describe("botón de play/pause", () => {
    it("llama a audio.play() al hacer clic cuando está pausado", async () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      const playButton = screen.getByRole("button", { name: "Reproducir" });

      await act(async () => {
        fireEvent.click(playButton);
      });

      expect(mockPlay).toHaveBeenCalledTimes(1);
    });

    it("muestra el ícono de pausa mientras reproduce", async () => {
      render(<AudioPlayer src="/audio/test.mp3" />);

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Reproducir" }));
      });

      expect(screen.getByRole("button", { name: "Pausar" })).toBeInTheDocument();
    });

    it("llama a audio.pause() al hacer clic mientras reproduce", async () => {
      render(<AudioPlayer src="/audio/test.mp3" />);

      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Reproducir" }));
      });

      fireEvent.click(screen.getByRole("button", { name: "Pausar" }));

      expect(mockPause).toHaveBeenCalledTimes(1);
    });
  });

  describe("evento ended", () => {
    it("detiene la reproducción cuando termina el audio", async () => {
      const { container } = render(<AudioPlayer src="/audio/test.mp3" />);

      // Primero iniciar reproducción
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Reproducir" }));
      });

      // Simular que el audio terminó
      act(() => {
        fireEvent(container.querySelector("audio")!, new Event("ended"));
      });

      expect(screen.getByRole("button", { name: "Reproducir" })).toBeInTheDocument();
    });
  });

  describe("evento waiting / canplay", () => {
    it("activa el estado de carga al recibir el evento waiting", () => {
      const { container } = render(<AudioPlayer src="/audio/test.mp3" />);
      const audioEl = container.querySelector("audio")!;

      act(() => {
        fireEvent(audioEl, new Event("waiting"));
      });

      // El botón de play muestra el spinner (isLoading=true)
      const playButton = container.querySelector('button[aria-label="Reproducir"]')!;
      expect(playButton.querySelector("svg")).toBeInTheDocument();
    });

    it("desactiva el estado de carga al recibir el evento canplay", () => {
      const { container } = render(<AudioPlayer src="/audio/test.mp3" />);
      const audioEl = container.querySelector("audio")!;

      act(() => {
        fireEvent(audioEl, new Event("waiting"));
        fireEvent(audioEl, new Event("canplay"));
      });

      // No hay spinner de carga visible en el botón principal
      expect(screen.getByRole("button", { name: "Reproducir" })).toBeInTheDocument();
    });
  });

  describe("botones de skip", () => {
    it("hace clic en retroceder 15s sin errores", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      expect(() => {
        fireEvent.click(screen.getByRole("button", { name: "Retroceder 15 segundos" }));
      }).not.toThrow();
    });

    it("hace clic en adelantar 15s sin errores", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      expect(() => {
        fireEvent.click(screen.getByRole("button", { name: "Adelantar 15 segundos" }));
      }).not.toThrow();
    });
  });

  describe("control de volumen", () => {
    it("cambia el volumen al mover el slider", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      const volumeSlider = screen.getByRole("slider", { name: "Volumen" });

      fireEvent.change(volumeSlider, { target: { value: "0.5" } });

      expect(volumeSlider).toHaveValue("0.5");
    });

    it("silencia al hacer clic en el botón de mute", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      const muteButton = screen.getByRole("button", { name: "Silenciar" });

      fireEvent.click(muteButton);

      expect(screen.getByRole("button", { name: "Activar sonido" })).toBeInTheDocument();
    });

    it("restaura el sonido al hacer clic en mute nuevamente", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      const muteButton = screen.getByRole("button", { name: "Silenciar" });

      fireEvent.click(muteButton);
      fireEvent.click(screen.getByRole("button", { name: "Activar sonido" }));

      expect(screen.getByRole("button", { name: "Silenciar" })).toBeInTheDocument();
    });

    it("pone volumen en 0 cuando el slider llega a 0 (sets isMuted)", () => {
      render(<AudioPlayer src="/audio/test.mp3" />);
      const volumeSlider = screen.getByRole("slider", { name: "Volumen" });

      fireEvent.change(volumeSlider, { target: { value: "0" } });

      expect(screen.getByRole("button", { name: "Activar sonido" })).toBeInTheDocument();
    });
  });

  describe("barra de progreso (click)", () => {
    it("hace clic en la barra de progreso sin errores", () => {
      const { container } = render(<AudioPlayer src="/audio/test.mp3" />);
      const slider = screen.getByRole("slider", { name: /progreso/i });

      // Dar dimensiones válidas al progress bar para evitar NaN en jsdom
      slider.getBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        width: 200,
        top: 0,
        height: 8,
        right: 200,
        bottom: 8,
      });

      // Con duration=0: clickPosition * 0 = 0 → currentTime válido
      expect(() => {
        fireEvent.click(slider, { clientX: 0 });
      }).not.toThrow();

      // Suprimir referencia no usada
      void container;
    });
  });
});
