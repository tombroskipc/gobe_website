import type { CollectionSlug } from "payload";
import { getPayloadClient } from "@/lib/payload";

const larkListingUrl = "https://gobeasia.sg.larksuite.com/wiki/XZQLwJFxCiYr0jkz7L0lj23egCf?fromScene=spaceOverview";

export type CareerTag =
  | "hiring"
  | "marketing"
  | "creative"
  | "operations"
  | "customerService"
  | "humanResource"
  | "internship";

export type CareerRichTextNode = {
  type?: string;
  text?: string;
  format?: number | string;
  tag?: string;
  children?: CareerRichTextNode[];
};

export type CareerRichText =
  | string
  | {
      root?: {
        children?: CareerRichTextNode[];
      };
    };

export type CareerItem = {
  id?: string | number;
  title: string;
  slug: string;
  displayOrder?: number | null;
  status?: string;
  team?: string;
  tag?: CareerTag | string;
  dateLabel?: string;
  department?: string;
  employmentType?: string;
  location?: string;
  quantity?: string;
  excerpt?: string;
  larkUrl?: string;
  applyUrl?: string;
  description?: string | CareerRichText;
  responsibilities?: { text?: CareerRichText }[];
  requirements?: { text?: CareerRichText }[];
  benefits?: { text?: CareerRichText }[];
  workingTime?: string;
  publishedAt?: string;
};

export const careerListingSourceUrl = larkListingUrl;

