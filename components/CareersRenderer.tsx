"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import type { CareerItem, CareerRichText, CareerRichTextNode } from "@/lib/careers";
import { fetchPayloadDocs } from "@/lib/cmsClient";
import { CustomCursor } from "./CustomCursor";
import { FooterSection } from "./LegacySections";
import { Navbar } from "./Navbar";
import { initScrollController } from "./ScrollController";

const tagLabels: Record<string, string> = {
  hiring: "Đang tuyển",
  marketing: "Marketing",
  creative: "Sáng tạo",
  operations: "Vận hành",
  customerService: "Chăm sóc khách hàng",
  humanResource: "Nhân sự",
  internship: "Thực tập",
};

const tagColors: Record<string, string> = {
  hiring: "#F26522",
  marketing: "#F26522",
  creative: "#D95B9F",
  operations: "#2ED4A4",
  customerService: "#5AA2E8",
  humanResource: "#E9C15F",
  internship: "#8A7CFF",
};

type RichTextSegment = {
  format?: number | string;
  text: string;
};

type DetailContentBlock = {
  kind: "heading" | "item" | "paragraph";
  key: string;
  segments: RichTextSegment[];
};

function PageShell({ children }: { children: ReactNode }) {
  useEffect(() => initScrollController(), []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#000314] text-white">
      <CustomCursor />
      <Navbar />
      {children}
      <FooterSection />
    </main>
  );
}

