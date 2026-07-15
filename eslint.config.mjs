import eslintPluginAstro from "eslint-plugin-astro";
import js from "@eslint/js";

export default [
  {
    ignores: [".astro", "astro.config.mjs"],
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
