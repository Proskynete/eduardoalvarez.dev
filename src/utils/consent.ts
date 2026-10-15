/**
 * The visitor's cookie decision: one small store that the GA loader
 * (`components/analytics/index.astro`), the notice and the preferences panel
 * (`components/analytics/cookie-preferences.tsx`) and the theme toggle all read.
 *
 * Stored in localStorage under `cookie-consent` as JSON:
 * `{"v":2,"statistics":boolean,"preferences":boolean,"ts":<epoch ms>}`.
 * Version 1 stored the bare strings "granted" | "denied"; they are migrated on
 * read, so nobody's earlier choice is lost.
 *
 * With nothing stored there is no decision yet, and the region default applies
 * (see `isEurope`) WITHOUT being persisted: it is only written when the visitor
 * acts (Entendido, Aceptar, Rechazar, Guardar).
 *
 * localStorage can throw (private windows, blocked storage): every access is
 * wrapped, and an unreadable decision counts as no decision.
 */
import { THEME_KEY } from "@eduardoalvarez/arrecife/theme";

export const CONSENT_KEY = "cookie-consent";
export const CONSENT_VERSION = 2;
/** Fired on `window` when the decision changes, with the new `Consent` as detail. */
export const CONSENT_EVENT = "cookie-consent:change";
/** Fired on `window` to open the preferences panel. */
export const OPEN_PREFERENCES_EVENT = "cookie-consent:open";

export interface Consent {
  /** GA4 (`_ga`, `_ga_*`). */
  statistics: boolean;
  /** Cosmetic choices remembered across visits (the theme). */
  preferences: boolean;
}

export interface ConsentState extends Consent {
  /** False while the visitor has not acted: the values are the region default. */
  decided: boolean;
}

interface StoredConsent extends Consent {
  v: typeof CONSENT_VERSION;
  ts: number;
}

/*
 * Time zones outside the "Europe/" prefix that belong to the EEA, the UK or
 * Switzerland (Canary Islands, Madeira, Azores, Iceland, Faroe, Svalbard).
 */
const EUROPEAN_ATLANTIC_ZONES = new Set([
  "Atlantic/Canary",
  "Atlantic/Madeira",
  "Atlantic/Azores",
  "Atlantic/Reykjavik",
  "Atlantic/Faroe",
  "Arctic/Longyearbyen",
]);

/**
 * Whether the visitor is probably in Europe (EEA, UK or Switzerland), from the
 * browser's time zone. There, the GDPR/ePrivacy (and the UK and Swiss
 * equivalents) and Google's EU User Consent Policy require opt-in before any
 * analytics cookie, so statistics start OFF. Everywhere else they start ON
 * (opt-out) and a notice says so.
 *
 * The site is static, so there is no server-side geolocation to ask: the time
 * zone is the signal available in the browser. When it cannot be read, assume
 * Europe — the safe side is opt-in.
 */
export function isEurope(timeZone: string | undefined = currentTimeZone()): boolean {
  if (!timeZone) return true;
  return timeZone.startsWith("Europe/") || EUROPEAN_ATLANTIC_ZONES.has(timeZone);
}

function currentTimeZone(): string | undefined {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || undefined;
  } catch {
    return undefined;
  }
}

/** The decision that applies before the visitor acts. Never persisted. */
export function defaultConsent(europe: boolean = isEurope()): Consent {
  // Preferences only remember what the visitor chose themselves (the theme
  // toggle), so they start on everywhere; rejecting the optional ones turns
  // them off too.
  return { statistics: !europe, preferences: true };
}

/** Reads a stored value, migrating v1 strings. Anything unknown is no decision. */
export function parseConsent(raw: string | null): Consent | null {
  if (raw === null) return null;
  if (raw === "granted" || raw === "all") return { statistics: true, preferences: true };
  if (raw === "denied" || raw === "essential") return { statistics: false, preferences: true };
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return null;
    const { statistics, preferences } = value as Partial<StoredConsent>;
    if (typeof statistics !== "boolean") return null;
    return { statistics, preferences: typeof preferences === "boolean" ? preferences : true };
  } catch {
    return null;
  }
}

function readStored(): Consent | null {
  try {
    return parseConsent(localStorage.getItem(CONSENT_KEY));
  } catch {
    return null;
  }
}

/** The decision in force: the stored one, or the region default. */
export function getConsent(): ConsentState {
  const stored = readStored();
  if (stored) return { ...stored, decided: true };
  return { ...defaultConsent(), decided: false };
}

/** Persists the visitor's choice (merged over the current one) and notifies. */
export function setConsent(partial: Partial<Consent>): ConsentState {
  const { statistics, preferences } = getConsent();
  const next: Consent = { statistics, preferences, ...partial };
  const stored: StoredConsent = { v: CONSENT_VERSION, ...next, ts: Date.now() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(stored));
  } catch {
    // Storage blocked: the decision holds for this page only.
  }
  const state: ConsentState = { ...next, decided: true };
  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }));
  return state;
}

/** Subscribes to decision changes. Returns the unsubscribe function. */
export function onConsentChange(callback: (consent: ConsentState) => void): () => void {
  const listener = (event: Event) => callback((event as CustomEvent<ConsentState>).detail);
  window.addEventListener(CONSENT_EVENT, listener);
  return () => window.removeEventListener(CONSENT_EVENT, listener);
}

/**
 * The only preference stored today is the theme (arrecife's ThemeToggle writes
 * it). Without consent for preferences, it is dropped: the theme still applies
 * for this page, it just is not remembered.
 */
export function forgetPreferencesUnlessAllowed(consent: Consent = getConsent()): void {
  if (consent.preferences) return;
  try {
    localStorage.removeItem(THEME_KEY);
  } catch {
    // Storage blocked: nothing was stored either.
  }
}

/** Opens the preferences panel (the footer's «./cookies» does this). */
export function openCookiePreferences(): void {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}
