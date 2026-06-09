"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { fetchPayloadDocs, normalizeCmsAssetUrl } from "@/lib/cmsClient";
import type { NewsBlock, NewsPost } from "@/lib/news";
import { CustomCursor } from "./CustomCursor";
import { FooterSection } from "./LegacySections";
import { Navbar } from "./Navbar";
import { initScrollController } from "./ScrollController";

type NewsSurface = "news" | "activity";

const surfaceCopy = {
  news: {
    backHref: "/tin-tuc",
    backLabel: "Tin tức",
    eyebrow: "Tin tức GoBeyond",
    heading: "Câu chuyện, cập nhật và góc nhìn vận hành.",
    emptyHeading: "Chưa có tin tức",
    emptyBody: "Khi team đăng bài Tin tức trong Payload CMS, danh sách sẽ tự động hiển thị tại đây.",
    readLabel: "Đọc bài viết",
    featureLabel: "Bài mới nhất",
    archiveLabel: "Dòng tin GoBeyond",
    metaLabel: "Newsroom",
  },
  activity: {
    backHref: "/hoat-dong",
    backLabel: "Hoạt động",
    eyebrow: "Hoạt động GoBeyond",
    heading: "Những hoạt động, sự kiện và khoảnh khắc của đội ngũ GoBeyond.",
    emptyHeading: "Chưa có hoạt động",
    emptyBody:
      "Tạo bài trong Payload CMS, chọn tag Hoạt động, đặt trạng thái Đã xuất bản, nội dung hoạt động sẽ tự động hiển thị tại đây.",
    readLabel: "Xem hoạt động",
    featureLabel: "Hoạt động nổi bật",
    archiveLabel: "Nhật ký hoạt động",
    metaLabel: "Culture",
  },
} satisfies Record<NewsSurface, Record<string, string>>;

