import type { CollectionConfig } from "payload";

const isAuthenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

export const ReusableCtas: CollectionConfig = {
  slug: "reusable-ctas",
  labels: {
    singular: "Reusable CTA",
    plural: "Reusable CTAs",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "heading", "updatedAt"],
    group: "Website",
    description: "Shared calls-to-action edited once and reused across News posts.",
  },
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Internal name for picking this CTA in a post.",
      },
    },
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "body",
      type: "textarea",
    },
    {
      name: "label",
      type: "text",
      defaultValue: "Contact GoBeyond",
      required: true,
    },
    {
      name: "href",
      type: "text",
      defaultValue: "/#contact",
      required: true,
    },
  ],
};
