import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SuppressDevWarnings } from "@/components/SuppressDevWarnings";
import { ThemeScript } from "@/components/ThemeScript";
import "./globals.css";

const siteTitle = "GoBeyond - Go Big Or Go Home";
const siteDescription =
  "From Vietnam to the world. GoBeyond is building a global e-commerce powerhouse — 5 million orders by 2030.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gobe.asia";
const linkPreviewImage = "/link-preview.png";
const socialPreviewImage = "/social-preview.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: "GoBeyond",
  icons: {
    icon: [
      {
        url: "/favicon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "GoBeyond",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: linkPreviewImage,
        width: 1200,
        height: 630,
        alt: "GoBeyond logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [socialPreviewImage],
  },
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi" className="dark mdl-js" data-theme="dark" suppressHydrationWarning>
      <body className="text-[#18213d] antialiased">
        <ThemeScript />
        <SuppressDevWarnings />
        {children}
        {/* Film grain nhẹ để nền gradient có chiều sâu hơn. */}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
