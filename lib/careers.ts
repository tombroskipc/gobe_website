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
  status?: string;
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
    title: "Marketing Google Ads Toàn thời gian",
    slug: "marketing-google-ads",
    tag: "marketing",
    dateLabel: "08 Th12",
    department: "Marketing hiệu suất",
    employmentType: "Toàn thời gian",
    quantity: "01",
    excerpt: "Tối ưu chiến dịch Google Ads, đọc tín hiệu thị trường và scale sản phẩm e-commerce quốc tế.",
    larkUrl: "https://gobeasia.sg.larksuite.com/wiki/Buy4wgFxqixSBikVhyVlvrKagZb?fromScene=spaceOverview",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20MARKETING%20GOOGLE%20ADS%5D%20Ho%20va%20ten",
    description: "Vai trò dành cho người thích test nhanh, đo dữ liệu rõ ràng và tối ưu tăng trưởng theo hiệu suất.",
  },
  {
    id: "marketing-facebook-ads",
    title: "Marketing Facebook Ads Toàn thời gian",
    slug: "marketing-facebook-ads",
    tag: "marketing",
    dateLabel: "08 Th12",
    department: "Marketing hiệu suất",
    employmentType: "Toàn thời gian",
    quantity: "01",
    excerpt: "Triển khai, phân tích và scale chiến dịch Facebook Ads cho thị trường quốc tế.",
    larkUrl: "https://gobeasia.sg.larksuite.com/wiki/ATRMwsasqifZ6zk0wullRHpOgLb?fromScene=spaceOverview",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20MARKETING%20FACEBOOK%20ADS%5D%20Ho%20va%20ten",
    description: "Bạn sẽ phối hợp với creative và vận hành để tìm angle bán hàng, tối ưu funnel và cải thiện hiệu quả quảng cáo.",
  },
  {
    id: "creative-video",
    title: "Sáng tạo Video",
    slug: "creative-video",
    tag: "creative",
    dateLabel: "08 Th12",
    department: "Sáng tạo",
    employmentType: "Toàn thời gian",
    quantity: "01",
    excerpt: "Sản xuất video ngắn, visual angle và nội dung sáng tạo phục vụ chiến dịch e-commerce.",
    larkUrl: "https://gobe.asia/tuyen-dung-creative-video-full-time/",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20CREATIVE%20VIDEO%5D%20Ho%20va%20ten",
  },
  {
    id: "customer-service",
    title: "Chăm sóc khách hàng Toàn thời gian",
    slug: "customer-service",
    tag: "customerService",
    dateLabel: "05 Th1",
    department: "Chăm sóc khách hàng",
    employmentType: "Toàn thời gian",
    quantity: "01",
    excerpt: "Chăm sóc khách hàng, xử lý phản hồi và phối hợp vận hành để trải nghiệm mua hàng mượt mà.",
    larkUrl: "https://gobe.asia/tuyen-dung-customer-service-full-time/",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20CUSTOMER%20SERVICE%5D%20Ho%20va%20ten",
  },
  {
    id: "human-resource",
    title: "Nhân sự Toàn thời gian",
    slug: "human-resource",
    tag: "humanResource",
    dateLabel: "29 Th8",
    department: "Nhân sự",
    employmentType: "Toàn thời gian",
    quantity: "01",
    excerpt: "Tuyển dụng, phát triển con người và xây dựng văn hóa vận hành chủ động trong đội ngũ.",
    larkUrl: "https://gobe.asia/tuyen-dung-human-resource/",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20HUMAN%20RESOURCE%5D%20Ho%20va%20ten",
  },
  {
    id: "fulfillment-full-time",
    title: "Fulfillment Toàn thời gian",
    slug: "fulfillment-full-time",
    tag: "operations",
    dateLabel: "21 Th4",
    department: "Vận hành",
    employmentType: "Toàn thời gian",
    quantity: "02",
    excerpt: "Quản lý đơn hàng, điều phối supplier, logistics và theo dõi vận hành từ lúc nhận đơn đến khi giao thành công.",
    larkUrl: "https://gobe.asia/tuyen-dung-fulfillment-full-time-3/",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20FULFILLMENT%20FULL-TIME%5D%20Ho%20va%20ten",
    description:
      "GoBeyond đang tìm kiếm nhân viên Fulfillment tài năng và nhiệt huyết để gia nhập đội ngũ vận hành e-commerce toàn cầu.",
    responsibilities: [
      { text: "Quản lý toàn bộ quy trình xử lý và theo dõi đơn hàng từ lúc nhận đơn đến khi giao thành công." },
      { text: "Điều phối công việc giữa Customer Support, Supplier và Logistics để đảm bảo hàng hóa đúng kế hoạch." },
      { text: "Theo dõi chỉ số vận hành và đề xuất cải tiến liên tục." },
    ],
    requirements: [
      { text: "Có kinh nghiệm Fulfillment trong POD, Dropshipping hoặc E-commerce là lợi thế." },
      { text: "Tiếng Anh khá, có khả năng làm việc với đối tác và khách hàng nước ngoài." },
      { text: "Chủ động, trách nhiệm, nhanh nhẹn và xử lý vấn đề tốt." },
    ],
    benefits: [
      { text: "Thu nhập 8-12 triệu/tháng + bonus theo hiệu suất." },
      { text: "Review lương định kỳ, lương tháng 13 và các hoạt động nội bộ." },
      { text: "Môi trường startup trẻ trung, năng động và tập trung phát triển con người." },
    ],
    workingTime: "8:00-17:30, từ thứ 2 đến thứ 6, thứ 7 remote. Nghỉ trưa: 12:00-13:30.",
  },
  {
    id: "van-hanh-san-etsy-intern",
    title: "Thực tập Vận hành sàn Etsy",
    slug: "van-hanh-san-etsy-intern",
    tag: "internship",
    dateLabel: "21 Th4",
    department: "Vận hành marketplace",
    employmentType: "Thực tập",
    quantity: "01",
    excerpt: "Thực tập vận hành sàn Etsy, hỗ trợ listing, tracking và quy trình xử lý dữ liệu sản phẩm.",
    larkUrl: "https://gobe.asia/3250-2/",
    applyUrl: "mailto:tuyendung@gobe.asia?subject=%5BGOBEYOND%20-%20ETSY%20OPERATIONS%20INTERN%5D%20Ho%20va%20ten",
  },
];

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

    return result.docs as CareerItem[];
  } catch (error) {
    console.warn("Payload careers query failed, using fallback content.", error);
    return fallbackCareers;
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

    return (result.docs[0] as CareerItem | undefined) || null;
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

    return (result.docs[0] as CareerItem | undefined) || null;
  } catch (error) {
    console.warn("Payload career detail query failed, using fallback content.", error);
    return fallbackCareers.find((career) => career.slug === slug) || null;
  }
}
