import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { NewsArticle } from "@/components/NewsRenderer";
import { RefreshRouteOnSave } from "@/components/RefreshRouteOnSave";
import { getNewsDraftBySlug, getPublishedNewsBySlug } from "@/lib/news";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const post = isPreview ? await getNewsDraftBySlug(slug) : await getPublishedNewsBySlug(slug);

  if (!post) {
    return {
      title: "News - GoBeyond LLC",
      description: "Company updates, milestones, and operational insights from GoBeyond.",
    };
  }

  return {
    title: `${post.title} - GoBeyond News`,
    description: post.excerpt || "Company updates, milestones, and operational insights from GoBeyond.",
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();

  const post = isPreview ? await getNewsDraftBySlug(slug) : await getPublishedNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      {isPreview ? <RefreshRouteOnSave /> : null}
      <NewsArticle post={post} />
    </>
  );
}
