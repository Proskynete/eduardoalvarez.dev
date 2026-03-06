/**
 * Generates og-default.png with the new isotipo and Geist font.
 * Run: node scripts/generate-og-default.mjs
 */
import { readFileSync } from "fs";
import { dirname, resolve } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// ── Fonts (embedded as base64 so librsvg can use them) ──────────────────────
const geistBoldB64 = readFileSync(
  resolve(root, "node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf"),
).toString("base64");
const geistRegularB64 = readFileSync(
  resolve(root, "node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf"),
).toString("base64");

// ── Isotipo content ──────────────────────────────────────────────────────────
const isotipoRaw = readFileSync(resolve(root, "public/logos/isotipo-solid.svg"), "utf8");
const isotipoInner = isotipoRaw
  .replace(/<\?xml[^>]*\?>/g, "")
  .replace(/<!--[^]*?-->/g, "")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>/, "")
  .replace(/<style>[^]*?<\/style>/g, "")
  .trim();

// ── Layout constants ─────────────────────────────────────────────────────────
// OG standard: 1200 × 630
const W = 1200;
const H = 630;

// Isotipo: viewBox "35 28 320 432" → scale to 230px tall
const ISO_H = 230;
const ISO_SCALE = ISO_H / 432; // 0.5324
const ISO_W = 320 * ISO_SCALE; // 170px
const ISO_X = 88; // left margin
const ISO_Y = (H - ISO_H) / 2; // vertically centered

// Translate: offset viewBox origin so the isotipo starts at (ISO_X, ISO_Y)
const tx = ISO_X - 35 * ISO_SCALE;
const ty = ISO_Y - 28 * ISO_SCALE;

// Text block starts after isotipo + gap
const TEXT_X = ISO_X + ISO_W + 68; // ~326
const DIVIDER_X = TEXT_X - 34;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Geist';
        font-weight: 700;
        src: url('data:font/truetype;base64,${geistBoldB64}') format('truetype');
      }
      @font-face {
        font-family: 'Geist';
        font-weight: 400;
        src: url('data:font/truetype;base64,${geistRegularB64}') format('truetype');
      }
    </style>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="#0a0a0a"/>

  <!-- Subtle noise overlay via semi-transparent grid (optional depth) -->
  <rect width="${W}" height="${H}" fill="url(#noise)" opacity="0.015"/>

  <!-- Isotipo -->
  <g transform="translate(${tx.toFixed(2)}, ${ty.toFixed(2)}) scale(${ISO_SCALE.toFixed(4)})">
    ${isotipoInner}
  </g>

  <!-- Vertical divider -->
  <line
    x1="${DIVIDER_X}" y1="140"
    x2="${DIVIDER_X}" y2="490"
    stroke="#1f1f1f" stroke-width="1"
  />

  <!-- Name -->
  <text
    x="${TEXT_X}" y="295"
    font-family="Geist, system-ui, sans-serif"
    font-weight="700"
    font-size="72"
    fill="#f5f5f5"
    letter-spacing="-1.5"
  >Eduardo Álvarez</text>

  <!-- Subtitle -->
  <text
    x="${TEXT_X}" y="352"
    font-family="Geist, system-ui, sans-serif"
    font-weight="400"
    font-size="28"
    fill="#a3a3a3"
    letter-spacing="-0.3"
  >Engineering Leadership &amp; Platform Thinking</text>

  <!-- Horizontal rule below subtitle -->
  <line
    x1="${TEXT_X}" y1="382"
    x2="${W - 80}" y2="382"
    stroke="#1f1f1f" stroke-width="1"
  />

  <!-- Accent dot -->
  <circle cx="${TEXT_X - 2}" cy="${382}" r="3" fill="#06b6d4"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(resolve(root, "public/images/og-default.png"));

console.log("✓ og-default.png (1200×630)");
