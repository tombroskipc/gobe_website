import { draftMode } from "next/headers";
import { notFound, permanentRedirect } from "next/navigation";
import { getActivityDraftBySlug, getPublishedActivityBySlug } from "@/lib/news";

export const dynamic = "force-dynamic";

export default async function LegacyRootActivityRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const post = isPreview ? await getActivityDraftBySlug(slug) : await getPublishedActivityBySlug(slug);

  if (!post) {
    notFound();
  }

  permanentRedirect(`/activities/${slug}`);
}
