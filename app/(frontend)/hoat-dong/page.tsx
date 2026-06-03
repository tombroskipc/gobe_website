import { ActivityListing } from "@/components/NewsRenderer";
import { getPublishedActivities } from "@/lib/news";

export const dynamic = "force-dynamic";

export default async function ActivitiesPage() {
  const posts = await getPublishedActivities();

  return <ActivityListing posts={posts} />;
}
