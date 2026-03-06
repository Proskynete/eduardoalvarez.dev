import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      // ─── Typography ───────────────────────────────────────────────
      fontFamily: {
        sans: ["Geist", ...defaultTheme.fontFamily.sans],
        mono: ["Geist Mono", "Fira Code", ...defaultTheme.fontFamily.mono],
      },

      // ─── Color tokens ─────────────────────────────────────────────
      colors: {
        background: "#0a0a0a",
        surface: {
          DEFAULT: "#111111",
          raised: "#161616",
          border: "#1f1f1f",
        },
        text: {
          primary: "#f5f5f5",
          secondary: "#a3a3a3",
          muted: "#7c7c7c",
        },
        accent: {
          DEFAULT: "#06b6d4",
          hover: "#0891b2",
          subtle: "#164e63",
        },
        error: "#ef4444",
        success: "#22c55e",
        warning: "#f59e0b",
      },

      // ─── Container widths ─────────────────────────────────────────
      maxWidth: {
        content: "760px",
        wide: "1100px",
        full: "1280px",
      },

      // ─── Spacing tokens ───────────────────────────────────────────
      spacing: {
        "section-gap": "96px",
        "card-pad": "24px",
        "nav-height": "64px",
      },

      // ─── Gradients ────────────────────────────────────────────────
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0a0a0a 60%, #0c1f26 100%)",
        "accent-glow": "radial-gradient(ellipse at top, rgba(6,182,212,0.12) 0%, transparent 60%)",
      },

      // ─── Typography plugin ────────────────────────────────────────
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.text.primary"),
            "--tw-prose-headings": theme("colors.text.primary"),
            "--tw-prose-links": theme("colors.accent.DEFAULT"),
            "--tw-prose-code": theme("colors.text.primary"),
            "--tw-prose-pre-bg": theme("colors.surface.raised"),
            "--tw-prose-quotes": theme("colors.text.secondary"),
            "--tw-prose-counters": theme("colors.text.muted"),
            "--tw-prose-bullets": theme("colors.accent.DEFAULT"),
            a: {
              color: theme("colors.accent.DEFAULT"),
              textDecoration: "none",
              "&:hover": {
                color: theme("colors.accent.hover"),
                textDecoration: "underline",
              },
            },
            "h1,h2": {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
            },
            h3: {
              fontWeight: "600",
            },
            code: {
              color: theme("colors.text.primary"),
              backgroundColor: theme("colors.surface.raised"),
              borderRadius: "4px",
              padding: "2px 6px",
              fontWeight: "400",
              "&::before": { content: '""' },
              "&::after": { content: '""' },
            },
            "pre code": {
              backgroundColor: "transparent",
              padding: "0",
            },
            blockquote: {
              borderLeftColor: theme("colors.accent.DEFAULT"),
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
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
