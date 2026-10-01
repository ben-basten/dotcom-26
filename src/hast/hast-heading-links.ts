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

      context.insertAfter(node, {
        type: "element",
        tagName: "a",
        properties: {
          href: `#${id}`,
          ariaLabel: `Link to section`,
          ariaDescribedBy: [id],
          class:
            "no-underline hover:underline text-2xl font-bold ml-[5px] text-foreground opacity-40 hover:opacity-100 transition-opacity ease-in-out duration-default",
        },
        children: [{ type: "text", value: "#" }],
      });
    },
  },
});
