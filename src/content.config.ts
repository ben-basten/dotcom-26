import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const posts = defineCollection({
  type: "content_layer",
  loader: glob({
    base: "./content/posts",
    pattern: "**/*.md",
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    readTime: z.preprocess(
      (value) => (typeof value === "number" ? value : undefined),
      z.number().optional(),
    ),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    description: z.string().optional(),
  }),
});

const work = defineCollection({
  type: "content_layer",
  loader: glob({
    base: "./content/work",
    pattern: "**/*.md",
  }),
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    summary: z.string(),
    stack: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    repoUrl: z.url().optional(),
    demoUrl: z.url().optional(),
  }),
});

export const collections = {
  posts,
  work,
};
