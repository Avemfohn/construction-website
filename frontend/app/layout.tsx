import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { SiteNav } from "@/components/SiteNav";

import "./globals.css";

const display = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ercan İnşaat",
  description:
    "Ercan İnşaat — seçkin inşaat ve gayrimenkul geliştirme; kurucu Ayhan Ercan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="min-h-screen font-sans">
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
