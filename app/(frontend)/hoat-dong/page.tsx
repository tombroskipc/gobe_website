import { ActivityListing } from "@/components/NewsRenderer";
import { getPublishedActivities } from "@/lib/news";

export default async function ActivitiesPage() {
  const posts = await getPublishedActivities();

  return <ActivityListing posts={posts} />;
}
