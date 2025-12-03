import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        hero: ["Hero", ...defaultTheme.fontFamily.sans],
        avenir: ["Avenir", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          ...colors.pink,
          // Override pink-600 para mejor contraste en botones (WCAG AA: 4.73:1)
          600: "#be185d", // pink-700 de Tailwind
        },
        secondary: colors.purple,
        gray: {
          ...colors.gray,
          // Color específico para inputs con mejor contraste (WCAG AA: 3.37:1)
          input: "#4b5563", // gray-600 para borders de inputs
        },
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.primary.500"),
              "&:hover": {
                color: `${theme("colors.primary.600")}`,
              },
              code: { color: theme("colors.primary.400") },
            },
            "h1,h2": {
              fontWeight: "700",
              letterSpacing: theme("letterSpacing.tight"),
            },
            h3: {
              fontWeight: "600",
            },
            code: {
              color: theme("colors.indigo.500"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
