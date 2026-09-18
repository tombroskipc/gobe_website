import type { Metadata } from "next";
import { AboutPage } from "@/components/AboutPage";

export const metadata: Metadata = {
  title: "About Us - GoBeyond LLC",
  description:
    "Learn about GoBeyond, our milestones, vision, mission, and partner ecosystem.",
};

export default function AboutRoute() {
  return <AboutPage />;
}
