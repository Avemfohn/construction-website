import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { SiteNav } from "@/components/SiteNav";

import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Construction & Development",
  description: "Premium construction and real estate development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="min-h-screen font-sans">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
