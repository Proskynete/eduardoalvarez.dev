/**
 * Genera el set completo de iconos a partir de la aleta del design system.
 * Run: node scripts/generate-manifest-icons.mjs  (o `npm run brand:icons`)
 *
 * La versión anterior dibujaba un path propio que no era la marca: una silueta
 * sin ola ni spots. Ahora compone `public/brand/fin-foam.png`, que es el
 * mismo asset que usa el design system como su propio favicon.
 */
import { mkdirSync, unlinkSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { FIN_FOAM, COLOR, SCALE, RADIUS } from "./brand.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestDir = resolve(root, "public/images/manifest");
const faviconDir = resolve(root, "public/images/favicon");
mkdirSync(manifestDir, { recursive: true });
mkdirSync(faviconDir, { recursive: true });

const finPath = resolve(root, FIN_FOAM);

/**
 * Compone la aleta centrada sobre un canvas cuadrado.
 * `escala` es la fracción del lado que ocupa el ANCHO de la aleta; la altura
 * sale de su proporción (147×111), así que nunca se deforma.
 */
async function composeIcon({ size, escala, radio = 0, fondo = COLOR.abyss }) {
  const finWidth = Math.round(size * escala);
  const fin = await sharp(finPath).resize({ width: finWidth }).toBuffer();
  const { width, height } = await sharp(fin).metadata();

  const rx = radio ? `rx="${Math.round(size * radio)}"` : "";
  const canvas = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" ${rx} fill="${fondo}"/></svg>`,
  );

  return sharp(canvas)
    .composite([{ input: fin, left: Math.round((size - width) / 2), top: Math.round((size - height) / 2) }])
    .png()
    .toBuffer();
}

const write = async (opts, target) => writeFileSync(target, await composeIcon(opts));

// ── Manifest ────────────────────────────────────────────────────────────────
// Android recorta los iconos `purpose: "any maskable"` a un círculo del 80%.
for (const size of [192, 512]) {
  await write({ size, escala: SCALE.maskable }, resolve(manifestDir, `android-chrome-${size}x${size}.png`));
  console.log(`✓ android-chrome-${size}x${size}.png`);
}
await write({ size: 180, escala: SCALE.apple }, resolve(manifestDir, "apple-touch-icon.png"));
console.log("✓ apple-touch-icon.png");
await write({ size: 150, escala: SCALE.tile }, resolve(manifestDir, "mstile-150x150.png"));
console.log("✓ mstile-150x150.png");

// ── Favicons ────────────────────────────────────────────────────────────────
// El SVG queda como envoltorio del PNG: no hay vector de la marca todavía, y
// un <img> dentro de un SVG es lo único honesto hasta que lo haya.
const finB64 = (await sharp(finPath).resize({ width: 256 }).png().toBuffer()).toString("base64");
writeFileSync(
  resolve(faviconDir, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Eduardo Álvarez">
  <rect width="64" height="64" rx="15" fill="${COLOR.abyss}"/>
  <image href="data:image/png;base64,${finB64}" x="8" y="17" width="48" height="36"/>
</svg>\n`,
);
console.log("✓ favicon.svg");

const buffers = [];
for (const size of [16, 32, 48]) {
  const out = resolve(faviconDir, `favicon-${size}x${size}.png`);
  await write({ size, escala: SCALE.favicon, radio: RADIUS / 64 }, out);
  buffers.push([size, await sharp(out).png().toBuffer()]);
  if (size !== 48) console.log(`✓ favicon-${size}x${size}.png`);
}

// ICO multitamaño con PNG embebido; sharp no escribe .ico.
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(buffers.length, 4);
let offset = 6 + 16 * buffers.length;
const entries = buffers.map(([size, data]) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(size, 0);
  e.writeUInt8(size, 1);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(data.length, 8);
  e.writeUInt32LE(offset, 12);
  offset += data.length;
  return e;
});
const ico = Buffer.concat([header, ...entries, ...buffers.map(([, d]) => d)]);
writeFileSync(resolve(faviconDir, "favicon.ico"), ico);
writeFileSync(resolve(root, "public/favicon.ico"), ico);
console.log("✓ favicon.ico (16+32+48) — también en la raíz de public/");
unlinkSync(resolve(faviconDir, "favicon-48x48.png"));

// Safari pinned tab: una tinta, sin fondo. Se deriva de la silueta.
const mask = await sharp(finPath).resize({ width: 512 }).png().toBuffer();
writeFileSync(
  resolve(manifestDir, "safari-pinned-tab.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 386">
  <image href="data:image/png;base64,${mask.toString("base64")}" width="512" height="386"/>
</svg>\n`,
);
console.log("✓ safari-pinned-tab.svg");

console.log(`\nListo. Aleta del design system sobre ${COLOR.abyss}.`);
