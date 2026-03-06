/**
 * Generates manifest icons from isotipo-solid.svg using sharp.
 * Run: node scripts/generate-manifest-icons.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

// Read isotipo-solid.svg inner content (without outer <svg> wrapper)
const isotipoRaw = readFileSync(resolve(root, "public/logos/isotipo-solid.svg"), "utf8");
const innerContent = isotipoRaw
  .replace(/<\?xml[^>]*\?>/g, "")
  .replace(/<!--[^]*?-->/g, "")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>/, "")
  .replace(/<style>[^]*?<\/style>/g, "")
  .trim();

// Isotipo viewBox: "35 28 320 432" → content spans 320×432
// We'll center it in a 512×512 square with ~15% padding on each side
// Usable area: 512 * 0.70 = 358 wide — scale by height to fit
const scale = (512 * 0.72) / 432; // ~0.855
const scaledW = 320 * scale; // ~273
const scaledH = 432 * scale; // ~370
const tx = (512 - scaledW) / 2 - 35 * scale; // center X, offset for viewBox origin
const ty = (512 - scaledH) / 2 - 28 * scale; // center Y, offset for viewBox origin

// Dark background SVG with the isotipo centered
function makeIconSvg(size) {
  const s = scale * (size / 512);
  const txS = (size - 320 * s) / 2 - 35 * s;
  const tyS = (size - 432 * s) / 2 - 28 * s;
  const rx = Math.round(size * 0.21); // rounded corners ~21%

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${rx}" fill="#0a0a0a"/>
  <g transform="translate(${txS.toFixed(2)}, ${tyS.toFixed(2)}) scale(${s.toFixed(4)})">
    ${innerContent}
  </g>
</svg>`;
}

// Safari pinned tab: single-color black mask SVG
// Uses the isotipo-bordes (outline) paths in black
const bordersRaw = readFileSync(resolve(root, "public/logos/isotipo-bordes.svg"), "utf8");
const bordersInner = bordersRaw
  .replace(/<\?xml[^>]*\?>/g, "")
  .replace(/<!--[^]*?-->/g, "")
  .replace(/<svg[^>]*>/, "")
  .replace(/<\/svg>/, "")
  .replace(/<style>[^]*?<\/style>/g, "")
  // Safari pinned tab requires black (#000) fill
  .replace(/stroke="#06b6d4"/g, 'stroke="#000000"')
  .replace(/stroke="#ffffff"/g, 'stroke="#000000"')
  .replace(/fill="#06b6d4"/g, 'fill="#000000"')
  .replace(/fill="#ffffff"/g, 'fill="#000000"')
  .trim();

const safariSvg = `<?xml version="1.0" standalone="no"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(${tx.toFixed(2)}, ${ty.toFixed(2)}) scale(${scale.toFixed(4)})">
    ${bordersInner}
  </g>
</svg>`;

const manifestDir = resolve(root, "public/images/manifest");

// 1. safari-pinned-tab.svg (SVG, no PNG needed)
writeFileSync(resolve(manifestDir, "safari-pinned-tab.svg"), safariSvg);
console.log("✓ safari-pinned-tab.svg");

// 2. android-chrome-192x192.png
await sharp(Buffer.from(makeIconSvg(192)))
  .png()
  .toFile(resolve(manifestDir, "android-chrome-192x192.png"));
console.log("✓ android-chrome-192x192.png");

// 3. android-chrome-512x512.png
await sharp(Buffer.from(makeIconSvg(512)))
  .png()
  .toFile(resolve(manifestDir, "android-chrome-512x512.png"));
console.log("✓ android-chrome-512x512.png");

// 4. apple-touch-icon.png (180×180 standard)
await sharp(Buffer.from(makeIconSvg(180)))
  .png()
  .toFile(resolve(manifestDir, "apple-touch-icon.png"));
console.log("✓ apple-touch-icon.png");

// 5. mstile-150x150.png (Microsoft tile, transparent bg preferred)
const mstileSize = 150;
const ms = scale * (mstileSize / 512);
const msTx = (mstileSize - 320 * ms) / 2 - 35 * ms;
const msTy = (mstileSize - 432 * ms) / 2 - 28 * ms;
const mstileSvg = `<svg width="${mstileSize}" height="${mstileSize}" viewBox="0 0 ${mstileSize} ${mstileSize}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${mstileSize}" height="${mstileSize}" fill="#0a0a0a"/>
  <g transform="translate(${msTx.toFixed(2)}, ${msTy.toFixed(2)}) scale(${ms.toFixed(4)})">
    ${innerContent}
  </g>
</svg>`;
await sharp(Buffer.from(mstileSvg)).png().toFile(resolve(manifestDir, "mstile-150x150.png"));
console.log("✓ mstile-150x150.png");

console.log("\nAll manifest icons updated.");
