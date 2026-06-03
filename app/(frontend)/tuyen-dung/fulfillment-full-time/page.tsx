import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareerDetail } from "@/components/CareersRenderer";
import { getPublishedCareerBySlug } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Tuyển dụng Fulfillment Toàn thời gian - GoBeyond LLC",
  description: "JD chi tiết vị trí Fulfillment Toàn thời gian tại GoBeyond.",
};

export const dynamic = "force-dynamic";

export default async function FulfillmentRoute() {
  const job = await getPublishedCareerBySlug("fulfillment-full-time");

  if (!job) {
    notFound();
  }

  return <CareerDetail job={job} />;
}
