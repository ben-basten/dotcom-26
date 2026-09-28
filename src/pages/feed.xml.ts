import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { TAGLINE } from "~/utils/copy.constants";

export async function GET(context: APIContext) {
  const posts = await getCollection("posts");

  return rss({
    title: "Ben Basten",
    description: TAGLINE,
    site: context.site ?? context.url.origin,
    items: posts
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((post) => ({
        title: post.data.title,
        description: post.data.excerpt,
        pubDate: post.data.date,
        link: `/posts/${post.id}`,
        content: post.body,
      })),
    customData: `<language>en-us</language>`,
  });
}
