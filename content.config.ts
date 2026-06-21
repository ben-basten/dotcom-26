import { defineContentConfig, defineCollection } from "@nuxt/content";
import { defineSitemapSchema } from "@nuxtjs/sitemap/content";
import { z } from "zod";

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: "page",
      source: "posts/**",
      schema: z.object({
        sitemap: defineSitemapSchema(),
      }),
    }),
  },
});
