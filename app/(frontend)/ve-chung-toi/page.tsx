import { permanentRedirect } from "next/navigation";

export default function LegacyAboutRoute() {
  permanentRedirect("/about-us");
}