export const fallbackCareers: CareerItem[] = [
  {
    id: "marketing-google-ads",
    title: "Marketing Google Ads Full-time",
    slug: "marketing-google-ads",
    tag: "marketing",
    dateLabel: "Dec 08",
    department: "Performance Marketing",
    employmentType: "Full-time",
    quantity: "01",
    excerpt: "Optimize Google Ads campaigns, read market signals, and scale international e-commerce products.",
    larkUrl: "https://gobeasia.sg.larksuite.com/wiki/Buy4wgFxqixSBikVhyVlvrKagZb?fromScene=spaceOverview",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGoBeyond%20-%20MARKETING%20GOOGLE%20ADS%5D%20Full%20name",
    description: "A role for people who enjoy fast testing, clear measurement, and performance-led growth optimization.",
  },
  {
    id: "marketing-facebook-ads",
    title: "Marketing Facebook Ads Full-time",
    slug: "marketing-facebook-ads",
    tag: "marketing",
    dateLabel: "Dec 08",
    department: "Performance Marketing",
    employmentType: "Full-time",
    quantity: "01",
    excerpt: "Launch, analyze, and scale Facebook Ads campaigns for international markets.",
    larkUrl: "https://gobeasia.sg.larksuite.com/wiki/ATRMwsasqifZ6zk0wullRHpOgLb?fromScene=spaceOverview",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGoBeyond%20-%20MARKETING%20FACEBOOK%20ADS%5D%20Full%20name",
    description: "You will work with creative and operations teams to find sales angles, optimize funnels, and improve ad performance.",
  },
  {
    id: "creative-video",
    title: "Creative Video",
    slug: "creative-video",
    tag: "creative",
    dateLabel: "Dec 08",
    department: "Creative",
    employmentType: "Full-time",
    quantity: "01",
    excerpt: "Produce short videos, visual angles, and creative content for e-commerce campaigns.",
    larkUrl: "https://gobe.asia/tuyen-dung-creative-video-full-time/",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGoBeyond%20-%20CREATIVE%20VIDEO%5D%20Full%20name",
  },
  {
    id: "customer-service",
    title: "Customer Service Full-time",
    slug: "customer-service",
    tag: "customerService",
    dateLabel: "Jan 05",
    department: "Customer Service",
    employmentType: "Full-time",
    quantity: "01",
    excerpt: "Support customers, handle feedback, and coordinate with operations for a smooth buying experience.",
    larkUrl: "https://gobe.asia/tuyen-dung-customer-service-full-time/",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGoBeyond%20-%20CUSTOMER%20SERVICE%5D%20Full%20name",
  },
  {
    id: "human-resource",
    title: "Human Resource Full-time",
    slug: "human-resource",
    tag: "humanResource",
    dateLabel: "Aug 29",
    department: "Human Resource",
    employmentType: "Full-time",
    quantity: "01",
    excerpt: "Recruit, develop people, and build a proactive operating culture within the team.",
    larkUrl: "https://gobe.asia/tuyen-dung-human-resource/",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGoBeyond%20-%20HUMAN%20RESOURCE%5D%20Full%20name",
  },
  {
    id: "fulfillment-full-time",
    title: "Fulfillment Full-time",
    slug: "fulfillment-full-time",
    tag: "operations",
    dateLabel: "Apr 21",
    department: "Operations",
    employmentType: "Full-time",
    quantity: "02",
    excerpt: "Manage orders, coordinate suppliers and logistics, and monitor operations from order receipt to delivery.",
    larkUrl: "https://gobe.asia/tuyen-dung-fulfillment-full-time-3/",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGoBeyond%20-%20FULFILLMENT%20FULL-TIME%5D%20Full%20name",
    description:
      "GoBeyond is looking for a talented and passionate Fulfillment teammate to join our global e-commerce operations team.",
    responsibilities: [
      { text: "Manage the full order processing and tracking flow from order receipt to successful delivery." },
      { text: "Coordinate work between Customer Support, Suppliers, and Logistics to keep goods on schedule." },
      { text: "Track operational metrics and propose continuous improvements." },
    ],
    requirements: [
      { text: "Fulfillment experience in POD, dropshipping, or e-commerce is a plus." },
      { text: "Good English skills and ability to work with international partners and customers." },
      { text: "Proactive, responsible, agile, and strong at problem solving." },
    ],
    benefits: [
      { text: "Compensation of VND 8-12M/month plus performance bonus." },
      { text: "Regular salary reviews, 13th-month salary, and internal activities." },
      { text: "A young, dynamic startup environment focused on people development." },
    ],
    workingTime: "8:00 - 17:30, Monday to Friday and Saturday morning remote. Lunch break: 12:00 - 13:30",
  },
  {
    id: "van-hanh-san-etsy-intern",
    title: "Etsy Marketplace Operations Intern",
    slug: "van-hanh-san-etsy-intern",
    tag: "internship",
    dateLabel: "Apr 21",
    department: "Marketplace Operations",
    employmentType: "Internship",
    quantity: "01",
    excerpt: "Marketplace operations internship supporting Etsy listings, tracking, and product data workflows.",
    larkUrl: "https://gobe.asia/3250-2/",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGoBeyond%20-%20ETSY%20OPERATIONS%20INTERN%5D%20Full%20name",
  },
];

const fallbackCareersBySlug = new Map(fallbackCareers.map((career) => [career.slug, career]));
const vietnameseCopyPattern = /[\u00C0-\u1EF9]/;
const legacyCareerPhrasePattern = new RegExp(
  [
    "\\bdu" + "ong\\b",
    "\\btp\\.?\\s*ho chi minh\\b",
    "\\btu\\s+th" + "u\\b",
    "\\bden\\s+th" + "u\\b",
    "\\bnghi\\s+tr" + "ua\\b",
    "\\bhanh\\s+ch" + "inh\\b",
    "\\bnhan\\s+s" + "u\\b",
    "\\btruyen\\s+th" + "ong\\b",
    "\\bung\\s+tuy" + "en\\b",
    "\\btuyen\\s+d" + "ung\\b",
  ].join("|"),
  "i",
);
const legacyCareerTitlePattern = new RegExp(
  [
    "h(?:a|\\u00e0)nh ch(?:i|\\u00ed)nh",
    "nh(?:a|\\u00e2)n s(?:u|\\u1ef1)",
    "truy(?:e|\\u1ec1)n th(?:o|\\u00f4)ng",
  ].join("|"),
  "i",
);

function hasLegacyCareerCopy(value: unknown) {
  try {
    const serialized = JSON.stringify(value);
    return vietnameseCopyPattern.test(serialized) || legacyCareerPhrasePattern.test(serialized);
  } catch {
    return false;
  }
}

