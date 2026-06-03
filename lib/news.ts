import type { Where } from "payload";
import { getPayloadClient } from "@/lib/payload";

export type NewsPost = {
  id?: string | number;
  title: string;
  slug: string;
  excerpt: string;
  tag?: NewsTag | string;
  template?: string;
  publishedAt?: string;
  heroImage?: unknown;
  layout?: NewsBlock[];
};

export type NewsTag = "news" | "activity";

export type NewsBlock = {
  id?: string;
  blockType?: string;
  [key: string]: unknown;
};

export const fallbackNews: NewsPost[] = [
  {
    id: "sample-case-study",
    title: "Vận hành thương mại điện tử toàn cầu từ Việt Nam",
    slug: "scaling-global-ecommerce-operations",
    excerpt:
      "Bài mẫu minh họa hệ thống template trong Payload CMS: phần mở đầu, số liệu, checklist và lời kêu gọi hành động.",
    tag: "news",
    template: "caseStudy",
    publishedAt: new Date().toISOString(),
    layout: [
      {
        blockType: "lead",
        kicker: "Câu chuyện vận hành",
        heading: "Một bài viết CMS theo mẫu nội dung rõ ràng",
        body: "Biên tập viên có thể tạo bài từ các template lặp lại thay vì nhập toàn bộ nội dung vào một trường tin tức trống.",
      },
      {
        blockType: "statsGrid",
        items: [
          { value: "4", label: "Mẫu bài viết" },
          { value: "7", label: "Khối nội dung dùng lại" },
          { value: "1", label: "Quy trình CMS" },
        ],
      },
      {
        blockType: "checklist",
        heading: "Biên tập viên có thể kiểm soát",
        items: [{ text: "Chọn mẫu bài viết" }, { text: "Sắp xếp lại các khối nội dung" }, { text: "Xuất bản bản nháp khi sẵn sàng" }],
      },
      {
        blockType: "cta",
        heading: "Sẵn sàng cho nội dung thật",
        body: "Tạo user đầu tiên trong Payload admin, thêm bài Tin tức, đặt trạng thái Đã xuất bản và bài mẫu này sẽ tự biến mất.",
        label: "Mở trang quản trị",
        href: "/admin",
      },
    ],
  },
];

const publishedNewsWhere: Where = {
  and: [
    {
      status: {
        equals: "published",
      },
    },
    {
      or: [
        {
          tag: {
            equals: "news",
          },
        },
        {
          tag: {
            exists: false,
          },
        },
      ],
    },
  ],
};

const publishedActivityWhere: Where = {
  and: [
    {
      status: {
        equals: "published",
      },
    },
    {
      tag: {
        equals: "activity",
      },
    },
  ],
};

export async function getPublishedNews(): Promise<NewsPost[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "news",
      depth: 2,
      limit: 24,
      sort: "-publishedAt",
      where: publishedNewsWhere,
    });

    return result.docs.length > 0 ? (result.docs as NewsPost[]) : fallbackNews;
  } catch (error) {
    console.warn("Payload news query failed, using fallback content.", error);
    return fallbackNews;
  }
}

export async function getPublishedActivities(): Promise<NewsPost[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "news",
      depth: 2,
      limit: 24,
      sort: "-publishedAt",
      where: publishedActivityWhere,
    });

    return result.docs as NewsPost[];
  } catch (error) {
    console.warn("Payload activity query failed.", error);
    return [];
  }
}

// Draft-aware lookup for Live Preview: returns the latest version (incl. drafts)
// regardless of publish status, so editors see unsaved/unpublished edits.
export async function getNewsDraftBySlug(slug: string): Promise<NewsPost | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "news",
      depth: 2,
      limit: 1,
      draft: true,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            or: [
              {
                tag: {
                  equals: "news",
                },
              },
              {
                tag: {
                  exists: false,
                },
              },
            ],
          },
        ],
      },
    });

    return (result.docs[0] as NewsPost | undefined) || null;
  } catch (error) {
    console.warn("Payload news draft query failed.", error);
    return null;
  }
}

export async function getActivityDraftBySlug(slug: string): Promise<NewsPost | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "news",
      depth: 2,
      limit: 1,
      draft: true,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            tag: {
              equals: "activity",
            },
          },
        ],
      },
    });

    return (result.docs[0] as NewsPost | undefined) || null;
  } catch (error) {
    console.warn("Payload activity draft query failed.", error);
    return null;
  }
}

export async function getPublishedNewsBySlug(slug: string): Promise<NewsPost | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "news",
      depth: 2,
      limit: 1,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            or: [
              {
                tag: {
                  equals: "news",
                },
              },
              {
                tag: {
                  exists: false,
                },
              },
            ],
          },
          {
            status: {
              equals: "published",
            },
          },
        ],
      },
    });

    return (result.docs[0] as NewsPost | undefined) || fallbackNews.find((post) => post.slug === slug) || null;
  } catch (error) {
    console.warn("Payload news detail query failed, using fallback content.", error);
    return fallbackNews.find((post) => post.slug === slug) || null;
  }
}

export async function getPublishedActivityBySlug(slug: string): Promise<NewsPost | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "news",
      depth: 2,
      limit: 1,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            tag: {
              equals: "activity",
            },
          },
          {
            status: {
              equals: "published",
            },
          },
        ],
      },
    });

    return (result.docs[0] as NewsPost | undefined) || null;
  } catch (error) {
    console.warn("Payload activity detail query failed.", error);
    return null;
  }
}
