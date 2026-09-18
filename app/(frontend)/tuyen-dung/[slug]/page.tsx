import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { CareerDetail } from "@/components/CareersRenderer";
import { getCareerDraftBySlug, getPublishedCareerBySlug } from "@/lib/careers";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const job = isPreview ? await getCareerDraftBySlug(slug) : await getPublishedCareerBySlug(slug);

  if (!job) {
    return {
      title: "Career role - GoBeyond LLC",
      description: "Open roles at GoBeyond.",
    };
  }

  return {
    title: `${job.title} - GoBeyond Careers`,
    description: job.excerpt || `Apply for the ${job.title} role at GoBeyond.`,
  };
}

export default async function CareerDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: isPreview } = await draftMode();
  const job = isPreview ? await getCareerDraftBySlug(slug) : await getPublishedCareerBySlug(slug);

  if (!job) {
    notFound();
  }

  return <CareerDetail job={job} />;
}
