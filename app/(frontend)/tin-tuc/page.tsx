import { NewsListing } from "@/components/NewsRenderer";
import { getPublishedNews } from "@/lib/news";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const posts = await getPublishedNews();

  return <NewsListing posts={posts} />;
}
