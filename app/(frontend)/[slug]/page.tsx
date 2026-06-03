import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { ActivityArticle } from "@/components/NewsRenderer";
import { RefreshRouteOnSave } from "@/components/RefreshRouteOnSave";
import { getActivityDraftBySlug, getPublishedActivityBySlug } from "@/lib/news";

export const dynamic = "force-dynamic";

export default async function RootActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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
