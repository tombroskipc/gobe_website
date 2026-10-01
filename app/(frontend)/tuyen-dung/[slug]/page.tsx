import { permanentRedirect } from "next/navigation";

export default async function LegacyCareerDetailRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/careers/${slug}`);
}
