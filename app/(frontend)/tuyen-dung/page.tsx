import type { Metadata } from "next";
import { CareersListing } from "@/components/CareersRenderer";
import { careerListingSourceUrl, getPublishedCareers } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Tuyển dụng - GoBeyond LLC",
  description: "Danh sách vị trí tuyển dụng đang mở tại GoBeyond.",
};

export default async function CareersRoute() {
  const jobs = await getPublishedCareers();

  return <CareersListing jobs={jobs} listingSourceUrl={careerListingSourceUrl} />;
}
