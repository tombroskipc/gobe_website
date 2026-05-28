import { notFound } from "next/navigation";
import { NewsArticle } from "@/components/NewsRenderer";
import { getPublishedNewsBySlug } from "@/lib/news";

export const dynamic = "force-dynamic";

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  return <NewsArticle post={post} />;
}
