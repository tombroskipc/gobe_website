import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SuppressDevWarnings } from "@/components/SuppressDevWarnings";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoBeyond LLC - Go Global or Go Home",
  description:
    "Premium immersive 3D global tech hub concept for Gobeyond LLC and gobe.asia.",
};

export default function FrontendLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="dark mdl-js" suppressHydrationWarning>
      <body className="text-[#18213d] antialiased">
        <SuppressDevWarnings />
        {children}
      </body>
    </html>
  );
}
