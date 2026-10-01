import { permanentRedirect } from "next/navigation";

export default async function LegacyNestedNewsDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/news/${slug}`);
}
