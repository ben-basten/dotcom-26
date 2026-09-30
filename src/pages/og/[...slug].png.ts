import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import type { ThemeColor } from "~/utils/colors.constants";
import { createOgImage } from "~/utils/og-image";

interface ImageData {
  title: string;
  color: ThemeColor;
}

export const getStaticPaths = (async () => {
  const [posts, pages, work] = await Promise.all([
    getCollection("posts"),
    getCollection("pages"),
    getCollection("work"),
  ]);

  const images: { slug: string; data: ImageData }[] = [
    { slug: "index", data: { title: "Ben Basten", color: "green" } },
    { slug: "about", data: { title: "About me", color: "blue" } },
    { slug: "posts", data: { title: "Blog", color: "mango" } },
    { slug: "work", data: { title: "Work", color: "pink" } },
    { slug: "404", data: { title: "Not found", color: "pink" } },
    ...posts.map((post) => ({
      slug: `posts/${post.id}`,
      data: { title: post.data.title, color: "mango" as const },
    })),
    ...pages.map((page) => ({
      slug: page.id,
      data: { title: page.data.title, color: page.data.theme },
    })),
    ...work
      .filter((entry) => !entry.data.hero)
      .map((entry) => ({
        slug: `work/${entry.id}`,
        data: { title: entry.data.title, color: entry.data.theme ?? "pink" },
      })),
  ];

  return images.map(({ slug, data }) => ({
    params: { slug },
    props: { title: data.title, color: data.color },
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
  const { title, color } = props as ImageData;
  const image = await createOgImage(title, color);

  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/png" },
  });
};
