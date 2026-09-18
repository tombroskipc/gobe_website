import type { CollectionAfterReadHook, CollectionBeforeValidateHook, CollectionConfig } from "payload";
import { getPublicSiteUrl } from "../lib/siteUrl.ts";

const isAuthenticated = ({ req }: { req: { user?: unknown } }) => Boolean(req.user);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const seedCareer: CollectionBeforeValidateHook = ({ data }) => {
  if (!data) {
    return data;
  }

  normalizeCareerRichTextDescription(data);
  normalizeCareerDetailFields(data);

  if (!data.slug && data.title) {
    data.slug = slugify(String(data.title));
  }

  if (!data.publishedAt && (data._status === "published" || data.status === "published")) {
    data.publishedAt = new Date().toISOString();
  }

  return data;
};

const textToLexicalRichText = (value: string) => ({
  root: {
    type: "root",
    format: "",
    indent: 0,
    version: 1,
    direction: null,
    children: value.trim()
      ? [
          {
            type: "paragraph",
            format: "",
            indent: 0,
            version: 1,
            direction: null,
            children: [
              {
                type: "text",
                text: value,
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                version: 1,
              },
            ],
          },
        ]
      : [],
  },
});

const normalizeCareerDetailFields = (data: Record<string, unknown>) => {
  for (const field of ["responsibilities", "requirements", "benefits"]) {
    const rows = data[field];

    if (!Array.isArray(rows)) {
      continue;
    }

    for (const row of rows) {
      if (row && typeof row === "object" && typeof (row as { text?: unknown }).text === "string") {
        (row as { text: unknown }).text = textToLexicalRichText((row as { text: string }).text);
      }
    }
  }
};

const normalizeCareerRichTextDescription = (data: Record<string, unknown>) => {
  if (typeof data.description === "string") {
    data.description = textToLexicalRichText(data.description);
  }
};

const normalizeCareerDetailsAfterRead: CollectionAfterReadHook = ({ doc }) => {
  normalizeCareerRichTextDescription(doc as Record<string, unknown>);
  normalizeCareerDetailFields(doc as Record<string, unknown>);
  return doc;
};

const careerDetailRichTextField = () => ({
  name: "text",
  type: "richText" as const,
  required: true,
  admin: {
    description: "Paste multiple lines or use a bullet list.",
  },
});

const legacyAdminConfig = {
  condition: () => false,
  description: "Legacy field kept for old data fallback. Use JD Content for new roles.",
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

export const Careers: CollectionConfig = {
  slug: "careers",
  labels: {
    singular: "Career role",
    plural: "Careers",
  },
  defaultSort: "displayOrder",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["displayOrder", "title", "team", "tag", "status", "updatedAt"],
    group: "Website",
    description: "Manage GoBeyond recruitment roles and Lark JD links for the careers page.",
    livePreview: {
      url: ({ data }) => {
        const base = getPublicSiteUrl();
        const secret = process.env.PAYLOAD_SECRET || "";
        return `${base}/preview?type=careers&secret=${encodeURIComponent(secret)}&slug=${encodeURIComponent(data?.slug || "")}`;
      },
      breakpoints: [
        { label: "Mobile", name: "mobile", width: 375, height: 667 },
        { label: "Tablet", name: "tablet", width: 768, height: 1024 },
        { label: "Desktop", name: "desktop", width: 1440, height: 900 },
      ],
    },
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: "published" } }),
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAuthenticated,
  },
  hooks: {
    beforeValidate: [seedCareer],
    afterRead: [normalizeCareerDetailsAfterRead],
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
      defaultValue: "hiring",
      required: true,
      options: [
        { label: "Hiring", value: "hiring" },
        { label: "Marketing", value: "marketing" },
        { label: "Creative", value: "creative" },
        { label: "Operations", value: "operations" },
        { label: "Customer Service", value: "customerService" },
        { label: "Human Resource", value: "humanResource" },
        { label: "Internship", value: "internship" },
      ],
      admin: {
        position: "sidebar",
        description: "Tag shown on the recruitment card.",
      },
    },
    {
      name: "team",
      type: "select",
      options: teamOptions,
      admin: {
        position: "sidebar",
        description: "Used to filter and sort roles by team in the admin.",
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
      name: "dateLabel",
      type: "text",
      defaultValue: "2026",
      admin: {
        position: "sidebar",
        description: "Short date shown on the card, e.g. Dec 08.",
      },
    },
    {
      name: "department",
      type: "text",
      defaultValue: "E-commerce",
    },
    {
      name: "employmentType",
      type: "text",
      defaultValue: "Full-time",
    },
    {
      name: "location",
      type: "text",
      defaultValue: "St Moritz, 1014 Pham Van Dong Street, Hiep Binh Ward, Ho Chi Minh City",
    },
    {
      name: "quantity",
      type: "text",
      defaultValue: "01",
    },
    {
      name: "excerpt",
      label: "Excerpt",
      type: "textarea",
    },
    {
      name: "larkUrl",
      type: "text",
      admin: {
        description: "Public Lark wiki JD URL for this role.",
      },
    },
    {
      name: "applyUrl",
      type: "text",
      defaultValue: "mailto:tuyendung@gobe.asia",
      admin: {
        description: "Application link or mailto URL.",
      },
    },
    {
      name: "description",
      label: "JD Content",
      type: "richText",
      admin: {
        description:
          "Enter the full JD here: job description, requirements, and benefits. You can paste headings and bullet lists.",
      },
    },
    {
      name: "responsibilities",
      type: "array",
      admin: legacyAdminConfig,
      fields: [careerDetailRichTextField()],
    },
    {
      name: "requirements",
      type: "array",
      admin: legacyAdminConfig,
      fields: [careerDetailRichTextField()],
    },
    {
      name: "benefits",
      type: "array",
      admin: legacyAdminConfig,
      fields: [careerDetailRichTextField()],
    },
    {
      name: "workingTime",
      type: "textarea",
      defaultValue: "8:00 - 17:30, Monday to Friday and Saturday morning remote. Lunch break: 12:00 - 13:30",
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        rows: 6,
        description: "Internal recruitment notes. Not rendered publicly.",
      },
    },
  ],
};
