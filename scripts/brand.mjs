/**
 * Shared brand constants for the asset generators.
 *
 * SINGLE source of truth for the scripts. When the palette or the mark changes,
 * change it here and re-run `npm run brand:assets` — never edit the scripts one
 * by one or retouch the PNGs by hand.
 *
 * Values must match BRAND.md and tailwind.config.mjs.
 */

/**
 * The fin — the real brand mark, in `public/brand/`.
 *
 * These scripts used to draw a hand-written path that was NOT the design
 * system's mark: a plain silhouette with no wave and no spots. Every icon on
 * the site carried a different symbol from the rest of the identity.
 *
 * PROVISIONAL: 147×111 PNGs cropped from the sticker sheet, so they look soft
 * at 512px. Once the vector exists, swap `FIN_FOAM` for it and rewrite
 * `composeIcon` with sharp + SVG.
 */
export const FIN_FOAM = "public/brand/fin-foam.png";
export const FIN_TWO_BLUES = "public/brand/fin.png";

export const COLOR = {
  abyss: "#091319",
  trench: "#10202b",
  border: "#22414f",
  accent: "#35d6c0", // bioluz — everything interactive
  warm: "#f2a65a", // arena — everything human
  textPrimary: "#edf4f3", // foam — the shark's belly
  textSecondary: "#a7bcc4", // haze
  hull: "#0b1524", // the mascot's outline
  paper: "#f6f2ea", // light mode — warm white, never #fff
};

/**
 * How much of the canvas the fin's WIDTH takes, per icon type.
 *
 * `maskable` is 0.62 and it is not arbitrary: Android crops icons declared
 * `purpose: "any maskable"` to a circle of 80% of the width, and a square box
 * inscribed in that circle cannot exceed ~0.57. Raising it clips the fin.
 */
export const SCALE = {
  maskable: 0.62, // android-chrome-*
  apple: 0.72, // apple-touch-icon — iOS rounds it itself
  tile: 0.7, // mstile
  favicon: 0.82, // 16/32/48 — every pixel counts at that size
};

/** Rounded-square radius, as a fraction of the side. */
export const RADIUS = 15 / 64;
