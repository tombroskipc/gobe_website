import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import { SuppressDevWarnings } from "@/components/SuppressDevWarnings";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

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
    <html lang="en" className={`dark ${display.variable} ${body.variable}`}>
      <body className="text-[#18213d] antialiased">
        <SuppressDevWarnings />
        {children}
        {/* Cinematic film grain — makes the gradients read as shot, not CSS-generated. */}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}
