import type { Where } from "payload";
import { getPayloadClient } from "@/lib/payload";

export type NewsPost = {
  id?: string | number;
  title: string;
  slug: string;
  displayOrder?: number | null;
  excerpt?: string;
  team?: string;
  tag?: NewsTag | string;
  template?: string;
  publishedAt?: string;
  heroImage?: unknown;
  content?: NewsRichText;
  layout?: NewsBlock[];
  sourceUrl?: string;
};

export type NewsTag = "news" | "activity";

export type NewsRichTextNode = {
  fields?: {
    caption?: string;
  } | null;
  format?: number | string;
  alt?: string;
  children?: NewsRichTextNode[];
  height?: number;
  relationTo?: string;
  src?: string;
  tag?: string;
  text?: string;
  title?: string;
  type?: string;
  value?: unknown;
  width?: number;
};

export type NewsRichText =
  | string
  | {
      root?: {
        children?: NewsRichTextNode[];
      };
    };

export type NewsBlock = {
  id?: string;
  blockType?: string;
  [key: string]: unknown;
};

function legacyPost({
  id,
  title,
  slug,
  excerpt,
  tag,
  publishedAt,
  sourceUrl,
  kicker,
  body,
}: {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  tag: NewsTag;
  publishedAt: string;
  sourceUrl: string;
  kicker: string;
  body: string;
}): NewsPost {
  return {
    id,
    title,
    slug,
    excerpt,
    tag,
    template: tag === "activity" ? "eventRecap" : "newsUpdate",
    publishedAt,
    sourceUrl,
    layout: [
      {
        blockType: "lead",
        kicker,
        heading: title,
        body: excerpt,
      },
      {
        blockType: "bodyCopy",
        content: body,
      },
      {
        blockType: "cta",
        heading: tag === "activity" ? "Explore more GoBeyond activities" : "Explore more GoBeyond updates",
        body: "This content was seeded from the legacy website and can be replaced by new posts published by the editorial team in Payload CMS.",
        label: tag === "activity" ? "View activities" : "View news",
        href: tag === "activity" ? "/activities" : "/news",
      },
    ],
  };
}

