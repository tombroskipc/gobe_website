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
  sourceUrl?: string;
};

export type NewsTag = "news" | "activity";

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
  excerpt: string;
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
        heading: tag === "activity" ? "Theo dõi thêm hoạt động của GoBeyond" : "Theo dõi thêm cập nhật của GoBeyond",
        body: "Các nội dung này được seed từ website cũ và có thể thay thế bằng bài viết mới trong Payload CMS khi team biên tập xuất bản.",
        label: tag === "activity" ? "Xem hoạt động" : "Xem tin tức",
        href: tag === "activity" ? "/hoat-dong" : "/tin-tuc",
      },
    ],
  };
}

export const fallbackNews: NewsPost[] = [
  legacyPost({
    id: "legacy-news-li-xi-2026",
    title: "Lì xì khai xuân 2026 - Khởi đầu rực rỡ cùng Go Beyond",
    slug: "li-xi-khai-xuan-2026-khoi-dau-ruc-ro-cung-go-beyond",
    excerpt: "GoBeyond mở đầu năm mới bằng tinh thần hứng khởi, lời chúc may mắn và năng lượng tích cực dành cho toàn đội ngũ.",
    tag: "news",
    publishedAt: "2026-02-24T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/li-xi-khai-xuan-2026-khoi-dau-ruc-ro-cung-go-beyond/",
    kicker: "Khai xuân 2026",
    body: "Không khí đầu năm tại GoBeyond luôn là thời điểm để cả team nạp lại năng lượng, gửi nhau lời chúc và bắt đầu một chặng mới với tinh thần chủ động.\n\nBên cạnh phần lì xì khai xuân, hoạt động còn là lời nhắc về mục tiêu chung: giữ nhịp làm việc tích cực, bứt phá trong từng chiến dịch và cùng nhau tạo thêm nhiều dấu mốc mới.",
  }),
  legacyPost({
    id: "legacy-news-100k",
    title: "Đội ngũ Go Beyond chính thức cán mốc $100K sau 3 tháng",
    slug: "doi-ngu-beyond-chinh-thuc-can-moc-100k-sau-3-thang",
    excerpt: "Một cột mốc tăng trưởng đáng nhớ, ghi nhận nỗ lực của đội ngũ trong hành trình scale thương mại điện tử toàn cầu.",
    tag: "news",
    publishedAt: "2025-11-27T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/doi-ngu-beyond-chinh-thuc-can-moc-100k-sau-3-thang/",
    kicker: "Growth milestone",
    body: "Cột mốc $100K sau 3 tháng là kết quả của nhiều vòng thử nghiệm, tối ưu và phối hợp liên tục giữa các team creative, ads, fulfillment và operations.\n\nVới GoBeyond, con số không chỉ là thành tích kinh doanh. Đó còn là tín hiệu cho thấy hệ thống vận hành đang trưởng thành và đội ngũ có thể cùng nhau đi nhanh hơn trên thị trường quốc tế.",
  }),
  legacyPost({
    id: "legacy-news-brainstorm",
    title: 'Brainstorm - Nơi những ý tưởng "bùng cháy"',
    slug: "brainstorm-noi-nhung-y-tuong-bung-chay",
    excerpt: "Không gian để Gobe-ers cùng thử nghiệm góc nhìn mới, chia sẻ insight và biến ý tưởng thành hướng triển khai cụ thể.",
    tag: "news",
    publishedAt: "2025-06-21T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/brainstorm-noi-nhung-y-tuong-bung-chay/",
    kicker: "Inside GoBeyond",
    body: "Những buổi brainstorm giúp team nhìn lại vấn đề từ nhiều hướng: thị trường, khách hàng, concept, nội dung và cách vận hành.\n\nTinh thần quan trọng nhất là dám đưa ra ý tưởng, dám phản biện và dám thử. Từ đó, các chiến dịch có thêm chất liệu mới để tiến nhanh hơn.",
  }),
  legacyPost({
    id: "legacy-news-30-4-countdown",
    title: "Đếm ngược đến đại lễ 30/4 - GoBeyond sẵn sàng cho những khoảnh khắc ý nghĩa",
    slug: "dem-nguoc-den-dai-le-30-4-gobeyond-san-sang-cho-nhung-khoanh-khac-y-nghia",
    excerpt: "GoBeyond chuẩn bị cho dịp lễ 30/4 bằng tinh thần tri ân, tự hào và gắn kết nội bộ.",
    tag: "news",
    publishedAt: "2025-04-29T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/dem-nguoc-den-dai-le-30-4-gobeyond-san-sang-cho-nhung-khoanh-khac-y-nghia/",
    kicker: "Dịp lễ 30/4",
    body: "Dịp lễ 30/4 là thời điểm để đội ngũ cùng nhìn lại giá trị của sự bền bỉ, lòng biết ơn và tinh thần cùng nhau tiến lên.\n\nThông qua các hoạt động truyền thông nội bộ, GoBeyond muốn giữ lại những khoảnh khắc ý nghĩa và lan tỏa năng lượng tích cực tới toàn team.",
  }),
  legacyPost({
    id: "legacy-news-warrior",
    title: "Cuộc chiến bất bại giữa những chiến binh Gobe-ers",
    slug: "cuoc-chien-bat-bai-giua-nhung-chien-binh-gobe-ers",
    excerpt: "Một câu chuyện nội bộ về tinh thần thi đua, sự quyết liệt và năng lượng chiến đấu của Gobe-ers.",
    tag: "news",
    publishedAt: "2025-03-29T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/cuoc-chien-bat-bai-giua-nhung-chien-binh-gobe-ers/",
    kicker: "Team energy",
    body: "Những thử thách nội bộ là cách GoBeyond tạo thêm động lực, giúp từng thành viên nhìn rõ mục tiêu và cùng kéo nhịp làm việc lên cao hơn.\n\nTinh thần chiến binh ở đây không nằm ở khẩu hiệu, mà nằm ở cách mỗi người theo sát công việc, hỗ trợ đồng đội và giữ cam kết đến cuối cùng.",
  }),
  legacyPost({
    id: "legacy-news-behind-pod",
    title: "Behind the POD: Hậu trường sau mùa Black Friday cuối năm 2024",
    slug: "behind-the-pod-hau-truong-sau-mua-black-friday-cuoi-nam-2024",
    excerpt: "Nhìn lại hậu trường mùa cao điểm POD, nơi từng bước vận hành đều cần tốc độ, độ chính xác và phối hợp chặt chẽ.",
    tag: "news",
    publishedAt: "2025-03-18T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/behind-the-pod-hau-truong-sau-mua-black-friday-cuoi-nam-2024/",
    kicker: "Behind the POD",
    body: "Black Friday luôn là bài test lớn với các team thương mại điện tử. Từ creative, ads đến fulfillment, mỗi khâu đều phải vận hành nhanh và giữ chất lượng ổn định.\n\nCâu chuyện hậu trường cho thấy sức mạnh của hệ thống nằm ở khả năng phối hợp: xử lý dữ liệu, phản hồi tình huống và tối ưu liên tục trong mùa cao điểm.",
  }),
];