function NewsPageShell({ children }: { children: ReactNode }) {
  useEffect(() => initScrollController(), []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#000314] text-white">
      <CustomCursor />
      <Navbar />
      {children}
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

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

function getPostHref(surface: NewsSurface, slug: string) {
  return `${surfaceCopy[surface].backHref}/${slug}`;
}

function VisualPanel({ post, surface, compact = false }: { post: NewsPost; surface: NewsSurface; compact?: boolean }) {
  const heroUrl = getMediaUrl(post.heroImage);
  const label = surface === "activity" ? "GO ACTIVITY" : "GO NEWS";

  return (
    <div className={`relative overflow-hidden border border-white/12 bg-[#071026] ${compact ? "aspect-[16/10]" : "min-h-[300px] lg:min-h-[520px]"}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_34%,rgba(242,101,34,0.28),transparent_26%),radial-gradient(circle_at_16%_14%,rgba(90,162,232,0.16),transparent_30%),linear-gradient(135deg,#070b17,#09172d_48%,#02030b)]" />
      <div className="grid-mask pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      {heroUrl ? (
        <img src={heroUrl} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-78 mix-blend-screen" />
      ) : null}
      <div className="absolute left-5 top-5 z-[2] text-[10px] font-black uppercase tracking-[0.22em] text-[#F26522] md:left-7 md:top-7">
        {label}
      </div>
      <div className="absolute bottom-5 left-5 right-5 z-[2] md:bottom-7 md:left-7 md:right-7">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/52">{formatPostDate(post.publishedAt)}</p>
        <p className={`mt-3 font-black uppercase leading-[0.88] tracking-normal text-white/95 ${compact ? "text-3xl" : "text-5xl md:text-7xl"}`}>
          {surface === "activity" ? "BEYOND" : "UPDATE"}
        </p>
      </div>
      <div className="pointer-events-none absolute -bottom-16 -right-10 text-[11rem] font-black uppercase leading-none text-[#F26522]/16 md:text-[18rem]">
        GO
      </div>
    </div>
  );
}

function NewsCard({ post, surface, index }: { post: NewsPost; surface: NewsSurface; index: number }) {
  const copy = surfaceCopy[surface];

  return (
    <Link
      href={getPostHref(surface, post.slug)}
      prefetch={false}
      data-scroll-card
      className="group relative grid overflow-hidden border border-white/12 bg-[#101520]/82 text-white shadow-[0_24px_70px_rgba(0,0,0,0.26)] backdrop-blur-md transition hover:-translate-y-2 hover:border-[#F26522]/70 hover:shadow-[0_30px_90px_rgba(242,101,34,0.14)]"
    >
      <VisualPanel post={post} surface={surface} compact />
      <div className="p-6 md:p-7">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F26522]">{String(index + 1).padStart(2, "0")} / {copy.metaLabel}</p>
          <p className="shrink-0 text-[10px] font-black uppercase tracking-[0.16em] text-white/38">{formatPostDate(post.publishedAt)}</p>
        </div>
        <h2 className="mt-5 text-2xl font-black uppercase leading-tight tracking-normal text-white md:text-3xl">{post.title}</h2>
        <p className="mt-4 line-clamp-4 text-sm font-semibold leading-6 text-white/62">{post.excerpt}</p>
        <span className="mt-7 inline-flex min-h-10 items-center rounded-full border border-white/16 px-4 text-xs font-black uppercase tracking-[0.12em] text-white/72 transition group-hover:border-[#F26522] group-hover:bg-[#F26522] group-hover:text-white">
          {copy.readLabel}
        </span>
      </div>
    </Link>
  );
}

function mergePostsWithFallback(docs: NewsPost[], fallback: NewsPost[]) {
  if (docs.length === 0) {
    return fallback;
  }

  return docs;
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
          <img src={imageUrl} alt={getText(block.caption, "Hình ảnh tin tức GoBeyond")} className="aspect-[16/9] w-full object-cover" />
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
            {getText(block.label, "Liên hệ GoBeyond")}
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
            {getText(cta.label, "Liên hệ GoBeyond")}
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
    ? new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(new Date(post.publishedAt))
    : "Bản nháp";

  return (
    <NewsPageShell>
      <main className="relative min-h-screen overflow-hidden bg-[#000314] px-5 pb-20 pt-32 text-white md:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_16%,rgba(242,101,34,0.18),transparent_28%),linear-gradient(135deg,#000314_0%,#071026_52%,#02030b_100%)]" />
        <div className="grid-mask pointer-events-none absolute inset-0 opacity-22" aria-hidden="true" />

        <article className="relative mx-auto max-w-5xl">
          <Link href={copy.backHref} className="text-sm font-black uppercase tracking-[0.18em] text-[#F26522]">
            {copy.backLabel}
          </Link>
          <header className="mt-8 border-b border-white/12 pb-12">
            <p className="text-sm uppercase tracking-[0.18em] text-white/46">{published}</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-none tracking-normal md:text-7xl">{post.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-white/68">{post.excerpt}</p>
          </header>
          <div className="mt-12 grid gap-12">{(post.layout || []).map(renderBlock)}</div>
        </article>
      </main>
    </NewsPageShell>
  );
}

export function NewsListing({ posts, surface = "news" }: { posts: NewsPost[]; surface?: NewsSurface }) {
  const copy = surfaceCopy[surface];
  const [livePosts, setLivePosts] = useState(posts);

  useEffect(() => {
    let mounted = true;
    const params: Record<string, string | number> =
      surface === "activity"
        ? {
            depth: 2,
            limit: 24,
            sort: "-publishedAt",
            "where[status][equals]": "published",
            "where[tag][equals]": "activity",
          }
        : {
            depth: 2,
            limit: 24,
            sort: "-publishedAt",
            "where[status][equals]": "published",
            "where[tag][not_equals]": "activity",
          };

    fetchPayloadDocs<NewsPost>("news", params)
      .then((docs) => {
        if (mounted) {
          setLivePosts(mergePostsWithFallback(docs, posts));
        }
      })
      .catch(() => {
        if (mounted) {
          setLivePosts(posts);
        }
      });

    return () => {
      mounted = false;
    };
  }, [posts, surface]);

  const featured = livePosts[0];
  const archivePosts = livePosts.slice(1);

  return (
    <NewsPageShell>
      <main className="relative bg-[#000314] text-white">
        <section data-scroll-section className="relative z-10 min-h-[82vh] overflow-hidden px-5 pb-16 pt-32 sm:px-8 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_16%,rgba(242,101,34,0.22),transparent_30%),radial-gradient(circle_at_18%_30%,rgba(90,162,232,0.14),transparent_28%),linear-gradient(135deg,#000314_0%,#071026_50%,#02030b_100%)]" />
          <div className="grid-mask pointer-events-none absolute inset-0 opacity-24" aria-hidden="true" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.46fr)_minmax(0,0.54fr)]">
            <div data-scroll-reveal>
              <SectionMark current="01" label={copy.metaLabel} />
              <h1 className="mt-6 text-5xl font-black uppercase leading-[0.86] tracking-normal sm:text-6xl lg:text-7xl xl:text-8xl">
                {surface === "activity" ? "Hoạt động" : "Tin tức"}
                <span className="block text-[#ff7648]">GoBeyond</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base font-semibold leading-8 text-white/68 md:text-lg">{copy.heading}</p>
              <div className="mt-8 grid max-w-lg grid-cols-2 gap-px overflow-hidden border border-white/12 bg-white/12">
                <div className="bg-[#101520]/88 p-5">
                  <p className="text-3xl font-black text-[#F26522]">{String(livePosts.length).padStart(2, "0")}</p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/48">Bài hiển thị</p>
                </div>
                <div className="bg-[#101520]/88 p-5">
                  <p className="text-3xl font-black text-white">CMS</p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/48">Fallback từ site cũ</p>
                </div>
              </div>
            </div>

            {featured ? (
              <Link
                href={getPostHref(surface, featured.slug)}
                prefetch={false}
                data-scroll-media
                className="group relative grid overflow-hidden border border-white/12 bg-[#101520]/72 shadow-[0_34px_120px_rgba(0,0,0,0.34)] backdrop-blur-md transition hover:-translate-y-2 hover:border-[#F26522]/70"
              >
                <VisualPanel post={featured} surface={surface} />
                <div className="border-t border-white/12 p-6 md:p-8">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F26522]">{copy.featureLabel}</p>
                  <h2 className="mt-4 text-3xl font-black uppercase leading-tight tracking-normal text-white md:text-5xl">{featured.title}</h2>
                  <p className="mt-5 max-w-3xl text-base font-semibold leading-7 text-white/66">{featured.excerpt}</p>
                  <span className="mt-7 inline-flex min-h-11 items-center rounded-full bg-[#F26522] px-5 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_16px_38px_rgba(242,101,34,0.24)] transition group-hover:bg-[#d94d12]">
                    {copy.readLabel}
                  </span>
                </div>
              </Link>
            ) : null}
          </div>
        </section>

        <section data-scroll-section className="relative z-10 overflow-hidden bg-[#030711] px-5 py-20 text-white sm:px-8 md:py-24 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(242,101,34,0.14),transparent_28%),linear-gradient(135deg,#030711,#071026_48%,#02030b)]" />
          <div className="grid-mask pointer-events-none absolute inset-0 opacity-18" aria-hidden="true" />

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,0.5fr)_minmax(0,0.5fr)]">
              <div data-scroll-reveal>
                <SectionMark current="02" label={copy.archiveLabel} />
                <h2 className="mt-6 text-4xl font-black uppercase leading-[0.9] tracking-normal sm:text-5xl lg:text-7xl">
                  Cập nhật
                  <span className="block text-[#ff7648]">mới nhất</span>
                </h2>
              </div>
              <p data-scroll-reveal className="max-w-2xl text-base font-semibold leading-8 text-white/64 md:text-lg">
                Dữ liệu đang ưu tiên bài đã xuất bản từ Payload CMS. Khi CMS chưa có bài phù hợp, trang sẽ dùng lại một số nội dung từ website cũ để không bị trống.
              </p>
            </div>

            {livePosts.length > 0 ? (
              <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {(archivePosts.length > 0 ? archivePosts : livePosts).map((post, index) => (
                  <NewsCard key={post.slug} post={post} surface={surface} index={featured && archivePosts.length > 0 ? index + 1 : index} />
                ))}
              </div>
            ) : (
              <div data-scroll-card className="mt-10 border border-white/12 bg-[#101520]/82 p-8 text-white shadow-[0_28px_82px_rgba(0,0,0,0.26)] backdrop-blur-md md:p-10">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">{copy.backLabel}</p>
                <h2 className="mt-4 text-3xl font-black uppercase text-white md:text-5xl">{copy.emptyHeading}</h2>
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
