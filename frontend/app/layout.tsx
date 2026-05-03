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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://ercaninsaat.com";
const siteName = "Ercan İnşaat";
const defaultTitle = "Ercan İnşaat";
const defaultDescription =
  "Ercan İnşaat — seçkin inşaat ve gayrimenkul geliştirme; kurucu Ayhan Ercan.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s | Ercan İnşaat",
  },
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "180x180" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: "/icon.png",
        width: 180,
        height: 180,
        alt: "Ercan İnşaat logosu",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: defaultTitle,
    description: defaultDescription,
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    sameAs: ["https://www.instagram.com/ayhanerc/"],
  };

  return (
    <html
      lang="tr"
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="min-h-dvh overflow-x-hidden font-sans antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
