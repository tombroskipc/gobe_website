"use client";

import { RefreshRouteOnSave as PayloadRefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

// Server-side Live Preview helper for Next.js App Router: when an editor saves
// in the admin panel, Payload posts a message that this component listens for,
// then calls router.refresh() to re-render the RSC tree with the new data.
export function RefreshRouteOnSave() {
  const router = useRouter();
  return (
    <PayloadRefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000"}
    />
  );
}