function normalizeLegacyCareerLocation(value?: string) {
  if (!value) {
    return value;
  }

  return value
    .replace(/\bDuong\b/gi, "Street")
    .replace(/\bTP\.?\s*Ho Chi Minh\b/gi, "Ho Chi Minh City")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeLegacyCareerWorkingTime(value?: string) {
  if (!value) {
    return value;
  }

  if (legacyCareerPhrasePattern.test(value)) {
    return "8:00 - 17:30, Monday to Friday and Saturday remote. Lunch break: 12:00 - 13:30.";
  }

  return value;
}

function normalizeLegacyCareerTitle(value?: string) {
  if (!value) {
    return value;
  }

  if (legacyCareerTitlePattern.test(value)) {
    return "Human Resource and Internal Communications Full-time";
  }

  return value;
}

function normalizeLegacyCareer(career: CareerItem): CareerItem {
  const fallback = fallbackCareersBySlug.get(career.slug);
  const hasLegacyCopy = hasLegacyCareerCopy({
    benefits: career.benefits,
    department: career.department,
    description: career.description,
    excerpt: career.excerpt,
    location: career.location,
    requirements: career.requirements,
    responsibilities: career.responsibilities,
    title: career.title,
    workingTime: career.workingTime,
  });

  const normalized: CareerItem = {
    ...career,
    location: normalizeLegacyCareerLocation(career.location),
    title: normalizeLegacyCareerTitle(career.title) || career.title,
    workingTime: normalizeLegacyCareerWorkingTime(career.workingTime),
  };

  if (!hasLegacyCopy || !fallback) {
    return normalized;
  }

  return {
    ...normalized,
    benefits: fallback.benefits || normalized.benefits,
    department: fallback.department || normalized.department,
    description: fallback.description || normalized.description,
    employmentType: fallback.employmentType || normalized.employmentType,
    excerpt: fallback.excerpt || normalized.excerpt,
    requirements: fallback.requirements || normalized.requirements,
    responsibilities: fallback.responsibilities || normalized.responsibilities,
    tag: fallback.tag || normalized.tag,
    title: fallback.title || normalized.title,
    workingTime: fallback.workingTime || normalized.workingTime,
  };
}

function normalizeLegacyCareers(careers: CareerItem[]) {
  return careers.map(normalizeLegacyCareer);
}

function sortByDisplayOrder<T extends { displayOrder?: null | number; publishedAt?: string; title: string }>(items: T[]) {
  return [...items].sort((a, b) => {
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

export async function getPublishedCareers(): Promise<CareerItem[]> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "careers" as CollectionSlug,
      depth: 1,
      limit: 50,
      sort: "-publishedAt",
      where: {
        _status: {
          equals: "published",
        },
      },
    });

    return sortByDisplayOrder(normalizeLegacyCareers(result.docs as CareerItem[]));
  } catch (error) {
    console.warn("Payload careers query failed, using fallback content.", error);
    return sortByDisplayOrder(fallbackCareers);
  }
}

export async function getCareerDraftBySlug(slug: string): Promise<CareerItem | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "careers" as CollectionSlug,
      depth: 1,
      limit: 1,
      draft: true,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    const career = (result.docs[0] as CareerItem | undefined) || null;
    return career ? normalizeLegacyCareer(career) : null;
  } catch (error) {
    console.warn("Payload career draft query failed.", error);
    return null;
  }
}

export async function getPublishedCareerBySlug(slug: string): Promise<CareerItem | null> {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "careers" as CollectionSlug,
      depth: 1,
      limit: 1,
      where: {
        and: [
          {
            slug: {
              equals: slug,
            },
          },
          {
            _status: {
              equals: "published",
            },
          },
        ],
      },
    });

    const career = (result.docs[0] as CareerItem | undefined) || null;
    return career ? normalizeLegacyCareer(career) : null;
  } catch (error) {
    console.warn("Payload career detail query failed, using fallback content.", error);
    return fallbackCareers.find((career) => career.slug === slug) || null;
  }
}
