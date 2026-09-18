import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { ActivityArticle } from "@/components/NewsRenderer";
import { RefreshRouteOnSave } from "@/components/RefreshRouteOnSave";
import { getActivityDraftBySlug, getPublishedActivityBySlug } from "@/lib/news";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const post = isPreview ? await getActivityDraftBySlug(slug) : await getPublishedActivityBySlug(slug);

  if (!post) {
    return {
      title: "Activities - GoBeyond LLC",
      description: "Team activities, company events, and culture moments from GoBeyond.",
    };
  }

  return {
    title: `${post.title} - GoBeyond Activities`,
    description: post.excerpt || "Team activities, company events, and culture moments from GoBeyond.",
  };
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();

  const post = isPreview ? await getActivityDraftBySlug(slug) : await getPublishedActivityBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      {isPreview ? <RefreshRouteOnSave /> : null}
      <ActivityArticle post={post} />
    </>
  );
}