export const fallbackActivities: NewsPost[] = [
  legacyPost({
    id: "legacy-activity-kickoff-2026",
    title: 'Kick Off 2026: Gobe-ers "bật công tắc", quyết tâm phá đảo năm mới',
    slug: "kick-off-2026-gobe-ers-bat-cong-tac-quyet-tam-pha-dao-nam-moi",
    excerpt: "Buổi kick-off mở đầu năm 2026 với tinh thần bứt phá, đặt mục tiêu rõ ràng và khởi động chặng tăng trưởng mới.",
    tag: "activity",
    publishedAt: "2026-03-06T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/kick-off-2026-gobe-ers-bat-cong-tac-quyet-tam-pha-dao-nam-moi/",
    kicker: "Kick off 2026",
    body: "Kick-off là thời điểm toàn đội cùng nhìn lại mục tiêu, thống nhất hướng đi và nạp năng lượng cho một năm mới.\n\nVới GoBeyond, mỗi kế hoạch đều cần gắn với hành động cụ thể: tăng tốc chiến dịch, cải thiện vận hành và giữ văn hóa chủ động trong từng team.",
  }),
  legacyPost({
    id: "legacy-activity-xuan-binh-ngo",
    title: "Xuân Bính Ngọ 2026 | Go Beyond trao quà, gửi trọn tri ân",
    slug: "xuan-binh-ngo-2026-go-beyond-trao-qua-gui-tron-tri-an",
    excerpt: "Hoạt động trao quà đầu xuân như lời cảm ơn gửi tới những đóng góp bền bỉ của đội ngũ GoBeyond.",
    tag: "activity",
    publishedAt: "2026-02-11T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/xuan-binh-ngo-2026-go-beyond-trao-qua-gui-tron-tri-an/",
    kicker: "Xuân 2026",
    body: "Những món quà đầu xuân là cách GoBeyond gửi lời tri ân tới các thành viên đã cùng nhau đi qua một năm nhiều thử thách.\n\nHoạt động nhỏ nhưng giữ lại tinh thần quan trọng: mỗi người đều là một phần của hành trình chung.",
  }),
  legacyPost({
    id: "legacy-activity-yep-2025",
    title: "YEP 2025 - Khép năm tự hào, mở chặng bứt phá cùng Go Beyond",
    slug: "yep-2025-khep-nam-tu-hao-mo-chang-but-pha-cung-go-beyond",
    excerpt: "Year End Party 2025 ghi lại những dấu mốc đáng nhớ và mở ra chặng tăng trưởng tiếp theo cho GoBeyond.",
    tag: "activity",
    publishedAt: "2026-02-09T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/yep-2025-khep-nam-tu-hao-mo-chang-but-pha-cung-go-beyond/",
    kicker: "Year End Party",
    body: "YEP là dịp để cả đội cùng nhìn lại hành trình đã qua: những lần thử nghiệm, những cú bứt tốc và cả những bài học vận hành.\n\nKhoảnh khắc cuối năm giúp GoBeyond củng cố tinh thần đồng đội trước khi bước vào chặng mới với tham vọng lớn hơn.",
  }),
  legacyPost({
    id: "legacy-activity-race-23m",
    title: "Race to $2.3M - Phá mốc cuối năm cùng Go Beyond",
    slug: "race-to-2-3m-pha-moc-cuoi-nam-cung-go-beyond",
    excerpt: "Chiến dịch nội bộ thúc đẩy tinh thần race cuối năm, tập trung vào mục tiêu tăng trưởng và phối hợp vận hành.",
    tag: "activity",
    publishedAt: "2025-11-27T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/race-to-2-3m-pha-moc-cuoi-nam-cung-go-beyond/",
    kicker: "Growth race",
    body: "Cuối năm là giai đoạn tăng tốc của thương mại điện tử. Race to $2.3M giúp team cùng nhìn về một mục tiêu chung và giữ nhịp hành động mạnh mẽ.\n\nMỗi team đóng góp một phần: performance kéo tín hiệu tăng trưởng, creative tạo chất liệu bán hàng, fulfillment giữ ổn định phía sau.",
  }),
  legacyPost({
    id: "legacy-activity-kickoff-q2",
    title: "Go Beyond Kick Off Q2/2025 - Một chuyến đi, ngàn kỷ niệm",
    slug: "go-beyond-kick-off-q2-2025-mot-chuyen-di-ngan-ky-niem",
    excerpt: "Chuyến kick-off Q2/2025 tạo thêm kết nối nội bộ và tiếp thêm năng lượng cho quý mới.",
    tag: "activity",
    publishedAt: "2025-08-11T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/go-beyond-kick-off-q2-2025-mot-chuyen-di-ngan-ky-niem/",
    kicker: "Kick off Q2",
    body: "Một chuyến đi cùng nhau giúp các thành viên có thêm không gian kết nối ngoài công việc thường ngày.\n\nTừ những khoảnh khắc vui vẻ đến các hoạt động chung, tinh thần đồng đội được làm mới để bước vào quý tiếp theo với nhiều năng lượng hơn.",
  }),
  legacyPost({
    id: "legacy-activity-100k-orders",
    title: "Go Beyond vừa chốt 100.000 đơn",
    slug: "go-beyond-vua-chot-100-000-don",
    excerpt: "Dấu mốc 100.000 đơn ghi nhận năng lực vận hành và sự phối hợp của toàn hệ thống GoBeyond.",
    tag: "activity",
    publishedAt: "2025-06-20T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/go-beyond-vua-chot-100-000-don/",
    kicker: "100.000 đơn",
    body: "100.000 đơn là kết quả của rất nhiều bước nhỏ được thực hiện đúng: chọn sản phẩm, xây concept, chạy ads, xử lý đơn và chăm sóc khách hàng.\n\nCột mốc này giúp GoBeyond có thêm niềm tin vào hệ thống vận hành đang xây dựng.",
  }),
  legacyPost({
    id: "legacy-activity-30-4",
    title: "Hưởng ứng đại lễ 30/4 - Go Beyond tưởng nhớ, tri ân và tự hào",
    slug: "huong-ung-dai-le-30-4-go-beyond-tuong-nho-tri-an-va-tu-hao",
    excerpt: "Hoạt động nội bộ nhân dịp 30/4 lan tỏa tinh thần tưởng nhớ, tri ân và tự hào dân tộc.",
    tag: "activity",
    publishedAt: "2025-04-30T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/huong-ung-dai-le-30-4-go-beyond-tuong-nho-tri-an-va-tu-hao/",
    kicker: "Đại lễ 30/4",
    body: "Dịp lễ 30/4 là cơ hội để GoBeyond cùng nhau nhắc lại giá trị của lòng biết ơn và tinh thần tự hào.\n\nCác hoạt động truyền thông nội bộ giúp kết nối văn hóa công ty với những dấu mốc ý nghĩa của đất nước.",
  }),
  legacyPost({
    id: "legacy-activity-83",
    title: "Go Beyond chúc mừng ngày Quốc tế Phụ nữ 8/3",
    slug: "go-beyond-chuc-mung-ngay-quoc-te-phu-nu-8-3",
    excerpt: "Một hoạt động ấm áp dành cho các thành viên nữ, gửi lời chúc và sự trân trọng từ GoBeyond.",
    tag: "activity",
    publishedAt: "2025-03-08T00:00:00.000Z",
    sourceUrl: "https://gobe.asia/go-beyond-chuc-mung-ngay-quoc-te-phu-nu-8-3/",
    kicker: "8/3",
    body: "Ngày 8/3 là dịp để GoBeyond gửi lời cảm ơn tới những đóng góp của các thành viên nữ trong đội ngũ.\n\nNhững khoảnh khắc nhỏ trong ngày đặc biệt này góp phần làm văn hóa công ty trở nên gần gũi và giàu sự quan tâm hơn.",
  }),
];

function mergeWithFallback(docs: NewsPost[], fallback: NewsPost[]) {
  if (docs.length === 0) {
    return fallback;
  }

  return docs;
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

    return mergeWithFallback(result.docs as NewsPost[], fallbackNews);
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

    return mergeWithFallback(result.docs as NewsPost[], fallbackActivities);
  } catch (error) {
    console.warn("Payload activity query failed, using fallback content.", error);
    return fallbackActivities;
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

    return (result.docs[0] as NewsPost | undefined) || fallbackActivities.find((post) => post.slug === slug) || null;
  } catch (error) {
    console.warn("Payload activity detail query failed, using fallback content.", error);
    return fallbackActivities.find((post) => post.slug === slug) || null;
  }
}
