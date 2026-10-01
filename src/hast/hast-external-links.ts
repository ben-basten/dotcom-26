import { defineHastPlugin } from "satteri";

export const hastExternalLinks = defineHastPlugin({
  name: "hast-external-links",
  element: {
    filter: ["a"],
    visit(node, context) {
      if (node.properties.href?.startsWith("http")) {
        context.setProperty(node, "target", "_blank");
        context.setProperty(node, "rel", "noopener noreferrer");
        context.setProperty(node, "aria-description", "opens in new tab");
        context.appendChild(node, {
          type: "element",
          tagName: "span",
          properties: { ariaHidden: "true" },
          children: [
            {
              type: "element",
              tagName: "svg",
              properties: {
                xmlns: "http://www.w3.org/2000/svg",
                width: "12",
                height: "12",
                fill: "none",
                viewBox: "0 0 6 6",
                style:
                  "display:inline-block;vertical-align:baseline;margin-inline-start:0.25em;margin-inline-end:1px",
                focusable: "false",
              },
              children: [
                {
                  type: "element",
                  tagName: "path",
                  properties: {
                    stroke: "currentColor",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M.5.5v5h5M2.5 3.5l3-3m-2 0h2v2M5.5 5.5V4M.5.5H2",
                  },
                  children: [],
                },
              ],
            },
          ],
        });
      }
    },
  },
});
