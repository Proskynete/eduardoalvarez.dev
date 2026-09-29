/*
 * Public paths of the brand icons and the default Open Graph image.
 *
 * Vercel serves `/images/*` as `immutable` for a year (`vercel.json`), so a
 * file that changes must also change its path, or every cache that already
 * has it keeps the old drawing: browsers, installed PWAs, LinkedIn and X
 * previews. The `-v2` files replaced the retired EA-01 isotype and the old
 * positioning. When the drawing changes again, bump the suffix here and in
 * `scripts/generate-manifest-icons.mjs` / `scripts/generate-og-default.mjs`.
 */
export const brandAssets = {
  faviconSvg: "/images/favicon/favicon-v2.svg",
  favicon32: "/images/favicon/favicon-32x32.png",
  favicon16: "/images/favicon/favicon-16x16.png",
  faviconIco: "/favicon.ico",
  appleTouchIcon: "/images/manifest/apple-touch-icon-v2.png",
  androidChrome192: "/images/manifest/android-chrome-192x192-v2.png",
  androidChrome512: "/images/manifest/android-chrome-512x512-v2.png",
  mstile: "/images/manifest/mstile-150x150-v2.png",
  ogDefault: "/images/og-default-v2.png",
} as const;
