/**
 * The visitor's analytics decision, stored in localStorage. The inline loader in
 * `components/analytics/index.astro` reads the same key before anything else runs.
 *
 * localStorage can throw (private windows, blocked storage): both helpers
 * swallow it, and an unreadable decision counts as no decision.
 */
export const CONSENT_KEY = "cookie-consent";

export type Consent = "granted" | "denied";

export function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Consent): void {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // Storage blocked: the decision holds for this page only.
  }
}
