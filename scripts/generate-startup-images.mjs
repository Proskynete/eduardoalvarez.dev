/**
 * Generates the iOS launch screens: the fin, the wordmark and the line, on abyss.
 * Run: node scripts/generate-startup-images.mjs  (part of `npm run brand:icons`)
 *
 * Rendered by WebKit (Playwright), not drawn with sharp: the same engine iOS
 * uses, with the brand's own fonts, so the type is the type the site sets. The
 * PNG is also the page's splash (src/components/splash-screen): the page shows
 * this very file, so the hand-off from iOS to the page has nothing to change.
 *
 * Needs Playwright's WebKit once: `npx playwright install webkit`.
 */
import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { webkit } from "playwright";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { dark } from "@eduardoalvarez/arrecife/tokens";

import { FIN_FOAM, STARTUP, recordVersions } from "./brand.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const b64 = (path) => readFileSync(resolve(root, path)).toString("base64");

const fonts = `
  @font-face { font-family: "Bricolage Grotesque"; font-weight: 200 800; src: url(data:font/woff2;base64,${b64("public/fonts/BricolageGrotesque.woff2")}) format("woff2"); }
  @font-face { font-family: "JetBrains Mono"; font-weight: 100 800; src: url(data:font/woff2;base64,${b64("public/fonts/JetBrainsMono.woff2")}) format("woff2"); }
`;

/*
 * The level-1 lockup (manual § 03), stacked: the fin, then the wordmark in
 * Bricolage Grotesque 700 uppercase with 0.04em tracking, then the line in mono
 * with 0.28em. The fin keeps its place from the first launch screens (112 px,
 * centre 38.5 px above the screen's), so the group stays optically centred.
 */
const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  ${fonts}
  html, body { margin: 0; height: 100%; background: ${dark.background}; }
  .fin { position: absolute; left: 50%; height: ${STARTUP.finHeight}px;
         top: calc(50% - ${STARTUP.lift}px - ${STARTUP.finHeight / 2}px); transform: translateX(-50%); }
  .lockup { position: absolute; left: 0; right: 0; top: calc(50% - ${STARTUP.lift}px + ${STARTUP.finHeight / 2}px + 28px);
            display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .rule { width: 32px; height: 1px; background: color-mix(in oklab, ${dark.accent} 50%, transparent); }
  .text { display: flex; flex-direction: column; align-items: center; gap: 3px; text-align: center; }
  .name { color: ${dark.textPrimary}; font: 700 22px/1 "Bricolage Grotesque"; text-transform: uppercase; letter-spacing: 0.04em; }
  /* The tracking also follows the last letter; the padding puts the line back on centre. */
  .line { color: ${dark.textMuted}; font: 400 13px/1.5 "JetBrains Mono"; letter-spacing: 0.28em; padding-inline-start: 0.28em; }
  /* 320 px wide (iPhone SE 1) cannot fit 0.28em: the line would break in two. */
  @media (max-width: 374px) { .line { letter-spacing: 0.06em; padding-inline-start: 0.06em; } }
  .line { white-space: nowrap; }
</style></head><body>
  <img class="fin" src="data:image/png;base64,${b64(FIN_FOAM)}" alt="">
  <div class="lockup">
    <div class="rule"></div>
    <div class="text">
      <span class="name">Eduardo Álvarez</span>
      <span class="line">entender · construir · compartir</span>
    </div>
  </div>
</body></html>`;

const { devices } = JSON.parse(readFileSync(resolve(root, "src/settings/apple-startup-images.json"), "utf-8"));
const browser = await webkit.launch();
const written = [];
for (const { width, height, ratio } of devices) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: ratio });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  const shot = await page.screenshot();
  await page.close();
  const name = `apple-splash-${width * ratio}x${height * ratio}.png`;
  writeFileSync(
    resolve(root, "public/images/manifest/startup", name),
    await sharp(shot).png({ compressionLevel: 9, palette: true }).toBuffer(),
  );
  written.push(`/images/manifest/startup/${name}`);
}
await browser.close();

recordVersions(root, written);
console.log(`✓ ${devices.length} pantallas de arranque de iOS (aleta + nombre + línea, renderizadas en WebKit)`);
