import type { CollectionConfig } from "payload";

const isAuthenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  upload: {
    staticDir: "public/media",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: false,
      admin: {
        description: "Optional. Public pages fall back to the post title or a generic GoBeyond image label when this is empty.",
      },
    },
  ],
};
