"use client";

import { motion } from "framer-motion";

/** Used only if the API has no hero video and env is unset. */
const DEFAULT_HERO_VIDEO =
  "https://videos.pexels.com/video-files/3045163/3045163-hd_1920_1080_30fps.mp4";

export function HomeHero({ heroVideoUrl }: { heroVideoUrl: string }) {
  const videoSrc = heroVideoUrl || DEFAULT_HERO_VIDEO;

  return (
    <main className="relative min-h-screen overflow-hidden bg-anthracite-950">
      <div className="absolute inset-0" aria-hidden>
        <video
          key={videoSrc}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect fill='%230f1930' width='16' height='9'/%3E%3C/svg%3E"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-anthracite-950/75 to-anthracite-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(181,130,47,0.12),transparent_50%)]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-gold-400/90"
        >
          Construction &amp; Development
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl font-semibold tracking-tight text-anthracite-50 sm:text-5xl md:text-6xl"
        >
          Built on trust.
          <br />
          <span className="text-gold-300/95">Designed to endure.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-6 max-w-xl text-sm leading-relaxed text-anthracite-200 sm:text-base"
        >
          Premium construction and urban development — structure, discretion,
          and long-term value.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="/projects"
            className="rounded-sm border border-gold-500/50 bg-gold-600/10 px-8 py-3 text-sm font-medium text-gold-100 shadow-luxury backdrop-blur-sm transition hover:border-gold-400 hover:bg-gold-500/15"
          >
            Projects
          </a>
          <a
            href="/contact"
            className="rounded-sm border border-navy-600/80 bg-anthracite-950/40 px-8 py-3 text-sm font-medium text-anthracite-100 transition hover:border-gold-500/40 hover:text-white"
          >
            Contact
          </a>
        </motion.div>
      </div>
    </main>
  );
}
