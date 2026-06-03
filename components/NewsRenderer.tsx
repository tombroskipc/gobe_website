import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import type { NewsBlock, NewsPost } from "@/lib/news";

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
  },
} satisfies Record<NewsSurface, Record<string, string>>;

function isLexical(value: unknown): value is SerializedEditorState {
  return Boolean(value && typeof value === "object" && "root" in (value as Record<string, unknown>));
}

function getMediaUrl(media: unknown) {
  if (media && typeof media === "object" && "url" in media && typeof media.url === "string") {
    return media.url;
  }

  return null;
}

function getText(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
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
          {isLexical(block.content) ? (
            <RichText data={block.content} />
          ) : (
            getText(block.content)
              .split("\n")
              .filter(Boolean)
              .map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="mb-5">
                  {paragraph}
                </p>
              ))
          )}
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
    <main className="min-h-screen bg-[#0c1018] px-5 py-24 text-white md:px-10">
      <article className="mx-auto max-w-5xl">
        <Link href={copy.backHref} className="text-sm font-black uppercase tracking-[0.18em] text-[#F26522]">
          {copy.backLabel}
        </Link>
        <header className="mt-8 border-b border-white/12 pb-12">
          <p className="text-sm uppercase tracking-[0.18em] text-white/46">{published}</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-none tracking-tight md:text-7xl">{post.title}</h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-white/68">{post.excerpt}</p>
        </header>
        <div className="mt-12 grid gap-12">{(post.layout || []).map(renderBlock)}</div>
      </article>
    </main>
  );
}

export function NewsListing({ posts, surface = "news" }: { posts: NewsPost[]; surface?: NewsSurface }) {
  const copy = surfaceCopy[surface];

  return (
    <main className="min-h-screen bg-[#0c1018] px-5 py-24 text-white md:px-10">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-[#F26522]">{copy.eyebrow}</p>
        <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none tracking-tight md:text-7xl">{copy.heading}</h1>
        {posts.length > 0 ? (
          <div className="mt-14 grid gap-px overflow-hidden border border-white/12 bg-white/12 md:grid-cols-3">
            {posts.map((post) => {
              const heroUrl = getMediaUrl(post.heroImage);

              return (
                <Link
                  key={post.slug}
                  href={`${copy.backHref}/${post.slug}`}
                  className="group bg-[#101722] transition hover:bg-[#151f2e]"
                >
                  {heroUrl ? (
                    <img src={heroUrl} alt={post.title} className="aspect-[16/10] w-full object-cover opacity-90 transition group-hover:opacity-100" />
                  ) : null}
                  <div className="p-6">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[#F26522]">
                      {surface === "activity" ? "Hoạt động" : "Tin tức"}
                    </p>
                    <h2 className="mt-5 text-2xl font-black leading-tight text-white">{post.title}</h2>
                    <p className="mt-4 line-clamp-4 text-sm leading-6 text-white/62">{post.excerpt}</p>
                    <span className="mt-8 inline-block text-sm font-black uppercase tracking-[0.16em] text-white/70 group-hover:text-[#F26522]">
                      {copy.readLabel}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-14 border border-white/12 bg-[#101722] p-8 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#F26522]">{copy.backLabel}</p>
            <h2 className="mt-4 text-3xl font-black uppercase text-white md:text-5xl">{copy.emptyHeading}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/66">{copy.emptyBody}</p>
          </div>
        )}
      </section>
    </main>
  );
}

export function ActivityListing({ posts }: { posts: NewsPost[] }) {
  return <NewsListing posts={posts} surface="activity" />;
}

export function ActivityArticle({ post }: { post: NewsPost }) {
  return <NewsArticle post={post} surface="activity" />;
}
