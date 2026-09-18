"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { normalizeCmsAssetUrl } from "@/lib/cmsClient";
import type { NewsBlock, NewsPost, NewsRichText, NewsRichTextNode } from "@/lib/news";
import { CustomCursor } from "./CustomCursor";
import { FooterBridge, FooterSection } from "./LegacySections";
import { Navbar } from "./Navbar";
import { initScrollController } from "./ScrollController";

type NewsSurface = "news" | "activity";

const surfaceCopy = {
  news: {
    backHref: "/tin-tuc",
    backLabel: "News",
    eyebrow: "GoBeyond News",
    heading: "Stories, updates, and operational insights.",
    heroTitle: "News",
    heroAccent: "GoBeyond",
    heroImageUrl: "/Recap-2025-5.png",
    heroImageAlt: "GoBeyond News page cover image",
    listTitle: "All news",
    listAccent: "updates",
    emptyHeading: "No news yet",
    emptyBody: "When the team publishes News posts in Payload CMS, they will appear here automatically.",
    primaryCta: "View news",
    readLabel: "Read article",
    metaLabel: "Newsroom",
    overviewLabel: "Article information",
    previewLabel: "Latest update",
  },
  activity: {
    backHref: "/hoat-dong",
    backLabel: "Activities",
    eyebrow: "GoBeyond Activities",
    heading: "Team activities, events, and moments from GoBeyond.",
    heroTitle: "Activities",
    heroAccent: "GoBeyond",
    heroImageUrl: "/hero-showcase.jpg",
    heroImageAlt: "GoBeyond Activities page cover image",
    listTitle: "All activities",
    listAccent: "latest",
    emptyHeading: "No activities yet",
    emptyBody:
      "Create a post in Payload CMS, choose the Activities tag, set it to Published, and it will appear here automatically.",
    primaryCta: "View activities",
    readLabel: "View activity",
    metaLabel: "Culture",
    overviewLabel: "Activity information",
    previewLabel: "Latest activity",
  },
} satisfies Record<NewsSurface, Record<string, string>>;

