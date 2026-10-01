import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import { THEME_COLORS } from "./utils/colors.constants";

const posts = defineCollection({
  type: "content_layer",
  loader: glob({
    base: "./content/posts",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    excerpt: z.string(),
  }),
});

const pages = defineCollection({
  type: "content_layer",
  loader: glob({
    base: "./content/pages",
    pattern: "**/*.{md,mdx}",
  }),
  schema: () =>
    z.object({
      title: z.string(),
      excerpt: z.string().optional(),
      theme: z.enum(THEME_COLORS).default("pink"),
    }),
});

const work = defineCollection({
  type: "content_layer",
  loader: glob({
    base: "./content/work",
    pattern: "**/*.{md,mdx}",
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      excerpt: z.string(),
      date: z.coerce.date(),
      role: z.string().optional(),
      stack: z.array(z.string()).default([]),
      hero: z
        .object({
          image: image(),
          alt: z.string(),
        })
        .optional(),
      theme: z.enum(THEME_COLORS).optional(),
    }),
});

export const collections = {
  pages,
  posts,
  work,
};
