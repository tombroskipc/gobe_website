import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { newsBlocks } from "../blocks/NewsBlocks.ts";

const isAuthenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const templateLayouts: Record<string, unknown[]> = {
  standard: [
    {
      blockType: "lead",
      kicker: "GoBeyond News",
      heading: "What happened",
      body: "Start with the key update, why it matters, and who it affects.",
    },
    {
      blockType: "cta",
      heading: "Work with GoBeyond",
      body: "Build, operate, and scale global e-commerce systems with us.",
      label: "Contact us",
      href: "/#contact",
    },
  ],
  editorial: [
    {
      blockType: "lead",
      kicker: "Perspective",
      heading: "The big idea",
      body: "Frame the problem, the point of view, and the argument the article will make.",
    },
    {
      blockType: "pullQuote",
      quote: "Add the sharpest quote or takeaway here.",
      attribution: "GoBeyond",
    },
  ],
  caseStudy: [
    {
      blockType: "lead",
      kicker: "Case Study",
      heading: "The challenge",
      body: "Summarize the customer, market, constraint, and result.",
    },
    {
      blockType: "statsGrid",
      items: [
        { value: "3x", label: "Example growth metric" },
        { value: "48h", label: "Example turnaround" },
        { value: "12", label: "Markets supported" },
      ],
    },
    {
      blockType: "checklist",
      heading: "What GoBeyond handled",
      items: [{ text: "Product and listing operations" }, { text: "Marketing feedback loop" }, { text: "Fulfillment coordination" }],
    },
  ],
  companyUpdate: [
    {
      blockType: "lead",
      kicker: "Company Update",
      heading: "Announcement",
      body: "Write the announcement, internal context, and next step.",
    },
    {
      blockType: "checklist",
      heading: "Highlights",
      items: [{ text: "First key point" }, { text: "Second key point" }, { text: "Third key point" }],
    },
  ],
};

const seedTemplateLayout: CollectionBeforeValidateHook = ({ data, operation }) => {
  if (!data) {
    return data;
  }

  if (!data.slug && data.title) {
    data.slug = slugify(String(data.title));
  }

  if (operation === "create" && (!Array.isArray(data.layout) || data.layout.length === 0)) {
    data.layout = templateLayouts[String(data.template || "standard")] || templateLayouts.standard;
  }

  if (!data.publishedAt && data.status === "published") {
    data.publishedAt = new Date().toISOString();
  }

  return data;
};

export const News: CollectionConfig = {
  slug: "news",
  labels: {
    singular: "News post",
    plural: "News",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "template", "status", "updatedAt"],
    group: "Website",
    description: "Template-driven posts for GoBeyond news, announcements, editorials, and case studies.",
    livePreview: {
      url: ({ data }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
        const secret = process.env.PAYLOAD_SECRET || "";
        return `${base}/preview?secret=${encodeURIComponent(secret)}&slug=${encodeURIComponent(data?.slug || "")}`;
      },
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  access: {
    read: ({ req }) => (req.user ? true : { status: { equals: "published" } }),
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  hooks: {
    beforeValidate: [seedTemplateLayout],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description: "Auto-filled from the title if left blank.",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "template",
      type: "select",
      defaultValue: "standard",
      required: true,
      options: [
        { label: "Standard article", value: "standard" },
        { label: "Editorial / thought leadership", value: "editorial" },
        { label: "Case study", value: "caseStudy" },
        { label: "Company update", value: "companyUpdate" },
      ],
      admin: {
        position: "sidebar",
        description: "Seeds the starter content blocks when a post is created.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Optional hero image for listing cards and article headers.",
      },
    },
    {
      name: "layout",
      type: "blocks",
      required: true,
      blocks: newsBlocks,
      admin: {
        description: "WordPress-style structured content. Add, remove, and reorder blocks per post.",
      },
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        rows: 6,
        description: "Internal editor notes. Not rendered publicly.",
      },
    },
  ],
};
