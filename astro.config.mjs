import { satteri } from "@astrojs/markdown-satteri";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField, fontProviders } from "astro/config";
import { hastExternalLinks } from "./src/hast/hast-external-links";
import { hastHeadingLinks } from "./src/hast/hast-heading-links";

import vue from "@astrojs/vue";

export default defineConfig({
  site: process.env.DEPLOY_PRIME_URL,
  integrations: [sitemap(), mdx(), vue()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: "dark-plus",
    },
    processor: satteri({
      hastPlugins: [hastExternalLinks, hastHeadingLinks],
    }),
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Asap",
      cssVariable: "--font-asap",
      weights: [400, 500, 600, 700, 800],
    },
  ],
  env: {
    schema: {
      DEPLOY_PRIME_URL: envField.string({
        context: "server",
        access: "secret",
      }),
      EMAIL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      GITHUB_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      LINKEDIN_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      COMMIT_REF: envField.string({ context: "client", access: "public" }),
      REPOSITORY_URL: envField.string({ context: "client", access: "public" }),
    },
  },
  redirects: {
    "/projects": "/work",
    "/projects/group-music-server": "/work",
    "/archives": "/posts",
  },
});