function NewsPageShell({ children }: { children: ReactNode }) {
  useEffect(() => initScrollController(), []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#000314] text-white">
      <CustomCursor />
      <Navbar />
      {children}
      <FooterBridge />
      <FooterSection />
    </div>
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

function getMediaUrl(media: unknown) {
  if (media && typeof media === "object" && "url" in media && typeof media.url === "string") {
    return normalizeCmsAssetUrl(media.url);
  }

  return null;
}

function getMediaAlt(media: unknown) {
  if (media && typeof media === "object" && "alt" in media && typeof media.alt === "string") {
    return media.alt;
  }

  return null;
}

function getMediaMimeType(media: unknown) {
  if (media && typeof media === "object" && "mimeType" in media && typeof media.mimeType === "string") {
    return media.mimeType;
  }

  return null;
}

function isVideoMedia(media: unknown, url?: string | null) {
  const mimeType = getMediaMimeType(media);

  if (mimeType?.startsWith("video/")) {
    return true;
  }

  return Boolean(url?.split("?")[0]?.toLowerCase().endsWith(".mp4"));
}

function isMp4Url(value: string) {
  try {
    const url = new URL(value.trim());

    return url.protocol.startsWith("http") && url.pathname.toLowerCase().endsWith(".mp4");
  } catch {
    return false;
  }
}

function getText(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function formatPostDate(value?: string) {
  if (!value) {
    return "GoBeyond";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

type RichTextSegment = {
  format?: number | string;
  text: string;
};

type ArticleContentBlock = {
  caption?: string;
  imageAlt?: string;
  imageUrl?: string;
  kind: "heading" | "subheading" | "paragraph" | "item" | "subitem" | "quote" | "image" | "video";
  key: string;
  media?: unknown;
  segments: RichTextSegment[];
  videoUrl?: string;
};

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

function getInlineSegments(node: NewsRichTextNode): RichTextSegment[] {
  if (typeof node.text === "string") {
    return [{ format: node.format, text: node.text }];
  }

  if (!Array.isArray(node.children)) {
    return [];
  }

  return node.children.filter((child) => child.type !== "list").flatMap(getInlineSegments);
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

function textToArticleBlocks(text: string, keyPrefix: string): ArticleContentBlock[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map<ArticleContentBlock>((paragraph, index) =>
      isMp4Url(paragraph)
        ? {
            key: `${keyPrefix}-${index}`,
            kind: "video",
            segments: [],
            videoUrl: normalizeCmsAssetUrl(paragraph) || paragraph,
          }
        : {
            key: `${keyPrefix}-${index}`,
            kind: "paragraph",
            segments: [{ text: paragraph }],
          },
    );
}

function extractRichTextBlocks(value?: NewsRichText, keyPrefix = "content"): ArticleContentBlock[] {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return textToArticleBlocks(value, keyPrefix);
  }

  const children = value.root?.children;

  if (!Array.isArray(children)) {
    return [];
  }

  const blocks: ArticleContentBlock[] = [];

  const pushTextBlock = (node: NewsRichTextNode, kind: ArticleContentBlock["kind"], key: string) => {
    splitSegmentsByLine(normalizeSegments(getInlineSegments(node))).forEach((segments, index) => {
      blocks.push({ key: `${key}-${index}`, kind, segments });
    });
  };

  const pushSegmentsBlock = (segments: RichTextSegment[], kind: ArticleContentBlock["kind"], key: string) => {
    splitSegmentsByLine(normalizeSegments(segments)).forEach((lineSegments, index) => {
      const text = lineSegments.map((segment) => segment.text).join("").trim();

      blocks.push(
        isMp4Url(text)
          ? {
              key: `${key}-${index}`,
              kind: "video",
              segments: [],
              videoUrl: normalizeCmsAssetUrl(text) || text,
            }
          : { key: `${key}-${index}`, kind, segments: lineSegments },
      );
    });
  };

  const pushUploadBlock = (node: NewsRichTextNode, key: string) => {
    const mediaUrl = getMediaUrl(node.value);

    blocks.push({
      caption: node.fields?.caption,
      key,
      kind: isVideoMedia(node.value, mediaUrl) ? "video" : "image",
      media: node.value,
      segments: [],
    });
  };

  const pushExternalImageBlock = (node: NewsRichTextNode, key: string) => {
    if (!node.src) {
      return;
    }

    blocks.push({
      caption: node.title,
      imageAlt: node.alt,
      imageUrl: node.src,
      key,
      kind: "image",
      segments: [],
    });
  };

  const pushMixedChildren = (children: NewsRichTextNode[], kind: ArticleContentBlock["kind"], key: string, listDepth: number) => {
    let segmentBuffer: RichTextSegment[] = [];

    const flushSegments = (segmentKey: string) => {
      pushSegmentsBlock(segmentBuffer, kind, segmentKey);
      segmentBuffer = [];
    };

    children.forEach((child, index) => {
      if (child.type === "upload") {
        flushSegments(`${key}-before-upload-${index}`);
        pushUploadBlock(child, `${key}-upload-${index}`);
        return;
      }

      if (child.type === "externalImage") {
        flushSegments(`${key}-before-external-image-${index}`);
        pushExternalImageBlock(child, `${key}-external-image-${index}`);
        return;
      }

      if (child.type === "list") {
        flushSegments(`${key}-before-list-${index}`);
        visit(child, `${key}-list-${index}`, listDepth + 1);
        return;
      }

      segmentBuffer = segmentBuffer.concat(getInlineSegments(child));
    });

    flushSegments(`${key}-after`);
  };

  const visit = (node: NewsRichTextNode, key: string, listDepth = 0) => {
    if (node.type === "upload") {
      pushUploadBlock(node, key);
      return;
    }

    if (node.type === "externalImage") {
      pushExternalImageBlock(node, key);
      return;
    }

    if (node.type === "list" && Array.isArray(node.children)) {
      node.children.forEach((child, index) => visit(child, `${key}-list-${index}`, listDepth));
      return;
    }

    if (node.type === "listitem") {
      if (node.children?.some((child) => child.type === "upload" || child.type === "externalImage")) {
        pushMixedChildren(node.children, listDepth > 0 ? "subitem" : "item", key, listDepth);
        return;
      }

      pushTextBlock(node, listDepth > 0 ? "subitem" : "item", key);
      node.children?.filter((child) => child.type === "list").forEach((child, index) => visit(child, `${key}-nested-${index}`, listDepth + 1));
      return;
    }

    if (node.type === "heading") {
      pushTextBlock(node, node.tag === "h3" || node.tag === "h4" ? "subheading" : "heading", key);
      return;
    }

    if (node.type === "quote") {
      pushTextBlock(node, "quote", key);
      return;
    }

    if (node.type === "paragraph") {
      if (node.children?.some((child) => child.type === "upload" || child.type === "externalImage")) {
        pushMixedChildren(node.children, "paragraph", key, listDepth);
        return;
      }

      pushTextBlock(node, "paragraph", key);
      return;
    }

    if (Array.isArray(node.children)) {
      node.children.forEach((child, index) => visit(child, `${key}-child-${index}`, listDepth));
      return;
    }

    if (typeof node.text === "string") {
      splitSegmentsByLine([{ format: node.format, text: node.text }]).forEach((segments, index) => {
        blocks.push({ key: `${key}-text-${index}`, kind: "paragraph", segments });
      });
    }
  };

  children.forEach((child, index) => visit(child, `${keyPrefix}-${index}`));
  return blocks;
}

function ArticleContentList({ blocks }: { blocks: ArticleContentBlock[] }) {
  return (
    <div className="grid gap-5 md:gap-6">
      {blocks.map((block, index) => {
        const key = `${block.key}-${index}`;

        if (block.kind === "heading") {
          return (
            <h2 key={key} className="pt-4 text-2xl font-black uppercase leading-tight text-white first:pt-0 md:text-4xl">
              {block.segments.map(renderRichTextSegment)}
            </h2>
          );
        }

        if (block.kind === "subheading") {
          return (
            <h3 key={key} className="pt-2 text-xl font-black leading-snug text-white underline decoration-white/70 decoration-1 underline-offset-4 md:text-2xl">
              {block.segments.map(renderRichTextSegment)}
            </h3>
          );
        }

        if (block.kind === "quote") {
          return (
            <blockquote key={key} className="border-l-2 border-[#F26522] py-2 pl-6 text-xl font-black leading-9 text-white/92 md:text-2xl">
              {block.segments.map(renderRichTextSegment)}
            </blockquote>
          );
        }

        if (block.kind === "image") {
          const imageUrl = block.imageUrl ? normalizeCmsAssetUrl(block.imageUrl) : getMediaUrl(block.media);

          return imageUrl ? (
            <figure key={key} className="overflow-hidden border border-white/12 bg-white/[0.035]">
              <img src={imageUrl} alt={block.imageAlt || block.caption || getMediaAlt(block.media) || "GoBeyond image"} className="aspect-[16/10] w-full object-cover" />
              {block.caption ? <figcaption className="px-5 py-4 text-sm font-semibold leading-6 text-white/58">{block.caption}</figcaption> : null}
            </figure>
          ) : null;
        }

        if (block.kind === "video") {
          const videoUrl = block.videoUrl || getMediaUrl(block.media);
          const mimeType = getMediaMimeType(block.media) || "video/mp4";

          return videoUrl ? (
            <figure key={key} className="overflow-hidden border border-white/12 bg-white/[0.035]">
              <video className="aspect-video w-full bg-black object-contain" controls playsInline preload="metadata">
                <source src={videoUrl} type={mimeType} />
              </video>
              {block.caption ? <figcaption className="px-5 py-4 text-sm font-semibold leading-6 text-white/58">{block.caption}</figcaption> : null}
            </figure>
          ) : null;
        }

        if (block.kind === "item" || block.kind === "subitem") {
          return (
            <div key={key} className={`${block.kind === "subitem" ? "ml-8 md:ml-11" : "ml-6 md:ml-8"} grid grid-cols-[7px_minmax(0,1fr)] gap-4`}>
              <span className="text-base font-bold leading-7 text-white/86 md:text-[17px] md:leading-8" aria-hidden="true">
                {block.kind === "subitem" ? "◦" : "•"}
              </span>
              <div className="min-w-0 text-base font-medium leading-7 text-white/84 md:text-[17px] md:leading-8">
                {block.segments.map(renderRichTextSegment)}
              </div>
            </div>
          );
        }

        return (
          <p key={key} className="text-base font-medium leading-8 text-white/82 md:text-[18px] md:leading-9">
            {block.segments.map(renderRichTextSegment)}
          </p>
        );
      })}
    </div>
  );
}

function getPostHref(surface: NewsSurface, slug: string) {
  return `${surfaceCopy[surface].backHref}/${slug}`;
}

function NewsCard({ post, surface, index }: { post: NewsPost; surface: NewsSurface; index: number }) {
  const copy = surfaceCopy[surface];
  const heroUrl = getMediaUrl(post.heroImage);
  const cardLabel = surface === "activity" ? "Internal activity" : "GoBeyond News";

  return (
    <Link
      href={getPostHref(surface, post.slug)}
      prefetch={false}
      data-scroll-card
      className="group relative min-h-[390px] overflow-hidden border border-white/12 bg-[#101520]/82 p-5 text-white shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md transition hover:-translate-y-2 hover:border-[#F26522]/70 hover:shadow-[0_34px_100px_rgba(242,101,34,0.16)]"
    >
      <span className="absolute left-5 top-5 z-[2] border border-[#F26522] px-2 py-1 text-center text-[10px] font-black uppercase leading-3 text-[#F26522]">
        {formatPostDate(post.publishedAt)}
      </span>
      <div className="absolute right-5 top-5 z-[2] text-right text-sm font-black uppercase leading-none text-[#F26522]">
        GO
        <span className="block text-[10px] text-white/72">beyond</span>
      </div>

      <div className="mt-14 overflow-hidden">
        {/* <div className="mx-auto w-fit rounded-full bg-black px-5 py-2 text-xs font-black uppercase tracking-[0.08em] text-white">
          {cardLabel}
        </div> */}
        <div className="mt-4 overflow-hidden rounded-2xl bg-[#081225]">
          {heroUrl ? (
            <img
              src={heroUrl}
              alt={getMediaAlt(post.heroImage) || post.title}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="grid aspect-[16/10] place-items-center bg-[#F26522] px-5 text-center text-3xl font-black uppercase leading-none text-white">
              {surface === "activity" ? "Activity" : "News"}
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F26522]">
          {copy.metaLabel} / {String(index + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-3 text-2xl font-black uppercase leading-tight text-white">{post.title}</h3>
        {post.excerpt ? <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-white/64">{post.excerpt}</p> : null}
      </div>

      {/* <span className="absolute bottom-5 right-5 rounded-full bg-[#F26522] px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white opacity-0 transition group-hover:opacity-100">
        {copy.readLabel}
      </span> */}
    </Link>
  );
}

function renderBlock(block: NewsBlock, index: number) {
  switch (block.blockType) {
    case "lead":
      return (
        <section key={block.id || index} className="border-l-2 border-[#F26522] pl-6">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-[#F26522]">{getText(block.kicker)}</p>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-5xl">{getText(block.heading)}</h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/72">{getText(block.body)}</p>
        </section>
      );
    case "bodyCopy":
      return (
        <section key={block.id || index} className="news-rich-text max-w-3xl text-lg leading-8 text-white/78">
          {getText(block.content)
            .split(/\n{2,}/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, paragraphIndex) => (
              <p key={paragraphIndex} className="mb-5">
                {paragraph}
              </p>
            ))}
        </section>
      );
    case "featureImage": {
      const imageUrl = getMediaUrl(block.image);
      return imageUrl ? (
        <figure key={block.id || index} className="overflow-hidden border border-white/12 bg-white/[0.03]">
          <img src={imageUrl} alt={getText(block.caption, "GoBeyond news image")} className="aspect-[16/9] w-full object-cover" />
          {block.caption ? <figcaption className="px-5 py-4 text-sm text-white/58">{getText(block.caption)}</figcaption> : null}
        </figure>
      ) : null;
    }
    case "pullQuote":
      return (
        <blockquote key={block.id || index} className="border-y border-white/14 py-10">
          <p className="text-2xl font-black leading-tight text-white md:text-4xl">"{getText(block.quote)}"</p>
          {block.attribution ? <cite className="mt-5 block text-sm not-italic text-[#F26522]">{getText(block.attribution)}</cite> : null}
        </blockquote>
      );
    case "statsGrid": {
      const items = Array.isArray(block.items) ? block.items : [];
      return (
        <section key={block.id || index} className="grid gap-px overflow-hidden border border-white/12 bg-white/12 md:grid-cols-3">
          {items.map((item, itemIndex) => {
            const stat = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return (
              <article key={itemIndex} className="bg-[#101722] p-6">
                <p className="text-4xl font-black text-[#F26522]">{getText(stat.value)}</p>
                <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/58">{getText(stat.label)}</p>
              </article>
            );
          })}
        </section>
      );
    }
    case "checklist": {
      const items = Array.isArray(block.items) ? block.items : [];
      return (
        <section key={block.id || index} className="border border-white/12 bg-[#101722]/76 p-6 md:p-8">
          <h2 className="text-2xl font-black text-white">{getText(block.heading)}</h2>
          <ul className="mt-6 grid gap-4">
            {items.map((item, itemIndex) => {
              const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
              return (
                <li key={itemIndex} className="flex gap-3 text-white/74">
                  <span className="mt-2 h-2 w-2 shrink-0 bg-[#F26522]" />
                  <span>{getText(row.text)}</span>
                </li>
              );
            })}
          </ul>
        </section>
      );
    }
    case "cta":
      return (
        <section key={block.id || index} className="border border-[#F26522]/45 bg-[#F26522]/10 p-7 md:p-9">
          <h2 className="text-3xl font-black text-white">{getText(block.heading)}</h2>
          {block.body ? <p className="mt-4 max-w-2xl text-white/70">{getText(block.body)}</p> : null}
          <Link href={getText(block.href, "/#contact")} className="mt-7 inline-flex bg-[#F26522] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white">
            {getText(block.label, "Contact GoBeyond")}
          </Link>
        </section>
      );
    case "reusableCta": {
      // `cta` is a relationship; depth>=1 populates it to the full doc.
      const cta = block.cta && typeof block.cta === "object" ? (block.cta as Record<string, unknown>) : null;
      if (!cta) {
        return null;
      }
      return (
        <section key={block.id || index} className="border border-[#F26522]/45 bg-[#F26522]/10 p-7 md:p-9">
          <h2 className="text-3xl font-black text-white">{getText(cta.heading)}</h2>
          {cta.body ? <p className="mt-4 max-w-2xl text-white/70">{getText(cta.body)}</p> : null}
          <Link href={getText(cta.href, "/#contact")} className="mt-7 inline-flex bg-[#F26522] px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white">
            {getText(cta.label, "Contact GoBeyond")}
          </Link>
        </section>
      );
    }
    default:
      return null;
  }
}

export function NewsArticle({ post, surface = "news" }: { post: NewsPost; surface?: NewsSurface }) {
  const copy = surfaceCopy[surface];
  const published = post.publishedAt
    ? new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(post.publishedAt))
    : "Draft";
  const contentBlocks = extractRichTextBlocks(post.content, "post-content");
  const heroUrl = getMediaUrl(post.heroImage);
  const facts = [
    ["Category", copy.backLabel],
    ["Published", published],
  ];

  return (
    <NewsPageShell>
      <section data-scroll-section className="relative z-10 overflow-hidden bg-[#030711] px-5 py-14 text-white sm:px-8 md:py-20 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(242,101,34,0.14),transparent_28%),linear-gradient(135deg,#030711,#071026_48%,#02030b)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl">
          <Link
            href={copy.backHref}
            data-scroll-reveal
            className="inline-flex items-center text-xs font-black uppercase tracking-[0.18em] text-[#F26522] transition hover:text-white"
          >
            Back to {copy.backLabel}
          </Link>

          <header data-scroll-reveal className="relative mt-8 border-y border-white/14 py-8 md:py-11">
            {/* <p className="text-xs font-black uppercase tracking-[0.28em] text-[#F26522]">{copy.eyebrow}</p> */}
            <h1 className="mt-4 max-w-4xl text-2xl font-black leading-[1.12] text-white sm:text-3xl md:text-4xl lg:text-[2.8rem]">
              {post.title}
            </h1>
            {post.excerpt ? <p className="mt-7 max-w-4xl text-lg font-semibold leading-8 text-white/72 md:text-xl md:leading-9">{post.excerpt}</p> : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={copy.backHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#F26522] px-6 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_42px_rgba(242,101,34,0.24)] transition hover:bg-[#d94d12]"
              >
                All {copy.backLabel.toLowerCase()}
              </Link>
              {post.sourceUrl ? (
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/18 px-6 text-sm font-black uppercase tracking-[0.1em] text-white/76 transition hover:border-[#F26522] hover:text-white"
                >
                  Original source
                </a>
              ) : null}
            </div>
          </header>

          {heroUrl ? (
            <figure data-scroll-media className="mt-10 overflow-hidden border border-white/12 bg-white/[0.035] shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
              <img src={heroUrl} alt={getMediaAlt(post.heroImage) || post.title} className="aspect-[16/9] w-full object-cover" />
            </figure>
          ) : null}

          <div className="relative mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:items-start">
            <article data-scroll-card className="min-w-0 border-t border-white/12 pt-9 md:pt-11">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#F26522]">Content</p>
              <div className="mt-6">
                {contentBlocks.length > 0 ? (
                  <ArticleContentList blocks={contentBlocks} />
                ) : (
                  <div className="grid gap-12">{(post.layout || []).map(renderBlock)}</div>
                )}
              </div>
            </article>

            <aside data-scroll-card className="border border-white/14 bg-[#101520]/82 p-5 shadow-[0_28px_82px_rgba(0,0,0,0.30)] backdrop-blur-md sm:p-6 lg:sticky lg:top-28">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">{copy.overviewLabel}</p>
              <dl className="mt-6 divide-y divide-white/12 border-y border-white/14 text-sm">
                {facts.map(([label, value]) => (
                  <div key={label} className="grid gap-2 py-4">
                    <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F26522]">{label}</dt>
                    <dd className="text-sm font-black leading-6 text-white/86">{value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </section>
    </NewsPageShell>
  );
}

export function NewsListing({ posts, surface = "news" }: { posts: NewsPost[]; surface?: NewsSurface }) {
  const copy = surfaceCopy[surface];
  const previewPost = posts[0];
  const listId = surface === "activity" ? "activity-list" : "news-list";

  return (
    <NewsPageShell>
      <main className="relative bg-[#000314] text-white">
        <section
          id={surface === "activity" ? "activities" : "news"}
          data-scroll-section
          className="relative z-10 min-h-screen overflow-hidden bg-[#000314] px-5 pt-24 text-white sm:px-8 lg:px-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_16%,rgba(242,101,34,0.20),transparent_28%),radial-gradient(circle_at_20%_34%,rgba(90,162,232,0.18),transparent_30%),linear-gradient(135deg,#000314_0%,#071026_52%,#02030b_100%)]" />
          <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />

          <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 py-10 lg:grid-cols-[minmax(0,0.48fr)_minmax(0,0.52fr)]">
            <div>
              <div data-scroll-reveal>
                <SectionMark current="01" label="" />
              </div>
              <h1 data-scroll-reveal className="mobile-page-title mt-6 text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl lg:text-6xl xl:text-7xl">
                {copy.heroTitle}
                <span className="block text-[#ff7648]">{copy.heroAccent}</span>
              </h1>
              <p data-scroll-reveal className="mt-7 max-w-2xl text-base font-medium leading-8 text-white/70 md:text-lg">
                {copy.heading}
              </p>
              {/* <div data-scroll-reveal className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`#${listId}`}
                  className="magnetic inline-flex min-h-12 items-center rounded-full bg-[#F26522] px-7 text-sm font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_45px_rgba(242,101,34,0.28)] transition hover:-translate-y-0.5 hover:bg-[#d94d12]"
                >
                  {copy.primaryCta}
                </a>
              </div> */}
            </div>

            <figure data-scroll-media className="relative">
              <div className="absolute -inset-5 border border-[#F26522]/28 bg-[#F26522]/8 shadow-[0_34px_120px_rgba(242,101,34,0.14)]" />
              {copy.heroImageUrl ? (
                <img
                  src={copy.heroImageUrl}
                  alt={copy.heroImageAlt}
                  className="relative aspect-[4/3] w-full object-cover object-center"
                />
              ) : (
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#101520]/88 p-8">
                  <div className="grid-mask pointer-events-none absolute inset-0 opacity-22" aria-hidden="true" />
                  <div className="absolute right-8 top-8 text-right text-4xl font-black uppercase leading-none text-[#F26522]/24 md:text-7xl">
                    GO
                    <span className="block text-base text-white/18 md:text-2xl">beyond</span>
                  </div>
                  <div className="relative flex h-full max-w-xl flex-col justify-end">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[#F26522]">{copy.previewLabel}</p>
                    <h2 className="mt-5 text-2xl font-black uppercase leading-tight text-white md:text-4xl">
                      {previewPost?.title || copy.heroTitle}
                    </h2>
                    <p className="mt-5 line-clamp-3 text-base font-semibold leading-7 text-white/64">
                      {previewPost?.excerpt || copy.heading}
                    </p>
                  </div>
                </div>
              )}
            </figure>
          </div>
        </section>

        <section id={listId} data-scroll-section className="relative z-10 overflow-hidden bg-[#030711] px-5 py-24 text-white sm:px-8 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(242,101,34,0.16),transparent_28%),linear-gradient(135deg,#030711,#071026_48%,#02030b)]" />
          <div className="grid-mask pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-end gap-6">
              <div>
                <div data-scroll-reveal>
                  <SectionMark current="02" label="" />
                </div>
                <h3 data-scroll-reveal className="mobile-page-title mt-6 text-3xl font-black uppercase leading-[0.95] sm:text-4xl lg:text-5xl">
                  {copy.listTitle} <span className="text-[#ff7648]">{copy.listAccent}</span>
                </h3>
              </div>
              {/* <p data-scroll-reveal className="max-w-2xl text-base font-medium leading-8 text-white/68 md:text-lg">
                The list is pulled from published posts in Payload CMS. Admins only need to enter the title, short excerpt, and content in the text editor.
              </p> */}
            </div>

            {posts.length > 0 ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post, index) => (
                  <NewsCard key={post.slug} post={post} surface={surface} index={index} />
                ))}
              </div>
            ) : (
              <div data-scroll-card className="mt-10 border border-white/12 bg-[#101520]/82 p-8 text-white shadow-[0_28px_82px_rgba(0,0,0,0.26)] backdrop-blur-md md:p-10">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">{copy.backLabel}</p>
                <h2 className="mt-4 text-2xl font-black uppercase text-white md:text-4xl">{copy.emptyHeading}</h2>
                <p className="mt-5 max-w-2xl text-base leading-8 text-white/66">{copy.emptyBody}</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </NewsPageShell>
  );
}

export function ActivityListing({ posts }: { posts: NewsPost[] }) {
  return <NewsListing posts={posts} surface="activity" />;
}

export function ActivityArticle({ post }: { post: NewsPost }) {
  return <NewsArticle post={post} surface="activity" />;
}
