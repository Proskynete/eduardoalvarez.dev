import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  { name: "Home", path: "/" },
  { name: "Articles", path: "/articles" },
  { name: "Speaking", path: "/speaking" },
  { name: "Podcasts", path: "/podcasts" },
  { name: "About", path: "/about" },
  { name: "Newsletter", path: "/newsletter" },
  { name: "Working With Me", path: "/working-with-me" },
];

for (const { name, path } of PAGES) {
  test(`accesibilidad: ${name} (${path}) — sin violaciones críticas`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .exclude("#giscus-iframe") // comentarios externos, fuera de control
      .analyze();

    const criticalViolations = results.violations.filter((v) =>
      ["critical", "serious"].includes(v.impact ?? ""),
    );

    if (criticalViolations.length > 0) {
      const report = criticalViolations
        .map(
          (v) =>
            `\n[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}\n` +
            v.nodes
              .slice(0, 3)
              .map((n) => `  → ${n.html}`)
              .join("\n"),
        )
        .join("\n");

      expect.soft(criticalViolations, `Violaciones en ${name}:\n${report}`).toHaveLength(0);
    }

    expect(criticalViolations).toHaveLength(0);
  });
}