export const fallbackNews: NewsPost[] = [
  legacyPost({
    id: "legacy-news-li-xi-2026",
    title: "2026 New Year lucky money - A bright start with GoBeyond",
    slug: "li-xi-khai-xuan-2026-khoi-dau-ruc-ro-cung-go-beyond",
    excerpt: "GoBeyond opened the new year with excitement, warm wishes, and positive energy for the whole team.",
    tag: "news",
    publishedAt: "2026-02-24T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/li-xi-khai-xuan-2026-khoi-dau-ruc-ro-cung-go-beyond/",
    kicker: "New year 2026",
    body: "The start of the year at GoBeyond is always a moment for the team to recharge, exchange good wishes, and begin a new chapter with a proactive mindset.\n\nBeyond the lucky-money moment, the activity also reminded everyone of a shared goal: keep positive work momentum, break through in every campaign, and create more milestones together.",
  }),
  legacyPost({
    id: "legacy-news-100k",
    title: "The GoBeyond team officially reached $100K after 3 months",
    slug: "doi-ngu-beyond-chinh-thuc-can-moc-100k-sau-3-thang",
    excerpt: "A memorable growth milestone recognizing the team's effort in scaling global e-commerce.",
    tag: "news",
    publishedAt: "2025-11-27T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/doi-ngu-beyond-chinh-thuc-can-moc-100k-sau-3-thang/",
    kicker: "Growth milestone",
    body: "The $100K milestone after three months came from repeated testing, optimization, and close coordination between creative, ads, fulfillment, and operations teams.\n\nFor GoBeyond, the number is more than a business result. It is a signal that the operating system is maturing and that the team can move faster together in international markets.",
  }),
  legacyPost({
    id: "legacy-news-brainstorm",
    title: 'Brainstorm - Where ideas catch fire',
    slug: "brainstorm-noi-nhung-y-tuong-bung-chay",
    excerpt: "A space for the GoBeyond team to test new perspectives, share insights, and turn ideas into concrete directions.",
    tag: "news",
    publishedAt: "2025-06-21T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/brainstorm-noi-nhung-y-tuong-bung-chay/",
    kicker: "Inside GoBeyond",
    body: "Brainstorming sessions help the team revisit problems from multiple angles: market, customer, concept, content, and operations.\n\nThe most important spirit is the willingness to propose ideas, challenge them, and test them. From there, campaigns gain new material and move faster.",
  }),
  legacyPost({
    id: "legacy-news-30-4-countdown",
    title: "Countdown to April 30 - GoBeyond prepares for meaningful moments",
    slug: "dem-nguoc-den-dai-le-30-4-gobeyond-san-sang-cho-nhung-khoanh-khac-y-nghia",
    excerpt: "GoBeyond prepared for April 30 with gratitude, pride, and internal connection.",
    tag: "news",
    publishedAt: "2025-04-29T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/dem-nguoc-den-dai-le-30-4-gobeyond-san-sang-cho-nhung-khoanh-khac-y-nghia/",
    kicker: "April 30 holiday",
    body: "April 30 is a moment for the team to reflect on perseverance, gratitude, and the spirit of moving forward together.\n\nThrough internal communication activities, GoBeyond wanted to preserve meaningful moments and spread positive energy across the team.",
  }),
  legacyPost({
    id: "legacy-news-warrior",
    title: "An unstoppable challenge among GoBeyond teammates",
    slug: "cuoc-chien-bat-bai-giua-nhung-chien-binh-gobe-ers",
    excerpt: "An internal story about healthy competition, determination, and GoBeyond's fighting energy.",
    tag: "news",
    publishedAt: "2025-03-29T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/cuoc-chien-bat-bai-giua-nhung-chien-binh-gobe-ers/",
    kicker: "Team energy",
    body: "Internal challenges are one way GoBeyond creates motivation, helps each member see the goal clearly, and raises the team's working tempo.\n\nThe fighting spirit here is not a slogan. It is how each person follows through, supports teammates, and keeps commitments to the end.",
  }),
  legacyPost({
    id: "legacy-news-behind-pod",
    title: "Behind the POD: Inside the 2024 Black Friday season",
    slug: "behind-the-pod-hau-truong-sau-mua-black-friday-cuoi-nam-2024",
    excerpt: "A look behind the high season for POD, where every operating step needs speed, accuracy, and tight coordination.",
    tag: "news",
    publishedAt: "2025-03-18T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/behind-the-pod-hau-truong-sau-mua-black-friday-cuoi-nam-2024/",
    kicker: "Behind the POD",
    body: "Black Friday is always a major test for e-commerce teams. From creative and ads to fulfillment, every step must move quickly while keeping quality stable.\n\nThe behind-the-scenes story shows that the strength of the system comes from coordination: processing data, responding to situations, and continuously optimizing during peak season.",
  }),
];

