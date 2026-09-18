import { createNode, createServerFeature } from "@payloadcms/richtext-lexical";
import { ExternalImageServerNode, type SerializedExternalImageNode } from "./ExternalImageNode";

const escapeAttribute = (value?: string | number) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const ExternalImageFeature = createServerFeature({
  feature: {
    ClientFeature: "@/features/externalImage/client#ExternalImageFeatureClient",
    nodes: [
      createNode({
        converters: {
          html: {
            converter: ({ node }) => {
              const imageNode = node as SerializedExternalImageNode;
              const attrs = [
                `src="${escapeAttribute(imageNode.src)}"`,
                `alt="${escapeAttribute(imageNode.alt)}"`,
                imageNode.title ? `title="${escapeAttribute(imageNode.title)}"` : "",
                imageNode.width ? `width="${escapeAttribute(imageNode.width)}"` : "",
                imageNode.height ? `height="${escapeAttribute(imageNode.height)}"` : "",
              ]
                .filter(Boolean)
                .join(" ");

              return `<img ${attrs} />`;
            },
            nodeTypes: [ExternalImageServerNode.getType()],
          },
        },
        node: ExternalImageServerNode,
      }),
    ],
  },
  key: "externalImage",
});
