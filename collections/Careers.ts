import type { CollectionAfterReadHook, CollectionBeforeValidateHook, CollectionConfig } from "payload";

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

const normalizeCareerDetailsAfterRead: CollectionAfterReadHook = ({ doc }) => {
  normalizeCareerDetailFields(doc as Record<string, unknown>);
  return doc;
};

const careerDetailRichTextField = () => ({
  name: "text",
  type: "richText" as const,
  required: true,
  admin: {
    description: "Có thể paste nhiều dòng hoặc dùng bullet list.",
  },
});

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
        { label: "Bản nháp", value: "draft" },
        { label: "Đã xuất bản", value: "published" },
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
        { label: "Đang tuyển", value: "hiring" },
        { label: "Marketing", value: "marketing" },
        { label: "Sáng tạo", value: "creative" },
        { label: "Vận hành", value: "operations" },
        { label: "Chăm sóc khách hàng", value: "customerService" },
        { label: "Nhân sự", value: "humanResource" },
        { label: "Thực tập", value: "internship" },
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
      defaultValue: "Thương mại điện tử",
    },
    {
      name: "employmentType",
      type: "text",
      defaultValue: "Toàn thời gian",
    },
    {
      name: "location",
      type: "text",
      defaultValue: "St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh",
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
      type: "textarea",
      admin: {
        rows: 5,
      },
    },
    {
      name: "responsibilities",
      type: "array",
      fields: [careerDetailRichTextField()],
    },
    {
      name: "requirements",
      type: "array",
      fields: [careerDetailRichTextField()],
    },
    {
      name: "benefits",
      type: "array",
      fields: [careerDetailRichTextField()],
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
