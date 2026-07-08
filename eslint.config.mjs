// @ts-check
// @ts-nocheck
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".astro/**", "dist/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx,js,mjs}"],
    rules: {
      "no-undef": "off",
    },
  },
  {
    files: ["eslint.config.mjs"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
  {
    rules: {
      "astro/no-set-html-directive": "off",
    },
  },
);
