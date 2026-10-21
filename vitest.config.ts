import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Inlined by astro.config.mjs in real builds; empty here, as in a local build.
  define: {
    __SENTRY_ENVIRONMENT__: JSON.stringify(""),
    __SENTRY_RELEASE__: JSON.stringify(""),
    __OG_IMAGES__: JSON.stringify({}),
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/units/setup.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/tests/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/**",
        "src/test/**",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.config.ts",
        "**/*.config.js",
        "**/types.ts",
        "src/env.d.ts",
        "astro.config.mjs",
        ".astro/**",
        "dist/**",
        "src/settings/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