export const fallbackActivities: NewsPost[] = [
  legacyPost({
    id: "legacy-activity-kickoff-2026",
    title: 'Kick Off 2026: GoBeyond turns on the switch for a breakthrough year',
    slug: "kick-off-2026-gobe-ers-bat-cong-tac-quyet-tam-pha-dao-nam-moi",
    excerpt: "The 2026 kick-off opened the year with a breakthrough spirit, clear goals, and a new growth chapter.",
    tag: "activity",
    publishedAt: "2026-03-06T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/kick-off-2026-gobe-ers-bat-cong-tac-quyet-tam-pha-dao-nam-moi/",
    kicker: "Kick off 2026",
    body: "Kick-off is the moment for the whole team to review goals, align direction, and recharge for the new year.\n\nAt GoBeyond, every plan must connect to concrete action: accelerate campaigns, improve operations, and keep a proactive culture in every team.",
  }),
  legacyPost({
    id: "legacy-activity-xuan-binh-ngo",
    title: "Spring 2026 | GoBeyond shares gifts and gratitude",
    slug: "xuan-binh-ngo-2026-go-beyond-trao-qua-gui-tron-tri-an",
    excerpt: "The spring gift activity was a thank-you for the GoBeyond team's steady contributions.",
    tag: "activity",
    publishedAt: "2026-02-11T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/xuan-binh-ngo-2026-go-beyond-trao-qua-gui-tron-tri-an/",
    kicker: "Spring 2026",
    body: "Spring gifts were GoBeyond's way of thanking members who moved through a challenging year together.\n\nIt was a small activity, but it carried an important message: everyone is part of the shared journey.",
  }),
  legacyPost({
    id: "legacy-activity-yep-2025",
    title: "YEP 2025 - Closing a proud year and opening a breakthrough chapter",
    slug: "yep-2025-khep-nam-tu-hao-mo-chang-but-pha-cung-go-beyond",
    excerpt: "Year End Party 2025 captured memorable milestones and opened the next growth chapter for GoBeyond.",
    tag: "activity",
    publishedAt: "2026-02-09T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/yep-2025-khep-nam-tu-hao-mo-chang-but-pha-cung-go-beyond/",
    kicker: "Year End Party",
    body: "YEP is a chance for the whole team to look back at the journey: the tests, the growth sprints, and the operating lessons.\n\nThe year-end moments helped GoBeyond strengthen team spirit before entering a new chapter with bigger ambition.",
  }),
  legacyPost({
    id: "legacy-activity-race-23m",
    title: "Race to $2.3M - Breaking year-end targets with GoBeyond",
    slug: "race-to-2-3m-pha-moc-cuoi-nam-cung-go-beyond",
    excerpt: "An internal campaign that pushed year-end momentum around growth goals and operational coordination.",
    tag: "activity",
    publishedAt: "2025-11-27T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/race-to-2-3m-pha-moc-cuoi-nam-cung-go-beyond/",
    kicker: "Growth race",
    body: "Year-end is the acceleration period for e-commerce. Race to $2.3M helped the team focus on one shared goal and maintain strong execution momentum.\n\nEach team contributed a part: performance generated growth signals, creative produced sales material, and fulfillment kept the back end stable.",
  }),
  legacyPost({
    id: "legacy-activity-kickoff-q2",
    title: "GoBeyond Kick Off Q2/2025 - One trip, countless memories",
    slug: "go-beyond-kick-off-q2-2025-mot-chuyen-di-ngan-ky-niem",
    excerpt: "The Q2/2025 kick-off trip created stronger internal connection and renewed energy for the new quarter.",
    tag: "activity",
    publishedAt: "2025-08-11T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/go-beyond-kick-off-q2-2025-mot-chuyen-di-ngan-ky-niem/",
    kicker: "Kick off Q2",
    body: "A shared trip gave team members more room to connect outside daily work.\n\nFrom joyful moments to group activities, team spirit was refreshed for the next quarter.",
  }),
  legacyPost({
    id: "legacy-activity-100k-orders",
    title: "GoBeyond just reached 100,000 orders",
    slug: "go-beyond-vua-chot-100-000-don",
    excerpt: "The 100,000-order milestone recognized the operating capability and coordination of the whole GoBeyond system.",
    tag: "activity",
    publishedAt: "2025-06-20T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/go-beyond-vua-chot-100-000-don/",
    kicker: "100,000 orders",
    body: "100,000 orders came from many small steps done right: selecting products, building concepts, running ads, processing orders, and supporting customers.\n\nThis milestone gave GoBeyond more confidence in the operating system it is building.",
  }),
  legacyPost({
    id: "legacy-activity-30-4",
    title: "April 30 at GoBeyond - remembrance, gratitude, and pride",
    slug: "huong-ung-dai-le-30-4-go-beyond-tuong-nho-tri-an-va-tu-hao",
    excerpt: "An internal April 30 activity that shared a spirit of remembrance, gratitude, and national pride.",
    tag: "activity",
    publishedAt: "2025-04-30T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/huong-ung-dai-le-30-4-go-beyond-tuong-nho-tri-an-va-tu-hao/",
    kicker: "April 30",
    body: "April 30 is an opportunity for GoBeyond to revisit the value of gratitude and pride together.\n\nInternal communication activities helped connect company culture with meaningful national milestones.",
  }),
  legacyPost({
    id: "legacy-activity-83",
    title: "GoBeyond celebrates International Women's Day",
    slug: "go-beyond-chuc-mung-ngay-quoc-te-phu-nu-8-3",
    excerpt: "A warm activity for women team members, sharing wishes and appreciation from GoBeyond.",
    tag: "activity",
    publishedAt: "2025-03-08T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/go-beyond-chuc-mung-ngay-quoc-te-phu-nu-8-3/",
    kicker: "8/3",
    body: "International Women's Day is a moment for GoBeyond to thank women team members for their contributions.\n\nSmall moments on this special day help make the company culture warmer and more caring.",
  }),
];

