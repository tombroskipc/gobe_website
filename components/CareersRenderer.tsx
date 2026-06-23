"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type FormEvent, type ReactNode } from "react";
import type { CareerItem, CareerRichText, CareerRichTextNode } from "@/lib/careers";
import { CustomCursor } from "./CustomCursor";
import { FooterBridge, FooterSection } from "./LegacySections";
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
  kind: "heading" | "subheading" | "item" | "subitem" | "paragraph";
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
      <FooterBridge />
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

function isSectionHeadingLine(text: string) {
  const trimmed = text.trim();

  return /^[IVX]+\/\s+\S/i.test(trimmed) || /^(?:Mô tả công việc|Yêu cầu công việc|Quyền lợi)$/i.test(trimmed);
}

function isSubheadingLine(text: string) {
  const trimmed = text.trim().replace(/:$/, "");

  return /^(?:Kỹ năng\/\s*Chuyên môn|Thái độ\/Giá trị|Yêu cầu khác|Thu nhập|Bạn nhận được gì\?|Phúc lợi khác|Điểm cộng)$/i.test(trimmed);
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

function getSegmentsText(segments: RichTextSegment[]) {
  return segments.map((segment) => segment.text).join("").trim();
}

function splitSegmentsByLine(segments: RichTextSegment[]) {
  const lines: RichTextSegment[][] = [[]];

  segments.forEach((segment) => {
    const parts = segment.text.replace(/\r\n/g, "\n").split("\n");

    parts.forEach((part, index) => {
      if (index > 0) {
        lines.push([]);
      }

      if (part.length > 0) {
        lines[lines.length - 1].push({ ...segment, text: part });
      }
    });
  });

  return lines.map(normalizeSegments).filter((line) => line.length > 0);
}

function emphasizeLeadingLabel(segments: RichTextSegment[]) {
  const text = getSegmentsText(segments);
  const match = text.match(/^([^:：]{1,34}):\s+(.+)$/);

  if (!match) {
    return segments;
  }

  return [
    { text: `${match[1]}:`, format: 1 },
    { text: ` ${match[2]}` },
  ];
}

function classifyJdLines(lines: RichTextSegment[][], keyPrefix: string) {
  const blocks: DetailContentBlock[] = [];
  let shouldUseParagraphAfterSection = false;
  let previousWasColonOnlyItem = false;

  lines.forEach((segments, index) => {
    const text = getSegmentsText(segments);
    const key = `${keyPrefix}-line-${index}`;

    if (!text) {
      return;
    }

    if (isSectionHeadingLine(text)) {
      blocks.push({ key, kind: "heading", segments });
      shouldUseParagraphAfterSection = true;
      previousWasColonOnlyItem = false;
      return;
    }

    if (isSubheadingLine(text)) {
      blocks.push({ key, kind: "subheading", segments: segments.map((segment) => ({ ...segment, text: segment.text.replace(/:\s*$/, "") })) });
      shouldUseParagraphAfterSection = false;
      previousWasColonOnlyItem = false;
      return;
    }

    if (shouldUseParagraphAfterSection) {
      blocks.push({ key, kind: "paragraph", segments });
      shouldUseParagraphAfterSection = false;
      previousWasColonOnlyItem = false;
      return;
    }

    const isColonOnlyItem = text.endsWith(":") && text.length <= 34;
    blocks.push({
      key,
      kind: previousWasColonOnlyItem ? "subitem" : "item",
      segments: emphasizeLeadingLabel(segments),
    });
    previousWasColonOnlyItem = isColonOnlyItem;
  });

  return blocks;
}

function textToBlocks(text: string, keyPrefix: string, kind: DetailContentBlock["kind"] = "item") {
  const normalizedLines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .flatMap((line) => splitPastedListText(line))
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => [{ text: line }]);

  if (kind === "item") {
    return classifyJdLines(normalizedLines, keyPrefix);
  }

  return normalizedLines.map<DetailContentBlock>((segments, index) => ({
    key: `${keyPrefix}-text-${index}`,
    kind,
    segments,
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
      ...classifyJdLines(
        splitLines.map((line) => [{ format: segments[0].format, text: line }]),
        key,
      ),
    );
    return;
  }

  splitSegmentsByLine(segments).forEach((lineSegments, index) => {
    blocks.push(...classifyJdLines([lineSegments], `${key}-line-${index}`));
  });
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

  const lines: RichTextSegment[][] = [];

  const visit = (node: CareerRichTextNode, key: string) => {
    if (node.type === "list" && Array.isArray(node.children)) {
      node.children.forEach((child, index) => visit(child, `${key}-list-${index}`));
      return;
    }

    if (node.type === "listitem") {
      splitSegmentsByLine(normalizeSegments(getInlineSegments(node))).forEach((line) => lines.push(line));
      node.children?.filter((child) => child.type === "list").forEach((child, index) => visit(child, `${key}-nested-${index}`));
      return;
    }

    if (node.type === "heading") {
      splitSegmentsByLine(normalizeSegments(getInlineSegments(node))).forEach((line) => lines.push(line));
      return;
    }

    if (node.type === "paragraph") {
      splitSegmentsByLine(normalizeSegments(getInlineSegments(node))).forEach((line) => lines.push(line));
      return;
    }

    if (Array.isArray(node.children)) {
      node.children.forEach((child, index) => visit(child, `${key}-child-${index}`));
      return;
    }

    if (typeof node.text === "string") {
      splitSegmentsByLine([{ format: node.format, text: node.text }]).forEach((line) => lines.push(line));
    }
  };

  children.forEach((child, index) => visit(child, `${keyPrefix}-${index}`));
  return classifyJdLines(lines, keyPrefix);
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
  const qrCodeUrl = getQrCodeUrl(job.larkUrl);

  return (
    <Link
      href={`/tuyen-dung/${job.slug}`}
      prefetch={false}
      data-scroll-card
      className="group relative min-h-[430px] overflow-hidden border border-white/12 bg-[#101520]/82 p-5 text-white shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md transition hover:-translate-y-2 hover:border-[#F26522]/70 hover:shadow-[0_34px_100px_rgba(242,101,34,0.16)]"
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
        <div className="mx-auto w-fit rounded-full bg-black px-5 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-white">
          WE ARE HIRING!
        </div>

        <div className="relative mt-5 min-h-[230px] overflow-hidden rounded-2xl bg-[#fff8f2]">
          <span className="absolute -right-12 -top-12 size-40 rounded-full bg-[#F26522]/12" aria-hidden="true" />
          <span className="absolute bottom-8 right-28 hidden text-7xl font-black uppercase leading-none text-[#182452]/10 sm:block" aria-hidden="true">
            GO
          </span>

          <div className="absolute bottom-5 left-5 z-[2] grid size-24 place-items-center border-2 border-[#F26522] bg-white p-2 shadow-[0_12px_28px_rgba(24,36,82,0.10)]">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt={`QR Lark JD ${job.title}`} className="h-full w-full object-contain" loading="lazy" />
            ) : (
              <span className="text-center text-[10px] font-black uppercase leading-tight text-[#182452]">
                Lark
                <br />
                JD
              </span>
            )}
          </div>

          <img
            src="/careers/hiring-mascot.png"
            alt="GoBeyond hiring mascot"
            className="absolute bottom-0 right-[-18px] z-[1] h-[205px] w-auto max-w-[72%] object-contain object-bottom drop-shadow-[0_18px_28px_rgba(242,101,34,0.20)] transition duration-500 group-hover:translate-y-[-4px]"
            loading="lazy"
          />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[color:var(--accent)]">
          {tagLabels[tag] || tagLabels.hiring} / {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-white">{job.title}</h3>
        <p className="mt-3 text-sm font-medium leading-6 text-white/64">{job.excerpt}</p>
      </div>
    </Link>
  );
}

