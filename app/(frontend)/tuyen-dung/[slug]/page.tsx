import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { CareerDetail } from "@/components/CareersRenderer";
import { getCareerDraftBySlug, getPublishedCareerBySlug } from "@/lib/careers";

export const dynamic = "force-dynamic";

export default async function CareerDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const job = isPreview ? await getCareerDraftBySlug(slug) : await getPublishedCareerBySlug(slug);

  if (!job) {
    notFound();
  }

  return <CareerDetail job={job} />;
}
