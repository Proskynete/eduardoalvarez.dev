/*
 * Public URLs of the brand icons, the iOS launch screens and the default Open
 * Graph image.
 *
 * Vercel serves `/images/*` as `immutable` for a year (`vercel.json`), and the
 * previous brand used these same file names. So the names stay stable and the
 * URL carries `?v=<hash of the content>`: a new drawing is a new URL for every
 * cache that holds the old one (browsers, installed PWAs, LinkedIn and X
 * previews). The hashes live in `brand-asset-versions.json`, written by
 * `npm run brand:assets`; never edit them by hand.
 */
import versions from "./brand-asset-versions.json";

const hashes: Record<string, string> = versions;

/** The versioned URL of a file written by the brand generators. */
export function versioned(path: string): string {
  const hash = hashes[path];
  if (!hash) throw new Error(`${path} has no version: run \`npm run brand:assets\``);
  return `${path}?v=${hash}`;
}

export const brandAssets = {
  faviconSvg: versioned("/images/favicon/favicon.svg"),
  favicon32: versioned("/images/favicon/favicon-32x32.png"),
  favicon16: versioned("/images/favicon/favicon-16x16.png"),
  faviconIco: versioned("/favicon.ico"),
  appleTouchIcon: versioned("/images/manifest/apple-touch-icon.png"),
  androidChrome192: versioned("/images/manifest/android-chrome-192x192.png"),
  androidChrome512: versioned("/images/manifest/android-chrome-512x512.png"),
  mstile: versioned("/images/manifest/mstile-150x150.png"),
  ogDefault: versioned("/images/og-default.png"),
} as const;
