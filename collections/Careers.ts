import type { CollectionBeforeValidateHook, CollectionConfig } from "payload";

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

  if (!data.slug && data.title) {
    data.slug = slugify(String(data.title));
  }

  if (!data.publishedAt && (data._status === "published" || data.status === "published")) {
    data.publishedAt = new Date().toISOString();
  }

  return data;
};

export const Careers: CollectionConfig = {
  slug: "careers",
  labels: {
    singular: "Career role",
    plural: "Careers",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "status", "updatedAt"],
    group: "Website",
    description: "Manage GoBeyond recruitment roles and Lark JD links for the careers page.",
    livePreview: {
      url: ({ data }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
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
        description: "Short date shown on the card, e.g. 08 Th12.",
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
      defaultValue: "St Moritz, 1014 Duong Pham Van Dong, TP. Ho Chi Minh",
    },
    {
      name: "quantity",
      type: "text",
      defaultValue: "01",
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
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
      type: "textarea",
      admin: {
        rows: 5,
      },
    },
    {
      name: "responsibilities",
      type: "array",
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "requirements",
      type: "array",
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "benefits",
      type: "array",
      fields: [
        {
          name: "text",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "workingTime",
      type: "textarea",
      defaultValue: "8:00-17:30, tu thu 2 den thu 6, thu 7 remote. Nghi trua: 12:00-13:30.",
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