const legacyFallbackPosts = [...fallbackNews, ...fallbackActivities];
const legacyFallbackBySlug = new Map(legacyFallbackPosts.map((post) => [post.slug, post]));
const legacySlugAliases = new Map([
  [
    "kick-off-2026-gobe-ers-bat-cong-tac-quyet-tam-pha-ao-nam-moi",
    "kick-off-2026-gobe-ers-bat-cong-tac-quyet-tam-pha-dao-nam-moi",
  ],
]);
const vietnameseCopyPattern = /[\u00C0-\u1EF9]/;

function hasVietnameseCopy(value: unknown) {
  try {
    return vietnameseCopyPattern.test(JSON.stringify(value));
  } catch {
    return false;
  }
}

function getLegacyFallbackPost(slug: string) {
  return legacyFallbackBySlug.get(slug) || legacyFallbackBySlug.get(legacySlugAliases.get(slug) || "");
}

function normalizeLegacyPost(post: NewsPost): NewsPost {
  const fallback = getLegacyFallbackPost(post.slug);

  if (!fallback || !hasVietnameseCopy({
    content: post.content,
    excerpt: post.excerpt,
    layout: post.layout,
    title: post.title,
  })) {
    return post;
  }

  return {
    ...post,
    content: fallback.content,
    excerpt: fallback.excerpt,
    layout: fallback.layout,
    sourceUrl: post.sourceUrl || fallback.sourceUrl,
    tag: post.tag || fallback.tag,
    template: post.template || fallback.template,
    title: fallback.title,
  };
}

function normalizeLegacyPosts(posts: NewsPost[]) {
  return posts.map(normalizeLegacyPost);
}

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

function sortByDisplayOrder<T extends { displayOrder?: null | number; publishedAt?: string; title: string }>(posts: T[]) {
  return [...posts].sort((a, b) => {
    const aHasOrder = typeof a.displayOrder === "number";
    const bHasOrder = typeof b.displayOrder === "number";

    if (aHasOrder || bHasOrder) {
      if (!aHasOrder) {
        return 1;
      }

      if (!bHasOrder) {
        return -1;
      }

      const aOrder = a.displayOrder as number;
      const bOrder = b.displayOrder as number;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }
    }

    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;

    if (aTime !== bTime) {
      return bTime - aTime;
    }

    return a.title.localeCompare(b.title, "en", { sensitivity: "base" });
  });
}

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

    return sortByDisplayOrder(normalizeLegacyPosts(result.docs as NewsPost[]));
  } catch (error) {
    console.warn("Payload news query failed, using fallback content.", error);
    return sortByDisplayOrder(fallbackNews);
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

    return sortByDisplayOrder(normalizeLegacyPosts(result.docs as NewsPost[]));
  } catch (error) {
    console.warn("Payload activity query failed, using fallback content.", error);
    return sortByDisplayOrder(fallbackActivities);
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

    const post = (result.docs[0] as NewsPost | undefined) || null;
    return post ? normalizeLegacyPost(post) : null;
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

    const post = (result.docs[0] as NewsPost | undefined) || null;
    return post ? normalizeLegacyPost(post) : null;
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

    const post = (result.docs[0] as NewsPost | undefined) || null;
    return post ? normalizeLegacyPost(post) : null;
  } catch (error) {
    console.warn("Payload news detail query failed, using fallback content.", error);
    const fallback = getLegacyFallbackPost(slug);
    return fallback?.tag === "news" ? fallback : null;
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

    const post = (result.docs[0] as NewsPost | undefined) || null;
    return post ? normalizeLegacyPost(post) : null;
  } catch (error) {
    console.warn("Payload activity detail query failed, using fallback content.", error);
    const fallback = getLegacyFallbackPost(slug);
    return fallback?.tag === "activity" ? fallback : null;
  }
}
