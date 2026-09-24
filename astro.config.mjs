import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: process.env.DEPLOY_PRIME_URL,
  integrations: [sitemap(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "dark-plus",
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Asap",
      cssVariable: "--font-asap",
      weights: [400, 500, 600, 700, 800],
    },
  ],
});
