import type { Metadata } from "next";
import { CareersListing } from "@/components/CareersRenderer";
import { careerListingSourceUrl, getPublishedCareers } from "@/lib/careers";

export const metadata: Metadata = {
  title: "Careers - GoBeyond LLC",
  description: "Open roles at GoBeyond.",
};

export default async function CareersRoute() {
  const jobs = await getPublishedCareers();

  return <CareersListing jobs={jobs} listingSourceUrl={careerListingSourceUrl} />;
}
