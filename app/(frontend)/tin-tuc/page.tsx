import type { Metadata } from "next";
import { NewsListing } from "@/components/NewsRenderer";
import { getPublishedNews } from "@/lib/news";

export const metadata: Metadata = {
  title: "News - GoBeyond LLC",
  description: "Company updates, milestones, and operational insights from GoBeyond.",
};

export default async function NewsPage() {
  const posts = await getPublishedNews();

  return <NewsListing posts={posts} />;
}
