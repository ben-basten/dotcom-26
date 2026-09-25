import js from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";

export default [
  {
    ignores: [".astro", "dist", "astro.config.mjs"],
  },
  // add more generic rule sets here, such as:
  js.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // override/add rules settings here
    },
  },
];
