import { getPayloadClient } from "@/lib/payload";

export type NewsPost = {
  id?: string | number;
  title: string;
  slug: string;
  excerpt: string;
  template?: string;
  publishedAt?: string;
  heroImage?: unknown;
  layout?: NewsBlock[];
};

export type NewsBlock = {
  id?: string;
  blockType?: string;
  [key: string]: unknown;
};

export const fallbackNews: NewsPost[] = [
  {
    id: "sample-case-study",
    title: "Scaling global e-commerce operations from Vietnam",
    slug: "scaling-global-ecommerce-operations",
    excerpt:
      "A sample case-study post showing the new Payload template system: lead section, metrics, checklist, and CTA.",
    template: "caseStudy",
    publishedAt: new Date().toISOString(),
    layout: [
      {
        blockType: "lead",
        kicker: "Case Study",
        heading: "A CMS post that follows a real template",
        body: "Editors can now create posts from repeatable templates instead of free-writing into one empty news field.",
      },
      {
        blockType: "statsGrid",
        items: [
          { value: "4", label: "Post templates" },
          { value: "7", label: "Reusable content blocks" },
          { value: "1", label: "CMS workflow" },
        ],
      },
      {
        blockType: "checklist",
        heading: "What editors can control",
        items: [{ text: "Choose a template" }, { text: "Reorder content blocks" }, { text: "Publish drafts when ready" }],
      },
      {
        blockType: "cta",
        heading: "Ready for real content",
        body: "Create the first user in Payload admin, add a News post, set it to Published, and this sample disappears.",
        label: "Open admin",
        href: "/admin",
      },
    ],
  },
];

export async function getPublishedNews(): Promise<NewsPost[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "news",
      depth: 2,
      limit: 24,
      sort: "-publishedAt",
      where: {
        status: {
          equals: "published",
        },
      },
    });

    return result.docs.length > 0 ? (result.docs as NewsPost[]) : fallbackNews;
  } catch (error) {
    console.warn("Payload news query failed, using fallback content.", error);
    return fallbackNews;
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
        slug: {
          equals: slug,
        },
      },
    });

    return (result.docs[0] as NewsPost | undefined) || null;
  } catch (error) {
    console.warn("Payload news draft query failed.", error);
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
