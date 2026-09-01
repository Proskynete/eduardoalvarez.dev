import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = [
  { name: "Home", path: "/" },
  { name: "Articles", path: "/articles" },
  { name: "Speaking", path: "/speaking" },
  // `/podcasts` redirige a la home, así que ponerlo acá era probar la home dos
  // veces. Se prueba el detalle, que es lo que sí se sirve.
  { name: "Podcast episode", path: "/podcasts/bienvenidos-mi-historia" },
  { name: "Article", path: "/articles/el-javascript-necesario-para-react-parte-1" },
  { name: "About", path: "/about" },
  { name: "Newsletter", path: "/newsletter" },
  { name: "Working With Me", path: "/working-with-me" },
];

// Las dos caras. Todo esto corría solo en oscuro, que es el tema por defecto, y
// por eso pasó desapercibido que en claro los `h2` del cuerpo de los artículos
// salían en #EDF4F3 sobre crema: 1.03:1, invisibles. axe mide contraste, así que
// lo habría cazado el primer día si se hubiera ejecutado en los dos temas.
const TEMAS = ["dark", "light"] as const;

/**
 * Lo que axe deja en `incomplete` por razones legítimas y no por un color malo:
 * glifos sueltos (✓, →), texto de un carácter y fondos con imagen o degradado,
 * donde no hay un color plano contra el que medir.
 */
const SIN_MEDIR = /too short|only non-text characters|background (image|gradient)/i;

for (const { name, path } of PAGES) {
  for (const tema of TEMAS) {
    test(`accesibilidad: ${name} (${path}) en ${tema} — sin violaciones críticas`, async ({ page }) => {
      // Sin esto axe mide durante el fundido de 200ms entre temas y lee colores
      // intermedios —grises que no existen en ninguno de los dos— y reporta
      // contrastes que nadie llega a ver. Solo importan los estados finales.
      await page.addStyleTag({
        content: "*,*::before,*::after{transition:none!important;animation:none!important}",
      }).catch(() => {});
      await page.goto(path);
      await page.addStyleTag({
        content: "*,*::before,*::after{transition:none!important;animation:none!important}",
      });
      if (tema === "light") {
        await page.locator("#theme-toggle").click();
        // Sin esta comprobación el test miente: si el click llega antes de que
        // el script del botón enganche su listener no pasa nada, la página se
        // queda en oscuro y axe aprueba la versión que no se quería probar.
        // Pasó: la suite completa daba verde mientras la suite sola fallaba.
        await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
        await page.mouse.move(0, 0);
      }
      // `networkidle` es inestable acá: el dev server mantiene actividad de red
      // (HMR, prefetch de enlaces) y el estado nunca se asienta, así que el
      // timeout salta antes de que axe llegue a correr — y la página que falla
      // va rotando entre corridas. Se espera una condición real del DOM.
      // Ancla visible y presente en todas las páginas. `body > *` no sirve: el
      // primer hijo es el enlace de salto al contenido, oculto a propósito.
      await page.locator("#site-header").waitFor({ state: "visible" });
      await page.waitForLoadState("domcontentloaded");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .exclude("#giscus-iframe") // comentarios externos, fuera de control
        .analyze();

      /**
       * axe manda el peor contraste posible a `incomplete`, no a `violations`:
       * un 1:1 suele significar texto ocultado a propósito —reemplazo por
       * imagen, patrones para lector de pantalla— así que se abstiene de
       * llamarlo fallo. El resultado es que los `h2` del cuerpo de los
       * artículos, pintados en #EDF4F3 sobre crema, daban exactamente 1:1 y la
       * suite pasaba en verde con el texto invisible.
       *
       * Acá no hay texto oculto por color, así que un contraste que axe no
       * puede resolver cuenta como fallo. Se exceptúa lo que no puede medir
       * por razones legítimas: contenido demasiado corto y fondos con imagen.
       */
      const incompletosDeContraste = results.incomplete
        .filter((v) => v.id === "color-contrast")
        .map((v) => ({
          ...v,
          nodes: v.nodes.filter((n) => !SIN_MEDIR.test(n.any?.[0]?.message ?? "")),
        }))
        .filter((v) => v.nodes.length > 0);

      const criticalViolations = [
        ...results.violations.filter((v) => ["critical", "serious"].includes(v.impact ?? "")),
        ...incompletosDeContraste,
      ];

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

        expect.soft(criticalViolations, `Violaciones en ${name} [${tema}]:\n${report}`).toHaveLength(0);
      }

      expect(criticalViolations).toHaveLength(0);
    });
  }
}
