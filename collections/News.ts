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
      kicker: "Tin tức GoBeyond",
      heading: "Điểm cập nhật chính",
      body: "Bắt đầu với cập nhật quan trọng nhất, lý do nội dung này đáng chú ý và nhóm đối tượng liên quan.",
    },
    {
      blockType: "cta",
      heading: "Đồng hành cùng GoBeyond",
      body: "Cùng xây dựng, vận hành và mở rộng hệ thống thương mại điện tử toàn cầu.",
      label: "Liên hệ",
      href: "/#contact",
    },
  ],
  editorial: [
    {
      blockType: "lead",
      kicker: "Góc nhìn",
      heading: "Ý tưởng chính",
      body: "Nêu vấn đề, góc nhìn và luận điểm chính mà bài viết muốn truyền tải.",
    },
    {
      blockType: "pullQuote",
      quote: "Thêm câu trích dẫn hoặc thông điệp nổi bật nhất tại đây.",
      attribution: "GoBeyond",
    },
  ],
  caseStudy: [
    {
      blockType: "lead",
      kicker: "Câu chuyện thực tế",
      heading: "Thử thách",
      body: "Tóm tắt khách hàng, thị trường, ràng buộc và kết quả đạt được.",
    },
    {
      blockType: "statsGrid",
      items: [
        { value: "3x", label: "Chỉ số tăng trưởng mẫu" },
        { value: "48h", label: "Thời gian xử lý mẫu" },
        { value: "12", label: "Thị trường hỗ trợ" },
      ],
    },
    {
      blockType: "checklist",
      heading: "GoBeyond đã xử lý",
      items: [{ text: "Vận hành sản phẩm và listing" }, { text: "Vòng phản hồi marketing" }, { text: "Điều phối fulfillment" }],
    },
  ],
  companyUpdate: [
    {
      blockType: "lead",
      kicker: "Cập nhật công ty",
      heading: "Thông báo",
      body: "Viết thông báo, bối cảnh nội bộ và bước tiếp theo.",
    },
    {
      blockType: "checklist",
      heading: "Điểm nổi bật",
      items: [{ text: "Ý chính thứ nhất" }, { text: "Ý chính thứ hai" }, { text: "Ý chính thứ ba" }],
    },
  ],
  activity: [
    {
      blockType: "lead",
      kicker: "Hoạt động GoBeyond",
      heading: "Hoạt động nổi bật",
      body: "Tóm tắt bối cảnh, không khí sự kiện, những khoảnh khắc chính và ý nghĩa với đội ngũ GoBeyond.",
    },
    {
      blockType: "checklist",
      heading: "Gợi ý nội dung recap",
      items: [
        { text: "Không khí và mục tiêu của hoạt động" },
        { text: "Các khoảnh khắc hoặc trò chơi nổi bật" },
        { text: "Thông điệp hoặc lời kết cho đội ngũ" },
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

export const News: CollectionConfig = {
  slug: "news",
  labels: {
    singular: "Bài viết",
    plural: "Tin tức",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tag", "template", "status", "updatedAt"],
    group: "Website",
    description: "Template-driven posts for GoBeyond news, activities, announcements, editorials, and case studies.",
    livePreview: {
      url: ({ data }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
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
      defaultValue: "news",
      required: true,
      options: [
        { label: "Tin tức", value: "news" },
        { label: "Hoạt động", value: "activity" },
      ],
      admin: {
        position: "sidebar",
        description: "Chọn Hoạt động để đăng bài lên các trang Hoạt động công khai.",
      },
    },
    {
      name: "template",
      type: "select",
      defaultValue: "standard",
      required: true,
      options: [
        { label: "Bài viết tiêu chuẩn", value: "standard" },
        { label: "Góc nhìn biên tập", value: "editorial" },
        { label: "Câu chuyện thực tế", value: "caseStudy" },
        { label: "Cập nhật công ty", value: "companyUpdate" },
        { label: "Recap hoạt động", value: "activity" },
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
      admin: {
        description: "Nhập toàn bộ nội dung bài viết tại đây. Có thể dùng heading, paragraph, bullet list và format text.",
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
