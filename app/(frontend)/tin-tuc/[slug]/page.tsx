import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { NewsArticle } from "@/components/NewsRenderer";
import { RefreshRouteOnSave } from "@/components/RefreshRouteOnSave";
import { getNewsDraftBySlug, getPublishedNewsBySlug } from "@/lib/news";

export const dynamic = "force-dynamic";

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
