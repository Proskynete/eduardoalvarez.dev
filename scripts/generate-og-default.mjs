/**
 * Generates og-default.png with the fin and the current palette.
 * Run: node scripts/generate-og-default.mjs  (or `npm run brand:og`)
 *
 * The design system documents this template as "recreated from
 * scripts/generate-og-default.mjs": fin at 200px with a halo, divider at x=290,
 * Geist 72/700 and 28/400 — not the display face. That exception is deliberate:
 * the generator defines this layout, not the OG grid table.
 *
 * The fin is the FOAM variant, because the ground is dark. The system flags this
 * as "the easiest mistake to make in a generator, because the background is a
 * parameter" — so if this template ever renders on paper, swap to FIN_TWO_BLUES.
 */
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { COLOR, FIN_FOAM } from "./brand.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Fonts inlined as base64 so librsvg can resolve them.
const b64 = (p) => readFileSync(resolve(root, p)).toString("base64");
const geistBold = b64("node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf");
const geistRegular = b64("node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf");
const fin = readFileSync(resolve(root, FIN_FOAM)).toString("base64");

const W = 1200;
const H = 630;

// 200px was the first draft, but at the 147×111 ratio the fin ran past the
// divider at x=290. 168 keeps the mark inside its own column.
const FIN_H = 168;
const FIN_W = Math.round((147 / 111) * FIN_H); // keep the 147×111 ratio
const FIN_X = 160 - FIN_W / 2;
const FIN_Y = (H - FIN_H) / 2;

const DIVIDER_X = 290;
const TEXT_X = 336;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face { font-family:'Geist'; font-weight:700; src:url('data:font/truetype;base64,${geistBold}') format('truetype'); }
      @font-face { font-family:'Geist'; font-weight:400; src:url('data:font/truetype;base64,${geistRegular}') format('truetype'); }
    </style>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${COLOR.accent}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${COLOR.accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${COLOR.abyss}"/>

  <!-- Bioluz halo behind the mark — the same glow that breathes in the header -->
  <circle cx="160" cy="${H / 2}" r="210" fill="url(#glow)"/>

  <image href="data:image/png;base64,${fin}" x="${FIN_X}" y="${FIN_Y}" width="${FIN_W}" height="${FIN_H}"/>

  <line x1="${DIVIDER_X}" y1="140" x2="${DIVIDER_X}" y2="490" stroke="${COLOR.border}" stroke-width="1"/>

  <text x="${TEXT_X}" y="295" font-family="Geist, system-ui, sans-serif" font-weight="700"
        font-size="72" fill="${COLOR.textPrimary}" letter-spacing="-1.5">Eduardo Álvarez</text>

  <text x="${TEXT_X}" y="352" font-family="Geist, system-ui, sans-serif" font-weight="400"
        font-size="28" fill="${COLOR.textSecondary}" letter-spacing="-0.3">Engineering Leadership &amp; Platform Thinking</text>

  <line x1="${TEXT_X}" y1="382" x2="${W - 80}" y2="382" stroke="${COLOR.border}" stroke-width="1"/>
  <circle cx="${TEXT_X - 2}" cy="382" r="3" fill="${COLOR.accent}"/>
</svg>`;

await sharp(Buffer.from(svg), { density: 144 })
  .resize(W, H)
  .png()
  .toFile(resolve(root, "public/images/og-default.png"));

console.log(`✓ og-default.png (${W}×${H}) — foam fin on ${COLOR.abyss}`);
