import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");

  return rss({
    title: "Ben Basten",
    description:
      "A full stack developer with a passion for accessibility, open source, and collaboration.",
    site: context.site ?? context.url.origin,
    items: posts
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/posts/${post.id}`,
        content: post.body,
      })),
    customData: `<language>en-us</language>`,
  });
}
