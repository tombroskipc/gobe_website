import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareerDetail } from "@/components/CareersRenderer";
import { getPublishedCareerBySlug } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Fulfillment Full-time - GoBeyond LLC",
  description: "Detailed JD for the Fulfillment Full-time role at GoBeyond.",
};

export const dynamic = "force-dynamic";

export default async function FulfillmentRoute() {
  const job = await getPublishedCareerBySlug("fulfillment-full-time");

  if (!job) {
    notFound();
  }

  return <CareerDetail job={job} />;
}
