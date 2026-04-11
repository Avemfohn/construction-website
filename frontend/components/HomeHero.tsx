"use client";

import { useEffect, useState } from "react";

/** API’de hero videosu yoksa ve env boşsa kullanılır; ayrıca 404/bozuk dosya yedeği. */
const DEFAULT_HERO_VIDEO =
  "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4";

export function HomeHero({ heroVideoUrl }: { heroVideoUrl: string }) {
  const primary = heroVideoUrl || DEFAULT_HERO_VIDEO;
  const [videoSrc, setVideoSrc] = useState(primary);

  useEffect(() => {
    setVideoSrc(primary);
  }, [primary]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-anthracite-950">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-0 overflow-hidden bg-anthracite-950">
          <video
            key={videoSrc}
            className="h-full min-h-full w-full min-w-full object-cover brightness-[0.66] contrast-[0.96]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%230a1224' width='16' height='9'/%3E%3C/svg%3E"
            onError={() => {
              setVideoSrc((current) =>
                current === DEFAULT_HERO_VIDEO ? current : DEFAULT_HERO_VIDEO,
              );
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-black/55" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/92 via-anthracite-950/78 to-anthracite-950" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(181,130,47,0.07),transparent_52%)]" />
      </div>

      {/* Plain HTML (no Framer initial opacity:0) so text is visible before/without heavy JS — fixes “blank” mobile / throttled DevTools */}
      <div className="hero-enter relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-8 text-center sm:px-6 sm:pt-10">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-gold-400/90">
          Ercan İnşaat
        </p>
        <h1 className="max-w-[min(100%,40rem)] font-display text-3xl font-semibold tracking-tight text-anthracite-50 sm:text-4xl md:text-5xl lg:text-6xl">
          Güven üzerine kuruldu.
          <br />
          <span className="text-gold-300/95">Kalıcılık için tasarlandı.</span>
        </h1>
        <p className="mt-6 max-w-xl px-1 text-sm leading-relaxed text-anthracite-200 sm:text-base">
          Kurucumuz{" "}
          <span className="text-anthracite-100">Ayhan Ercan</span> öncülüğünde
          inşaat ve gayrimenkul geliştirme — sağlam yapı, ölçülülük ve uzun
          vadeli değer.
        </p>
        <div className="mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-12 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
          <a
            href="/projects"
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-gold-500/50 bg-gold-600/10 px-8 py-3 text-sm font-medium text-gold-100 shadow-luxury backdrop-blur-sm transition hover:border-gold-400 hover:bg-gold-500/15 sm:min-h-0"
          >
            Projeler
          </a>
          <a
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center rounded-sm border border-navy-600/80 bg-anthracite-950/40 px-8 py-3 text-sm font-medium text-anthracite-100 transition hover:border-gold-500/40 hover:text-white sm:min-h-0"
          >
            İletişim
          </a>
        </div>
      </div>
    </main>
  );
}
