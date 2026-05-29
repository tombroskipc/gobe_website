import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

// Live Preview entry point. The admin panel loads this URL inside its iframe.
// It validates the secret, enables Next.js Draft Mode (sets a cookie), then
// redirects to the post page, which then renders draft content.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");

  if (secret !== process.env.PAYLOAD_SECRET) {
    return new Response("Invalid preview secret.", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(`/tin-tuc/${slug || ""}`);
}
