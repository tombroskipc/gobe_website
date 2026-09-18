import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { newsBlocks } from "../blocks/NewsBlocks.ts";
import { ExternalImageFeature } from "../features/externalImage/server/index.ts";
import { getPublicSiteUrl } from "../lib/siteUrl.ts";

const isAuthenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const textToLexicalRichText = (value: string) => ({
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    direction: null,
    children: value.trim()
      ? value
          .replace(/\r\n/g, "\n")
          .split(/\n{2,}/)
          .map((paragraph) => paragraph.trim())
          .filter(Boolean)
          .map((paragraph) => ({
            type: "paragraph",
            format: "",
            indent: 0,
            version: 1,
            direction: null,
            children: [
              {
                type: "text",
                text: paragraph,
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                version: 1,
              },
            ],
          }))
      : [],
  },
});

const templateLayouts: Record<string, unknown[]> = {
  standard: [
    {
      blockType: "lead",
      kicker: "GoBeyond News",
      heading: "Key update",
      body: "Start with the most important update, why it matters, and who it is relevant to.",
    },
    {
      blockType: "cta",
      heading: "Partner with GoBeyond",
      body: "Build, operate, and scale global e-commerce systems with us.",
      label: "Contact",
      href: "/#contact",
    },
  ],
  editorial: [
    {
      blockType: "lead",
      kicker: "Perspective",
      heading: "Main idea",
      body: "State the problem, perspective, and main argument the article should communicate.",
    },
    {
      blockType: "pullQuote",
      quote: "Add the strongest quote or standout message here.",
      attribution: "GoBeyond",
    },
  ],
  caseStudy: [
    {
      blockType: "lead",
      kicker: "Real story",
      heading: "Challenge",
      body: "Summarize the customer, market, constraints, and results achieved.",
    },
    {
      blockType: "statsGrid",
      items: [
        { value: "3x", label: "Sample growth metric" },
        { value: "48h", label: "Sample handling time" },
        { value: "12", label: "Supported markets" },
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
      kicker: "Company update",
      heading: "Announcement",
      body: "Write the announcement, internal context, and next steps.",
    },
    {
      blockType: "checklist",
      heading: "Highlights",
      items: [{ text: "First key point" }, { text: "Second key point" }, { text: "Third key point" }],
    },
  ],
  activity: [
    {
      blockType: "lead",
      kicker: "GoBeyond Activities",
      heading: "Featured activity",
      body: "Summarize the context, event atmosphere, key moments, and meaning for the GoBeyond team.",
    },
    {
      blockType: "checklist",
      heading: "Recap content prompts",
      items: [
        { text: "Activity atmosphere and goals" },
        { text: "Key moments or featured games" },
        { text: "Message or closing note for the team" },
      ],
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

  if (typeof data.content === "string") {
    data.content = textToLexicalRichText(data.content);
  }

  if (operation === "create" && !data.content) {
    const layout = templateLayouts[String(data.template || "standard")] || templateLayouts.standard;
    const lead = layout.find((block) => block && typeof block === "object" && (block as { blockType?: unknown }).blockType === "lead") as
      | { heading?: string; body?: string }
      | undefined;
    data.content = textToLexicalRichText([lead?.heading, lead?.body].filter(Boolean).join("\n\n"));
  }

  if (!data.publishedAt && data.status === "published") {
    data.publishedAt = new Date().toISOString();
  }

  return data;
};

const legacyAdminConfig = {
  condition: () => false,
  description: "Legacy block field kept for existing data fallback. Use Content for new posts.",
};

const teamOptions = [
  { label: "Company", value: "company" },
  { label: "Performance", value: "performance" },
  { label: "Creative", value: "creative" },
  { label: "Fulfillment", value: "fulfillment" },
  { label: "Operations", value: "operations" },
  { label: "Customer Service", value: "customerService" },
  { label: "Human Resource", value: "humanResource" },
  { label: "Internship", value: "internship" },
];

export const News: CollectionConfig = {
  slug: "news",
  labels: {
    singular: "Post",
    plural: "News",
  },
  defaultSort: "displayOrder",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["displayOrder", "title", "tag", "team", "status", "updatedAt"],
    group: "Website",
    description: "Template-driven posts for GoBeyond news, activities, announcements, editorials, and case studies.",
    livePreview: {
      url: ({ data }) => {
        const base = getPublicSiteUrl();
        const secret = process.env.PAYLOAD_SECRET || "";
        const type = data?.tag === "activity" ? "activity" : "news";
        return `${base}/preview?type=${type}&secret=${encodeURIComponent(secret)}&slug=${encodeURIComponent(data?.slug || "")}`;
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
      name: "tag",
      type: "select",
      defaultValue: "news",
      required: true,
      options: [
        { label: "News", value: "news" },
        { label: "Activities", value: "activity" },
      ],
      admin: {
        position: "sidebar",
        description: "Choose Activities to publish this post on the public Activities pages.",
      },
    },
    {
      name: "team",
      type: "select",
      options: teamOptions,
      admin: {
        position: "sidebar",
        description: "Used to filter and sort posts by team in the admin.",
      },
    },
    {
      name: "displayOrder",
      label: "Display Order",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Lower numbers appear first. Leave blank to sort later by team, title, and publish date.",
      },
    },
    {
      name: "template",
      type: "select",
      defaultValue: "standard",
      required: true,
      options: [
        { label: "Standard post", value: "standard" },
        { label: "Editorial perspective", value: "editorial" },
        { label: "Case study", value: "caseStudy" },
        { label: "Company update", value: "companyUpdate" },
        { label: "Activity recap", value: "activity" },
      ],
      admin: {
        position: "sidebar",
        condition: () => false,
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
      label: "Excerpt",
      type: "textarea",
    },
    {
      name: "content",
      label: "Content",
      type: "richText",
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [ExternalImageFeature(), ...defaultFeatures],
      }),
      admin: {
        description: "Enter the full post content here. You can use headings, paragraphs, bullet lists, formatted text, images, and MP4 videos.",
      },
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
      required: false,
      blocks: newsBlocks,
      admin: {
        ...legacyAdminConfig,
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
