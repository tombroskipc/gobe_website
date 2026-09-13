import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy - GoBeyond",
  description:
    "How GoBeyond collects, uses, shares, protects, retains, and deletes website and Meta Platform Data.",
  alternates: {
    canonical: "/privacy-policy",
  },
  openGraph: {
    type: "website",
    url: "/privacy-policy",
    title: "Privacy Policy - GoBeyond",
    description:
      "How GoBeyond handles website information and Meta Platform Data.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyRoute() {
  return <PrivacyPolicyPage />;
}
