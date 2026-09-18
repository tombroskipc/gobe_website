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
    mimeTypes: ["image/*", "video/mp4"],
    staticDir: "public/media",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: false,
      admin: {
        description: "Optional. Public pages use this for image alt text, or as fallback context for uploaded MP4 captions.",
      },
    },
  ],
};