export function CareersListing({ jobs, listingSourceUrl }: { jobs: CareerItem[]; listingSourceUrl: string }) {
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
            <h1 data-scroll-reveal className="mobile-page-title mt-6 text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl lg:text-6xl xl:text-7xl">
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
              {/* <a
                href={listingSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="magnetic inline-flex min-h-12 items-center rounded-full border border-white/18 px-7 text-sm font-black uppercase tracking-[0.1em] text-white/78 transition hover:border-white hover:text-white"
              >
                Danh sách Lark
              </a> */}
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
              <h2 data-scroll-reveal className="mobile-page-title mt-6 text-3xl font-black uppercase leading-[0.95] sm:text-4xl lg:text-5xl">
                Tất cả vị trí <span className="text-[#ff7648]">đang tuyển</span>
              </h2>
            </div>
            {/* <p data-scroll-reveal className="max-w-2xl text-base font-medium leading-8 text-white/68 md:text-lg">
              Mỗi vai trò đều là một mảnh ghép trong hệ thống vận hành toàn cầu của GoBeyond. Nội dung có thể chỉnh sửa trong Payload CMS.
            </p> */}
          </div>

          {jobs.length > 0 ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job, index) => (
                <JobCard key={job.slug} job={job} index={index} />
              ))}
            </div>
          ) : (
            <div data-scroll-card className="mt-10 border border-white/12 bg-[#101520]/82 p-8 text-white shadow-[0_28px_82px_rgba(0,0,0,0.26)] backdrop-blur-md md:p-10">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">Tuyển dụng</p>
              <h3 className="mt-4 text-2xl font-black uppercase tracking-normal text-white md:text-4xl">
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
    <div className="grid gap-4 md:gap-5">
      {blocks.map((block, index) => {
        const key = `${block.key}-${index}`;

        if (block.kind === "heading") {
          return (
            <h3 key={key} className="pt-4 text-2xl font-black leading-tight text-white first:pt-0 md:text-3xl">
              {block.segments.map(renderRichTextSegment)}
            </h3>
          );
        }

        if (block.kind === "subheading") {
          return (
            <h4 key={key} className="pt-1 text-xl font-black leading-snug text-white underline decoration-white/70 decoration-1 underline-offset-4 md:text-2xl">
              {block.segments.map(renderRichTextSegment)}
            </h4>
          );
        }

        if (block.kind === "paragraph") {
          return (
            <p key={key} className="text-base font-medium leading-8 text-white/82 md:text-[18px] md:leading-8">
              {block.segments.map(renderRichTextSegment)}
            </p>
          );
        }

        if (block.kind === "subitem") {
          return (
            <div key={key} className="ml-8 grid grid-cols-[7px_minmax(0,1fr)] gap-4 md:ml-11">
              <span className="text-base font-bold leading-7 text-white/78 md:text-[17px] md:leading-8" aria-hidden="true">
                ◦
              </span>
              <div className="min-w-0 text-base font-medium leading-7 text-white/82 md:text-[17px] md:leading-8">
                {block.segments.map(renderRichTextSegment)}
              </div>
            </div>
          );
        }

        return (
          <div key={key} className="ml-6 grid grid-cols-[7px_minmax(0,1fr)] gap-4 md:ml-8">
            <span className="text-base font-bold leading-7 text-white/86 md:text-[17px] md:leading-8" aria-hidden="true">
              •
            </span>
            <div className="min-w-0 text-base font-medium leading-7 text-white/84 md:text-[17px] md:leading-8">
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

function getQrCodeUrl(value?: string) {
  if (!value || !/^https?:\/\//i.test(value)) {
    return null;
  }

  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(value)}`;
}

function formatSlugTitle(slug: string) {
  const title = slug
    .replace(/^jd[-_]?/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\bfull time\b/gi, "Full-time")
    .replace(/\bintern\b/gi, "Intern")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-z]/g, (character) => character.toUpperCase());

  return title || "Vị trí tuyển dụng";
}

function getCareerTitle(job: CareerItem) {
  return job.title?.trim() || formatSlugTitle(job.slug);
}

function getApplyUrl(job: CareerItem) {
  const subject = encodeURIComponent(`[GoBeyond - ${getCareerTitle(job).toUpperCase()}] Ho va ten`);

  if (isActionUrl(job.applyUrl)) {
    const applyUrl = job.applyUrl as string;

    if (applyUrl.toLowerCase().startsWith("mailto:") && !applyUrl.includes("?")) {
      return `${applyUrl}?subject=${subject}`;
    }

    return applyUrl;
  }

  return `mailto:tuyendung@gobe.asia?subject=${subject}`;
}

function getDisplayDate(job: CareerItem) {
  if (job.dateLabel && !/^\d{4}$/.test(job.dateLabel.trim())) {
    return job.dateLabel;
  }

  if (!job.publishedAt) {
    return "12/06/2026";
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
  const title = getCareerTitle(job);

  return [
    `Theo dõi mục tiêu của vị trí ${title} và biến kế hoạch thành kết quả thực tế theo từng tuần.`,
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

  const title = getCareerTitle(job);
  const updateField = (field: keyof typeof form) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const subject = `[GoBeyond - ${title.toUpperCase()}] ${form.name || "Ho va ten"}`;
    const body = [
      `Vi tri ung tuyen: ${title}`,
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
          className="mt-2 h-12 w-full border border-white/16 bg-white/[0.04] px-4 text-sm font-bold text-white outline-none transition placeholder:text-white/28 focus:border-[#F26522] focus:bg-white/[0.06]"
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
            className="mt-2 h-12 w-full border border-white/16 bg-white/[0.04] px-4 text-sm font-bold text-white outline-none transition placeholder:text-white/28 focus:border-[#F26522] focus:bg-white/[0.06]"
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
            className="mt-2 h-12 w-full border border-white/16 bg-white/[0.04] px-4 text-sm font-bold text-white outline-none transition placeholder:text-white/28 focus:border-[#F26522] focus:bg-white/[0.06]"
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
          className="mt-2 h-12 w-full border border-white/16 bg-white/[0.04] px-4 text-sm font-bold text-white outline-none transition placeholder:text-white/28 focus:border-[#F26522] focus:bg-white/[0.06]"
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
          className="mt-2 w-full resize-none border border-white/16 bg-white/[0.04] px-4 py-3 text-sm font-bold leading-6 text-white outline-none transition placeholder:text-white/28 focus:border-[#F26522] focus:bg-white/[0.06]"
          placeholder="Bạn muốn GoBeyond biết thêm điều gì?"
        />
      </div>
      <button
        type="submit"
        className="mt-1 inline-flex min-h-12 items-center justify-center rounded-full bg-[#F26522] px-6 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_42px_rgba(242,101,34,0.26)] transition-colors hover:bg-[#d94d12]"
      >
        Gửi đơn ứng tuyển
      </button>
    </form>
  );
}

type FixedApplicationState = {
  height: number;
  left: number;
  maxHeight: number;
  top: number;
  width: number;
};

function CareerApplicationCard({ applyUrl, job }: { applyUrl: string; job: CareerItem }) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const [fixedState, setFixedState] = useState<FixedApplicationState | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    let frame = 0;

    const updateFixedState = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const placeholder = placeholderRef.current;
        const panel = panelRef.current;

        if (!placeholder || !panel || !mediaQuery.matches) {
          setFixedState(null);
          return;
        }

        const top = window.innerWidth >= 1280 ? 112 : 96;
        const stopGap = 24;
        const placeholderRect = placeholder.getBoundingClientRect();
        const detailContent = document.querySelector<HTMLElement>("[data-career-detail-content]");
        const detailContentRect = detailContent?.getBoundingClientRect();
        const footer = document.querySelector<HTMLElement>("footer");
        const footerRect = footer?.getBoundingClientRect();
        const baseMaxHeight = Math.max(360, window.innerHeight - top - 16);
        const boundaryBottom = Math.min(detailContentRect?.bottom ?? Number.POSITIVE_INFINITY, footerRect?.top ?? Number.POSITIVE_INFINITY);
        const maxHeight = Number.isFinite(boundaryBottom)
          ? Math.max(220, Math.min(baseMaxHeight, boundaryBottom - top - stopGap))
          : baseMaxHeight;
        const height = Math.min(panel.scrollHeight, maxHeight);

        if (placeholderRect.top > top) {
          setFixedState(null);
          return;
        }

        setFixedState({
          height,
          left: placeholderRect.left,
          maxHeight,
          top: Number.isFinite(boundaryBottom) ? Math.min(top, boundaryBottom - height - stopGap) : top,
          width: placeholderRect.width,
        });
      });
    };

    updateFixedState();
    window.addEventListener("scroll", updateFixedState, { passive: true });
    window.addEventListener("resize", updateFixedState);
    mediaQuery.addEventListener("change", updateFixedState);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateFixedState);
      window.removeEventListener("resize", updateFixedState);
      mediaQuery.removeEventListener("change", updateFixedState);
    };
  }, []);

  const fixedStyle = fixedState
    ? ({
      left: fixedState.left,
      maxHeight: fixedState.maxHeight,
      position: "fixed",
      top: fixedState.top,
      width: fixedState.width,
    } satisfies CSSProperties)
    : undefined;

  return (
    <div
      ref={placeholderRef}
      className="order-1 z-20 scroll-mt-28 lg:order-2 lg:self-start"
      style={fixedState ? { minHeight: fixedState.height } : undefined}
    >
      <aside
        ref={panelRef}
        id="career-application"
        data-scroll-card
        className="border border-white/14 bg-[#101520]/82 p-5 shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md sm:p-6 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto xl:max-h-[calc(100dvh-8rem)]"
        style={fixedStyle}
      >
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">Application form</p>
        <h2 className="mt-4 text-2xl font-black uppercase leading-tight text-white sm:text-3xl lg:text-2xl">Ứng tuyển vị trí này</h2>
        <p className="mt-4 text-sm font-semibold leading-7 text-white/58">
          Điền nhanh thông tin, hệ thống sẽ mở email gửi tới team tuyển dụng GoBeyond.
        </p>
        <div className="mt-6">
          <CareerApplicationForm applyUrl={applyUrl} job={job} />
        </div>
      </aside>
    </div>
  );
}

export function CareerDetail({ job }: { job: CareerItem }) {
  const jdContent = extractRichTextBlocks(job.description, "jd-content");
  const responsibilities = detailBlocks(job.responsibilities);
  const requirements = detailBlocks(job.requirements);
  const benefits = detailBlocks(job.benefits);
  const hasJdContent = jdContent.length > 0;
  const displayedResponsibilities =
    responsibilities.length > 0 ? responsibilities : fallbackBlocks(getFallbackResponsibilities(job), "fallback-responsibility");
  const displayedRequirements = requirements.length > 0 ? requirements : fallbackBlocks(getFallbackRequirements(job), "fallback-requirement");
  const displayedBenefits = benefits.length > 0 ? benefits : fallbackBlocks(getFallbackBenefits(), "fallback-benefit");
  const tag = job.tag || "hiring";
  const title = getCareerTitle(job);
  const applyUrl = getApplyUrl(job);
  const larkUrl = isActionUrl(job.larkUrl) ? job.larkUrl : null;
  // const description =
  //   (typeof job.description === "string" ? job.description : "") ||
  //   job.excerpt ||
  //   "";
  const displayDate = getDisplayDate(job);
  const roleFacts = [
    ["Lĩnh vực", job.department || "Operation"],
    ["Loại hình làm việc", job.employmentType || "Toàn thời gian"],
    ["Số lượng", job.quantity || "01"],
    ["Địa chỉ", job.location || "St Moritz, 1014 Đường Phạm Văn Đồng, TP. Hồ Chí Minh"],
    ["Ngày tuyển", displayDate],
  ];

  return (
    <PageShell>
      <section
        id="career-detail"
        data-scroll-section
        className="relative z-10 bg-[#030711] px-5 py-14 text-white sm:px-8 md:py-20 lg:px-12"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(242,101,34,0.14),transparent_28%),linear-gradient(135deg,#030711,#071026_48%,#02030b)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl">
          <Link
            href="/tuyen-dung"
            data-scroll-reveal
            className="inline-flex items-center text-xs font-black uppercase tracking-[0.18em] text-[#F26522] transition hover:text-white"
          >
            Back to careers
          </Link>

          <header data-scroll-reveal className="relative mt-8 border-y border-white/14 py-8 md:py-11">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F26522]">{tagLabels[tag] || tagLabels.hiring}</p>
            <h1 className="mt-4 max-w-4xl text-2xl font-black uppercase leading-[1.08] text-white sm:text-3xl md:text-4xl lg:text-[2.8rem]">
              {title}
            </h1>
            {/* <p className="mt-7 max-w-4xl text-lg font-semibold leading-8 text-white/72 md:text-xl md:leading-9">{description}</p> */}

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                className="magnetic inline-flex min-h-12 items-center justify-center rounded-full bg-[#F26522] px-6 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_42px_rgba(242,101,34,0.24)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]"
                href="#career-application"
              >
                Ứng tuyển ngay
              </a>
              {/* {larkUrl ? (
                <a
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 text-sm font-black uppercase tracking-[0.1em] text-white/76 transition hover:border-[#F26522] hover:text-white"
                  href={larkUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Xem JD gốc
                </a>
              ) : null} */}
              <Link
                href="/tuyen-dung"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 text-sm font-black uppercase tracking-[0.1em] text-white/76 transition hover:border-[#F26522] hover:text-white"
              >
                Tất cả vị trí
              </Link>
            </div>

            <p className="mt-5 text-sm font-semibold leading-7 text-white/52">
              Gửi CV tới <span className="font-black text-white">tuyendung@gobe.asia</span> với tiêu đề{" "}
              <span className="font-black text-[#F26522]">[GoBeyond - {title.toUpperCase()}] Họ và tên</span>.
            </p>
          </header>

          <div className="relative mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] lg:items-start">
            <CareerApplicationCard applyUrl={applyUrl} job={job} />

            <article data-career-detail-content className="order-2 min-w-0 lg:order-1">
              <DetailSection eyebrow="" title="About the role">
                <div className="grid gap-6">
                  {/* <p>{description}</p> */}
                  <dl className="grid gap-1">
                    {roleFacts.map(([label, value]) => (
                      <div key={label} className="grid gap-2.5 py-5 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start sm:py-4">
                        <dt className="text-[15px] font-black uppercase leading-5 tracking-[0.18em] text-[#F26522] sm:text-[10px] sm:leading-normal">
                          {label}
                        </dt>
                        <dd className="text-[17px] font-black leading-7 text-white/88 sm:text-base sm:leading-6">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </DetailSection>
              {hasJdContent ? (
                <DetailSection eyebrow="" title="Chi tiết JD">
                  <DetailContentList blocks={jdContent} />
                </DetailSection>
              ) : (
                <>
                  <DetailSection eyebrow="" title="What you will do">
                    <DetailContentList blocks={displayedResponsibilities} />
                  </DetailSection>
                  <DetailSection eyebrow="" title="What we are looking for">
                    <DetailContentList blocks={displayedRequirements} />
                  </DetailSection>
                  <DetailSection eyebrow="" title="What you can expect">
                    <DetailContentList blocks={displayedBenefits} />
                  </DetailSection>
                </>
              )}
              <DetailSection eyebrow="" title="Working time">
                <p>{job.workingTime || "Thông tin sẽ được trao đổi cụ thể trong quá trình phỏng vấn."}</p>
              </DetailSection>
            </article>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
