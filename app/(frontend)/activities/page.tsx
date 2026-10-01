import type { Metadata } from "next";
import { ActivityListing } from "@/components/NewsRenderer";
import { getPublishedActivities } from "@/lib/news";

export const metadata: Metadata = {
  title: "Activities - GoBeyond LLC",
  description: "Team activities, company events, and culture moments from GoBeyond.",
};

export default async function ActivitiesPage() {
  const posts = await getPublishedActivities();

  return <ActivityListing posts={posts} />;
}
