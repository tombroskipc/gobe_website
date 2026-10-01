import { permanentRedirect } from "next/navigation";

export default function LegacyNewsRoute() {
  permanentRedirect("/news");
}
