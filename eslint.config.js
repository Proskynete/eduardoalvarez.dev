import js from "@eslint/js";
import prettier from "eslint-config-prettier/flat";
import react from "eslint-plugin-react";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist/", ".vercel/", ".astro/", "coverage/", "node_modules/"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      react,
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      react: {
        // Versión fija (no "detect"): eslint-plugin-react 7.x usa la API antigua
        // context.getFilename() en su autodetección, eliminada en ESLint 10.
        version: "19.2",
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react/react-in-jsx-scope": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          disallowTypeAnnotations: true,
          fixStyle: "separate-type-imports",
        },
      ],
      "no-duplicate-imports": "error",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  prettier,
);
