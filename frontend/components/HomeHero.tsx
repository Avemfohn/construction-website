"use client";

import { motion } from "framer-motion";

/** API’de hero videosu yoksa ve env boşsa kullanılır. */
const DEFAULT_HERO_VIDEO =
  "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4";

const easeLux = [0.22, 1, 0.36, 1] as const;

export function HomeHero({ heroVideoUrl }: { heroVideoUrl: string }) {
  const videoSrc = heroVideoUrl || DEFAULT_HERO_VIDEO;

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
            preload="auto"
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%230a1224' width='16' height='9'/%3E%3C/svg%3E"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-black/55" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-950/92 via-anthracite-950/78 to-anthracite-950" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(181,130,47,0.07),transparent_52%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeLux }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-gold-400/90"
        >
          Ercan İnşaat
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: easeLux }}
          className="font-display text-4xl font-semibold tracking-tight text-anthracite-50 sm:text-5xl md:text-6xl"
        >
          Güven üzerine kuruldu.
          <br />
          <span className="text-gold-300/95">Kalıcılık için tasarlandı.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35, ease: easeLux }}
          className="mt-6 max-w-xl text-sm leading-relaxed text-anthracite-200 sm:text-base"
        >
          Kurucumuz{" "}
          <span className="text-anthracite-100">Ayhan Ercan</span> öncülüğünde
          inşaat ve gayrimenkul geliştirme — sağlam yapı, ölçülülük ve uzun
          vadeli değer.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: easeLux }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/projects"
            className="rounded-sm border border-gold-500/50 bg-gold-600/10 px-8 py-3 text-sm font-medium text-gold-100 shadow-luxury backdrop-blur-sm transition hover:border-gold-400 hover:bg-gold-500/15"
          >
            Projeler
          </a>
          <a
            href="/contact"
            className="rounded-sm border border-navy-600/80 bg-anthracite-950/40 px-8 py-3 text-sm font-medium text-anthracite-100 transition hover:border-gold-500/40 hover:text-white"
          >
            İletişim
          </a>
        </motion.div>
      </div>
    </main>
  );
}