function SectionMark({ current, label }: { current: string; label: string }) {
  return (
    <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.24em] text-white/56">
      <span className="text-[#F26522]">{current}</span>
      <span className="h-px w-14 bg-[#F26522]/70" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function splitPastedListText(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/((?:Kỹ năng\/\s*Chuyên môn|Thái độ\/Giá trị|Thu nhập|Phúc lợi khác|[A-ZÀ-Ỹ][^:\n]{1,70}):?)\s+-\s+/g, "$1\n- ")
    .replace(/\s+(?=(?:Kỹ năng\/\s*Chuyên môn|Thái độ\/Giá trị|Thu nhập:?|Phúc lợi khác:?)\s*(?:\n|-))/g, "\n")
    .split(/\n+|\s{2,}(?=[A-ZÀ-Ỹ][^:]{1,70}:\s*)|\s+-\s+(?=\S)/g)
    .map((item) => item.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function isHeadingLikeLine(text: string) {
  const trimmed = text.trim();

  return (
    /^(?:[IVX]+\/\s*)?(?:Mô tả công việc|Yêu cầu công việc|Quyền lợi|Kỹ năng\/\s*Chuyên môn|Thái độ\/Giá trị|Thu nhập:?|Phúc lợi khác:?|Điểm cộng:)$/i.test(trimmed) ||
    /^[IVX]+\/\s+\S/.test(trimmed) ||
    (trimmed.endsWith(":") && trimmed.length <= 48)
  );
}

function normalizeSegments(segments: RichTextSegment[]) {
  const firstTextIndex = segments.findIndex((segment) => segment.text.trim().length > 0);
  let lastTextIndex = -1;

  for (let index = segments.length - 1; index >= 0; index -= 1) {
    if (segments[index].text.trim().length > 0) {
      lastTextIndex = index;
      break;
    }
  }

  if (firstTextIndex === -1 || lastTextIndex === -1) {
    return [];
  }

  return segments.slice(firstTextIndex, lastTextIndex + 1).map((segment, index, sliced) => {
    let text = segment.text;

    if (index === 0) {
      text = text.trimStart();
    }

    if (index === sliced.length - 1) {
      text = text.trimEnd();
    }

    return { ...segment, text };
  });
}

function getInlineSegments(node: CareerRichTextNode): RichTextSegment[] {
  if (typeof node.text === "string") {
    return [{ format: node.format, text: node.text }];
  }

  if (!Array.isArray(node.children)) {
    return [];
  }

  return node.children.filter((child) => child.type !== "list").flatMap(getInlineSegments);
}

function textToBlocks(text: string, keyPrefix: string, kind: DetailContentBlock["kind"] = "item") {
  return splitPastedListText(text).map<DetailContentBlock>((line, index) => ({
    key: `${keyPrefix}-text-${index}`,
    kind: isHeadingLikeLine(line) ? "heading" : kind,
    segments: [{ text: line }],
  }));
}

function addNodeBlock(blocks: DetailContentBlock[], node: CareerRichTextNode, kind: DetailContentBlock["kind"], key: string) {
  const segments = normalizeSegments(getInlineSegments(node));

  if (segments.length === 0) {
    return;
  }

  const plainText = segments.map((segment) => segment.text).join("");
  const splitLines = splitPastedListText(plainText);

  if (splitLines.length > 1 && segments.length === 1) {
    blocks.push(
      ...splitLines.map((line, index) => ({
        key: `${key}-split-${index}`,
        kind: isHeadingLikeLine(line) ? "heading" : index === 0 ? kind : "item",
        segments: [{ format: segments[0].format, text: line }],
      })),
    );
    return;
  }

  blocks.push({ key, kind, segments });
}

function extractRichTextBlocks(value?: CareerRichText, keyPrefix = "rich-text"): DetailContentBlock[] {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return textToBlocks(value, keyPrefix);
  }

  const children = value.root?.children;

  if (!Array.isArray(children)) {
    return [];
  }

  const blocks: DetailContentBlock[] = [];

  const visit = (node: CareerRichTextNode, key: string) => {
    if (node.type === "list" && Array.isArray(node.children)) {
      node.children.forEach((child, index) => visit(child, `${key}-list-${index}`));
      return;
    }

    if (node.type === "listitem") {
      addNodeBlock(blocks, node, "item", key);
      node.children?.filter((child) => child.type === "list").forEach((child, index) => visit(child, `${key}-nested-${index}`));
      return;
    }

    if (node.type === "heading") {
      addNodeBlock(blocks, node, "heading", key);
      return;
    }

    if (node.type === "paragraph") {
      addNodeBlock(blocks, node, "paragraph", key);
      return;
    }

    if (Array.isArray(node.children)) {
      node.children.forEach((child, index) => visit(child, `${key}-child-${index}`));
      return;
    }

    if (typeof node.text === "string") {
      blocks.push(...textToBlocks(node.text, key));
    }
  };

  children.forEach((child, index) => visit(child, `${keyPrefix}-${index}`));
  return blocks;
}

function detailBlocks(items?: { text?: CareerRichText }[]) {
  return Array.isArray(items) ? items.flatMap((item, index) => extractRichTextBlocks(item.text, `item-${index}`)) : [];
}

function fallbackBlocks(items: string[], keyPrefix: string) {
  return items.flatMap((item, index) => textToBlocks(item, `${keyPrefix}-${index}`));
}

function JobCard({ job, index }: { job: CareerItem; index: number }) {
  const tag = job.tag || "hiring";
  const accent = tagColors[tag] || "#F26522";

  return (
    <Link
      href={`/tuyen-dung/${job.slug}`}
      prefetch={false}
      data-scroll-card
      className="group relative min-h-[390px] overflow-hidden border border-white/12 bg-[#101520]/82 p-5 text-white shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md transition hover:-translate-y-2 hover:border-[#F26522]/70 hover:shadow-[0_34px_100px_rgba(242,101,34,0.16)]"
      style={{ "--accent": accent } as CSSProperties}
    >
      <span className="absolute left-5 top-5 z-[2] border border-[color:var(--accent)] px-2 py-1 text-center text-[10px] font-black uppercase leading-3 text-[color:var(--accent)]">
        {job.dateLabel || "2026"}
      </span>
      <div className="absolute right-5 top-5 z-[2] text-right text-sm font-black uppercase leading-none text-[#F26522]">
        GO
        <span className="block text-[10px] text-white/72">beyond</span>
      </div>

      <div className="mt-14 overflow-hidden rounded-[1.75rem] bg-white p-4 text-[#182452]">
        <div className="mx-auto w-fit rounded-full bg-black px-5 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">
          Chúng tôi đang tuyển!
        </div>
        <div className="mt-4 rounded-2xl bg-[#F26522] px-4 py-4 text-center text-xl font-black text-white">
          {job.title}
        </div>
        <div className="mt-5 grid grid-cols-[96px_1fr] items-center gap-4">
          <div className="grid aspect-square place-items-center border-2 border-[#F26522] bg-white p-2">
            <span className="text-center text-[10px] font-black uppercase leading-tight text-[#182452]">
              Lark
              <br />
              JD
            </span>
          </div>
          <div className="relative h-24">
            <div className="absolute bottom-0 right-2 h-20 w-20 rounded-full bg-[#F26522]/16" />
            <div className="absolute bottom-2 right-8 text-5xl">GO</div>
            <div className="absolute bottom-2 right-0 h-12 w-12 rounded-full bg-[#F26522]" />
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--accent)]">
          {tagLabels[tag] || tagLabels.hiring} / {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-white">{job.title}</h3>
        <p className="mt-3 text-sm font-medium leading-6 text-white/64">{job.excerpt}</p>
      </div>

      <span className="absolute bottom-5 right-5 rounded-full bg-[#F26522] px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white opacity-0 transition group-hover:opacity-100">
        Xem JD
      </span>
    </Link>
  );
}

