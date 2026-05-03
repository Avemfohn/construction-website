import type { Metadata } from "next";

import { HomeHero } from "@/components/HomeHero";
import { fetchJson, rewriteForBrowser } from "@/lib/api";

type SiteSettingsResponse = {
  hero_video_url: string | null;
};

const DEFAULT_HERO_VIDEO =
  "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4";

export const metadata: Metadata = {
  title: "Ana sayfa",
  description:
    "Ercan İnşaat — 1986'dan bugüne inşaat ve gayrimenkul geliştirme.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const site = await fetchJson<SiteSettingsResponse>("/api/site-settings/");
  const fromBackend = rewriteForBrowser(site?.hero_video_url);
  const fromEnv = process.env.NEXT_PUBLIC_HERO_VIDEO_URL?.trim();
  const heroVideoUrl =
    fromBackend || fromEnv || DEFAULT_HERO_VIDEO;

  return <HomeHero heroVideoUrl={heroVideoUrl} />;
}
