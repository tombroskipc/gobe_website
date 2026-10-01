import { permanentRedirect } from "next/navigation";

export default function LegacyNestedNewsRoute() {
  permanentRedirect("/news");
}
