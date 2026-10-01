import { defineHastPlugin } from "satteri";
import { generateHeadingId } from "~/utils/heading.helpers";

export const hastHeadingLinks = defineHastPlugin({
  name: "hast-heading-links",
  element: {
    filter: ["h2"],
    visit(node, context) {
      const title = context.textContent(node).trim();
      const id =
        typeof node.properties.id === "string" && node.properties.id
          ? node.properties.id
          : generateHeadingId(title);

      if (!node.properties.id) context.setProperty(node, "id", id);

      context.setProperty(node, "class", "inline");
      context.wrapNode(node, {
        type: "element",
        tagName: "div",
        properties: {
          class: "group mt-7.5 border-b-2 border-theme",
        },
        children: [
          {
            type: "element",
            tagName: "a",
            properties: {
              href: `#${id}`,
              ariaLabel: `Link to "${title}"`,
              class:
                "no-underline hover:underline text-2xl md:text-3xl font-bold text-foreground opacity-40 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity ease-in-out duration-default",
            },
            children: [{ type: "text", value: "\u00a0#" }],
          },
        ],
      });
    },
  },
});
