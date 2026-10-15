import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import CookiePreferences from "../../../src/components/analytics/cookie-preferences";
import { CONSENT_KEY, getConsent, openCookiePreferences } from "../../../src/utils/consent";

const mockTimeZone = (timeZone: string) =>
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
    timeZone,
  } as Intl.ResolvedDateTimeFormatOptions);

const stored = () => JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null");

describe("CookiePreferences", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("outside Europe informs, and «Entendido» persists statistics on", () => {
    mockTimeZone("America/Santiago");
    render(<CookiePreferences />);

    expect(screen.getByText("Mido las visitas")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Rechazar" })).not.toBeInTheDocument();
    expect(localStorage.getItem(CONSENT_KEY)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Entendido" }));
    expect(stored()).toMatchObject({ v: 2, statistics: true, preferences: true });
    expect(screen.queryByText("Mido las visitas")).not.toBeInTheDocument();
  });

  it("in Europe asks, with «Rechazar», «Configurar» and «Aceptar»", () => {
    mockTimeZone("Europe/Madrid");
    render(<CookiePreferences />);

    expect(screen.getByText("¿Puedo medir tu visita?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Configurar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Aceptar" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Rechazar" }));
    expect(stored()).toMatchObject({ statistics: false, preferences: false });
  });

  it("in Europe «Aceptar» turns statistics on", () => {
    mockTimeZone("Europe/Madrid");
    render(<CookiePreferences />);
    fireEvent.click(screen.getByRole("button", { name: "Aceptar" }));
    expect(stored()).toMatchObject({ statistics: true, preferences: true });
  });

  it("shows no notice once there is a decision", () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    render(<CookiePreferences />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });

  it("opens the panel from the footer and saves a selection", () => {
    mockTimeZone("America/Santiago");
    localStorage.setItem(CONSENT_KEY, "granted");
    render(<CookiePreferences />);

    act(() => openCookiePreferences());
    const dialog = screen.getByRole("dialog", { name: "Preferencias de cookies" });

    const necessary = within(dialog).getByRole("switch", { name: "Necesarias" });
    expect(necessary).toBeChecked();
    expect(necessary).toBeDisabled();
    expect(within(dialog).getByText("Siempre activas")).toBeInTheDocument();

    const statistics = within(dialog).getByRole("switch", { name: "Estadísticas" });
    expect(statistics).toBeChecked();
    fireEvent.click(statistics);
    expect(statistics).not.toBeChecked();

    fireEvent.click(within(dialog).getByRole("button", { name: "Guardar selección" }));
    expect(stored()).toMatchObject({ statistics: false, preferences: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("lists what each category stores", () => {
    localStorage.setItem(CONSENT_KEY, "granted");
    render(<CookiePreferences />);
    act(() => openCookiePreferences());
    const dialog = screen.getByRole("dialog");

    fireEvent.click(within(dialog).getAllByRole("button", { name: /Ver qué se guarda/ })[2]);
    expect(within(dialog).getByText("_ga")).toBeInTheDocument();
    expect(within(dialog).getAllByText("Google").length).toBeGreaterThan(0);
  });

  it("«Configurar» opens the panel; «Rechazar opcionales» and «Aceptar todas» decide", () => {
    mockTimeZone("Europe/Madrid");
    render(<CookiePreferences />);

    fireEvent.click(screen.getByRole("button", { name: "Configurar" }));
    fireEvent.click(screen.getByRole("button", { name: "Rechazar opcionales" }));
    expect(getConsent()).toEqual({ statistics: false, preferences: false, decided: true });

    act(() => openCookiePreferences());
    fireEvent.click(screen.getByRole("button", { name: "Aceptar todas" }));
    expect(getConsent()).toEqual({ statistics: true, preferences: true, decided: true });
  });
});
