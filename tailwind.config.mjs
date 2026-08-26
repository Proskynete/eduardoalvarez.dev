import plugin from "tailwindcss/plugin";
import defaultTheme from "tailwindcss/defaultTheme";

/**
 * Tokens de "Identidad Eduardo Álvarez · v1 · 2026".
 * Fuente de verdad: el handoff de diseño + BRAND.md. No inventar valores acá.
 *
 * Paleta derivada del tiburón ballena. Los neutros llevan azul real, no gris:
 * es lo que integra la mascota con la interfaz en vez de dejarla pegada encima.
 * El sistema anterior tenía los siete neutros a 0.0% de saturación.
 *
 * Contraste verificado sobre #091319 — primary 16.84:1, secondary 9.50:1,
 * muted 5.57:1, accent 10.31:1, warm 9.28:1. Si se toca un neutro, recalcular.
 */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      // ─── Tipografía ───────────────────────────────────────────────
      fontFamily: {
        display: ["Bricolage Grotesque Variable", ...defaultTheme.fontFamily.sans],
        sans: ["Geist", ...defaultTheme.fontFamily.sans],
        mono: ["JetBrains Mono Variable", ...defaultTheme.fontFamily.mono],
      },

      // ─── Color ────────────────────────────────────────────────────
      // Los colores salen de variables CSS (tripletas R G B) para que el modo
      // claro pueda conmutarlos. Con hex fijos, `data-tema="claro"` solo podría
      // cambiar los componentes propios y no las utilidades de Tailwind, que
      // son la mayor parte del sitio. La sintaxis <alpha-value> conserva
      // `bg-surface/40` y demás modificadores de opacidad.
      colors: {
        background: "rgb(var(--c-background) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--c-surface) / <alpha-value>)",
          raised: "rgb(var(--c-surface-raised) / <alpha-value>)",
          border: "rgb(var(--c-surface-border) / <alpha-value>)",
        },
        text: {
          primary: "rgb(var(--c-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--c-text-secondary) / <alpha-value>)",
          muted: "rgb(var(--c-text-muted) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          hover: "rgb(var(--c-accent-hover) / <alpha-value>)",
          dark: "#0d7c6f",
        },
        warm: {
          DEFAULT: "rgb(var(--c-warm) / <alpha-value>)",
          hover: "rgb(var(--c-warm-hover) / <alpha-value>)",
          dark: "#a65b27",
        },
        paper: {
          DEFAULT: "#f6f2ea",
          raised: "#ffffff",
          border: "#e6dfd2",
          text: "#0b1524",
          secondary: "#3d4b58",
          muted: "#6b7480",
        },
        mascota: {
          cuerpo: "#3e7cb1",
          manchas: "#c2d7e7",
          casco: "#0b1524",
        },
        error: "#e05252",
        success: "#4fb477",
        warning: "#e8a33d",
      },

      backgroundImage: {
        "hero-gradient": "var(--g-hero)",
        "slide-cover": "linear-gradient(150deg, #091319 55%, #0e2a30 100%)",
        "accent-glow": "var(--g-accent-glow)",
      },

      // ─── Layout ───────────────────────────────────────────────────
      maxWidth: { content: "760px", wide: "1180px", full: "1280px" },
      spacing: { "section-gap": "96px", "card-pad": "26px", "nav-height": "64px" },
      borderRadius: { control: "10px", card: "14px", panel: "16px" },
      letterSpacing: { display: "-0.035em", tight: "-0.03em", eyebrow: "0.14em" },
      boxShadow: { DEFAULT: "0 1px 2px rgba(0,0,0,.35)" },

      // Deriva vertical lenta para la mascota del hero: lee como flotación,
      // no como rebote. Solo se aplica bajo `motion-safe`.
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      animation: { float: "float 6s ease-in-out infinite" },

      // ─── Plugin typography ────────────────────────────────────────
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            maxWidth: "68ch",
            "--tw-prose-body": theme("colors.text.secondary"),
            "--tw-prose-headings": theme("colors.text.primary"),
            "--tw-prose-links": theme("colors.accent.DEFAULT"),
            "--tw-prose-code": theme("colors.text.primary"),
            "--tw-prose-pre-bg": theme("colors.mascota.casco"),
            "--tw-prose-quotes": theme("colors.text.secondary"),
            "--tw-prose-counters": theme("colors.text.muted"),
            "--tw-prose-bullets": theme("colors.accent.DEFAULT"),
            fontSize: "18px",
            lineHeight: "1.75",
            a: {
              color: theme("colors.accent.DEFAULT"),
              textDecoration: "none",
              "&:hover": { color: theme("colors.accent.hover"), textDecoration: "underline" },
            },
            "h1,h2,h3": {
              fontFamily: theme("fontFamily.display").join(", "),
              letterSpacing: theme("letterSpacing.tight"),
            },
            "h1,h2": { fontWeight: "700" },
            h3: { fontWeight: "600" },
            code: {
              color: theme("colors.text.primary"),
              backgroundColor: theme("colors.surface.raised"),
              borderRadius: "4px",
              padding: "2px 6px",
              fontWeight: "400",
              "&::before": { content: '""' },
              "&::after": { content: '""' },
            },
            "pre code": { backgroundColor: "transparent", padding: "0" },
            blockquote: {
              borderLeftColor: theme("colors.warm.DEFAULT"),
              borderLeftWidth: "3px",
              backgroundColor: "transparent",
              color: theme("colors.text.secondary"),
              fontStyle: "italic",
              paddingLeft: "1rem",
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    // Variante `light:` para el modo claro. Permite expresar en utilidades las
    // reglas que cambian de token entre temas — por ejemplo que el botón
    // primario pase a casco sólido — sin volver a escribir CSS suelto.
    plugin(({ addVariant }) => {
      addVariant("light", 'html[data-theme="light"] &');
    }),
  ],
};
