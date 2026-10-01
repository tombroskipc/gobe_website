import { permanentRedirect } from "next/navigation";

export default async function LegacyNewsDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/news/${slug}`);
}
