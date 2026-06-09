import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SuppressDevWarnings } from "@/components/SuppressDevWarnings";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoBeyond - Go Big Or Go Home",
  description:
    "From Vietnam to the world. GoBeyond is building a global e-commerce powerhouse — 5 million orders by 2030.",
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
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="vi" className="dark mdl-js" suppressHydrationWarning>
      <body className="text-[#18213d] antialiased">
        <SuppressDevWarnings />
        {children}
        {/* Film grain nhẹ để nền gradient có chiều sâu hơn. */}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
