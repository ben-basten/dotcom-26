import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

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

const work = defineCollection({
  type: "content_layer",
  loader: glob({
    base: "./content/work",
    pattern: "**/*.{md,mdx}",
  }),
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    role: z.string().optional(),
    stack: z.array(z.string()).default([]),
    demoUrl: z.url().optional(),
  }),
});

export const collections = {
  posts,
  work,
};