function mergeJobsWithFallback(docs: CareerItem[], fallback: CareerItem[]) {
  if (docs.length === 0) {
    return fallback;
  }

  return docs;
}

export function CareersListing({ jobs, listingSourceUrl }: { jobs: CareerItem[]; listingSourceUrl: string }) {
  const [liveJobs, setLiveJobs] = useState(jobs);

  useEffect(() => {
    let mounted = true;

    fetchPayloadDocs<CareerItem>("careers", {
      depth: 1,
      limit: 50,
      sort: "-publishedAt",
      "where[_status][equals]": "published",
    })
      .then((docs) => {
        if (mounted) {
          setLiveJobs(mergeJobsWithFallback(docs, jobs));
        }
      })
      .catch(() => {
        if (mounted) {
          setLiveJobs(jobs);
        }
      });

    return () => {
      mounted = false;
    };
  }, [jobs]);

  return (
    <PageShell>
      <section id="careers" data-scroll-section className="relative z-10 min-h-screen overflow-hidden bg-[#000314] px-5 pt-24 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_16%,rgba(242,101,34,0.20),transparent_28%),radial-gradient(circle_at_20%_34%,rgba(90,162,232,0.18),transparent_30%),linear-gradient(135deg,#000314_0%,#071026_52%,#02030b_100%)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />

        <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)]">
          <div>
            <div data-scroll-reveal>
              <SectionMark current="01" label="" />
            </div>
            <h1 data-scroll-reveal className="mt-6 text-5xl font-black uppercase leading-[0.86] tracking-normal sm:text-6xl lg:text-7xl xl:text-8xl">
              Gia nhập
              <span className="block text-[#ff7648]">GoBeyond</span>
            </h1>
            <p data-scroll-reveal className="mt-7 max-w-2xl text-base font-medium leading-8 text-white/70 md:text-lg">
              Các vị trí đang mở cho đội ngũ thương mại điện tử toàn cầu: marketing, sáng tạo, fulfillment, chăm sóc khách hàng và vận hành.
            </p>
            <div data-scroll-reveal className="mt-8 flex flex-wrap gap-3">
              <a
                href="#open-roles"
                className="magnetic inline-flex min-h-12 items-center rounded-full bg-[#F26522] px-7 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_45px_rgba(242,101,34,0.28)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]"
              >
                Xem vị trí
              </a>
              <a
                href={listingSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="magnetic inline-flex min-h-12 items-center rounded-full border border-white/18 px-7 text-sm font-black uppercase tracking-[0.1em] text-white/78 transition hover:border-white hover:text-white"
              >
                Danh sách Lark
              </a>
            </div>
          </div>

          <figure data-scroll-media className="relative">
            <div className="absolute -inset-5 border border-[#F26522]/28 bg-[#F26522]/8 shadow-[0_34px_120px_rgba(242,101,34,0.14)]" />
            <img
              src="/careers/legacy-careers-list.png"
              alt="Bản xem trước danh sách tuyển dụng GoBeyond"
              className="relative aspect-[4/3] w-full object-cover object-top"
            />
          </figure>
        </div>
      </section>

      <section id="open-roles" data-scroll-section className="relative z-10 overflow-hidden bg-[#030711] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(242,101,34,0.16),transparent_28%),linear-gradient(135deg,#030711,#071026_48%,#02030b)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)]">
            <div>
              <div data-scroll-reveal>
                <SectionMark current="02" label="" />
              </div>
              <h2 data-scroll-reveal className="mt-6 text-4xl font-black uppercase leading-[0.9] sm:text-5xl lg:text-7xl">
                Tất cả vị trí
                <span className="block text-[#ff7648]">đang tuyển</span>
              </h2>
            </div>
            <p data-scroll-reveal className="max-w-2xl text-base font-medium leading-8 text-white/68 md:text-lg">
              Mỗi vai trò đều là một mảnh ghép trong hệ thống vận hành toàn cầu của GoBeyond. Nội dung có thể chỉnh sửa trong Payload CMS.
            </p>
          </div>

          {liveJobs.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {liveJobs.map((job, index) => (
                <JobCard key={job.slug} job={job} index={index} />
              ))}
            </div>
          ) : (
            <div data-scroll-card className="mt-10 border border-white/12 bg-[#101520]/82 p-8 text-white shadow-[0_28px_82px_rgba(0,0,0,0.26)] backdrop-blur-md md:p-10">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">Tuyển dụng</p>
              <h3 className="mt-4 text-3xl font-black uppercase tracking-normal text-white md:text-5xl">
                Chưa có tin tuyển dụng
              </h3>
              <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-white/68">
                Hiện tại GoBeyond chưa mở vị trí tuyển dụng công khai. Khi team đăng JD mới trong Payload CMS, danh sách sẽ tự động hiển thị tại đây.
              </p>
              <a
                href={listingSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex min-h-12 items-center rounded-full border border-white/18 px-6 text-sm font-black uppercase tracking-[0.1em] text-white/78 transition hover:border-[#F26522] hover:text-white"
              >
                Xem danh sách Lark
              </a>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function DetailSection({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section data-scroll-card className="border-t border-white/12 py-9 first:border-t-0 first:pt-0 md:py-11">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#F26522]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-black uppercase leading-tight text-white md:text-3xl">{title}</h2>
      <div className="mt-5 text-base font-semibold leading-8 text-white/72 md:text-[17px]">{children}</div>
    </section>
  );
}

function hasTextFormat(format: RichTextSegment["format"], flag: number, name: string) {
  if (typeof format === "number") {
    return (format & flag) !== 0;
  }

  if (typeof format === "string") {
    return format.split(/\s+/).includes(name);
  }

  return false;
}

function renderRichTextSegment(segment: RichTextSegment, index: number) {
  const classes = [
    hasTextFormat(segment.format, 1, "bold") ? "font-black text-white" : "",
    hasTextFormat(segment.format, 2, "italic") ? "italic" : "",
    hasTextFormat(segment.format, 4, "strikethrough") ? "line-through" : "",
    hasTextFormat(segment.format, 8, "underline") ? "underline underline-offset-4" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span key={`${segment.text}-${index}`} className={classes || undefined}>
      {segment.text}
    </span>
  );
}

function DetailContentList({ blocks }: { blocks: DetailContentBlock[] }) {
  return (
    <div className="grid gap-5 md:gap-6">
      {blocks.map((block, index) => {
        const key = `${block.key}-${index}`;

        if (block.kind === "heading") {
          return (
            <h3 key={key} className="pt-3 text-xl font-black uppercase leading-snug text-white md:text-2xl">
              <span className="mr-3 text-[#F26522]">/</span>
              {block.segments.map(renderRichTextSegment)}
            </h3>
          );
        }

        if (block.kind === "paragraph") {
          return (
            <p key={key} className="text-base font-semibold leading-8 text-white/72 md:text-[18px] md:leading-9">
              {block.segments.map(renderRichTextSegment)}
            </p>
          );
        }

        return (
          <div key={key} className="grid grid-cols-[10px_minmax(0,1fr)] gap-5">
            <span
              className="mt-[0.72em] h-2 w-2 shrink-0 rounded-full bg-[#F26522] shadow-[0_0_18px_rgba(242,101,34,0.36)]"
              aria-hidden="true"
            />
            <div className="min-w-0 text-lg font-extrabold leading-9 text-white/88 md:text-[22px] md:leading-[1.75]">
              {block.segments.map(renderRichTextSegment)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function isActionUrl(value?: string) {
  return Boolean(value && /^(https?:\/\/|mailto:)/i.test(value));
}

function getApplyUrl(job: CareerItem) {
  if (isActionUrl(job.applyUrl)) {
    return job.applyUrl as string;
  }

  return `mailto:tuyendung@gobe.asia?subject=${encodeURIComponent(`[GOBEYOND - ${job.title.toUpperCase()}] Ho va ten`)}`;
}

function getDisplayDate(job: CareerItem) {
  if (job.dateLabel) {
    return job.dateLabel;
  }

  if (!job.publishedAt) {
    return "2026";
  }

  const parsed = new Date(job.publishedAt);
  if (Number.isNaN(parsed.getTime())) {
    return job.publishedAt;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function getFallbackResponsibilities(job: CareerItem) {
  const department = job.department || "growth";

  return [
    `Theo dõi mục tiêu của vị trí ${job.title} và biến kế hoạch thành kết quả thực tế theo từng tuần.`,
    "Phối hợp với các team marketing, creative, fulfillment và operations để vận hành chiến dịch e-commerce quốc tế.",
    `Chủ động phân tích dữ liệu, phát hiện vấn đề và đề xuất cách tối ưu cho ${department}.`,
  ];
}

function getFallbackRequirements(job: CareerItem) {
  return [
    "Có tư duy ownership, làm việc rõ ràng và thích môi trường tăng trưởng nhanh.",
    "Biết ưu tiên công việc, giao tiếp tốt với các team liên quan và theo sát deadline.",
    "Sẵn sàng học công cụ mới, đặc biệt là AI và các hệ thống hỗ trợ vận hành e-commerce.",
    `Kinh nghiệm liên quan đến ${job.department || "e-commerce"} là lợi thế.`,
  ];
}

function getFallbackBenefits() {
  return [
    "Môi trường trẻ, tốc độ cao, nhiều cơ hội học trực tiếp từ các bài toán scale thật.",
    "Được tham gia vào hệ thống e-commerce toàn cầu với dữ liệu, quy trình và công cụ rõ ràng.",
    "Review hiệu suất định kỳ, lương thưởng theo năng lực và văn hóa đề cao người chủ động.",
  ];
}

function CareerApplicationForm({ applyUrl, job }: { applyUrl: string; job: CareerItem }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    portfolio: "",
    message: "",
  });

  const updateField = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = `[GOBEYOND - ${job.title.toUpperCase()}] ${form.name || "Ho va ten"}`;
    const body = [
      `Vi tri ung tuyen: ${job.title}`,
      `Ho va ten: ${form.name}`,
      `Email: ${form.email}`,
      `So dien thoai: ${form.phone}`,
      `CV/Portfolio link: ${form.portfolio}`,
      "",
      "Loi nhan:",
      form.message,
    ].join("\n");

    const emailTarget = applyUrl.toLowerCase().startsWith("mailto:") ? applyUrl.split("?")[0] : "mailto:tuyendung@gobe.asia";

    window.location.href = `${emailTarget}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.18em] text-white/42" htmlFor="career-name">
          Họ và tên
        </label>
        <input
          id="career-name"
          required
          value={form.name}
          onChange={updateField("name")}
          className="mt-2 h-12 w-full border border-white/12 bg-white/[0.04] px-4 text-sm font-bold text-white outline-none transition placeholder:text-white/28 focus:border-[#F26522]"
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.18em] text-white/42" htmlFor="career-email">
            Email
          </label>
          <input
            id="career-email"
            required
            type="email"
            value={form.email}
            onChange={updateField("email")}
            className="mt-2 h-12 w-full border border-white/12 bg-white/[0.04] px-4 text-sm font-bold text-white outline-none transition placeholder:text-white/28 focus:border-[#F26522]"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-[0.18em] text-white/42" htmlFor="career-phone">
            Số điện thoại
          </label>
          <input
            id="career-phone"
            required
            value={form.phone}
            onChange={updateField("phone")}
            className="mt-2 h-12 w-full border border-white/12 bg-white/[0.04] px-4 text-sm font-bold text-white outline-none transition placeholder:text-white/28 focus:border-[#F26522]"
            placeholder="090..."
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.18em] text-white/42" htmlFor="career-portfolio">
          Link CV / Portfolio
        </label>
        <input
          id="career-portfolio"
          value={form.portfolio}
          onChange={updateField("portfolio")}
          className="mt-2 h-12 w-full border border-white/12 bg-white/[0.04] px-4 text-sm font-bold text-white outline-none transition placeholder:text-white/28 focus:border-[#F26522]"
          placeholder="Google Drive, LinkedIn, portfolio..."
        />
      </div>
      <div>
        <label className="text-[10px] font-black uppercase tracking-[0.18em] text-white/42" htmlFor="career-message">
          Lời nhắn
        </label>
        <textarea
          id="career-message"
          value={form.message}
          onChange={updateField("message")}
          rows={4}
          className="mt-2 w-full resize-none border border-white/12 bg-white/[0.04] px-4 py-3 text-sm font-bold leading-6 text-white outline-none transition placeholder:text-white/28 focus:border-[#F26522]"
          placeholder="Bạn muốn GoBeyond biết thêm điều gì?"
        />
      </div>
      <button
        type="submit"
        className="magnetic mt-1 inline-flex min-h-12 items-center justify-center rounded-full bg-[#F26522] px-6 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_42px_rgba(242,101,34,0.26)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]"
      >
        Gửi đơn ứng tuyển
      </button>
      <p className="text-xs font-semibold leading-6 text-white/45">
        Form sẽ mở email đã điền sẵn nội dung. Bạn có thể đính kèm CV trong email trước khi gửi.
      </p>
    </form>
  );
}

export function CareerDetail({ job }: { job: CareerItem }) {
  const jdContent = typeof job.description === "string" ? [] : extractRichTextBlocks(job.description, "jd-content");
  const responsibilities = detailBlocks(job.responsibilities);
  const requirements = detailBlocks(job.requirements);
  const benefits = detailBlocks(job.benefits);
  const hasJdContent = jdContent.length > 0;
  const displayedResponsibilities =
    responsibilities.length > 0 ? responsibilities : fallbackBlocks(getFallbackResponsibilities(job), "fallback-responsibility");
  const displayedRequirements = requirements.length > 0 ? requirements : fallbackBlocks(getFallbackRequirements(job), "fallback-requirement");
  const displayedBenefits = benefits.length > 0 ? benefits : fallbackBlocks(getFallbackBenefits(), "fallback-benefit");
  const tag = job.tag || "hiring";
  const applyUrl = getApplyUrl(job);
  const larkUrl = isActionUrl(job.larkUrl) ? job.larkUrl : null;
  const description =
    (typeof job.description === "string" ? job.description : "") ||
    job.excerpt ||
    "GoBeyond đang tìm kiếm những đồng đội sẵn sàng đi xa hơn trong hành trình xây dựng hệ thống thương mại điện tử toàn cầu.";
  const displayDate = getDisplayDate(job);

  return (
    <PageShell>
      <section id="career-detail" data-scroll-section className="relative z-10 overflow-hidden bg-[#000314] px-5 pb-16 pt-28 text-white sm:px-8 lg:px-12 lg:pb-20 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(242,101,34,0.22),transparent_30%),radial-gradient(circle_at_16%_28%,rgba(90,162,232,0.14),transparent_28%),linear-gradient(135deg,#000314_0%,#071026_52%,#02030b_100%)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/tuyen-dung"
            data-scroll-reveal
            className="inline-flex items-center text-xs font-black uppercase tracking-[0.18em] text-[#F26522] transition hover:text-white"
          >
            Back to careers
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(280px,0.32fr)] lg:items-start">
            <header data-scroll-reveal className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-black uppercase tracking-[0.18em] text-white/52">
                <span className="rounded-full border border-[#F26522]/44 bg-[#F26522]/12 px-4 py-2 text-[#F26522]">
                  {tagLabels[tag] || tagLabels.hiring}
                </span>
                <span>{job.department || "E-commerce"}</span>
                <span className="h-1 w-1 rounded-full bg-white/34" />
                <span>{job.location || "Ho Chi Minh"}</span>
              </div>
              <h1 className="mt-6 text-4xl font-black uppercase leading-[0.95] tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl">
                {job.title}
              </h1>
              <p className="mt-7 max-w-3xl text-lg font-semibold leading-8 text-white/70 md:text-xl md:leading-9">{description}</p>
            </header>

            <aside data-scroll-card className="top-28 border border-white/12 bg-[#101520]/82 p-6 shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md lg:sticky">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">Job overview</p>
              <dl className="mt-6 grid gap-5">
                {[
                  ["Department", job.department || "E-commerce"],
                  ["Employment type", job.employmentType || "Toàn thời gian"],
                  ["Quantity", job.quantity || "01"],
                  ["Location", job.location || "Ho Chi Minh"],
                  ["Published", displayDate],
                ].map(([label, value]) => (
                  <div key={label} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                    <dt className="text-[11px] font-black uppercase tracking-[0.18em] text-white/36">{label}</dt>
                    <dd className="mt-1 text-sm font-black leading-6 text-white">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-7 grid gap-3">
                <a className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F26522] px-6 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_42px_rgba(242,101,34,0.26)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]" href="#career-application">
                  Apply now
                </a>
                {larkUrl ? (
                  <a
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 text-sm font-black uppercase tracking-[0.1em] text-white/76 transition hover:border-[#F26522] hover:text-white"
                    href={larkUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open JD
                  </a>
                ) : null}
              </div>

              <p className="mt-6 text-sm font-semibold leading-7 text-white/56">
                Gửi CV tới <span className="font-black text-white">tuyendung@gobe.asia</span> với tiêu đề:
                <br />
                <span className="font-black text-[#F26522]">[GOBEYOND - {job.title.toUpperCase()}] Họ và tên</span>
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section data-scroll-section className="relative z-10 bg-[#030711] px-5 py-14 text-white sm:px-8 md:py-20 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(242,101,34,0.14),transparent_28%),linear-gradient(135deg,#030711,#071026_48%,#02030b)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.68fr)_minmax(280px,0.32fr)]">
          <article className="relative min-w-0">
            <DetailSection eyebrow="ABOUT THE ROLE" title="About the role">
              <p>{description}</p>
            </DetailSection>
            {hasJdContent ? (
              <DetailSection eyebrow="JOB DESCRIPTION" title="Chi tiết JD">
                <DetailContentList blocks={jdContent} />
              </DetailSection>
            ) : (
              <>
                <DetailSection eyebrow="WHAT YOU WILL DO" title="What you will do">
                  <DetailContentList blocks={displayedResponsibilities} />
                </DetailSection>
                <DetailSection eyebrow="WHAT WE ARE LOOKING FOR" title="What we are looking for">
                  <DetailContentList blocks={displayedRequirements} />
                </DetailSection>
                <DetailSection eyebrow="WHAT YOU CAN EXPECT" title="What you can expect">
                  <DetailContentList blocks={displayedBenefits} />
                </DetailSection>
              </>
            )}
            <DetailSection eyebrow="WORKING TIME" title="Working time">
              <p>{job.workingTime || "Thông tin sẽ được trao đổi cụ thể trong quá trình phỏng vấn."}</p>
            </DetailSection>
          </article>

          <div className="relative grid gap-5 lg:mt-9">
            <aside id="career-application" data-scroll-card className="border border-white/12 bg-[#101520]/82 p-6 shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">Application form</p>
              <h2 className="mt-4 text-2xl font-black uppercase leading-tight text-white">Ứng tuyển vị trí này</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-white/58">
                Điền nhanh thông tin, hệ thống sẽ mở email gửi tới team tuyển dụng GoBeyond.
              </p>
              <div className="mt-6">
                <CareerApplicationForm applyUrl={applyUrl} job={job} />
              </div>
            </aside>

            <aside data-scroll-card className="border border-white/12 bg-white/[0.04] p-6 backdrop-blur-md">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">Other opportunities</p>
              <h2 className="mt-4 text-2xl font-black uppercase leading-tight text-white">Explore more roles at GoBeyond</h2>
              <p className="mt-4 text-sm font-semibold leading-7 text-white/58">
                Các vị trí mới được đồng bộ từ Payload CMS. Quay lại danh sách để xem thêm team đang tuyển.
              </p>
              <Link
                href="/tuyen-dung"
                className="mt-6 inline-flex min-h-12 items-center rounded-full border border-white/18 px-6 text-sm font-black uppercase tracking-[0.1em] text-white/76 transition hover:border-[#F26522] hover:text-white"
              >
                View all roles
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
